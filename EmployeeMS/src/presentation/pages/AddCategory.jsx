import axios from "axios";
import React, { useEffect, useState } from "react";
import { CategoryService } from "../../application/services"

const categoryService = new CategoryService();

const AddCategory = () => {
  const [category, setCategory] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const result = await categoryService.getAllCategories();
      if (result.Status) {
        setCategory(result.Result);
      } else {
        alert(result.Error);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await categoryService.createCategory(input);
      if (result.Status) {
        alert("Category added successfully");
        setInput("");
        loadCategories();
      } else {
        alert(result.Error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Add Category</h3>
      </div>
      <div className="row">
        <div className="col-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Add Category
              </label>
              <input
                type="text"
                id="category"
                className="form-control"
                placeholder="Enter category name"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
