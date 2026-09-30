import RoomActions from "@/components/RoomActions";
import { prisma } from "@/lib/prisma";
import BookingModal from "@/components/BookingModal";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const rooms = await prisma.room.findMany({
    orderBy: { roomNumber: "asc" },
  });

  const availableRooms = rooms.filter((r) => r.status === "AVAILABLE");

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { room: true },
  });

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Dahuk Tea Resort
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Live Room Occupancy Overview
            </p>
          </div>
          <div className="flex gap-3">
            <BookingModal rooms={availableRooms} />
          </div>
        </header>

        {/* Room Status Summary Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
            <span className="text-xs uppercase font-semibold text-slate-400">Total Rooms</span>
            <p className="text-2xl font-bold mt-1 text-white">{rooms.length}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
            <span className="text-xs uppercase font-semibold text-emerald-400">Available</span>
            <p className="text-2xl font-bold mt-1 text-emerald-400">{availableRooms.length}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
            <span className="text-xs uppercase font-semibold text-rose-400">Occupied</span>
            <p className="text-2xl font-bold mt-1 text-rose-400">
              {rooms.filter((r) => r.status === "OCCUPIED").length}
            </p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
            <span className="text-xs uppercase font-semibold text-amber-400">Cleaning</span>
            <p className="text-2xl font-bold mt-1 text-amber-400">
              {rooms.filter((r) => r.status === "CLEANING").length}
            </p>
          </div>
        </section>

        {/* Rooms Grid */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-slate-200 mb-4">Rooms Matrix</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {rooms.map((room) => {
              const statusStyles: Record<string, string> = {
                AVAILABLE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                OCCUPIED: "bg-rose-500/10 text-rose-400 border-rose-500/30",
                CLEANING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
                MAINTENANCE: "bg-slate-500/10 text-slate-400 border-slate-500/30",
              };

              return (
                <div
                  key={room.id}
                  className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-5 hover:border-slate-500 transition shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-xl font-bold text-white">Room {room.roomNumber}</span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                          statusStyles[room.status] || "bg-slate-500/20 text-slate-300 border-slate-600"
                        }`}
                      >
                        {room.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">{room.type}</p>
                    <p className="text-xs text-slate-500 mt-1">Capacity: {room.capacity} Guests</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-700/50 flex justify-between items-center">
                    <span className="text-base font-semibold text-emerald-400">
                      ৳{room.pricePerNight}
                      <span className="text-xs font-normal text-slate-400"> / night</span>
                    </span>
                    <RoomActions roomId={room.id} currentStatus={room.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Bookings Table */}
        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-4">Recent Bookings</h2>
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden">
            {recentBookings.length === 0 ? (
              <p className="p-6 text-sm text-slate-400 text-center">No bookings recorded yet.</p>
            ) : (
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800 text-slate-400 uppercase text-xs border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Guest</th>
                    <th className="py-3 px-4">Room</th>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-medium text-white">
                        {b.guestName}
                        <span className="block text-xs text-slate-400">{b.guestPhone}</span>
                      </td>
                      <td className="py-3 px-4">Room {b.room.roomNumber}</td>
                      <td className="py-3 px-4 text-xs">
                        {new Date(b.checkIn).toLocaleDateString()} →{" "}
                        {new Date(b.checkOut).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-400">৳{b.totalPrice}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}