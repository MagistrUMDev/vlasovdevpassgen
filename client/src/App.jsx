import "./app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Navbar from "../components/Navbar/Navbar";
import Login from "../pages/Login/Login";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

import Register from "../pages/Register/Register";
import Passwords from "../pages/Passwords/Passwords";

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Navbar />
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/passwords" element={<Passwords />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
