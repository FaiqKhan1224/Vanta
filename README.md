# VANTA — Automotive Studio (Detailing · Wrapping · Modification)

Dark, cinematic luxury website with a fully working authentication flow.
Stack: **Next.js 14 (TypeScript, App Router)** client + **Express / MongoDB / JWT** server. No `.html` or `.jsx` files anywhere.

## Run it

Requirements: Node 18+ and MongoDB (local or Atlas).

```bash
# 1. API
cd server
cp .env.example .env        # set MONGO_URI and a long random JWT_SECRET
npm install
npm run dev                 # http://localhost:5000

# 2. Website (new terminal)
cd client
cp .env.example .env.local
npm install
npm run dev                 # http://localhost:3000
```

## What you get
- Opening the site shows **Login / Signup** first (Show/Hide on Password and Confirm Password). Every other page is protected: unauthenticated visitors are sent to `/login?next=<page>` and returned there after signing in.
- Nav: Home | About | Services | Packages | Gallery | Reviews | Book Appointment | My Booking | Contact (also in the mobile menu and footer).
- **Book Appointment** (`/book`): service/package select, calendar, live time slots (taken slots are disabled), validated contact fields, saved to MongoDB, then `/booking-success/<id>`.
- **My Booking** (`/my-booking`): All / Upcoming / Completed / Cancelled tabs, status badges, View Details, Reschedule, Cancel (with confirmation modal), Book Again, empty/loading/error states.
- API: `POST /api/bookings`, `GET /api/bookings`, `GET /api/bookings/:id`, `PATCH /api/bookings/:id` (reschedule), `PATCH /api/bookings/:id/cancel`, `GET /api/bookings/availability?date=`. New bookings are `confirmed`; past confirmed bookings are marked `completed` automatically.
- Gallery: 6 tiles with hover zoom and a lightbox (arrow keys / Esc). Reviews: carousel with arrows and dots. Contact: form (saved as enquiries), contact details, embedded OpenStreetMap.

## Images (client/public/images)
Built from the full-resolution page artwork (1254–1672 px). Mock UI, nav bars and text baked into the artwork were cropped or painted out so the real, working components sit on top of clean car photography.

| File | Source image | Used on |
|---|---|---|
| hero-main.jpg | Landing_page_image (car + showroom, text/button removed) | Home hero, login/signup side panel |
| showcase-silver.jpg | about_page_image (front + interior split) | About header, Home "The craft" section |
| services-detailing.jpg | service_page_image (car crop) | Services header, Home "Our services" |
| packages.jpg | pricing_page_image (car crop) | Packages page |
| gallery-1…6.jpg | gallery_page_image (6 tiles cropped) | Gallery + lightbox |
| testimonials.jpg | review_page_image (car + skyline, extended) | Home + Reviews backgrounds |
| contact.jpg | contact_page_image (rear car crop) | Contact page |
| booking.jpg | booking_page_image (car crop) | Book Appointment |
| booking-success.jpg | signout_page_image (car + showroom crop) | Confirmation page, My Booking header |

## Editing content
Services, packages, prices, gallery captions, reviews and studio details live in `client/lib/data.ts`; the server mirrors ids and prices in `server/src/catalog.js` — keep the two in sync.
