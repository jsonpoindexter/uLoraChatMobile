import {SET_NAME, SettingsActionsType, SettingsState} from "./types";

export  const initialState: SettingsState = {}

export const settings = (
    state = initialState,
    action: SettingsActionsType): SettingsState => {
    switch(action.type) {
        case SET_NAME:
            return { ...state, name: action.payload}
    }
}
