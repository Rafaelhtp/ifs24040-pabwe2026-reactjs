import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts (Layout tetap di-import normal agar kerangka halaman langsung tersedia)
import AuthLayout from "./features/auth/layouts/AuthLayout";
import LostFoundLayout from "./features/lost-founds/layouts/LostFoundLayout";

// Lazy Loading Pages (Memecah bundle JS)
const LoginPage = lazy(() => import("./features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("./features/auth/pages/RegisterPage"));
const HomePage = lazy(() => import("./features/lost-founds/pages/HomePage"));
const DetailPage = lazy(() => import("./features/lost-founds/pages/DetailPage"));
const UsersPage = lazy(() => import("./features/users/pages/UsersPage"));
const ProfilePage = lazy(() => import("./features/users/pages/ProfilePage"));

// Komponen Loading sementara saat chunk JavaScript sedang diunduh
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <span className="text-slate-500">Loading...</span>
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route path="/" element={<LostFoundLayout />}>
          <Route index element={<HomePage />} />
          <Route path="lost-founds/:id" element={<DetailPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}