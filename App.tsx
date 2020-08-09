import React from 'react';
import {
    Platform,
    SafeAreaView, Linking
} from 'react-native';
import {
    DefaultTheme,
} from 'react-native-paper';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingScreen from "./views/LoadingScreen";
import {createStore} from "redux";
import {rootReducer, RootState} from "./store";
import {Provider as StoreProvider, useSelector} from "react-redux";
import {Main} from "./views/Main";

const store = createStore(rootReducer)

const theme = {
    ...DefaultTheme,
    dark: true,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
    },
};

const App = () => {
    return (
        <>
            <SafeAreaView style={{flex: 1}} >
                <StoreProvider store={store} >
                    <PaperProvider theme={theme}>
                        <Main />
                    </PaperProvider>
                </StoreProvider>
            </SafeAreaView>
        </>
    );
};



export default App;
