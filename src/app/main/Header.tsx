import { useState } from "react";

interface HeaderProps {
  addWord: () => void;
}

const Header = (props: HeaderProps) => {
  const [search, setSearch] = useState<string>("");

  return (
    <header className="flex justify-between items-center space-x-6 bg-gray-100 p-4 rounded-lg">
      <h1 className="text-2xl font-bold">MyDictionary</h1>

      <nav className="w-full">
        <label htmlFor="search">
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-full p-1"
          />
        </label>
      </nav>

      <button
        className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 cursor-pointer transition-colors duration-200 text-white text-[15px] px-2.5 py-1.5 rounded-full"
        onClick={props.addWord}
      >
        Добавить
      </button>
    </header>
  );
};

export default Header;
