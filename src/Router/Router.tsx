import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ThemeProvider from "../context/ThemeContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";
import Layout from "../Components/layout";
import withAuth from "./withAuth";
import ErrorBoundary from "../Components/ErrorBoundary";
const Login = lazy(() => import("../Components/login/login"));
const Register = lazy(() => import("../Components/register/register"));
const Home = lazy(() => import("../Components/home/home"));
const Dashboard = lazy(() => import("../Components/dashboard/dashboard"));
const Admin = lazy(() => import("../Components/admin/admin"));
const CourseDetail = lazy(() => import("../Components/courseDetail/courseDetail"));
const UserProfile = lazy(() => import("../Components/userProfile/userProfile"));

// Wrap the component with the HOC
const ProtectedAdmin = withAuth(Admin, "admin");

const AppRoutes = () => {
    const { currentUser } = useAuth();

    return (
        <ErrorBoundary>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="course/:courseId" element={<CourseDetail />} />
                    {/* Only render the Admin route if the user is an admin */}
                    {currentUser?.role === "admin" && (
                        <Route path="admin" element={<ProtectedAdmin />} />
                    )}
                    <Route path="profile" element={<UserProfile />} />
                </Route>
                <Route path="login" element={<Suspense fallback={<div className="page-container"><h1>Loading...</h1></div>}><Login /></Suspense>} />
                <Route path="register" element={<Suspense fallback={<div className="page-container"><h1>Loading...</h1></div>}><Register /></Suspense>} />
            </Routes>
        </ErrorBoundary>
    );
};

const Router =() => {
    return(
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <Toaster position="top-center" reverseOrder={false} />
                    <AppRoutes />
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default Router;