import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useMousePosition } from "../../hooks";

interface PageLayoutProps {
    children: ReactNode;
    maxWidth?: string;
}

export default function PageLayout({ children, maxWidth = "max-w-5xl" }: PageLayoutProps) {
    const navigate = useNavigate();
    const mousePos = useMousePosition();

    return (
        <div className="relative min-h-screen text-white bg-gray-900">
            {/* Mouse follow effect */}
            <div
                className="pointer-events-none fixed inset-0 z-0 transition-all duration-200"
                style={{
                    background: `radial-gradient(200px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.1), transparent 80%)`,
                }}
            />

            <div className={`${maxWidth} mx-auto p-6 sm:p-8 md:p-12 relative z-10`}>
                {/* Back button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        <svg
                            className="w-5 h-5 mr-2 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        <span className="font-medium">Justin Smith</span>
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}
