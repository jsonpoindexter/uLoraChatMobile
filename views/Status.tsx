import {DataTable} from "react-native-paper";
import React from "react";

export default () => {
    return(
        <DataTable>
            <DataTable.Header>
                <DataTable.Title>Node</DataTable.Title>
                <DataTable.Title>Status</DataTable.Title>
                <DataTable.Title numeric>RSSI</DataTable.Title>
            </DataTable.Header>
        </DataTable>
    )
}
