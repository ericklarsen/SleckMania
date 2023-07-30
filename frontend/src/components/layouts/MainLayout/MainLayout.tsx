"use client";
import { LeftNavBar } from "@/components/molecules/LeftNavBar/LeftNavBar";
import React from "react";

type Props = {
    children: React.ReactNode;
};

export const MainLayout: React.FC<Props> = ({ children }) => {
    return (
        <main className="w-screen h-screen flex">
            <LeftNavBar />
            {children}
        </main>
    );
};
