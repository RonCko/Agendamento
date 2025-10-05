import React from 'react';
import { StatusBar } from 'react-native';
import Routes from './src/routes';

export default function App() {
  return (
    <>
      <StatusBar backgroundColor="#fecc00ff" barStyle="dark-content" />
      <Routes />
    </>
  );
}
