"use client";

import { apiRequest } from "@/services/apiRequest";

export default function Login() {
    const handleLogin = async () => {
        const username = document.getElementById("username") as HTMLInputElement;
        const password = document.getElementById("password") as HTMLInputElement;

        apiRequest({
            method: "POST",
            url: "http://localhost:8080/api/auth/login",
            data: {
                username: username.value,
                password: password.value,
            },
        })
            .then((res) => {
                if (res.data.status === 1) {
                    localStorage.setItem("appUser", JSON.stringify(res.data.data));
                    window.location.href = "/";
                    console.log(res.data.data);
                } else {
                    alert(res.data.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <main className="w-screen h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl">Login</h1>
            <input
                className="mt-4 p-4 max-w-[400px] w-full text-base text-black"
                placeholder="username"
                type="text"
                id="username"
            />
            <input
                className="mt-4 p-4 max-w-[400px] w-full text-base text-black"
                placeholder="username"
                type="password"
                id="password"
            />

            <div
                onClick={() => handleLogin()}
                className="mt-4 max-w-[400px] w-full p-4 border border-white text-center text-xl cursor-pointer"
            >
                Enter
            </div>
        </main>
    );
}
