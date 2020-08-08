import React, {Dispatch, SetStateAction} from 'react'
import {Appbar} from "react-native-paper";
import {StyleSheet, Text} from "react-native";
import Home from "../views/Home";



interface uLoraAppbarProps {
    setNavigationState: Dispatch<SetStateAction<JSX.Element>>
}

export const navigationItems: { icon: string, name: string, view: JSX.Element}[]= [
    {
        icon: "chat-outline",
        name: 'home',
        view: <Home name={"foo"}/>
    },
    {
        icon: "access-point",
        name: 'lora-status',
        view: <Text>Lora Status</Text>
    },
    {
        icon: "cog-outline",
        name: 'settings',
        view: <Text>Settings</Text>
    }
]

export default function LoraAppbar(props: uLoraAppbarProps) {


    const actions = navigationItems.map(navigationItem => {
        return <Appbar.Action key={navigationItem.name} style={styles.action} icon={navigationItem.icon} onPress={ () => props.setNavigationState(navigationItem.view)} />
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
