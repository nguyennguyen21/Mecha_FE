const Search: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <input
        type="text"
        className="w-full px-6 py-3 rounded-l-lg rounded-r-none font-semibold transition-all duration-300 border border-[#11549c] border-r-0 text-[16.5px] text-white bg-gray-800/60 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 shadow-lg"
        placeholder="mecha.lol/username"
      />
    </div>
  );
}
export default Search; 
 