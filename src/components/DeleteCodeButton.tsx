"use client";

interface DeleteCodeButtonProps {
  action: () => void;
  label: string;
  className?: string;
}

export default function DeleteCodeButton({ action, label, className }: DeleteCodeButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete "${label}"? This also deletes its scan history.`)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className={className} style={{ color: "var(--accent-red)" }}>
        delete
      </button>
    </form>
  );
}
