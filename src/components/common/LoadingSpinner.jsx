import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ size = "md" }) => {
  return (
    <div
      className={`spinner-container spinner-${size}`}
      role="status"
      aria-live="polite"
    >
      <div className="spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

export default LoadingSpinner;
