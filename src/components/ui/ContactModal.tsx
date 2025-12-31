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

    // Prevent body scroll when modal is open
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

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Close modal and reset form on success
    useEffect(() => {
        if (formStatus.success) {
            setTimeout(() => {
                onClose();
                resetForm();
            }, 3000);
        }
    }, [formStatus.success, onClose, resetForm]);

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        await handleSubmit(e);
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                id="contact-modal-backdrop"
                className="fixed inset-0 bg-gray-900 flex items-center justify-center px-4"
                style={{
                    zIndex: 9999,
                    backgroundColor: 'rgb(17, 24, 39)'
                }}
                onClick={handleBackdropClick}
            >
                <div
                    className="bg-gray-800 border border-indigo-500 rounded-xl w-full max-w-md overflow-hidden transform transition-all duration-500 ease-out"
                    style={{
                        boxShadow: "0 0 40px rgba(99, 102, 241, 0.4)",
                        animation: "modalEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                    }}
                >
                    {/* Modal Header */}
                    <div className="relative p-6 pb-4 border-b border-gray-700">
                        <h2 className="text-2xl font-bold text-white text-center">Contact Me</h2>
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors bg-gray-700 hover:bg-gray-600 rounded-full w-9 h-9 flex items-center justify-center"
                            aria-label="Close modal"
                        >
                            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-6 pt-8">
                        {formStatus.success ? (
                            <div className="flex flex-col items-center justify-center py-8 animate-fadeIn">
                                <div className="w-20 h-20 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4 animate-scaleIn">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-400 w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-3">Thank You!</h3>
                                <p className="text-green-300 text-center text-lg">{formStatus.message}</p>
                            </div>
                        ) : (
                            <form onSubmit={onSubmit} className="space-y-6">
                                <div className="relative">
                                    <label
                                        htmlFor="name"
                                        className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusedField === 'name' || formData.name
                                                ? '-top-2.5 text-xs text-indigo-400 bg-gray-800 px-2'
                                                : 'top-3 text-gray-400 text-base'
                                            }`}
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        onFocus={() => handleFieldFocus('name')}
                                        onBlur={handleFieldBlur}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <label
                                        htmlFor="email"
                                        className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusedField === 'email' || formData.email
                                                ? '-top-2.5 text-xs text-indigo-400 bg-gray-800 px-2'
                                                : 'top-3 text-gray-400 text-base'
                                            }`}
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onFocus={() => handleFieldFocus('email')}
                                        onBlur={handleFieldBlur}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <label
                                        htmlFor="message"
                                        className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusedField === 'message' || formData.message
                                                ? '-top-2.5 text-xs text-indigo-400 bg-gray-800 px-2'
                                                : 'top-3 text-gray-400 text-base'
                                            }`}
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        onFocus={() => handleFieldFocus('message')}
                                        onBlur={handleFieldBlur}
                                        rows={5}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                                        required
                                    ></textarea>
                                </div>

                                {formStatus.error && (
                                    <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4 animate-fadeIn">
                                        <p className="text-red-400 text-sm text-center">{formStatus.message}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={formStatus.submitting}
                                    className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-indigo-500/50 ${formStatus.submitting ? "opacity-80 cursor-not-allowed" : "hover:transform hover:-translate-y-0.5"
                                        }`}
                                >
                                    {formStatus.submitting ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5 mr-2" />
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
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scaleIn {
                    from {
                        transform: scale(0);
                    }
                    to {
                        transform: scale(1);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-in forwards;
                }

                .animate-scaleIn {
                    animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
            `}</style>
        </>
    );
}
