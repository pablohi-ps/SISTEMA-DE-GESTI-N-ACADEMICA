import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { db, verifyPassword, hashPassword } from './db.js';

import teacherRouter from './routes/teacher.js';
import studentRouter from './routes/student.js';
import { authenticateToken } from './middleware/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = 'novaedu_super_secret_key_2026';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/teacher', teacherRouter);
app.use('/api/student', studentRouter);

// --- Initialize Compliance Settings Table ---
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS compliance_settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )`, (err) => {
    if (err) {
      console.error("Error creating compliance_settings table:", err.message);
    } else {
      // Seed default settings if empty
      db.get("SELECT COUNT(*) as count FROM compliance_settings", (err, row) => {
        if (!err && row && row.count === 0) {
          const stmt = db.prepare("INSERT OR REPLACE INTO compliance_settings (key, value) VALUES (?, ?)");
          stmt.run("mfa_enabled", "false");
          stmt.run("password_strength", "Medium");
          stmt.run("session_timeout", "30");
          stmt.run("db_encryption", "Active");
          stmt.run("failed_attempts_limit", "5");
          stmt.finalize();
        }
      });
    }
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// --- Audit Logger ---
const logAudit = (userId, action, details) => {
  db.run('INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)', [userId, action, details], (err) => {
    if (err) console.error("Error logging audit:", err.message);
  });
};

// --- API ROUTES ---

// Login Endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  // 1. Check if user is locked
  db.get('SELECT * FROM login_failures WHERE username = ?', [username], (err, lockInfo) => {
    if (err) return res.status(500).json({ error: err.message });

    if (lockInfo && lockInfo.locked_until) {
      const lockTime = new Date(lockInfo.locked_until);
      if (lockTime > new Date()) {
        const remainingMinutes = Math.ceil((lockTime - new Date()) / 60000);
        return res.status(403).json({
          success: false,
          message: `Cuenta bloqueada temporalmente. Inténtalo de nuevo en ${remainingMinutes} minutos.`
        });
      }
    }

    // 2. Fetch compliance setting for failed attempts limit
    db.get("SELECT value FROM compliance_settings WHERE key = 'failed_attempts_limit'", (err, settingRow) => {
      const limit = settingRow ? parseInt(settingRow.value, 10) : 5;

      // 3. Get user details
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });

        if (user && verifyPassword(password, user.password)) {
          // Success! Reset failures
          db.run('INSERT OR REPLACE INTO login_failures (username, count, locked_until) VALUES (?, 0, NULL)', [username]);
          
          logAudit(user.id, 'LOGIN', `Inicio de sesión exitoso desde rol: ${user.role}`);
          
          const { password: _password, ...userWithoutPassword } = user;
          const token = jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: '8h' });
          
          res.json({ success: true, token, user: userWithoutPassword });
        } else {
          // Failure! Increment count
          const currentCount = lockInfo ? lockInfo.count + 1 : 1;
          let lockedUntil = null;
          
          if (currentCount >= limit) {
            const date = new Date();
            date.setMinutes(date.getMinutes() + 15); // Lock for 15 mins
            lockedUntil = date.toISOString();
            logAudit(user ? user.id : username, 'LOCKOUT', `Cuenta bloqueada temporalmente por ${limit} intentos fallidos.`);
          }
          
          db.run('INSERT OR REPLACE INTO login_failures (username, count, locked_until) VALUES (?, ?, ?)',
            [username, currentCount, lockedUntil],
            (err) => {
              if (err) return res.status(500).json({ error: err.message });
              
              if (currentCount >= limit) {
                res.status(403).json({
                  success: false,
                  message: `Excediste el límite de ${limit} intentos. Cuenta bloqueada por 15 minutos.`
                });
              } else {
                res.status(401).json({
                  success: false,
                  message: `Credenciales incorrectas. Intentos fallidos: ${currentCount}/${limit}`
                });
              }
            }
          );
        }
      });
    });
  });
});

// Get Modules based on user role
app.get('/api/modules', authenticateToken, (req, res) => {
  const userRole = req.user.role;
  
  db.all('SELECT * FROM modules WHERE role_access = ? OR role_access = "all"', [userRole], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Admin Stats
app.get('/api/admin/stats', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });

  // Mocking stats for now, but returning from the backend
  res.json({
    revenue: [
      { name: 'Ene', ingresos: 4000 }, { name: 'Feb', ingresos: 3000 },
      { name: 'Mar', ingresos: 2000 }, { name: 'Abr', ingresos: 2780 }
    ],
    enrollments: [
      { name: 'Sistemas', matriculados: 400 }, { name: 'Medicina', matriculados: 300 }
    ],
    activeStudents: 1200,
    professors: 85,
    monthlyRevenue: 34900
  });
});

// Get all users
app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });

  db.all('SELECT id, username, name, role, campus FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Simulate status and date for frontend display
    const formattedRows = rows.map(r => ({
      ...r,
      status: 'Activo',
      date: new Date().toISOString().split('T')[0]
    }));
    res.json(formattedRows);
  });
});

// Create new user
app.post('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  
  const { username, password, name, role, campus } = req.body;
  const id = `usr_${Math.floor(Math.random() * 10000)}`;
  const hashedPassword = hashPassword(password);

  db.run('INSERT INTO users (id, username, password, name, role, campus) VALUES (?, ?, ?, ?, ?, ?)',
    [id, username, hashedPassword, name, role, campus],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      logAudit(req.user.id, 'CREATE_USER', `Usuario creado: ${username} (${role})`);
      res.json({ success: true, id });
    }
  );
});

// Delete user
app.delete('/api/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  
  const { id } = req.params;
  db.run('DELETE FROM users WHERE id = ?', id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    logAudit(req.user.id, 'DELETE_USER', `Usuario eliminado ID: ${id}`);
    res.json({ success: true });
  });
});

// Get audit logs
app.get('/api/admin/audit', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  
  db.all(`
    SELECT a.id, a.action, a.details, a.timestamp, u.name as user_name 
    FROM audit_logs a 
    LEFT JOIN users u ON a.user_id = u.id 
    ORDER BY a.timestamp DESC LIMIT 50
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Compliance endpoints
app.get('/api/admin/compliance/settings', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  db.all('SELECT * FROM compliance_settings', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const settings = {};
    rows.forEach(r => {
      settings[r.key] = r.value;
    });
    res.json(settings);
  });
});

