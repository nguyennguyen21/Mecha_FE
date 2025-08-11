const Search: React.FC = () => {
  return (
    <div className="flex items-center justify-center ">
      <input
        type="text"
        className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border-1 border-[#072607] shadow-[0_35px_35px_rgba(0,0,0,0.25)] text-[16.5px]"
        placeholder="Search..."
      />
    </div>
  );
}
export default Search; 
 