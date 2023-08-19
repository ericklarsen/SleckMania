import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/services/apiRequest";
import { RootState } from "../../store";
import { RoomObj } from "../rooms/getAll";

// here we are typing the types for the state
type InitialState = {
    data: ChannelsObj[];
    loading: boolean;
    error: boolean;
    errorMsg: string;
};

export type ChannelsObj = {
    uid: number;
    channel_logo?: string;
    channel_name?: string;
    channel_description?: string;
    join?: boolean;
    created_at?: string;
    updated_at?: string;
    rooms?: RoomObj[];
};

const initialState: InitialState = {
    data: [],
    loading: false,
    error: false,
    errorMsg: "",
};

// This action is what we will call using the dispatch in order to trigger the API call.
export const getAllChannels = createAsyncThunk("channels/getAll", async () => {
    const response = await apiRequest({ method: "GET", url: "channels/getAllChannel" });
    return response.data.data;
});

export const channelsSlice = createSlice({
    name: "channels",
    initialState,
    reducers: {
        // leave this empty here
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere, including actions generated by createAsyncThunk or in other slices.
    // Since this is an API call we have 3 possible outcomes: pending, fulfilled and rejected. We have made allocations for all 3 outcomes.
    // Doing this is good practice as we can tap into the status of the API call and give our users an idea of what's happening in the background.
    extraReducers: (builder) => {
        builder
            .addCase(getAllChannels.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllChannels.fulfilled, (state, { payload }) => {
                // When the API call is successful and we get some data,the data becomes the `fulfilled` action payload
                state.loading = false;
                state.data = payload;
            })
            .addCase(getAllChannels.rejected, (state) => {
                state.loading = false;
                state.error = true;
            });
    },
});

export const selectChannels = (state: RootState) => state.channels;

export default channelsSlice.reducer;
