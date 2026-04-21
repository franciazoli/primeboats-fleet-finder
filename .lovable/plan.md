
# PrimeBoats — Boat Sales Web App

A mobile-first, responsive marketing + admin site for PrimeBoats (primeboats.nl), built in English.

## Public site

**Landing page (`/`)**
- Hero with PrimeBoats branding, tagline, CTA → "Browse boats"
- Featured boats strip (boats flagged "Featured")
- About / why PrimeBoats section
- Quick contact / inquiry CTA
- Footer with company info, contact, social

**Boats listing (`/boats`)**
- Responsive grid of boat cards (cover photo, name, type, price, length, status badge)
- Filters: type, condition (new/used), price range, length
- Search by name
- Sort: newest, price asc/desc

**Boat detail (`/boats/:slug`)**
- Photo gallery (swipeable on mobile, lightbox on desktop)
- Full specs: name, type, price, length, year, engine, condition, status badges (Sold / Reserved / Featured)
- Description
- "Inquire about this boat" button → opens inquiry form pre-filled with boat reference
- Related/similar boats

**Inquiry form**
- Fields: name, email, phone (optional), message, boat reference (auto if from detail page)
- Available as a standalone `/contact` page and as a modal on boat detail pages
- Validates with Zod (length limits, valid email)
- On submit: saves to database + sends email notification to PrimeBoats team + sends confirmation email to the customer

## Admin site (`/admin`)

- **Login** at `/admin/login` (email + password). Only users with `admin` role can access.
- **Dashboard** — quick stats (total boats, active listings, new inquiries this week)
- **Boats management** (`/admin/boats`)
  - Table view with search, filter, sort
  - Create / edit / delete boats
  - Form: all spec fields, status flags (Sold/Reserved/Featured toggles), multi-image upload with drag-to-reorder, set cover image
- **Inquiries** (`/admin/inquiries`)
  - List with newest first, filter by status (new / contacted / archived)
  - Detail view shows full message + linked boat
  - Mark as contacted / archived, delete

## Backend (Lovable Cloud)

- **Tables**: `boats`, `boat_images`, `inquiries`, `profiles`, `user_roles` (separate roles table with `app_role` enum + `has_role` security-definer function)
- **Storage bucket** for boat photos (public read, admin-only write)
- **RLS**:
  - Boats & images: public read; admin-only write
  - Inquiries: public insert; admin-only read/update/delete
  - User roles: admin-only management
- **Edge function** to send inquiry notification emails via Lovable's built-in email system (team notification + customer confirmation). Requires email domain setup — handled during implementation.
- First admin account: created via signup, then promoted to admin role manually in the database (you'll be guided through it).

## Design

- Clean, professional maritime feel — navy/white palette with a warm accent
- Mobile-first responsive across all pages, hamburger nav on mobile
- Fast image loading with proper sizing
- Accessible forms with clear validation messages

## Out of scope (can add later)
- Online payments / reservations
- Multi-language (Dutch toggle)
- Customer accounts
- Boat comparison tool
