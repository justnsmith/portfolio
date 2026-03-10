import { useNavigate } from "react-router-dom";
import { useMousePosition } from "@hooks";
import { PageLayoutProps } from "@types";

export default function PageLayout({ children, maxWidth = "max-w-5xl" }: PageLayoutProps) {
    const navigate = useNavigate();
    const mousePos = useMousePosition();

    return (
        <div className="relative min-h-screen" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            {/* Ambient mouse glow */}
            <div
                className="pointer-events-none fixed inset-0 z-0 transition-all duration-300"
                style={{
                    background: `radial-gradient(350px at ${mousePos.x}px ${mousePos.y}px, rgba(34, 211, 238, 0.05), transparent 70%)`,
                }}
            />

            <div className={`${maxWidth} mx-auto p-6 sm:p-8 md:p-12 relative z-10`}>
                {/* Back button */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-sm transition-all duration-200"
                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Justin Smith</span>
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}
