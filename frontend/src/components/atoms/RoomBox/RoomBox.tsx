import { RoomObj } from "@/app/stores/slices/rooms/getAll";
import "./RoomBox.css";
import { useDispatch, useSelector } from "react-redux";
import { selectGlobals, setCurrentRoom } from "@/app/stores/slices/globals/globals";
import { useEffect } from "react";
import { JOIN_ROOM, SocketIO } from "@/services/socket";

interface Props {
    data: RoomObj;
}

export const RoomBox: React.FC<Props> = ({ data }) => {
    const dispatch = useDispatch();
    const { currentRoom } = useSelector(selectGlobals);

    const handleChooseRoom = (obj: RoomObj) => {
        if (currentRoom.uid === obj.uid) return;
        dispatch(setCurrentRoom(obj));
        SocketIO.emit(JOIN_ROOM, obj.uid);
    };

    useEffect(() => {
        console.log(currentRoom);
    }, [currentRoom]);

    return (
        <div
            className={`roomBox ${currentRoom.uid === data.uid ? "activated" : ""}`}
            onClick={() => handleChooseRoom(data)}
        >
            <div className="w-full h-fit flex">
                <div className="w-[48px] h-auto bg-[#6A6A6A]">
                    {data.room_logo ? (
                        <img
                            alt="room logo"
                            src={`${process.env.NEXT_PUBLIC_ASSET_SERVER}/rooms/${data.room_logo}`}
                        />
                    ) : (
                        ""
                    )}
                </div>
                <div className="w-[calc(100%-48px)] px-4 py-3 ">
                    <h5 className="font-bold">{data.room_name}</h5>
                    <h6 className="w-full mt-1 font-light opacity-75">{data.room_description}</h6>
                </div>
            </div>
        </div>
    );
};
