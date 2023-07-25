import { io } from "socket.io-client";
import { getAccessToken } from "./apiRequest";

export const JOIN_ROOM = "join_room";
export const LEAVE_ROOM = "leave_room";

export const SEND_MESSAGE = "send_message";
export const SEND_TYPING = "send_typing";
export const SEND_READ_MESSAGE = "send_read_message";

export const RECEIVE_MESSAGE = "receive_message";
export const RECEIVE_TYPING = "receive_typing";
export const RECEIVE_READ = "receive_read";

export const SUCCESS_SEND_MESSAGE = "success_send_message";
export const ONLINE_STATUS = "online_status";

const accessToken = `${getAccessToken()}`;
const socketServer = process.env.NEXT_PUBLIC_SOCKET_SERVER as string;
export const SocketIO = io(socketServer, {
    withCredentials: false,
    transports: ["websocket", "polling"],
    auth: {
        token: accessToken,
    },
});

type EmitProps = {
    emitEvent: (eventName: string, payload: any) => void;
};

export const emit: EmitProps["emitEvent"] = (eventName, payload) => {
    SocketIO.emit(eventName, payload);
};
