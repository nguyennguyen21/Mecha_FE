import { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Transition } from "@headlessui/react"; // dùng headlessui cho animation mượt

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="relative py-5 flex justify-center z-50">
      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-4/5 max-w-4xl h-14 rounded-3xl flex items-center justify-between px-8 text-white shadow-lg backdrop-blur-md">
        <div className="font-bold text-xl">Logo</div>

        {/* Desktop Menu */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li className="hover:text-gray-300 transition">
              <Link to="/">Home</Link>
            </li>
            <li className="hover:text-gray-300 transition">
              <Link to="/about">About</Link>
            </li>
            <li className="hover:text-gray-300 transition">
              <Link to="/contact">Contact</Link>
            </li>
            <li className="hover:text-gray-300 transition">
              <Link to="/login">Login</Link>
            </li>
            <li className="hover:text-gray-300 transition">
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
          {isOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-300 transform"
        enterFrom="-translate-y-5 opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transition ease-in duration-200 transform"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="-translate-y-5 opacity-0"
      >
        <div className="md:hidden fixed top-20 left-1/2 transform -translate-x-1/2 w-4/5 rounded-xl shadow-lg p-5 flex flex-col space-y-4 text-center text-white z-40">
          <Link to="/" onClick={toggleMenu} className="hover:text-gray-300">
            Home
          </Link>
          <Link to="/about" onClick={toggleMenu} className="hover:text-gray-300">
            About
          </Link>
          <Link to="/contact" onClick={toggleMenu} className="hover:text-gray-300">
            Contact
          </Link>
          <Link to="/login" onClick={toggleMenu} className="hover:text-gray-300">
            Login
          </Link>
          <Link to="/register" onClick={toggleMenu} className="hover:text-gray-300">
            Register
          </Link>
        </div>
      </Transition>
    </header>
  );
};

export default Header;
