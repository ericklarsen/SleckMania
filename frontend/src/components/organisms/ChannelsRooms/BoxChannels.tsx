import { useAppDispatch } from "@/app/stores/hooks";
import "./BoxChannels.css";
import {
    Add,
    ChevronDown,
    CircleDash,
    CircleFilled,
    OverflowMenuHorizontal,
    SettingsAdjust,
} from "@carbon/icons-react";
import React, { useEffect, useState } from "react";
import { ChannelsObj, getAllChannels } from "@/app/stores/slices/channels/getAll";
import { getImageFromServer } from "@/utilities";

type Props = {
    data: ChannelsObj;
};

export const BoxChannels: React.FC<Props> = ({ data }) => {
    const [isDrop, setIsDrop] = useState(false as boolean);

    return (
        <>
            <div className="boxChannels" onClick={() => setIsDrop(!isDrop)}>
                <ChevronDown className={`boxChannels__dropdown ${isDrop && "active"}`} />

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
                <OverflowMenuHorizontal />
            </div>
            <div className={`boxChannels__roomsContainer ${isDrop && "active"}`}>
                {data.rooms?.map((item, idx) => (
                    <div key={idx} className="boxChannels__room">
                        <h6 className="font-normal">{item.room_name}</h6>
                        <OverflowMenuHorizontal />
                    </div>
                ))}
            </div>
        </>
    );
};
