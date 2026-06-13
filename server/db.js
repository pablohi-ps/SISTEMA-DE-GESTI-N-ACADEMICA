import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import crypto from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'novaedu.db');

// Hash password with SHA-256 and unique salt
export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return `${salt}:${hash}`;
};

// Verify hashed password
export const verifyPassword = (password, storedPassword) => {
  const parts = storedPassword.split(':');
  if (parts.length !== 2) return false;
  const [salt, originalHash] = parts;
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return hash === originalHash;
};

// Connect to SQLite Database
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Check if the users table exists. If not, seed the database automatically.
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
      if (err) {
        console.error('Error checking for users table:', err.message);
      } else if (!row) {
        console.log('Tabla "users" no encontrada. Inicializando y poblando la base de datos automáticamente...');
        seedDatabase();
      } else {
        console.log('Base de datos ya inicializada con tablas.');
      }
    });
  }
});

// Seed data function (runs only if called directly via `node db.js`)
const seedDatabase = () => {
  console.log('Inicializando base de datos...');

  db.serialize(() => {
    // Drop existing tables for fresh seed
    db.run('DROP TABLE IF EXISTS users');
    db.run('DROP TABLE IF EXISTS modules');
    db.run('DROP TABLE IF EXISTS recent_activity');
    db.run('DROP TABLE IF EXISTS audit_logs');
    db.run('DROP TABLE IF EXISTS grades');
    db.run('DROP TABLE IF EXISTS invoices');
    db.run('DROP TABLE IF EXISTS attendance');
    db.run('DROP TABLE IF EXISTS subjects');
    db.run('DROP TABLE IF EXISTS assignments');
    db.run('DROP TABLE IF EXISTS exams');
    db.run('DROP TABLE IF EXISTS submissions');
    db.run('DROP TABLE IF EXISTS comments');
    db.run('DROP TABLE IF EXISTS forums');
    db.run('DROP TABLE IF EXISTS forum_threads');
    db.run('DROP TABLE IF EXISTS forum_posts');
    db.run('DROP TABLE IF EXISTS evaluations');
    db.run('DROP TABLE IF EXISTS classroom_posts');
    db.run('DROP TABLE IF EXISTS tutorings');
    db.run('DROP TABLE IF EXISTS library_resources');
    db.run('DROP TABLE IF EXISTS library_reservations');
    db.run('DROP TABLE IF EXISTS messages');
    db.run('DROP TABLE IF EXISTS student_observations');
    db.run('DROP TABLE IF EXISTS login_failures');
    db.run('DROP TABLE IF EXISTS schedule');

    // Create Audit Logs Table
    db.run(`CREATE TABLE audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      action TEXT,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create Users Table
    db.run(`CREATE TABLE users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT,
      name TEXT,
      role TEXT,
      campus TEXT
    )`);

    // Insert Default Users
    const stmtUsers = db.prepare("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)");
    stmtUsers.run('adm_999', 'admin', hashPassword('admin'), 'Director General', 'admin', 'Sede Central');
    stmtUsers.run('usr_123', 'estudiante', hashPassword('estudiante'), 'Estudiante Demo', 'student', 'Campus Principal');
    stmtUsers.run('usr_789', 'profesor', hashPassword('profesor'), 'Dr. Roberto Casas', 'teacher', 'Campus Principal');
    stmtUsers.finalize();

    // Create Login Failures Table
    db.run(`CREATE TABLE login_failures (
      username TEXT PRIMARY KEY,
      count INTEGER DEFAULT 0,
      locked_until DATETIME
    )`);

    // Create Schedule Table
    db.run(`CREATE TABLE schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT,
      day TEXT,
      start_time TEXT,
      end_time TEXT,
      subject_name TEXT,
      room TEXT,
      teacher_name TEXT,
      color TEXT
    )`);

    // Create Modules Table
    db.run(`CREATE TABLE modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      icon TEXT,
      category TEXT,
      role_access TEXT
    )`);

    // Insert Modules
    const stmtModules = db.prepare("INSERT INTO modules (title, description, icon, category, role_access) VALUES (?, ?, ?, ?, ?)");
    const modulesData = [
      ["SGA ESTUDIANTES", "Sistema de Gestión Académica", "GraduationCap", "estudiantes", "student"],
      ["TUTORIAS ACADEMICAS", "Gestión de tutorías", "BookOpen", "estudiantes", "student"],
      ["SISTEMA FINANCIERO", "Gestión de pagos y finanzas", "CircleDollarSign", "estudiantes", "student"],
      ["EVALUACION DOCENTE", "Evaluación de profesores", "FileSignature", "estudiantes", "student"],
      ["PRACTICAS ESTUDIANTILES", "Gestión de prácticas", "Briefcase", "estudiantes", "student"],
      ["AULAS VIRTUALES", "Entorno virtual de aprendizaje", "Library", "estudiantes", "student"],
      ["WEBMAIL", "Centro de mensajería y correo", "Mail", "estudiantes", "student"],
      ["Gestión de Aula Virtual", "LMS y Recursos", "LibraryBig", "docentes", "teacher"],
      ["Registro de Calificaciones", "Ingreso de notas", "BookOpen", "docentes", "teacher"],
      ["Control de Asistencia", "Gestión de asistencia diaria", "CalendarCheck", "docentes", "teacher"],
      ["Panel Docente", "Gestión Integral de Clases", "LayoutDashboard", "docentes", "teacher"],
      ["Configuración Global", "Ajustes del sistema", "Settings", "admin", "admin"],
      ["Reportes Financieros", "Reportes de ingresos", "TrendingUp", "admin", "admin"]
    ];
    modulesData.forEach(mod => stmtModules.run(mod));
    stmtModules.finalize();

    // Create Grades Table
    db.run(`CREATE TABLE grades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      subject TEXT,
      grade REAL,
      credits INTEGER,
      status TEXT
    )`);

    const stmtGrades = db.prepare("INSERT INTO grades (user_id, subject, grade, credits, status) VALUES (?, ?, ?, ?, ?)");
    const gradesData = [
      ['usr_123', 'Ingeniería de Software II', 9.5, 4, 'Aprobado'],
      ['usr_123', 'Bases de Datos Avanzadas', 8.0, 3, 'Aprobado'],
      ['usr_123', 'Inteligencia Artificial', 6.5, 4, 'En Curso'],
      ['usr_123', 'Ética Profesional', 10.0, 2, 'Aprobado']
    ];
    gradesData.forEach(g => stmtGrades.run(g));
    stmtGrades.finalize();

    // Create Invoices Table
    db.run(`CREATE TABLE invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      concept TEXT,
      amount REAL,
      due_date TEXT,
      status TEXT
    )`);

    const stmtInvoices = db.prepare("INSERT INTO invoices (user_id, concept, amount, due_date, status) VALUES (?, ?, ?, ?, ?)");
    const invoicesData = [
      ['usr_123', 'Matrícula Semestre 1', 250.00, '2026-01-15', 'Pagado'],
      ['usr_123', 'Pensión Abril', 150.00, '2026-04-05', 'Pagado'],
      ['usr_123', 'Pensión Mayo', 150.00, '2026-05-05', 'Pendiente'],
      ['usr_123', 'Material de Laboratorio', 45.00, '2026-03-20', 'Atrasado']
    ];
    invoicesData.forEach(inv => stmtInvoices.run(inv));
    stmtInvoices.finalize();

    // Create Attendance Table
    db.run(`CREATE TABLE attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      date TEXT,
      status TEXT
    )`);

    // ---------- New LMS Tables for Teachers ----------
    db.run(`CREATE TABLE subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      code TEXT,
      teacher_id TEXT,
      syllabus_url TEXT
    )`);
    db.run(`CREATE TABLE assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER,
      title TEXT,
      description TEXT,
      due_date TEXT,
      file_url TEXT
    )`);
    db.run(`CREATE TABLE exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER,
      title TEXT,
      description TEXT,
      date TEXT
    )`);
    db.run(`CREATE TABLE submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assignment_id INTEGER,
      student_id TEXT,
      content TEXT,
      submitted_at TEXT,
      file_url TEXT
    )`);
    db.run(`CREATE TABLE comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id INTEGER,
      teacher_id TEXT,
      comment TEXT,
      grade REAL,
      created_at TEXT
    )`);
    db.run(`CREATE TABLE forums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER,
      teacher_id TEXT,
      title TEXT,
      description TEXT
    )`);
    db.run(`CREATE TABLE forum_threads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      forum_id INTEGER,
      title TEXT,
      created_by TEXT,
      created_at TEXT
    )`);
    db.run(`CREATE TABLE forum_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      thread_id INTEGER,
      author_id TEXT,
      content TEXT,
      created_at TEXT
    )`);
    db.run(`CREATE TABLE evaluations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT,
      teacher_id TEXT,
      subject TEXT,
      rating INTEGER,
      pedagogy INTEGER,
      punctuality INTEGER,
      comments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE classroom_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER,
      author_id TEXT,
      author_name TEXT,
      author_role TEXT,
      content TEXT,
      file_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create Tutorings Table
    db.run(`CREATE TABLE tutorings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT,
      subject TEXT,
      teacher TEXT,
      date TEXT,
      time TEXT,
      status TEXT,
      type TEXT,
      link TEXT
    )`);

    // Create Library Resources Table
    db.run(`CREATE TABLE library_resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      category TEXT,
      type TEXT,
      size TEXT,
      downloads INTEGER,
      date TEXT,
      subject TEXT,
      color TEXT
    )`);

    // Create Library Reservations Table
    db.run(`CREATE TABLE library_reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT,
      resource_id INTEGER,
      reserved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT
    )`);

    // Create Messages Table
    db.run(`CREATE TABLE messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id TEXT,
      receiver_id TEXT,
      sender_name TEXT,
      receiver_name TEXT,
      subject TEXT,
      content TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_read INTEGER DEFAULT 0
    )`);

    // Create Student Observations Table
    db.run(`CREATE TABLE student_observations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT,
      teacher_id TEXT,
      teacher_name TEXT,
      type TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed sample data for teacher LMS
    const stmtSubjects = db.prepare("INSERT INTO subjects (name, code, teacher_id) VALUES (?, ?, ?)");
    stmtSubjects.run('Ingeniería de Software II', 'SOFT-202', 'usr_789');
    stmtSubjects.run('Inteligencia Artificial', 'IA-303', 'usr_789');
    stmtSubjects.run('Bases de Datos Avanzadas', 'DB-404', 'usr_789');
    stmtSubjects.run('Ética Profesional', 'ETI-101', 'usr_789');
    stmtSubjects.finalize();

    // Seed classroom posts
    const stmtClassroom = db.prepare("INSERT INTO classroom_posts (subject_id, author_id, author_name, author_role, content) VALUES (?, ?, ?, ?, ?)");
    stmtClassroom.run(1, 'usr_789', 'Dr. Roberto Casas', 'teacher', 'Bienvenidos al curso de Ingeniería de Software II. En esta aula compartiremos diapositivas, proyectos y anuncios del semestre.\n\nRecuerden revisar el sílabo adjunto en la pestaña de Recursos.');
    stmtClassroom.run(1, 'adm_999', 'Director General', 'admin', 'Estimados alumnos y docentes, les recordamos que el uso de la plataforma virtual NovaEdu es obligatorio para el registro de entregas académicos. Que tengan un excelente ciclo.');
    stmtClassroom.run(2, 'usr_789', 'Dr. Roberto Casas', 'teacher', 'Hola a todos. Para la clase de Inteligencia Artificial del próximo lunes, favor leer sobre Redes Neuronales Artificiales. He subido una lectura en PDF.');
    stmtClassroom.run(3, 'usr_789', 'Dr. Roberto Casas', 'teacher', 'Bienvenidos a Bases de Datos Avanzadas. El proyecto final consistirá en diseñar un clúster de base de datos distribuida.');
    stmtClassroom.finalize();

    const stmtAssignments = db.prepare("INSERT INTO assignments (subject_id, title, description, due_date) VALUES (?, ?, ?, ?)");
    stmtAssignments.run(1, 'Tarea 1: Diagramas de Flujo', 'Diseñar diagramas de flujo y arquitectura del sistema escolar.', '2026-06-25');
    stmtAssignments.run(2, 'Proyecto SQL', 'Diseñar esquema de base de datos relacional para el ERP.', '2026-06-30');
    stmtAssignments.finalize();

    const stmtExams = db.prepare("INSERT INTO exams (subject_id, title, description, date) VALUES (?, ?, ?, ?)");
    stmtExams.run(1, 'Parcial 1', 'Evaluación escrita sobre Patrones de Diseño', '2026-06-28');
    stmtExams.run(2, 'Examen Final', 'Examen integral teórico-práctico', '2026-07-15');
    stmtExams.finalize();

    // Seed tutorings
    const stmtTutorings = db.prepare("INSERT INTO tutorings (student_id, subject, teacher, date, time, status, type, link) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    stmtTutorings.run('usr_123', 'Ingeniería de Software II', 'Dr. Roberto Casas', '2026-06-18', '16:00', 'Aprobado', 'Virtual', 'https://meet.google.com/abc-defg-hij');
    stmtTutorings.run('usr_123', 'IA Generativa', 'Dra. Elena Rossi', '2026-06-20', '10:00', 'Pendiente', 'Presencial', '');
    stmtTutorings.run('usr_123', 'Sistemas Distribuidos', 'Dr. Leslie Lamport', '2026-04-12', '15:30', 'Completado', 'Virtual', '');
    stmtTutorings.finalize();

    // Seed library resources
    const stmtLibrary = db.prepare("INSERT INTO library_resources (title, category, type, size, downloads, date, subject, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    stmtLibrary.run('Introducción a la IA Generativa', 'Guías PDF', 'PDF', '4.5 MB', 124, 'May 2026', 'IA Generativa', 'text-indigo-500');
    stmtLibrary.run('Masterclass: Arquitectura de Microservicios', 'Grabaciones', 'VIDEO', '1.2 GB', 89, 'Abr 2026', 'Ing. Software II', 'text-emerald-500');
    stmtLibrary.run('Estructuras de Datos Avanzadas', 'Libros', 'BOOK', '12 MB', 450, 'Ene 2026', 'Algoritmos', 'text-blue-500');
    stmtLibrary.run('NovaSDK Enterprise v4.2', 'Software', 'EXE', '45 MB', 56, 'May 2026', 'Laboratorio', 'text-rose-500');
    stmtLibrary.run('Guía de Despliegue en AWS Cloud', 'Guías PDF', 'PDF', '2.1 MB', 210, 'Mar 2026', 'Sistemas Distribuidos', 'text-amber-500');
    stmtLibrary.run('Clase Magistral: Patrones de Diseño', 'Grabaciones', 'VIDEO', '850 MB', 167, 'Feb 2026', 'Ing. Software II', 'text-emerald-500');
    stmtLibrary.finalize();

    // Seed messages
    const stmtMessages = db.prepare("INSERT INTO messages (sender_id, receiver_id, sender_name, receiver_name, subject, content, timestamp, is_read) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    stmtMessages.run('adm_999', 'usr_123', 'Director General', 'Estudiante Demo', 'Bienvenido a NovaEdu', 'Hola Estudiante, bienvenido a la plataforma NovaEdu ERP. Aquí podrás ver tus calificaciones y finanzas.', '2026-06-12 09:00:00', 0);
    stmtMessages.run('usr_789', 'usr_123', 'Dr. Roberto Casas', 'Estudiante Demo', 'Entrega de Tarea 1 retrasada', 'Estimado alumno, le recuerdo que la Tarea 1 de Programación I está por vencer. Favor subir su entrega.', '2026-06-13 08:30:00', 0);
    stmtMessages.run('usr_123', 'usr_789', 'Estudiante Demo', 'Dr. Roberto Casas', 'Duda sobre la tarea', 'Profesor, tengo una duda sobre la pregunta 3 de la guía práctica. ¿Podría apoyarme?', '2026-06-13 09:15:00', 1);
    stmtMessages.finalize();

    // Seed observations
    const stmtObs = db.prepare("INSERT INTO student_observations (student_id, teacher_id, teacher_name, type, details) VALUES (?, ?, ?, ?, ?)");
    stmtObs.run('usr_123', 'usr_789', 'Dr. Roberto Casas', 'Académica', 'Excelente desempeño y participación en la clase de Programación I. Ha demostrado gran dominio de estructuras de control.');
    stmtObs.run('usr_123', 'adm_999', 'Director General', 'Conductual', 'El alumno demuestra liderazgo positivo colaborando activamente con sus compañeros de equipo.');
    stmtObs.finalize();

    // Seed Schedule
    const stmtSchedule = db.prepare("INSERT INTO schedule (student_id, day, start_time, end_time, subject_name, room, teacher_name, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    stmtSchedule.run('usr_123', 'Lunes', '08:00', '10:00', 'Inteligencia Artificial', 'Lab 2', 'Dr. Roberto Casas', 'bg-indigo-500');
    stmtSchedule.run('usr_123', 'Lunes', '14:00', '16:00', 'Ingeniería de Software II', 'Salón 402', 'Dr. Roberto Casas', 'bg-emerald-500');
    stmtSchedule.run('usr_123', 'Martes', '10:00', '12:00', 'Ética Profesional', 'Virtual', 'Dr. Roberto Casas', 'bg-rose-500');
    stmtSchedule.run('usr_123', 'Miércoles', '08:00', '10:00', 'Inteligencia Artificial', 'Lab 2', 'Dr. Roberto Casas', 'bg-indigo-500');
    stmtSchedule.run('usr_123', 'Miércoles', '11:00', '13:00', 'Bases de Datos Avanzadas', 'Salón 101', 'Dr. Roberto Casas', 'bg-amber-500');
    stmtSchedule.run('usr_123', 'Jueves', '14:00', '16:00', 'Ingeniería de Software II', 'Salón 402', 'Dr. Roberto Casas', 'bg-emerald-500');
    stmtSchedule.run('usr_123', 'Viernes', '09:00', '11:00', 'Bases de Datos Avanzadas', 'Salón 305', 'Dr. Roberto Casas', 'bg-purple-500');
    stmtSchedule.finalize();

    console.log('Base de datos poblada exitosamente.');
  });
};

// If this file is run directly (node db.js), execute the seed (robust path check for Windows)
const runPath = process.argv[1] ? resolve(process.argv[1]) : '';
const scriptPath = fileURLToPath(import.meta.url);
if (runPath && (runPath.toLowerCase() === scriptPath.toLowerCase() || runPath.endsWith('db.js'))) {
  seedDatabase();
  setTimeout(() => db.close(), 1000);
}
