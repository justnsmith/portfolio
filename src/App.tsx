import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProjectsArchive from "./pages/ProjectsArchive";
import FinalExam from "./pages/FinalExam";
import CustomMemoryAllocator from "./pages/projects/CustomMemoryAllocator";
import "./styles/global.css";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />} />
                <Route path="/projects-archive" element={<ProjectsArchive />} />
                <Route path="/ics414-finalexam" element={<FinalExam />} />
                <Route path="projects/custom-memory-allocator" element={<CustomMemoryAllocator />} />
            </Routes>
        </Router>
    );
}
