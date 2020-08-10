import {combineReducers} from "redux";
import {navigationState} from "./navigation/reducer";
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import {bleSaga} from './Saga';
import {bleState} from "./ble/reducer";

const sagaMiddleware = createSagaMiddleware();


export const rootReducer = combineReducers({
    navigationState,
    bleState
})

export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
export type RootState = ReturnType<typeof rootReducer>
sagaMiddleware.run(bleSaga);

