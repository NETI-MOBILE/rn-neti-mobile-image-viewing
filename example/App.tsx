import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Content } from './src/components/Content';

export default function App() {
  return (
    <SafeAreaProvider style={styles.provider}>
      <Content />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  provider: {
    flex: 1,
  },
});