app.post('/api/admin/compliance/settings', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  const { mfa_enabled, password_strength, session_timeout, db_encryption, failed_attempts_limit } = req.body;
  
  db.serialize(() => {
    let errorOccurred = null;
    
    db.run("BEGIN TRANSACTION");
    if (mfa_enabled !== undefined) {
      db.run("INSERT OR REPLACE INTO compliance_settings (key, value) VALUES (?, ?)", ["mfa_enabled", String(mfa_enabled)], (err) => { if (err) errorOccurred = err; });
    }
    if (password_strength !== undefined) {
      db.run("INSERT OR REPLACE INTO compliance_settings (key, value) VALUES (?, ?)", ["password_strength", String(password_strength)], (err) => { if (err) errorOccurred = err; });
    }
    if (session_timeout !== undefined) {
      db.run("INSERT OR REPLACE INTO compliance_settings (key, value) VALUES (?, ?)", ["session_timeout", String(session_timeout)], (err) => { if (err) errorOccurred = err; });
    }
    if (db_encryption !== undefined) {
      db.run("INSERT OR REPLACE INTO compliance_settings (key, value) VALUES (?, ?)", ["db_encryption", String(db_encryption)], (err) => { if (err) errorOccurred = err; });
    }
    if (failed_attempts_limit !== undefined) {
      db.run("INSERT OR REPLACE INTO compliance_settings (key, value) VALUES (?, ?)", ["failed_attempts_limit", String(failed_attempts_limit)], (err) => { if (err) errorOccurred = err; });
    }
    
    db.run("COMMIT", (err) => {
      const finalErr = errorOccurred || err;
      if (finalErr) {
        db.run("ROLLBACK");
        return res.status(500).json({ error: finalErr.message });
      }
      logAudit(req.user.id, 'COMPLIANCE_UPDATE', `Políticas de seguridad actualizadas: MFA=${mfa_enabled}, Fuerza=${password_strength}, Timeout=${session_timeout}`);
      res.json({ success: true });
    });
  });
});

