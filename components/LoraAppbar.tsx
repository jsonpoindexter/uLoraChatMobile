import React from 'react'
import {Appbar} from "react-native-paper";
import {StyleSheet, Text} from "react-native";
import Chat from "../views/Chat";
import {useDispatch} from "react-redux";
import {setState} from "../store/navigation/actions";
import Settings from "../views/Settings";

export const navigationItems: { icon: string, name: string, view: JSX.Element}[]= [
    {
        icon: "chat-outline",
        name: 'home',
        view: <Chat/>
    },
    {
        icon: "access-point",
        name: 'lora-status',
        view: <Text>Lora Status</Text>
    },
    {
        icon: "cog-outline",
        name: 'settings',
        view: <Settings />
    }
]

export default function LoraAppbar() {
    const dispatch = useDispatch()
    const actions = navigationItems.map((navigationItem, index) => {
        return <Appbar.Action key={navigationItem.name} style={styles.action} icon={navigationItem.icon} onPress={ () => dispatch(setState(index))} />
    })
    return(<Appbar.Header style={{ display: "flex", justifyContent: "space-evenly"}}>
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
    }
})
