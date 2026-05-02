# 🏥 MedBook — Healthcare Appointment System

> **Capstone Project** | React + Redux Toolkit + Vite + Tailwind CSS

A fully-featured healthcare appointment management system with doctor discovery, time-slot booking, patient dashboard with charts, dark mode, and protected routes.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔍 **Doctor Listing** | Search, filter by specialty, sort (rating/fee/experience) |
| 📅 **Multi-Step Booking** | Date picker → Time slot → Patient form → Confirm |
| 🧑‍⚕️ **Doctor Profile** | Full profile with education, rating, languages, availability |
| 📊 **Patient Dashboard** | Pie chart (status), Bar chart (spending), CRUD on appointments |
| 🔒 **Auth + Protected Routes** | Login/Register, redirects, demo account |
| 🌙 **Dark Mode** | Persisted via localStorage |
| ⚡ **Performance** | Lazy loading, debounced search, pagination |
| 🛡️ **Error Boundary** | Catches render errors gracefully |
| 📦 **Redux Toolkit** | State slices for auth, doctors, appointments |
| 💾 **Persistence** | Appointments saved to localStorage |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# 1. Navigate to project folder
cd healthcare-appointment-system

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Patient | `patient@demo.com` | `demo123` |
| Admin | `admin@demo.com` | `admin123` |

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx       # Sticky nav with dark mode & auth
│   ├── Footer.jsx       # Site footer
│   ├── DoctorCard.jsx   # Doctor listing card
│   ├── AppointmentCard.jsx  # Appointment with CRUD actions
│   ├── StatsCard.jsx    # Dashboard stat widget
│   ├── ProtectedRoute.jsx   # Auth guard
│   ├── ErrorBoundary.jsx    # Error boundary class component
│   └── LoadingSpinner.jsx   # Reusable spinner
├── pages/               # Route-level pages
│   ├── Home.jsx         # Landing page
│   ├── Doctors.jsx      # Listing + search + filter + pagination
│   ├── DoctorDetail.jsx # Doctor profile
│   ├── Booking.jsx      # 4-step booking wizard
│   ├── Dashboard.jsx    # Patient dashboard + charts
│   ├── Login.jsx        # Login with validation
│   ├── Register.jsx     # Registration with multi-step validation
│   └── NotFound.jsx     # 404 page
├── store/
│   ├── store.js         # Redux store config
│   └── slices/
│       ├── authSlice.js         # Auth state
│       ├── doctorsSlice.js      # Doctors + async thunk + selectors
│       └── appointmentsSlice.js # Appointment CRUD
├── hooks/
│   ├── useDebounce.js   # Debounced input hook
│   └── useDarkMode.js   # Dark mode with persistence
├── data/
│   └── mockData.js      # Doctors, time slots, specialties
├── App.jsx              # Router + lazy loading + Toaster
├── main.jsx             # React entry point
└── index.css            # Tailwind + global styles
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18 (Vite)
- **State Management**: Redux Toolkit
- **Routing**: React Router v6 (with protected routes + lazy loading)
- **Styling**: Tailwind CSS (dark mode, custom tokens)
- **Charts**: Recharts (Pie + Bar)
- **HTTP**: Axios (configured, with mock async thunk)
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Deployment**: Vercel / Netlify (static build ready)

---

## 📦 Build for Production

```bash
npm run build
npm run preview   # Preview production build locally
```

---

## 🚀 Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

---

## 📋 Capstone Requirements Checklist

- [x] React (Vite) + JavaScript ES6+
- [x] Redux Toolkit (3 slices)
- [x] React Router with protected routes
- [x] API/Async Thunk integration (fetchDoctors)
- [x] CRUD operations (appointments)
- [x] Pagination + debounced search
- [x] Dark mode toggle
- [x] Error Boundary implementation
- [x] Performance optimization (lazy loading, memoization)
- [x] Dashboard with charts (Recharts)
- [x] Multi-step form with validation
- [x] Authentication (login/register/logout)
- [x] Deployment ready (Vercel/Netlify)

---

*Made with ❤️ — MedBook Capstone Project*
