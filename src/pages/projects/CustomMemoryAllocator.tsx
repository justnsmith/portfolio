import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, Trash2, RotateCcw, Plus } from "lucide-react";
import PageLayout from "@components/layout/PageLayout";

export default function EnhancedMemoryAllocator() {
    const INITIAL_HEAP_SIZE = 640000; // 640KB heap
    const HEADER_SIZE = 24;           // Header size for each block
    const MIN_BLOCK_SIZE = 48;        // Minimum size for a split block to be viable
    const INITIAL_ADDRESS = 1000;     // Start address for the heap
    const MIN_ALLOC_SIZE = 16;        // Minimum allocation size
    const MAX_ALLOC_SIZE = 512;       // Maximum allocation size

    const [blocks, setBlocks] = useState<Array<{
        id: number;                 // Unique identifier for the block
        address: number;            // Memory address of the block
        requestedSize: number;      // Size requested by the user
        dataSize: number;           // Actual size of the data in the block
        headerSize: number;         // Size of the header
        totalSize: number;          // Total size of the block (header + data)
        free: boolean;              // Indicates if the block is free or allocated
        next: number | null;        // Pointer to the next block
        coalescing?: boolean;       // Optional property for coalescing
        markedForRemoval?: boolean; // Optional property for marking removal
        splitting?: boolean;        // Optional property for splitting animation
    }>>([]);

    const [allocSize, setAllocSize] = useState(64);
    const [allocSizeInput, setAllocSizeInput] = useState("64");
    const [animatingBlocks, setAnimatingBlocks] = useState<number[]>([]);
    const [isCoalescing, setIsCoalescing] = useState(false);
    const [coalescingSteps, setCoalescingSteps] = useState<Array<{
        type: string;
        blockIds?: number[];
        sourceBlockId?: number;
        targetBlockId?: number;
        message: string;
    }>>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [statusMessage, setStatusMessage] = useState("");
    const [blockOperationsDisabled, setBlockOperationsDisabled] = useState(false);
    const [heapInitialized, setHeapInitialized] = useState(false);
    const [allocStrategy, setAllocStrategy] = useState("first-fit");

    const blocksRef = useRef(blocks);
    useEffect(() => {
        blocksRef.current = blocks;
    }, [blocks]);

    useEffect(() => {
        if (!heapInitialized) {
            initializeHeap();
            setHeapInitialized(true);
        }
    }, [heapInitialized]);

    const initializeHeap = () => {
        const initialBlock = {
            id: 1,
            address: INITIAL_ADDRESS,
            requestedSize: 0,
            dataSize: INITIAL_HEAP_SIZE - HEADER_SIZE,
            headerSize: HEADER_SIZE,
            totalSize: INITIAL_HEAP_SIZE,
            free: true,
            next: null
        };
        setBlocks([initialBlock]);
    };

    const getAlignedSize = (size: number) => {
        return Math.ceil(size / 16) * 16;
    };

    const getTotalBlockSize = (dataSize: number) => {
        const alignedTotal = getAlignedSize(HEADER_SIZE + dataSize);
        return alignedTotal;
    };

    const handleAllocate = () => {
        if (blockOperationsDisabled) return;
        setBlockOperationsDisabled(true);

        const freeBlocks = blocks.filter(block => block.free && block.dataSize >= allocSize);

        if (freeBlocks.length === 0) {
            setStatusMessage("Out of memory! No free block large enough.");
            setTimeout(() => {
                setStatusMessage("");
                setBlockOperationsDisabled(false);
            }, 2000);
            return;
        }

        let fittingFreeBlock;
        switch (allocStrategy) {
            case "best-fit":
                fittingFreeBlock = freeBlocks.reduce((best, current) =>
                    (current.dataSize < best.dataSize) ? current : best
                );
                break;
            case "worst-fit":
                fittingFreeBlock = freeBlocks.reduce((worst, current) =>
                    (current.dataSize > worst.dataSize) ? current : worst
                );
                break;
            case "first-fit":
            default: {
                const sortedByAddress = [...freeBlocks].sort((a, b) => a.address - b.address);
                fittingFreeBlock = sortedByAddress[0];
                break;
            }
        }

        if (fittingFreeBlock) {
            const remainingDataSize = fittingFreeBlock.dataSize - allocSize;
            const remainingTotalSize = remainingDataSize + HEADER_SIZE;

            if (remainingTotalSize >= MIN_BLOCK_SIZE) {
                setAnimatingBlocks([fittingFreeBlock.id]);
                setStatusMessage(`Splitting free block (${allocStrategy})`);

                setTimeout(() => {
                    splitBlock(fittingFreeBlock, allocSize);
                    setBlockOperationsDisabled(false);
                }, 800);
            } else {
                const updatedBlocks = blocks.map(block => {
                    if (block.id === fittingFreeBlock.id) {
                        return { ...block, requestedSize: allocSize, free: false };
                    }
                    return block;
                });

                setAnimatingBlocks([fittingFreeBlock.id]);
                setStatusMessage(`Allocating in existing block (${allocStrategy})`);

                setTimeout(() => {
                    setAnimatingBlocks([]);
                    setStatusMessage("");
                    setBlocks(updatedBlocks);
                    setBlockOperationsDisabled(false);
                }, 800);
            }
        }
    };

    const splitBlock = (blockToSplit: typeof blocks[number], requestedSize: number) => {
        const originalTotalSize = blockToSplit.totalSize;
        const firstBlockTotalSize = getTotalBlockSize(requestedSize);
        const firstBlockDataSize = firstBlockTotalSize - HEADER_SIZE;
        const secondBlockTotalSize = originalTotalSize - firstBlockTotalSize;
        const secondBlockDataSize = secondBlockTotalSize - HEADER_SIZE;
        const secondBlockAddress = blockToSplit.address + firstBlockTotalSize;
        const newBlockId = Math.max(...blocks.map(b => b.id)) + 1;

        const updatedBlocks = [...blocks];
        const blockIndex = updatedBlocks.findIndex(block => block.id === blockToSplit.id);

        if (blockIndex !== -1) {
            updatedBlocks[blockIndex] = {
                ...updatedBlocks[blockIndex],
                requestedSize: requestedSize,
                dataSize: firstBlockDataSize,
                totalSize: firstBlockTotalSize,
                free: false,
                next: secondBlockAddress,
                splitting: true
            };

            const secondBlock = {
                id: newBlockId,
                address: secondBlockAddress,
                requestedSize: 0,
                dataSize: secondBlockDataSize,
                headerSize: HEADER_SIZE,
                totalSize: secondBlockTotalSize,
                free: true,
                next: blockToSplit.next,
                splitting: true
            };

            updatedBlocks.splice(blockIndex + 1, 0, secondBlock);
        }

        setBlocks(updatedBlocks);
        setStatusMessage("Block split completed");
        setAnimatingBlocks([blockToSplit.id, newBlockId]);

        setTimeout(() => {
            const finalBlocks = updatedBlocks.map(block => ({
                ...block,
                splitting: false
            }));
            setBlocks(finalBlocks);
            setAnimatingBlocks([]);
            setStatusMessage("");
        }, 1000);
    };

    const handleFreeBlock = (id: number) => {
        if (blockOperationsDisabled || isCoalescing) return;
        setBlockOperationsDisabled(true);

        const blockToFree = blocks.find(block => block.id === id);
        if (!blockToFree) {
            setBlockOperationsDisabled(false);
            return;
        }

        const updatedBlocks = blocks.map(block =>
            block.id === id ? { ...block, free: true, requestedSize: 0 } : block
        );
        setBlocks(updatedBlocks);
        setAnimatingBlocks([id]);
        setStatusMessage("Freeing block");

        const nextBlock = updatedBlocks.find(block => block.address === blockToFree.next);
        const prevBlock = updatedBlocks.find(block => block.next === blockToFree.address);
        const canCoalesce = (nextBlock && nextBlock.free) || (prevBlock && prevBlock.free);

        if (canCoalesce) {
            setTimeout(() => {
                setAnimatingBlocks([]);
                startCoalescing(id, updatedBlocks);
            }, 800);
        } else {
            setTimeout(() => {
                setAnimatingBlocks([]);
                setStatusMessage("");
                setBlockOperationsDisabled(false);
            }, 800);
        }
    };

    const findBlockById = useCallback((blockId: number, blocksList: typeof blocks) => {
        return blocksList.find((block) => block.id === blockId);
    }, []);

    const findBlockIndexById = useCallback((blockId: number, blocksList: typeof blocks) => {
        return blocksList.findIndex((block) => block.id === blockId);
    }, []);

    const findNextBlock = useCallback((block: typeof blocks[number], blocksList: typeof blocks) => {
        if (!block.next) return null;
        return blocksList.find((b) => b.address === block.next) || null;
    }, []);

    const findPreviousBlock = useCallback((block: typeof blocks[number], blocksList: typeof blocks) => {
        return blocksList.find((b) => b.next === block.address);
    }, []);

    const startCoalescing = (freedBlockId: number, currentBlocks: typeof blocks) => {
        setIsCoalescing(true);
        const steps = [];
        const freedBlock = findBlockById(freedBlockId, currentBlocks);

        if (!freedBlock) {
            setIsCoalescing(false);
            setBlockOperationsDisabled(false);
            return;
        }

        const nextBlock = findNextBlock(freedBlock, currentBlocks);
        let coalesceWithNext = false;

        if (nextBlock && nextBlock.free) {
            steps.push({
                type: "highlight",
                blockIds: [freedBlockId, nextBlock.id],
                message: "Found adjacent free block (next)"
            });

            steps.push({
                type: "merge",
                sourceBlockId: nextBlock.id,
                targetBlockId: freedBlockId,
                message: "Coalescing with next block"
            });

            coalesceWithNext = true;
        }

        const prevBlock = findPreviousBlock(freedBlock, currentBlocks);
        let coalesceWithPrev = false;

        if (prevBlock && prevBlock.free) {
            const targetBlockId = prevBlock.id;
            const sourceBlockId = freedBlockId;

            steps.push({
                type: "highlight",
                blockIds: [targetBlockId, sourceBlockId],
                message: "Found adjacent free block (previous)"
            });

            steps.push({
                type: "merge",
                sourceBlockId: sourceBlockId,
                targetBlockId: targetBlockId,
                message: "Coalescing with previous block"
            });

            coalesceWithPrev = true;
        }

        if (coalesceWithNext || coalesceWithPrev) {
            steps.push({
                type: "finalize",
                message: "Finalizing memory layout"
            });

            setCoalescingSteps(steps);
            setCurrentStepIndex(0);
        } else {
            setIsCoalescing(false);
            setBlockOperationsDisabled(false);
        }
    };

    useEffect(() => {
        if (!isCoalescing || coalescingSteps.length === 0) return;

        const step = coalescingSteps[currentStepIndex];
        setStatusMessage(step.message);

        let timeoutId: NodeJS.Timeout | undefined;

        if (step.type === "highlight") {
            setAnimatingBlocks(step.blockIds ?? []);
            timeoutId = setTimeout(() => {
                setCurrentStepIndex(prevIndex => prevIndex + 1);
            }, 1000);
        }
        else if (step.type === "merge") {
            const currentBlocks = [...blocksRef.current];
            const targetBlock = step.targetBlockId !== undefined ? findBlockById(step.targetBlockId, currentBlocks) : undefined;
            const sourceBlock = step.sourceBlockId !== undefined ? findBlockById(step.sourceBlockId, currentBlocks) : undefined;

            if (targetBlock && sourceBlock) {
                setAnimatingBlocks([step.targetBlockId, step.sourceBlockId].filter((id): id is number => id !== undefined));

                const targetBlockIndex = step.targetBlockId !== undefined ? findBlockIndexById(step.targetBlockId, currentBlocks) : -1;
                const sourceBlockIndex = step.sourceBlockId !== undefined ? findBlockIndexById(step.sourceBlockId, currentBlocks) : -1;

                const updatedBlocks = [...currentBlocks];

                updatedBlocks[targetBlockIndex] = {
                    ...targetBlock,
                    totalSize: targetBlock.totalSize + sourceBlock.totalSize,
                    dataSize: targetBlock.dataSize + sourceBlock.dataSize + sourceBlock.headerSize,
                    next: sourceBlock.next,
                    coalescing: true
                };

                updatedBlocks[sourceBlockIndex] = {
                    ...sourceBlock,
                    markedForRemoval: true,
                    coalescing: true
                };

                setBlocks(updatedBlocks);
            }

            timeoutId = setTimeout(() => {
                setCurrentStepIndex(prevIndex => prevIndex + 1);
            }, 1500);
        }
        else if (step.type === "finalize") {
            const currentBlocks = [...blocksRef.current];

            const updatedBlocks = currentBlocks.map(block => ({
                ...block,
                coalescing: false
            }));

            const finalBlocks = updatedBlocks
                .filter(block => !block.markedForRemoval)
                .map(block => {
                    const nextBlock = updatedBlocks.find(b => b.address === block.next);
                    return {
                        ...block,
                        next: nextBlock && !nextBlock.markedForRemoval ? block.next : null
                    };
                });

            setBlocks(finalBlocks);
            setAnimatingBlocks([]);
            setStatusMessage("");

            timeoutId = setTimeout(() => {
                setIsCoalescing(false);
                setBlockOperationsDisabled(false);
            }, 800);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isCoalescing, currentStepIndex, coalescingSteps, findBlockById, findBlockIndexById]);

    const resetMemory = () => {
        if (blockOperationsDisabled) return;
        setBlocks([]);
        setStatusMessage("");
        setIsCoalescing(false);
        setAnimatingBlocks([]);
        setCoalescingSteps([]);
        setCurrentStepIndex(0);
        setBlockOperationsDisabled(false);
        setHeapInitialized(false);
    };

    const calculateFreeMemory = () => {
        return blocks
            .filter(block => block.free && !block.markedForRemoval)
            .reduce((sum, block) => sum + block.totalSize, 0);
    };

    const calculateFreeBlocks = () => {
        return blocks.filter(block => block.free && !block.markedForRemoval).length;
    };

    const calculateUsedBlocks = () => {
        return blocks.filter(block => !block.free && !block.markedForRemoval).length;
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setAllocSize(value);
        setAllocSizeInput(value.toString());
    };

    const handleAllocSizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        if (inputValue === '') {
            setAllocSizeInput('');
            return;
        }

        if (!/^\d+$/.test(inputValue)) return;

        setAllocSizeInput(inputValue);

        const value = parseInt(inputValue);
        if (!isNaN(value)) {
            const constrainedValue = Math.min(Math.max(value, MIN_ALLOC_SIZE), MAX_ALLOC_SIZE);
            setAllocSize(constrainedValue);
        }
    };

    const handleInputBlur = () => {
        if (allocSizeInput === '') {
            setAllocSize(MIN_ALLOC_SIZE);
            setAllocSizeInput(MIN_ALLOC_SIZE.toString());
            return;
        }

        const value = parseInt(allocSizeInput);
        if (isNaN(value)) {
            setAllocSizeInput(allocSize.toString());
            return;
        }

        const constrainedValue = Math.min(Math.max(value, MIN_ALLOC_SIZE), MAX_ALLOC_SIZE);
        setAllocSize(constrainedValue);
        setAllocSizeInput(constrainedValue.toString());
    };

    const usedMemory = blocks.reduce((sum, b) => (b.free ? sum : sum + b.totalSize), 0);

    const blockTone = (block: { free: boolean; coalescing?: boolean; splitting?: boolean }, active: boolean) => {
        if (block.splitting) return { bg: "#efeaf6", br: "#c0aed6" };
        if (block.coalescing) return { bg: "#f7f0e2", br: "#dcc596" };
        if (block.free) return active ? { bg: "#e4eee7", br: "#9dbfa8" } : { bg: "#eef3ef", br: "#bfd2c6" };
        return { bg: "#f6ebe8", br: "#d6ada3" };
    };

    return (
        <PageLayout wide>
            <div className="rise">
                <h1 className="t-name">Memory allocation visualizer</h1>
                <p className="t-dim" style={{ margin: "0.55rem 0 0", fontSize: "0.95rem", maxWidth: "38rem" }}>
                    A browser model of the explicit free-list allocator I wrote in C. Request a block
                    and watch the heap split, mark, and coalesce &mdash; the same bookkeeping the C
                    version does with 24-byte headers.
                </p>
                <p style={{ margin: "0.9rem 0 0", fontSize: "0.95rem" }}>
                    <a
                        className="lnk"
                        href="https://github.com/justnsmith/custom-allocator-c"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Read the C source
                    </a>
                </p>

                <div className="grid gap-6 md:grid-cols-2" style={{ margin: "2.5rem 0 0" }}>
                    {/* ── Controls ─────────────────────────────── */}
                    <section className="viz-panel">
                        <h2 className="t-meta" style={{ margin: 0 }}>Allocate</h2>

                        <div className="flex items-center" style={{ gap: "0.75rem", marginTop: "1rem" }}>
                            <label className="t-mono" htmlFor="allocSize" style={{ whiteSpace: "nowrap" }}>
                                Size
                            </label>
                            <input
                                id="allocSize"
                                type="range"
                                className="viz-range"
                                min={MIN_ALLOC_SIZE}
                                max={MAX_ALLOC_SIZE}
                                value={allocSize}
                                onChange={handleSliderChange}
                                disabled={blockOperationsDisabled}
                            />
                            <span className="flex items-center" style={{ gap: "0.35rem" }}>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    aria-label="Allocation size in bytes"
                                    value={allocSizeInput}
                                    onChange={handleAllocSizeInput}
                                    onBlur={handleInputBlur}
                                    disabled={blockOperationsDisabled}
                                    className="field"
                                    style={{
                                        width: "4.5rem",
                                        textAlign: "right",
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.85rem",
                                        padding: "0.3rem 0.45rem",
                                    }}
                                />
                                <span className="t-mono">B</span>
                            </span>
                        </div>

                        <p className="t-meta" style={{ margin: "1.25rem 0 0.5rem" }}>Fit strategy</p>
                        <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
                            {(["first-fit", "best-fit", "worst-fit"] as const).map(strategy => (
                                <button
                                    key={strategy}
                                    className="btn-quiet"
                                    aria-pressed={allocStrategy === strategy}
                                    onClick={() => setAllocStrategy(strategy)}
                                    disabled={blockOperationsDisabled}
                                >
                                    {strategy.replace("-", " ")}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-wrap" style={{ gap: "0.5rem", marginTop: "1.5rem" }}>
                            <button
                                className="btn-solid"
                                onClick={handleAllocate}
                                disabled={blockOperationsDisabled}
                            >
                                <Plus size={14} />
                                Allocate block
                            </button>
                            <button
                                className="btn-quiet"
                                onClick={resetMemory}
                                disabled={blockOperationsDisabled}
                            >
                                <RotateCcw size={14} />
                                Reset heap
                            </button>
                        </div>
                    </section>

                    {/* ── Statistics ───────────────────────────── */}
                    <section className="viz-panel">
                        <h2 className="t-meta" style={{ margin: 0 }}>Heap</h2>
                        <div style={{ marginTop: "0.5rem" }}>
                            <div className="viz-stat">
                                <span className="t-dim">Used memory</span>
                                <span className="viz-stat__v">{usedMemory.toLocaleString()} B</span>
                            </div>
                            <div className="viz-stat">
                                <span className="t-dim">Free memory</span>
                                <span className="viz-stat__v">{calculateFreeMemory().toLocaleString()} B</span>
                            </div>
                            <div className="viz-stat">
                                <span className="t-dim">Free blocks</span>
                                <span className="viz-stat__v">{calculateFreeBlocks()}</span>
                            </div>
                            <div className="viz-stat">
                                <span className="t-dim">Used blocks</span>
                                <span className="viz-stat__v">{calculateUsedBlocks()}</span>
                            </div>
                        </div>
                    </section>
                </div>

                <div
                    className="t-mono"
                    role="status"
                    aria-live="polite"
                    style={{ minHeight: "1.5rem", marginTop: "1rem" }}
                >
                    {statusMessage}
                </div>

                {/* ── Blocks ───────────────────────────────────── */}
                <div style={{ marginTop: "1.5rem" }}>
                    <div
                        className="flex flex-wrap items-baseline"
                        style={{ justifyContent: "space-between", gap: "0.5rem 1.5rem" }}
                    >
                        <h2 className="t-meta" style={{ margin: 0 }}>Blocks</h2>
                        <span className="flex flex-wrap items-center t-mono" style={{ gap: "1rem" }}>
                            <Legend swatch="#eef3ef" border="#bfd2c6" label="free" />
                            <Legend swatch="#f6ebe8" border="#d6ada3" label="allocated" />
                            <Legend swatch="#efeaf6" border="#c0aed6" label="splitting" />
                            <Legend swatch="#f7f0e2" border="#dcc596" label="coalescing" />
                        </span>
                    </div>

                    <hr className="rule" style={{ margin: "0.5rem 0 1.5rem" }} />

                    <div className="viz-scroll">
                        <div className="flex items-start" style={{ minWidth: "max-content", gap: "0.75rem" }}>
                            {blocks.map((block, idx) => {
                                if (block.markedForRemoval) return null;

                                const sizeRatio = block.totalSize / INITIAL_HEAP_SIZE;
                                const logScale = Math.log(sizeRatio * 100 + 1) / Math.log(1.15);
                                const headerWidth = 150;
                                const dataWidth = Math.max(80, Math.min(300, logScale * 200));

                                const isAnimating = animatingBlocks.includes(block.id);
                                const tone = blockTone(block, isAnimating);

                                return (
                                    <div key={block.id} className="flex items-start" style={{ gap: "0.75rem" }}>
                                        <div>
                                            <div className="t-mono" style={{ marginBottom: "0.35rem" }}>
                                                0x{block.address.toString(16)}
                                            </div>

                                            <div className="flex">
                                                <div
                                                    className="viz-cell"
                                                    style={{
                                                        width: headerWidth,
                                                        background: tone.bg,
                                                        borderColor: tone.br,
                                                    }}
                                                >
                                                    <div
                                                        className="t-meta"
                                                        style={{
                                                            borderBottom: `1px solid ${tone.br}`,
                                                            paddingBottom: "0.25rem",
                                                            marginBottom: "0.3rem",
                                                            color: "var(--ink-mid)",
                                                        }}
                                                    >
                                                        Header
                                                    </div>
                                                    <div className="flex" style={{ justifyContent: "space-between" }}>
                                                        <span>size</span>
                                                        <span>{block.totalSize.toLocaleString()}B</span>
                                                    </div>
                                                    <div className="flex" style={{ justifyContent: "space-between" }}>
                                                        <span>free</span>
                                                        <span>{block.free ? "true" : "false"}</span>
                                                    </div>
                                                    <div className="flex" style={{ justifyContent: "space-between" }}>
                                                        <span>next</span>
                                                        <span>{block.next ? `0x${block.next.toString(16)}` : "NULL"}</span>
                                                    </div>
                                                </div>

                                                <div
                                                    className="viz-cell flex items-center justify-center"
                                                    style={{
                                                        width: dataWidth,
                                                        background: tone.bg,
                                                        borderColor: tone.br,
                                                        borderLeft: "none",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <div>
                                                        <div className="t-meta" style={{ color: "var(--ink-mid)" }}>
                                                            Data
                                                        </div>
                                                        <div style={{ marginTop: "0.2rem" }}>
                                                            {block.dataSize.toLocaleString()}B
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className="flex items-center"
                                                style={{ gap: "0.75rem", marginTop: "0.5rem" }}
                                            >
                                                <span className="t-mono">block {idx + 1}</span>
                                                {!block.free && (
                                                    <button
                                                        className="btn-quiet"
                                                        onClick={() => handleFreeBlock(block.id)}
                                                        disabled={blockOperationsDisabled}
                                                        style={{ padding: "0.15rem 0.5rem", fontSize: "0.68rem" }}
                                                    >
                                                        <Trash2 size={11} />
                                                        Free
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {block.next && (
                                            <ArrowRight
                                                size={16}
                                                style={{ color: "var(--ink-soft)", marginTop: "3.25rem" }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}

function Legend({ swatch, border, label }: { swatch: string; border: string; label: string }) {
    return (
        <span className="flex items-center" style={{ gap: "0.35rem" }}>
            <span
                aria-hidden="true"
                style={{
                    display: "inline-block",
                    width: 10,
                    height: 10,
                    background: swatch,
                    border: `1px solid ${border}`,
                }}
            />
            {label}
        </span>
    );
}
