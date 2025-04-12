import { Outlet } from "react-router"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"


const RootLayout = () => {
    return (
        <div className="pt-24"> {/* 5rem = 80px (assuming 1rem = 16px) */}
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    )
}

export default RootLayout