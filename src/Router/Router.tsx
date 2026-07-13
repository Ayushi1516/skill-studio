import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ThemeProvider from "../context/ThemeContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";
import Layout from "../components/layout";
import withAuth from "./withAuth";
import ErrorBoundary from "../components/ErrorBoundary";
import { Provider } from "react-redux";
import { store } from "../features/redux/store";
const NotFound = lazy(() => import("../components/NotFound"));
const Login = lazy(() => import("../auth/login/login2"));
const Register = lazy(() => import("../auth/register/register"));
const Home = lazy(() => import("../components/home/home"));
const Dashboard = lazy(() => import("../features/dashboard/dashboard"));
const Admin = lazy(() => import("../features/admin/admin"));
const CourseDetail = lazy(() => import("../components/courseDetail/courseDetail"));
const UserProfile = lazy(() => import("../features/userProfile/userProfile"));
const LearningForm = lazy(()=> import("../learning/simple-form"))

// Wrap the component with the HOC
const ProtectedAdmin = withAuth(Admin, "admin");
const ProtectedDashboard = withAuth(Dashboard);
const ProtectedUserProfile = withAuth(UserProfile);

const AppRoutes = () => {
    const { currentUser } = useAuth();

    return (
        <ErrorBoundary>
            <Suspense fallback={<div className="page-container"><h1>Loading...</h1></div>}>
                <Routes>
                    <Route path='/' element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="dashboard" element={<ProtectedDashboard />} />
                        <Route path="course/:courseId" element={<CourseDetail />} />
                        {/* Only render the Admin route if the user is an admin */}
                        {currentUser?.role === "admin" && (
                            <Route path="admin" element={<ProtectedAdmin />} />
                        )}
                        <Route path="profile" element={<ProtectedUserProfile />} />
                    </Route>
                    <Route path="login" element={<Login />} />
                    <Route path="learning" element={<LearningForm />} />
                    <Route path="register" element={<Register />} />
                    {/* Catch-all route for 404 Not Found pages */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </ErrorBoundary>
    );
};

const Router =() => {
    return(
        <Provider store={store}>
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <Toaster position="top-center" reverseOrder={false} />
                    <AppRoutes />
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
        </Provider>
    );
}

export default Router;