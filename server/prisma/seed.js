import { PrismaClient, BookingStatus, SeatStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      password: 'password1',
      name: 'User One',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      password: 'password2',
      name: 'User Two',
    },
  });

  // Create Stops
  const stop1 = await prisma.stop.create({
    data: { name: 'A' },
  });

  const stop2 = await prisma.stop.create({
    data: { name: 'B' },
  });

  // Create Trains
  const train1 = await prisma.train.create({
    data: {
      name: 'Train 1',
      trainNumber: '101',
      startStopId: stop1.id,
      endStopId: stop2.id,
    },
  });

  // Create Seats for the Train
  const seat1 = await prisma.seat.create({
    data: {
      trainId: train1.id,
      seatNumber: 'A1',
      status: SeatStatus.AVAILABLE,
    },
  });

  const seat2 = await prisma.seat.create({
    data: {
      trainId: train1.id,
      seatNumber: 'A2',
      status: SeatStatus.AVAILABLE,
    },
  });

  // Create Booking
  const booking1 = await prisma.booking.create({
    data: {
      userId: user1.id,
      trainId: train1.id,
      seatId: seat1.id,
      status: BookingStatus.CONFIRMED,
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      userId: user2.id,
      trainId: train1.id,
      seatId: seat2.id,
      status: BookingStatus.CONFIRMED,
    },
  });

  console.log('Seed data created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
