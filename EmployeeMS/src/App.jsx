import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

// Presentation Layer
import Login from './presentation/pages/Login';
import DashBoard from './presentation/components/DashBoard';
import Home from './presentation/pages/Home';
import Employee from './presentation/pages/Employee';
import Category from './presentation/pages/Category';
import Profile from './presentation/pages/Profile';
import AddCategory from './presentation/pages/AddCategory';
import AddEmployee from './presentation/pages/AddEmployee';
import EditEmployee from './presentation/pages/EditEmployee';
import ViewEmployee from './presentation/pages/ViewEmployee';
import EditAdmin from './presentation/pages/EditAdmin';
import Department from './presentation/pages/Department';
import Salary from './presentation/pages/Salary';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/adminlogin" element={<Login />} />
        <Route path="/dashboard" element={<DashBoard />} >
          <Route path='' element={<Home />}></Route>
          <Route path='/dashboard/employee' element={<Employee />}></Route>
          <Route path='/dashboard/category' element={<Category />}></Route>
          <Route path='/dashboard/department' element={<Department />}></Route>
          <Route path='/dashboard/salary' element={<Salary />}></Route>
          <Route path='/dashboard/profile' element={<Profile />}></Route>
          <Route path='/dashboard/add_category' element={<AddCategory />}></Route>
          <Route path='/dashboard/add_employee' element={<AddEmployee />}></Route>
          <Route path='/dashboard/view_employee/:id' element={<ViewEmployee />}></Route>
          <Route path='/dashboard/edit_employee/:id' element={<EditEmployee />}></Route>
          <Route path='/dashboard/edit_admin/:id' element={<EditAdmin />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App