import { useRef, useEffect, useCallback, useState } from "react";
import { useMousePosition, useIsLargeScreen } from "@hooks";
import Hero from "@components/Hero";
import About from "@components/About";
import TechStack from "@components/TechStack";
import Experience from "@components/Experience";
import Projects from "@components/Projects";
import ContactModal from "@components/ui/ContactModal";
import CustomScrollbar from "@components/ui/CustomScrollbar";
import MobileProgressBar from "@components/ui/MobileProgressBar";

export default function MainLayout() {
    const leftRef = useRef<HTMLDivElement>(null);
    const rightScrollRef = useRef<HTMLDivElement>(null);
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
        <>
            <div className="relative min-h-screen text-white" style={{ backgroundColor: 'var(--bg-base)' }}>
                {/* Ambient mouse glow */}
                <div
                    className="pointer-events-none fixed inset-0 z-0 transition-all duration-300"
                    style={{
                        background: `radial-gradient(350px at ${mousePos.x}px ${mousePos.y}px, rgba(34, 211, 238, 0.055), transparent 70%)`,
                    }}
                />

                {/* Subtle vignette at edges */}
                <div
                    className="pointer-events-none fixed inset-0 z-0"
                    style={{
                        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)',
                    }}
                />

                {isLargeScreen ? (
                    <div className="flex flex-row h-screen">
                        <div ref={leftRef} className="w-1/2 h-screen overflow-hidden z-10">
                            <Hero isMobileView={false} onContactClick={() => setIsContactModalOpen(true)} />
                        </div>
                        <div className="relative w-1/2 h-screen z-10">
                            <div
                                ref={rightScrollRef}
                                className="h-full overflow-y-auto pb-24"
                            >
                                <About />
                                <TechStack />
                                <Experience />
                                <Projects />
                            </div>
                            <CustomScrollbar scrollRef={rightScrollRef} />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col min-h-screen z-10 pb-24" style={{ backgroundColor: 'var(--bg-base)' }}>
                        <MobileProgressBar />
                        <Hero isMobileView={true} onContactClick={() => setIsContactModalOpen(true)} />
                        <About />
                        <TechStack />
                        <Experience />
                        <Projects />
                    </div>
                )}
            </div>

            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </>
    );
}
