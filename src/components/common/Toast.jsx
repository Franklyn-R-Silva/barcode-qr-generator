import React, { useEffect } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineClose,
} from "react-icons/ai";
import { useT } from "../../i18n";
import "./Toast.css";

const Toast = ({ message, onClose, duration = 3000 }) => {
  const t = useT();
  // Closes itself after `duration` ms.
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  // Failure messages (Portuguese or English; "erro" also matches "error") do not get the success icon.
  const isError = /erro|falha|inválid|não foi poss|nada para|nothing to/i.test(String(message));

  return (
    <div className="toast-container" role={isError ? "alert" : "status"}>
      <div className={`toast-content ${isError ? "error" : ""}`}>
        {isError ? (
          <AiOutlineCloseCircle className="toast-icon" aria-hidden="true" />
        ) : (
          <AiOutlineCheckCircle className="toast-icon" aria-hidden="true" />
        )}
        <span className="toast-message">{message}</span>
        <button type="button" onClick={onClose} className="toast-close" aria-label={t("Close notice")}>
          <AiOutlineClose aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
