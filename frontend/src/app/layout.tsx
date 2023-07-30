import "./globals.scss";
import "./globals.css";
import { Inter } from "next/font/google";
import { Loader } from "@/components/atoms/Loader/Loader";
import { Providers } from "./stores/provider";
import { MainLayout } from "@/components/layouts/MainLayout/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Sleck",
    description: "it's not slack",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {/* <Loader /> */}
                <MainLayout>
                    <Providers>{children}</Providers>
                </MainLayout>
            </body>
        </html>
    );
}
