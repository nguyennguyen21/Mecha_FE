const Header = () => {
  return (
    <header className="relative py-5 flex justify-center">
      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-4/5 max-w-4xl h-14 rounded-3xl flex items-center justify-between px-8 text-white shadow-lg">
        <div className="font-bold text-xl">Logo</div>
        <nav>
          <ul className="flex space-x-8">
            <li className="hover:text-gray-300 cursor-pointer transition">Support</li>
            <li className="hover:text-gray-300 cursor-pointer transition">Pricing</li>
            <li className="hover:text-gray-300 cursor-pointer transition">Dashboard</li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;