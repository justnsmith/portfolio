"use client";
import { useState, useEffect } from "react";
import {
    SiC,
    SiCplusplus,
    SiGo,
    SiPython,
    SiTypescript,
    SiReact,
    SiTailwindcss,
    SiGit,
    SiPostgresql,
    SiNodedotjs,
    SiDocker,
} from "react-icons/si";

const tech = [
    { name: "C", icon: SiC, color: "#A8B9CC", proficiency: 65 },
    { name: "C++", icon: SiCplusplus, color: "#00599C", proficiency: 70 },
    { name: "Go", icon: SiGo, color: "#00ADD8", proficiency: 68 },
    { name: "Python", icon: SiPython, color: "#3776ab", proficiency: 72 },
    {
        name: "Java",
        icon: "java-logo",
        image: "/java-logo.svg",
        color: "#f80000",
        proficiency: 67
    },
    { name: "TypeScript", icon: SiTypescript, color: "#3178c6", proficiency: 62 },
    { name: "React", icon: SiReact, color: "#61dafb", proficiency: 58 },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38bdf8", proficiency: 60 },
    { name: "Git", icon: SiGit, color: "#f1502f", proficiency: 65 },
    { name: "PostgreSQL", icon: SiPostgresql, color: "#336791", proficiency: 55 },
    { name: "Node.js", icon: SiNodedotjs, color: "#83cd29", proficiency: 60 },
    { name: "Docker", icon: SiDocker, color: "#2496ED", proficiency: 63 },
];

export default function TechStack() {
    const [selectedTech, setSelectedTech] = useState<string | null>(null);
    const [isInView, setIsInView] = useState(false);
    const [hoveredTech, setHoveredTech] = useState<string | null>(null);

    // Animation for staggered entry
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold: 0.3 }
        );

        const section = document.getElementById("tech");
        if (section) {
            observer.observe(section);
        }

        return () => {
            if (section) {
                observer.unobserve(section);
            }
        };
    }, []);

    // Glowing pulse effect for tech icons
    useEffect(() => {
        if (!selectedTech) return;

        const timer = setTimeout(() => {
            setSelectedTech(null);
        }, 2000);

        return () => clearTimeout(timer);
    }, [selectedTech]);

    const handleIconClick = (techName: string) => {
        setSelectedTech(techName);
    };

    return (
        <section
            id="tech"
            className="px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 pt-20 pb-40 scroll-mt-28"
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center mb-12">
                    <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent flex-grow"></div>
                    <h2 className="text-2xl font-bold text-white mx-4 flex items-center">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                            Tech Stack
                        </span>
                    </h2>
                    <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent flex-grow"></div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 text-white">
                    {tech.map(({ name, icon: Icon, color, image, proficiency }, index) => {
                        const isActive = selectedTech === name;
                        const isHovered = hoveredTech === name;

                        return (
                            <div
                                key={name}
                                className={`flex flex-col items-center space-y-3 transform transition-all duration-500 ${isInView
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-8"
                                    }`}
                                style={{
                                    transitionDelay: `${index * 100}ms`,
                                }}
                                onMouseEnter={() => setHoveredTech(name)}
                                onMouseLeave={() => setHoveredTech(null)}
                                onClick={() => handleIconClick(name)}
                            >
                                <div
                                    className={`relative w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-500 ${isActive || isHovered
                                        ? "bg-gray-800 scale-110 shadow-lg shadow-indigo-800/20"
                                        : "bg-gray-900"
                                        } cursor-pointer overflow-hidden group`}
                                    style={{
                                        boxShadow: isActive
                                            ? `0 0 20px ${color}80, 0 0 10px ${color}40`
                                            : "",
                                    }}
                                >
                                    {/* Background patterns */}
                                    <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>

                                    {/* Icon */}
                                    <div className={`relative z-10 transition-transform duration-500 ${isHovered ? "scale-110" : ""}`}>
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={name}
                                                className="w-12 h-12 object-contain"
                                            />
                                        ) : (
                                            <Icon
                                                style={{ color: isActive || isHovered ? color : `${color}90` }}
                                                className={`text-4xl transition-all duration-500 ${isActive ? "animate-pulse" : ""}`}
                                            />
                                        )}
                                    </div>

                                    {/* Bottom border indicator */}
                                    <div
                                        className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ease-out ${isActive || isHovered ? "w-full" : "w-0"
                                            }`}
                                        style={{ backgroundColor: color }}
                                    ></div>
                                </div>

                                {/* Tech name with animated underline */}
                                <div className="relative">
                                    <span className="text-sm font-medium text-gray-300">
                                        {name}
                                    </span>
                                    <div
                                        className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r transition-all duration-500 ease-out ${isHovered || isActive ? "w-full" : "w-0"
                                            }`}
                                        style={{
                                            backgroundImage: `linear-gradient(to right, ${color}30, ${color}, ${color}30)`
                                        }}
                                    ></div>
                                </div>

                                {/* Proficiency bar that appears on hover */}
                                <div
                                    className={`w-full h-1.5 bg-gray-800 rounded-full overflow-hidden transition-all duration-300 ${isHovered || isActive ? "opacity-100" : "opacity-0"
                                        }`}
                                >
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: isHovered || isActive ? `${proficiency}%` : "0%",
                                            backgroundColor: color
                                        }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Proficiency Legend */}
                <div className="mt-16 flex justify-center">
                    <div className="bg-gray-900 bg-opacity-50 rounded-lg px-6 py-3 flex items-center gap-2 text-sm text-gray-400 border border-gray-800">
                        <span>Hover over technologies to see proficiency levels</span>
                        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden ml-2">
                            <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500"></div>
                        </div>
                    </div>
                </div>

                {/* CSS for custom animations and patterns */}
                <style>{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }

          .animate-float {
            animation: float 5s ease-in-out infinite;
          }

          .bg-grid-pattern {
            background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 10px 10px;
          }
        `}</style>
            </div>
        </section>
    );
}
