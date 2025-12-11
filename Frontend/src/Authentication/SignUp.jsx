import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Background3D from "../Components/Background3D";

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        cpassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async () => {
        // Validation checks
        if (!formData.name || !formData.email || !formData.mobile || !formData.password || !formData.cpassword) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill in all fields!',
                background: '#1f2937',
                color: '#fff',
                confirmButtonColor: '#ef4444'
            });
            return;
        }

        if (formData.password !== formData.cpassword) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Passwords do not match!',
                background: '#1f2937',
                color: '#fff',
                confirmButtonColor: '#ef4444'
            });
            return;
        }

        if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid 10-digit mobile number!',
                background: '#1f2937',
                color: '#fff',
                confirmButtonColor: '#ef4444'
            });
            return;
        }

        setIsLoading(true);

        try {
            let res = await fetch("http://localhost:7120/user/Signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    mobile: formData.mobile,
                    password: formData.password
                }),
            });

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Account created successfully!',
                    background: '#1f2937',
                    color: '#fff',
                    confirmButtonColor: '#4f46e5'
                });
                navigate("/login");
            } else {
                let errorData = await res.json();
                throw new Error(errorData.message || "Failed to create account");
            }
        } catch (e) {
            console.error(e);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: e.message || 'Something went wrong. Please try again later.',
                background: '#1f2937',
                color: '#fff',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Enter key press for form submission
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSignUp();
        }
    };

    return (
        <div className="min-h-screen relative">
            <Background3D />
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-3xl p-8 md:p-12 shadow-2xl">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                            Create your account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-400">
                            Join us today! Please fill in your details
                        </p>
                    </div>
                    <div className="mt-8 space-y-6" onKeyPress={handleKeyPress}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div className="relative group">
                                <label htmlFor="full-name" className="sr-only">Full Name</label>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="full-name"
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="appearance-none rounded-lg block w-full pl-10 px-5 py-3 bg-gray-700/50 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-gray-700 transition-all duration-200 sm:text-lg"
                                    placeholder="Full Name"
                                    aria-describedby="name-help"
                                />
                                <div id="name-help" className="sr-only">Enter your full name</div>
                            </div>

                            <div className="relative group">
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="appearance-none rounded-lg block w-full pl-10 px-5 py-3 bg-gray-700/50 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-gray-700 transition-all duration-200 sm:text-lg"
                                    placeholder="Email address"
                                    aria-describedby="email-help"
                                />
                                <div id="email-help" className="sr-only">Enter your email address</div>
                            </div>

                            <div className="relative group">
                                <label htmlFor="mobile-number" className="sr-only">Mobile Number</label>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                </div>
                                <input
                                    id="mobile-number"
                                    name="mobileNumber"
                                    type="tel"
                                    pattern="[0-9]{10}"
                                    required
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    className="appearance-none rounded-lg block w-full pl-10 px-5 py-3 bg-gray-700/50 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-gray-700 transition-all duration-200 sm:text-lg"
                                    placeholder="Mobile Number"
                                    aria-describedby="mobile-help"
                                />
                                <div id="mobile-help" className="sr-only">Enter your 10-digit mobile number</div>
                            </div>

                            <div className="relative group">
                                <label htmlFor="password" className="sr-only">Password</label>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    autoComplete="new-password"
                                    required
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="appearance-none rounded-lg block w-full pl-10 px-5 py-3 bg-gray-700/50 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-gray-700 transition-all duration-200 sm:text-lg"
                                    placeholder="Password"
                                    aria-describedby="password-help"
                                />
                                <div id="password-help" className="sr-only">Enter your password</div>
                            </div>

                            <div className="relative group">
                                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.cpassword}
                                    autoComplete="new-password"
                                    required
                                    onChange={(e) => setFormData({ ...formData, cpassword: e.target.value })}
                                    className="appearance-none rounded-lg block w-full pl-10 px-5 py-3 bg-gray-700/50 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-gray-700 transition-all duration-200 sm:text-lg"
                                    placeholder="Confirm Password"
                                    aria-describedby="confirm-password-help"
                                />
                                <div id="confirm-password-help" className="sr-only">Confirm your password</div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={handleSignUp}
                                disabled={isLoading}
                                className={`group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-bold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 shadow-lg hover:shadow-indigo-500/30 ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                                aria-busy={isLoading}
                                aria-describedby="signup-button-help"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    {isLoading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </span>
                                {isLoading ? 'Processing...' : 'Sign Up'}
                            </button>
                            <div id="signup-button-help" className="sr-only">Click to sign up or press Enter</div>
                        </div>
                        <div className="text-center mt-6">
                            <p className="text-gray-400">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;