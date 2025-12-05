import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css'

function Login() {  

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function logIn() {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.success) {
      setMessage("Login successful!");
      localStorage.setItem("loggedIn", "true");
      navigate("/RCallMain");
    } else {
      setMessage("Wrong username or password.");
      localStorage.setItem("loggedIn", "false");
    }
  }

  return (
    <>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <h1>TEACHER LOGIN</h1>
        <div className="username">
          <label for="username" className="userlabel">Teacher Username:</label>
          <input 
          type="username" 
          id="username"  
          placeholder="Username"  
          size={50}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="password">
          <label for="password" className="passlabel">Password:</label>
          <input 
          type="password" 
          id="password"  
          placeholder="Password"  
          size={50}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />
        
        <div className="button">
          <button type="button" onClick={logIn}>Login</button>
        </div>
        <p>{message}</p>
      </form>
    </>
  )
}

export default Login;
