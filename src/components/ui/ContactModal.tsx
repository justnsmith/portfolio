import { useEffect } from "react";
import { useContactForm } from "@hooks";
import { profile } from "@data/nav";
import type { ContactModalProps } from "@types";

const FIELDS = [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
] as const;

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const {
        formData,
        formStatus,
        handleInputChange,
        handleSubmit,
        resetForm,
    } = useContactForm();

    useEffect(() => {
        if (!isOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!formStatus.success) return;
        const t = setTimeout(() => {
            onClose();
            resetForm();
        }, 2500);
        return () => clearTimeout(t);
    }, [formStatus.success, onClose, resetForm]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center no-print"
            style={{ zIndex: 100, background: "rgba(21, 23, 27, 0.35)", padding: "1.5rem" }}
            onClick={e => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="contact-title"
                className="panel-in"
                style={{
                    width: "100%",
                    maxWidth: "26rem",
                    background: "var(--paper)",
                    border: "1px solid var(--rule-strong)",
                    borderRadius: "2px",
                    boxShadow: "0 18px 48px rgba(21, 23, 27, 0.12)",
                    padding: "1.75rem",
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                <div
                    className="flex items-baseline"
                    style={{ justifyContent: "space-between", gap: "1rem" }}
                >
                    <h2 className="t-h2" id="contact-title">
                        Send a message
                    </h2>
                    <button className="btn-plain t-meta" onClick={onClose} aria-label="Close">
                        Close
                    </button>
                </div>

                {formStatus.success ? (
                    <p className="t-dim" style={{ margin: "1.25rem 0 0" }}>
                        {formStatus.message} I'll get back to you at {formData.email || "your address"}{" "}
                        shortly.
                    </p>
                ) : (
                    <>
                        <p className="t-soft" style={{ margin: "0.5rem 0 1.5rem", fontSize: "0.95rem" }}>
                            Or write to{" "}
                            <a className="lnk" href={`mailto:${profile.email}`}>
                                {profile.email}
                            </a>
                            .
                        </p>

                        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
                            {FIELDS.map(field => (
                                <div key={field.name}>
                                    <label
                                        className="t-meta"
                                        htmlFor={field.name}
                                        style={{ display: "block", marginBottom: "0.35rem" }}
                                    >
                                        {field.label}
                                    </label>
                                    <input
                                        className="field"
                                        id={field.name}
                                        name={field.name}
                                        type={field.type}
                                        value={formData[field.name]}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            ))}

                            <div>
                                <div
                                    className="flex items-baseline"
                                    style={{ justifyContent: "space-between", marginBottom: "0.35rem" }}
                                >
                                    <label className="t-meta" htmlFor="message">
                                        Message
                                    </label>
                                    <span className="t-mono">{formData.message.length}/500</span>
                                </div>
                                <textarea
                                    className="field"
                                    id="message"
                                    name="message"
                                    rows={5}
                                    maxLength={500}
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    style={{ resize: "vertical" }}
                                />
                            </div>

                            {formStatus.error && (
                                <p
                                    role="alert"
                                    style={{ margin: 0, fontSize: "0.9rem", color: "#8c2f21" }}
                                >
                                    {formStatus.message}
                                </p>
                            )}

                            <button className="btn-solid" type="submit" disabled={formStatus.submitting}>
                                {formStatus.submitting ? "Sending…" : "Send message"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
