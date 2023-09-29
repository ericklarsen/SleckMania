"use client";

import { MainLayout } from "@/components/layouts/MainLayout/MainLayout";
import { useEffect } from "react";
import Router from "next/router";

export const metadata = {
    title: "Sleck",
    description: "it's not slack",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return <MainLayout>{children}</MainLayout>;
}
