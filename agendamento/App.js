import React from 'react';
import { StatusBar } from 'react-native';
import Routes from './src/routes';
import colors from './colors/colors';

export default function App() {
  return (
    <>
      <StatusBar backgroundColor={colors.primary} barStyle="dark-content" />
      <Routes />
    </>
  );
}
