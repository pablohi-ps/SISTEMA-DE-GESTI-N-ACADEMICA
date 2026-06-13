import express from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get Student Grades
router.get('/grades', authenticateToken, (req, res) => {
  db.all('SELECT * FROM grades WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get Student Invoices
router.get('/finance', authenticateToken, (req, res) => {
  db.all('SELECT * FROM invoices WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Pay Invoice
router.post('/pay-invoice', authenticateToken, (req, res) => {
  const { invoice_id } = req.body;
  db.run('UPDATE invoices SET status = "Pagado" WHERE id = ? AND user_id = ?', [invoice_id, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Submit Evaluation
router.post('/evaluate', authenticateToken, (req, res) => {
  const { teacher_id, subject, rating, pedagogy, punctuality, comments } = req.body;
  db.run('INSERT INTO evaluations (student_id, teacher_id, subject, rating, pedagogy, punctuality, comments) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, teacher_id, subject, rating, pedagogy || rating, punctuality || rating, comments],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Get Student Enrolled Subjects
router.get('/subjects', authenticateToken, (req, res) => {
  const sql = `
    SELECT s.*, u.name as teacher_name 
    FROM subjects s 
    LEFT JOIN users u ON s.teacher_id = u.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const formatted = rows.map((s, idx) => ({
      id: s.id,
      name: s.name,
      teacher: s.teacher_name || "Docente Principal",
      code: s.code,
      active: true,
      progress: [75, 40, 92, 15][idx % 4],
      materials: [12, 15, 20, 5][idx % 4],
      recordings: [8, 5, 14, 2][idx % 4]
    }));
    res.json(formatted);
  });
});

// Get Student Subject Detail
router.get('/subjects/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT s.*, u.name as teacher_name 
    FROM subjects s 
    LEFT JOIN users u ON s.teacher_id = u.id
    WHERE s.id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Subject not found' });
    res.json({
      id: row.id,
      name: row.name,
      teacher: row.teacher_name || "Docente Principal",
      code: row.code,
      active: true,
      progress: 75,
      materials: 12,
      recordings: 8
    });
  });
});

// Get Classroom Posts
router.get('/classroom/posts/:subject_id', authenticateToken, (req, res) => {
  const { subject_id } = req.params;
  db.all('SELECT * FROM classroom_posts WHERE subject_id = ? ORDER BY created_at DESC', [subject_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Create Classroom Post
router.post('/classroom/posts', authenticateToken, (req, res) => {
  const { subject_id, content, file_url } = req.body;
  db.run('INSERT INTO classroom_posts (subject_id, author_id, author_name, author_role, content, file_url) VALUES (?, ?, ?, ?, ?, ?)',
    [subject_id, req.user.id, req.user.name, req.user.role, content, file_url],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// GET /api/student/tutoring - Fetch student's tutoring requests
router.get('/tutoring', authenticateToken, (req, res) => {
  db.all('SELECT * FROM tutorings WHERE student_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/student/tutoring - Request a tutoring session
router.post('/tutoring', authenticateToken, (req, res) => {
  const { subject, teacher, date, time, type } = req.body;
  db.run('INSERT INTO tutorings (student_id, subject, teacher, date, time, status, type, link) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, subject, teacher, date, time, 'Pendiente', type, ''],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// DELETE /api/student/tutoring/:id - Cancel a tutoring request
router.delete('/tutoring/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tutorings WHERE id = ? AND student_id = ?', [id, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// GET /api/student/library - Get all library resources
router.get('/library', authenticateToken, (req, res) => {
  db.all('SELECT * FROM library_resources', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/student/library/download/:id - Increment download counter
router.post('/library/download/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.run('UPDATE library_resources SET downloads = downloads + 1 WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// POST /api/student/library/reserve - Reserve library resource
router.post('/library/reserve', authenticateToken, (req, res) => {
  const { resource_id } = req.body;
  db.run('INSERT INTO library_reservations (student_id, resource_id, status) VALUES (?, ?, ?)',
    [req.user.id, resource_id, 'Confirmado'],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// GET /api/student/observations - Fetch behavioral observations for student
router.get('/observations', authenticateToken, (req, res) => {
  db.all('SELECT * FROM student_observations WHERE student_id = ? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/student/schedule - Fetch student schedule
router.get('/schedule', authenticateToken, (req, res) => {
  const sql = `
    SELECT id, student_id, day, start_time as start, end_time as end, 
           subject_name as subject, room, teacher_name as teacher, color 
    FROM schedule 
    WHERE student_id = ?
  `;
  db.all(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/student/classroom/assignments/:subject_id
router.get('/classroom/assignments/:subject_id', authenticateToken, (req, res) => {
  const { subject_id } = req.params;
  db.all('SELECT * FROM assignments WHERE subject_id = ?', [subject_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

export default router;
