// data/reservations.ts

type Reservation = {
  name: string;
  people: number;
  time: string;
  tableNumber: number;
};

const reservations: Reservation[] = [
  {
    name: "Ahmad Wijaya",
    people: 4,
    time: "19:00",
    tableNumber: 12
  },
  {
    name: "Siti Nurhaliza",
    people: 2,
    time: "18:30",
    tableNumber: 5
  },
  {
    name: "Budi Santoso",
    people: 6,
    time: "20:00",
    tableNumber: 8
  },
  {
    name: "Maya Indira",
    people: 3,
    time: "19:30",
    tableNumber: 15
  },
  {
    name: "Rizki Pratama",
    people: 2,
    time: "18:00",
    tableNumber: 3
  },
  {
    name: "Dewi Lestari",
    people: 5,
    time: "20:30",
    tableNumber: 10
  },
  {
    name: "Andi Kurniawan",
    people: 4,
    time: "19:15",
    tableNumber: 7
  },
  {
    name: "Fitri Handayani",
    people: 2,
    time: "18:45",
    tableNumber: 2
  }
];

export default reservations;