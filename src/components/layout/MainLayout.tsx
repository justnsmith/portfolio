import { useState } from "react";
import SiteHeader from "@components/SiteHeader";
import StickyBar from "@components/StickyBar";
import About from "@components/About";
import Now from "@components/Now";
import Projects from "@components/Projects";
import Experience from "@components/Experience";
import Education from "@components/Education";
import TechStack from "@components/TechStack";
import SiteFooter from "@components/SiteFooter";
import ContactModal from "@ui/ContactModal";
import { useActiveSection, useSectionScroller } from "@hooks";
import { sectionIds } from "@data/nav";

export default function MainLayout() {
    const [isContactOpen, setIsContactOpen] = useState(false);
    const activeSection = useActiveSection(sectionIds);
    const handleNavigate = useSectionScroller();

    return (
        <>
            <StickyBar activeSection={activeSection} onNavigate={handleNavigate} />

            <div id="top" className="pg-wrap">
                <SiteHeader
                    activeSection={activeSection}
                    onNavigate={handleNavigate}
                    onContactClick={() => setIsContactOpen(true)}
                />
            </div>

            <hr className="rule" />

            <main className="pg-wrap">
                <About />
                <Now />
                <Projects />
                <Experience />
                <Education />
                <TechStack />
            </main>

            <div className="pg-wrap">
                <SiteFooter onContactClick={() => setIsContactOpen(true)} />
            </div>

            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </>
    );
}
