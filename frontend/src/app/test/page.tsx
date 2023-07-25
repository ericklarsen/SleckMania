"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { apiRequest, getAccessToken } from "@/services/apiRequest";
import moment from "moment";
import { SocketIO } from "@/services/socket";

export default function Home() {
    const [time, setTime] = useState("fetching");
    const [messages, setMessages] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [currentRoomUID, setCurrentRoomUID] = useState(0);
    const [roomMessages, setRoomMessages] = useState([]);

    useEffect(() => {
        console.log("access token", getAccessToken());
        SocketIO.on("connect", () => console.log(SocketIO.id));
        SocketIO.on("disconnect", () => setTime("server disconnected"));
        SocketIO.on("connect_error", (Object: any) => {
            setTimeout(() => SocketIO.connect(), 5000);
        });

        SocketIO.on("connectToRoom", (data: any) => {
            console.log(data);
        });

        SocketIO.on("receive_message", (data: any) => {
            setMessages(JSON.parse(data));
        });

        SocketIO.on("GET_USER_DETAILS", (data: any) => {
            // console.log(data);
        });

        // SocketIO.emit("tester", "room_uid");

        return () => {
            SocketIO.disconnect();
        };
    }, []);

    useEffect(() => {
        getRooms();
    }, []);

    const handleJoinRoom = (room_uid: number) => {
        SocketIO.emit("join_room", room_uid);
        setCurrentRoomUID(room_uid);
    };

    const handleSendMessage = () => {
        const message = document.getElementById("message") as HTMLInputElement;
        const obj = { room_uid: currentRoomUID, message: message.value };
        SocketIO.emit("send_message", obj);
        message.value = "";
    };

    const getRooms = () => {
        apiRequest({
            method: "POST",
            url: "http://localhost:8080/api/rooms/get",
            data: { channel_uid: 3 },
        })
            .then((res) => {
                const { status, data } = res.data;

                if (status) {
                    setRooms(data);
                    // console.log(data);
                } else {
                    alert(data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const generateMessages = () => {
        return messages.map((item: any, idx) => {
            const userDetails = JSON.parse(localStorage.getItem("appUser") as any);
            let isMyMessage = false;
            if (userDetails.uid === item.owner.user_uid) {
                isMyMessage = true;
            }
            return (
                <div
                    key={idx}
                    className={`w-full flex gap-2 mb-4 ${
                        isMyMessage ? "flex-row-reverse justify-start" : ""
                    }`}
                >
                    {!isMyMessage && (
                        <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-white/50">
                            {item.owner.first_name[0]}
                        </div>
                    )}
                    <div className="w-full max-w-[400px]">
                        {!isMyMessage && (
                            <p className="mb-1">{`${item.owner.first_name} ${item.owner.last_name}`}</p>
                        )}
                        <div className="w-full relative max-w-[400px] p-2 pb-8 px-4 bg-zinc-800">
                            <p>{item.message_content}</p>
                            <div className="absolute bottom-3 right-3 text-xs opacity-50">
                                {moment(item.created_at).format("HH:mm DD/MM/YYYY")}
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    };

    useEffect(() => {
        var scrollContainer = document.getElementById("messagesContainer") as HTMLDivElement;
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        console.log(messages);
        // console.log(scrollContainer);
        // console.log(scrollContainer.scrollTop);
        // console.log(scrollContainer.scrollHeight);
    }, [messages]);

    useEffect(() => {
        console.log(rooms);
        rooms.forEach((item: any) => {
            SocketIO.emit("join_room", item.uid);
        });
    }, [rooms]);

    return (
        <main className="px-6 h-screen">
            <div className="w-full min-h-screen grid grid-cols-4 gap-4">
                <div className="h-full max-h-screen overflow-y-auto" style={{ gridArea: 1 / 4 }}>
                    {rooms.map((item: any, idx) => (
                        <div
                            key={idx}
                            className="w-full p-4 mb-4 border border-white cursor-pointer"
                            onClick={() => handleJoinRoom(item.uid)}
                        >
                            <h5 className="text-xl mb-1">{item.room_name}</h5>
                            <p className="text-md opacity-80 italic">{item.room_description}</p>
                        </div>
                    ))}

                    {/* <div
                        className="w-full p-4 mb-4 border border-white cursor-pointer"
                        onClick={() => handleJoinRoom(2)}
                    >
                        <h5 className="text-xl mb-1">{`item.room_name`}</h5>
                        <p className="text-md opacity-80 italic">{`item.room_description`}</p>
                    </div> */}
                </div>
                <div
                    className="w-full h-full max-h-screen border border-white flex flex-col"
                    style={{ gridArea: "1 / 2 / auto / none" }}
                >
                    <div
                        id="messagesContainer"
                        className="w-full h-full max-h-[80vh] overflow-y-auto p-4"
                    >
                        {generateMessages()}
                        {/* {JSON.stringify(messages)} */}
                    </div>
                    <div className="w-full flex gap-4 border-t border-t-white rounded-md">
                        <input
                            className="w-full p-4  bg-transparent border-none outline-none"
                            placeholder="Type here..."
                            type="text"
                            name=""
                            id="message"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSendMessage();
                                }
                            }}
                        />
                        <div
                            className="w-[100px] h-full bg-white text-black text-xl font-bold flex items-center justify-center cursor-pointer"
                            onClick={() => handleSendMessage()}
                        >
                            Send
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
