import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Content } from './src/components/Content';
export default function App() {
    return (React.createElement(SafeAreaProvider, { style: styles.provider },
        React.createElement(Content, null)));
}
const styles = StyleSheet.create({
    provider: {
        flex: 1,
    },
});
