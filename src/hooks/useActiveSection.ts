import { useState, useEffect } from "react";

// Hook to track active section via intersection observer
export function useActiveSection(sectionIds: string[]) {
    const [activeSection, setActiveSection] = useState(sectionIds[0]);

    useEffect(() => {
        const sectionIntersections: Record<string, number> = {};

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    sectionIntersections[entry.target.id] = entry.intersectionRatio;

                    let maxRatio = 0;
                    let currentSection = "";

                    Object.keys(sectionIntersections).forEach((id) => {
                        if (sectionIntersections[id] > maxRatio) {
                            maxRatio = sectionIntersections[id];
                            currentSection = id;
                        }
                    });

                    if (maxRatio > 0 && currentSection) {
                        setActiveSection(currentSection);
                    }
                });
            },
            {
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
                rootMargin: "-10% 0px -70% 0px"
            }
        );

        sectionIds.forEach((id) => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [sectionIds]);

    return activeSection;
}
