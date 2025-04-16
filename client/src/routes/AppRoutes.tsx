import { BrowserRouter, Route, Routes } from "react-router"
import RootLayout from "../layout/RootLayout"
import Home from "../pages/Home"
import SignIn from "../pages/SignIn"
import SignUp from "../pages/SignUp"
import Categories from "../pages/Categories"
import Brands from "../pages/Brands"
import BrandDetails from "../pages/BrandDetails"
import AboutUs from "../pages/AboutUs"
import DashboardLayOut from "../pages/DashboardLayOut"
import Dashboard from "../pages/Dashboard"
import Profile from "../pages/Profile"
import PrivateRoute from "../components/PrivateRoute"


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RootLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<DashboardLayOut />} >
                            <Route index element={<Dashboard />} />
                            <Route path="/dashboard/manage" element={<Dashboard />} />
                            <Route path="/dashboard/profile" element={<Profile />} />
                        </Route>
                    </Route>
                    <Route path="/brands" element={<Brands />} />
                    <Route path="/aboutus" element={<AboutUs />} />
                    <Route path="/brand-details/:id" element={<BrandDetails />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes