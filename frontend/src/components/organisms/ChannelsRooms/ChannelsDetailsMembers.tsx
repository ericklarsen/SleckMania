import React, { useEffect } from "react";
import {
    ComposedModal,
    ModalBody,
    ModalHeader,
    ContainedList,
    ContainedListItem,
    ExpandableSearch,
} from "@carbon/react";
import { useAppDispatch, useAppSelector } from "@/app/stores/hooks";
import { getChannelMembers, selectChannelMembers } from "@/app/stores/slices/channels/getMembers";
import { selectGlobals } from "@/app/stores/slices/globals/globals";
import { getMyChannels } from "@/app/stores/slices/channels/getMy";
import { TrashCan } from "@carbon/icons-react";

type Props = {
    open: boolean;
    onOpen: (param: boolean) => void;
};

export const ChannelsDetailsMembers: React.FC<Props> = ({ open, onOpen }) => {
    const dispatch = useAppDispatch();
    const { currentChannel } = useAppSelector(selectGlobals);
    const { data: members } = useAppSelector(selectChannelMembers);

    useEffect(() => {
        console.log(currentChannel.uid);
        if (open) {
            dispatch(getChannelMembers(currentChannel.uid));
            // dispatch(getMyChannels());
        }
    }, [open]);

    useEffect(() => {
        console.log(members);
    }, [members]);

    return (
        <ComposedModal open={open} onClose={() => onOpen(false)}>
            <ModalHeader label="List" title="Members" />
            <ModalBody className="max-h-[400px] min-h-[400px] overflow-y-auto">
                <ContainedList
                    label="Search"
                    kind="on-page"
                    action={
                        <ExpandableSearch
                            placeholder="Filterable search"
                            value={""}
                            onChange={() => {}}
                            closeButtonLabelText="Clear search input"
                            size="lg"
                        />
                    }
                >
                    {members.length
                        ? members.map((item, idx) => (
                              <ContainedListItem key={idx}>
                                  <div className="w-full flex items-center  gap-3">
                                      <div className="flex items-center gap-3 flex-1">
                                          <div className="w-8 h-8 rounded-full bg-gray-600"></div>
                                          <h6 className="font-normal">
                                              {`${item.first_name} ${item.last_name} - `}
                                              <span className="opacity-50">{item.email}</span>
                                          </h6>
                                      </div>
                                      <TrashCan className="cursor-pointer " />
                                  </div>
                              </ContainedListItem>
                          ))
                        : ""}
                </ContainedList>
            </ModalBody>
        </ComposedModal>
    );
};
