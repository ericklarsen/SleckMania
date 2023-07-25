"use client";
import "./page.scss";
import { TextInput, FluidForm, Button } from "@carbon/react";
import { Login } from "@carbon/icons-react";
import { useEffect, useState } from "react";
import LogoSvg from "@/assets/LogoSvg";
import { apiRequest, getAccessToken } from "@/services/apiRequest";
import HomePage from "@/components/organisms/HomePage/HomePage";
import { Loader } from "@/components/atoms/Loader/Loader";

export default function Home() {
    const [isLoading, setLoading] = useState(true);
    const [isUser, setIsUser] = useState(false);

    useEffect(() => {
        if (getAccessToken()) {
            setIsUser(true);
        }
        setLoading(false);
    });

    const handleLogin = async () => {
        const username = document.getElementById("text-input-username") as HTMLInputElement;
        const password = document.getElementById("text-input-password") as HTMLInputElement;

        apiRequest({
            method: "POST",
            url: "auth/login",
            data: {
                username: username.value,
                password: password.value,
            },
        })
            .then((res) => {
                if (res.data.status === 1) {
                    localStorage.setItem("appUser", JSON.stringify(res.data.data));
                    setIsUser(true);
                    console.log(res.data.data);
                } else {
                    alert(res.data.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    if (isLoading) return;

    if (isUser) {
        return <HomePage />;
    }

    return (
        <main className="px-6 w-screen h-screen  flex items-center justify-center">
            <div className="w-full max-w-[400px] ">
                <div className="w-fit mx-auto mb-10">
                    <LogoSvg className="max-w-[240px] w-full" />
                </div>
                <FluidForm className="w-full h-auto mx-auto">
                    <TextInput id="text-input-username" type="text" labelText="Username" />
                    <TextInput.PasswordInput
                        id="text-input-password"
                        type="password"
                        labelText="Password"
                        autoComplete="true"
                    />
                    <Button
                        renderIcon={Login}
                        className="mt-4 max-w-full w-full mx-auto"
                        kind="primary"
                        onClick={() => handleLogin()}
                    >
                        Login
                    </Button>
                </FluidForm>
            </div>
        </main>
    );
}
