export interface Project {
    id: string;
    year: number;
    title: string;
    date: string;
    tech: string[];
    description: string;
    bullets: string[];
    url?: string;
    internalUrl?: string;
    githubUrl?: string;
    madeFor: string;
    featured?: boolean;
    image?: string;
}

export const projects: Project[] = [
    {
        id: "key-value-store",
        year: 2026,
        title: "Key-Value Store",
        date: "January 2026",
        tech: ["C++", "Go", "Docker", "AWS", "Terraform"],
        description: "A high-performance distributed key-value store featuring an LSM-tree storage engine, crash-safe durability, and multi-node cloud deployment.",
        bullets: [
            "Built a high-concurrency LSM-tree storage engine with Write-Ahead Logging for durability and crash recovery",
            "Implemented SSTables with Bloom filters for fast point lookups and efficient range scans",
            "Designed an LRU cache and multi-threaded background compaction to sustain high write throughput",
            "Developed a concurrent TCP server using a custom binary protocol for CRUD and scan operations",
            "Built a Go CLI client for remote interaction with the server",
            "Wrote a benchmarking suite achieving 1.1M ops/sec on 100B values while maintaining thread safety and integrity",
            "Containerized the full system with Docker and deployed a multi-node cluster to AWS EC2 using Terraform",
            "Automated cluster setup, configuration, and orchestration with shell scripts and docker-compose"
        ],
        githubUrl: "https://github.com/justnsmith/kv-store",
        madeFor: "Personal",
        featured: true,
        image: "/projects/kv-store.png"
    },
    {
        id: "pantry-pals",
        year: 2025,
        title: "Pantry Pals",
        date: "December 2025",
        tech: ["Next.js", "PostgreSQL", "Prisma", "TypeScript", "Vercel"],
        description: "A collaborative full-stack pantry management application helping users track ingredients, manage shopping lists, and discover recipes. Led backend architecture for a team of 9 developers.",
        bullets: [
            "Led backend development for a team of 9, architecting the PostgreSQL database schema and implementing Prisma ORM for type-safe data access",
            "Engineered secure user authentication system with JWT token-based sessions, including email verification and password reset functionality",
            "Designed and implemented RESTful API endpoints for pantry inventory, shopping lists, and recipe management with proper authorization middleware",
            "Established CI/CD pipeline with GitHub Actions and deployed to Vercel with automated database migrations",
            "Implemented real-time data synchronization for shared pantry lists, enabling seamless collaboration between household members",
            "Optimized database queries and implemented caching strategies to handle concurrent user operations efficiently"
        ],
        url: "https://pantry-pals.vercel.app",
        githubUrl: "https://github.com/pantry-pals",
        madeFor: "College",
        featured: true,
        image: "/projects/pantry-pals.png"
    },
    {
        id: "rubiks-cube-solver",
        year: 2025,
        title: "Rubik's Cube Solver",
        date: "October 2025",
        tech: ["C++"],
        description: "An interactive Rubik's Cube solver implementing the beginner's method algorithm with a colorful terminal-based visualization and complete solving capability.",
        bullets: [
            "Implemented the beginner's method solving algorithm with functions for each phase: white cross, white corners, middle layer, yellow cross, and final positioning",
            "Designed object-oriented architecture with encapsulated Cube and Side classes to manage state and rotations efficiently",
            "Created colorful ANSI terminal visualization to display the cube's current state with proper color-coding for each face",
            "Developed 16 distinct move operations (left, right, middle, top, bottom rotations) with inverse move logic for algorithm execution",
            "Built scramble generation function with random move sequences to create solvable cube configurations for testing",
            "Implemented comprehensive piece-finding algorithms to locate edges and corners during solving phases"
        ],
        githubUrl: "https://github.com/justnsmith/rubiks-cube-solver",
        madeFor: "Personal",
        featured: false,
    },
    {
        id: "custom-memory-allocator",
        year: 2025,
        title: "Custom Memory Allocator + Visualizer",
        date: "April 2025",
        tech: ["C", "Typescript", "TailwindCSS"],
        description: "A custom memory allocator designed to replace standard memory management functions (malloc, free, realloc). It includes a visualizer to analyze memory fragmentation, allocation strategies, and overall memory usage.",
        bullets: [
            "Engineered a custom memory allocator to handle memory allocation and deallocation, replacing standard functions like malloc, free, and realloc",
            "Developed an interactive visualizer to demonstrate memory fragmentation and visualize various allocation strategies in real time",
            "Created a user-friendly interface for easy monitoring of memory usage and performance",
            "Optimized memory utilization and system performance through advanced data structures and algorithms",
            "Conducted rigorous testing to ensure the reliability, correctness, and stability of the allocator"
        ],
        internalUrl: "/projects/custom-memory-allocator",
        githubUrl: "https://github.com/justnsmith/custom-allocator-c",
        madeFor: "Personal",
        featured: true,
        image: "/projects/memory-allocator.png"
    },
    {
        id: "image-processing-service",
        year: 2025,
        title: "Image Processing Service",
        date: "April 2025",
        tech: ["AWS S3", "Docker", "Go", "PostgreSQL", "Redis", "Typescript", "TailwindCSS"],
        description: "A full-stack image processing application with advanced backend services for secure storage, efficient processing, and dependable data management.",
        bullets: [
            "Implemented secure user authentication with JWT token-based authentication, email verification, and password reset functionality",
            "Designed scalable storage solution using S3 bucket integration, Redis caching, and PostgreSQL metadata management",
            "Built backend image processing capabilities including resize, crop, and filter application using Go imaging libraries",
            "Created a responsive React frontend with TypeScript and Tailwind CSS for a user-friendly interface",
            "Developed complete API endpoints for user and image management with proper authentication and authorization"
        ],
        url: "https://image-processing-service-nk16.onrender.com",
        githubUrl: "https://github.com/justnsmith/image-processing-service",
        madeFor: "Personal",
        featured: true,
        image: "/projects/image-processing-service.png"
    },
    {
        id: "portfolio-website",
        year: 2025,
        title: "Portfolio Website",
        date: "January 2025",
        tech: ["React", "Tailwind CSS", "Vite"],
        description: "Personal portfolio website showcasing projects and experience.",
        bullets: [
            "Built responsive portfolio with React and TypeScript",
            "Implemented smooth scrolling and section tracking",
            "Created custom animations and transitions",
            "Optimized for performance and accessibility"
        ],
        githubUrl: "https://github.com/justnsmith/justnsmith.github.io",
        madeFor: "Personal",
        featured: false,
    },
    {
        id: "puzzle-game",
        year: 2025,
        title: "Puzzle Game",
        date: "January 2025",
        tech: ["C++"],
        description: "Interactive puzzle game built with C++.",
        bullets: [
            "Developed game logic and mechanics in C++",
            "Implemented efficient algorithms for puzzle solving",
            "Created user interface for game interaction",
            "Optimized performance for smooth gameplay"
        ],
        githubUrl: "https://github.com/justnsmith/puzzlegame",
        madeFor: "Personal",
        featured: false,
    },
    {
        id: "study-buddy",
        year: 2024,
        title: "Study Buddy",
        date: "December 2024",
        tech: ["React", "PostgreSQL", "Vercel"],
        description: "A full-stack web application connecting students for study sessions with authentication, user management, and calendar features.",
        bullets: [
            "Developed a full-stack web application to connect students for study sessions",
            "Implemented authentication and user management features including email verification and password reset",
            "Designed and developed user-friendly interfaces for joining or creating study groups",
            "Deployed the application using Vercel for fast and efficient hosting",
            "Collaborated on creating a calendar feature to help users manage their joined study sessions"
        ],
        githubUrl: "https://thesoftwaredevelopers.github.io",
        madeFor: "College",
        featured: false,
        image: "/projects/study-buddy.png"
    },
    {
        id: "polynesian-navigation",
        year: 2024,
        title: "Polynesian Navigation Route Planner",
        date: "November 2024",
        tech: ["Java"],
        description: "Route planning algorithm for Polynesian navigation.",
        bullets: [
            "Implemented graph algorithms for route optimization",
            "Optimized performance for large datasets",
            "Created visualization for navigation routes",
            "Applied historical navigation techniques"
        ],
        githubUrl: "https://github.com/justnsmith/ics311-assignment5",
        madeFor: "College",
        featured: false
    },
    {
        id: "data-encryption",
        year: 2024,
        title: "Data Encryption",
        date: "November 2024",
        tech: ["Java"],
        description: "Implementation of various encryption algorithms.",
        bullets: [
            "Implemented multiple encryption algorithms",
            "Created secure key management system",
            "Built CLI for encryption/decryption operations",
            "Ensured cryptographic best practices"
        ],
        githubUrl: "https://github.com/justnsmith/ics311-assignment7",
        madeFor: "College",
        featured: false
    },
    {
        id: "bank-database",
        year: 2024,
        title: "Bank Database",
        date: "July 2024",
        tech: ["C"],
        description: "A banking system for managing customer records using linked lists and text file storage with robust error handling.",
        bullets: [
            "Developed a banking system to manage customer records using linked lists and text file storage",
            "Implemented essential banking functions such as adding, deleting, and modifying accounts",
            "Designed an intuitive text-based user interface for ease of interaction",
            "Added error handling to ensure robust operation under various edge cases",
            "Created automated tests to validate banking operations and ensure system stability"
        ],
        githubUrl: "https://github.com/justnsmith/ICS212/tree/main/project1",
        madeFor: "College",
        featured: false,
    }
];

// Helper functions
export const getFeaturedProjects = () => projects.filter(p => p.featured);
export const getProjectById = (id: string) => projects.find(p => p.id === id);
export const getProjectsByYear = () => {
    const grouped = projects.reduce((acc, project) => {
        if (!acc[project.year]) acc[project.year] = [];
        acc[project.year].push(project);
        return acc;
    }, {} as Record<number, Project[]>);
    return grouped;
};
