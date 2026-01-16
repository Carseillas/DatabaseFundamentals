import { useState, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import "../server/users.json";
import "./Admin.css";

function Admin() {

    const role = sessionStorage.getItem("role");
    const token = sessionStorage.getItem("token");
    const [teachers, setTeachers] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [students, setStudents] = useState([]);
    const [name, setName] = useState("");
    const [studentClass, setStudentClass] = useState("9A");
    const [studentNum, setStudentNum] = useState("");

    if (role !== "admin" || !token) {
      return <Navigate to="/" />;
    }

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/teachers`)
        .then(res => res.json())
        .then(data => setTeachers(data));
    }, []);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/students`)
        .then(res => res.json())
        .then(data => setStudents(data));
    }, []);

    // Load teachers from users.json
    async function loadTeachers() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/teachers`, {
        headers: {
          Authorization: sessionStorage.getItem("token")
        }
      });
    
      if (!res.ok) {
        console.error("Forbidden");
        setTeachers([]); // prevent crash
        return;
      }
    
      const data = await res.json();
      setTeachers(data);
    }

    // Load students from users.json
    async function loadStudents() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/students`);
      const data = await res.json();
      setStudents(data);
    }

    useEffect(() => {
      loadTeachers();
    }, []);

    useEffect(() => {
      loadStudents();
    }, []);

    // Add teacher
    async function addTeacher() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/teachers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token")
        },
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

    // Add student
    async function addStudent() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({ name, studentClass, studentNum })
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.message);
        return;
      }

      setName("");
      setStudentClass("");
      setStudentNum("");
      loadStudents(); // 🔄 reload from students.json
    }

    // Delete teacher
    async function deleteTeacher(username) {
      await fetch(`${import.meta.env.VITE_API_URL}/teachers/${username}`, {
        method: "DELETE",
        headers: {
          Authorization: sessionStorage.getItem("token")
        }
      });

      loadTeachers(); // 🔄 reload from users.json
    }

    // Delete student
    async function deleteStudent(studentNum) {
      await fetch(`${import.meta.env.VITE_API_URL}/students/${studentNum}`, {
        method: "DELETE"
      });

      loadStudents(); // 🔄 reload from students.json
    }


    return (
        <div>
            <h1>ADMIN PANELI</h1>

            <h2>Öğretmen Ekle</h2>
            <input
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              placeholder="Şifre"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className='addButton' onClick={addTeacher}>Ekle</button>

            <h2>Öğretmenler</h2>
            <ul>
              {Array.isArray(teachers) && teachers.map(t => (
                <li key={t.username}>
                  {t.username}
                  <button onClick={() => deleteTeacher(t.username)}>❌</button>
                </li>
              ))}
            </ul>
            <h2>Öğrenci Ekle</h2>
            <input
              placeholder="İsim"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <select value={studentClass} defaultValue={""} onChange={(e) => setStudentClass(e.target.value)}>
                <option value="9A">9A</option>
                <option value="9B">9B</option>
                <option value="9C">9C</option>
                <option value="9D">9D</option>
                <option value="9E">9E</option>
                <option value="9F">9F</option>
                <option value="9G">9G</option>
                <option value="10A">10A</option>
                <option value="10B">10B</option>
                <option value="10C">10C</option>
                <option value="10D">10D</option>
                <option value="10E">10E</option>
                <option value="10F">10F</option>
                <option value="10G">10F</option>
                <option value="11A">11A</option>
                <option value="11B">11B</option>
                <option value="11C">11C</option>
                <option value="11D">11D</option>
                <option value="11E">11E</option>
                <option value="11F">11F</option>
                <option value="11G">11G</option>
                <option value="12A">12A</option>
                <option value="12B">12B</option>
                <option value="12C">12C</option>
                <option value="12D">12D</option>
                <option value="12E">12E</option>
                <option value="12F">12F</option>
                <option value="12G">12G</option>
            </select>
            <input
              placeholder="Numara"
              value={studentNum}
              onChange={e => setStudentNum(e.target.value)}
            />
            <button className='addButton' onClick={addStudent}>Ekle</button>
            <h2>Öğrenciler</h2>
            <ul>
              {students.map(s => (
                <li key={s.studentNum}>
                  {s.name} - {s.studentClass}
                  <button className='delButton' onClick={() => deleteStudent(s.studentNum)}>❌</button>
                </li>
              ))}
            </ul>
            {/* Export buttons */}
            <button onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_URL}/export-all`;
            }}>
              Yoklamaları Excel Olarak Dışa Aktar
            </button>
            <button onClick={() => {
              sessionStorage.clear();
              window.location.href = "/";
            }}>
              Çıkış Yap
            </button>
        </div>
  );
}

export default Admin;