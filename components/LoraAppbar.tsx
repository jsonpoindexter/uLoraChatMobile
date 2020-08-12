import React from 'react'
import {Appbar, useTheme} from "react-native-paper";
import {StyleSheet, Text} from "react-native";
import Chat from "../views/Chat";
import {useDispatch, useSelector} from "react-redux";
import {seNavigationState} from "../store/navigation/actions";
import Settings from "../views/Settings";
import Status from "../views/Status";
import {RootState} from "../store";

export const navigationItems: { icon: string, name: string, view: JSX.Element}[]= [
    {
        icon: "chat-outline",
        name: 'home',
        view: <Chat/>
    },
    {
        icon: "access-point",
        name: 'lora-status',
        view: <Status />
    },
    {
        icon: "cog-outline",
        name: 'settings',
        view: <Settings />
    }
]
export default function LoraAppbar() {
    const dispatch = useDispatch()
    const navigationState = useSelector(((state: RootState) => state.navigationState))
    const { colors } = useTheme()
    // Underline current navigation Action
    const actionStyle = (index: number): {} => {
        const selectedStyle =  index === navigationState && {borderBottomWidth: 5,
            borderStyle: "solid",
            borderBottomColor:  colors.disabled}
        return {
            ...styles.action,
            ...selectedStyle
        }
    }

    const actions = navigationItems.map((navigationItem, index) => {
        return <Appbar.Action key={navigationItem.name} style={actionStyle(index)} icon={navigationItem.icon} onPress={ () => dispatch(seNavigationState(index))} />
    })
    return(<Appbar.Header style={styles.header}>
        { actions }
    </Appbar.Header>)
}

const styles = StyleSheet.create({
    header: {
        display: "flex",
        justifyContent: "space-evenly",
        padding: 0
    },
    action: {
        borderRadius: 0,
        flex: 1,
        margin: 0,
        height: "100%"
    },
})
