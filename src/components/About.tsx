export default function About() {
    return (
        <section
            id="about"
            className="px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 pt-20 pb-40 scroll-mt-28"
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center mb-12">
                    <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent flex-grow"></div>
                    <h2 className="text-2xl font-bold text-white mx-4 flex items-center">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                            About Me
                        </span>
                    </h2>
                    <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent flex-grow"></div>
                </div>
                <div className="space-y-8 text-gray-400">
                    <p>
                        I'm a senior Computer Science student at the{' '}
                        <a
                            href="https://manoa.hawaii.edu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-cyan-400 transition-colors duration-200"
                        >
                            University of Hawaiʻi at Mānoa
                        </a>
                        , graduating in Spring 2026. I'm mainly focused on backend and systems work, and I like building things that sit below the surface and move data around efficiently.
                    </p>
                    <p>
                        I'm based in Oʻahu, Hawaiʻi, and I’ve lived here most of my life. Outside of school and coding, I run long distances, lift, play tennis, and spend time learning things out of curiosity. I’m drawn to understanding how systems work at a deeper level, from memory management in C++ to why certain design decisions actually matter.
                    </p>
                </div>
            </div>
        </section>
    );
}
