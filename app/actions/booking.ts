"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBooking(formData: FormData) {
  const roomId = formData.get("roomId") as string;
  const guestName = formData.get("guestName") as string;
  const guestPhone = formData.get("guestPhone") as string;
  const checkInStr = formData.get("checkIn") as string;
  const checkOutStr = formData.get("checkOut") as string;

  if (!roomId || !guestName || !guestPhone || !checkInStr || !checkOutStr) {
    throw new Error("Missing required fields");
  }

  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);

  // Fetch room to calculate total price
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  // Calculate nights
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  const totalPrice = nights * room.pricePerNight;

  // Create booking and mark room as OCCUPIED
  await prisma.$transaction([
    prisma.booking.create({
      data: {
        guestName,
        guestPhone,
        checkIn,
        checkOut,
        totalPrice,
        roomId,
        status: "CONFIRMED",
      },
    }),
    prisma.room.update({
      where: { id: roomId },
      data: { status: "OCCUPIED" },
    }),
  ]);

  // Refresh dashboard data instantly
  revalidatePath("/");
}
export async function updateRoomStatus(roomId: string, newStatus: string) {
  if (!roomId || !newStatus) {
    throw new Error("Invalid parameters");
  }

  // Update room status
  await prisma.room.update({
    where: { id: roomId },
    data: { status: newStatus },
  });

  // If checking out, mark the active booking as CHECKED_OUT
  if (newStatus === "CLEANING" || newStatus === "AVAILABLE") {
    await prisma.booking.updateMany({
      where: {
        roomId,
        status: { in: ["CONFIRMED", "CHECKED_IN"] },
      },
      data: { status: "CHECKED_OUT" },
    });
  }

  revalidatePath("/");
}