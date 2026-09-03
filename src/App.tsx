import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "@components/layout/MainLayout";
import ProjectsArchive from "@pages/ProjectsArchive";
import CustomMemoryAllocator from "@pages/projects/CustomMemoryAllocator";
import WriteupsIndex from "@pages/WriteupsIndex";
import WriteupPage from "@pages/WriteupPage";
import "@styles/global.css";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />} />
                <Route path="/projects-archive" element={<ProjectsArchive />} />
                <Route path="/writeups" element={<WriteupsIndex />} />
                <Route path="/writeups/:slug" element={<WriteupPage />} />
                <Route path="projects/custom-memory-allocator" element={<CustomMemoryAllocator />} />
            </Routes>
        </Router>
    );
}
