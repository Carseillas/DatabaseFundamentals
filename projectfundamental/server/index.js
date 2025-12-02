const express = require("express");
const cors = require("cors");
const users = require("./users.json");

const app = express();

app.use(cors());       // Allow React to access the server
app.use(express.json());

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    return res.json({ success: true, message: "Login successful!" });
  } else {
    return res.json({ success: false, message: "Invalid username or password" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
