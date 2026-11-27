import React, { useEffect } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineClose,
} from "react-icons/ai";
import "./Toast.css";

const Toast = ({ message, onClose, duration = 3000 }) => {
  // Fecha sozinho depois de `duration` ms.
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  // Mensagens de falha não ganham o ícone de sucesso.
  const isError = /erro|falha|inválid|não foi poss|nada para/i.test(String(message));

  return (
    <div className="toast-container" role={isError ? "alert" : "status"}>
      <div className={`toast-content ${isError ? "error" : ""}`}>
        {isError ? (
          <AiOutlineCloseCircle className="toast-icon" aria-hidden="true" />
        ) : (
          <AiOutlineCheckCircle className="toast-icon" aria-hidden="true" />
        )}
        <span className="toast-message">{message}</span>
        <button type="button" onClick={onClose} className="toast-close" aria-label="Fechar aviso">
          <AiOutlineClose aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
