"use client";

import "./globals.scss";
import "./globals.css";
import { Inter } from "next/font/google";
import { Loader } from "@/components/atoms/Loader/Loader";
import { Providers } from "./stores/provider";
import { MainLayout } from "@/components/layouts/MainLayout/MainLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Sleck",
    description: "it's not slack",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    // useEffect(() => {
    //     document.addEventListener("page:fetch", function () {
    //         console.log("Page fetch!");
    //     });
    //     document.addEventListener("page:change", function () {
    //         console.log("Page change!");
    //     });
    //     document.addEventListener("page:restore", function () {
    //         console.log("Page restore!");
    //     });
    // }, []);
    return (
        <html lang="en">
            <body className={inter.className}>
                {/* <Loader /> */}
                <Providers>
                    <MainLayout>{children}</MainLayout>
                </Providers>
            </body>
        </html>
    );
}
