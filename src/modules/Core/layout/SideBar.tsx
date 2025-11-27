import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  label: string;
  path?: string;
  submenu?: string[];
  active?: boolean;
}

const SideBar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(window.innerWidth >= 640);
  const [openSubMenus, setOpenSubMenus] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

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

    const menuItems: MenuItem[] = [
    { label: "Home", path: "/dashbaord", active: true },
    { label: "Account", path: "/account" },
    { label: "Custom", submenu: ["Theme", "Profile", "Settings"] },
    { label: "Shop", path: "/shop" },
    { label: "Upgrade", path: "/upgrade" },
    { label: "Logout", path: "/logout" },
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
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-white transition-all duration-200
                    ${sidebarOpen ? "justify-start" : "justify-center"}
                    ${item.active ? "bg-gray-800/70" : "hover:bg-gray-800/50"}
                    cursor-pointer`}
                >
                  {sidebarOpen && <span className="text-sm">{item.label}</span>}
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
