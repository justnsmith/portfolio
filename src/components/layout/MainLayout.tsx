import { useState } from "react";
import SiteHeader from "@components/SiteHeader";
import StickyBar from "@components/StickyBar";
import About from "@components/About";
import Now from "@components/Now";
import Projects from "@components/Projects";
import Writeups from "@components/Writeups";
import Experience from "@components/Experience";
import Education from "@components/Education";
import TechStack from "@components/TechStack";
import SiteFooter from "@components/SiteFooter";
import MenuSheet from "@ui/MenuSheet";
import { useActiveSection, useSectionScroller } from "@hooks";
import { sectionIds } from "@data/nav";

export default function MainLayout() {
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
                    onMenuOpen={() => setIsMenuOpen(true)}
                    menuOpen={isMenuOpen}
                />
            </div>

            <hr className="rule" />

            <main className="pg-wrap">
                <About />
                <Now />
                <Projects />
                <Writeups />
                <Experience />
                <Education />
                <TechStack />
            </main>

            <div className="pg-wrap">
                <SiteFooter />
            </div>

            <MenuSheet
                open={isMenuOpen}
                activeSection={activeSection}
                onClose={() => setIsMenuOpen(false)}
                onNavigate={handleNavigate}
            />
        </>
    );
}
