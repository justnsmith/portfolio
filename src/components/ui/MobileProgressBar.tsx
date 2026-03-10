import { useEffect, useRef } from 'react';

export default function MobileProgressBar() {
    const fillRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const update = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const max = scrollHeight - clientHeight;
            const pct = max > 0 ? (scrollTop / max) * 100 : 0;
            if (fillRef.current) fillRef.current.style.width = `${pct}%`;
            if (dotRef.current) dotRef.current.style.left = `${pct}%`;
        };

        window.addEventListener('scroll', update, { passive: true });
        update();
        return () => window.removeEventListener('scroll', update);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'rgba(255,255,255,0.05)',
                zIndex: 100,
            }}
        >
            <div
                ref={fillRef}
                style={{
                    height: '100%',
                    width: '0%',
                    background: 'linear-gradient(to right, rgba(34,211,238,0.3), var(--accent))',
                    boxShadow: '0 0 6px 1px rgba(34,211,238,0.25)',
                    borderRadius: '0 99px 99px 0',
                    willChange: 'width',
                }}
            />
            <div
                ref={dotRef}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '0%',
                    transform: 'translate(-50%, -50%)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 10px 3px rgba(34,211,238,0.7), 0 0 4px 1px rgba(34,211,238,0.9)',
                    willChange: 'left',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
}
