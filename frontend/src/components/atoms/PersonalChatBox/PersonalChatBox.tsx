import "./PersonalChatBox.css";
import React from "react";
import { UserAva } from "../UserAva/UserAva";

type Props = {
    active?: boolean;
};

export const PersonalChatBox: React.FC<Props> = ({ active = false }) => {
    return (
        <div className={`personalChatBox ${active ? "active" : ""}`}>
            <UserAva img={""} name={"Erick"} />
            <div className="personalChatBox__details">
                <h5 className="font-normal">Erick Larsen</h5>
                <p className="font-light text-sm text-ellipsis whitespace-nowrap overflow-x-hidden">
                    Gokilll!! Gokilll!! Gokilll!! Gokilll!! Gokilll!! Gokilll!! Gokilll!! Gokilll!!
                    Gokilll!! Gokilll!! Gokilll!! Gokilll!!
                </p>
            </div>
        </div>
    );
};
