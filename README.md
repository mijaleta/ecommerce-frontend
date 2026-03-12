# E-Commerce Frontend

[![React](https://img.shields.io/badge/React-19.0-brightgreen)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.0-blue)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.11-orange)](https://redux-toolkit.js.org/)

A modern, responsive e-commerce web application built with React, TypeScript, Vite, Redux Toolkit, React Router, and Tailwind CSS. Features user authentication, product browsing, shopping cart, and admin dashboard.

![Screenshot](public/miretu.jpg) <!-- Replace with actual screenshot if available -->

## ✨ Features

- **User Authentication**: Secure login, signup with Redux-managed state.
- **Product Catalog**: Browse products with card-based UI.
- **Shopping Cart**: Add/remove items, manage cart state.
- **Admin Dashboard**: Admin-only panel for management.
- **Responsive Design**: Tailwind CSS for mobile-first responsive layouts.
- **Type-Safe**: Full TypeScript coverage.
- **Fast Development**: Vite for HMR and optimized builds.
- **State Management**: Redux Toolkit with RTK Query potential in services.

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 19, TypeScript 5.9 |
| **Build Tool** | Vite 7 |
| **State** | Redux Toolkit 2.11, React Redux |
| **Routing** | React Router DOM 7 |
| **Styling** | Tailwind CSS 3.4 |
| **HTTP** | Axios 1.13 |
| **Icons** | React Icons 5.6 |
| **Linting** | ESLint 9 |
| **Deployment** | Vercel (vercel.json configured) |

## 📁 Project Structure

```
src/
├── app/          # Redux store configuration
├── components/   # Reusable UI components (Header, Hero, ProductCard)
├── features/     # Redux slices (auth, cart, products)
├── pages/        # Page components (Home, Cart, Login, AdminDashboard)
├── services/     # API services (auth, cart, products)
├── hooks/        # Custom React hooks
├── types/        # TypeScript type definitions
├── utils/        # Utility functions
├── App.tsx       # Main app with routing
└── main.tsx      # Entry point
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Yarn or npm

### Installation

1. Clone the repo:
   ```bash
   git clone <your-repo-url>
   cd ecommerce-frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Run development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173).

### Build for Production

```bash
yarn build
# or
npm run build
```

Preview the build:
```bash
yarn preview
```

## 🌐 Deployment

- **Vercel**: Push to GitHub and deploy directly (vercel.json included).
- Built with Vite for static hosting.

## 🔍 API Integration

Services in `src/services/` handle API calls via Axios. Update base URLs for backend integration (assumed REST APIs for auth/products/cart).

## 🤝 Contributing

1. Fork the project.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to branch (`git push origin feature/AmazingFeature`).
5. Open Pull Request.

## 📄 License

This project is open-source. See [LICENSE](LICENSE) for details (add if needed).

---

⭐ Star this repo if you found it useful!

