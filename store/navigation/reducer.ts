import {NavigationActionTypes, SET_STATE} from "./types";

export const initialState: number = 0;

export const navigationState = (
    state: number = initialState,
    action: NavigationActionTypes
): number => {
    switch(action.type) {
        case SET_STATE:
            return action.payload
        default: return state
    }
}
