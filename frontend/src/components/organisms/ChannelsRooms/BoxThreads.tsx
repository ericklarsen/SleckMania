import { UserAva } from "@/components/atoms/UserAva/UserAva";
import { Reply, Send } from "@carbon/icons-react";
import { TextArea } from "@carbon/react";
import React, { useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";

export const BoxThreads: React.FC = () => {
    const [isOpenReply, setIsOpenReply] = useState(false as boolean);
    const ref = useClickAway(() => {
        setIsOpenReply(false);
    });

    return (
        <div className="w-full flex gap-3" ref={ref}>
            <UserAva name="Erick" className="mt-1" />
            <div className="w-full pt-2.5 bg-tertiary mb-5">
                <div className="flex items-center gap-5 px-4">
                    <div className="flex items-center gap-4">
                        <h6 className="font-medium">Erick Larsens</h6>
                    </div>
                    <h6 className="font-light text-xs opacity-50">19/04/2023 15:00</h6>
                </div>
                <div className="pt-2 pb-4 px-4">
                    <p className="text-sm">
                        just so we both know and maybe one to put in paymo? will leave for you to
                        decide Kora. For the Disney consumer app Magic Ahoy! +, we will have
                        separate Terms and Conditions from the original Magic Ahoy! We will need
                        this on a different web page to the other ones. I don't have the final
                        version yet, however can we please set up that page and provide me with the
                        url so Becky can fill out her OLAF?
                    </p>
                </div>

                <div className="w-full bg-[#202020] ">
                    <div className="w-full flex gap-3 p-4">
                        <UserAva name="Erick" className="" />
                        <div className="w-full">
                            <div className="flex items-center gap-5">
                                <div className="flex items-center gap-4">
                                    <h6 className="font-medium">Erick Larsens</h6>
                                </div>
                                <h6 className="font-light text-xs opacity-50">19/04/2023 15:00</h6>
                            </div>
                            <div className="">
                                <p className="text-sm">
                                    just so we both know and maybe one to put in paymo? will leave
                                </p>
                            </div>
                        </div>
                    </div>
                    {isOpenReply ? (
                        <div className="w-full relative">
                            <TextArea
                                id="message"
                                labelText=""
                                placeholder="Type here..."
                                style={{ resize: "unset", paddingRight: "50px" }}
                                onKeyDown={(e) => {
                                    if (!e.shiftKey && e.code === "Enter") {
                                        e.preventDefault();
                                        // handleSendMessage();
                                    }
                                }}
                                // onInput={() => handleTyping()}
                            />
                            <div
                                // onClick={() => handleSendMessage()}
                                className="p-2 pr-0 absolute bottom-2 right-2 bg-[#262626] cursor-pointer"
                            >
                                <Send className="w-6 h-6 " />
                            </div>
                        </div>
                    ) : (
                        <div
                            className="flex gap-1.5 items-center opacity-50 px-4 py-2 hover:opacity-100 cursor-pointer"
                            onClick={() => setIsOpenReply(true)}
                        >
                            <Reply />
                            <p className="text-sm font-light">Reply</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
