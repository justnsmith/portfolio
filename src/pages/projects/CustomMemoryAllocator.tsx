import { useState, useEffect, useRef } from "react";
import { ArrowRight, Trash2, RotateCcw, Plus, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    const [allocSizeInput, setAllocSizeInput] = useState("64"); // Separate state for input field
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

    // Use a ref to track the current blocks without causing re-renders
    const blocksRef = useRef(blocks);
    useEffect(() => {
        blocksRef.current = blocks;
    }, [blocks]);

    // Initialize heap with one large free block
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

        // Find all free blocks that are large enough
        const freeBlocks = blocks.filter(block => block.free && block.dataSize >= allocSize);

        if (freeBlocks.length === 0) {
            // No free block found with enough space
            setStatusMessage("Out of memory! No free block large enough.");
            setTimeout(() => {
                setStatusMessage("");
                setBlockOperationsDisabled(false);
            }, 2000);
            return;
        }

        // Apply selected allocation strategy
        let fittingFreeBlock;
        switch (allocStrategy) {
            case "best-fit":
                // Find the smallest block that fits the request
                fittingFreeBlock = freeBlocks.reduce((best, current) =>
                    (current.dataSize < best.dataSize) ? current : best
                );
                break;
            case "worst-fit":
                // Find the largest block available
                fittingFreeBlock = freeBlocks.reduce((worst, current) =>
                    (current.dataSize > worst.dataSize) ? current : worst
                );
                break;
            case "first-fit":
            default: {
                // Sort blocks by address to ensure we're selecting blocks in order
                // This makes it truly "first fit" in terms of memory layout
                const sortedByAddress = [...freeBlocks].sort((a, b) => a.address - b.address);
                fittingFreeBlock = sortedByAddress[0];
                break;
            }
        }

        if (fittingFreeBlock) {
            // Check if block should be split
            const remainingDataSize = fittingFreeBlock.dataSize - allocSize;
            const remainingTotalSize = remainingDataSize + HEADER_SIZE;

            // Only split if remaining size would be large enough to be useful
            if (remainingTotalSize >= MIN_BLOCK_SIZE) {
                // Animate split
                setAnimatingBlocks([fittingFreeBlock.id]);
                setStatusMessage(`Splitting free block (${allocStrategy})`);

                setTimeout(() => {
                    // Split the block
                    splitBlock(fittingFreeBlock, allocSize);
                    setBlockOperationsDisabled(false);
                }, 800);
            } else {
                // Just use the block as is
                const updatedBlocks = blocks.map(block => {
                    if (block.id === fittingFreeBlock.id) {
                        return {
                            ...block,
                            requestedSize: allocSize,
                            free: false,
                        };
                    }
                    return block;
                });

                // Highlight the allocated block
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

    const splitBlock = (blockToSplit: {
        id: number;
        address: number;
        requestedSize: number;
        dataSize: number;
        headerSize: number;
        totalSize: number;
        free: boolean;
        next: number | null;
    }, requestedSize: number) => {
        const originalTotalSize = blockToSplit.totalSize;
        const firstBlockTotalSize = getTotalBlockSize(requestedSize);
        const firstBlockDataSize = firstBlockTotalSize - HEADER_SIZE;

        // Calculate size for second block
        const secondBlockTotalSize = originalTotalSize - firstBlockTotalSize;
        const secondBlockDataSize = secondBlockTotalSize - HEADER_SIZE;

        // Create new address for second block
        const secondBlockAddress = blockToSplit.address + firstBlockTotalSize;

        // Generate a truly new ID to avoid any overlap or confusion
        const newBlockId = Math.max(...blocks.map(b => b.id)) + 1;

        // Create split blocks
        const updatedBlocks = [...blocks]; // Create a new array to avoid direct modifications
        const blockIndex = updatedBlocks.findIndex(block => block.id === blockToSplit.id);

        if (blockIndex !== -1) {
            // Update the original block
            updatedBlocks[blockIndex] = {
                ...updatedBlocks[blockIndex],
                requestedSize: requestedSize,
                dataSize: firstBlockDataSize,
                totalSize: firstBlockTotalSize,
                free: false,
                next: secondBlockAddress,
                splitting: true
            };

            // Create the second block with a unique ID
            const secondBlock = {
                id: newBlockId, // Ensure unique ID
                address: secondBlockAddress,
                requestedSize: 0,
                dataSize: secondBlockDataSize,
                headerSize: HEADER_SIZE,
                totalSize: secondBlockTotalSize,
                free: true,
                next: blockToSplit.next,
                splitting: true
            };

            // Insert the new block right after the original block
            updatedBlocks.splice(blockIndex + 1, 0, secondBlock);
        }

        // Update blocks and animate
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

    // Let's also fix the handleFreeBlock function to ensure we're only operating on the specified block
    const handleFreeBlock = (id: number) => {
        if (blockOperationsDisabled || isCoalescing) return;

        setBlockOperationsDisabled(true);

        // Find the specific block we want to free
        const blockToFree = blocks.find(block => block.id === id);

        if (!blockToFree) {
            setBlockOperationsDisabled(false);
            return;
        }

        // First mark ONLY this block as free
        const updatedBlocks = blocks.map(block =>
            block.id === id ? { ...block, free: true, requestedSize: 0 } : block
        );
        setBlocks(updatedBlocks);

        // Highlight the newly freed block
        setAnimatingBlocks([id]);
        setStatusMessage("Freeing block");

        // Check if coalescing is needed
        const nextBlock = updatedBlocks.find(block => block.address === blockToFree.next);
        const prevBlock = updatedBlocks.find(block => block.next === blockToFree.address);

        const canCoalesce = (nextBlock && nextBlock.free) || (prevBlock && prevBlock.free);

        if (canCoalesce) {
            // Start coalescing process after a short delay
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

    const findBlockById = (blockId: number, blocksList: Array<{
        id: number;
        address: number;
        requestedSize: number;
        dataSize: number;
        headerSize: number;
        totalSize: number;
        free: boolean;
        next: number | null;
    }>): typeof blocksList[number] | undefined => {
        return blocksList.find((block) => block.id === blockId);
    };

    const findBlockIndexById = (blockId: number, blocksList: Array<{
        id: number;
        address: number;
        requestedSize: number;
        dataSize: number;
        headerSize: number;
        totalSize: number;
        free: boolean;
        next: number | null;
    }>): number => {
        return blocksList.findIndex((block) => block.id === blockId);
    };

    const findNextBlock = (block: {
        id: number;
        address: number;
        requestedSize: number;
        dataSize: number;
        headerSize: number;
        totalSize: number;
        free: boolean;
        next: number | null;
    }, blocksList: Array<{
        id: number;
        address: number;
        requestedSize: number;
        dataSize: number;
        headerSize: number;
        totalSize: number;
        free: boolean;
        next: number | null;
    }>): typeof blocksList[number] | null => {
        if (!block.next) return null;
        return blocksList.find((b) => b.address === block.next) || null;
    };

    const findPreviousBlock = (block: {
        id: number;
        address: number;
        requestedSize: number;
        dataSize: number;
        headerSize: number;
        totalSize: number;
        free: boolean;
        next: number | null;
    }, blocksList: Array<{
        id: number;
        address: number;
        requestedSize: number;
        dataSize: number;
        headerSize: number;
        totalSize: number;
        free: boolean;
        next: number | null;
    }>): typeof blocksList[number] | undefined => {
        return blocksList.find((b) => b.next === block.address);
    };

    const startCoalescing = (freedBlockId: number, currentBlocks: Array<{
        id: number;
        address: number;
        requestedSize: number;
        dataSize: number;
        headerSize: number;
        totalSize: number;
        free: boolean;
        next: number | null;
    }>): void => {
        setIsCoalescing(true);
        const steps = [];
        const freedBlock = findBlockById(freedBlockId, currentBlocks);

        if (!freedBlock) {
            setIsCoalescing(false);
            setBlockOperationsDisabled(false);
            return;
        }

        // Check if next block is free and can be coalesced
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

        // Check if previous block is free and can be coalesced
        const prevBlock = findPreviousBlock(freedBlock, currentBlocks);
        let coalesceWithPrev = false;

        if (prevBlock && prevBlock.free) {
            // If we've already coalesced with next, we need to update our understanding of the current state
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

        // If any coalescing will happen, add finalize step
        if (coalesceWithNext || coalesceWithPrev) {
            steps.push({
                type: "finalize",
                message: "Finalizing memory layout"
            });

            setCoalescingSteps(steps);
            setCurrentStepIndex(0);
        } else {
            // No coalescing needed
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
                // Visual merging effect
                setAnimatingBlocks([step.targetBlockId, step.sourceBlockId].filter((id): id is number => id !== undefined));

                const targetBlockIndex = step.targetBlockId !== undefined ? findBlockIndexById(step.targetBlockId, currentBlocks) : -1;
                const sourceBlockIndex = step.sourceBlockId !== undefined ? findBlockIndexById(step.sourceBlockId, currentBlocks) : -1;

                // Create a new array to avoid direct modification of state
                const updatedBlocks = [...currentBlocks];

                updatedBlocks[targetBlockIndex] = {
                    ...targetBlock,
                    // Total size equals the sum of both blocks' total sizes
                    totalSize: targetBlock.totalSize + sourceBlock.totalSize,
                    // Data size is the sum of both data sizes plus the header size of the removed block
                    dataSize: targetBlock.dataSize + sourceBlock.dataSize + sourceBlock.headerSize,
                    next: sourceBlock.next,
                    coalescing: true
                };

                // Mark source block for removal
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

            // Remove coalescing flag from all blocks
            const updatedBlocks = currentBlocks.map(block => ({
                ...block,
                coalescing: false
            }));

            // Remove blocks marked for removal
            const finalBlocks = updatedBlocks
                .filter(block => !block.markedForRemoval)
                .map(block => {
                    // Update next pointers
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
    }, [isCoalescing, currentStepIndex, coalescingSteps]);

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

    // Calculate free memory
    const calculateFreeMemory = () => {
        return blocks
            .filter(block => block.free && !block.markedForRemoval)
            .reduce((sum, block) => sum + block.totalSize, 0);
    };

    // Calculate number of free blocks
    const calculateFreeBlocks = () => {
        return blocks.filter(block => block.free && !block.markedForRemoval).length;
    };

    // Calculate number of used blocks
    const calculateUsedBlocks = () => {
        return blocks.filter(block => !block.free && !block.markedForRemoval).length;
    };

    // Handle slider allocation size changes
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setAllocSize(value);
        setAllocSizeInput(value.toString());
    };

    // Handle manual allocation size input
    const handleAllocSizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Allow empty input so users can clear the field
        if (inputValue === '') {
            setAllocSizeInput('');
            return;
        }

        // Only allow numeric input
        if (!/^\d+$/.test(inputValue)) {
            return;
        }

        setAllocSizeInput(inputValue);

        // Convert to number and update actual size if in valid range
        const value = parseInt(inputValue);
        if (!isNaN(value)) {
            // Apply constraints when user finishes typing
            const constrainedValue = Math.min(Math.max(value, MIN_ALLOC_SIZE), MAX_ALLOC_SIZE);
            setAllocSize(constrainedValue);
        }
    };

    // Handle input blur to ensure constraints are applied
    const handleInputBlur = () => {
        if (allocSizeInput === '') {
            // If field is empty, default to minimum
            setAllocSize(MIN_ALLOC_SIZE);
            setAllocSizeInput(MIN_ALLOC_SIZE.toString());
            return;
        }

        const value = parseInt(allocSizeInput);
        if (isNaN(value)) {
            // Reset to previous valid value if not a number
            setAllocSizeInput(allocSize.toString());
            return;
        }

        // Apply constraints
        const constrainedValue = Math.min(Math.max(value, MIN_ALLOC_SIZE), MAX_ALLOC_SIZE);
        setAllocSize(constrainedValue);
        setAllocSizeInput(constrainedValue.toString());
    };

    const navigate = useNavigate();

    return (
        <div className="min-h-screen text-white bg-gray-900 p-6">
            {/* Navigation Bar */}
            <div className="mb-6 flex justify-between items-center">
                {/* Back button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    <svg
                        className="w-5 h-5 mr-2 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    <span className="font-medium">
                        Justin Smith
                    </span>
                </button>
            </div>

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

            {/* Status Message */}
            {statusMessage && (
                <div className={`${isCoalescing ? 'bg-orange-700' : 'bg-blue-700'} p-3 rounded-lg mb-6 text-center animate-pulse`}>
                    <p className="font-bold">{statusMessage}</p>
                </div>
            )}


            {/* Memory Blocks */}
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

                            // Increase header width to fit text better
                            const headerWidth = 140;
                            const dataWidth = Math.max(minWidth, Math.min(maxWidth, logScale * 200));

                            const isAnimating = animatingBlocks.includes(block.id);

                            // Color logic
                            let headerColor, dataColor;

                            if (block.splitting) {
                                // During splitting - purple
                                headerColor = "bg-purple-500 border-purple-400";
                                dataColor = "bg-purple-600 border-purple-500";
                            } else if (block.coalescing) {
                                // During coalescing - orange
                                headerColor = "bg-orange-500 border-orange-400";
                                dataColor = "bg-orange-600 border-orange-500";
                            } else if (block.free) {
                                // Free blocks
                                headerColor = isAnimating
                                    ? "bg-green-500 border-green-300"
                                    : "bg-green-700 border-green-500";
                                dataColor = isAnimating
                                    ? "bg-green-600 border-green-400"
                                    : "bg-green-800 border-green-600";
                            } else {
                                // Allocated blocks
                                headerColor = "bg-red-700 border-red-500";
                                dataColor = "bg-red-800 border-red-600";
                            }

                            // Animation classes
                            const animationClass = isAnimating || block.coalescing || block.splitting
                                ? "transform transition-all duration-500 scale-105 shadow-lg"
                                : "transform transition-all duration-300";

                            return (
                                <div key={block.id} className="flex items-center">
                                    {/* Memory block */}
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

                                        {/* Block controls */}
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

                                    {/* Arrow to next block */}
                                    {block.next && (
                                        <ArrowRight size={28} className="text-blue-400 mx-3" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer with GitHub link */}
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
        </div>
    );
}
