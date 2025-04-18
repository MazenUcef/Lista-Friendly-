import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Categories from "../pages/Categories";
import BrandDetails from "../pages/BrandDetails";
import AboutUs from "../pages/AboutUs";
import DashboardLayOut from "../pages/DashboardLayOut";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import PrivateRoute from "../components/PrivateRoute";
import CreateBrand from "../pages/CreateBrand";
import OnlyAdmin from "../components/OnlyAdmin";
import { AuthRoute } from "../components/AuthRoutes";
import AdminPosts from "../pages/DashBrands";
import Brands from "../pages/Brands";
import Favorites from "../pages/Favorites";


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RootLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/home" element={<Home />} />

                    {/* Protected auth routes */}
                    <Route path="/signin" element={
                        <AuthRoute>
                            <SignIn />
                        </AuthRoute>
                    } />
                    <Route path="/signup" element={
                        <AuthRoute>
                            <SignUp />
                        </AuthRoute>
                    } />

                    <Route path="/categories" element={<Categories />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<DashboardLayOut />}>
                            <Route index element={<Dashboard />} />
                            <Route path="/dashboard/profile" element={<Profile />} />
                            <Route element={<OnlyAdmin />}>
                                <Route path="/dashboard/manage" element={<Dashboard />} />
                                <Route path="/dashboard/create" element={<CreateBrand />} />
                                <Route path="/dashboard/brands" element={<AdminPosts />} />
                            </Route>
                        </Route>
                        <Route path="/brands" element={<Brands />} />
                    </Route>
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/aboutus" element={<AboutUs />} />
                    <Route path="/brand-details/:postId" element={<BrandDetails />} />
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;