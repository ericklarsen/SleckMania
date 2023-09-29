"use client";
import { UserAva } from "@/components/atoms/UserAva/UserAva";
import "./LeftNavBar.css";
import { UserDetailsType } from "@/types";
import {
    Calendar,
    Chat,
    Exit,
    GroupAccess,
    Notification,
    Settings,
    UserMultiple,
} from "@carbon/icons-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/stores/hooks";
import { setCurrentChannel, setCurrentRoom } from "@/app/stores/slices/globals/globals";
import { useDispatch } from "react-redux";
import Link from "next/link";

export const LeftNavBar = () => {
    const dispatch = useAppDispatch();
    const [appUser, setAppUser] = useState({} as UserDetailsType);
    const [currentPath, setCurrentPath] = useState(null as any);
    const router = useRouter();

    useEffect(() => {
        setAppUser(JSON.parse(localStorage.getItem("appUser") as any));
        setCurrentPath(window.location.pathname.split("/")[2] as any);
    }, []);

    const handleNavigation = (param: string) => {
        setCurrentPath(param);
        router.push("/" + param);
        setCurrentPath(param.split("/")[1] as any);

        // if (param !== "channels") {
        //     dispatch(setCurrentChannel({ uid: 0 }));
        //     dispatch(setCurrentRoom({ uid: 0 }));
        // }
    };

    return (
        <div className="relative flex flex-col items-center gap-10 w-fit px-5 py-7 h-full bg-[#121212]">
            <UserAva
                img={appUser?.avatar_img}
                name={appUser?.hasOwnProperty("first_name") ? appUser.first_name[0] : ""}
            />
            <Chat
                className={`leftNavBar__icon ${currentPath === "home" && "active"}`}
                onClick={() => handleNavigation("app/home")}
            />
            <GroupAccess
                className={`leftNavBar__icon ${currentPath === "channels" && "active"}`}
                onClick={() => handleNavigation("app/channels")}
            />
            <Calendar
                className={`leftNavBar__icon ${currentPath === "calendar" && "active"}`}
                onClick={() => handleNavigation("app/home")}
            />
            <UserMultiple className={`leftNavBar__icon`} />

            <div className="absolute left-0 bottom-7 w-full flex flex-col items-center justify-center gap-10">
                <Notification className={`leftNavBar__icon`} />
                <Settings className={`leftNavBar__icon`} />
            </div>
        </div>
    );
};
