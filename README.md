# Synergia Event Booking API (Express + MongoDB)

This is a small Node.js + Express API for event bookings backed by MongoDB (Mongoose).

Setup

1. Install dependencies

```powershell
cd express
npm install
```

2. Create `.env` based on `.env.example` and set your MongoDB connection string

```text
MONGODB_URI=mongodb://127.0.0.1:27017/synergia
```

3. Run the API (development)

```powershell
npm run dev
```

API Endpoints

- GET /api/bookings - list all bookings
- POST /api/bookings - create a new booking (body: name, email, event, ticketType?)
- GET /api/bookings/:id - get booking by id
- PUT /api/bookings/:id - update booking
- DELETE /api/bookings/:id - delete booking
- GET /api/bookings/search?email=xyz - search by email (partial, case-insensitive)
- GET /api/bookings/filter?event=Synergia - filter by event name (partial, case-insensitive)

Notes

- Required fields for creating a booking: `name`, `email`, `event`.
- The repo uses ES modules. package.json in the `express` folder includes `type: "module"`.
