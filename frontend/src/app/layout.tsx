"use client";

import "./globals.scss";
import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./stores/provider";
import NextNProgress from "nextjs-progressbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Sleck",
    description: "it's not slack",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <NextNProgress height={8} color="#209cee" />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
