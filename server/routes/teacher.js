import express from 'express';
import { db } from '../db.js';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// UPLOAD ENDPOINT
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// STATS ENDPOINT FOR REPORTS
router.get('/stats', authenticateToken, (req, res) => {
  const teacherId = req.user.id;
  
  // Aggregate stats: Avg grades per subject, submission rates
  const statsSql = `
    SELECT 
      s.name as subject,
      AVG(c.grade) as avg_grade,
      (SELECT COUNT(*) FROM submissions sub JOIN assignments ass ON sub.assignment_id = ass.id WHERE ass.subject_id = s.id) as total_submissions
    FROM subjects s
    LEFT JOIN assignments a ON s.id = a.subject_id
    LEFT JOIN submissions sub ON a.id = sub.assignment_id
    LEFT JOIN comments c ON sub.id = c.submission_id
    WHERE s.teacher_id = ?
    GROUP BY s.id
  `;
  
  db.all(statsSql, [teacherId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Fake trend data for the chart
    const trend = [
      { name: 'Sem 1', promedio: 7.5 },
      { name: 'Sem 2', promedio: 8.2 },
      { name: 'Sem 3', promedio: 7.8 },
      { name: 'Sem 4', promedio: 8.5 },
      { name: 'Sem 5', promedio: 9.1 },
    ];
    
    res.json({ subjects: rows, trend });
  });
});

// Middleware to protect all teacher routes
router.use(authenticateToken);

// GET /api/teacher/subjects - subjects assigned to the teacher
router.get('/subjects', (req, res) => {
  const teacherId = req.user.id;
  const sql = `SELECT * FROM subjects WHERE teacher_id = ?`;
  db.all(sql, [teacherId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/teacher/subjects/:id - details of a specific subject
router.get('/subjects/:id', (req, res) => {
  const { id } = req.params;
  const teacherId = req.user.id;
  const sql = `SELECT * FROM subjects WHERE id = ? AND teacher_id = ?`;
  db.get(sql, [id, teacherId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Subject not found' });
    res.json(row);
  });
});

// GET /api/teacher/assignments - assignments for teacher's subjects
router.get('/assignments', (req, res) => {
  const teacherId = req.user.id;
  const sql = `SELECT a.* FROM assignments a JOIN subjects s ON a.subject_id = s.id WHERE s.teacher_id = ?`;
  db.all(sql, [teacherId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/teacher/exams - exams for teacher's subjects
router.get('/exams', (req, res) => {
  const teacherId = req.user.id;
  const sql = `SELECT e.* FROM exams e JOIN subjects s ON e.subject_id = s.id WHERE s.teacher_id = ?`;
  db.all(sql, [teacherId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/teacher/comments/:submissionId - add comment/grade to a submission
router.post('/comments/:submissionId', (req, res) => {
  const { submissionId } = req.params;
  const { comment, grade } = req.body;
  const teacherId = req.user.id;
  const sql = `INSERT INTO comments (submission_id, teacher_id, comment, grade) VALUES (?, ?, ?, ?)`;
  db.run(sql, [submissionId, teacherId, comment, grade], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, submissionId, teacherId, comment, grade });
  });
});

// POST /api/teacher/assignments - create a new assignment
router.post('/assignments', (req, res) => {
  const { subject_id, title, description, due_date } = req.body;
  const sql = `INSERT INTO assignments (subject_id, title, description, due_date) VALUES (?, ?, ?, ?)`;
  db.run(sql, [subject_id, title, description, due_date], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, subject_id, title, description, due_date });
  });
});

// POST /api/teacher/exams - create a new exam
router.post('/exams', (req, res) => {
  const { subject_id, title, description, date } = req.body;
  const sql = `INSERT INTO exams (subject_id, title, description, date) VALUES (?, ?, ?, ?)`;
  db.run(sql, [subject_id, title, description, date], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, subject_id, title, description, date });
  });
});

// GET /api/teacher/assignments/:id/submissions - get all submissions for an assignment
router.get('/assignments/:id/submissions', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT s.*, u.name as student_name FROM submissions s JOIN users u ON s.student_id = u.id WHERE s.assignment_id = ?`;
  db.all(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/teacher/forums - list forums per subject for the teacher
router.get('/forums', (req, res) => {
  const teacherId = req.user.id;
  const sql = `SELECT f.*, s.name as subject_name FROM forums f JOIN subjects s ON f.subject_id = s.id WHERE s.teacher_id = ?`;
  db.all(sql, [teacherId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/teacher/forums - create a new forum for a subject
router.post('/forums', (req, res) => {
  const { subject_id, title, description } = req.body;
  const teacherId = req.user.id;
  const sql = `INSERT INTO forums (subject_id, teacher_id, title, description) VALUES (?, ?, ?, ?)`;
  db.run(sql, [subject_id, teacherId, title, description], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, subject_id, teacher_id: teacherId, title, description });
  });
});

// FORUM THREADS & POSTS
router.get('/forums/:id/threads', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT t.*, u.name as creator_name FROM forum_threads t JOIN users u ON t.created_by = u.id WHERE t.forum_id = ?`;
  db.all(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/forums/:id/threads', (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const userId = req.user.id;
  const sql = `INSERT INTO forum_threads (forum_id, title, created_by, created_at) VALUES (?, ?, ?, ?)`;
  db.run(sql, [id, title, userId, new Date().toISOString()], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, forum_id: id, title, created_by: userId });
  });
});

router.get('/threads/:id/posts', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT p.*, u.name as author_name FROM forum_posts p JOIN users u ON p.author_id = u.id WHERE p.thread_id = ? ORDER BY p.created_at ASC`;
  db.all(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/threads/:id/posts', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;
  const sql = `INSERT INTO forum_posts (thread_id, author_id, content, created_at) VALUES (?, ?, ?, ?)`;
  db.run(sql, [id, userId, content, new Date().toISOString()], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, thread_id: id, author_id: userId, content });
  });
});

// GET /api/teacher/tutoring - Fetch tutoring requests for this teacher
router.get('/tutoring', (req, res) => {
  db.all('SELECT t.*, u.name as student_name FROM tutorings t JOIN users u ON t.student_id = u.id WHERE t.teacher = ?', [req.user.name], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// PUT /api/teacher/tutoring/:id/status - Approve or update tutoring status
router.put('/tutoring/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, link } = req.body;
  db.run('UPDATE tutorings SET status = ?, link = ? WHERE id = ?', [status, link || '', id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// POST /api/teacher/observations - Register academic/behavioral observation for a student
router.post('/observations', (req, res) => {
  const { student_id, type, details } = req.body;
  db.run('INSERT INTO student_observations (student_id, teacher_id, teacher_name, type, details) VALUES (?, ?, ?, ?, ?)',
    [student_id, req.user.id, req.user.name, type, details],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

export default router;
