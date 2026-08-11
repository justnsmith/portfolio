import { useState, useEffect, useCallback, useRef } from "react";

const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Animates the window to a section instead of relying on CSS `scroll-behavior`,
 * which browsers cancel or skip inconsistently. Returns a `scrollTo(id)`.
 *
 * The stop position comes from the target's own `scroll-margin-top`, so the
 * offset under the sticky bar stays defined in one place — the CSS.
 */
export function useSectionScroller() {
    const frame = useRef(0);

    const cancel = useCallback(() => {
        if (frame.current) {
            cancelAnimationFrame(frame.current);
            frame.current = 0;
        }
    }, []);

    useEffect(() => cancel, [cancel]);

    return useCallback(
        (id: string) => {
            const el = document.getElementById(id);
            if (!el) return;

            const start = window.scrollY;
            const limit = document.documentElement.scrollHeight - window.innerHeight;
            const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
            const target = Math.max(
                0,
                Math.min(start + el.getBoundingClientRect().top - margin, limit)
            );
            const distance = target - start;

            cancel();
            if (Math.abs(distance) < 1) return;

            // Long jumps get more time, short hops stay snappy.
            const duration = Math.min(900, Math.max(320, Math.abs(distance) * 0.45));
            const startedAt = performance.now();

            // Let the reader take over at any point.
            const interrupt = () => cancel();
            window.addEventListener("wheel", interrupt, { passive: true, once: true });
            window.addEventListener("touchstart", interrupt, { passive: true, once: true });

            const step = (now: number) => {
                const t = Math.min(1, (now - startedAt) / duration);
                window.scrollTo({
                    top: start + distance * easeInOutCubic(t),
                    behavior: "instant" as ScrollBehavior,
                });

                if (t < 1) {
                    frame.current = requestAnimationFrame(step);
                } else {
                    frame.current = 0;
                    window.removeEventListener("wheel", interrupt);
                    window.removeEventListener("touchstart", interrupt);
                }
            };

            frame.current = requestAnimationFrame(step);
        },
        [cancel]
    );
}

/**
 * Marks the section currently under the reading line — the last one whose
 * top has passed just below the sticky bar. Sections here vary a lot in
 * height, so a scroll-position test stays steadier than intersection ratios.
 */
export function useActiveSection(sectionIds: string[]) {
    const [activeSection, setActiveSection] = useState(sectionIds[0]);

    useEffect(() => {
        let frame = 0;
        let offsets: { id: string; top: number }[] = [];

        // Measured up front and on layout changes, never while scrolling —
        // reading geometry every frame is what makes a scroll handler stutter.
        const measure = () => {
            const scrollY = window.scrollY;
            offsets = sectionIds.flatMap(id => {
                const el = document.getElementById(id);
                return el ? [{ id, top: el.getBoundingClientRect().top + scrollY }] : [];
            });
        };

        const update = () => {
            frame = 0;
            const line = window.scrollY + 120; // reading line, px below viewport top
            let current = sectionIds[0];

            for (const section of offsets) {
                if (section.top <= line) current = section.id;
            }

            // Pin the last section once the page is scrolled to the bottom,
            // which it may be too short to reach on its own.
            const atBottom =
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
            if (atBottom) current = sectionIds[sectionIds.length - 1];

            // Only touch state on a real change — this runs every scroll frame,
            // and re-rendering the page tree mid-scroll shows up as jank.
            setActiveSection(prev => (prev === current ? prev : current));
        };

        const onScroll = () => {
            if (!frame) frame = window.requestAnimationFrame(update);
        };

        const remeasure = () => {
            measure();
            onScroll();
        };

        measure();
        update();

        // Fonts and images settle after first paint and move everything.
        document.fonts?.ready.then(remeasure).catch(() => {});
        window.addEventListener("load", remeasure);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", remeasure);
        return () => {
            if (frame) window.cancelAnimationFrame(frame);
            window.removeEventListener("load", remeasure);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", remeasure);
        };
    }, [sectionIds]);

    return activeSection;
}

// Hook for contact form management
export function useContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const [formStatus, setFormStatus] = useState({
        submitting: false,
        success: false,
        error: false,
        message: ""
    });

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            setFormStatus({ submitting: false, success: false, error: true, message: "Please fill out all fields." });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setFormStatus({ submitting: false, success: false, error: true, message: "Please enter a valid email address." });
            return;
        }

        if (formData.message.length > 500) {
            setFormStatus({ submitting: false, success: false, error: true, message: "Message must be 500 characters or less." });
            return;
        }

        try {
            setFormStatus({
                submitting: true,
                success: false,
                error: false,
                message: "Sending message..."
            });

            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setFormStatus({
                    submitting: false,
                    success: true,
                    error: false,
                    message: "Message sent successfully!"
                });

                setFormData({ name: "", email: "", message: "" });
                return true;
            } else {
                throw new Error("Something went wrong");
            }
        } catch (error) {
            setFormStatus({
                submitting: false,
                success: false,
                error: true,
                message: `Failed to send message. Please try again later. ${error}`
            });
            return false;
        }
    }, [formData]);

    const resetForm = useCallback(() => {
        setFormData({ name: "", email: "", message: "" });
        setFormStatus({
            submitting: false,
            success: false,
            error: false,
            message: ""
        });
    }, []);

    return {
        formData,
        formStatus,
        handleInputChange,
        handleSubmit,
        resetForm
    };
}
