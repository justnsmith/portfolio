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
        id: "island-elevate",
        year: 2026,
        title: "Island Elevate",
        date: "March 2026",
        tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Vercel", "Cloudflare", "Supabase", "NeonDB"],
        description: "Co-founded a web services business building professional websites for small local businesses in Hawaii — handling design, domains, email, and hosting end-to-end.",
        bullets: [
            "Co-founded and built the technical platform powering a web services business serving local Hawaii businesses",
            "Designed and developed custom, mobile-first websites for local clients including restaurants, auto shops, and landscaping companies",
            "Engineered the full hosting and deployment pipeline using Vercel, Cloudflare DNS, and custom domain configuration",
            "Set up professional business email provisioning and DNS management for each client",
            "Building a client dashboard with Supabase and NeonDB where customers can log in to view their site analytics and data",
            "Handled cloud infrastructure, database architecture, and backend API development for the central platform"
        ],
        url: "https://islandelevate.com",
        madeFor: "Personal",
        featured: false,
        image: "/projects/island-elevate.png"
    },
    {
        id: "caldera-ot-dnp3-simulator",
        year: 2026,
        title: "Caldera OT DNP3 Simulator",
        date: "March 2026",
        tech: ["Python", "DNP3", "asyncio", "pytest", "GitHub Actions"],
        description: "A DNP3 outstation simulator for MITRE Caldera's OT plugin, providing virtual ICS infrastructure with a real-time grid process simulation for cybersecurity adversary emulation testing.",
        bullets: [
            "Built a DNP3 outstation server using dnp3py that accepts TCP connections, processes SCADA requests, and maintains stateful device memory for binary/analog I/O points",
            "Developed a simplified electrical grid process simulation modeling bus voltage and load with breaker and generator controls, updating sensor values on a 0.5s tick cycle",
            "Implemented a live terminal monitor displaying real-time point values with change highlighting for active device state visualization",
            "Created a YAML-based configuration system with typed dataclass validation for server settings and initial point values",
            "Built a test master client for smoke-testing with integrity polls, class polls, delay measurement, and direct operate commands",
            "Set up CI/CD with GitHub Actions running black, ruff, mypy, and pytest with coverage across Python 3.11–3.14"
        ],
        githubUrl: "https://github.com/justnsmith/caldera-ot-dnp3-simulator",
        madeFor: "College",
        featured: false,
        image: "/projects/caldera-ot-dnp3.png"
    },
    {
        id: "mcp-alpha-vantage",
        year: 2026,
        title: "MCP Alpha Vantage Server",
        date: "March 2026",
        tech: ["Python", "MCP", "Alpha Vantage API", "asyncio", "pytest"],
        description: "An open-source MCP server that exposes Alpha Vantage market data to LLM clients — enabling stock quotes, technical indicators, portfolio tracking, news sentiment, and more directly within AI conversations.",
        bullets: [
            "Built 12 MCP tools covering stock quotes, daily prices, company fundamentals, technical indicators (RSI, MACD, BBANDS), earnings history, and news sentiment analysis",
            "Implemented composite tools for portfolio snapshots with real-time P&L, stock screening with AND-filtered criteria, and multi-symbol comparison with standout detection",
            "Designed an in-memory TTL caching layer with per-endpoint expiration to minimize API quota usage on Alpha Vantage's free tier",
            "Supports both stdio (Claude Desktop) and HTTP transport modes for flexible client integration",
            "Set up CI with GitHub Actions running black, ruff, mypy, and pytest across Python 3.10–3.12"
        ],
        githubUrl: "https://github.com/justnsmith/mcp-alpha-vantage",
        madeFor: "Personal",
        featured: false,
        image: "/projects/mcp-alpha-vantage.png"
    },
    {
        id: "key-value-store",
        year: 2026,
        title: "Distributed Key-Value Storage",
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
        tech: ["C", "TypeScript", "TailwindCSS"],
        description: "A high-performance custom heap allocator in C with multiple allocation strategies, integrity checks, and a real-time visualizer for analyzing fragmentation, memory efficiency, and allocation behavior.",
        bullets: [
            "Implemented a custom heap allocator supporting First-Fit, Best-Fit, and Worst-Fit strategies, achieving 96M ops/sec with <1% fragmentation on a fixed-size, single-threaded heap",
            "Designed an explicit free-list with 24-byte block headers, alignment, and coalescing, reaching 84% memory efficiency",
            "Built a benchmarking framework to measure allocation speed, fragmentation, and memory overhead",
            "Added heap integrity checks to detect double-free, use-after-free, and memory corruption across 30+ edge cases",
            "Developed an interactive visualizer in TypeScript and TailwindCSS to analyze heap behavior and fragmentation in real time"
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
