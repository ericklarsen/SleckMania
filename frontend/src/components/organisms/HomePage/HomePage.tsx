import "./HomePage.css";
import { useAppDispatch, useAppSelector } from "@/app/stores/hooks";
import { selectGlobals } from "@/app/stores/slices/globals/globals";
import { useEffect } from "react";
import { HomePageRooms } from "./HomePageRooms";
import { HomePageMessage } from "./HomePageMessage";
import { selectMessages } from "@/app/stores/slices/messages/messages";
import { MainLayout } from "@/components/layouts/MainLayout/MainLayout";
import { Add, AddAlt, AddComment, Search } from "@carbon/icons-react";
import { UserAva } from "@/components/atoms/UserAva/UserAva";
import { PersonalChatBox } from "@/components/atoms/PersonalChatBox/PersonalChatBox";

const HomePage = () => {
    const dispatch = useAppDispatch();
    const { currentChannel, currentRoom } = useAppSelector(selectGlobals);
    const { data: messages } = useAppSelector(selectMessages);

    // useEffect(() => {
    //     console.log(currentChannel);
    //     const newURL = "/new-page"; // The new URL you want to navigate to
    //     const stateObject = { page: "new-page" }; // An optional state object

    //     // Push the new state and change the URL without reloading the page
    //     history.pushState(stateObject, "New Page Title", newURL);
    // }, []);

    return (
        <>
            <div className="global__side-1">
                <div className="homePage__topNav">
                    <h4 className="font-semibold">Chat</h4>
                    <div className="flex gap-4">
                        <Search className="w-4 h-4 cursor-pointer" />
                        <AddComment className="w-4 h-4 cursor-pointer" />
                    </div>
                </div>

                <div className="homePage__bottomNav">
                    <PersonalChatBox />
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

export default HomePage;
