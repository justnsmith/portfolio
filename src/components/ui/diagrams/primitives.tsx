import type { ReactNode } from "react";

/**
 * Shared pieces for the writeup diagrams.
 *
 * These are inline SVG, not image files, so the labels use the page's own
 * fonts and every colour is a CSS variable. An external .svg loaded through
 * <img> is an isolated document: it can't reach the site's webfonts or tokens,
 * and the type would fall back to whatever generic family the browser picks.
 */

export const MONO = "var(--font-mono)";

/** Arrowhead marker. Declare once per <svg> via <Defs />. */
export function Defs() {
    return (
        <defs>
            <marker
                id="dgm-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
            >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--rule-strong)" />
            </marker>
        </defs>
    );
}

interface BoxProps {
    x: number;
    y: number;
    w: number;
    h: number;
    /** Draw the border in the accent colour, for the step that matters most. */
    accent?: boolean;
    /** Fill with the tinted paper, for grouping containers. */
    tint?: boolean;
    children?: ReactNode;
}

export function Box({ x, y, w, h, accent, tint, children }: BoxProps) {
    return (
        <>
            <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx="2"
                fill={tint ? "var(--paper-tint)" : "var(--paper)"}
                stroke={accent ? "var(--accent)" : "var(--rule-strong)"}
                strokeWidth="1"
            />
            {children}
        </>
    );
}

interface LabelProps {
    x: number;
    y: number;
    size?: number;
    fill?: string;
    anchor?: "start" | "middle" | "end";
    caps?: boolean;
    children: ReactNode;
}

export function Label({
    x,
    y,
    size = 12,
    fill = "var(--ink)",
    anchor = "middle",
    caps,
    children,
}: LabelProps) {
    return (
        <text
            x={x}
            y={y}
            fontFamily={MONO}
            fontSize={size}
            fill={fill}
            textAnchor={anchor}
            dominantBaseline="middle"
            {...(caps ? { letterSpacing: "0.1em" } : {})}
        >
            {children}
        </text>
    );
}

/** A straight connector with an arrowhead on the far end. */
export function Arrow({
    x1,
    y1,
    x2,
    y2,
    dashed,
}: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    dashed?: boolean;
}) {
    return (
        <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--rule-strong)"
            strokeWidth="1"
            markerEnd="url(#dgm-arrow)"
            {...(dashed ? { strokeDasharray: "3 3" } : {})}
        />
    );
}

export function Figure({ caption, children }: { caption: string; children: ReactNode }) {
    return (
        <figure className="dgm">
            {children}
            <figcaption className="t-mono">{caption}</figcaption>
        </figure>
    );
}
