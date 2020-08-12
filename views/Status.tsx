import {Button, DataTable, Dialog, Paragraph, Portal, Text, TouchableRipple, useTheme} from "react-native-paper";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {Pressable, StyleSheet, TouchableHighlight, TouchableWithoutFeedback, View} from "react-native";
import {LoraNode} from "../store/node/types";
import {removeNode} from "../store/node/actions";

export default () => {
    const dispatch = useDispatch()
    const [isDialogVisible, setDialogVisible] = useState(false)
    const [nodeAddress, setNodeAddress] = useState('') // The address of the node to delete if user clicks Ok in delete dialog
    const nodes = useSelector((state: RootState) => state.nodes)
    const device = useSelector((state: RootState) => state.ble.activeSensorTag)
    const {colors} = useTheme()
    const [currentTime, setCurrentTime] = useState(new Date().getTime())
    const status = (timestamp: number): string => {
        // TODO: implement status as Excellent/Good/Poor/Bad exc as an average of messages per min or something
        const currentTimeConstrained = timestamp > currentTime ? timestamp : currentTime // currentTime should never be less than timestamp of node SYN message bc that will result in a negative status
        const diff = Math.round((currentTimeConstrained - timestamp) / 1000)
        // if (diff <= 15) return "GOOD"
        // if (diff > 15) return "OK"
        // else return "BAD"
        return diff + "s"
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            if (device) setCurrentTime(new Date().getTime())
        }, 1000)
        return () => clearTimeout(timer)
    })

    const disabledText = () => {
        return !device && {color: colors.disabled}
    }

    const showDialog = (address: string) => {
        setNodeAddress(address)
        setDialogVisible(true)
    }

    const hideDialog = () => {
        setNodeAddress('')
        setDialogVisible(false)
    }

    const deleteNode = () => {
        dispatch(removeNode(nodeAddress))
        setDialogVisible(false)
    }

    const rows = Object.values(nodes).map((node: LoraNode) => {
        return <Pressable key={node.address} onLongPress={() => showDialog(node.address)} android_ripple={{ color: colors.primary}}>
                <DataTable.Row style={styles.row}>
                    <DataTable.Cell style={styles.rowCell}>
                        <Text style={disabledText()}>{node.address}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.rowCell} numeric>
                        <Text style={disabledText()}>{status(node.timestamp)}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.rowCell} numeric>
                        <Text style={disabledText()}>{node.rssi}</Text>
                    </DataTable.Cell>
                </DataTable.Row>
        </Pressable>
    })
    return (
        <View style={{flex: 1}}>
            <DataTable style={{}}>
                <DataTable.Header style={styles.header}>
                    <DataTable.Title style={styles.headerTitle}>Node</DataTable.Title>
                    <DataTable.Title style={styles.headerTitle} numeric>Status</DataTable.Title>
                    <DataTable.Title style={styles.headerTitle} numeric>RSSI</DataTable.Title>
                </DataTable.Header>
                {
                    rows
                }
            </DataTable>
            <Portal>
                <Dialog visible={isDialogVisible} onDismiss={hideDialog}>
                    <Dialog.Title>Delete Node</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Delete nodes will appear again after receiving the next SYN packet</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions style={styles.dialogActions}>
                        <Button style={{ marginRight: 25}} onPress={hideDialog}>Cancel</Button>
                        <Button style={{ marginRight: 15}} onPress={deleteNode}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </View>

    )
}

const styles = StyleSheet.create({
    table: {},
    header: {},
    headerTitle: {},
    row: {
        // backgroundColor: "green"
    },
    rowCell: {},
    dialogActions: {
        display: 'flex',
    }
})
