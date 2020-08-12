import LoraAppbar, {navigationItems} from "../components/LoraAppbar";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {Linking, Platform, StyleSheet, View} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import LoadingScreen from "./LoadingScreen";
import {setName} from "../store/chat/actions";
import BleBanner from "../components/BleBanner";

const PERSISTENCE_KEY = 'NAME'; // name that will populate 'sender' field in sent messageObjs

export default () => {
    const navigationState = useSelector((state: RootState) => state.navigationState)
    const [isReady, setIsReady] = React.useState(false);
    const dispatch = useDispatch()

    React.useEffect(() => {
        const restoreState = async () => {
            try {
                const initialUrl = await Linking.getInitialURL();

                if (Platform.OS !== 'web' && initialUrl == null) {
                    // Only restore name if there's no deep link and we're not on web
                    const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
                    const name = savedStateString ? savedStateString : undefined;

                    if (name !== undefined) {
                        dispatch(setName(name));
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

    return(
        <View style={{ height: '100%'}}>
            <LoraAppbar />
            <BleBanner/>
            { navigationItems[navigationState].view }
        </View>
    )
}
