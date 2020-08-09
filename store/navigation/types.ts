export const SET_STATE = 'SET_NAVIGATION_STATE'

interface SetNavigationState {
    type: typeof  SET_STATE
    payload: number
}

export type NavigationActionTypes = SetNavigationState
