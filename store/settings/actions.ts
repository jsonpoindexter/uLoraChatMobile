import {SET_NAME, SettingsActionsType} from "./types";

export const setName = (name: string): SettingsActionsType => {
    return {
        type: SET_NAME,
        payload: name
    }
}
