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
    { name: "C", icon: SiC, color: "#A8B9CC", category: "Languages" },
    { name: "C++", icon: SiCplusplus, color: "#00599C", category: "Languages" },
    { name: "Go", icon: SiGo, color: "#00ADD8", category: "Languages" },
    { name: "Python", icon: SiPython, color: "#3776ab", category: "Languages" },
    {
        name: "Java",
        icon: "java-logo",
        image: "/java-logo.svg",
        color: "#f80000",
        category: "Languages"
    },
    { name: "TypeScript", icon: SiTypescript, color: "#3178c6", category: "Languages" },
    { name: "React", icon: SiReact, color: "#61dafb", category: "Frontend" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38bdf8", category: "Frontend" },
    { name: "Node.js", icon: SiNodedotjs, color: "#83cd29", category: "Backend" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "#336791", category: "Backend" },
    { name: "Git", icon: SiGit, color: "#f1502f", category: "Tools" },
    { name: "Docker", icon: SiDocker, color: "#2496ED", category: "Tools" },
];

export default function TechStack() {
    const [isInView, setIsInView] = useState(false);
    const [hoveredTech, setHoveredTech] = useState<string | null>(null);

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

    return (
        <section
            id="tech"
            className="px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 pt-20 pb-40 scroll-mt-28"
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center mb-16">
                    <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent flex-grow"></div>
                    <h2 className="text-2xl font-bold text-white mx-4 flex items-center">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                            Tech Stack
                        </span>
                    </h2>
                    <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent flex-grow"></div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 sm:gap-8">
                    {tech.map(({ name, icon: Icon, color, image }, index) => {
                        const isHovered = hoveredTech === name;

                        return (
                            <div
                                key={name}
                                className={`group flex flex-col items-center space-y-3 transform transition-all duration-500 ${
                                    isInView
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"
                                }`}
                                style={{
                                    transitionDelay: `${index * 80}ms`,
                                }}
                                onMouseEnter={() => setHoveredTech(name)}
                                onMouseLeave={() => setHoveredTech(null)}
                            >
                                <div
                                    className={`relative w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden ${
                                        isHovered
                                            ? "bg-gray-800 scale-110 shadow-xl"
                                            : "bg-gray-900/80 hover:bg-gray-800/90"
                                    }`}
                                    style={{
                                        boxShadow: isHovered
                                            ? `0 0 30px ${color}40, 0 0 15px ${color}20`
                                            : "",
                                    }}
                                >
                                    {/* Animated gradient border */}
                                    <div
                                        className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                        style={{
                                            background: `linear-gradient(135deg, ${color}20, transparent)`,
                                        }}
                                    ></div>

                                    {/* Subtle grid pattern */}
                                    <div className="absolute inset-0 opacity-5 bg-grid-pattern"></div>

                                    {/* Icon */}
                                    <div
                                        className={`relative z-10 transition-all duration-300 ${
                                            isHovered ? "scale-110" : ""
                                        }`}
                                    >
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={name}
                                                className="w-12 h-12 object-contain transition-all duration-300"
                                                style={{
                                                    filter: isHovered ? "none" : "grayscale(20%)",
                                                }}
                                            />
                                        ) : (
                                            <Icon
                                                style={{ color: color }}
                                                className={`text-4xl transition-all duration-300 ${
                                                    isHovered ? "drop-shadow-lg" : "opacity-90"
                                                }`}
                                            />
                                        )}
                                    </div>


                                </div>

                                {/* Tech name */}
                                <div className="text-center">
                                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                                        {name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <style>{`
                    .bg-grid-pattern {
                        background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
                        background-size: 10px 10px;
                    }
                `}</style>
            </div>
        </section>
    );
}
