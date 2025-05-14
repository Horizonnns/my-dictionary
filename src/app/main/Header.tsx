const Header = () => {
  return (
    <header>
      <h1>Header</h1>

      <nav>
        <label htmlFor="search">Search</label>
        <input
          type="text"
          id="search"
          className="border-2 border-gray-300 rounded-md p-2"
        />
      </nav>
    </header>
  );
};

export default Header;
