import React from 'react'
import {Appbar, Button, Dialog, Menu, Paragraph, Portal, TextInput} from "react-native-paper";
import {Platform, View} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

interface uLoraAppbarProps {
    PERSISTENCE_KEY: string
}
export default function LoraAppbar(props: uLoraAppbarProps) {
    const [name, setName] = React.useState('') // name that will populate 'sender' field in sent messageObjs

    const [menuVisible, setMenuVisible] = React.useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const [nameDialogVisible, setNameDialogVisible] = React.useState(false);
    const showNameDialog = () => {
        setNameDialogVisible(true)
        closeMenu()
    }
    const hideNameDialog = () => setNameDialogVisible(false);
    return(<Appbar.Header>
        <Appbar.Content title={`uLoraChat`}/>

        <View style={{ display: 'flex', flexDirection: "row", justifyContent: 'flex-end'}}>
            <Menu
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={<Appbar.Action icon={MORE_ICON} onPress={openMenu}/>}>
                <Menu.Item title="Set Name" onPress={showNameDialog} />
            </Menu>
        </View>
        <View style={{ position: 'relative', left: 0, bottom: 0, backgroundColor: 'red'}}>
            <Portal>
                <Dialog visible={nameDialogVisible} onDismiss={hideNameDialog}>
                    <Dialog.Title>Set Name</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>You must set a name before sending messages</Paragraph>
                    </Dialog.Content>
                    <Dialog.Content><TextInput value={name} onChangeText={name=> {
                        AsyncStorage.setItem(props.PERSISTENCE_KEY, name)
                        setName(name)
                    }} /></Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideNameDialog}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>

    </Appbar.Header>)
}
