import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        setToast({ message, type, id: Date.now() });

        if (duration > 0) {
            setTimeout(() => {
                setToast(current => current?.id === toast?.id ? null : current);
            }, duration);
        }
    }, [toast]);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast, toast }}>
            {children}
        </ToastContext.Provider>
    );
};
