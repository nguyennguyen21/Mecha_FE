const Search: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <input
        type="text"
        className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
        placeholder="Search..."
      />
    </div>
  );
}
export default Search; 
 