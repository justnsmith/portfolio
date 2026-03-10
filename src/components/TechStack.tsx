"use client";
import { useState, useEffect } from "react";
import SectionHeading from '@components/ui/SectionHeading';
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
import { DiJava } from "react-icons/di";

const tech = [
    { name: "C",           icon: SiC,           color: "#A8B9CC", category: "Languages" },
    { name: "C++",         icon: SiCplusplus,   color: "#00599C", category: "Languages" },
    { name: "Go",          icon: SiGo,           color: "#00ADD8", category: "Languages" },
    { name: "Python",      icon: SiPython,       color: "#3776ab", category: "Languages" },
    { name: "Java",        icon: DiJava,         color: "#f80000", category: "Languages" },
    { name: "TypeScript",  icon: SiTypescript,   color: "#3178c6", category: "Languages" },
    { name: "React",       icon: SiReact,        color: "#61dafb", category: "Frontend" },
    { name: "Tailwind",    icon: SiTailwindcss,  color: "#38bdf8", category: "Frontend" },
    { name: "Node.js",     icon: SiNodedotjs,    color: "#83cd29", category: "Backend" },
    { name: "PostgreSQL",  icon: SiPostgresql,   color: "#336791", category: "Backend" },
    { name: "Git",         icon: SiGit,          color: "#f1502f", category: "Tools" },
    { name: "Docker",      icon: SiDocker,       color: "#2496ED", category: "Tools" },
];

export default function TechStack() {
    const [isInView, setIsInView] = useState(false);
    const [hoveredTech, setHoveredTech] = useState<string | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) setIsInView(true); },
            { threshold: 0.2 }
        );
        const section = document.getElementById("tech");
        if (section) observer.observe(section);
        return () => { if (section) observer.unobserve(section); };
    }, []);

    return (
        <section id="tech" className="px-8 sm:px-12 md:px-14 lg:px-16 pt-20 pb-32 scroll-mt-28">
            <div className="max-w-2xl">
                <SectionHeading title="Tech Stack" />

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                    {tech.map(({ name, icon: Icon, color }, index) => {
                        const isHovered = hoveredTech === name;

                        return (
                            <div
                                key={name}
                                className={`group flex flex-col items-center gap-2.5 transition-all duration-500 ${
                                    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                                }`}
                                style={{ transitionDelay: `${index * 60}ms` }}
                                onMouseEnter={() => setHoveredTech(name)}
                                onMouseLeave={() => setHoveredTech(null)}
                            >
                                <div
                                    className="relative w-14 h-14 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-250"
                                    style={{
                                        background: isHovered
                                            ? `${color}14`
                                            : 'rgba(255,255,255,0.03)',
                                        border: isHovered
                                            ? `1px solid ${color}40`
                                            : '1px solid var(--border)',
                                        transform: isHovered ? 'translateY(-2px)' : 'none',
                                        boxShadow: isHovered ? `0 8px 24px ${color}20` : 'none',
                                    }}
                                >
                                    <Icon
                                        style={{
                                            color: isHovered ? color : 'var(--text-muted)',
                                            fontSize: '1.75rem',
                                            transition: 'color 250ms ease'
                                        }}
                                    />
                                </div>

                                <span
                                    className="text-center transition-colors duration-250"
                                    style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.68rem',
                                        color: isHovered ? 'var(--text-primary)' : 'var(--text-muted)',
                                        letterSpacing: '0.02em'
                                    }}
                                >
                                    {name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
