import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPaperPlane, faSpinner, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useContactForm } from "../../hooks";
import { ContactModalProps } from '../../types';

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const {
        formData,
        formStatus,
        focusedField,
        handleInputChange,
        handleFieldFocus,
        handleFieldBlur,
        handleSubmit,
        resetForm
    } = useContactForm();

    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (formStatus.success) {
            setTimeout(() => { onClose(); resetForm(); }, 3000);
        }
    }, [formStatus.success, onClose, resetForm]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        await handleSubmit(e);
    };

    if (!isOpen) return null;

    const inputStyle = {
        width: '100%',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '10px 14px',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'border-color 200ms ease',
    };

    return (
        <>
            <div
                id="contact-modal-backdrop"
                className="fixed inset-0 flex items-center justify-center px-4"
                style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
                onClick={handleBackdropClick}
            >
                <div
                    className="w-full max-w-md overflow-hidden"
                    style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: '16px',
                        boxShadow: '0 0 0 1px rgba(34,211,238,0.1), 0 24px 64px rgba(0,0,0,0.6)',
                        animation: 'modalEntrance 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                    }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-6 py-4"
                        style={{ borderBottom: '1px solid var(--border)' }}
                    >
                        <h2
                            className="text-base font-semibold"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                            Get in Touch
                        </h2>
                        <button
                            onClick={onClose}
                            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-muted)',
                            }}
                            aria-label="Close modal"
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                            }}
                        >
                            <FontAwesomeIcon icon={faTimes} style={{ fontSize: '0.875rem', display: 'block' }} />
                        </button>
                    </div>

                    <div className="p-6">
                        {formStatus.success ? (
                            <div className="flex flex-col items-center justify-center py-10" style={{ animation: 'fadeIn 0.4s ease forwards' }}>
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                                    style={{
                                        background: 'rgba(52, 211, 153, 0.1)',
                                        border: '1px solid rgba(52, 211, 153, 0.3)',
                                        animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                                    }}
                                >
                                    <FontAwesomeIcon icon={faCheck} style={{ color: '#34d399', fontSize: '1.5rem' }} />
                                </div>
                                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                                    Message Sent
                                </h3>
                                <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                                    {formStatus.message}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={onSubmit} className="space-y-4">
                                {(['name', 'email', 'message'] as const).map((field) => {
                                    const isActive = focusedField === field || !!formData[field];
                                    return (
                                        <div key={field} className="relative">
                                            <label
                                                htmlFor={field}
                                                className="absolute transition-all duration-200 pointer-events-none"
                                                style={{
                                                    fontFamily: 'var(--font-body)',
                                                    fontSize: isActive ? '0.7rem' : '0.875rem',
                                                    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                                                    top: isActive ? '-8px' : field === 'message' ? '12px' : '10px',
                                                    left: '12px',
                                                    background: isActive ? 'var(--bg-elevated)' : 'transparent',
                                                    padding: isActive ? '0 4px' : '0',
                                                    zIndex: 1
                                                }}
                                            >
                                                {field.charAt(0).toUpperCase() + field.slice(1)}
                                            </label>
                                            {field === 'message' ? (
                                                <div className="relative">
                                                    <textarea
                                                        id={field}
                                                        name={field}
                                                        value={formData[field]}
                                                        onChange={handleInputChange}
                                                        onFocus={() => handleFieldFocus(field)}
                                                        onBlur={handleFieldBlur}
                                                        rows={5}
                                                        maxLength={500}
                                                        style={{ ...inputStyle, resize: 'none', paddingBottom: '24px' }}
                                                        required
                                                        onFocusCapture={e => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                                                        onBlurCapture={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                                    />
                                                    {formData.message.length > 0 && (
                                                        <span
                                                            style={{
                                                                position: 'absolute',
                                                                bottom: '8px',
                                                                right: '10px',
                                                                fontSize: '0.7rem',
                                                                fontFamily: 'var(--font-mono)',
                                                                color: formData.message.length >= 450
                                                                    ? formData.message.length >= 500 ? '#f87171' : '#fbbf24'
                                                                    : 'var(--text-muted)',
                                                                pointerEvents: 'none',
                                                                transition: 'color 0.2s ease',
                                                            }}
                                                        >
                                                            {formData.message.length}/500
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <input
                                                    type={field === 'email' ? 'email' : 'text'}
                                                    id={field}
                                                    name={field}
                                                    value={formData[field]}
                                                    onChange={handleInputChange}
                                                    onFocus={() => handleFieldFocus(field)}
                                                    onBlur={handleFieldBlur}
                                                    style={inputStyle}
                                                    required
                                                    onFocusCapture={e => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                                                    onBlurCapture={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                                />
                                            )}
                                        </div>
                                    );
                                })}

                                {formStatus.error && (
                                    <div
                                        className="p-3 rounded-lg text-sm text-center"
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.08)',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            color: '#fca5a5'
                                        }}
                                    >
                                        {formStatus.message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={formStatus.submitting}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
                                    style={{
                                        background: 'var(--accent)',
                                        color: '#0d1117',
                                        fontFamily: 'var(--font-body)',
                                        fontWeight: 600,
                                        opacity: formStatus.submitting ? 0.7 : 1,
                                        cursor: formStatus.submitting ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 0 20px rgba(34, 211, 238, 0.15)'
                                    }}
                                    onMouseEnter={e => {
                                        if (!formStatus.submitting) {
                                            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(34, 211, 238, 0.3)';
                                            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(34, 211, 238, 0.15)';
                                        (e.currentTarget as HTMLElement).style.transform = 'none';
                                    }}
                                >
                                    {formStatus.submitting ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes modalEntrance {
                    from { opacity: 0; transform: scale(0.95) translateY(12px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0); }
                    to   { transform: scale(1); }
                }
            `}</style>
        </>
    );
}
