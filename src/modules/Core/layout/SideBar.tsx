import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

interface MenuItem {
  label: string;
  path?: string;
  submenu?: string[];
  active?: boolean;
  icon: string;
}

const SideBar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(window.innerWidth >= 640);
  const [openSubMenus, setOpenSubMenus] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setSidebarOpen(window.innerWidth >= 640);
      }, 200);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const getActiveState = (path: string) => {
    if (path === "/dashboard" && !location.search) {
      return location.pathname === "/dashboard" && !location.search;
    }
    if (path) {
      const [pathname, search] = path.split('?');
      if (search) {
        const params = new URLSearchParams(search);
        const currentParams = new URLSearchParams(location.search);
        return location.pathname === pathname && 
               Array.from(params.entries()).every(([key, value]) => 
                 currentParams.get(key) === value
               );
      }
      return location.pathname === path;
    }
    return false;
  };

  // Get user role from localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userRole = userInfo?.Roles || userInfo?.roles || 'user';
  const isAdmin = userRole === 'admin';

  const menuItems: MenuItem[] = [
    { label: "Home", path: "/dashboard", icon: "bi-house-door", active: getActiveState("/dashboard") },
    { label: "Account", path: "/dashboard?tab=account", icon: "bi-person-circle", active: getActiveState("/dashboard?tab=account") },
    { label: "Effect", path: "/dashboard?tab=shop", icon: "bi-palette", active: getActiveState("/dashboard?tab=shop") },
    { label: "Donate", path: "/dashboard?tab=donate", icon: "bi-heart", active: getActiveState("/dashboard?tab=donate") },
    ...(isAdmin ? [{ label: "Admin", path: "/admin", icon: "bi-shield-check", active: getActiveState("/admin") }] : []),
    { label: "Logout", path: "/logout", icon: "bi-box-arrow-right", active: false },
  ];


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setOpenSubMenus(new Set());
  };

  const toggleSubMenu = (index: number) => {
    const newOpenSubMenus = new Set(openSubMenus);
    newOpenSubMenus.has(index) ? newOpenSubMenus.delete(index) : newOpenSubMenus.add(index);
    setOpenSubMenus(newOpenSubMenus);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 sm:hidden p-3 rounded-xl bg-gray-800/90 backdrop-blur-sm text-white hover:bg-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 border border-gray-700/50"
        aria-label={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'} text-xl transition-transform duration-300`}></i>
      </button>

      <nav
        className={`fixed sm:sticky top-0 left-0 h-screen z-40 transition-all duration-500 ease-in-out
          ${sidebarOpen ? "w-64" : "w-0 sm:w-16"}
          overflow-hidden shadow-2xl bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 border-r border-purple-500/20`}
      >
        <ul className="p-3">
          <li className="flex justify-between items-center mx-2 mb-6 mt-4">
            {sidebarOpen && (
              <div className="flex items-center gap-2 fade-in">
                <i className="bi bi-stars text-2xl text-purple-400 animate-pulse"></i>
                <span className="font-bold text-xl text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent fade-in">
                  Mecha
                </span>
              </div>
            )}
            {!sidebarOpen && (
              <div className="flex justify-center w-full mt-2">
                <i className="bi bi-stars text-2xl text-purple-400 animate-pulse"></i>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-xl hover:bg-purple-500/20 text-white hidden sm:flex items-center justify-center transition-all duration-300 hover:scale-110`}
              aria-label={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <i className={`bi ${sidebarOpen ? 'bi-chevron-left' : 'bi-chevron-right'} text-lg transition-all duration-300`}></i>
            </button>
          </li>

          {menuItems.map((item, index) => (
            <li key={index} className="mb-1">
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubMenu(index)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-white transition-all duration-200
                      ${sidebarOpen ? "justify-start" : "justify-center"}
                      ${openSubMenus.has(index) ? "bg-gray-800/70" : "hover:bg-gray-800/50"} cursor-pointer`}
                  >
                    {sidebarOpen && <span className="text-sm">{item.label}</span>}
                    {sidebarOpen && <span>{openSubMenus.has(index) ? "▲" : "▼"}</span>}
                  </button>
                  <ul
                    className={`overflow-hidden transition-[max-height] duration-300 ease-in-out pl-8
                      ${openSubMenus.has(index) && sidebarOpen ? "max-h-40" : "max-h-0"}`}
                  >
                    {item.submenu.map((sub, i) => (
                      <li key={i}>
                        <a
                          href={`#${sub.toLowerCase()}`}
                          className="block py-2 px-3 text-sm text-gray-300 hover:bg-gray-700/50 rounded-md"
                          onClick={() => window.innerWidth < 640 && toggleSidebar()}
                        >
                          {sub}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (item.label === "Logout") return handleLogout();
                    if (item.path) navigate(item.path);
                    if (window.innerWidth < 640) toggleSidebar();
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-white transition-all duration-300 group
                    ${sidebarOpen ? "justify-start" : "justify-center"}
                    ${item.active
                      ? "bg-purple-500/30 shadow-md shadow-purple-500/20 scale-105 border border-purple-400/40"
                      : "hover:bg-purple-500/15 hover:scale-105 hover:shadow-md hover:shadow-purple-500/10 border border-transparent"
                    }
                    cursor-pointer relative overflow-hidden`}
                >
                  <i className={`bi ${item.icon} text-xl transition-all duration-300 ${item.active ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-12'}`}></i>
                  {sidebarOpen && (
                    <span className={`text-sm font-medium transition-all duration-300 ${item.active ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                      {item.label}
                    </span>
                  )}
                  {item.active && (
                    <div className="absolute inset-0 bg-purple-400/10 animate-pulse"></div>
                  )}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default SideBar;
