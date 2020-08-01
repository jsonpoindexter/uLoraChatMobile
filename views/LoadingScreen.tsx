import {SafeAreaView, View} from "react-native";
import {ActivityIndicator, Paragraph, Text, useTheme} from "react-native-paper";
import React from "react";

export default function LoadingScreen() {
    const { colors } = useTheme()

    return(
        <SafeAreaView style={{ flex: 1}}>
            <View style={{ marginTop: '10%' }}>
                <Text style={{ textAlign: 'center', fontSize: 40, color: colors.primary}}>uLoraChat</Text>
            </View>
            <View style={{ marginTop: '30%'}}>
                <ActivityIndicator size={50} style={{ }} />
                <Paragraph style={{ textAlign: 'center', marginTop: 15}}>Loading user state</Paragraph>
            </View>
        </SafeAreaView>
    )
}
