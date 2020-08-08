import React from 'react';
import {
    Platform,
    SafeAreaView, Linking
} from 'react-native';
import Home from "./views/Home";
import {
    DefaultTheme,
    Provider,
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingScreen from "./views/LoadingScreen";
import LoraAppbar, {navigationItems} from "./components/LoraAppbar";

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
    const [navigationState, setNavigationState] = React.useState(navigationItems[0].view)

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
                    <LoraAppbar setNavigationState={setNavigationState} />
                    {navigationState}
                </Provider>
            </SafeAreaView>
        </>
    );
};



export default App;
