import React from 'react';
import {
    SafeAreaView
} from 'react-native';
import {
    DefaultTheme,
} from 'react-native-paper';
import { Provider as PaperProvider } from 'react-native-paper';
import store from "./store";
import {Provider as StoreProvider, useSelector} from "react-redux";
import Main from "./views/Main";

import './utils/notifications'

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
        <PaperProvider theme={theme}>
            <SafeAreaView style={{flex: 1}} >
                <StoreProvider store={store} >
                    <Main />
                </StoreProvider>
            </SafeAreaView>
        </PaperProvider>
    );
};



export default App;
