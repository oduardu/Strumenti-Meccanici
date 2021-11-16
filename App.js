import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  Provider as PaperProvider,
  DefaultTheme,
} from "react-native-paper";

const theme = {
  ...DefaultTheme,
    //  dark: true,
  colors: {
      ...DefaultTheme.colors,
      primary: "#6B0515",
      accent: "#B80923",
  },
};

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();
import LoadingScreen from './screen/Auth/LoadingScreen'
import Login from './screen/Auth/Login'
import Register from './screen/Auth/Register'
import Dashboard from './screen/Dashboard'
import addMechanic from './screen/addMechanic'
import mechanicList from './screen/mechanicList'
import toolList from './screen/toolList'
import addTool from './screen/addTool'
import onBoarding from './screen/Auth/onBoarding'
import infoMechanic from './screen/infoMechanic'

export default function App() {
  return (
    <PaperProvider theme={theme}>
    <NavigationContainer>
      
        <Stack.Navigator
            screenOptions={{ headerShown: false, cardStyle: {backgroundColor: '#f2f3f5'} }}>
            <Stack.Screen name="Loading" component={LoadingScreen}/>
            <Stack.Screen name="Dashboard" component={Dashboard}  />
            <Stack.Screen name="Adicionar Mecanico" component={addMechanic}  />
            <Stack.Screen name="Listagem Mecanico" component={mechanicList}  />
            <Stack.Screen name="Adicionar Ferramenta" component={addTool}  />
            <Stack.Screen name="Listagem Ferramenta" component={toolList}  />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="onBoarding" component={onBoarding} />
            <Stack.Screen name="infoMechanic" component={infoMechanic}/>
        </Stack.Navigator>
    </NavigationContainer>
</PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f3f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
