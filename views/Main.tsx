import LoraAppbar, {navigationItems} from "../components/LoraAppbar";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {Linking, Platform, StyleSheet, View} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import LoadingScreen from "./LoadingScreen";
import BleBanner from "../components/BleBanner";
import {setAckNotifications, setName, setSynNotifications} from "../store/settings/actions";
import {MAX_NAME_LENGTH} from "../store/chat/reducer";

export default () => {
    const navigationState = useSelector((state: RootState) => state.navigationState)
    const [isReady, setIsReady] = React.useState(false);
    const dispatch = useDispatch()

    React.useEffect(() => {
        // TODO: move to settings action/reducer?
        const restoreState = async () => {
            try {
                const initialUrl = await Linking.getInitialURL();

                // Only restore name if there's no deep link and we're not on web
                if (Platform.OS !== 'web' && initialUrl == null) {
                    // Saved user's name
                    let savedStateString = await AsyncStorage.getItem('NAME');
                    let name = savedStateString ? savedStateString : undefined;
                    if (name !== undefined) {
                        if(name.length > MAX_NAME_LENGTH) name = name.slice(0, MAX_NAME_LENGTH)
                        dispatch(setName(name));
                    }

                    // Saved users Syn notification preference
                    savedStateString = await AsyncStorage.getItem('SYN_NOTIFICATIONS_ENABLED');
                    const synNotificationsEnabled = savedStateString ? savedStateString : undefined;
                    if (synNotificationsEnabled !== undefined) dispatch(setSynNotifications(synNotificationsEnabled === 'true'))

                    // Saved users Syn notification preference
                    savedStateString = await AsyncStorage.getItem('ACK_NOTIFICATIONS_ENABLED');
                    const ackNotificationsEnabled = savedStateString ? savedStateString : undefined;
                    if (synNotificationsEnabled !== undefined) dispatch(setAckNotifications(ackNotificationsEnabled === 'true'))
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
