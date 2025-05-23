import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface HeaderProps {
  addWord: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header = ({ addWord, searchQuery, setSearchQuery }: HeaderProps) => {
  return (
    <header className="fixed top-0 z-20 w-full flex justify-between items-center space-x-4 bg-gray-100 pl-4 pr-8 py-4 rounded-lg">
      {/* <h1 className="text-2xl font-bold">MyDictionary</h1> */}

      <nav className="w-full">
        <Input
          placeholder="Поиск по словам и переводам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefix={<SearchOutlined className="text-gray-400" />}
          className="!rounded-xl"
          allowClear
        />
      </nav>

      <button
        className="bg-green-500 hover:bg-green-600 active:bg-green-700 cursor-pointer transition-colors duration-200 text-[15px] px-2.5 py-1.5 rounded-full !text-white"
        onClick={addWord}
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
          />
        </svg>
      </button>
    </header>
  );
};

export default Header;
