import React from "react";
import {StyleSheet, View} from "react-native";
import {Divider, Headline, Paragraph, Text, TextInput, Title, useTheme} from "react-native-paper";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {setName} from "../store/chat/actions";

export default () => {
    const { colors } = useTheme();
    const dispatch = useDispatch()

    const name = useSelector((state: RootState)=> state.settings.name)

    return(
        <View style={styles.container}>
            <Headline style={styles.headline}>Settings</Headline>
            <View style={styles.nameContainer}>
                <TextInput label={"Name"} error={!name} style={styles.textInput} placeholder={"Enter name"} right={true} value={name} mode={'outlined'} onChangeText={ name => dispatch(setName(name))} />
                {
                    !name && <Text style={{color: colors.error}}>You must enter a name before using Chat</Text>
                }
            </View>
            <Divider style={{width: "100%"}}/>
            <Switch value={enableSynNotification} onValueChange={} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
    },
    headline: {
        marginBottom: 20,
        textAlign: 'center'
    },
    nameContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        // borderWidth: 1,
        // borderColor: 'green'
        // paddingHorizontal: 30,
        // paddingVertical: 15,
    },
    textInput: {
        textAlign: "center",
        width: '70%'
    }
})
