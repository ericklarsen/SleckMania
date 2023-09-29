import { ChannelsObj, selectChannels } from "@/app/stores/slices/channels/getAll";
import "./ChannelBox.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
    selectGlobals,
    setCurrentChannel,
    setCurrentRoom,
} from "@/app/stores/slices/globals/globals";

interface Props {
    active?: boolean;
    data: ChannelsObj;
}

export const ChannelBox: React.FC<Props> = ({ active, data }) => {
    const dispatch = useDispatch();
    const { currentChannel } = useSelector(selectGlobals);
    const { data: channels } = useSelector(selectChannels);

    const handleChooseChannel = (obj: ChannelsObj) => {
        dispatch(setCurrentChannel(obj));
        dispatch(setCurrentRoom({ uid: 0 }));
    };

    return (
        <div
            className={`channelBox ${currentChannel.uid === data.uid ? "activated" : ""}`}
            onClick={() => handleChooseChannel(data)}
        >
            <div className="channelBox__ava">
                {data.channel_logo ? (
                    <img
                        className="w-full h-full object-cover rounded-full"
                        src={`${process.env.NEXT_PUBLIC_ASSET_SERVER}/channels/${data.channel_logo}`}
                        alt="channel logo"
                    />
                ) : (
                    ""
                )}
            </div>
            <h6 className="channelBox__text">{data.channel_name}</h6>
        </div>
    );
};
