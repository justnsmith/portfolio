import { Arrow, Box, Defs, Figure, Label } from "./primitives";

const SOFT = "var(--ink-soft)";
const MID = "var(--ink-mid)";

const LAYERS: { y: number; text: string; note?: string }[] = [
    { y: 46, text: "LRU cache", note: "16 shards" },
    { y: 122, text: "active memtable" },
    { y: 198, text: "immutable memtable", note: "only during a flush" },
    { y: 274, text: "SSTables", note: "L0 checked in full, L1+ one file" },
];

const PROBE: { y: number; text: string }[] = [
    { y: 274, text: "min / max key range" },
    { y: 326, text: "bloom filter, 1% FPR" },
    { y: 378, text: "sparse index → pread()" },
];

const L_X = 20;
const L_W = 260;
const L_MID = L_X + L_W / 2;
const R_X = 344;
const R_W = 236;
const R_MID = R_X + R_W / 2;

export default function KvReadPath() {
    return (
        <Figure caption="Read path. Any layer that answers returns immediately; the arrows are misses.">
            <svg viewBox="0 0 600 436" role="img" aria-labelledby="rp-title">
                <title id="rp-title">
                    A GET walks the cache, the memtables and then the SSTables newest-first,
                    and each SSTable is skipped by a key-range check and a bloom filter before
                    any disk read.
                </title>
                <Defs />

                <Label x={L_MID} y={20} size={11} fill={SOFT}>
                    GET key
                </Label>
                <Arrow x1={L_MID} y1={28} x2={L_MID} y2={46} />

                {LAYERS.map((layer, i) => {
                    const h = layer.note ? 48 : 36;
                    return (
                        <g key={layer.text}>
                            <Box x={L_X} y={layer.y} w={L_W} h={h} accent={i === 3} />
                            <Label x={L_MID} y={layer.y + (layer.note ? 19 : 18)} size={11.5}>
                                {layer.text}
                            </Label>
                            {layer.note && (
                                <Label x={L_MID} y={layer.y + 35} size={10} fill={SOFT}>
                                    {layer.note}
                                </Label>
                            )}
                            {i > 0 && (
                                <>
                                    <Arrow
                                        x1={L_MID}
                                        y1={LAYERS[i - 1].y + (LAYERS[i - 1].note ? 48 : 36)}
                                        x2={L_MID}
                                        y2={layer.y}
                                    />
                                    <Label
                                        x={L_MID + 10}
                                        y={layer.y - 14}
                                        size={10}
                                        fill={MID}
                                        anchor="start"
                                    >
                                        miss
                                    </Label>
                                </>
                            )}
                        </g>
                    );
                })}

                {/* Zoom into a single SSTable probe */}
                <Arrow x1={L_X + L_W} y1={298} x2={R_X} y2={292} dashed />
                <Label x={R_X} y={254} size={10} fill="var(--accent)" anchor="start" caps>
                    ONE SSTABLE PROBE
                </Label>

                {PROBE.map((step, i) => (
                    <g key={step.text}>
                        <Box x={R_X} y={step.y} w={R_W} h={36} />
                        <Label x={R_MID} y={step.y + 18} size={11.5}>
                            {step.text}
                        </Label>
                        {i > 0 && (
                            <Arrow
                                x1={R_MID}
                                y1={PROBE[i - 1].y + 36}
                                x2={R_MID}
                                y2={step.y}
                            />
                        )}
                    </g>
                ))}

                <Label x={R_MID} y={428} size={10} fill={MID}>
                    lock-free, shared fd
                </Label>
            </svg>
        </Figure>
    );
}
