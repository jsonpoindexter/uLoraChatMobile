import {combineReducers} from "redux";
import {navigationState} from "./navigation/reducer";

export const rootReducer = combineReducers({
    navigationState
})

export type RootState = ReturnType<typeof rootReducer>
