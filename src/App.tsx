import { useRef, useEffect, useState, useCallback } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Hero from "./components/Hero";
import About from "./components/About";
import TechStack from "./components/TechStack";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import ProjectsArchive from "./pages/ProjectsArchive";
import CustomMemoryAllocator from "./pages/projects/CustomMemoryAllocator";
import FinalExam from "./pages/FinalExam";
import "./styles/global.css";

// Hook to track mouse position
function useMousePosition() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", updateMousePosition);
        return () => window.removeEventListener("mousemove", updateMousePosition);
    }, []);

    return mousePos;
}

// Hook to detect screen width
function useIsLargeScreen(breakpoint = 1024) {
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= breakpoint);

    useEffect(() => {
        const handleResize = () => setIsLargeScreen(window.innerWidth >= breakpoint);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [breakpoint]);

    return isLargeScreen;
}

// Reusable Main Layout component
function MainLayout({
    mousePos,
    isLargeScreen,
    isContactModalOpen,
    setIsContactModalOpen,
    leftRef,
    rightScrollRef
}: {
    mousePos: { x: number; y: number };
    isLargeScreen: boolean;
    isContactModalOpen: boolean;
    setIsContactModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    leftRef: React.RefObject<HTMLDivElement>;
    rightScrollRef: React.RefObject<HTMLDivElement>;
}) {
    return (
        <div className="relative min-h-screen text-white bg-gray-900">
            <div
                className="pointer-events-none fixed inset-0 z-0 transition-all duration-200"
                style={{
                    background: `radial-gradient(200px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.1), transparent 80%)`,
                }}
            />

            <style>{`
                ::selection {
                    background-color: rgba(34, 211, 238, 0.3);
                    color: white;
                }
                ::-moz-selection {
                    background-color: rgba(34, 211, 238, 0.3);
                    color: white;
                }
            `}</style>

            {isLargeScreen ? (
                <div className="flex flex-row h-screen">
                    <div ref={leftRef} className="w-1/2 h-screen overflow-hidden z-10">
                        <Hero
                            isContactModalOpen={isContactModalOpen}
                            setIsContactModalOpen={setIsContactModalOpen}
                        />
                    </div>

                    <div
                        ref={rightScrollRef}
                        className={`w-1/2 h-screen overflow-y-auto z-10 space-y-16 pb-24 ${isContactModalOpen ? "hidden" : "block"
                            }`}
                    >
                        <About />
                        <TechStack />
                        <Experience />
                        <Projects />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col min-h-screen bg-gray-900 z-10 space-y-16 pb-24">
                    <Hero
                        isContactModalOpen={isContactModalOpen}
                        setIsContactModalOpen={setIsContactModalOpen}
                    />
                    <div className={isContactModalOpen ? "hidden" : "block"}>
                        <About />
                        <TechStack />
                        <Experience />
                        <Projects />
                    </div>
                </div>
            )}
        </div>
    );
}

export default function App() {
    const leftRef = useRef<HTMLDivElement>(null!);
    const rightScrollRef = useRef<HTMLDivElement>(null!);
    const mousePos = useMousePosition();
    const isLargeScreen = useIsLargeScreen();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    const handleScroll = useCallback(
        (e: WheelEvent) => {
            if (isLargeScreen && leftRef.current && rightScrollRef.current) {
                const heroRect = leftRef.current.getBoundingClientRect();
                const isMouseOverHero =
                    mousePos.y >= heroRect.top && mousePos.y <= heroRect.bottom;

                if (isMouseOverHero) {
                    e.preventDefault();
                    rightScrollRef.current.scrollTop += e.deltaY;
                }
            }
        },
        [isLargeScreen, mousePos.y]
    );

    useEffect(() => {
        if (!isLargeScreen) return;

        window.addEventListener("wheel", handleScroll, { passive: false });
        return () => window.removeEventListener("wheel", handleScroll);
    }, [isLargeScreen, handleScroll]);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <MainLayout
                            mousePos={mousePos}
                            isLargeScreen={isLargeScreen}
                            isContactModalOpen={isContactModalOpen}
                            setIsContactModalOpen={setIsContactModalOpen}
                            leftRef={leftRef}
                            rightScrollRef={rightScrollRef}
                        />
                    }
                />
                <Route path="projects-archive" element={<ProjectsArchive />} />
                <Route path="projects/custom-memory-allocator" element={<CustomMemoryAllocator />} />
                <Route path="ics414-finalexam" element={<FinalExam />} />
            </Routes>
        </Router>
    );
}
