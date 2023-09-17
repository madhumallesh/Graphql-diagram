import { createSlice } from "@reduxjs/toolkit";
import { demoGql } from "../Converter";

const schemaSlice = createSlice({
    name: "schema",
    initialState: {
        schemaString: !localStorage.getItem("schema") ? demoGql : localStorage.getItem("schema")
    },
    reducers: {
        updateSchema: (state, data) => {
            if (state.schemaString !== data.payload) {
                state.schemaString = data.payload
            }
        }
    }
})

export const { updateSchema } = schemaSlice.actions
export default schemaSlice.reducer