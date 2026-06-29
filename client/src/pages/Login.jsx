import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Login = () => {

    const [state, setState] = useState("login")

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const {axios, setToken} = useAppContext()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = (state === "login") ? '/api/user/login' : '/api/user/register'

        try {
            const {data} = await axios.post(url, formData)
            if(data.success) {
                setToken(data.token)
                localStorage.setItem('token', data.token)
                toast.success(state === "login" ? "Logged in successfully" : "Account created successfully") 
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <form
            onSubmit={handleSubmit}
            className='sm:w-[380px] w-full bg-white rounded-3xl
            px-8 py-8 shadow-2xl border border-purple-200'
        >

            <h1 className='text-3xl font-bold text-center text-purple-700'>
                {state === "login" ? "Welcome Back" : "Create Account"}
            </h1>

            <p className='text-sm text-center text-purple-500 mt-2 mb-6'>
                {state === "login"
                    ? "Sign in to continue"
                    : "Create your account to continue"}
            </p>

            {state !== "login" && (
                <div className='flex items-center gap-3 border
                border-purple-200 rounded-full px-5 h-12 mb-4'>

                    <svg xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        className='text-purple-500'
                    >
                        <circle cx="12" cy="8" r="5" />
                        <path d="M20 21a8 8 0 0 0-16 0" />
                    </svg>

                    <input
                        type='text'
                        name='name'
                        placeholder='Enter name'
                        value={formData.name}
                        onChange={handleChange}
                        className='outline-none flex-1'
                        required
                    />
                </div>
            )}

            <div className='flex items-center gap-3 border
            border-purple-200 rounded-full px-5 h-12 mb-4'>

                <svg xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className='text-purple-500'
                >
                    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                </svg>

                <input
                    type='email'
                    name='email'
                    placeholder='Enter email'
                    value={formData.email}
                    onChange={handleChange}
                    className='outline-none flex-1'
                    required
                />
            </div>

            <div className='flex items-center gap-3 border
            border-purple-200 rounded-full px-5 h-12'>

                <svg xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className='text-purple-500'
                >
                    <rect width="18" height="11" x="3" y="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>

                <input
                    type='password'
                    name='password'
                    placeholder='Enter password'
                    value={formData.password}
                    onChange={handleChange}
                    className='outline-none flex-1'
                    required
                />
            </div>

            <button
                type='submit'
                className='w-full h-12 rounded-full mt-5
                bg-purple-700 text-white font-medium
                hover:bg-purple-800 transition-all cursor-pointer'
            >
                {state === "login" ? "Login" : "Sign Up"}
            </button>

            <p className='text-center text-sm text-gray-600 mt-6'>

                {state === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}

                <span
                    className='text-purple-700 cursor-pointer
                    font-medium ml-1 hover:underline'
                    onClick={() =>
                        setState(prev =>
                            prev === "login"
                                ? "register"
                                : "login"
                        )
                    }
                >
                    Click here
                </span>

            </p>

        </form>
    )
}

export default Login