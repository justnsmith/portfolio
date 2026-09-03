import { Arrow, Box, Defs, Figure, Label } from "./primitives";

const SOFT = "var(--ink-soft)";
const MID = "var(--ink-mid)";

/** contains operator, 1,000 rows. The four counts sum to 1,000. */
const STAGES: { y: number; name: string; detail: string; cost: string; resolved: string }[] = [
    {
        y: 60,
        name: "1  keyword prefilter",
        detail: "hand-curated lexicon, fires on True only",
        cost: "microseconds",
        resolved: "335",
    },
    {
        y: 152,
        name: "2  embedding classifier",
        detail: "MiniLM cosine ≥ 0.75, vectors precomputed",
        cost: "5 s / 1,000 rows",
        resolved: "27",
    },
    {
        y: 244,
        name: "3  BM25 answer cache",
        detail: "same-label retrieval, normalized score ≥ 0.9",
        cost: "sub-millisecond",
        resolved: "115",
    },
];

const LLM_Y = 336;
const X = 128;
const W = 268;
const MIDX = X + W / 2;
const RIGHT = X + W;
const RAIL = 470;

export default function SqlplusCascade() {
    return (
        <Figure caption="The contains operator over 1,000 rows. Each stage answers what it can and passes the rest down; only 523 rows reach the model.">
            <svg viewBox="0 0 600 470" role="img" aria-labelledby="casc-title">
                <title id="casc-title">
                    A four-stage cascade ordered by cost per query. A keyword prefilter resolves
                    335 rows, an embedding classifier 27, a BM25 answer cache 115, and the
                    remaining 523 go to the language model.
                </title>
                <Defs />

                <Label x={MIDX} y={22} size={11} fill={SOFT}>
                    1,000 rows
                </Label>
                <Arrow x1={MIDX} y1={32} x2={MIDX} y2={60} />

                {STAGES.map((stage, i) => (
                    <g key={stage.name}>
                        <Box x={X} y={stage.y} w={W} h={48} />
                        <Label x={MIDX} y={stage.y + 18} size={11.5}>
                            {stage.name}
                        </Label>
                        <Label x={MIDX} y={stage.y + 34} size={9.5} fill={SOFT}>
                            {stage.detail}
                        </Label>

                        {/* Cost per query, in the left margin */}
                        <Label x={X - 16} y={stage.y + 24} size={10} fill={MID} anchor="end">
                            {stage.cost}
                        </Label>

                        {/* Rows resolved here, out to the collector rail */}
                        <Arrow x1={RIGHT} y1={stage.y + 24} x2={RAIL} y2={stage.y + 24} />
                        <Label x={RIGHT + 38} y={stage.y + 12} size={10} fill={MID}>
                            {stage.resolved}
                        </Label>

                        {/* Fall-through to the next stage */}
                        <Arrow
                            x1={MIDX}
                            y1={stage.y + 48}
                            x2={MIDX}
                            y2={i === STAGES.length - 1 ? LLM_Y : STAGES[i + 1].y}
                        />
                        <Label x={MIDX + 8} y={stage.y + 62} size={9.5} fill={SOFT} anchor="start">
                            miss
                        </Label>
                    </g>
                ))}

                {/* The call we were trying to avoid */}
                <Box x={X} y={LLM_Y} w={W} h={48} accent />
                <Label x={MIDX} y={LLM_Y + 18} size={11.5}>
                    4  GPT-4.1
                </Label>
                <Label x={MIDX} y={LLM_Y + 34} size={9.5} fill={SOFT}>
                    T = 0.0, Pydantic schema, answer cached back
                </Label>
                <Label x={X - 16} y={LLM_Y + 24} size={10} fill="var(--accent)" anchor="end">
                    ~500 ms
                </Label>
                <Arrow x1={RIGHT} y1={LLM_Y + 24} x2={RAIL} y2={LLM_Y + 24} />
                <Label x={RIGHT + 38} y={LLM_Y + 12} size={10} fill="var(--accent)">
                    523
                </Label>

                {/* Collector rail down the right-hand side */}
                <line
                    x1={RAIL}
                    y1={84}
                    x2={RAIL}
                    y2={412}
                    stroke="var(--rule-strong)"
                    strokeWidth="1"
                />
                <Arrow x1={RAIL} y1={412} x2={RAIL} y2={434} />
                <Label x={RAIL} y={450} size={10} fill={MID}>
                    1,000 booleans
                </Label>
            </svg>
        </Figure>
    );
}
