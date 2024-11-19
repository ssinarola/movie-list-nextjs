import React from "react";

export default function ErrorMessage({ error, message = "", className = "" }) {
  /**
    @param error error, if have error then only render error message component
    @param message error message
    @param className class
    @returns Error Component with message
  */

  return error && (
    <span className={`text-error text-body-sm leading-body-sm ${className}`}>{message}</span>
  );
}
