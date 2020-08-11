import {combineReducers, compose} from "redux";
import {navigationState} from "./navigation/reducer";
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import {bleSaga} from './saga';
import {ble} from "./ble/reducer";
import {chatReducer} from "./chat/reducer";

const sagaMiddleware = createSagaMiddleware();
// @ts-ignore
const composeEnhancer = (process.env.NODE_ENV !== 'production' && window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']) || compose;

export const rootReducer = combineReducers({
    navigationState,
    ble,
    chatReducer
})
export type RootState = ReturnType<typeof rootReducer>
const store = createStore(rootReducer, {}, composeEnhancer(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(bleSaga);
export default store


