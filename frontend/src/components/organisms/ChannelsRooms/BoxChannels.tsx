import { useAppDispatch, useAppSelector } from "@/app/stores/hooks";
import "./BoxChannels.css";
import {
    Add,
    ChevronDown,
    CircleDash,
    CircleFilled,
    Edit,
    OverflowMenuHorizontal,
    RowDelete,
    SettingsAdjust,
    TrashCan,
} from "@carbon/icons-react";
import React, { useEffect, useRef, useState } from "react";
import { ChannelsObj, getAllChannels } from "@/app/stores/slices/channels/getAll";
import { getImageFromServer, isCompanyAdmin } from "@/utilities";
import {
    selectGlobals,
    setCurrentChannel,
    setCurrentRoom,
    setIsModalAddFormOpen,
    setModalAddFormData,
    setModalAddFormEditData,
} from "@/app/stores/slices/globals/globals";
import { RoomObj } from "@/app/stores/slices/rooms/getAll";
import { JOIN_ROOM, SocketIO } from "@/services/socket";
import { OverflowMenu, OverflowMenuItem } from "@carbon/react";
import { UserDetailsType } from "@/types";

type Props = {
    data: ChannelsObj;
};

export const BoxChannels: React.FC<Props> = ({ data }) => {
    const dispatch = useAppDispatch();
    const { currentChannel, currentRoom, isModalAddFormOpen } = useAppSelector(selectGlobals);
    const [isDrop, setIsDrop] = useState(true as boolean);

    const handleChooseChannel = () => {
        if (currentChannel.uid !== data.uid) {
            dispatch(setCurrentChannel(data));
            dispatch(setCurrentRoom({ uid: 0 }));
        }
        if (!isDrop) {
            setIsDrop(!isDrop);
        }
    };

    const handleChooseRoom = (ev: React.MouseEvent, obj: RoomObj) => {
        ev?.preventDefault();
        if (currentRoom.uid === obj.uid) return;
        dispatch(setCurrentRoom(obj));
        dispatch(setCurrentChannel({ uid: 0 }));
        SocketIO.emit(JOIN_ROOM, obj.uid);
    };

    return (
        <div className="w-full mb-10">
            <div className="boxChannels" onClick={() => handleChooseChannel()}>
                <ChevronDown
                    className={`boxChannels__dropdown ${isDrop && "active"}`}
                    onClick={() => setIsDrop(!isDrop)}
                />

                <div className="boxChannels__ava">
                    {data.channel_logo ? (
                        <img
                            src={getImageFromServer({
                                type: "channels",
                                filename: data.channel_logo,
                            })}
                            alt=""
                        />
                    ) : (
                        <h4>{data.channel_logo?.charAt(0)}</h4>
                    )}
                </div>
                <h6 className="boxChannels__text">{data.channel_name}</h6>
                {isCompanyAdmin() && (
                    <OverflowMenu aria-label="overflow-menu" focusTrap={false}>
                        <OverflowMenuItem
                            itemText="Add Room"
                            onClick={(ev: Event) => {
                                ev.stopPropagation();
                                dispatch(setModalAddFormData({ channel_uid: data.uid }));
                                dispatch(setIsModalAddFormOpen(true));
                            }}
                        />
                        <OverflowMenuItem itemText="Edit Channel" />
                        <OverflowMenuItem hasDivider isDelete itemText="Delete Channel" />
                    </OverflowMenu>
                )}
            </div>
            <div className={`boxChannels__roomsContainer ${isDrop && "active"}`}>
                {data.rooms?.map((item, idx) => (
                    <div
                        key={idx}
                        className="boxChannels__room"
                        onClick={(ev) => handleChooseRoom(ev, item)}
                    >
                        <h6 className="font-normal flex-1">{item.room_name}</h6>
                        {isCompanyAdmin() && (
                            <div className="flex items-center gap-4">
                                <Edit
                                    onClick={(ev) => {
                                        ev.stopPropagation();
                                        dispatch(setModalAddFormEditData(item));
                                        dispatch(setIsModalAddFormOpen(true));
                                    }}
                                />
                                <TrashCan
                                    onClick={(ev) => {
                                        ev.stopPropagation();
                                        console.log("Delete");
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
