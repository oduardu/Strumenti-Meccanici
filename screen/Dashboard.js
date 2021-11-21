import * as React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Touchable, Dimensions } from 'react-native'
import { Button, Title, Card } from 'react-native-paper'
import firebase from 'firebase'
import { Video, AVPlaybackStatus } from 'expo-av';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { status: {}, video: null };
  }

  render() {

    const { video, status } = this.state;

    return (
        <View style={styles.container}>
          <View style={{marginTop: 100}}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image 
            style={
              {
                width: 200,
                height: 200,
                borderRadius: 100
              }
            }
            source={require('../assets/favicon.png')}
            />
            <Text style={{fontSize: 20, color: '#A5BBFF', fontWeight: 'bold' }}>STRUMENTI MECCANICI</Text>
            </View>
          </View>
          <View style={styles.buttonSemORow}>
          <Button
            mode="contained"
            icon={'hammer-wrench'} 
            style={{marginBottom: 20}}
            color="#A5BBFF"
            onPress={() =>
              this.props.navigation.navigate("toolList")
            }>
            Lista de Ferramentas
          </Button>
          <Button 
            mode="contained" 
            color="#FF63ED"
            icon={'account-hard-hat'}
            style={{marginBottom: 20}}
            onPress={() =>
              this.props.navigation.navigate("mechanicList")
            }>
            Lista de Mecanicos 
          </Button>
          </View>
          <View style={styles.button}>
          <Button 
            mode="contained" 
            color="#DDBEFE"
            icon={'video'}
            style={{marginBottom: 20, marginRight: '3%'}}
            onPress={() =>
              this.props.navigation.navigate("videos")
            }>
            VIDEOS
          </Button>
          <Button
            mode="contained"
            icon={'account'} 
            style={{marginBottom: 20}}
            color="#B98EFF"
            onPress={() =>
              this.props.navigation.navigate("profile")
            }>
            Profile
          </Button>
          </View>
        </View >
        
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
     marginLeft: 20,
    flexDirection: 'row',
  },
  buttonSemORow: {
    marginLeft: 20,
    marginTop: 185
 },

})