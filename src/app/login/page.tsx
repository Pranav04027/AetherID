"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"

export default function login() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [data, setData] = useState({
        redirect_uri: "",
        responseType: "",
        client_id: "",
        user_Email: "",
        user_password: ""
    })

    useEffect(() => {
        const redirect_uri = searchParams.get("redirect_uri")
        const client_id = searchParams.get("client_id")
        const response_type = searchParams.get("response_type")

        if (redirect_uri && client_id && response_type) {
            setData({ ...data, redirect_uri: redirect_uri!, client_id: client_id!, responseType: response_type! })
        } else {

        }
    }, [searchParams])

    const onSubmit = async () => {
        try {
            const res = await toast.promise(
                axios.post("/api/user/login", data),
                {
                    loading: "Please wait, processing...",
                    success: "Success",
                    error: (err: any) => err.response?.data?.message || 'Error occured'
                }
            )

            console.log("Got response:", res);

            router.push(`${data.redirect_uri}?${data.responseType}=${res?.data?.code}`)


        } catch (error: any) {
            console.error("login failed", error)
        }
    }

    return (
        <div>
            <div>
                <h1>Please Input Details</h1>

                <input
                    type="text"
                    placeholder="Please Enter Your Email"
                    value={data.user_Email}
                    onChange={(e: any) => {
                        setData({ ...data, user_Email: e.target.value.trim() })
                    }}
                />

                <input
                    type="password"
                    placeholder="Please Enter Password"
                    value={data.user_password}
                    onChange={(e: any) => {
                        setData({ ...data, user_password: e.target.value.trim() })
                    }}
                />

                <button onClick={onSubmit}>Submit</button>

            </div>
        </div>
    )
}