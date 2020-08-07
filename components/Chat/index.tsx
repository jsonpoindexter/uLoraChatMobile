import React, {useState} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {IconButton, TextInput} from "react-native-paper";
import {ScrollView, SectionList, StyleSheet, Text, View} from "react-native";
import {Item} from "react-native-paper/lib/typescript/src/components/List/List";

export enum MessageType {
    ACK = 'ACK'
}
export interface MessageObj {
    timestamp: number,
    message: string,
    sender: string
    type?: MessageType
    ack: boolean
}

const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
}

interface ChatProps {
    messageObjs: MessageObj[]
    sendBleText: (text: string) => void
    showNameDialog: () => void
    name: string
}

export default function Index(props: ChatProps) {

    const chatItem = (messageObj: MessageObj) => {
        return <View style={{ display: 'flex', flexDirection: 'row'}}>
                    <Text key={`${messageObj.timestamp}:${messageObj.message}:${messageObj.sender}` }
                           style={styles.chatItem}>[{formatTime(messageObj.timestamp)}] {"<"}{messageObj.sender}{">"} {messageObj.message}
                    </Text>
            { messageObj.sender === props.name && messageObj.ack && <Text>[{"ACK"}]</Text> }

            </View>
    }

    const [text, setText] = useState('')

    const groupMessageObjs = () => {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

        const groups = props.messageObjs.reduce((groups: { [key: string]: MessageObj[] }, messageObj) => {
            const date = new Date(messageObj.timestamp)
            const dayName = dayNames[date.getDay()]
            const monthName = monthNames[date.getMonth()]
            const dateString = `${dayName}, ${monthName} ${date.getDate()}`
            if (!groups[dateString]) groups[dateString] = []
            groups[dateString].push(messageObj)
            return groups
        }, {})
        return Object.keys(groups).map((date) => {
            return {
                title: date,
                data: groups[date]
            };
        });
    }


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
            <SectionList
                sections={groupMessageObjs()}
                keyExtractor={(item) => item.timestamp.toString()}
                renderItem={({item}) => chatItem(item)}
                renderSectionHeader={({section: {title}}) => (
                    <View style={styles.chatItemHeaderWrapper}><Text
                        style={styles.chatItemHeaderText}>{title}</Text></View>
                )}
            />
            <View style={{display: "flex", flexDirection: "row"}}>
                <TextInput value={text} style={styles.chatInput} placeholder={`Send message as ${props.name}`}
                           onChangeText={text => setText(text)}/>
                <View style={{display: "flex", justifyContent: "center", backgroundColor: 'lightgrey'}}>
                    <IconButton icon="send" style={styles.chatSendButton} onPress={() => sendText()}/>
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
    chatItem: {
        fontFamily: "Menlo, Consolas, serif",
        color: "black",
        display: 'flex',
        flexGrow: 1,
    },
    chatItemHeaderWrapper: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: 'center'
    },
    chatItemHeaderText: {
        fontFamily: "Menlo, Consolas, serif",
        color: "black",
        fontSize: 18,
        paddingVertical: 5,
        paddingHorizontal: 20,
        marginVertical: 10
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
