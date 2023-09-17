import { configureStore } from "@reduxjs/toolkit";
import schemaReducer from "./schemaReducer";
import settingsReducer from "./settingsReducer";


const store = configureStore({
    reducer: {
        schema: schemaReducer,
        settings: settingsReducer
    },
    devTools: true,
})

export default store