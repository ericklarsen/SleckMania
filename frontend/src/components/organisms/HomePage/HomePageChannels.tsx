"use client";

import { useAppDispatch, useAppSelector } from "@/app/stores/hooks";
import { getAllChannels, selectChannels } from "@/app/stores/slices/channels/getAll";
import { selectGlobals } from "@/app/stores/slices/globals/globals";
import { ChannelBox } from "@/components/atoms/ChannelBox/ChannelBox";
import { Box, Logout, Settings, UserMultiple } from "@carbon/icons-react";
import { useEffect } from "react";

export const HomePageChannels = () => {
    const dispatch = useAppDispatch();
    const { data, loading } = useAppSelector(selectChannels);
    const { currentChannel } = useAppSelector(selectGlobals);

    useEffect(() => {
        dispatch(getAllChannels());
    }, []);

    return (
        <div className="relative w-fit px-4 py-7 h-full bg-[#121212]">
            {data.length ? data.map((item, idx) => <ChannelBox key={idx} data={item} />) : ""}

            <div className="absolute left-0 bottom-7 w-full flex flex-col items-center justify-center gap-10">
                <UserMultiple className="w-5 h-5 cursor-pointer" />
                <Settings className="w-5 h-5 cursor-pointer" />
                <Box className="w-5 h-5 cursor-pointer" />
                <Logout className="w-5 h-5 cursor-pointer" />
            </div>
        </div>
    );
};
