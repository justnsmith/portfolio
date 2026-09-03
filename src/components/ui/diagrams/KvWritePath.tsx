import { Arrow, Box, Defs, Figure, Label } from "./primitives";

const SOFT = "var(--ink-soft)";
const MID = "var(--ink-mid)";

/** Steps down the middle of the leader node, top to bottom. */
const STEPS: { y: number; text: string; accent?: boolean }[] = [
    { y: 104, text: "TcpServer.executeCommand" },
    { y: 176, text: "RaftNode.replicate", accent: true },
    { y: 268, text: "apply thread  →  StorageEngine.put" },
    { y: 340, text: "MPSC queue  →  writer thread" },
    { y: 412, text: "WAL (crc32, fsync)  →  memtable" },
];

const BOX_X = 44;
const BOX_W = 300;
const BOX_H = 36;
const MID_X = BOX_X + BOX_W / 2;

export default function KvWritePath() {
    return (
        <Figure caption="Write path. A follower answers -ERR NOT_LEADER host:port and the client retries there.">
            <svg viewBox="0 0 600 500" role="img" aria-labelledby="wp-title">
                <title id="wp-title">
                    A client PUT enters the leader node, is replicated to two followers over
                    AppendEntries, and is applied to the storage engine once a majority
                    acknowledges it.
                </title>
                <Defs />

                {/* Client, centred over the arrow into the node */}
                <Label x={MID_X} y={20} size={11} fill={SOFT}>
                    client · PUT k v
                </Label>
                <Arrow x1={MID_X} y1={32} x2={MID_X} y2={62} />

                {/* Leader node */}
                <Box x={20} y={62} w={348} h={412} tint />
                <Label x={36} y={82} size={10} fill="var(--accent)" anchor="start" caps>
                    NODE 1 · LEADER
                </Label>
                <Label x={352} y={82} size={10} fill={SOFT} anchor="end">
                    :9000 · :9100
                </Label>

                {STEPS.map((step, i) => (
                    <g key={step.text}>
                        <Box x={BOX_X} y={step.y} w={BOX_W} h={BOX_H} accent={step.accent} />
                        <Label x={MID_X} y={step.y + BOX_H / 2} size={11.5}>
                            {step.text}
                        </Label>
                        {i > 0 && (
                            <Arrow
                                x1={MID_X}
                                y1={STEPS[i - 1].y + BOX_H}
                                x2={MID_X}
                                y2={step.y}
                            />
                        )}
                    </g>
                ))}

                {/* Annotation on the commit gate. The connector runs behind it,
                    so a paper-filled rect knocks the line out under the text. */}
                <rect x={MID_X - 112} y={230} width={224} height={16} fill="var(--paper-tint)" />
                <Label x={MID_X} y={238} size={10} fill={MID}>
                    majority acks, entry in current term
                </Label>

                {/* Followers */}
                <Box x={412} y={140} w={164} h={56} />
                <Label x={494} y={160} size={11}>
                    Node 2
                </Label>
                <Label x={494} y={178} size={10} fill={SOFT}>
                    follower
                </Label>

                <Box x={412} y={230} w={164} h={56} />
                <Label x={494} y={250} size={11}>
                    Node 3
                </Label>
                <Label x={494} y={268} size={10} fill={SOFT}>
                    follower
                </Label>

                {/* Replication fan-out */}
                <Arrow x1={344} y1={186} x2={412} y2={168} />
                <Arrow x1={344} y1={194} x2={412} y2={258} />
                <Label x={494} y={116} size={10} fill={SOFT}>
                    AppendEntries
                </Label>
                <Label x={494} y={130} size={10} fill={SOFT}>
                    one thread per peer
                </Label>

                {/* Where the caller is unblocked, which is the subject of the
                    ordering bug described below the diagram. */}
                <Label x={MID_X} y={462} size={10} fill={MID}>
                    futures resolve here, before the flush check
                </Label>
            </svg>
        </Figure>
    );
}
