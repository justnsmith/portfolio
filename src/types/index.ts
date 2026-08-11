// Contact form
export interface FormData {
    name: string;
    email: string;
    message: string;
}

export interface FormStatus {
    submitting: boolean;
    success: boolean;
    error: boolean;
    message: string;
}

export interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}
