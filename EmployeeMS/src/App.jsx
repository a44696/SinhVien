import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

// Presentation Layer
import Login from './presentation/pages/Login';
import DashBoard from './presentation/components/DashBoard';
import EmployeeDashboard from './presentation/components/EmployeeDashboard';
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
import LeaveRequests from './presentation/pages/LeaveRequests';
import Start from './presentation/pages/Start';
import EmployeeLogin from './presentation/pages/EmployeeLogin';
import EmployeeDetail from './presentation/pages/EmployeeDetail';
import EmployeeLeaveRequest from './presentation/pages/EmployeeLeaveRequest';
import ChangePassword from './presentation/pages/ChangePassword';
import PrivateRoute from './presentation/pages/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Start />}></Route>
        <Route path="/adminlogin" element={<Login />} />
        <Route path='/employee_login' element={<EmployeeLogin />}></Route>
        <Route path='/employee_detail/:id' element={<EmployeeDetail />}></Route>
        <Route path="/employee_dashboard/:id" element={<EmployeeDashboard />}>
          <Route path='profile' element={<EmployeeDetail />}></Route>
          <Route path='leave' element={<EmployeeLeaveRequest />}></Route>
          <Route path='change_password' element={<ChangePassword />}></Route>
        </Route>
        <Route path="/dashboard" element={
          <PrivateRoute >
            <DashBoard />
          </PrivateRoute>
        }>
          <Route path='' element={<Home />}></Route>
          <Route path='employee' element={<Employee />}></Route>
          <Route path='category' element={<Category />}></Route>
          <Route path='department' element={<Department />}></Route>
          <Route path='salary' element={<Salary />}></Route>
          <Route path='leave_requests' element={<LeaveRequests />}></Route>
          <Route path='profile' element={<Profile />}></Route>
          <Route path='add_category' element={<AddCategory />}></Route>
          <Route path='add_employee' element={<AddEmployee />}></Route>
          <Route path='view_employee/:id' element={<ViewEmployee />}></Route>
          <Route path='edit_employee/:id' element={<EditEmployee />}></Route>
          <Route path='edit_admin/:id' element={<EditAdmin />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App