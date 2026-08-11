import Section from "@ui/Section";

const groups: { label: string; items: string[] }[] = [
    { label: "Languages", items: ["C++", "C", "Go", "Python", "Java", "TypeScript"] },
    { label: "Systems", items: ["Raft", "LSM storage engines", "epoll / kqueue", "gRPC", "asyncio"] },
    { label: "Data & infra", items: ["PostgreSQL", "Redis", "AWS S3", "Docker", "Terraform"] },
    { label: "Web", items: ["React", "Next.js", "Node.js", "Tailwind CSS", "Vite"] },
];

export default function TechStack() {
    return (
        <Section id="skills" label="Skills" delay={360}>
            <div className="deflist">
                {groups.map(group => (
                    <div className="defrow" key={group.label}>
                        <div className="t-meta" style={{ paddingTop: "0.3rem" }}>
                            {group.label}
                        </div>
                        <div style={{ fontSize: "1rem" }}>{group.items.join(", ")}</div>
                    </div>
                ))}
            </div>
        </Section>
    );
}
