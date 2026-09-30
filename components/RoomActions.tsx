"use client";

import { useTransition } from "react";
import { updateRoomStatus } from "@/app/actions/booking";

export default function RoomActions({
  roomId,
  currentStatus,
}: {
  roomId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (nextStatus: string) => {
    startTransition(async () => {
      await updateRoomStatus(roomId, nextStatus);
    });
  };

  return (
    <div className="flex gap-1.5">
      {currentStatus === "OCCUPIED" && (
        <button
          disabled={isPending}
          onClick={() => handleStatusChange("CLEANING")}
          className="text-xs bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-600/40 px-2.5 py-1 rounded transition disabled:opacity-50"
        >
          {isPending ? "..." : "Check Out"}
        </button>
      )}

      {currentStatus === "CLEANING" && (
        <button
          disabled={isPending}
          onClick={() => handleStatusChange("AVAILABLE")}
          className="text-xs bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-600/40 px-2.5 py-1 rounded transition disabled:opacity-50"
        >
          {isPending ? "..." : "Mark Clean"}
        </button>
      )}

      {currentStatus === "AVAILABLE" && (
        <button
          disabled={isPending}
          onClick={() => handleStatusChange("MAINTENANCE")}
          className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded transition disabled:opacity-50"
        >
          {isPending ? "..." : "Hold"}
        </button>
      )}

      {currentStatus === "MAINTENANCE" && (
        <button
          disabled={isPending}
          onClick={() => handleStatusChange("AVAILABLE")}
          className="text-xs bg-emerald-700/30 hover:bg-emerald-600/40 text-emerald-300 px-2 py-1 rounded transition disabled:opacity-50"
        >
          {isPending ? "..." : "Release"}
        </button>
      )}
    </div>
  );
}