app.get('/api/admin/compliance/stats', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  
  const cpuUsage = Math.floor(Math.random() * 15) + 5; // 5% to 20%
  const memoryUsage = Math.floor(Math.random() * 10) + 40; // 40% to 50%
  const responseTime = Math.floor(Math.random() * 40) + 120; // 120ms to 160ms
  
  const assets = [
    { name: 'Vite Development Server', version: 'v8.0.9', license: 'MIT', status: 'Compliant' },
    { name: 'React UI Library', version: 'v19.2.5', license: 'MIT', status: 'Compliant' },
    { name: 'Express Backend API', version: 'v4.19.2', license: 'MIT', status: 'Compliant' },
    { name: 'SQLite3 Database Engine', version: 'v5.1.7', license: 'BSD-3-Clause', status: 'Compliant' },
    { name: 'NodeJS Runtime Environment', version: 'v20.x', license: 'MIT', status: 'Compliant' }
  ];

  res.json({
    uptime: process.uptime(),
    cpuUsage,
    memoryUsage,
    responseTime,
    assets,
    backupStatus: 'Copia de seguridad semanal - Completada con éxito (Hace 2 días)',
    backupHealth: '100%',
    securityScore: 94,
    failedAttempts: 2
  });
});

// Admin Financial Reports Summary
app.get('/api/admin/financial-reports', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  
  db.all('SELECT amount, status, due_date FROM invoices', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    let total = 0;
    let pending = 0;
    let overdue = 0;
    
    rows.forEach(r => {
      if (r.status === 'Pagado') total += r.amount;
      if (r.status === 'Pendiente') pending += r.amount;
      if (r.status === 'Atrasado') overdue += r.amount;
    });

    // Mock history grouping by month
    const history = [
      { name: 'Ene', pagado: total * 0.4, pendiente: 0 },
      { name: 'Feb', pagado: total * 0.3, pendiente: 0 },
      { name: 'Mar', pagado: total * 0.2, pendiente: pending * 0.2 },
      { name: 'Abr', pagado: total * 0.1, pendiente: pending * 0.8 }
    ];

    res.json({ total, pending, overdue, history });
  });
});

// Teacher Endpoints
app.get('/api/teacher/students', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Acceso denegado' });
  db.all('SELECT id, username, name FROM users WHERE role = "student"', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/teacher/grades', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Acceso denegado' });
  const { user_id, subject, grade, credits, status } = req.body;
  
  db.run('INSERT INTO grades (user_id, subject, grade, credits, status) VALUES (?, ?, ?, ?, ?)',
    [user_id, subject, grade, credits, status],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      logAudit(req.user.id, 'GRADE_UPDATE', `Calificación ${grade} asignada a ${user_id} en ${subject}`);
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.post('/api/teacher/attendance', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Acceso denegado' });
  const { records, date } = req.body; // records: [{user_id, status}]
  
  const stmt = db.prepare('INSERT INTO attendance (user_id, date, status) VALUES (?, ?, ?)');
  records.forEach(r => stmt.run([r.user_id, date, r.status]));
  stmt.finalize((err) => {
    if (err) return res.status(500).json({ error: err.message });
    logAudit(req.user.id, 'ATTENDANCE', `Asistencia registrada para el día ${date}`);
    res.json({ success: true });
  });
});

// GET /api/messages - Fetch all user's messages
app.get('/api/messages', authenticateToken, (req, res) => {
  db.all(`
    SELECT * FROM messages 
    WHERE sender_id = ? OR receiver_id = ? 
    ORDER BY timestamp ASC
  `, [req.user.id, req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/messages - Send a message
app.post('/api/messages', authenticateToken, (req, res) => {
  const { receiver_id, receiver_name, subject, content } = req.body;
  db.run(`
    INSERT INTO messages (sender_id, receiver_id, sender_name, receiver_name, subject, content, is_read) 
    VALUES (?, ?, ?, ?, ?, ?, 0)
  `, [req.user.id, receiver_id, req.user.name, receiver_name, subject, content], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    logAudit(req.user.id, 'SEND_MESSAGE', `Mensaje enviado a ${receiver_name} (${receiver_id})`);
    res.json({ success: true, id: this.lastID });
  });
});

// PUT /api/messages/:id/read - Mark message as read
app.put('/api/messages/:id/read', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.run('UPDATE messages SET is_read = 1 WHERE id = ? AND receiver_id = ?', [id, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// GET /api/contacts - Fetch user directory for messaging
app.get('/api/contacts', authenticateToken, (req, res) => {
  db.all('SELECT id, name, role FROM users WHERE id != ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Serve static files from Vite build output folder in production
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// For all other routes, send back index.html for React Router's SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  🚀 NovaEdu Backend API v4.2.0`);
  console.log(`  📡 Running on http://localhost:${PORT}`);
  console.log(`  💾 Database: SQLite (novaedu.db)`);
  console.log(`  🔑 JWT Secret: configured`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});
