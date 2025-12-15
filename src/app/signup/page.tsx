"use client";

import { useState, useEffect} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SignupPage() {

    const [user, setUser] = useState({
        email: '',
        password: '',
        username: ''
    })

    const [loading, setLoading] = useState(false)

    const onSignup = async () =>{
        try {
            setLoading(true)

            // Toast promise handles the await, other stuff..
            await toast.promise(
                axios.post("/api/user/signup", user),
                {
                    loading: 'Crating your account..',
                    success: 'Account Created, check Email for Verification',
                    error: (err)=> err.response?.data?.message || 'Error occured'
                }
            );
            
        } catch (error: any) {
            console.log("Signup failed", error)

        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                
                <input
                    type="text"
                    placeholder='Username'
                    value={user.username}
                    onChange ={(e: any)=>{
                        setUser({...user, username:e.target.value})
                    }}
                />

                <input
                    type="text"
                    placeholder='Email'
                    value={user.email}
                    onChange ={(e: any)=>{
                        setUser({...user, email:e.target.value})
                    }}
                />

                <input
                    type="text"
                    placeholder='Password'
                    value={user.password}
                    onChange ={(e: any)=>{
                        setUser({...user, password:e.target.value})
                    }}
                />

                <button
                    className='border-amber-400 bg-red-700'
                    onClick={onSignup}
                >{loading? "Signing up...." : "Signup"}</button>

            </div>
        </div>
    )
}   