import React, { ChangeEvent, useEffect, useState } from "react";
import {
    ComposedModal,
    ModalBody,
    ModalHeader,
    ContainedList,
    ContainedListItem,
    ExpandableSearch,
    Accordion,
    AccordionItem,
    IconButton,
    InlineNotification,
} from "@carbon/react";
import { useAppDispatch, useAppSelector } from "@/app/stores/hooks";
import { ChannelsObj, getAllChannels, selectChannels } from "@/app/stores/slices/channels/getAll";
import { getImageFromServer } from "@/utilities";
import { Add, Edit, JoinFull } from "@carbon/icons-react";
import { apiRequest } from "@/services/apiRequest";
import { getMyChannels } from "@/app/stores/slices/channels/getMy";
import { useDebounce, useLocalStorage } from "@uidotdev/usehooks";
import { UserDetailsType } from "@/types";

type Props = {
    open: boolean;
    onOpen: (param: boolean) => void;
};

export const SearchChannels: React.FC<Props> = ({ open, onOpen }) => {
    const dispatch = useAppDispatch();
    const { data } = useAppSelector(selectChannels);

    const [errMsg, setErrMsg] = useState("" as string);
    const [channels, setChannels] = useState([] as ChannelsObj[]);

    const [searchQuery, setSearchQuery] = useState("" as string);
    const debounceSearchQuery = useDebounce(searchQuery, 300);

    const [appUser, setAppUser] = useState({} as UserDetailsType);

    useEffect(() => {
        if (open) {
            dispatch(getAllChannels());
            setAppUser(JSON.parse(localStorage.getItem("appUser") as any));
        }
    }, [open]);

    useEffect(() => {
        setChannels(data);
    }, [data]);

    useEffect(() => {
        const newObj = data.filter((fil) => fil.channel_name?.includes(searchQuery));
        setChannels(newObj);
    }, [debounceSearchQuery]);

    const handleJoin = (channel_uid: number) => {
        apiRequest({ method: "POST", data: { channel_uid }, url: "channels/join" })
            .then(({ data }) => {
                console.log(data);
                if (!data.status) {
                    setErrMsg(data.data);
                    return;
                }
                onOpen(false);
                dispatch(getMyChannels());
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSearchQuery = (target: HTMLInputElement) => {
        setSearchQuery(target.value);
    };

    return (
        <ComposedModal open={open} onClose={() => onOpen(false)}>
            <ModalHeader label="All" title="Channels" />
            <ModalBody className="max-h-[400px] min-h-[400px] overflow-y-auto">
                {errMsg && (
                    <InlineNotification
                        aria-label="closes notification"
                        onClose={() => setErrMsg("")}
                        onCloseButtonClick={() => setErrMsg("")}
                        statusIconDescription="notification"
                        subtitle={errMsg}
                        title="Error:"
                        kind="error"
                        className="mb-5"
                    />
                )}
                <ContainedList
                    label="Search"
                    kind="on-page"
                    size="md"
                    action={
                        <ExpandableSearch
                            labelText=""
                            placeholder="Type here..."
                            value={searchQuery}
                            onChange={(ev: ChangeEvent) =>
                                handleSearchQuery(ev.target as HTMLInputElement)
                            }
                            closeButtonLabelText="Clear"
                            size="md"
                        />
                    }
                >
                    {channels.length ? (
                        channels.map((item, idx) => (
                            <ContainedListItem
                                key={idx}
                                className="cursor-pointer hover:bg-tertiary"
                            >
                                <div className="w-full flex items-center gap-5">
                                    <div className="flex gap-3 flex-1">
                                        <div className="w-10 h-10 rounded-full bg-tertiary mt-2">
                                            {item.channel_logo ? (
                                                <img
                                                    alt=""
                                                    className="w-full h-full rounded-full object-cover"
                                                    src={getImageFromServer({
                                                        type: "channels",
                                                        filename: item.channel_logo,
                                                    })}
                                                />
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="font-normal">{item.channel_name}</h5>
                                            <p className="font-light text-sm mt-0.5 opacity-50">
                                                {item.channel_description}
                                            </p>
                                        </div>
                                    </div>
                                    {item.join ? (
                                        <div className="px-2 py-1 border border-solid opacity-30">
                                            <p className="text-xs font-light">Joined</p>
                                        </div>
                                    ) : (
                                        <IconButton
                                            kind="secondary"
                                            size="sm"
                                            label="Join"
                                            onClick={() => handleJoin(item.uid)}
                                        >
                                            <Add />
                                        </IconButton>
                                    )}
                                </div>
                            </ContainedListItem>
                        ))
                    ) : (
                        <div className="w-full h-[200px] flex items-center justify-center">
                            "Not found."
                        </div>
                    )}
                </ContainedList>
            </ModalBody>
        </ComposedModal>
    );
};
