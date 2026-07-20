import type { Notification } from "@/lib/types";

interface ToastProps {
  notifications: Notification[];
}

export default function Toast({ notifications }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="flex items-center gap-3 bg-zinc-900 text-white px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium pointer-events-auto border border-zinc-800"
        >
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-teal-500 text-white">
            ✓
          </span>
          <span>{n.text}</span>
        </div>
      ))}
    </div>
  );
}
