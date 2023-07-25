import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { ChannelsObj } from "../channels/getAll";
import { RoomObj } from "../rooms/getAll";

type InitialState = {
    data: MessageObjType[];
};

export type MessageObjType = {
    uid: number;
    user_uid: number;
    message_content: string;
    is_edited: boolean;
    created_at: string;
    updated_at: string;
    owner: {
        user_uid: number;
        first_name: string;
        last_name: string;
    };
};

const initialState: InitialState = {
    data: [],
};

export const messagesSlice = createSlice({
    name: "messages",
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setMessages: (state, action) => {
            state.data = action.payload;
        },
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {},
});

export const { setMessages } = messagesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.messages.value)`
export const selectMessages = (state: RootState) => state.messages;

export default messagesSlice.reducer;