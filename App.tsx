import React from 'react';
import {
    Platform,
    SafeAreaView, View, Linking, StyleSheet
} from 'react-native';
import Home from "./views/Home";
import {
    Appbar,
    Button, DefaultTheme,
    Dialog,
    Menu,
    Paragraph,
    Portal,
    Provider,
    TextInput,
    BottomNavigation
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingScreen from "./views/LoadingScreen";
import loraAppbar from "./components/uLoraAppbar"
import Navigation from "./components/Navigation";
import LoraAppbar from "./components/LoraAppbar";

const theme = {
    ...DefaultTheme,
    dark: true,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
    },
};

const PERSISTENCE_KEY = 'NAME'; // name that will populate 'sender' field in sent messageObjs

const App = () => {
    const [isReady, setIsReady] = React.useState(false);

    const [name, setName] = React.useState('') // name that will populate 'sender' field in sent messageObjs

    React.useEffect(() => {
        const restoreState = async () => {
            try {
                const initialUrl = await Linking.getInitialURL();

                if (Platform.OS !== 'web' && initialUrl == null) {
                    // Only restore name if there's no deep link and we're not on web
                    const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
                    const name = savedStateString ? savedStateString : undefined;

                    if (name !== undefined) {
                        setName(name);
                    }
                }
            } finally {
                setIsReady(true);
            }
        };

        if (!isReady) {
            restoreState();
        }
    }, [isReady]);

    if (!isReady) return <LoadingScreen />

    return (
        <>
            <SafeAreaView style={{flex: 1}} >
                <Provider theme={theme}>
                    <LoraAppbar PERSISTENCE_KEY={PERSISTENCE_KEY} />
                    <Home name={name} showNameDialog={showNameDialog}/>
                </Provider>
            </SafeAreaView>
        </>
    );
};



export default App;
