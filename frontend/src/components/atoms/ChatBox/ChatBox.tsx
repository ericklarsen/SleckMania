import "./ChatBox.css";
import { MessageObjType } from "@/app/stores/slices/messages/messages";
import moment from "moment";

type Props = {
    data: MessageObjType;
};

export const ChatBox: React.FC<Props> = ({ data }) => {
    const appUser = JSON.parse(localStorage.getItem("appUser") as any);

    return (
        <div className={`chatBox ${appUser.uid === data.owner.user_uid ? "is_me" : ""}`}>
            <div className="chatBox__ava"></div>
            <div className="w-fit ">
                <h6 className="chatBox__name">{`${data.owner.first_name} ${data.owner.last_name}`}</h6>
                <div className="chatBox__message">
                    <p className="whitespace-pre-wrap">{data.message_content}</p>
                    <h6 className="chatBox__message_date">
                        {moment(data.created_at).format("hh:mm")}
                    </h6>
                </div>
            </div>
        </div>
    );
};
