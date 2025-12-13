import { Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import RCallMain from "./RCallMain.jsx";
import Admin from "./Admin.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/RCallMain" element={<RCallMain />} />
      <Route path="/Admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
