import { useState, useMemo } from "react";
import { useStudent } from "../hooks/useStudent";
import { StudentTable } from "../components/StudentTable";
import { SearchBar } from "../components/SearchBar";

const PAGE_SIZE = 10;

export const StudentPage = () => {
  const { students, create, update, remove } = useStudent();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", age: 0, address: "" });
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered by search
  const filteredStudents = useMemo(() => {
    return students.filter(s =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.address.toLowerCase().includes(query.toLowerCase())
    );
  }, [students, query]);

  // Pagination
  const pageCount = Math.ceil(filteredStudents.length / PAGE_SIZE);
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredStudents.slice(start, start + PAGE_SIZE);
  }, [filteredStudents, currentPage]);

  const handleAddOrUpdate = async () => {
    if (editingId === null) {
      await create(form);
    } else {
      await update(editingId, form);
      setEditingId(null);
    }
    setForm({ name: "", age: 0, address: "" });
  };

  const handleEdit = (s: typeof form & { id?: number }) => {
    setEditingId(s.id!);
    setForm({ name: s.name, age: s.age, address: s.address });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Student Management</h1>

      {/* Form */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          className="border rounded px-4 py-2 flex-1 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          className="border rounded px-4 py-2 w-24 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Age"
          value={form.age}
          onChange={e => setForm({ ...form, age: Number(e.target.value) })}
        />
        <input
          className="border rounded px-4 py-2 flex-1 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Address"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
        />
        <button
          className={`px-6 py-2 rounded text-white ${editingId === null ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"} transition`}
          onClick={handleAddOrUpdate}
        >
          {editingId === null ? "Add Student" : "Update Student"}
        </button>
      </div>

      {/* Search */}
      <SearchBar query={query} setQuery={setQuery} />

      {/* Table */}
      <StudentTable students={paginatedStudents} onEdit={handleEdit} onDelete={remove} />

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            className={`px-3 py-1 rounded ${
              page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};
