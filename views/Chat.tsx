import React, {useEffect, useRef} from 'react'
import {StyleSheet, View, Text, SafeAreaView} from 'react-native'
import {useState} from 'react';
import {Button, IconButton, TextInput, useTheme} from "react-native-paper";
import {SectionList,} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {NodeMessageType, UserMessageObj} from "../store/chat/types";
import {seNavigationState} from "../store/navigation/actions";
import { stringToBase64} from "../utils/ble";
import {addMessage} from "../store/chat/actions";
import {MAX_MESSAGE_LENGTH} from "../store/chat/reducer";

const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
}

export default () => {
    const dispatch = useDispatch()
    const {colors} = useTheme()
    const messageObjs = useSelector((state: RootState) => state.chatReducer.messageObjs)
    useEffect(() => {
            setGroupedMessageObjs(groupMessageObjs())
    }, [messageObjs])
    const name = useSelector((state: RootState) => state.settings.name)
    const bleDevice = useSelector((state: RootState) => state.ble.activeSensorTag)
    const sectionListRef  = useRef<null | SectionList<UserMessageObj>>(null);
    const [text, setText] = useState('1232341234123412341234213412342343412341234123412343452345234523452345')
    const updateText = (text: string) => text.length <= MAX_MESSAGE_LENGTH && setText(text)
    const chatItem = (messageObj: UserMessageObj) => {
        return <View style={styles.chatItemsContainer}>
            <Text key={`${messageObj.timestamp}:${messageObj.message}:${messageObj.sender}`}
                  style={styles.chatItem}>[{formatTime(messageObj.timestamp)}] {"<"}{messageObj.sender}{">"} {messageObj.message}
            </Text>
            {messageObj.sender === name && messageObj.ack && <Text>[{"ACK"}]</Text>}
        </View>
    }
    const groupMessageObjs = () => {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

        const groups = messageObjs.reduce((groups: { [key: string]: UserMessageObj[] }, messageObj) => {
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
    const [groupedMessageObjs, setGroupedMessageObjs] = useState(groupMessageObjs())
    useEffect(() => {
       scrollToSection()
    }, [groupedMessageObjs])


    const sendText = () => {
        if (!name) {
            dispatch(seNavigationState(2)) // TODO: make enum or string instead of index to make more clear
            return
        }
        if (!text || !bleDevice) return
        if (text.length > MAX_MESSAGE_LENGTH) return
        const messageObj: UserMessageObj = {
            type: NodeMessageType.MSG,
            timestamp: new Date().getTime(),
            message: text,
            sender: name,
            ack: false
        }
        try {
            bleDevice.writeCharacteristicWithResponseForService('6E400001-B5A3-F393-E0A9-E50E24DCCA9E',
                '6E400002-B5A3-F393-E0A9-E50E24DCCA9E', stringToBase64(JSON.stringify(messageObj))
            )
            dispatch(addMessage(messageObj)) // TODO: remove this and rely on ble sending msg back?
        }catch(err) {
            console.log(err)
        }
        setText('')
    }

    const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout>()
    const scrollToSection = () => {
        scrollTimeout && clearTimeout(scrollTimeout)
        const timeout = setTimeout(() => {
            if (!groupedMessageObjs.length) return
            sectionListRef?.current?.scrollToLocation({
                animated: true,
                sectionIndex: -1,
                itemIndex: groupedMessageObjs[groupedMessageObjs.length - 1].data.length - 1,
                viewPosition: 0,
            });
        }, 100)
        setScrollTimeout(timeout)
    };

    return (
        <View style={styles.chatContainer}>
            <SectionList
                style={styles.sectionList}
                sections={groupedMessageObjs}
                keyExtractor={(item) => item.timestamp.toString()}
                renderItem={({item}) => chatItem(item)}
                ref={sectionListRef}
                onScrollToIndexFailed={(err) => {
                    console.log('[onScrollToIndexFailed]:', err)
                    setTimeout(() => scrollToSection())
                }}
                renderSectionHeader={({section: {title}}) => (
                    <View style={styles.chatItemHeaderWrapper}><Text
                        style={styles.chatItemHeaderText}>{title}</Text></View>
                )}
            />
            <View style={styles.chatInputContainer}>
                <TextInput value={text} style={styles.chatInput} placeholder={`Send message as ${name}`}
                           onChangeText={text => setText(text)}/>
                <View style={{...styles.chatSendButtonContainer, borderBottomColor: colors.primary}}>
                    <IconButton icon="send" style={styles.chatSendButton} onPress={() => sendText()}/>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
    },
    chatItemsContainer: {
        flex: 1,
        flexDirection: 'row',

    },
    chatItem: {
        flex: 1,
        fontFamily: "Menlo, Consolas, serif",
        color: "black",
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
    chatInputContainer: {
        // position: "absolute",
        // bottom: 0,
        // left: 0,
        marginTop: 15,
        // borderTopColor: 'rgba(255,0,0,.5)',
        // borderTopWidth: 15,
        width: '100%',
        display: "flex",
        flexDirection: "row",
    },
    chatInput: {
        display: "flex",
        flexGrow: 1,
        flexShrink: 1,
    },
    chatSendButtonContainer: {
        display: "flex",
        flexShrink: 0,
        justifyContent: "center",
        backgroundColor: 'white'
    },
    chatSendButton: {
        borderWidth: 1,
    },
    sectionList: {

    }
});
