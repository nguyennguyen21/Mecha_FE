import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";

interface MenuItem {
  label: string;
  icon: ReactNode;
  path?: string;
  submenu?: string[];
  active?: boolean;
}

const SideBar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(window.innerWidth >= 640);
  const [openSubMenus, setOpenSubMenus] = useState<Set<number>>(new Set());

  // Debounce resize để tránh rerender nhiều lần
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

const menuItems: MenuItem[] = [
  { label: "Home", icon: <span>🌌</span>, path: "/home", active: true },
  { label: "Account", icon: <span>👾</span>, path: "/account" },
  { label: "Custom", icon: <span>🎨</span>, submenu: ["Theme", "Profile", "Settings"] },
  { label: "Upgrade", icon: <span>🚀</span>, path: "/upgrade" },
  { label: "Shop", icon: <span>🪐</span>, path: "/shop" },
  { label: "Logout", icon: <span>🌀</span>, path: "/logout" },
];


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setOpenSubMenus(new Set()); // Đóng tất cả submenu khi toggle
  };

  const toggleSubMenu = (index: number) => {
    const newOpenSubMenus = new Set(openSubMenus);
    newOpenSubMenus.has(index) ? newOpenSubMenus.delete(index) : newOpenSubMenus.add(index);
    setOpenSubMenus(newOpenSubMenus);
  };

  return (
    <>
      {/* Nút hamburger cho mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 sm:hidden p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700"
        aria-label={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        ☰
      </button>

      <nav
        className={`fixed sm:sticky top-0 left-0 h-screen z-40 transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64" : "w-0 sm:w-16"}
          overflow-hidden shadow-lg bg-gray-950 border-r border-gray-800/30`}
      >
        <ul className="p-2">
          {/* Header */}
          <li className="flex justify-between items-center mx-3 mb-6 mt-4">
            {sidebarOpen && <span className="font-bold text-xl text-white">Mecha</span>}
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-full hover:bg-gray-800/50 text-white hidden sm:block`}
              aria-label={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {sidebarOpen ? "«" : "»"}
            </button>
          </li>

          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <li key={index} className="mb-1">
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubMenu(index)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-white transition-all duration-200
                      ${sidebarOpen ? "justify-start" : "justify-center"}
                      ${openSubMenus.has(index) ? "bg-gray-800/70" : "hover:bg-gray-800/50"}`}
                  >
                    <span>{item.icon}</span>
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
                          onClick={() => window.innerWidth < 640 && toggleSidebar()} // auto đóng trên mobile
                        >
                          {sub}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <a
                  href={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg text-white transition-all duration-200
                    ${sidebarOpen ? "justify-start" : "justify-center"}
                    ${item.active ? "bg-gray-800/70" : "hover:bg-gray-800/50"}`}
                  onClick={() => window.innerWidth < 640 && toggleSidebar()} // auto đóng trên mobile
                >
                  <span>{item.icon}</span>
                  {sidebarOpen && <span className="text-sm">{item.label}</span>}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default SideBar;
