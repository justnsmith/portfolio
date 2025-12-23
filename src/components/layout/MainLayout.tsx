import { useRef, useEffect, useCallback } from "react";
import { useMousePosition, useIsLargeScreen } from "../../hooks";
import Hero from "../Hero";
import About from "../About";
import TechStack from "../TechStack";
import Experience from "../Experience";
import Projects from "../Projects";

export default function MainLayout() {
    const leftRef = useRef<HTMLDivElement>(null);
    const rightScrollRef = useRef<HTMLDivElement>(null);
    const mousePos = useMousePosition();
    const isLargeScreen = useIsLargeScreen();

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
        <div className="relative min-h-screen text-white bg-gray-900">
            {/* Mouse gradient effect */}
            <div
                className="pointer-events-none fixed inset-0 z-0 transition-all duration-200"
                style={{
                    background: `radial-gradient(200px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.1), transparent 80%)`,
                }}
            />

            {isLargeScreen ? (
                <div className="flex flex-row h-screen">
                    <div ref={leftRef} className="w-1/2 h-screen overflow-hidden z-10">
                        <Hero isMobileView={false} />
                    </div>

                    <div
                        ref={rightScrollRef}
                        className="w-1/2 h-screen overflow-y-auto z-10 space-y-16 pb-24"
                    >
                        <About />
                        <TechStack />
                        <Experience />
                        <Projects />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col min-h-screen bg-gray-900 z-10 space-y-16 pb-24">
                    <Hero isMobileView={true} />
                    <About />
                    <TechStack />
                    <Experience />
                    <Projects />
                </div>
            )}
        </div>
    );
}
