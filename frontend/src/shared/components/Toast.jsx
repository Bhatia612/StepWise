import { useEffect } from "react";
import "../styles/Toast.scss";

const Toast = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="toast">
            <span>⚡ {message}</span>
        </div>
    );
};

export default Toast;