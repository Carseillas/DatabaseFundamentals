import { useState } from 'react'
import './App.css'

function App() {  

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState("")
  const [message, setMessage] = useState("");

  async function logIn() {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.success) {
      setMessage("Login successful!");
    } else {
      setMessage("Wrong username or password.");
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

export default App
