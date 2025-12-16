const FinalExam = () => {
    return (
        <div
            style={{
                all: "unset",
                display: "block",
                fontFamily: "Times New Roman, serif",
                fontSize: "12pt",
                color: "black",
                background: "white",
                minHeight: "100vh",
                padding: "2rem",
            }}
        >
            <main style={{ maxWidth: "700px", margin: "0 auto" }}>
                <div style={{ textAlign: "left", marginBottom: "2rem" }}>
                    <p>Justin Smith</p>
                    <p>December 15, 2025</p>
                </div>

                <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
                    ICS 414 Final Exam Reflection
                </h1>

                <p style={{ textIndent: "2em", marginBottom: "1em" }}>
                    This semester in ICS 414 was definitely one of the more unique and challenging classes that I’ve taken here at UH Manoa. I really enjoyed working on a real software project with a team, but it also came with its fair share of challenges. Our group, Pantry Pals, had nine members, and not everyone consistently contributed or attended meetings. Sometimes people would miss class on days where we wanted to meet, or fail to complete their tasks on time, which made collaboration harder. While this was frustrating at times, I think that it gave me a realistic glimpse into what working in a professional software team could be like. Learning to adapt, communicate effectively, and stay on top of my own responsibilities was a big part of the experience for me.
                </p>

                <p style={{ textIndent: "2em", marginBottom: "1em" }}>
                    One of the things that I really enjoyed was learning how to use GitHub in a more advanced way. Setting up milestones, understanding automated tests, and creating test pages helped me to see how continuous integration works in real projects. This is something I didn’t really get to learn in ICS 314. I think that seeing GitHub Actions in action gave me a much better understanding of how professional teams ensure code quality and maintain project stability. Even though there were a lot of code review assignments, I now understand their importance, and I think that they made me a more careful coder. At first, it felt repetitive, but over time I realized that reviewing someone else’s code and receiving feedback on my own code improved my understanding of best practices and coding standards.
                </p>

                <p style={{ textIndent: "2em", marginBottom: "1em" }}>
                    I found that this class was extremely self-directed. Compared to ICS 314, there were no WOD’s and we only had to show up to class on milestone presentation days. Most of the work was on us to complete individual tasks and contribute to the group project. I think that this was a valuable part of the class because it forced me to be more proactive and figure things out on my own. I had to manage my time, prioritize tasks, and learn more about technologies like Next.js and Prisma without relying on structured lectures. I think that this experience has made me more confident in my ability to learn new frameworks and tools independently, which is something that I know will help me in future classes and in my career.
                </p>

                <p style={{ textIndent: "2em", marginBottom: "1em" }}>
                    Working on Pantry Pals itself was really interesting. The goal of the project was to create a digital inventory system for pantries, fridges, freezers, and spices. Users could add, remove, and update items, generate shopping lists automatically, and even see recipe suggestions based on what they had at home. I really enjoyed contributing to features like email authentication, inventory management, and helping set up the continuous integration pipeline. I think that this experience helped me understand the bigger picture of software engineering: how individual code contributions fit into a larger system and how proper planning and testing can prevent issues down the line.
                </p>

                <p style={{ textIndent: "2em", marginBottom: "1em" }}>
                    Another challenge that I faced was coordinating with such a large group. With nine members, communication could get messy. Sometimes, there were overlapping tasks or confusion about responsibilities. I learned that setting clear expectations, writing detailed GitHub issues, and regularly checking progress on milestones was essential to keeping the project moving forward. I also realized the importance of empathy and patience when team members were falling behind. I think that these soft skills are almost as important as technical skills in real-world software development.
                </p>

                <p style={{ textIndent: "2em", marginBottom: "1em" }}>
                    I also really appreciated the chance to work with modern web technologies in a meaningful way. Before this class, I had some exposure to Next.js and React from ICS 314 and from my own personal experiences, but applying them in a real project helped me solidify my understanding more. I learned how to structure a project, how to separate components, and how to think about scalability and maintainability. The hands-on experience with Vercel deployment and automated CI/CD pipelines was especially valuable. I now feel like I have a much better idea of how a professional web application is built and maintained.
                </p>

                <p style={{ textIndent: "2em", marginBottom: "1em" }}>
                    The last thing I found challenging was balancing the self-directed nature of the course with team responsibilities. Since attendance was optional and there were no traditional exams or assignments, it was easy to procrastinate or get stuck on tasks. However, this also taught me the value of self-motivation and organization. I think that I became better at breaking down tasks into smaller, manageable steps, tracking progress using milestones, and reviewing my work to ensure it met quality standards. I really think that these are skills I can carry forward into my future software projects and career.
                </p>

                <p style={{ textIndent: "2em", marginBottom: "1em" }}>
                    Overall, ICS 414 gave me a realistic glimpse into what working as a software engineer might be like. I learned not just technical skills, but also how to collaborate with a team, plan a project, and adapt to unexpected challenges. I feel like I now have a clearer understanding of the full software development lifecycle, from its initial planning and requirements, starting to code, testing, reviewing, and deployment. I also feel more confident in my ability to contribute to large projects and take responsibility for my work. I think that this class has also been one of the most valuable experiences in my undergrad career, and I appreciate the freedom and responsibility it gave me. It’s definitely refined my interest in pursuing a career in software engineering, and I’m excited to apply what I have learned in future projects.
                </p>
            </main>
        </div>
    );
};

export default FinalExam;
