import { useState } from "react";
import { Link, useLocation } from "react-router";
import logo from "../assets/images/logo.png";
import { CircleUser, Heart } from "lucide-react";
import { useSignIn, useSignOut } from "../api/authApi";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Navbar = () => {
    const { user: authUser } = useSelector((state: RootState) => state.auth)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isDropdownProfileOpen, setIsDropdownProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [active, setActive] = useState<boolean>(false);
    const location = useLocation()
    const path = location.pathname.split('/')[1]
    const { isAuthenticated, user } = useSignIn()
    const { signout } = useSignOut()

console.log(authUser?.profilePicture);


    const handleSignout = () => {
        setShowLogoutModal(true);
        setIsDropdownProfileOpen(false); // Close the dropdown when showing modal
    }

    const confirmSignout = () => {
        signout();
        setShowLogoutModal(false);
    }
    return (
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/home" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-14"
                    />
                    <h1 className="font-bold text-[#71BE63] text-xl">Friendly <span className="text-black font-bold">ليسته</span></h1>
                </Link>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    {!isAuthenticated ?
                        (
                            <Link to={'/signin'} className="text-white bg-[#71BE63] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center">
                                Sign In
                            </Link>
                        )
                        :
                        (
                            <div className="flex items-center gap-5">
                                <Link to={'/favorites'} className="flex relative hover:bg-gray-100 rounded-full p-2">
                                    <Heart />
                                    <span className="bg-red-600 absolute left-6 bottom-5 flex items-center justify-center text-white font-semibold rounded-full w-5 h-5">3</span>
                                </Link>
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setIsDropdownProfileOpen(!isDropdownProfileOpen);
                                        }}
                                        id="dropdownMenuIconHorizontalButton" data-dropdown-toggle="dropdownDotsHorizontal" className="inline-flex cursor-pointer items-center p-2 text-sm font-medium text-center text-gray-900 rounded-full hover:bg-gray-100 dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600" type="button">
                                        {/* {authUser?.profilePicture ?
                                            (

                                                <img className="w-10 h-10 rounded-full" src={"https://lh3.googleusercontent.com/a/ACg8ocIPQrj6BzZE0nxEAnNGRZiDNSfC2VO3pQqiVJ4wd0NQU_z4Qg=s96-c"} alt="Rounded avatar"></img>
                                            )
                                            :
                                            ( */}
                                                <CircleUser />
                                            {/* ) */}
                                        {/* } */}
                                    </button>

                                    <div id="dropdownDotsHorizontal" className={`z-10 ${isDropdownProfileOpen ? 'block' : 'hidden'} absolute top-12 right-0 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600`}>
                                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
                                            <li>
                                                <Link to="/dashboard/profile" className="px-4 py-2 flex flex-col hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                    <span className="text-sm font-semibold overflow-hidden">{user?.email}</span>
                                                    <span className="text-sm font-semibold overflow-hidden">{user?.fullName}</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</Link>
                                            </li>
                                        </ul>
                                        <div className="py-2">
                                            <span onClick={handleSignout} className="block px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign Out</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }


                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-multi-level"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-multi-level">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <Link to="/home" className={`block py-2 px-3 rounded-sm md:bg-transparent ${path === "home" ? "text-[#71BE63]" : "text-black"} md:hover:text-[#71BE63] md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent`} aria-current="page">Home</Link>
                        </li>
                        <li className="relative">  {/* Add relative here */}
                            <button
                                onClick={() => {
                                    setIsDropdownOpen(!isDropdownOpen);
                                    setActive(!active);
                                }}
                                className={`flex ${active ? "text-[#71BE63]" : "text-black"} cursor-pointer items-center justify-between w-full py-2 px-3 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[#71BE63] md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent`}
                            >
                                Categories
                                <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button>
                            <div
                                className={`${isDropdownOpen ? 'block' : 'hidden'} absolute z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
                            >
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                    <li>
                                        <Link to="#" className="block px-4 py-2 hover:text-[#71BE63] dark:hover:bg-gray-600 dark:hover:text-white">cat1</Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="block px-4 py-2 hover:text-[#71BE63] dark:hover:bg-gray-600 dark:hover:text-white">cat2</Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <Link to="/brands" className={`block ${path === "brands" ? "text-[#71BE63]" : "text-black"}  py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[#71BE63] md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}>Brands</Link>
                        </li>
                        <li>
                            <Link to="/aboutus" className={`block ${path === "aboutus" ? "text-[#71BE63]" : "text-black"} py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[#71BE63] md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}>About Us</Link>
                        </li>
                    </ul>
                </div>
                {showLogoutModal && (
                    <LogoutConfirmationModal
                        confirmSignout={confirmSignout}
                        setShowLogoutModal={setShowLogoutModal}
                    />
                )}
            </div>
        </nav>
    );
}

export default Navbar;