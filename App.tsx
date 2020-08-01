import React from 'react';
import {
    Platform,
    SafeAreaView, View, Linking
} from 'react-native';
import Home from "./views/Home";
import {
    ActivityIndicator,
    Appbar,
    Button,
    Dialog,
    Menu,
    Paragraph,
    Portal,
    Provider,
    TextInput
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingScreen from "./views/LoadingScreen";

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const PERSISTENCE_KEY = 'NAME'; // name that will populate 'sender' field in sent messageObjs

const App = () => {
    const [isReady, setIsReady] = React.useState(false);

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

    if (!isReady) {
        return <LoadingScreen />
    }


    return (
        <>
            <SafeAreaView style={{flex: 1}} >
                <Provider>
                <Appbar.Header>
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
                                        AsyncStorage.setItem(PERSISTENCE_KEY, name)
                                        setName(name)
                                    }} /></Dialog.Content>
                                    <Dialog.Actions>
                                        <Button onPress={hideNameDialog}>Done</Button>
                                    </Dialog.Actions>
                                </Dialog>
                            </Portal>
                        </View>

                </Appbar.Header>
                <Home name={name} showNameDialog={showNameDialog}/>
                </Provider>
            </SafeAreaView>
        </>
    );
};


export default App;
