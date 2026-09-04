import Section from "@ui/Section";

export default function About() {
    return (
        <Section id="about" label="About" plain delay={60}>
            <div className="t-prose">
                <p>
                    I'm an incoming M.S. Computer Science student at{" "}
                    <a
                        className="lnk"
                        href="https://www.gatech.edu"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Georgia Tech
                    </a>
                    , specializing in Computing Systems. I work on distributed systems, storage
                    engines, and high-performance backend infrastructure: distributed consensus,
                    LSM-based storage, networked services, and GPU-accelerated LLM inference, mostly
                    in C++ and Python. This fall I'm joining MITRE in Honolulu as an AI/ML
                    intern.
                </p>
                <p>
                    Recently I built a Raft-replicated key-value store with its own storage engine,
                    and a Kafka-style message queue from scratch in C++. Alongside that I research
                    LLM inference at the iDB Lab at the University of Hawaiʻi at Mānoa, currently on
                    KV cache retrieval and what actually makes a cached query reusable.
                </p>
                <p>
                    I finished my B.S. in Computer Science at{" "}
                    <a
                        className="lnk"
                        href="https://manoa.hawaii.edu"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        UH Mānoa
                    </a>{" "}
                    in May 2026, magna cum laude. I'm based on Oʻahu, and outside of work I run long
                    distances, lift, and play tennis.
                </p>
            </div>
        </Section>
    );
}
