import { useEffect, useRef, useState, useCallback, RefObject } from 'react';

interface Props {
    scrollRef: RefObject<HTMLDivElement | null>;
}

export default function CustomScrollbar({ scrollRef }: Props) {
    const [progress, setProgress] = useState(0);
    const trackRef = useRef<HTMLDivElement>(null);

    const computeProgress = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const { scrollTop, scrollHeight, clientHeight } = el;
        const max = scrollHeight - clientHeight;
        setProgress(max > 0 ? scrollTop / max : 0);
    }, [scrollRef]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener('scroll', computeProgress, { passive: true });
        computeProgress();
        const ro = new ResizeObserver(computeProgress);
        ro.observe(el);
        return () => {
            el.removeEventListener('scroll', computeProgress);
            ro.disconnect();
        };
    }, [scrollRef, computeProgress]);

    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = scrollRef.current;
        const track = trackRef.current;
        if (!el || !track) return;
        const { top, height } = track.getBoundingClientRect();
        const ratio = (e.clientY - top) / height;
        el.scrollTo({ top: ratio * (el.scrollHeight - el.clientHeight), behavior: 'smooth' });
    };

    const dotTop = `calc(${progress * 100}% - 4px)`;

    return (
        <div
            ref={trackRef}
            onClick={handleTrackClick}
            title="Click to navigate"
            style={{
                position: 'absolute',
                right: '6px',
                top: '16px',
                bottom: '16px',
                width: '2px',
                cursor: 'pointer',
                borderRadius: '99px',
                background: 'rgba(255,255,255,0.05)',
                zIndex: 50,
            }}
        >
            {/* Filled progress */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${progress * 100}%`,
                    borderRadius: '99px',
                    background: 'linear-gradient(to bottom, rgba(34,211,238,0.3), var(--accent))',
                    boxShadow: '0 0 6px 1px rgba(34,211,238,0.25)',
                    transition: 'height 0.08s linear',
                    willChange: 'height',
                }}
            />

            {/* Glowing tip dot */}
            <div
                style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    top: dotTop,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 10px 3px rgba(34,211,238,0.7), 0 0 4px 1px rgba(34,211,238,0.9)',
                    transition: 'top 0.08s linear',
                    willChange: 'top',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
}
