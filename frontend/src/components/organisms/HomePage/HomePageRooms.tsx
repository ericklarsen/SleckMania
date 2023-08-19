import { selectGlobals } from "@/app/stores/slices/globals/globals";
import { getAllRooms, selectRooms } from "@/app/stores/slices/rooms/getAll";
import { RoomBox } from "@/components/atoms/RoomBox/RoomBox";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    IconButton,
    Loading,
    Modal,
    TextInput,
    FileUploader,
    InlineNotification,
} from "@carbon/react";
import { Add } from "@carbon/icons-react";
import { apiRequest, getAccessToken } from "@/services/apiRequest";
import { SocketIO } from "@/services/socket";
import { setMessages } from "@/app/stores/slices/messages/messages";

type ParamGetAllInputValueFunc = {
    callback?: (el: HTMLInputElement) => void;
    enableValidation?: boolean;
};
type ObjType = {
    channel_uid: number;
    room_name: string;
    room_description: string;
    room_logo?: any | string;
};
type NameType = "room_logo" | "room_name" | "room_description";

export const HomePageRooms: React.FC = () => {
    const dispatch = useDispatch();
    const { currentChannel } = useSelector(selectGlobals);
    const { data, loading } = useSelector(selectRooms);
    const [isModalAddFormOpen, setIsModalAddFormOpen] = useState(false as boolean);
    const [isDataValid, setIsDataValid] = useState(false as boolean);

    const getAllInputValue = ({ callback, enableValidation }: ParamGetAllInputValueFunc) => {
        const obj: ObjType = {
            channel_uid: currentChannel.uid,
            room_name: "",
            room_description: "",
            room_logo: "",
        };
        let isNotValid = 0;
        document.querySelectorAll("[data-name]").forEach((el) => {
            const targetEl = el as HTMLInputElement;

            if (callback) {
                callback(targetEl);
            } else {
                const name = targetEl.dataset.name as NameType;

                if (name === "room_logo") {
                    if (targetEl.tagName === "SPAN") return;
                    const fileInput = targetEl.querySelector("input") as HTMLInputElement;
                    const files = fileInput.files as any;
                    obj[name] = files[0];

                    if (enableValidation) {
                        if (!fileInput.files?.length) {
                            isNotValid++;
                        }
                    }
                } else {
                    obj[name] = targetEl.value;

                    if (enableValidation) {
                        if (!targetEl.value) isNotValid++;
                    }
                }
            }
        });

        if (!enableValidation) return obj;
        setIsDataValid(isNotValid ? false : true);
    };

    const handleSubmit = async () => {
        const payload = getAllInputValue({ enableValidation: false }) as ObjType;
        const form = new FormData();

        Object.keys(payload).forEach((key) => {
            var name = key as NameType;
            form.append(key, payload[name]);
        });

        apiRequest({
            method: "POST",
            headers: { "Content-Type": "multipart/form-data" },
            url: "rooms/add",
            data: form,
        })
            .then((res) => {
                if (!res.status) return;
                console.log(res);
                setIsModalAddFormOpen(false);
                dispatch(getAllRooms(currentChannel.uid) as any);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (currentChannel.uid) {
            dispatch(getAllRooms(currentChannel.uid) as any);

            SocketIO.on("connect", () => console.log(SocketIO.id));
            SocketIO.on("disconnect", () => console.log("server disconnected"));
            SocketIO.on("connect_error", (Object: any) => {
                setTimeout(() => SocketIO.connect(), 5000);
            });
        }
    }, [currentChannel]);

    useEffect(() => {
        SocketIO.on("receive_message", (data: any) => {
            dispatch(setMessages(JSON.parse(data)));
        });
    }, []);

    return (
        <>
            <Modal
                modalHeading="Room"
                modalLabel="Add"
                primaryButtonText="Submit"
                secondaryButtonText="Cancel"
                open={isModalAddFormOpen}
                onRequestClose={() => setIsModalAddFormOpen(false)}
                onRequestSubmit={() => handleSubmit()}
                isFullWidth={false}
                primaryButtonDisabled={isDataValid ? false : true}
                size="md"
            >
                <InlineNotification
                    aria-label="closes notification"
                    // onClose={function noRefCheck() {}}
                    // onCloseButtonClick={function noRefCheck() {}}
                    statusIconDescription="notification"
                    subtitle="Subtitle text goes here"
                    title="Error:"
                    kind="error"
                />
                <div className="w-full grid grid-cols-1 gap-4">
                    <TextInput
                        id=""
                        data-name="room_name"
                        labelText="Name"
                        onChange={() => getAllInputValue({ enableValidation: true })}
                        spellCheck={false}
                    />
                    <TextInput
                        id=""
                        data-name="room_description"
                        labelText="Description"
                        onChange={() => getAllInputValue({ enableValidation: true })}
                        spellCheck={false}
                    />
                    <FileUploader
                        labelTitle="Upload files"
                        labelDescription="Max file size is 2mb. Only .jpg files are supported."
                        buttonLabel="Add file"
                        buttonKind="primary"
                        filenameStatus="edit"
                        accept={[".jpg", ".png"]}
                        multiple={false}
                        iconDescription="Delete file"
                        data-name="room_logo"
                        onChange={() => getAllInputValue({ enableValidation: true })}
                    />
                </div>
            </Modal>
            <div className="w-full flex justify-between gap-5">
                <div>
                    <p className="">Channel</p>
                    <h4 className="font-bold my-1">{currentChannel.channel_name}</h4>
                    <p className="mb-6 opacity-75  font-light">
                        {currentChannel.channel_description
                            ? currentChannel.channel_description
                            : "-"}
                    </p>
                </div>
                <div>
                    <IconButton
                        className="w-10 h-10 flex items-center justify-center p-0"
                        align="left"
                        label="Add a Room"
                        kind="secondary"
                        onClick={() => setIsModalAddFormOpen(true)}
                    >
                        <Add />
                    </IconButton>
                </div>
            </div>

            {loading ? (
                <div className="w-full h-[400px] flex items-center justify-center">
                    <Loading className="w-8 h-8" withOverlay={false} />
                </div>
            ) : data.length ? (
                data.map((item, idx) => <RoomBox key={idx} data={item} />)
            ) : (
                <div className="w-full h-[400px] flex items-center justify-center">
                    <h6 className="font-light opacity-30">No Rooms.</h6>
                </div>
            )}
        </>
    );
};
