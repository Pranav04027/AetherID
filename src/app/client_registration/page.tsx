"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function client_registration() {

  const [loading, setLoading] = useState(false)

  const [redirecturi, setRedirecturi] = useState([""])

  const [Info, setInfo] = useState({
    appName: "",
    allowedRedirectUris: redirecturi,
    userEmail: "",
  });

  const onRegistration = async () => {
    try {
        setLoading(true)
        
        await toast.promise(
            axios.post("/api/client/register", Info),
            {
                loading: 'Registering your Client..',
                success: 'Client Registered Successfully',
                error: (err)=> err.response?.data?.message || 'Error occured'
            }
        );
    } catch (error: any) {
        console.log("Client Registration failed", error)
    }finally{
        setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Developer Registration
        </h2>

        <input
          type="text"
          placeholder="AetherId Registred and Verified Email"
          value={Info.userEmail}
          onChange={(e: any) => {
            setInfo({ ...Info, userEmail: e.target.value.trim() });
          }}
        />

        <input
        type="text"
        placeholder="Your App Name"
        value={Info.appName}
        onChange={(e:any)=>{setInfo({...Info, appName: e.target.value.trim()})}}
        />

        <label htmlFor="allowedRedirectUris">Allowed redirect URIs</label>
          {redirecturi.map((uri, index) => (
            <div key={index} className="flex gap-2">
                <input type="text" value={uri} onChange={(e) => {
                    const copy = [...redirecturi];
                    copy[index] = e.target.value;
                    setRedirecturi(copy);
                    setInfo({...Info, allowedRedirectUris: copy});
                }}/>
            </div>
          ))}
            <button className="mt-2 mb-4" onClick={() => {
                setRedirecturi([...redirecturi, ""]);
            }}>
              Add Redirect URI
            </button>

        {loading == true? <button>Loading...</button> : <button onClick={onRegistration}>Register Client</button> }

      </div>
    </div>
  );
}
