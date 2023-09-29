import { selectGlobals, setIsSendMessage } from "@/app/stores/slices/globals/globals";
import { selectMessages } from "@/app/stores/slices/messages/messages";
import { ChatBox } from "@/components/atoms/ChatBox/ChatBox";
import { MessageInput } from "@/components/atoms/MessageInput/MessageInput";
import { Information, User } from "@carbon/icons-react";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const HomePageMessage: React.FC = () => {
    const dispatch = useDispatch();
    const { currentRoom, isSendMessage } = useSelector(selectGlobals);
    const { data: messages } = useSelector(selectMessages);

    useEffect(() => {
        const messagesContainer = document.querySelector(
            '[data-list="messages"]'
        ) as HTMLDivElement;
        if (!messagesContainer.scrollTop || isSendMessage) {
            dispatch(setIsSendMessage(false));
            messagesContainer.scrollTop = messagesContainer?.scrollHeight;
        }
    }, [messages]);

    const generateMessages = () => {
        let prevDate = "";
        return messages.length
            ? messages.map((item, idx) => {
                  const date = moment(item.created_at).format("DD MMMM YYYY");
                  const generateDate = () => {
                      if (date !== prevDate) {
                          prevDate = date;
                          return (
                              <div className="w-full">
                                  <h6 className="text-center pb-4 font-light opacity-30">{date}</h6>
                              </div>
                          );
                      }
                  };
                  return (
                      <React.Fragment key={idx}>
                          {generateDate()}
                          <ChatBox data={item} />
                      </React.Fragment>
                  );
              })
            : "";
    };

    return (
        <>
            <div className="w-full h-[80px] py-4 px-5 bg-[#333333] flex justify-between">
                <div className="w-[50%]">
                    <h5>{currentRoom.room_name}</h5>
                    <h6 className="font-normal mt-1.5">{currentRoom.room_description}</h6>
                </div>
                <div className="flex items-center gap-4 opacity-75">
                    <div className="flex items-center gap-1 cursor-pointer">
                        <User className="w-4 h-4" />
                        <h6 className="font-normal">40</h6>
                    </div>
                    <Information className="w-4 h-4 cursor-pointer" />
                </div>
            </div>
            <div
                data-list="messages"
                className="w-full h-[calc(100%-80px)] overflow-y-auto px-5 py-6 pb-[160px]"
            >
                {generateMessages()}
            </div>

            <MessageInput />
        </>
    );
};
