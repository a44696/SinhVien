import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminService } from '../../application/services'
import '../style.css'

const adminService = new AdminService();

export const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await adminService.login(values.email, values.password);
      if (result.LoginStatus) {
        localStorage.setItem("valid", true);
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.log(err);
      setError('An error occurred during login');
    }
  }

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
      <div className='p-3 rounded w-25 border loginForm'>
        <div className='text-warning'>
          {error && error}
        </div>
        <h2>Login Page</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="email"><strong>Email: </strong></label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              autoComplete='off' 
              placeholder='Enter Email'
              onChange={(e) => setValues({ ...values, email: e.target.value })} 
              className='form-control rounded-0' 
            />
          </div>
          <div className='mb-3'>
            <label htmlFor="password"><strong>Password: </strong></label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              autoComplete='off' 
              placeholder='Enter Password'
              onChange={(e) => setValues({ ...values, password: e.target.value })} 
              className='form-control rounded-0' 
            />
          </div>
          <div>
            <button className='btn btn-success w-100 rounded-0 mt-3 mb-3'>Submit</button>
          </div>
          <div>
            <input type="checkbox" name='tick' id='tick' className='me-2' />
            <label htmlFor="tick"><strong>You agree with terms & condition</strong> </label>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
