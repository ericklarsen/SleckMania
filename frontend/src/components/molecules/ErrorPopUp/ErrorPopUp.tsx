import React from "react";
import { ComposedModal, ModalHeader, ModalBody } from "@carbon/react";

type Props = {
    open: boolean;
    message: string;
    callback?: () => void;
};

export const ErrorPopUp: React.FC<Props> = ({ open, message, callback }) => {
    return (
        <div>
            {/* <Modal
                modalHeading="Room"
                modalLabel="Error"
                primaryButtonText="Submit"
                secondaryButtonText="Cancel"
                open={open}
                onRequestClose={() => {}}
                onRequestSubmit={() => {}}
                isFullWidth={false}
                size="md"
            ></Modal> */}

            <ComposedModal
                preventCloseOnClickOutside={true}
                onClose={() => {
                    if (callback) callback();
                }}
                open={open}
            >
                <ModalHeader title={message} />
                <ModalBody />
            </ComposedModal>
        </div>
    );
};
