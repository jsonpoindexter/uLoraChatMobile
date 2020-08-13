export const SET_NAME = 'SET_NAME'

export interface SettingsState {
    name?: string,
}
interface SetNameAction {
    type: typeof SET_NAME
    payload: string
}

export type SettingsActionsType = SetNameAction
