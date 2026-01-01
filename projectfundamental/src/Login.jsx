import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css'
import './Login.css'

function Login() {  

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function logIn() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.success) {
      if(data.message === "Admin Login"){
        setMessage("Admin Login Successful!");
        sessionStorage.setItem("adminloggedIn", "true");
        navigate("/Admin");
        return;
      }
      else{
        setMessage("Login successful!");
        sessionStorage.setItem("teacherloggedIn", "true");
        navigate("/RCallMain")
        return;
      }
    } else {
      setMessage("Wrong username or password.");
      sessionStorage.setItem("adminloggedIn", "false");
      sessionStorage.setItem("teacherloggedIn", "false");
    }
  }

  return (
    <>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <h1>Giriş</h1>
        <div className="username">
          <label for="username" className="userlabel">Kullanıcı Adı:</label>
          <input 
          type="username" 
          id="username"  
          placeholder="Kullanıcı Adı"  
          size={50}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          />
        </div><br />
        <div className="Şifre">
          <label for="password" className="passlabel">Şifre:</label><br></br>
          <input 
          type="password" 
          id="password"  
          placeholder="Şifre"  
          size={50}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />
        
        <div className="button">
          <button type="button" onClick={logIn}>Giriş</button>
        </div>
        <p>{message}</p>
      </form>
    </>
  )
}

export default Login;
