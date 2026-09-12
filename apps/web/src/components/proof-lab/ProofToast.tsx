import { LuCircleAlert, LuCircleCheck, LuInfo, LuX } from "react-icons/lu";
import { createPortal } from "react-dom";

export type ProofToastMessage = {
  id: number;
  message: string;
  title: string;
  tone: "error" | "info" | "success";
};

type ProofToastProps = {
  readonly toast: ProofToastMessage;
  readonly onClose: () => void;
};

export function ProofToast({ toast, onClose }: ProofToastProps) {
  const Icon = toast.tone === "error"
    ? LuCircleAlert
    : toast.tone === "success"
      ? LuCircleCheck
      : LuInfo;

  return createPortal(
    <aside
      className={`proof-toast ${toast.tone}`}
      role={toast.tone === "error" ? "alert" : "status"}
      aria-live={toast.tone === "error" ? "assertive" : "polite"}
      aria-atomic="true"
    >
      <span className="proof-toast-icon">
        <Icon aria-hidden="true" />
      </span>
      <div className="proof-toast-copy">
        <b>{toast.title}</b>
        <p>{toast.message}</p>
      </div>
      <button type="button" onClick={onClose} aria-label="Dismiss notification">
        <LuX aria-hidden="true" />
      </button>
      <span className="proof-toast-timer" aria-hidden="true" />
    </aside>,
    document.body,
  );
}
