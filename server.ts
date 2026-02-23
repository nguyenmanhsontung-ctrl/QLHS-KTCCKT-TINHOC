import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("quiz.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    cccd TEXT UNIQUE,
    password TEXT,
    fullName TEXT,
    role TEXT,
    grade TEXT,
    className TEXT,
    birthDate TEXT,
    studentId TEXT,
    gender TEXT,
    createdAt INTEGER
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    grade TEXT,
    lessonNumber REAL,
    title TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    grade TEXT,
    lessonNumber REAL,
    question TEXT,
    optionA TEXT,
    optionB TEXT,
    optionC TEXT,
    optionD TEXT,
    correctAnswer TEXT,
    explanation TEXT
  );

  CREATE TABLE IF NOT EXISTS tests (
    id TEXT PRIMARY KEY,
    title TEXT,
    subject TEXT,
    purpose TEXT,
    grade TEXT,
    lessonNumbers TEXT,
    duration INTEGER,
    startTime INTEGER,
    endTime INTEGER,
    questionCount INTEGER,
    totalPoints REAL,
    pointsPerQuestion REAL,
    testPassword TEXT,
    maxAttempts INTEGER,
    randomizeFromPool INTEGER,
    shuffleQuestions INTEGER,
    shuffleOptions INTEGER,
    targetType TEXT,
    targetClasses TEXT,
    targetStudents TEXT,
    createdAt INTEGER
  );

  CREATE TABLE IF NOT EXISTS answers (
    id TEXT PRIMARY KEY,
    testId TEXT,
    studentId TEXT,
    score REAL,
    maxScore REAL,
    correctCount INTEGER,
    totalQuestions INTEGER,
    answers TEXT,
    submittedAt INTEGER
  );
`);

// Insert default admin if not exists
const adminCheck = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
if (!adminCheck) {
  db.prepare(`
    INSERT INTO users (id, cccd, password, fullName, role, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    "admin-1",
    "Tungtitchoaity",
    "Nhien110517@",
    "Quản Trị Viên",
    "admin",
    Date.now()
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/login", (req, res) => {
    const { cccd, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE cccd = ? AND password = ?").get(cccd, password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/data", (req, res) => {
    const users = db.prepare("SELECT * FROM users").all();
    const lessons = db.prepare("SELECT * FROM lessons").all();
    const questions = db.prepare("SELECT * FROM questions").all();
    const tests = db.prepare("SELECT * FROM tests").all();
    const answers = db.prepare("SELECT * FROM answers").all();
    
    res.json({
      users,
      lessons,
      questions,
      tests,
      answers
    });
  });

  app.post("/api/users", (req, res) => {
    const user = req.body;
    try {
      db.prepare(`
        INSERT INTO users (id, cccd, password, fullName, role, grade, className, birthDate, studentId, gender, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        user.id, user.cccd, user.password, user.fullName, user.role, 
        user.grade, user.className, user.birthDate, user.studentId, user.gender, user.createdAt
      );
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/users/:id", (req, res) => {
    db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/lessons", (req, res) => {
    const lesson = req.body;
    db.prepare(`
      INSERT INTO lessons (id, grade, lessonNumber, title, description)
      VALUES (?, ?, ?, ?, ?)
    `).run(lesson.id, lesson.grade, lesson.lessonNumber, lesson.title, lesson.description);
    res.json({ success: true });
  });

  app.post("/api/questions", (req, res) => {
    const q = req.body;
    db.prepare(`
      INSERT INTO questions (id, grade, lessonNumber, question, optionA, optionB, optionC, optionD, correctAnswer, explanation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(q.id, q.grade, q.lessonNumber, q.question, q.optionA, q.optionB, q.optionC, q.optionD, q.correctAnswer, q.explanation);
    res.json({ success: true });
  });

  app.post("/api/tests", (req, res) => {
    const t = req.body;
    db.prepare(`
      INSERT INTO tests (id, title, subject, purpose, grade, lessonNumbers, duration, startTime, endTime, questionCount, totalPoints, pointsPerQuestion, testPassword, maxAttempts, randomizeFromPool, shuffleQuestions, shuffleOptions, targetType, targetClasses, targetStudents, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      t.id, t.title, t.subject, t.purpose, t.grade, t.lessonNumbers, t.duration, t.startTime, t.endTime, 
      t.questionCount, t.totalPoints, t.pointsPerQuestion, t.testPassword, t.maxAttempts, 
      t.randomizeFromPool ? 1 : 0, t.shuffleQuestions ? 1 : 0, t.shuffleOptions ? 1 : 0, 
      t.targetType, t.targetClasses, t.targetStudents, t.createdAt
    );
    res.json({ success: true });
  });

  app.post("/api/answers", (req, res) => {
    const a = req.body;
    db.prepare(`
      INSERT INTO answers (id, testId, studentId, score, maxScore, correctCount, totalQuestions, answers, submittedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(a.id, a.testId, a.studentId, a.score, a.maxScore, a.correctCount, a.totalQuestions, a.answers, a.submittedAt);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
