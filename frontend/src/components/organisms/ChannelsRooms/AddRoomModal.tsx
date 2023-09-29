import React, { useEffect, useState } from "react";
import {
    IconButton,
    Loading,
    Modal,
    TextInput,
    FileUploader,
    InlineNotification,
} from "@carbon/react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectGlobals,
    setIsModalAddFormOpen,
    setModalAddFormData,
    setModalAddFormEditData,
} from "@/app/stores/slices/globals/globals";
import { apiRequest } from "@/services/apiRequest";
import { getMyChannels } from "@/app/stores/slices/channels/getMy";
import { useAppDispatch } from "@/app/stores/hooks";

type Props = {
    open: boolean;
};
type ParamGetAllInputValueFunc = {
    callback?: (el: HTMLInputElement) => void;
    enableValidation?: boolean;
};
type ObjType = {
    channel_uid: number;
    uid?: number;
    room_name: string;
    room_description: string;
    room_logo?: any | string;
};
type NameType = "room_logo" | "room_name" | "room_description";

export const AddRoomModal: React.FC<Props> = ({ open }) => {
    const dispatch = useAppDispatch();
    const { modalAddFormData, modalAddFormEditData } = useSelector(selectGlobals);
    const [isDataValid, setIsDataValid] = useState(false as boolean);
    const [errMsg, setErrMsg] = useState("");

    const handleClose = () => {
        dispatch(setIsModalAddFormOpen(false));
        dispatch(setModalAddFormEditData({ uid: 0 }));
        dispatch(setModalAddFormData({ channel_uid: 0 }));
    };

    const getAllInputValue = ({ callback, enableValidation }: ParamGetAllInputValueFunc) => {
        const obj: ObjType = {
            channel_uid: modalAddFormData.channel_uid,
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

                // if (name === "room_logo") {
                //     if (targetEl.tagName === "SPAN") return;
                //     const fileInput = targetEl.querySelector("input") as HTMLInputElement;
                //     const files = fileInput.files as any;
                //     obj[name] = files[0];

                //     if (enableValidation) {
                //         if (!fileInput.files?.length) {
                //             isNotValid++;
                //         }
                //     }
                // } else {
                //     obj[name] = targetEl.value;

                //     if (enableValidation) {
                //         if (!targetEl.value) isNotValid++;
                //     }
                // }

                obj[name] = targetEl.value;

                if (enableValidation) {
                    if (!targetEl.value) isNotValid++;
                }
            }
        });

        if (!enableValidation) return obj;
        setIsDataValid(isNotValid ? false : true);
    };

    const handleSubmit = async () => {
        let url = "rooms/add";

        const form = new FormData();
        const payload = getAllInputValue({ enableValidation: false }) as ObjType;
        if (modalAddFormEditData.uid) {
            payload.uid = modalAddFormEditData.uid;
            url = "rooms/update";
        }

        Object.keys(payload).forEach((key) => {
            var name = key as NameType;
            form.append(key, payload[name]);
        });

        apiRequest({
            method: "POST",
            headers: { "Content-Type": "multipart/form-data" },
            url,
            data: form,
        })
            .then(({ data }) => {
                if (!data.status) {
                    setErrMsg(JSON.stringify(data.data));
                    return;
                }
                // console.log(data);
                handleClose();
                dispatch(getMyChannels());
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (open) {
            document.querySelectorAll(".add-room-form [data-name]").forEach((el) => {
                var selectedEl = el as HTMLInputElement;
                // var attrName = selectedEl.dataset.name;
                // if (attrName === "room_logo") {
                // } else {
                //     selectedEl.value = "";
                // }
                selectedEl.value = "";
            });
        }
        getAllInputValue({ enableValidation: true });
    }, [open]);

    useEffect(() => {
        if (modalAddFormEditData?.uid) {
            ["room_name", "room_description"].forEach((key) => {
                const selectedEl = document.querySelector(
                    `.add-room-form [data-name="${key}"]`
                ) as HTMLInputElement;
                selectedEl.value = modalAddFormEditData[key as "uid"].toString();
            });
            getAllInputValue({ enableValidation: true });
        }
    }, [modalAddFormEditData]);

    return (
        <Modal
            modalHeading="Room"
            modalLabel={modalAddFormEditData?.uid ? "Edit" : "Add"}
            primaryButtonText="Submit"
            secondaryButtonText="Cancel"
            open={open}
            onRequestClose={() => handleClose()}
            onRequestSubmit={() => handleSubmit()}
            isFullWidth={false}
            primaryButtonDisabled={isDataValid ? false : true}
            size="md"
        >
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
            <div className="add-room-form w-full grid grid-cols-1 gap-4">
                <TextInput
                    id=""
                    data-name="room_name"
                    labelText="Name"
                    onChange={() => getAllInputValue({ enableValidation: true })}
                    spellCheck={false}
                    placeholder="Type here..."
                />
                <TextInput
                    id=""
                    data-name="room_description"
                    labelText="Description"
                    onChange={() => getAllInputValue({ enableValidation: true })}
                    spellCheck={false}
                    placeholder="Type here..."
                />
                {/* <FileUploader
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
                /> */}
            </div>
        </Modal>
    );
};
