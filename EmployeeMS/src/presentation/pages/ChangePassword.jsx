import React, { useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import '../style.css'

const ChangePassword = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [values, setValues] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        // Validation
        if (!values.currentPassword || !values.newPassword || !values.confirmPassword) {
            setError('Vui lòng điền đầy đủ tất cả các trường')
            return
        }

        if (values.newPassword !== values.confirmPassword) {
            setError('Mật khẩu mới và xác nhận mật khẩu không khớp')
            return
        }

        if (values.newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự')
            return
        }

        if (values.currentPassword === values.newPassword) {
            setError('Mật khẩu mới không được giống mật khẩu hiện tại')
            return
        }

        setLoading(true)
        axios.post(`http://localhost:3000/employee/change_password/${id}`, {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword
        })
        .then(result => {
            if (result.data.Status) {
                setSuccess('Đổi mật khẩu thành công!')
                setValues({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
                setTimeout(() => {
                    navigate(`/employee_dashboard/${id}/profile`)
                }, 2000)
            } else {
                setError(result.data.Error || 'Đổi mật khẩu thất bại')
            }
        })
        .catch(err => {
            console.log(err)
            setError('Có lỗi xảy ra. Vui lòng thử lại')
        })
        .finally(() => setLoading(false))
    }

    return (
        <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '80vh' }}>
            <div className='p-4 rounded w-50 border' style={{ maxWidth: '500px' }}>
                <h3 className='mb-4'>Đổi Mật Khẩu</h3>
                
                {error && (
                    <div className='alert alert-danger' role='alert'>
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className='alert alert-success' role='alert'>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='currentPassword'>
                            <strong>Mật khẩu hiện tại:</strong>
                        </label>
                        <input
                            type='password'
                            name='currentPassword'
                            id='currentPassword'
                            placeholder='Nhập mật khẩu hiện tại'
                            value={values.currentPassword}
                            onChange={handleChange}
                            className='form-control rounded-0'
                            required
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='newPassword'>
                            <strong>Mật khẩu mới:</strong>
                        </label>
                        <input
                            type='password'
                            name='newPassword'
                            id='newPassword'
                            placeholder='Nhập mật khẩu mới'
                            value={values.newPassword}
                            onChange={handleChange}
                            className='form-control rounded-0'
                            required
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='confirmPassword'>
                            <strong>Xác nhận mật khẩu mới:</strong>
                        </label>
                        <input
                            type='password'
                            name='confirmPassword'
                            id='confirmPassword'
                            placeholder='Xác nhận mật khẩu mới'
                            value={values.confirmPassword}
                            onChange={handleChange}
                            className='form-control rounded-0'
                            required
                        />
                    </div>

                    <button
                        type='submit'
                        className='btn btn-success w-100 rounded-0 mb-2'
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
                    </button>
                    <button
                        type='button'
                        className='btn btn-secondary w-100 rounded-0'
                        onClick={() => navigate(`/employee_dashboard/${id}/profile`)}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword
