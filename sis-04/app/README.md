# Smart Campus Room Availability Checker

Fictional read-only campus room catalog, filter, and booking-slot availability checker built with React, TypeScript, and Vite.

## Setup

```bash
cd sis-04/app
npm install
```

## Run the application

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Run tests

```bash
npx vitest run
```

Or via npm script:

```bash
npm test
```

## Module Structure

- `src/rooms.ts` — `Room` type and fictional `ROOMS` catalog (capacity, equipment, blocked status, bookings)
- `src/filter.ts` — `filterRooms()` implementing capacity (`F1`) and equipment (`F2`) filtering
- `src/booking.ts` — `canBook()` (`AC1`–`AC5`), `getBookingIssue()`, and `checkRoom()` (`F3`, `F5`)
- `src/lib/checkAvailability.ts` — UI-facing validation reason formatter delegating to `booking.ts`
- `src/App.tsx` & `src/components/` — UI components importing rules without duplicating domain logic
