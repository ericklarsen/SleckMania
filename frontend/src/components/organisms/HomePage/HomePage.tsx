import { MessageInput } from "@/components/atoms/MessageInput/MessageInput";
import { RoomBox } from "@/components/atoms/RoomBox/RoomBox";
import { ChatBox } from "@/components/atoms/ChatBox/ChatBox";
import {
    Box,
    Group,
    Information,
    Logout,
    Send,
    SendAlt,
    Settings,
    User,
    UserAvatar,
    UserData,
    UserMultiple,
    UserSettings,
} from "@carbon/icons-react";
import { Column, FluidForm, Grid, TextArea, TextInput } from "@carbon/react";
import { ChannelBox } from "@/components/atoms/ChannelBox/ChannelBox";
import { HomePageChannels } from "./HomePageChannels";
import { useAppDispatch, useAppSelector } from "@/app/stores/hooks";
import { selectGlobals } from "@/app/stores/slices/globals/globals";
import { useEffect } from "react";
import { HomePageRooms } from "./HomePageRooms";
import { HomePageMessage } from "./HomePageMessage";
import { selectMessages } from "@/app/stores/slices/messages/messages";

const HomePage = () => {
    const dispatch = useAppDispatch();
    const { currentChannel, currentRoom } = useAppSelector(selectGlobals);
    const { data: messages } = useAppSelector(selectMessages);

    useEffect(() => {
        console.log(currentChannel);
    }, []);

    return (
        <main className="w-screen h-screen flex">
            <HomePageChannels />

            <div className="w-[500px] overflow-y-auto px-4 py-7 h-full bg-[#1E1E1E]">
                {currentChannel.uid ? (
                    <HomePageRooms />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <h6 className="font-light opacity-30">Please choose the channel.</h6>
                    </div>
                )}
            </div>
            <div className="w-full h-full bg-[#121212] relative">
                {currentRoom.uid ? (
                    <HomePageMessage />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <h6 className="font-light opacity-30">Please choose the room.</h6>
                    </div>
                )}
            </div>
        </main>
    );
};

export default HomePage;
