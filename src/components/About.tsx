import SectionHeading from '@components/ui/SectionHeading';

export default function About() {
    return (
        <section
            id="about"
            className="px-8 sm:px-12 md:px-14 lg:px-16 pt-20 pb-32 scroll-mt-28"
        >
            <div className="max-w-2xl">
                <SectionHeading title="About Me" />

                <div
                    className="space-y-5"
                    style={{ fontSize: '0.9375rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}
                >
                    <p>
                        I'm a senior Computer Science student at the{' '}
                        <a
                            href="https://manoa.hawaii.edu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors duration-200"
                            style={{ color: 'var(--text-primary)' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                        >
                            University of Hawaiʻi at Mānoa
                        </a>
                        , graduating Spring 2026 and looking for backend or systems engineering roles. I build things that operate close to the metal — storage engines, memory allocators, distributed systems — and I care about the tradeoffs that make them fast, correct, and reliable.
                    </p>
                    <p>
                        Currently I'm contributing to GPU-accelerated LLM inference research in collaboration with Carnegie Mellon University, and interning at U.S. Indo-Pacific Command under active Secret Clearance. Outside of that, I'm based in Oʻahu and spend my time running long distances, lifting, and playing tennis.
                    </p>
                </div>
            </div>
        </section>
    );
}
