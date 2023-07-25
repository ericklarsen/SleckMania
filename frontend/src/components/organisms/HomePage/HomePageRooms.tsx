import { selectGlobals } from "@/app/stores/slices/globals/globals";
import { getAllRooms, selectRooms } from "@/app/stores/slices/rooms/getAll";
import { RoomBox } from "@/components/atoms/RoomBox/RoomBox";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, Loading, Modal, TextInput, FileUploader } from "@carbon/react";
import { Add } from "@carbon/icons-react";
import { getAccessToken } from "@/services/apiRequest";
import { SocketIO } from "@/services/socket";
import { setMessages } from "@/app/stores/slices/messages/messages";

export const HomePageRooms: React.FC = () => {
    const dispatch = useDispatch();
    const { currentChannel } = useSelector(selectGlobals);
    const { data, loading } = useSelector(selectRooms);
    const [isModalOpen, setIsModalOpen] = useState(false as boolean);
    const [isDataValid, setIsDataValid] = useState(false as boolean);

    type ParamGetAllInputValueFunc = {
        callback?: (el: HTMLInputElement) => void;
        isReturn?: boolean;
    };
    const getAllInputValue = ({ callback, isReturn }: ParamGetAllInputValueFunc) => {
        type ObjType = {
            room_name: string;
            room_description: string;
            room_logo?: any | string;
        };
        const obj: ObjType = {
            room_name: "",
            room_description: "",
            room_logo: "",
        };
        document.querySelectorAll("[data-name]").forEach((el) => {
            const targetEl = el as HTMLInputElement;

            if (callback) {
                callback(targetEl);
            } else {
                type NameType = "room_logo" | "room_name" | "room_description";
                const name = targetEl.dataset.name as NameType;

                if (name === "room_logo") {
                    const fileInput = targetEl.querySelector("input") as HTMLInputElement;
                    console.log(name);
                    console.log(fileInput);
                    obj[name] = fileInput?.files;
                } else {
                    obj[name] = targetEl.value;
                }
            }
        });

        if (isReturn) return obj;
    };

    const handleValidation = () => {
        let isNotValid = 0;

        getAllInputValue({
            callback: (targetEl) => {
                const name = targetEl.dataset.name as string;
                if (name === "room_logo") {
                    // const fileInput = targetEl.querySelector("input") as HTMLInputElement;
                    // console.log(fileInput.value);
                    // if (!fileInput.files) {
                    //     isNotValid++;
                    // }
                } else {
                    if (!targetEl.value) isNotValid++;
                }
            },
        });

        setIsDataValid(isNotValid ? false : true);
    };

    const handleSubmit = () => {
        const payload = getAllInputValue({ isReturn: true });
        console.log(payload);
    };

    useEffect(() => {
        if (currentChannel.uid) {
            dispatch(getAllRooms(currentChannel.uid));

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
                open={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onRequestSubmit={() => handleSubmit()}
                isFullWidth={false}
                primaryButtonDisabled={isDataValid ? false : true}
                size="xs"
            >
                <div className="w-full grid grid-cols-1 gap-4">
                    <TextInput
                        id=""
                        data-name="room_name"
                        labelText="Name"
                        onChange={() => handleValidation()}
                    />
                    <TextInput
                        id=""
                        data-name="room_description"
                        labelText="Description"
                        onChange={() => handleValidation()}
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
                        onChange={() => handleValidation()}
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
                    {/* <ModalWrapper
                        triggerButtonKind="secondary"
                        buttonTriggerText="Add Room"
                        modalHeading="Add Room"
                        renderTriggerButtonIcon={Add}
                        handleSubmit={() => {}}
                    >
                        <p>Modal content here</p>
                    </ModalWrapper> */}
                    <IconButton
                        className="w-10 h-10 flex items-center justify-center p-0"
                        align="left"
                        label="Add a Room"
                        kind="secondary"
                        onClick={() => setIsModalOpen(true)}
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

            {/* <RoomBox /> */}
        </>
    );
};
