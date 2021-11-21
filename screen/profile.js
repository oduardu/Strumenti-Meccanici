import * as React from 'react'
import { StyleSheet, View, Linking, TouchableOpacity, Image, Text, Modal } from 'react-native'
import { Button } from 'react-native-paper'
import firebase from 'firebase'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class profile extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            nome: '',
            email: '',
            cidade: ''
        }
    }

    componentDidMount() {
        this.getData()
    }

    async getData(){
        const id = firebase.auth().currentUser.uid
        return firebase.database().ref('/usuario/' + id).once('value').then((snapshot) => {
            this.setState({
                nome: snapshot.val().nome, 
                email: snapshot.val().email,
                cidade: snapshot.val().cidade,
                })
            })
    }

    render() {
        return (
            <View style={styles.flex}>
                <View style={styles.c}>
                    <Text style={{fontSize: 28, textTransform: 'uppercase' }}>
                        Perfil                        
                    </Text>
                </View>

                <View style={{
                        marginTop: '60%',
                        backgroundColor: '#f2f9f2',
                        height: 200,
                        marginLeft: '5%',
                        width: '90%', 
                        justifyContent: 'center',
                        borderRadius: 2, 
                        shadowColor: '#fff',
                        shadowOffset: '#ffe',
                        shadowOffset: {
                            width: 0,
                            height: 10
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 3.5,
                        elevation: 5
                }}>
                <View style={{marginTop: 20}}>
                    <View style={{flexDirection: 'row', alignItems:'center', marginLeft: '2%'}}>
                    <Icon name="account" color="#B98EFF" size={45} />
                    <Text style={{fontSize: 20}}>
                        Nome: {this.state.nome}
                    </Text>
                    </View>
                </View>
                <View style={{marginTop: 20}}>
                    <View style={{flexDirection: 'row', alignItems:'center', marginLeft: '2%'}}>
                    <Icon name="email" color="#B98EFF" size={45} />
                    <Text style={{fontSize: 20}}>
                        Email: {this.state.email}
                    </Text>
                    </View>
                </View>
                <View style={{marginTop: 20, marginBottom: 20}}>
                    <View style={{flexDirection: 'row', alignItems:'center', marginLeft: '2%'}}>
                    <Icon name="map-marker" color="#B98EFF" size={45} />
                    <Text style={{fontSize: 20}}>
                        Cidade: {this.state.cidade}
                    </Text>
                    </View>
                </View>
                </View>
                <View style={{
                    bottom: '7.5%',
                    position: 'absolute',
                    width: '90%',
                    marginLeft: '5%',
                }}>
                    <Button
                        mode="contained"
                        icon={'arrow-left'} 
                        color="#f94144"
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
    flex: { 
        flex: 1,
    },
    c:{
        backgroundColor: '#f2f9f2',
        height: 100, 
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomEndRadius: 50, 
        borderBottomLeftRadius: 50,  
        shadowColor: '#fff',
        shadowOffset: '#ffe',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.5,
        elevation: 5
    },
    return: {

    }

    //backgroundColor: "#B98EFF",
})