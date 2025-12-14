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

  const [errors, setErrors] = useState({
    name: "",
    age: "",
    address: "",
  });

  useEffect(() => {
    if (editingStudent) {
      setForm(editingStudent);
    }
  }, [editingStudent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Xóa lỗi khi user bắt đầu gõ lại
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let temp: any = {};

    temp.name = form.name.trim() === "" ? "Tên không được để trống" : "";
    temp.age = form.age <= 0 ? "Tuổi phải lớn hơn 0" : "";
    temp.address = form.address.trim() === "" ? "Địa chỉ không được để trống" : "";

    setErrors(temp);

    // Nếu tất cả lỗi đều rỗng → valid
    return Object.values(temp).every(x => x === "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(form);
    setForm({ name: "", age: 0, address: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow mb-4  gap-4 "
    >
      {/* Name */}
      <div className=" ">
        <input
          name="name"
          placeholder="Tên"
          value={form.name}
          onChange={handleChange}
          className={` border p-2 ${errors.name ? "border-red-500" :  "" }`}
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
      </div>

      {/* Age */}
      <div className="">
        <input
          name="age"
          placeholder="Tuổi"
          type="number"
          value={form.age}
          onChange={handleChange}
          className={`border p-2 ${errors.age ? "border-red-500" : ""}`}
        />
        {errors.age && <span className="text-red-500 text-sm">{errors.age}</span>}
      </div>

      {/* Address */}
      <div className="">
        <input
          name="address"
          placeholder="Địa chỉ"
          value={form.address}
          onChange={handleChange}
          className={`border p-2 ${errors.address ? "border-red-500" : ""}`}
        />
        {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
      </div>

      {/* Submit */}
      <div className="w-8/12">
        <button className="col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ">
          {editingStudent ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>
    </form>
  );
}
