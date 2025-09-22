import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InstructorLogin from "./pages/InstructorLogin";
import UserLogin from "./pages/UserLogin";
import Exam from "./pages/Exam";
import InstructorPanel from "./pages/InstructorPanel";
import Videos from "./pages/Videos";
import UploadVideo from "./pages/UploadVideo";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/instructor" element={<InstructorLogin />} />
        <Route path="/usuario" element={<UserLogin />} />
        <Route path="/examen" element={<Exam />} />
        <Route path="/panel-instructor" element={<InstructorPanel />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/upload-video" element={<UploadVideo />} />
      </Routes>
    </Router>
  );
}

export default App;
