"use client";

import { logoutAdmin } from "@/app/actions/auth";

export default function LogoutButton() {
  return (
    <button
      onClick={() => logoutAdmin()}
      className="bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800/40 font-semibold px-3 py-2 rounded-lg text-sm transition"
    >
      Sign Out
    </button>
  );
}