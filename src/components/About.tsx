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
                        , graduating in Spring 2026. I'm mainly focused on backend and systems work, and I like building things that sit below the surface and move data around efficiently.
                    </p>
                    <p>
                        I'm based in Oʻahu, Hawaiʻi, and I've lived here most of my life. Outside of school and coding, I run long distances, lift, play tennis, and spend time learning things out of curiosity. I'm drawn to understanding how systems work at a deeper level — from memory management in C++ to why certain design decisions actually matter.
                    </p>
                </div>
            </div>
        </section>
    );
}
