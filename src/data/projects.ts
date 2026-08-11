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
        id: "grid-watch",
        year: 2026,
        title: "Grid Watch: DNP3 Grid Sandbox for MITRE Caldera",
        date: "May 2026",
        tech: ["Python", "DNP3", "asyncio", "MITRE Caldera for OT"],
        description: "A DNP3 electrical-grid outstation simulator that acts as a realistic attack target for MITRE Caldera for OT, letting a red-team framework run adversary techniques against a safe stand-in for substation hardware. Built with a team of four students and MITRE collaborators.",
        bullets: [
            "Wrote the low-level protocol layer from the DNP3 spec: a link layer with table-driven CRC-16, fixed-block framing, multi-frame reassembly, and partial-read tolerance",
            "Wrote a custom application-layer response parser after the library's own decoder turned out to return empty results",
            "Single-process asyncio throughout, with strict type checking and a test suite gated at 100% coverage",
            "Ships a virtual DNP3 outstation, an HMI, adversary scenarios, and example Caldera for OT profiles"
        ],
        githubUrl: "https://github.com/mitre/grid-watch",
        madeFor: "College",
        featured: true
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
        id: "fluxmq",
        year: 2026,
        title: "FluxMQ: Distributed Message Queue",
        date: "March 2026",
        tech: ["C++20", "epoll", "kqueue", "Replication"],
        description: "A Kafka-style distributed message queue written from scratch in C++20, with zero third-party runtime dependencies.",
        bullets: [
            "A single-threaded reactor over epoll and kqueue handles all I/O behind one interface",
            "Messages persist to a segmented log with a sparse index and append-only writes",
            "Brokers replicate pull-based with in-sync-replica tracking and a high watermark, so consumers never see uncommitted records, and leader election fences stale leaders by epoch",
            "A length-prefixed wire protocol with correlation-ID pipelining and real v0/v1 versioning",
            "Tested with fault injection, including a failover test that SIGKILLs the leader mid-workload and asserts zero message loss"
        ],
        githubUrl: "https://github.com/justnsmith/FluxMQ",
        madeFor: "Personal",
        featured: true
    },
    {
        id: "distributed-kv-store",
        year: 2026,
        title: "Distributed Key-Value Store (Raft + LSM)",
        date: "February 2026",
        tech: ["C++20", "Raft", "LSM-tree", "Bloom filters", "WAL"],
        description: "A replicated key-value store written from scratch in C++20 — two systems in one: a log-structured storage engine, and a Raft consensus layer that keeps three nodes in agreement through failures.",
        bullets: [
            "Built a full LSM tree: memtable and write-ahead log flushed to Bloom-filtered SSTables and compacted in levels in the background, with a single batched writer thread and fully parallel reads",
            "Implemented Raft from the extended paper — leader election, log replication, the §5.4 safety rules, conflict-term fast log backup, and snapshotting",
            "Tested in three tiers, including a chaos harness that kills leaders and destroys quorum mid-write"
        ],
        githubUrl: "https://github.com/justnsmith/KVRaft",
        madeFor: "Personal",
        featured: true
    },
    {
        id: "image-processing-service",
        year: 2026,
        title: "Async Image Processing Service (REST + gRPC)",
        date: "February 2026",
        tech: ["Go", "gRPC", "AWS S3", "Redis", "PostgreSQL"],
        description: "An async image-processing backend in Go. Uploads return in milliseconds; the resize, crop, and tint work runs off the request path in a background worker pool.",
        bullets: [
            "Serves the same core logic over both REST and gRPC as thin adapters over one transport-agnostic package, including a client-streaming upload and a server-streaming status watch that replaces polling",
            "Raised throughput 7.7× (37.5 to 287 images/sec) via a worker pool sized to available cores and a pixel-loop rewrite cutting 4.1M allocations per image to 2",
            "S3 for storage, Redis for the queue, and Postgres tracking job state",
            "Secured with JWT and bcrypt; tested under Go's race detector"
        ],
        githubUrl: "https://github.com/justnsmith/image-processing-service",
        madeFor: "Personal",
        featured: true,
        image: "/projects/image-processing-service.png"
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
        featured: false,
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
