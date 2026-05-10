import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { RootNavigator } from './src/navigation';

export default function App() {
  return (
    <>
      <RootNavigator />
      <StatusBar style="dark" />
    </>
  );
}
