import { useState, useCallback } from "react";

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

    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleFieldFocus = useCallback((fieldName: string) => {
        setFocusedField(fieldName);
    }, []);

    const handleFieldBlur = useCallback(() => {
        setFocusedField(null);
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            setFormStatus({
                submitting: false,
                success: false,
                error: true,
                message: "Please fill out all fields"
            });
            return;
        }

        try {
            setFormStatus({
                submitting: true,
                success: false,
                error: false,
                message: "Sending message..."
            });

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    subject: `New contact from ${formData.name} via portfolio`
                })
            });

            const result = await response.json();

            if (result.success) {
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
        focusedField,
        handleInputChange,
        handleFieldFocus,
        handleFieldBlur,
        handleSubmit,
        resetForm
    };
}
