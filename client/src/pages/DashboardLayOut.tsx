import { Home, PlusSquare, User } from "lucide-react"
import { Link, Outlet, useLocation } from "react-router"
import { useSignOut } from "../api/authApi"
import { useEffect, useRef, useState } from "react"
import LogoutConfirmationModal from "../components/LogoutConfirmationModal"
import logo from "../assets/images/logo.png";
import { useSelector } from "react-redux"
import { RootState } from "../store"
import { FaComment } from "react-icons/fa"


const DashboardLayOut = () => {
    const location = useLocation()
    const path = location.pathname
    const active = path.split("/").pop() || "Profile"
    const [activeLink, setActive] = useState(active)
    const { user } = useSelector((state: RootState) => state.auth);
    const isAdmin = user?.isAdmin || false;
    const { signout } = useSignOut();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Check if mobile view on mount and resize
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 640); // sm breakpoint
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    // Close sidebar when switching to desktop view
    useEffect(() => {
        if (!isMobile) {
            setIsSidebarOpen(false);
        }
    }, [isMobile]);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isSidebarOpen &&
                isMobile &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen, isMobile]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSignout = () => {
        setShowLogoutModal(true);
    };

    const confirmSignout = () => {
        signout();
        setShowLogoutModal(false);
    };
    return (
        <div>
            {/* Mobile toggle button - only shows on mobile */}
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                >
                    <span className="sr-only">Open sidebar</span>
                    <svg
                        className="w-6 h-6"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            clipRule="evenodd"
                            fillRule="evenodd"
                            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                        ></path>
                    </svg>
                </button>
            )}
            {/* Backdrop - only shows on mobile when sidebar is open */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}
            <aside ref={sidebarRef}
                id="default-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isMobile
                    ? isSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    : "translate-x-0"
                    } sm:translate-x-0`}
                aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    <ul className="space-y-3 font-medium">
                        <li>
                            <Link to="/home" className="flex items-center mt-2 mb-7 space-x-3 rtl:space-x-reverse">
                                <img
                                    src={logo}
                                    alt="Logo"
                                    className="h-14"
                                />
                                <h1 className="font-bold text-[#71BE63] text-xl">Friendly <span className="text-black font-bold">ليسته</span></h1>
                            </Link>
                        </li>
                        <li>
                            <Link to="profile" onClick={() => setActive("profile")} className={`${activeLink === "profile" && "bg-gray-200"} flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group`}>
                                <User color="#73bf63" size={25} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
                                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-[#71BE63] bg-[#c2ecbb] rounded-full dark:bg-gray-700 dark:text-gray-300">
                                    {isAdmin ? "Admin" : "User"}
                                </span>
                            </Link>
                        </li>

                        {
                            isAdmin && (
                                <li>
                                    <Link to="manage" onClick={() => setActive("manage")} className={`${activeLink === "manage" && "bg-gray-200"} flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group`}>
                                        <svg className="w-5 h-5 text-[#73bf63] transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                            <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                            <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                        </svg>
                                        <span className="ms-3">Dashboard</span>
                                    </Link>
                                </li>
                            )
                        }
                        {
                            isAdmin && (
                                <li>
                                    <Link to="create" onClick={() => setActive("create")} className={`${activeLink === "create" && "bg-gray-200"} flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group`}>
                                        <PlusSquare color="#73bf63" size={25} />
                                        <span className="flex-1 ms-3 whitespace-nowrap">Create Brand</span>
                                    </Link>
                                </li>
                            )
                        }

                        {
                            isAdmin && (
                                <li>
                                    <Link to="users" onClick={() => setActive("Users")} className={`${active === "Users" && "bg-gray-200"} flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group`}>
                                        <svg className="shrink-0 w-5 h-5 text-[#73bf63] transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                            <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                        </svg>
                                        <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                                    </Link>
                                </li>
                            )
                        }
                        {
                            isAdmin && (
                                <li>
                                    <Link to="brands" onClick={() => setActive("brands")} className={`${active === "brands" && "bg-gray-200"} flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group`}>
                                        <svg className="shrink-0 w-5 h-5 text-[#73bf63] transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                            <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                                        </svg>
                                        <span className="flex-1 ms-3 whitespace-nowrap">Brands</span>
                                    </Link>
                                </li>
                            )
                        }
                        {
                            isAdmin && (
                                <li>
                                    <Link to="comments" onClick={() => setActive("comments")} className={`${active === "comments" && "bg-gray-200"} flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group`}>
                                        <FaComment color="#73bf63" size={25} />
                                        <span className="flex-1 ms-3 whitespace-nowrap">Comments</span>
                                    </Link>
                                </li>
                            )
                        }
                        <li>
                            <Link to="/home" className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group`}>
                                <Home color="#73bf63" size={25} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Home</span>
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleSignout} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white cursor-pointer group">
                                <svg className="shrink-0 w-5 h-5 text-[#73bf63] transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </aside>

            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-[#73bf63] border-dashed rounded-lg dark:border-gray-700">
                    <Outlet />
                </div>
            </div>
            {showLogoutModal && (
                <LogoutConfirmationModal
                    confirmSignout={confirmSignout}
                    setShowLogoutModal={setShowLogoutModal}
                />
            )}
        </div>
    )
}

export default DashboardLayOut