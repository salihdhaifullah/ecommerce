import { createSlice } from '@reduxjs/toolkit'
import { IUserState } from "../../types/state";

const initialState: IUserState = { user: null, error: null, massage: null };

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        SING_UP_USER: (state, action) => {
            state.user = action.payload
        },

        LOGIN_USER: (state, action) => {
            state.user = action.payload
        },

        LOGOUT_USER: (state, action) => {
            state.massage = action.payload
        },

        ERROR: (state, action) => {
            state.error = action.payload
        },
    }
})

export const { SING_UP_USER, LOGIN_USER, LOGOUT_USER, ERROR } = userSlice.actions;
export default userSlice;