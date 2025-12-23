// Project related types
export interface Project {
    id: string;
    year: number;
    title: string;
    date: string;
    tech: string[];
    description: string;
    bullets: string[];
    url?: string;
    githubUrl?: string;
    madeFor: string;
    featured?: boolean;
}

// Form related types
export interface FormData {
    name: string;
    email: string;
    message: string;
}

export interface FormStatus {
    submitting: boolean;
    success: boolean;
    error: boolean;
    message: string;
}

// Navigation related types
export interface NavigationSection {
    id: string;
    label: string;
}

// Mouse position type
export interface MousePosition {
    x: number;
    y: number;
}

// Component prop types
export interface HeroProps {
    isMobileView: boolean;
}

export interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    activeSection: string;
    sectionIds: string[];
    onNavigate: (id: string) => void;
}

export interface NavigationLinksProps {
    sectionIds: string[];
    activeSection: string;
    onNavigate: (id: string) => void;
}

export interface PageLayoutProps {
    children: React.ReactNode;
    maxWidth?: string;
}
