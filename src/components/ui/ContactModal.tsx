import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPaperPlane, faSpinner, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useContactForm } from "../../hooks";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

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
                className="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-50 px-4"
                style={{ backdropFilter: "blur(20px)" }}
                onClick={handleBackdropClick}
            >
                <div
                    className="bg-gray-800 border border-indigo-500 rounded-xl w-full max-w-md overflow-hidden transform transition-all duration-500 ease-out"
                    style={{
                        boxShadow: "0 0 30px rgba(99, 102, 241, 0.3)",
                        animation: "modalEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                    }}
                >
                    {/* Modal Header */}
                    <div className="p-6 pb-2 flex justify-between items-center border-b border-gray-700">
                        <h2 className="text-2xl font-bold text-white">Contact Me</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-6">
                        {formStatus.success ? (
                            <div className="flex flex-col items-center justify-center py-6 animate-fadeIn">
                                <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-400 w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
                                <p className="text-green-300 text-center">{formStatus.message}</p>
                            </div>
                        ) : (
                            <form onSubmit={onSubmit} className="space-y-5">
                                <div className="relative">
                                    <label
                                        htmlFor="name"
                                        className={`absolute left-3 transition-all duration-200 ${focusedField === 'name' || formData.name
                                                ? '-top-2 text-xs text-indigo-400 bg-gray-800 px-1 z-10'
                                                : 'top-2 text-gray-400'
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
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <label
                                        htmlFor="email"
                                        className={`absolute left-3 transition-all duration-200 ${focusedField === 'email' || formData.email
                                                ? '-top-2 text-xs text-indigo-400 bg-gray-800 px-1 z-10'
                                                : 'top-2 text-gray-400'
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
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <label
                                        htmlFor="message"
                                        className={`absolute left-3 transition-all duration-200 ${focusedField === 'message' || formData.message
                                                ? '-top-2 text-xs text-indigo-400 bg-gray-800 px-1 z-10'
                                                : 'top-2 text-gray-400'
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
                                        rows={4}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        required
                                    ></textarea>
                                </div>

                                {formStatus.error && (
                                    <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-3 animate-fadeIn">
                                        <p className="text-red-400 text-sm">{formStatus.message}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={formStatus.submitting}
                                    className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center ${formStatus.submitting ? "opacity-80 cursor-not-allowed" : ""
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
                        transform: scale(0.95) translateY(10px);
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

                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-in forwards;
                }
            `}</style>
        </>
    );
}
