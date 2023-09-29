import { useAppSelector } from "@/app/stores/hooks";
import { selectGlobals } from "@/app/stores/slices/globals/globals";
import { Information, Send, User } from "@carbon/icons-react";
import {
    ComposedModal,
    ModalBody,
    ModalHeader,
    ContainedList,
    ContainedListItem,
    ExpandableSearch,
    TextInput,
    TextArea,
} from "@carbon/react";
import React, { useEffect, useState } from "react";
import { ChannelsDetailsMembers } from "./ChannelsDetailsMembers";
import { UserAva } from "@/components/atoms/UserAva/UserAva";
import { BoxThreads } from "./BoxThreads";

export const ChannelsDetails = () => {
    const { currentChannel } = useAppSelector(selectGlobals);
    const [isOpenChannelMembers, setIsOpenChannelMembers] = useState(false as boolean);

    useEffect(() => {
        // console.log(currentChannel);
    }, [currentChannel]);

    return (
        <>
            <ChannelsDetailsMembers open={isOpenChannelMembers} onOpen={setIsOpenChannelMembers} />
            <div className="w-full h-[80px] py-4 px-5 bg-[#333333] flex justify-between">
                <div className="w-[50%]">
                    <h5>{currentChannel.channel_name}</h5>
                    <h6 className="font-normal mt-1.5">{currentChannel.channel_description}</h6>
                </div>
                <div className="flex items-center gap-4 opacity-75">
                    <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => setIsOpenChannelMembers(true)}
                    >
                        <User className="w-4 h-4" />
                    </div>
                    <Information className="w-4 h-4 cursor-pointer" />
                </div>
            </div>

            <div className="w-full h-[calc(100%-80px)] overflow-y-auto px-5 py-6 pb-10">
                <BoxThreads />
                <BoxThreads />
            </div>
        </>
    );
};
