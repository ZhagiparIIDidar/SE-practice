export type Booking = {
  start: number; // minutes from midnight, [0, 1440)
  end: number; // minutes from midnight, (0, 1440]
  label?: string;
};

export type Room = {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  type: string;
  equipment: string[];
  blocked: boolean;
  bookings: Booking[];
};

export const EQUIPMENT_OPTIONS = [
  "projector",
  "whiteboard",
  "microphone",
  "tv-screen",
  "lab-bench",
  "recording",
] as const;

// Fictional sample catalog only. Times are minutes from midnight (600 = 10:00).
export const ROOMS: Room[] = [
  {
    id: "r-001",
    name: "Engineering Hall A",
    building: "Engineering Block",
    floor: 1,
    capacity: 120,
    type: "Lecture Hall",
    equipment: ["projector", "microphone", "whiteboard"],
    blocked: false,
    bookings: [
      { start: 540, end: 600, label: "Calculus I" }, // 09:00-10:00
      { start: 720, end: 840, label: "Physics 201" }, // 12:00-14:00
    ],
  },
  {
    id: "r-002",
    name: "Thermodynamics Lab",
    building: "Engineering Block",
    floor: 2,
    capacity: 40,
    type: "Lab",
    equipment: ["projector", "lab-bench"],
    blocked: true,
    bookings: [],
  },
  {
    id: "r-003",
    name: "Newton Auditorium",
    building: "Science Wing",
    floor: 1,
    capacity: 300,
    type: "Auditorium",
    equipment: ["projector", "microphone", "recording"],
    blocked: false,
    bookings: [
      { start: 600, end: 720, label: "Guest Lecture" }, // 10:00-12:00
      { start: 900, end: 1020, label: "Symposium" }, // 15:00-17:00
    ],
  },
  {
    id: "r-004",
    name: "Seminar Room 204",
    building: "Humanities Building",
    floor: 2,
    capacity: 25,
    type: "Seminar Room",
    equipment: ["whiteboard", "tv-screen"],
    blocked: false,
    bookings: [{ start: 480, end: 540, label: "Ethics Seminar" }], // 08:00-09:00
  },
  {
    id: "r-005",
    name: "Robotics Lab",
    building: "Engineering Block",
    floor: 3,
    capacity: 35,
    type: "Lab",
    equipment: ["projector", "whiteboard", "lab-bench"],
    blocked: false,
    bookings: [
      { start: 780, end: 840, label: "Robotics Workshop" }, // 13:00-14:00
      { start: 1140, end: 1200, label: "Open Lab" }, // 19:00-20:00
    ],
  },
  {
    id: "r-006",
    name: "Quiet Study Room B",
    building: "Central Library",
    floor: 4,
    capacity: 12,
    type: "Study Room",
    equipment: ["whiteboard"],
    blocked: false,
    bookings: [],
  },
  {
    id: "r-007",
    name: "Lecture Hall C",
    building: "Science Wing",
    floor: 2,
    capacity: 80,
    type: "Lecture Hall",
    equipment: ["projector", "microphone"],
    blocked: true,
    bookings: [{ start: 600, end: 720, label: "Maintenance" }],
  },
  {
    id: "r-008",
    name: "Group Study Lounge",
    building: "Central Library",
    floor: 2,
    capacity: 20,
    type: "Study Room",
    equipment: ["whiteboard", "tv-screen"],
    blocked: false,
    bookings: [
      { start: 360, end: 420, label: "Morning Group" }, // 06:00-07:00
      { start: 660, end: 720, label: "Reading Circle" }, // 11:00-12:00
    ],
  },
];
