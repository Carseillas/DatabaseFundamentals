const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const usersFile = path.join(__dirname, "users.json");

app.use(cors());       // Allow React to access the server
app.use(express.json());

function readUsers() {
  return JSON.parse(fs.readFileSync(usersFile, "utf-8"));
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
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

app.delete("/teachers/:username", (req, res) => {
  const username = req.params.username;

  const users = readUsers().filter(u => u.username !== username);
  writeUsers(users);

  res.json({ success: true });
});

app.listen(5000, () => console.log("Server running on port 5000"));
