import {DataTable, Text, useTheme} from "react-native-paper";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {StyleSheet, View} from "react-native";
import {LoraNode} from "../store/node/types";

export default () => {
    const nodes = useSelector((state: RootState) => state.nodes)
    const device = useSelector((state: RootState)=> state.ble.activeSensorTag)
    const { colors } = useTheme()
    const [currentTime, setCurrentTime] = useState(new Date().getDate())
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
            if(device) setCurrentTime(new Date().getTime())
        }, 1000)
       return () => clearTimeout(timer)
    })

    const disabledText = () => {
        return !device && {color: colors.disabled}
    }

    const rows = Object.values(nodes).map((node: LoraNode) => {
        return <DataTable.Row key={node.address} style={styles.row}>
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

    })
    return(
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
    )
}

const styles = StyleSheet.create({
    table: {
    },
    header: {
    },
    headerTitle: {
    },
    row: {
    },
    rowCell: {
    }
})
