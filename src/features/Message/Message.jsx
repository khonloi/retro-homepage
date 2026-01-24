import React, { useEffect, memo } from "react";
import "./Message.css";
import { useMessageForm } from "../../hooks/useMessageForm";

const Message = memo(({ onClose }) => {
  const { formRef, status, errors, isSending, sendEmail, clearMessages } =
    useMessageForm();

  // Clear messages after timeout
  useEffect(() => {
    return clearMessages();
  }, [clearMessages]);

  return (
    <div className="message-me-window">
      <form ref={formRef} onSubmit={sendEmail} className="form">
        <div className="label-error-container">
          <label className="label">Name:</label>
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        <input type="text" name="user_name" className="input" required />
        <div className="label-error-container">
          <label className="label">Email:</label>
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>
        <input type="email" name="user_email" className="input" required />
        <div className="label-error-container">
          <label className="label">Message:</label>
          {errors.message && (
            <span className="error-message">{errors.message}</span>
          )}
        </div>
        <textarea
          name="message"
          className="input textarea retro-scrollbar"
          required
        />
        <div className="button-status-container">
          <button
            type="submit"
            className="window-button program-button"
            disabled={isSending}
          >
            Send
          </button>
          {status && <p className="status-message">{status}</p>}
        </div>
      </form>
    </div>
  );
});

Message.displayName = "Message";

export default Message;
