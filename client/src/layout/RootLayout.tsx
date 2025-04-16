import { Outlet, useLocation } from "react-router"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"


const RootLayout = () => {
    const location = useLocation()
    const path = location.pathname
    const isDashboard = path.includes("/dashboard")
    return (
        <div className={`${isDashboard ? "pt-0" : "pt-24"}`}> {/* 5rem = 80px (assuming 1rem = 16px) */}
            {!isDashboard && (
                <Navbar />
            )}
            <Outlet />
            <Footer />
        </div>
    )
}

export default RootLayout