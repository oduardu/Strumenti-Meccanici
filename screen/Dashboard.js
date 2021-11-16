import * as React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Touchable } from 'react-native'
import { Button, Title } from 'react-native-paper'
import firebase from 'firebase'

export default class Dashboard extends React.Component {

    render() {
        return (
        <View style={styles.container}>
          <View style={{marginTop: 150}}>
            <Image 
            style={
              {
                width: 200,
                height: 200,
                tintColor: '#A5BBFF',
              }
            }
            source={{uri: 'https://img.icons8.com/ios/150/000000/mechanistic-analysis.png'}}
            />
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 20, color: '#A5BBFF', fontWeight: 'bold' }}>MECANICA APP</Text>
            </View>
          </View>
          <View style={styles.button}>
          <Button 
            mode="contained" 
            color="#FF63ED"
            icon={'account-hard-hat'}
            style={{marginBottom: 20}}
            onPress={() =>
              this.props.navigation.navigate("Listagem Mecanico")
            }>
            Lista de Mecanicos 
          </Button>
          <Button
            mode="contained"
            icon={'hammer-wrench'} 
            style={{marginBottom: 20}}
            color="#A5BBFF"
            onPress={() =>
              this.props.navigation.navigate("Listagem Ferramenta")
            }>
            Lista de Ferramentas
          </Button>
          <Button
          mode="contained"
          icon={'arrow-left'} 
          color="#DDBEFE"
          onPress={() => 
            firebase.auth().signOut()
          }
          >
          logout
          </Button>
          </View>
        </View>
        )
}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF',
      alignItems: 'center',
  },

  button: {
    marginTop: 200, marginBottom: 20,
  },

})