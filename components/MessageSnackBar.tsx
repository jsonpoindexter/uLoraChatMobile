import React, {useEffect, useState} from "react";
import {Banner} from "react-native-paper";
import {seNavigationState} from "../store/navigation/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {StyleSheet} from "react-native";

export default () => {
    const dispatch = useDispatch()
    const [showSnackBar, setShowSnackBar] = useState(false)
    const { chatReducer: messageObjs, navigationState} = useSelector((state: RootState) => state)

    useEffect(() => {
        if(navigationState !== 0 && !showSnackBar) setShowSnackBar(true)
    }, [messageObjs])

    // If user goes to chat page remove new msg notification
    useEffect(() => {
        if(navigationState === 0 && showSnackBar) setShowSnackBar(false)
    }, [navigationState])

    return (
            <Banner
                style={styles.banner}
                visible={showSnackBar}
                actions={[
                    {
                        label: 'Read',
                        onPress: () => {
                            setShowSnackBar(false)
                            dispatch(seNavigationState(0))
                        },
                    },
                    {
                        label: 'Ok',
                        onPress: () => {
                            setShowSnackBar(false)
                        },
                    }
                ]}
                icon={'message-outline'}
            >
                New message
            </Banner>
    )
}

const styles = StyleSheet.create({
    banner: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: '100%',
    }
})


