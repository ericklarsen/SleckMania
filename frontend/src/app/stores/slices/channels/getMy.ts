import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/services/apiRequest";
import { RootState } from "../../store";
import { ChannelsObj } from "./getAll";
import { setErrorMsg } from "../globals/globals";

// here we are typing the types for the state
type InitialState = {
    data: ChannelsObj[];
    loading: boolean;
    error: boolean;
    errorMsg: string;
};

const initialState: InitialState = {
    data: [],
    loading: true,
    error: false,
    errorMsg: "",
};

// This action is what we will call using the dispatch in order to trigger the API call.
export const getMyChannels = createAsyncThunk(
    "channels/getMy",
    async (_data, { rejectWithValue, dispatch }) => {
        const response = await apiRequest({ method: "GET", url: "channels/getMyChannel" });
        if (!response.data.status) {
            dispatch(setErrorMsg(response.data.data));
            return rejectWithValue(response.data.data);
        }
        return response.data.data;
    }
);

export const myChannelsSlice = createSlice({
    name: "myChannels",
    initialState,
    reducers: {
        // leave this empty here
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere, including actions generated by createAsyncThunk or in other slices.
    // Since this is an API call we have 3 possible outcomes: pending, fulfilled and rejected. We have made allocations for all 3 outcomes.
    // Doing this is good practice as we can tap into the status of the API call and give our users an idea of what's happening in the background.
    extraReducers: (builder) => {
        builder
            .addCase(getMyChannels.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMyChannels.fulfilled, (state, { payload }) => {
                // When the API call is successful and we get some data,the data becomes the `fulfilled` action payload
                state.loading = false;
                state.data = payload;
            })
            .addCase(getMyChannels.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = true;
                state.errorMsg = payload as string;
            });
    },
});

export const selectMyChannels = (state: RootState) => state.myChannels;

export default myChannelsSlice.reducer;
