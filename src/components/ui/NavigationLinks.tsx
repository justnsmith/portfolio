import { useState, useEffect, useRef } from 'react';
import { NavigationLinksProps } from '@types';

export default function NavigationLinks({ sectionIds, activeSection, onNavigate }: NavigationLinksProps) {
    const [clickedSection, setClickedSection] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleNavigate = (id: string) => {
        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setClickedSection(id);
        onNavigate(id);

        // Reset clicked section after scroll animation completes
        timeoutRef.current = setTimeout(() => {
            setClickedSection(null);
        }, 1500);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Use clicked section if available, otherwise use active section
    const displayActiveSection = clickedSection !== null ? clickedSection : activeSection;

    return (
        <div className="flex flex-col gap-8 mb-8">
            {sectionIds.map((id) => (
                <button
                    key={id}
                    onClick={() => handleNavigate(id)}
                    className={`relative text-sm font-medium transition-all duration-300 hover:text-white group ${
                        displayActiveSection === id
                            ? "text-white scale-110"
                            : "text-gray-400"
                    }`}
                >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                    <span
                        className={`absolute left-0 bottom-0 w-full h-0.5 bg-indigo-500 transform origin-left transition-transform duration-300 ${
                            displayActiveSection === id ? 'scale-x-100' : 'scale-x-0'
                        }`}
                    />
                </button>
            ))}
        </div>
    );
}
