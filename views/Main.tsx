import LoraAppbar, {navigationItems} from "../components/LoraAppbar";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {Linking, Platform, StyleSheet, View} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import LoadingScreen from "./LoadingScreen";
import {ConnectionState} from "../store/ble/reducer";
import {Banner} from "react-native-paper";
import {setName} from "../store/chat/actions";

const PERSISTENCE_KEY = 'NAME'; // name that will populate 'sender' field in sent messageObjs

export default () => {
    const navigationState = useSelector((state: RootState) => state.navigationState)
    const connectionState = useSelector((state: RootState) => state.ble.connectionState)
    const device = useSelector((state: RootState) => state.ble.activeSensorTag)
    const [isReady, setIsReady] = React.useState(false);
    const dispatch = useDispatch()

    const bleStatus = (): string => {
        switch (connectionState) {
            case ConnectionState.CONNECTING:
                return 'Connecting...';
            case ConnectionState.DISCOVERING:
                return 'Discovering...';
            case ConnectionState.CONNECTED:
                return 'Connected';
            case ConnectionState.DISCONNECTED:
            case ConnectionState.DISCONNECTING:
        }
        return 'Searching...';
    }

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
            <Banner visible={connectionState !== ConnectionState.CONNECTED} actions={[]}
                    style={styles.dropDownStatus}> Bluetooth Status: {bleStatus()}</Banner>
            { navigationItems[navigationState].view }
        </View>
    )
}

const styles = StyleSheet.create({
    dropDownStatus: {
        width: '100%',
        // position: "absolute",
        // left: 0,
        // top: 0,
        textAlign: 'center',
        // color: '#e4deff',
        // marginBottom: 5,
        // borderWidth: 2
        backgroundColor: 'lightgrey'
    },
})

