import { useAppSelector } from "@/app/stores/hooks";
import { selectGlobals } from "@/app/stores/slices/globals/globals";
import { Information, User } from "@carbon/icons-react";
import {
    ComposedModal,
    ModalBody,
    ModalHeader,
    ContainedList,
    ContainedListItem,
    ExpandableSearch,
} from "@carbon/react";
import React, { useEffect, useState } from "react";
import { ChannelsDetailsMembers } from "./ChannelsDetailsMembers";

export const ChannelsDetails = () => {
    const { currentChannel } = useAppSelector(selectGlobals);
    const [isOpenChannelMembers, setIsOpenChannelMembers] = useState(false as boolean);

    useEffect(() => {
        console.log(currentChannel);
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

            <div
                data-list="messages"
                className="w-full h-[calc(100%-80px)] overflow-y-auto px-5 py-6 pb-10"
            >
                <div className="w-full pt-4 bg-[#333333]">
                    <div className="flex items-center gap-5 px-4">
                        <h6 className="font-medium">Erick Larsen</h6>
                        <h6 className="font-normal opacity-50">19/04/2023 15:00</h6>
                    </div>
                    <div className="pt-2 pb-4 px-4">
                        <p className="text-sm">
                            just so we both know and maybe one to put in paymo? will leave for you
                            to decide Kora. For the Disney consumer app Magic Ahoy! +, we will have
                            separate Terms and Conditions from the original Magic Ahoy! We will need
                            this on a different web page to the other ones. I don't have the final
                            version yet, however can we please set up that page and provide me with
                            the url so Becky can fill out her OLAF?
                        </p>
                    </div>
                    <div className="w-full px-4 py-2 bg-[#202020] cursor-pointer">
                        <p className="text-sm">Reply</p>
                    </div>
                </div>
            </div>
        </>
    );
};
