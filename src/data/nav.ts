export interface NavSection {
    id: string;
    label: string;
}

export const sections: NavSection[] = [
    { id: "about", label: "About" },
    { id: "now", label: "Now" },
    { id: "projects", label: "Projects" },
    { id: "writeups", label: "Writeups" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
];

export const sectionIds = sections.map(s => s.id);

export const profile = {
    name: "Justin Smith",
    credential: "Incoming M.S. Computer Science · Georgia Tech, Computing Systems",
    role: "Distributed systems and backend infrastructure · Ewa Beach, Hawaiʻi",
    email: "justnwsmith@gmail.com",
    github: "https://github.com/justnsmith",
    linkedin: "https://linkedin.com/in/justnsmith",
    resume: "/resume.pdf",
};
