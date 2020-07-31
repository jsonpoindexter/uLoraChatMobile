import React, {useState} from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import {IconButton, TextInput} from "react-native-paper";
import {ScrollView, StyleSheet, Text, View} from "react-native";


export interface MessageObj {
    timestamp: number,
    message: string,
    sender: string
}

const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}:${date.getSeconds().toString().padStart(2,'0')}`
}

interface ChatProps {
    messageObjs: MessageObj[]
    sendBleText: (text: string) => void
    showNameDialog: () => void
    name: string
}

export default function Index(props: ChatProps) {
    const listItems = props.messageObjs.map((messageObj) => {
        return <Text key={messageObj.timestamp} style={styles.chatText}>[{formatTime(messageObj.timestamp)}] {"<"}{messageObj.sender}{">"} {messageObj.message}</Text>
    })

    const [text, setText] = useState('')

    const sendText = () => {
        if (!props.name) {
            props.showNameDialog()
            return
        }
        if (!text) return
        props.sendBleText(text)
        setText('')
    }

    return (
        < View style={styles.chatContainer}>
            <ScrollView>{ listItems }</ScrollView>
            <View style={{ display: "flex", flexDirection: "row"}}>
                <TextInput value={text} style={styles.chatInput} placeholder={`Send message as ${props.name}` }  onChangeText={text => setText(text)} />
                <View style={{ display: "flex", justifyContent: "center", backgroundColor: 'lightgrey'}}>
                    <IconButton icon="send" style={styles.chatSendButton} onPress={()=> sendText()} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    chatContainer: {
        height: '100%',
        display: 'flex',
        flexGrow: 1,
        color: "#ffffff",
        backgroundColor: "#ffffff",
    },
    chatText: {
        fontFamily: "Menlo, Consolas, serif",
        color: "black"
    },
    chatInput: {
        display: "flex",
        flexGrow: 1
    },
    chatSendButton: {
        borderWidth: 1,
        backgroundColor: 'lightgrey'
    }
});
