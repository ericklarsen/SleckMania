"use client";
import { UserAva } from "@/components/atoms/UserAva/UserAva";
import "./LeftNavBar.css";
import { UserDetailsType } from "@/types";
import { Chat, Exit, GroupAccess, Notification, Settings, UserMultiple } from "@carbon/icons-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const LeftNavBar = () => {
    const [appUser, setAppUser] = useState({} as UserDetailsType);
    const [currentPath, setCurrentPath] = useState(null as any);
    const router = useRouter();

    useEffect(() => {
        setAppUser(JSON.parse(localStorage.getItem("appUser") as any));
        setCurrentPath(window.location.pathname.split("/")[1] as any);

        console.log(window.location.pathname.split("/"));
    }, []);

    const handleNavigation = (param: string) => {
        setCurrentPath(param);
        router.push("/" + param);
    };

    return (
        <div className="relative flex flex-col items-center gap-10 w-fit px-5 py-7 h-full bg-[#121212]">
            <UserAva
                img={appUser?.avatar_img}
                name={appUser.hasOwnProperty("first_name") ? appUser.first_name[0] : ""}
            />
            <Chat
                className={`leftNavBar__icon ${currentPath === "" && "active"}`}
                onClick={() => handleNavigation("")}
            />
            <GroupAccess
                className={`leftNavBar__icon ${currentPath === "channels" && "active"}`}
                onClick={() => handleNavigation("channels")}
            />
            <UserMultiple className={`leftNavBar__icon`} />

            <div className="absolute left-0 bottom-7 w-full flex flex-col items-center justify-center gap-10">
                <Notification className={`leftNavBar__icon`} />
                <Settings className={`leftNavBar__icon`} />
                <Exit className={`leftNavBar__icon`} />
            </div>
        </div>
    );
};
