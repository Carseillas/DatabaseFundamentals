import { Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import RCallMain from "./RCallMain.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/RCallMain" element={<RCallMain />} />
    </Routes>
  );
}

export default App;
