export default function Experience() {
    return (
        <section
            id="experience"
            className="px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 pt-20 pb-40 scroll-mt-28"
        >
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center mb-16">
                    <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent flex-grow"></div>
                    <h2 className="text-2xl font-bold text-white mx-4 flex items-center">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                            Experience
                        </span>
                    </h2>
                    <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent flex-grow"></div>
                </div>

                {/* Timeline Container */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Vertical line */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-cyan-500 to-transparent"></div>

                    {/* Experience Item */}
                    <div className="relative mb-16 pl-8 md:pl-12">
                        {/* Timeline dot */}
                        <div className="absolute left-0 w-4 h-4 transform -translate-x-2 mt-1.5">
                            <div className="w-4 h-4 rounded-full bg-indigo-500 border-4 border-gray-950 shadow-lg shadow-indigo-500/50"></div>
                            <div className="absolute inset-0 w-4 h-4 rounded-full bg-indigo-500 animate-ping opacity-40"></div>
                        </div>

                        {/* Content */}
                        <div className="w-full">
                            {/* Date */}
                            <div className="inline-block mb-4">
                                <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30">
                                    <time className="text-sm font-semibold text-cyan-400">
                                        Mar 2025 – Present
                                    </time>
                                </div>
                            </div>

                            {/* Card */}
                            <div className="group relative p-6 rounded-xl bg-gradient-to-br from-gray-900/90 to-gray-900/50 border border-gray-800 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/0 to-cyan-500/0 group-hover:from-indigo-500/5 group-hover:to-cyan-500/5 transition-all duration-300"></div>

                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        Undergraduate Research Assistant
                                    </h3>
                                    <h4 className="text-md font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 mb-3">
                                        SQLPlus Research – University of Hawaiʻi
                                    </h4>

                                    <p className="text-gray-300 mb-4 leading-relaxed">
                                        Working with Dr. Yifan Wang on database systems research at the
                                        intersection of query optimization and AI. Contributing to an
                                        in-progress PostgreSQL extension exploring language-aware SQL
                                        operators and their impact on query execution.
                                    </p>

                                    <ul className="space-y-2 mb-4">
                                        <li className="flex items-start gap-2 text-sm text-gray-400">
                                            <span className="text-indigo-400 mt-1">▸</span>
                                            <span>
                                                Developing experimental PostgreSQL operators to support
                                                natural-language-style query interactions within the planner
                                                and executor
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-gray-400">
                                            <span className="text-indigo-400 mt-1">▸</span>
                                            <span>
                                                Prototyping asynchronous execution paths to study query
                                                latency, throughput, and blocking behavior
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-gray-400">
                                            <span className="text-indigo-400 mt-1">▸</span>
                                            <span>
                                                Investigating retrieval and caching strategies to compare
                                                model-generated outputs against ground-truth datasets and
                                                reduce reliance on real-time LLM inference
                                            </span>
                                        </li>
                                    </ul>

                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-cyan-500/10 text-cyan-300 rounded-full text-xs font-medium border border-cyan-500/20">
                                            Database Systems
                                        </span>
                                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-xs font-medium border border-indigo-500/20">
                                            PostgreSQL Internals
                                        </span>
                                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-xs font-medium border border-indigo-500/20">
                                            Query Optimization
                                        </span>
                                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-xs font-medium border border-indigo-500/20">
                                            Systems Programming
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* End indicator */}
                    <div className="relative pl-8 md:pl-12">
                        <div className="absolute left-0 w-3 h-3 transform -translate-x-1.5 -mt-8">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 border-2 border-gray-950 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center">
                    <div className="inline-block px-6 py-3 rounded-lg bg-gray-900/50 border border-gray-800">
                        <p className="text-sm text-gray-400">
                            <span className="text-indigo-400">●</span> Additional experiences coming soon...
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
