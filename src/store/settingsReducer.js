import { createSlice } from "@reduxjs/toolkit";

const settings = createSlice({
    initialState: {
        miniMap: false,
        fieldArgs: true,
        connType: "NN"
    },
    name: "settings",
    reducers: {
        toggleMiniMap: (state) => {
            state.miniMap = !state.miniMap
        },
        toggleFieldArgs: (state) => {
            state.fieldArgs = !state.fieldArgs
        },
        toggleConnectionType: (state, data) => {
            state.connType = data.payload
        }
    }
})

export const { toggleMiniMap, toggleFieldArgs, toggleConnectionType } = settings.actions
export default settings.reducer