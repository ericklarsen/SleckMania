"use client";
import { useAppSelector } from "@/app/stores/hooks";
import { selectGlobals } from "@/app/stores/slices/globals/globals";
import { ErrorPopUp } from "@/components/molecules/ErrorPopUp/ErrorPopUp";
import { LeftNavBar } from "@/components/molecules/LeftNavBar/LeftNavBar";
import { UserDetailsType } from "@/types";
import React, { useEffect, useState } from "react";

type Props = {
    children: React.ReactNode;
};

export const MainLayout: React.FC<Props> = ({ children }) => {
    const [appUser, setAppUser] = useState({} as UserDetailsType);
    const { errorMsg } = useAppSelector(selectGlobals);

    const handleUnauthorized = () => {
        localStorage.removeItem("appUser");
        window.location.href = "/";
    };

    useEffect(() => {
        setAppUser(JSON.parse(localStorage.getItem("appUser") as any));
    }, []);

    // useEffect(() => {
    //     console.log(appUser);
    // }, [appUser]);

    return (
        <main className="w-screen h-screen flex">
            <ErrorPopUp
                open={errorMsg.length ? true : false}
                message={errorMsg}
                callback={() => {
                    if (errorMsg === "Unauthorized!") handleUnauthorized();
                }}
            />
            {appUser && <LeftNavBar />}
            {children}
        </main>
    );
};
