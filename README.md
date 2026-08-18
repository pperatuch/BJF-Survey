# BJF-Survey

Project structure & Tech Stack based on **React + Laravel**:

## 🛠 Tech Stack

### Frontend (`/frontend`)
- **Core**: React 18 + Vite 6 + TypeScript
- **Styling**: TailwindCSS v4
- **State Management**: Zustand
- **Server Fetching**: TanStack Query (React Query)
- **Routing & Utilities**: React Router DOM v7, Axios, Lucide Icons, clsx, tailwind-merge

### Backend (`/backend`)
- **Core**: Laravel 12 (PHP 8.2+)
- **API Authentication**: Laravel Sanctum

---

## 🚀 How to Run

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan serve
```