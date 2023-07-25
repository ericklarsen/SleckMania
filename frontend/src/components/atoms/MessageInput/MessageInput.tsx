import { useAppSelector } from "@/app/stores/hooks";
import { selectGlobals, setIsSendMessage } from "@/app/stores/slices/globals/globals";
import { RECEIVE_TYPING, SEND_MESSAGE, SEND_TYPING, SocketIO } from "@/services/socket";
import { UserDetailsType } from "@/types";
import { Send } from "@carbon/icons-react";
import { TextArea } from "@carbon/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const MessageInput: React.FC = () => {
    const appUser: UserDetailsType = JSON.parse(localStorage.getItem("appUser") as any);

    const dispatch = useDispatch();
    const { currentRoom } = useAppSelector(selectGlobals);

    const [listUsersTyping, setListUsersTyping] = useState([] as any);
    const [timeouts, setTimeouts] = useState("" as any);

    const handleSendMessage = () => {
        const message = document.getElementById("message") as HTMLInputElement;
        if (!message.value.length) return;
        dispatch(setIsSendMessage(true));

        const obj = { room_uid: currentRoom.uid, message: message.value };
        SocketIO.emit(SEND_MESSAGE, obj);
        message.value = "";
    };

    const handleTyping = () => {
        clearTimeout(timeouts);
        SocketIO.emit(SEND_TYPING, {
            room_uid: currentRoom.uid,
            user_details: { ...appUser, typing: true },
        });

        setTimeouts(
            setTimeout(() => {
                SocketIO.emit(SEND_TYPING, {
                    room_uid: currentRoom.uid,
                    user_details: { ...appUser, typing: false },
                });
            }, 2000)
        );
    };

    const generateTypingList = () => {
        if (!listUsersTyping.length) return;
        let users = listUsersTyping.map((item: any) => item.first_name);
        return (
            <div className="w-full p-4 py-2 bg-[#3f3f3f]">
                <h6 className="font-normal opacity-75 italic">{users.toString()} typing...</h6>
            </div>
        );
    };

    useEffect(() => {
        SocketIO.on(RECEIVE_TYPING, (obj) => {
            setListUsersTyping(obj);
        });
    }, []);

    return (
        <div className="absolute bottom-0 left-0 w-full z-10">
            {generateTypingList()}
            <div className="w-full">
                <TextArea
                    id="message"
                    labelText=""
                    placeholder="Type here..."
                    style={{ resize: "unset", paddingRight: "50px" }}
                    onKeyDown={(e) => {
                        if (!e.shiftKey && e.code === "Enter") {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    onInput={() => handleTyping()}
                />
                <div
                    onClick={() => handleSendMessage()}
                    className="p-2 absolute bottom-2 right-2 bg-[#262626] cursor-pointer"
                >
                    <Send className="w-6 h-6 " />
                </div>
            </div>
        </div>
    );
};
