"use client";
import { LeftNavBar } from "@/components/molecules/LeftNavBar/LeftNavBar";
import { UserDetailsType } from "@/types";
import React, { useEffect, useState } from "react";

type Props = {
    children: React.ReactNode;
};

export const MainLayout: React.FC<Props> = ({ children }) => {
    const [appUser, setAppUser] = useState({} as UserDetailsType);

    useEffect(() => {
        setAppUser(JSON.parse(localStorage.getItem("appUser") as any));
    }, []);

    useEffect(() => {
        console.log(appUser);
    }, [appUser]);
    return (
        <main className="w-screen h-screen flex">
            {appUser && <LeftNavBar />}
            {children}
        </main>
    );
};
