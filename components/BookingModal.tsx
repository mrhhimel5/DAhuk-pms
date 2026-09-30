"use client";

import { useState } from "react";
import { createBooking } from "@/app/actions/booking";

type RoomOption = {
  id: string;
  roomNumber: string;
  type: string;
  pricePerNight: number;
};

export default function BookingModal({ rooms }: { rooms: RoomOption[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await createBooking(formData);
      setIsOpen(false);
    } catch (err) {
      alert("Failed to create booking. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition"
      >
        + New Reservation
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl p-6 text-slate-100 shadow-2xl">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-700">
              <h3 className="text-xl font-bold">New Guest Reservation</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Select Room
                </label>
                <select
                  name="roomId"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Choose an available room...</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      Room {room.roomNumber} - {room.type} (৳{room.pricePerNight}/night)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Guest Full Name
                </label>
                <input
                  type="text"
                  name="guestName"
                  placeholder="e.g. John Doe"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="guestPhone"
                  placeholder="e.g. 01700000000"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white bg-slate-700/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg text-sm bg-emerald-600 hover:bg-emerald-500 text-white font-semibold disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}