import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, Trash2, RotateCcw, Plus, Github } from "lucide-react";
import PageLayout from "../../components/layout/PageLayout";

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

    return (
        <PageLayout maxWidth="max-w-7xl">
            <h1 className="text-3xl font-bold mb-6 text-center">Memory Allocation Visualizer</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-3 text-blue-400">Allocate Memory</h2>
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            <label htmlFor="allocSize" className="font-medium whitespace-nowrap">Size:</label>
                            <input
                                id="allocSize"
                                type="range"
                                min={MIN_ALLOC_SIZE}
                                max={MAX_ALLOC_SIZE}
                                value={allocSize}
                                onChange={handleSliderChange}
                                className="flex-1"
                                disabled={blockOperationsDisabled}
                            />
                            <div className="w-20 bg-gray-700 rounded flex overflow-hidden">
                                <input
                                    type="text"
                                    value={allocSizeInput}
                                    onChange={handleAllocSizeInput}
                                    onBlur={handleInputBlur}
                                    className="w-full bg-gray-700 px-2 py-1 text-center font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    disabled={blockOperationsDisabled}
                                    placeholder={MIN_ALLOC_SIZE.toString()}
                                />
                                <span className="bg-gray-600 px-1 flex items-center">B</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                            <label className="font-medium whitespace-nowrap">Strategy:</label>
                            <div className="flex-1 grid grid-cols-3 gap-2">
                                <button
                                    className={`px-2 py-1 rounded transition-colors text-sm ${allocStrategy === 'first-fit' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                    onClick={() => setAllocStrategy('first-fit')}
                                    disabled={blockOperationsDisabled}
                                >
                                    First Fit
                                </button>
                                <button
                                    className={`px-2 py-1 rounded transition-colors text-sm ${allocStrategy === 'best-fit' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                    onClick={() => setAllocStrategy('best-fit')}
                                    disabled={blockOperationsDisabled}
                                >
                                    Best Fit
                                </button>
                                <button
                                    className={`px-2 py-1 rounded transition-colors text-sm ${allocStrategy === 'worst-fit' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                    onClick={() => setAllocStrategy('worst-fit')}
                                    disabled={blockOperationsDisabled}
                                >
                                    Worst Fit
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleAllocate}
                                disabled={blockOperationsDisabled}
                                className={`flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${blockOperationsDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Plus size={18} />
                                Allocate Memory
                            </button>
                            <button
                                onClick={resetMemory}
                                disabled={blockOperationsDisabled}
                                className={`bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all ${blockOperationsDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Reset Memory"
                            >
                                <RotateCcw size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-3 text-blue-400">Memory Statistics</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-700 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-red-400">
                                {blocks.reduce((sum, block) => block.free ? sum : sum + block.totalSize, 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-300">Used Memory (bytes)</div>
                        </div>
                        <div className="bg-gray-700 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-green-400">
                                {calculateFreeMemory().toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-300">Free Memory (bytes)</div>
                        </div>
                        <div className="bg-gray-700 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-400">
                                {calculateFreeBlocks()}
                            </div>
                            <div className="text-sm text-gray-300">Free Blocks</div>
                        </div>
                        <div className="bg-gray-700 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-purple-400">
                                {calculateUsedBlocks()}
                            </div>
                            <div className="text-sm text-gray-300">Used Blocks</div>
                        </div>
                    </div>
                </div>
            </div>

            {statusMessage && (
                <div className={`${isCoalescing ? 'bg-orange-700' : 'bg-blue-700'} p-3 rounded-lg mb-6 text-center animate-pulse`}>
                    <p className="font-bold">{statusMessage}</p>
                </div>
            )}

            <div className="bg-gray-800 p-4 rounded-lg shadow-lg overflow-x-auto">
                <h2 className="text-xl font-bold mb-4 text-blue-400">Memory Blocks</h2>

                <div className="overflow-x-auto pb-6">
                    <div className="flex items-center pt-6 pb-10 px-4 min-w-max space-x-6">
                        {blocks.map((block, idx) => {
                            if (block.markedForRemoval) return null;
                            const minWidth = 80;
                            const maxWidth = 300;
                            const sizeRatio = block.totalSize / INITIAL_HEAP_SIZE;
                            const logBase = 1.15;
                            const logScale = Math.log(sizeRatio * 100 + 1) / Math.log(logBase);

                            const headerWidth = 140;
                            const dataWidth = Math.max(minWidth, Math.min(maxWidth, logScale * 200));

                            const isAnimating = animatingBlocks.includes(block.id);

                            let headerColor, dataColor;

                            if (block.splitting) {
                                headerColor = "bg-purple-500 border-purple-400";
                                dataColor = "bg-purple-600 border-purple-500";
                            } else if (block.coalescing) {
                                headerColor = "bg-orange-500 border-orange-400";
                                dataColor = "bg-orange-600 border-orange-500";
                            } else if (block.free) {
                                headerColor = isAnimating
                                    ? "bg-green-500 border-green-300"
                                    : "bg-green-700 border-green-500";
                                dataColor = isAnimating
                                    ? "bg-green-600 border-green-400"
                                    : "bg-green-800 border-green-600";
                            } else {
                                headerColor = "bg-red-700 border-red-500";
                                dataColor = "bg-red-800 border-red-600";
                            }

                            const animationClass = isAnimating || block.coalescing || block.splitting
                                ? "transform transition-all duration-500 scale-105 shadow-lg"
                                : "transform transition-all duration-300";

                            return (
                                <div key={block.id} className="flex items-center">
                                    <div className={`flex flex-col items-center ${animationClass}`}>
                                        <div className="text-blue-300 font-mono mb-1">0x{block.address.toString(16)}</div>

                                        <div className="flex">
                                            <div
                                                className={`p-2 rounded-l border h-24 flex flex-col justify-between ${headerColor} transition-colors duration-300`}
                                                style={{ width: `${headerWidth}px` }}
                                            >
                                                <div className="text-center border-b pb-1 mb-1 text-xs font-bold">HEADER</div>
                                                <div className="text-xs font-mono flex-1 flex flex-col justify-between">
                                                    <div className="flex justify-between">
                                                        <span className="whitespace-nowrap">Size:</span>
                                                        <span>{block.totalSize.toLocaleString()}B</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="whitespace-nowrap">Free:</span>
                                                        <span>{block.free ? "true" : "false"}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="whitespace-nowrap">Next:</span>
                                                        <span>{block.next ? `0x${block.next.toString(16)}` : "NULL"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={`p-2 rounded-r border h-24 flex items-center justify-center ${dataColor} transition-colors duration-300`}
                                                style={{ width: `${dataWidth}px` }}
                                            >
                                                <div className="text-center">
                                                    <div className="text-xs font-bold mb-1">DATA</div>
                                                    <div className="text-sm font-mono">{block.dataSize.toLocaleString()}B</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-700 mt-2 px-3 py-1 rounded-full text-xs">
                                            Block #{idx + 1} - {block.totalSize.toLocaleString()}B total
                                        </div>

                                        <div className="mt-2 flex items-center justify-center">
                                            {!block.free && (
                                                <button
                                                    onClick={() => handleFreeBlock(block.id)}
                                                    className={`flex items-center gap-1 bg-red-700 hover:bg-red-600 px-3 py-1 rounded-full text-xs transition-colors ${blockOperationsDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    disabled={blockOperationsDisabled}
                                                >
                                                    <Trash2 size={12} />
                                                    Free
                                                </button>
                                            )}
                                            {block.free && (
                                                <span className="flex items-center gap-1 bg-green-700 px-3 py-1 rounded-full text-xs">
                                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                                    Available
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {block.next && (
                                        <ArrowRight size={28} className="text-blue-400 mx-3" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <a
                    href="https://github.com/justnsmith/custom-allocator-c"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <Github size={18} />
                    <span>View on GitHub</span>
                </a>
            </div>
        </PageLayout>
    );
}
