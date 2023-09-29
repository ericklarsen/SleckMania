import React from "react";

type Props = {
    img?: string;
    name: string;
    status?: "online" | "away" | undefined;
    className?: string;
};

export const UserAva: React.FC<Props> = ({ img, name, status, className }) => {
    return (
        <div
            className={`w-9 h-9 bg-[#404040] rounded-full cursor-pointer relative flex items-center justify-center ${className}`}
        >
            {status && (
                <div className="w-3 h-3 bg-green-500 rounded-full absolute z-10 bottom-0 right-0"></div>
            )}
            {img ? (
                <img
                    src={`${process.env.NEXT_PUBLIC_ASSET_SERVER}/users/${img}`}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                />
            ) : (
                <h6 className="font-normal">{name[0]}</h6>
            )}
        </div>
    );
};
