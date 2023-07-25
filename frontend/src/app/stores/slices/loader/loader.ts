import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const initialState = {
    show: false,
};

export const loaderSlice = createSlice({
    name: "loader",
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        addToLoader: (state, action) => {
            state.show = action.payload;
        },
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {},
});

export const { addToLoader } = loaderSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.loader.value)`
export const selectLoader = (state: RootState) => state.loader;

export default loaderSlice.reducer;