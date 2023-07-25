"use client";
import { Loading } from "@carbon/react";

export const Loader: React.FC = () => {
    return (
        <div className="w-screen h-screen fixed z-[10000] top-0 left-0 bg-black/50 flex items-center justify-center">
            <Loading className={"some-class"} withOverlay={false} />
        </div>
    );
};
