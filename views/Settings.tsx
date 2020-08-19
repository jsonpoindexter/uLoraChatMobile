import React from "react";
import {StyleSheet, View} from "react-native";
import {
    DefaultTheme,
    Divider,
    Headline,
    HelperText,
    Subheading,
    Switch,
    TextInput,
    useTheme
} from "react-native-paper";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {setName, setSynNotifications} from "../store/settings/actions";
import {MAX_NAME_LENGTH} from "../store/chat/reducer";

export default () => {
    const { colors } = useTheme();
    const dispatch = useDispatch()



    const synNotifications = useSelector((state: RootState)=> state.settings.synNotifications)
    const name = useSelector((state: RootState)=> state.settings.name || '')
    const showNameLength = <TextInput.Affix text={`${name.length}/${MAX_NAME_LENGTH}`} /> // Show how many chars the user has left before they hit MAX_NAME_LENGTH

    return(
        <View style={styles.container}>
            <Headline style={styles.headline}>Settings</Headline>
            <View style={styles.nameContainer}>
                <TextInput
                    label={"Name"}
                    maxLength={MAX_NAME_LENGTH}
                    error={!name}
                    style={styles.textInput}
                    placeholder={"Enter name"}
                    value={name}
                    mode={'outlined'}
                    right={showNameLength}
                    autoCapitalize={'none'}
                    onChangeText={ name => dispatch(setName(name))} />
                <HelperText type="error" visible={!name}>You must enter a name before using Chat</HelperText>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.switchOptionContainer}>
                <View style={{ display: "flex", flexDirection: "row"}}>
                    <Subheading style={{ paddingRight: 0}}>Enable SYN Notifications</Subheading>
                    {/*<IconButton icon={'information-outline'} size={15} style={{ padding: 0, margin: 0}}/>*/}
                </View>
                <Switch style={{}} value={synNotifications} onValueChange={() => dispatch(setSynNotifications(!synNotifications))} color={colors.primary} />
            </View>
            <Divider style={styles.divider}  />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 0,
        flex: 1,
    },
    headline: {
        marginBottom: 20,
        textAlign: 'center'
    },
    divider: {
      marginVertical: 15,
    },
    nameContainer: {
        display: 'flex',
        alignItems: "center",
    },
    textInput: {
        textAlign: "center",
        width: '70%'
    },
    switchOptionContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: "center",
    },
})
