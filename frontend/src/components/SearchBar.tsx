// components/SearchBar.tsx
import { Search } from "lucide-react";

interface Props {
  query: string;
  setQuery: (q: string) => void;
}

export const SearchBar = ({ query, setQuery }: Props) => {
  return (
    <div className="mb-5 flex justify-start items-center gap-3">
      <div >
        <Search size={20} className="text-gray-500" />
      </div>
      <div className="relative w-8/12 max-w-sm">
        
        <input
          type="text"
          placeholder="Search student..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded-lg px-10 py-2 w-full 
          shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
};
