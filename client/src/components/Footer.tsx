import logo from '../assets/images/logo.png';
import { Link } from 'react-router';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="w-full mt-5 md:mt-0 mx-auto bg-[#333333] text-white px-4 sm:px-6 py-8 sm:py-10">
            <div className="mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 md:justify-around px-4 sm:px-8 md:px-20">
                {/* Left Section */}
                <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-auto">
                    <div className='mt-0 md:mt-3'>
                        <Link to="/home" className="flex flex-col md:flex-row items-center gap-3 rtl:space-x-reverse">
                            <img
                                src={logo}
                                alt="Logo"
                                className="h-24 md:h-32"
                            />
                            <h1 className="font-extrabold text-[#71BE63] text-2xl md:text-3xl">
                                Friendly <span className="text-white font-extrabold">ليسته</span>
                            </h1>
                        </Link>
                    </div>
                    <div className="mt-2 text-sm md:text-base text-gray-400 text-center md:text-left">
                        <p>terms & services</p>
                        <p>_Creet © all rights reserved 2025</p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-auto">
                    <h3 className="text-xl md:text-2xl font-extrabold mt-0 md:mt-5">Pages</h3>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
                        <Link className='text-base md:text-lg font-semibold hover:text-[#71BE63] transition-colors' to="/home">Home</Link>
                        <Link className='text-base md:text-lg font-semibold hover:text-[#71BE63] transition-colors' to="/brands">Brands</Link>
                        <Link className='text-base md:text-lg font-semibold hover:text-[#71BE63] transition-colors' to="/aboutus">About us</Link>
                    </div>
                    <div className="flex gap-4 mt-2 md:mt-4 mb-2 md:mb-4">
                        <Link to="https://www.facebook.com/share/1B9EqQoaTt/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:text-[#71BE63] transition-colors">
                            <FaFacebook className="w-5 h-5" />
                        </Link>
                        <Link to="https://www.instagram.com/lista_friendly?igsh=MXFvNGF1dGR1NXN0eg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-[#71BE63] transition-colors">
                            <FaInstagram className="w-5 h-5" />
                        </Link>
                        <Link to="https://www.tiktok.com/@listafriendly?_t=ZS-8u8VR0IPC59&_r=1" target="_blank" rel="noopener noreferrer" className="hover:text-[#71BE63] transition-colors">
                            <FaTiktok className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}