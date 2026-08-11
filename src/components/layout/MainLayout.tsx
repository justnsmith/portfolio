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
import MenuSheet from "@ui/MenuSheet";
import { useActiveSection, useSectionScroller } from "@hooks";
import { sectionIds } from "@data/nav";

export default function MainLayout() {
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const activeSection = useActiveSection(sectionIds);
    const handleNavigate = useSectionScroller();

    return (
        <>
            <StickyBar
                activeSection={activeSection}
                onNavigate={handleNavigate}
                onMenuOpen={() => setIsMenuOpen(true)}
                menuOpen={isMenuOpen}
            />

            <div id="top" className="pg-wrap">
                <SiteHeader
                    activeSection={activeSection}
                    onNavigate={handleNavigate}
                    onContactClick={() => setIsContactOpen(true)}
                    onMenuOpen={() => setIsMenuOpen(true)}
                    menuOpen={isMenuOpen}
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

            <MenuSheet
                open={isMenuOpen}
                activeSection={activeSection}
                onClose={() => setIsMenuOpen(false)}
                onNavigate={handleNavigate}
                onContactClick={() => setIsContactOpen(true)}
            />

            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </>
    );
}
