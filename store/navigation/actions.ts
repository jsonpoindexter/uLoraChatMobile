import {NavigationActionTypes, SET_STATE} from "./types";

export const setState = (index: number): NavigationActionTypes => {
    return {
        type: SET_STATE,
        payload: index
    }
}


