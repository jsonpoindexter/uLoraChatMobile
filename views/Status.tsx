import {DataTable, Paragraph} from "react-native-paper";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {View} from "react-native";
import {LoraNode} from "../store/node/types";

export default () => {
    const nodes = useSelector((state: RootState) => state.nodes)
    const rows = Object.values(nodes).map((node: LoraNode) => {
        return <DataTable.Row key={node.address}>
            <DataTable.Cell>
                {node.address}
            </DataTable.Cell>
            <DataTable.Cell numeric>
                {node.timestamp}
            </DataTable.Cell>
            <DataTable.Cell numeric>
                {node.rssi}
            </DataTable.Cell>
        </DataTable.Row>

    })
    return(
        <View>
            {/*<Paragraph>{{ nodes }}</Paragraph>*/}
            <DataTable>

                <DataTable.Header>
                    <DataTable.Title>Node</DataTable.Title>
                    <DataTable.Title numeric>Status</DataTable.Title>
                    <DataTable.Title numeric>RSSI</DataTable.Title>
                </DataTable.Header>
                {
                    rows
                }
            </DataTable>
        </View>

    )
}
