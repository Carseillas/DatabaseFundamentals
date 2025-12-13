import { useState, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import "../server/users.json";
import "./Admin.css";

function Admin() {

    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const [teachers, setTeachers] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    if (!loggedIn) {
        return <Navigate to="/" />;
    }

    useEffect(() => {
        fetch("http://localhost:5000/teachers")
        .then(res => res.json())
        .then(data => setTeachers(data));
    }, []);

    // Load teachers from users.json
    async function loadTeachers() {
      const res = await fetch("http://localhost:5000/teachers");
      const data = await res.json();
      setTeachers(data);
    }

    useEffect(() => {
      loadTeachers();
    }, []);

    // Add teacher
    async function addTeacher() {
      const res = await fetch("http://localhost:5000/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.message);
        return;
      }

      setUsername("");
      setPassword("");
      loadTeachers(); // 🔄 reload from users.json
    }

    // Delete teacher
    async function deleteTeacher(username) {
      await fetch(`http://localhost:5000/teachers/${username}`, {
        method: "DELETE"
      });

      loadTeachers(); // 🔄 reload from users.json
    }


    return (
        <div>
            <h1>ADMIN PANEL</h1>

            <h2>Add Teacher</h2>
            <input
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className='addButton' onClick={addTeacher}>Add</button>

            <h2>Teachers</h2>
            <ul>
              {teachers.map(t => (
                <li key={t.username}>
                  {t.username}
                  <button className='delButton' onClick={() => deleteTeacher(t.username)}>❌</button>
                </li>
              ))}
            </ul>
        </div>
  );
}

export default Admin;