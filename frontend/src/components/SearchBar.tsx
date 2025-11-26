interface Props {
  query: string;
  setQuery: (q: string) => void;
}

export const SearchBar = ({ query, setQuery }: Props) => {
  return (
    <div className="mb-4 flex justify-end">
      <input
        type="text"
        placeholder="Search by name or address..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded px-3 py-2 w-full max-w-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />
    </div>
  );
};
