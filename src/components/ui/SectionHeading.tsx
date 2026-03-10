interface Props {
    title: string;
    className?: string;
}

export default function SectionHeading({ title, className = '' }: Props) {
    return (
        <div className={`flex items-center gap-4 mb-10 ${className}`}>
            {/* Accent square */}
            <div
                style={{
                    width: '5px',
                    height: '5px',
                    background: 'var(--accent)',
                    borderRadius: '1px',
                    flexShrink: 0,
                    boxShadow: '0 0 6px rgba(34,211,238,0.5)',
                }}
            />

            {/* Title */}
            <h2
                style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--text-primary)',
                    fontSize: '1.0625rem',
                    fontWeight: 400,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    margin: 0,
                }}
            >
                {title}
            </h2>

            {/* Fading rule */}
            <div
                style={{
                    flex: 1,
                    height: '1px',
                    background: 'linear-gradient(to right, rgba(34,211,238,0.2) 0%, transparent 100%)',
                }}
            />
        </div>
    );
}
