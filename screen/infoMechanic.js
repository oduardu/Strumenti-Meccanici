import React, { Component } from 'react'
import { StyleSheet, View, Linking, TouchableOpacity, Image, Text } from 'react-native'
import firebase from 'firebase'
    
export default class infoMechanic extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: null,
            nome: '',
            nomeMecanico: '',
            telefoneMecanico: '',
            especificacao: '',
            marker: {
                longitude:-52.47247338294983,
                latitude:-26.8855631452057},
            region: {
                longitude:-52.47247338294983,
                latitude:-26.8855631452057,
            }
            }
        }


    componentDidMount() {
        const id = firebase.auth().currentUser.uid
        var nomeTemp = ""
        var userRef = firebase.database().ref('usuario').child(id).get().then(snapshot =>{
            nomeTemp = snapshot.val().nome
            //console.log(nomeTemp)
            this.setState({
                nome: nomeTemp
            })
        })
        var tempVar = this.props.route.params.telefoneMecanico;
        const tempNum = tempVar.replace(/[^\d]+/g,'');
        this.setState({
            nomeMecanico: this.props.route.params.nomeMecanico,
            id: this.props.route.params.id,
            telefoneMecanico: tempNum,
            marker: {
                longitude: this.props.route.params.longitude,
                latitude: this.props.route.params.latitude
            },
            region: {
                longitude: this.props.route.params.longitude,
                latitude: this.props.route.params.latitude
            }
        })
    }
    
    render() {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <TouchableOpacity
                style={{
                    backgroundColor: '#2EAA5C',
                    width: '90%',
                    height: '10%',
                    borderRadius: 20,
                    
                }}
                onPress={()=> Linking.openURL(`https://api.whatsapp.com/send?phone=55`+this.state.telefoneMecanico+`&text=Olá%20` + this.state.nomeMecanico + `, aqui é o` + this.state.nome + `, te encontrei no Mecanica APP, estou precisando de ajuda!`)}
                >
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginLeft: '5%'
                }}>
                <Image 
                source={require('../assets/icon-whatsApp.png')}
                style={{
                    width: 80,
                    height: 80,
                    tintColor: '#FFF'
                }}
                />
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    marginLeft: '10%'
                }}>
                <Text style={{
                    color: '#FFF',
                    fontSize: 26,
                    fontFamily: 'sans-serif'
                }}>
                    WhatsApp!
                </Text>
                </View>
                </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const stylle = StyleSheet.create({

})