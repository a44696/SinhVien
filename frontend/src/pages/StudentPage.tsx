// pages/StudentPage.tsx
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

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.address.toLowerCase().includes(query.toLowerCase())
    );
  }, [students, query]);

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

  const handleEdit = (s: any) => {
    setEditingId(s.id);
    setForm({ name: s.name, age: s.age, address: s.address });
  };

  return (
    <div className="container">
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className=" md:flex-row gap-4 ">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                className="w-8/12 border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter student name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                className="w-8/12 border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Age"
                value={form.age}
                onChange={(e) =>
                  setForm({ ...form, age: Number(e.target.value) })
                }
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                className="w-8/12 border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <button
              className="px-4 py-1 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition text-sm"
              onClick={handleAddOrUpdate}
            >
              {editingId === null ? "Add Student" : "Update Student"}
            </button>

          </div>
        </div>

        {/* Search Bar Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Search Students</h2>
          <SearchBar query={query} setQuery={setQuery} />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold p-6 text-gray-700">Student List</h2>
          <StudentTable
            students={paginatedStudents}
            onEdit={handleEdit}
            onDelete={remove}
          />

          {/* Pagination */}
          <div className="p-6 flex justify-center items-center gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              First
            </button>

            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>

            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded transition ${
                  page === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              disabled={currentPage === pageCount}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>

            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              disabled={currentPage === pageCount}
              onClick={() => setCurrentPage(pageCount)}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};