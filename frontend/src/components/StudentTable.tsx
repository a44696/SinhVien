// components/StudentTable.tsx
import type { Student } from "../types/Student";
import { Pencil, Trash } from "lucide-react";

interface Props {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

export const StudentTable = ({ students, onEdit, onDelete }: Props) => {
  return (
    <div className="overflow-x-auto border rounded-lg shadow bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="p-3 border-b">ID</th>
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">Age</th>
            <th className="p-3 border-b">Address</th>
            <th className="p-3 border-b text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s, i) => (
            <tr
              key={s.id}
              className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}
            >
              <td className="p-3 border-b">{s.id}</td>
              <td className="p-3 border-b">{s.name}</td>
              <td className="p-3 border-b">{s.age}</td>
              <td className="p-3 border-b">{s.address}</td>
              <td className="p-3 border-b text-center">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(s)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(s.id!)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {students.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="text-center p-5 text-gray-500 italic"
              >
                No data found...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
