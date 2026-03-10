import { useEffect, useState } from 'react';

export default function MobileProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const max = scrollHeight - clientHeight;
            setProgress(max > 0 ? scrollTop / max : 0);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
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
            {/* Filled progress */}
            <div
                style={{
                    height: '100%',
                    width: `${progress * 100}%`,
                    background: 'linear-gradient(to right, rgba(34,211,238,0.3), var(--accent))',
                    boxShadow: '0 0 6px 1px rgba(34,211,238,0.25)',
                    transition: 'width 0.08s linear',
                    willChange: 'width',
                    borderRadius: '0 99px 99px 0',
                }}
            />

            {/* Glowing tip dot */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: `${progress * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 10px 3px rgba(34,211,238,0.7), 0 0 4px 1px rgba(34,211,238,0.9)',
                    transition: 'left 0.08s linear',
                    willChange: 'left',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
}
