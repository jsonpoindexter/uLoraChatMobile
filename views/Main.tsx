import LoraAppbar from "../components/LoraAppbar";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {Linking, Platform, View} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import LoadingScreen from "./LoadingScreen";
import { navigationItems} from "../components/LoraAppbar";

const PERSISTENCE_KEY = 'NAME'; // name that will populate 'sender' field in sent messageObjs

export const Main = () =>{
    // const [navigationState, setNavigationState] = React.useState(useSelector((state: RootState)=> state.navigationState))
    const navigationState = useSelector((state: RootState) => state.navigationState)
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
    return(
        <View>
            <LoraAppbar />
            { navigationItems[navigationState].view}
        </View>
    )
}
