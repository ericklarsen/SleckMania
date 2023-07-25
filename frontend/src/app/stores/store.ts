import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import loaderReducer from "./slices/loader/loader";
import globalsReducer from "./slices/globals/globals";

import channelsReducer from "./slices/channels/getAll";
import roomsReducer from "./slices/rooms/getAll";
import messagesReducer from "./slices/messages/messages";

export const store = configureStore({
    reducer: {
        globals: globalsReducer,
        loader: loaderReducer,
        channels: channelsReducer,
        rooms: roomsReducer,
        messages: messagesReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

// export const Wrapper = createWrapper(makeStore, { debug: false });
