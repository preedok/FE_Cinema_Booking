# 🎬 CinemaBook - Modern Cinema Booking System

A cutting-edge cinema ticket booking system built with Astro, React, TypeScript, and Tailwind CSS. Features real-time seat selection, QR code generation, and a beautiful, responsive UI.

## ✨ Features

- **🎫 Online & Offline Booking**: Book tickets online or through cashier
- **📱 QR Code Tickets**: Instant QR code generation for digital tickets
- **💺 Real-time Seat Selection**: Interactive seat map with availability status
- **🔐 Authentication**: User registration and login system
- **📊 Booking Management**: View and manage all your bookings
- **🎨 Modern UI**: Beautiful, responsive design with smooth animations
- **🌓 Dark Mode Ready**: Fully styled for dark mode support

## 🏗️ Tech Stack

- **Framework**: [Astro](https://astro.build/) 4.0
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **QR Codes**: qrcode library

## 📁 Project Structure

```
cinema-booking/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── booking/
│   │   │   ├── StudioSelector.tsx
│   │   │   ├── SeatSelector.tsx
│   │   │   ├── BookingSummary.tsx
│   │   │   ├── QRCodeModal.tsx
│   │   │   └── BookingCard.tsx
|   |   |   └── OfflineBookingSummary.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   └── Navbar.tsx
│   ├── layouts/
│   │   └── MainLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── auth.astro
│   │   ├── booking.astro
│   │   └── my-bookings.astro
│   │   └── booking-offline.astro
│   ├── lib/
│   │   ├── api.ts
│   │   ├── supabase.ts
│   │   ├── utils.ts
│   │   └── stores/
│   │       ├── auth.ts
│   │       └── booking.ts
│   ├── types/
│   │   └── index.ts
│   └── styles/
│       └── globals.css
├── public/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:3000`

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd FE_Cinema_Booking
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure API endpoint**
   Update the `API_BASE_URL` in `src/lib/api.ts` if your backend runs on a different URL:

   ```typescript
   const API_BASE_URL = 'http://localhost:3000/api';
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:4321`

## 🔌 API Integration
`https://github.com/preedok/FE_Cinema_Booking`
The application integrates with the following API endpoints:

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Cinema

- `GET /api/cinema/studios` - Get all studios
- `GET /api/cinema/studios/:id/seats` - Get studio seats

### Booking

- `POST /api/booking/online` - Create online booking
- `POST /api/booking/offline` - Create offline booking (cashier)
- `POST /api/booking/validate` - Validate QR code
- `GET /api/booking/my-bookings` - Get user bookings

## 🎨 Key Features Explained

### Studio Selection

- Visual studio cards with seat capacity
- Real-time availability
- Smooth selection animations

### Seat Selection

- Interactive seat map layout
- Color-coded availability (Available, Selected, Occupied)
- Row and seat number display
- Screen visualization

### Booking Flow

1. Select studio
2. Choose seats
3. Review booking summary
4. Confirm booking
5. Receive QR code instantly

### QR Code Generation

- Automatic QR code generation after booking
- Downloadable QR codes
- Modal view for easy access
- Booking code embedded

## 🎯 Pages

- **Home** (`/`) - Landing page with features
- **Auth** (`/auth`) - Login/Register page
- **Booking** (`/booking`) - Main booking interface
- **My Bookings** (`/my-bookings`) - User's booking history

## 💾 State Management

### Auth Store

- User authentication state
- Login/logout functionality
- Token management with localStorage

### Booking Store

- Selected studio tracking
- Seat selection management
- Booking flow state

## 🎨 Design System

### Colors

- **Primary**: Purple gradient (600-500)
- **Accent**: Pink to Indigo gradient
- **Success**: Green
- **Destructive**: Red

### Components

- Glass morphism effects
- Smooth animations
- Responsive design
- Accessible UI elements

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly interactions
- Adaptive layouts

## 🔒 Security Features

- JWT token authentication
- Secure API requests
- Input validation
- XSS protection

## 🛠️ Development

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Type checking

```bash
npm run astro check
```

## 📦 Dependencies

### Core

- astro: ^4.0.0
- react: ^18.2.0
- typescript: ^5.3.0

### UI & Styling

- tailwindcss: ^3.4.0
- lucide-react: ^0.263.1
- class-variance-authority: ^0.7.0

### State & Utils

- zustand: ^4.4.7
- qrcode: ^1.5.3
- clsx & tailwind-merge

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ using modern by Muhamad Iqbal Aprido

## 🙏 Acknowledgments

- Astro team for the amazing framework
- Tailwind CSS for the utility-first approach
- React team for the UI library
- All open-source contributors

---

**Note**: Make sure your backend API is running before starting the application. The default API URL is `http://localhost:3000/api`. 
