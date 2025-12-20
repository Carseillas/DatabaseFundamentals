const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const archiver = require("archiver");

const app = express();
const usersFile = path.join(__dirname, "users.json");
const studentsFile = path.join(__dirname, "students.json");
const rollcallsDir = path.join(__dirname, "rollcalls");

if (!fs.existsSync(rollcallsDir)) {
  fs.mkdirSync(rollcallsDir);
}

app.use(cors());       // Allow React to access the server
app.use(express.json());

function readUsers() {
  return JSON.parse(fs.readFileSync(usersFile, "utf-8"));
}

function readStudents() {
  return JSON.parse(fs.readFileSync(studentsFile, "utf-8"));
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function writeStudents(students) {
  fs.writeFileSync(studentsFile, JSON.stringify(students, null, 2));
}

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Admin (hardcoded)
  if (username === "admin" && password === "selcukecza") {
    return res.json({ success: true, message: "Admin Login" });
  }

  // Teachers (from users.json)
  const users = readUsers();
  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (user) {
    return res.json({ success: true, message: "Login successful" });
  }

  res.json({ success: false, message: "Invalid username or password" });
});

app.get("/teachers", (req, res) => {
  const users = readUsers();
  res.json(users);
});

app.get("/students", (req, res) => {
  const students = readStudents();
  res.json(students);
});

app.post("/teachers", (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();

  if (users.find(u => u.username === username)) {
    return res.json({ success: false, message: "Teacher already exists" });
  }

  users.push({ username, password });
  writeUsers(users);

  res.json({ success: true });
});

app.post("/students", (req, res) => {
  const { name, studentClass, studentNum } = req.body;

  const students = readStudents();

  if (students.find(s => s.studentNum === studentNum)) {
    return res.json({ success: false, message: "Student already exists" });
  }

  students.push({ name, studentClass, studentNum });
  writeStudents(students);

  res.json({ success: true });
});

app.post("/rollcall", (req, res) => {
  const { classNum, date, hour, absentStudents, subject, note } = req.body;

  if (!classNum || !date || !hour || !subject || !note) {
    return res.status(400).json({ success: false });
  }

  const filePath = path.join(rollcallsDir, `${classNum}.json`);

  let data = {};

  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  // date hierarchy
  if (!data[date]) {
    data[date] = {};
  }

  // hour hierarchy (overwrite if exists)
  data[date][hour] = {
    subject,
    note,
    absent: absentStudents
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({ success: true });
});

app.delete("/teachers/:username", (req, res) => {
  const username = req.params.username;

  const users = readUsers().filter(u => u.username !== username);
  writeUsers(users);

  res.json({ success: true });
});

app.delete("/students/:studentNum", (req, res) => {
  const studentNum = req.params.studentNum;

  const students = readStudents().filter(s => s.studentNum !== studentNum);
  writeStudents(students);
  res.json({ success: true });
});

app.get("/export/:classNum", (req, res) => {
  const classNum = req.params.classNum;
  const filePath = path.join(rollcallsDir, `${classNum}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "No rollcall data" });
  }

  const rollcalls = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const rows = [];

  for (const date in rollcalls) {
    for (const hour in rollcalls[date]) {
      const entry = rollcalls[date][hour];

      rows.push({
        Date: date,
        Hour: hour,
        Subject: entry.subject || "",
        Note: entry.note || "",
        "Absent Students": entry.absent?.join(", ") || ""
      });
    }
  }

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Rollcalls");

  const excelBuffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx"
  });

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${classNum}_rollcalls.xlsx`
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.send(excelBuffer);
});

app.get("/export-all", (req, res) => {
  console.log("EXPORT ALL TRIGGERED");

  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=all_rollcalls.zip"
  );

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", err => {
    console.error("ARCHIVE ERROR:", err);
    res.status(500).end();
  });

  archive.pipe(res);

  const files = fs.readdirSync(rollcallsDir);

  if (files.length === 0) {
    archive.append("No rollcall data", { name: "README.txt" });
  }

  files.forEach(file => {
    if (!file.endsWith(".json")) return;

    const classNum = path.basename(file, ".json");
    const filePath = path.join(rollcallsDir, file);

    const rollcalls = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const rows = [];

    for (const date in rollcalls) {
      for (const hour in rollcalls[date]) {
        const entry = rollcalls[date][hour];

        rows.push({
          Date: date,
          Hour: hour,
          Subject: entry.subject || "",
          Note: entry.note || "",
          "Absent Students": entry.absent?.join(", ") || ""
        });
      }
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rollcalls");

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx"
    });

    archive.append(excelBuffer, {
      name: `${classNum}_rollcalls.xlsx`
    });
  });

  archive.finalize(); // 🔥 THIS MUST RUN
});


app.listen(5000, () => console.log("Server running on port 5000"));
