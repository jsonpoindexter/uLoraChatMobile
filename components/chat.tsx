import React, {Component} from 'react';
import {StyleSheet, Text, View} from "react-native";

export interface MessageObj {
    timestamp: number,
    message: string,
    sender: string
}

const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

interface ChatProps {
    messageObjs: MessageObj[]
}


export default class Chat extends Component<ChatProps, {}> {
    constructor(props: ChatProps) {
        super(props);
    }
    render() {
        const listItems = this.props.messageObjs.map((messageObj) => {
            return <View key={messageObj.timestamp}><Text style={styles.message}>[{formatTime(messageObj.timestamp)}] {"<"}{messageObj.sender}{">"} {messageObj.message} </Text></View>
        })
        return (
            listItems
        )
    }
}

const styles = StyleSheet.create({
    message: {
        fontFamily: "Menlo, Consolas, serif"
    }
});
