import { Arrow, Box, Defs, Figure, Label } from "./primitives";

const SOFT = "var(--ink-soft)";
const MID = "var(--ink-mid)";

export default function SqlplusOffline() {
    return (
        <Figure caption="The offline plane. Job state lives in a text file, not a process, so a 24-hour batch survives anything that kills the script.">
            <svg viewBox="0 0 600 306" role="img" aria-labelledby="off-title">
                <title id="off-title">
                    Keyword generation runs once per operator through the OpenAI Batch API,
                    tracked by a flat-file job registry, and writes normalized embedding vectors
                    that the online classifier reads.
                </title>
                <Defs />

                <Label x={20} y={16} size={10} fill="var(--accent)" anchor="start" caps>
                    OFFLINE · ONCE PER OPERATOR
                </Label>

                {/* Submit path */}
                <Box x={20} y={34} w={104} h={40} />
                <Label x={72} y={54} size={10.5}>
                    queries.txt
                </Label>

                <Box x={156} y={34} w={112} h={40} />
                <Label x={212} y={54} size={10.5}>
                    run_job.py
                </Label>

                <Box x={300} y={34} w={132} h={40} tint />
                <Label x={366} y={48} size={10.5}>
                    OpenAI Batch API
                </Label>
                <Label x={366} y={64} size={9.5} fill={SOFT}>
                    24 h window
                </Label>

                <Box x={464} y={34} w={116} h={40} />
                <Label x={522} y={54} size={10.5}>
                    check_jobs.py
                </Label>

                <Arrow x1={124} y1={54} x2={156} y2={54} />
                <Arrow x1={268} y1={54} x2={300} y2={54} />
                <Arrow x1={432} y1={54} x2={464} y2={54} />

                {/* Durable registry underneath */}
                <Box x={252} y={128} w={148} h={46} />
                <Label x={326} y={144} size={10.5}>
                    jobs.txt
                </Label>
                <Label x={326} y={160} size={9.5} fill={SOFT}>
                    batch_id · operator
                </Label>

                <Arrow x1={212} y1={74} x2={252} y2={140} />
                <Label x={196} y={110} size={9.5} fill={MID} anchor="end">
                    append
                </Label>

                <Arrow x1={400} y1={150} x2={522} y2={74} />
                {/* The diagonal and the vertical below both run under this label,
                    so a paper-filled rect knocks them out behind the text. */}
                <rect x={412} y={106} width={96} height={26} fill="var(--paper)" />
                <Label x={460} y={114} size={9.5} fill={MID}>
                    poll, then
                </Label>
                <Label x={460} y={126} size={9.5} fill={MID}>
                    remove the line
                </Label>

                {/* Handoff artefact */}
                <Box x={396} y={202} w={184} h={44} accent />
                <Label x={488} y={218} size={10.5}>
                    keywords_vec.json
                </Label>
                <Label x={488} y={234} size={9.5} fill={SOFT}>
                    L2-normalized, written once
                </Label>
                <Arrow x1={522} y1={74} x2={522} y2={202} />

                {/* Online consumer */}
                <line
                    x1={20}
                    y1={190}
                    x2={370}
                    y2={190}
                    stroke="var(--rule)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                />
                <Label x={20} y={206} size={10} fill="var(--accent)" anchor="start" caps>
                    ONLINE · PER QUERY
                </Label>

                <Box x={20} y={228} w={216} h={44} />
                <Label x={128} y={244} size={10.5}>
                    embedding classifier
                </Label>
                <Label x={128} y={260} size={9.5} fill={SOFT}>
                    one encode, then a dot product
                </Label>
                <Arrow x1={396} y1={250} x2={236} y2={250} />

                <Label x={128} y={292} size={9.5} fill={MID}>
                    5.2 s for 1,000 rows
                </Label>
            </svg>
        </Figure>
    );
}
