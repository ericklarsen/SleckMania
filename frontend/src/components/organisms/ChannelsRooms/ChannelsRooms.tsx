import {
    AddFilled,
    ChevronDown,
    DownToBottom,
    Information,
    Search,
    User,
} from "@carbon/icons-react";
import React, { useEffect, useState } from "react";
import { BoxChannels } from "./BoxChannels";
import { useAppDispatch, useAppSelector } from "@/app/stores/hooks";
import { getMyChannels, selectMyChannels } from "@/app/stores/slices/channels/getMy";
import { selectGlobals } from "@/app/stores/slices/globals/globals";
import { ChannelsDetails } from "./ChannelsDetails";
import { HomePageMessage } from "../HomePage/HomePageMessage";
import { RoomsMessage } from "./RoomsMessage";
import { SocketIO } from "@/services/socket";
import { setMessages } from "@/app/stores/slices/messages/messages";
import { AddRoomModal } from "./AddRoomModal";
import { SearchChannels } from "./SearchChannels";

export const ChannelsRooms = () => {
    const dispatch = useAppDispatch();
    const { currentChannel, currentRoom, isModalAddFormOpen } = useAppSelector(selectGlobals);
    const { data: myChannels, loading: myChannelsLoading } = useAppSelector(selectMyChannels);

    const [isOpenSearchChannels, setIsOpenSearchChannels] = useState(false as boolean);

    useEffect(() => {
        console.log(myChannels);
    }, [myChannels]);

    useEffect(() => {
        dispatch(getMyChannels());
        SocketIO.on("connect", () => console.log(SocketIO.id));
        SocketIO.on("disconnect", () => console.log("server disconnected"));
        SocketIO.on("connect_error", (Object: any) => {
            setTimeout(() => SocketIO.connect(), 5000);
        });
        SocketIO.on("receive_message", (data: any) => {
            dispatch(setMessages(JSON.parse(data)));
        });
    }, []);

    return (
        <>
            <SearchChannels open={isOpenSearchChannels} onOpen={setIsOpenSearchChannels} />
            <AddRoomModal open={isModalAddFormOpen} />
            <div className="global__side-1">
                <div className="global__side-1_topSect">
                    <h4 className="font-semibold">My Channels</h4>
                    <div className="flex gap-4">
                        <Search
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => setIsOpenSearchChannels(true)}
                        />
                        <AddFilled className="w-4 h-4 cursor-pointer" />
                    </div>
                </div>
                <div className="global__side-1_bottomSect px-4 py-2">
                    {myChannelsLoading
                        ? // <div className="w-full h-full flex items-center justify-center">
                          //     <Loading className={`w-10 h-10`} withOverlay={false} />
                          // </div>
                          ""
                        : myChannels.length
                        ? myChannels.map((item, idx) => <BoxChannels key={idx} data={item} />)
                        : "No channels found"}
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
                {currentChannel.uid ? <ChannelsDetails /> : ""}
                {currentRoom.uid ? <RoomsMessage /> : ""}
                {/* <div className="w-full h-full flex items-center justify-center">
                    <h6 className="font-light opacity-30">Please choose the channel.</h6>
                </div> */}
            </div>
        </>
    );
};
