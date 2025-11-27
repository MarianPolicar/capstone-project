# 🎯 Modern Booking System

A modern full-stack booking system built with **React.js** and **localStorage**, featuring user authentication, booking management, QR code receipts, and a comprehensive administrator interface.

**🚀 100% Frontend - No Backend Required!**  
Deploy anywhere as a static site. Works completely in the browser!

![Status](https://img.shields.io/badge/status-active-success.svg)
![Mode](https://img.shields.io/badge/mode-frontend--only-blue.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)

---

## ✨ Features

### 👤 User Features
- ✅ **Authentication** - Secure login/registration with localStorage
- ✅ **Booking Management** - Create, view, and cancel bookings
- ✅ **Service Selection** - Choose from multiple services
- ✅ **Date & Time Picker** - Calendar interface with available time slots
- ✅ **Profile Management** - Update personal information
- ✅ **Booking History** - View all past and upcoming bookings
- ✅ **Status Tracking** - Monitor booking status (Confirmed, Pending, Cancelled, Completed)
- ✅ **QR Code Receipts** - Download QR codes for booking verification

### 👨‍💼 Admin Features
- ✅ **Admin Dashboard** - Overview of all bookings and users
- ✅ **Booking Management** - View, approve, and manage all bookings
- ✅ **User Management** - View and manage all registered users
- ✅ **Status Control** - Update booking statuses
- ✅ **Analytics** - View booking statistics and trends
- ✅ **Role-Based Access** - Separate admin interface at `/admin/login`

### 🎨 Design
- ✅ **Modern UI** - Sleek blue/white color palette
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Lucide Icons** - Clean, professional iconography
- ✅ **Smooth Animations** - Polished user experience
- ✅ **Tailwind CSS** - Modern styling framework

### 🔧 Technical Features
- ✅ **Frontend-Only** - No backend server needed
- ✅ **localStorage** - All data stored in browser
- ✅ **Persistent Sessions** - Auto-login on page reload
- ✅ **QR Code Generator** - Create downloadable booking receipts
- ✅ **Booking Verification** - Scan QR codes to verify bookings
- ✅ **Error Handling** - Graceful error messages and fallbacks

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the App

```bash
npm run dev
```

### 3. Open in Browser

Navigate to `http://localhost:5173` (or your Vite port)

### 4. Login with Demo Account

Use any pre-configured account (see Demo Accounts below)

**That's it!** ✨ No server setup, no database configuration needed.

---

## 📱 Demo Accounts

### Admin Accounts
```
Email: roger@gmail.com
Password: gerger1

Email: val@gmail.com
Password: gerger1

Email: marian@gmail.com
Password: gerger1
```

### Regular User Account
```
Email: demo@user.com
Password: demo123
```

---

## 📁 Project Structure

```
booking-system/
├── components/               # React Components
│   ├── admin/               # Admin-specific components
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── BookingManagement.tsx
│   │   └── UserManagement.tsx
│   ├── ui/                  # Reusable UI components
│   ├── LoginRegister.tsx    # Auth components
│   ├── Dashboard.tsx        # User dashboard
│   ├── BookingForm.tsx      # Create booking
│   ├── Profile.tsx          # User profile
│   ├── QRCodeReceipt.tsx    # QR code generator
│   └── VerifyBooking.tsx    # QR code verification
│
├── utils/                   # Utility functions
│   └── localStorage.ts      # LocalStorage management
│
├── styles/                  # Global styles
│   └── globals.css          # Tailwind + custom CSS
│
├── App.tsx                  # Main application
└── README.md               # This file
```

---

## 💾 Data Storage

All data is stored in your browser's localStorage:

- ✅ User accounts and credentials (encrypted passwords)
- ✅ Bookings with all details
- ✅ User profiles and settings
- ✅ Session persistence across page reloads

**Note:** Data is stored locally per browser. Different browsers/devices will have separate data.

---

## 🚀 Deployment

Deploy as a static site to any hosting service:

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
npm run build
vercel --prod
```

### Option 2: Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

### Option 4: Any Static Host
```bash
npm run build
# Upload contents of dist/ folder to your hosting provider
```

**That's it!** Your app will work immediately with no backend configuration needed.

---

## 📱 QR Code Feature

### How It Works
1. User creates a booking
2. Click "View QR Code" on any booking
3. Download the QR code receipt as PNG
4. Scan QR code to verify booking details

### Installation for QR Code
When ready to test/use QR codes, install:
```bash
npm install qrcode @types/qrcode
```

---

## 🧪 Testing

### Test User Flow
1. Open app in browser
2. Register a new account
3. Login with credentials
4. Create a test booking
5. View booking on dashboard
6. Generate QR code receipt
7. Test booking verification

### Test Admin Flow
1. Login as admin (use demo admin account)
2. View all bookings
3. Update booking statuses
4. Manage users
5. View analytics

---

## 🐛 Troubleshooting

### App won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Data not persisting
1. ✅ Check browser localStorage is enabled
2. ✅ Verify you're using the same browser
3. ✅ Check for browser extensions blocking localStorage
4. ✅ Try incognito/private mode

### QR Code not generating
1. ✅ Install qrcode package: `npm install qrcode @types/qrcode`
2. ✅ Check browser console for errors
3. ✅ Verify booking data exists

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Router** - Navigation
- **Sonner** - Toast notifications
- **QRCode.js** - QR code generation

### Storage
- **localStorage** - Browser storage API
- **Session persistence** - Auto-login

---

## 🎨 Customization

### Change Colors
Edit `/styles/globals.css`:
```css
:root {
  --primary: 217 91% 60%;  /* Blue */
  --secondary: 240 5% 96%; /* Light gray */
}
```

### Add Services
Edit service options in `BookingForm.tsx`:
```typescript
const services = [
  'Consultation',
  'Meeting',
  'Your New Service', // Add here
];
```

### Modify Time Slots
Edit `BookingForm.tsx`:
```typescript
const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  // Add more slots
];
```

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- QR Codes by [QRCode.js](https://github.com/soldair/node-qrcode)

---

## 📞 Support

Need help? Check these resources:

1. **Browser Console** - Check for error messages
2. **localStorage** - Verify data in DevTools > Application > Local Storage
3. **Network Tab** - Check for any failed requests

---

## 🎉 Ready to Go!

Your booking system is ready to deploy:

1. ✅ Modern React frontend
2. ✅ localStorage persistence
3. ✅ Full authentication
4. ✅ Admin panel
5. ✅ QR code receipts
6. ✅ Deploy anywhere as static site

**Start building amazing booking experiences!** 🚀

---

Made with ❤️ using React and localStorage
