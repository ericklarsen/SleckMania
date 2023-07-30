import {
    AddFilled,
    ChevronDown,
    DownToBottom,
    Information,
    Search,
    User,
} from "@carbon/icons-react";
import React, { useEffect } from "react";
import { BoxChannels } from "./BoxChannels";
import { useAppDispatch, useAppSelector } from "@/app/stores/hooks";
import { getMyChannels, selectMyChannels } from "@/app/stores/slices/channels/getMy";

export const ChannelsRooms = () => {
    const { data: myChannels, loading } = useAppSelector(selectMyChannels);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getMyChannels());
    }, []);

    useEffect(() => {
        console.log(myChannels);
    }, [myChannels]);

    return (
        <>
            <div className="global__side-1">
                <div className="global__side-1_topSect">
                    <h4 className="font-semibold">Channels and Rooms</h4>
                    <div className="flex gap-4">
                        <Search className="w-4 h-4 cursor-pointer" />
                        <AddFilled className="w-4 h-4 cursor-pointer" />
                    </div>
                </div>
                <div className="global__side-1_bottomSect px-4 py-2">
                    {myChannels.map((item, idx) => (
                        <BoxChannels key={idx} data={item} />
                    ))}
                </div>
                {/* {currentChannel.uid ? (
                    <HomePageRooms />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <h6 className="font-light opacity-30">Please choose the channel.</h6>
                    </div>
                )} */}
            </div>
            <div className="global__side-2">
                <div className="w-full h-[80px] py-4 px-5 bg-[#333333] flex justify-between">
                    <div className="w-[50%]">
                        <h5>{`currentRoom.room_name`}</h5>
                        <h6 className="font-normal mt-1.5">{`currentRoom.room_description`}</h6>
                    </div>
                    <div className="flex items-center gap-4 opacity-75">
                        <div className="flex items-center gap-1 cursor-pointer">
                            <User className="w-4 h-4" />
                        </div>
                        <Information className="w-4 h-4 cursor-pointer" />
                    </div>
                </div>
                {/* {currentRoom.uid ? (
                    <HomePageMessage />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <h6 className="font-light opacity-30">Please choose the room.</h6>
                    </div>
                )} */}
            </div>
        </>
    );
};
