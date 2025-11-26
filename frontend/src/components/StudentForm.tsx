import type { Student } from "../types/Student";
import { useState, useEffect } from "react";

interface Props {
  onSubmit: (data: Student) => void;
  editingStudent?: Student | null;
}

export default function StudentForm({ onSubmit, editingStudent }: Props) {
  const [form, setForm] = useState<Student>({
    name: "",
    age: 0,
    address: "",
  });

  useEffect(() => {
    if (editingStudent) {
      setForm(editingStudent);
    }
  }, [editingStudent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: "", age: 0, address: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow mb-4 grid grid-cols-3 gap-4"
    >
      <input
        name="name"
        placeholder="Tên"
        value={form.name}
        onChange={handleChange}
        className="border p-2"
        required
      />
      <input
        name="age"
        placeholder="Tuổi"
        type="number"
        value={form.age}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        name="address"
        placeholder="Địa chỉ"
        value={form.address}
        onChange={handleChange}
        className="border p-2"
      />

      <button className="col-span-3 bg-blue-600 text-white py-2 rounded">
        {editingStudent ? "Cập nhật" : "Thêm mới"}
      </button>
    </form>
  );
}
