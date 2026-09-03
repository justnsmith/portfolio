import { Arrow, Box, Defs, Figure, Label } from "./primitives";

const SOFT = "var(--ink-soft)";
const MID = "var(--ink-mid)";

export default function SqlplusEmbeddingFix() {
    return (
        <Figure caption="semantic_eq, same dataset and threshold. The only change is what goes into the encoder.">
            <svg viewBox="0 0 600 286" role="img" aria-labelledby="fix-title">
                <title id="fix-title">
                    Embedding three extracted keywords per side gave 36.88 percent precision on
                    semantic equivalence; embedding the sentences directly gave 96.15 percent.
                </title>
                <Defs />

                {/* Before */}
                <Label x={24} y={18} size={10} fill={MID} anchor="start" caps>
                    BEFORE · 36.88% PRECISION
                </Label>

                <Box x={24} y={38} w={112} h={36} />
                <Label x={80} y={56} size={10.5}>
                    X, Y text
                </Label>

                <Box x={24} y={100} w={112} h={44} />
                <Label x={80} y={116} size={10.5}>
                    GPT: 3 keywords
                </Label>
                <Label x={80} y={132} size={9.5} fill={SOFT}>
                    per side
                </Label>

                <Box x={24} y={170} w={112} h={36} />
                <Label x={80} y={188} size={10.5}>
                    embed, compare
                </Label>

                <Arrow x1={80} y1={74} x2={80} y2={100} />
                <Arrow x1={80} y1={144} x2={80} y2={170} />

                <Label x={24} y={228} size={9.5} fill={MID} anchor="start">
                    "Repairing a grandfather clock"
                </Label>
                <Label x={24} y={244} size={9.5} fill={MID} anchor="start">
                    "Setting an alarm clock"
                </Label>
                <Label x={24} y={264} size={9.5} fill={SOFT} anchor="start">
                    share "clock", mean nothing alike
                </Label>

                {/* Divider */}
                <line
                    x1={300}
                    y1={30}
                    x2={300}
                    y2={256}
                    stroke="var(--rule)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                />

                {/* After */}
                <Label x={340} y={18} size={10} fill="var(--accent)" anchor="start" caps>
                    AFTER · 96.15% PRECISION
                </Label>

                <Box x={340} y={38} w={112} h={36} />
                <Label x={396} y={56} size={10.5}>
                    X, Y text
                </Label>

                <Box x={340} y={170} w={112} h={36} accent />
                <Label x={396} y={188} size={10.5}>
                    embed, compare
                </Label>

                <Arrow x1={396} y1={74} x2={396} y2={170} />
                <Label x={408} y={120} size={9.5} fill={MID} anchor="start">
                    no keyword step
                </Label>

                <Label x={340} y={228} size={9.5} fill={MID} anchor="start">
                    Equivalence lives in the whole
                </Label>
                <Label x={340} y={244} size={9.5} fill={MID} anchor="start">
                    sentence, so keep the sentence.
                </Label>
                <Label x={340} y={264} size={9.5} fill={SOFT} anchor="start">
                    6.9 s → 3.1 s as a side effect
                </Label>
            </svg>
        </Figure>
    );
}
