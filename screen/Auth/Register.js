import React, { Component } from 'react'
import { TextInput, StyleSheet, View, Text, Alert } from 'react-native'
import { Button, Snackbar } from "react-native-paper"
import Icon from "react-native-vector-icons/FontAwesome"
import firebase from "../../api/firebase"

const dataInit = {
    cep: "",
    logradouro: "",
    complemento: "", 
    bairro: "",
    localidade: "" || "Cidade",
    uf: "" || "UF",
    ibge: "",
    gia: "",
    ddd: "",
    siafi: "",
  }

export default class Register extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            nome: null,
            email: null,
            password: null,
            visible: false,
            cidade: "",
            uf: "",
            msg: "",
            cep: "",
            data: dataInit,
        };
    }

    //conexão com api
    url = () => {
        return `http://viacep.com.br/ws/${this.state.cep}/json/`;
      }
    
      buscarCep = () => {
          if(this.state.cep.length < 8) {
              return;
          } else {      
               fetch(this.url(), { mode: 'cors' })
                .then((res) => res.json())
                .then((data) => {
                    if (data.hasOwnProperty("erro")) {
                        this.setState({data: dataInit});
                        this.setState({ msg: "CEP inexistente!", visible: true })
                    } else {
                        this.setState({ data });
                    }
                })
                .catch(err => consolelog(err));
          }
      }

    register = async () => {
        const { nome, email, cidade, uf, password } = this.state;
        let msg = "";
        if (nome != null && email != null && password != null && cidade != null && uf != null) {
            await firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(async (userCredential) => {
                    var usuarioRef = firebase.database().ref("usuario/" + firebase.auth().currentUser.uid);
                    await usuarioRef.set({
                        nome: nome,
                        email: email,
                        cidade: this.state.data.localidade + ' - ' + this.state.data.uf
                    }).catch((error) => {
                        console.log(error);
                    });
                    this.props.navigation.goBack()
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode == "auth/invalid-email") {
                        msg = "Email ou senha invalido!";
                    } else if (errorCode == "auth/email-already-exists") {
                        msg = "Email já esta registrado!";
                    } else if (errorCode == "auth/email-already-in-use") {
                        msg = "Email já esta registrado!";
                    } else {
                        msg = errorMessage;
                    }
                    this.setState({ msg: msg, visible: true })
                    console.log(errorCode);
                    console.log(errorMessage);
                });
        } else {
            this.setState({ msg: "Preencha todos os campos!", visible: true })
        }
    };

    onToggleSnackBar = () => { this.setState(!this.state.visible) };
    onDismissSnackBar = () => this.setState({ visible: false });

    render() {
        return (
            <View style={styles.container}>
                <View style={{top: 140}}>
                <Text style={styles.topText}>
                    insira seus dados:
                </Text>
                </View>
                <View style={{marginTop: 200}}>
                <TextInput
                    dense='true'
                    mode='outlined'
                    style={{
                        borderRadius: 10,
                        borderWidth: 2,
                        backgroundColor: '#fff',
                        padding: 18,
                        textAlignVertical: 'top',
                        width: 300,
                        borderColor: '#B98EFF',
                        marginBottom: 20
                    }}
                    placeholder="Insira o Nome"
                    value={this.state.nome}
                    onChangeText={(text) => this.setState({ nome: text })}
                />
                 <View
                style={{
                    flexDirection: 'row',
                }}>
                <TextInput
                    dense='true'
                    mode='outlined'
                    style={{
                        borderRadius: 10,
                        borderWidth: 2,
                        backgroundColor: '#fff',
                        padding: 18,
                        textAlignVertical: 'top',
                        width: 190,
                        borderColor: '#B98EFF',

                    }}
                    placeholder="Insira o seu CEP"
                    value={this.state.cep}
                    onChangeText={(text) => this.setState({ cep: text })}
                />
                 <Button 
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 90,
                        backgroundColor: '#B98EFF',
                        borderRadius: 10,
                        marginLeft: 10
                    }}
                    mode="contained" 
                    onPress={() => this.buscarCep()}
                >
                    Check
                </Button>
                </View>
                <Text style={{
                    fontSize: 20,
                    color: '#B98EFF'
                }}>{this.state.cep ? this.state.data.localidade+"-"+this.state.data.uf : ""}</Text>
                <TextInput
                    dense='true'
                    keyboardType='email-address'
                    mode='outlined'
                    style={{
                        borderRadius: 10,
                        borderWidth: 2,
                        backgroundColor: '#fff',
                        padding: 18,
                        textAlignVertical: 'top',
                        width: 300,
                        borderColor: '#B98EFF',
                        marginBottom: 10
                    }}
                    placeholder="Insira o Email"
                    value={this.state.email}
                    onChangeText={(text) => this.setState({ email: text })}
                />
                <TextInput
                    dense='true'
                    mode='outlined'
                    style={{
                        borderRadius: 10,
                        borderWidth: 2,
                        backgroundColor: '#fff',
                        padding: 18,
                        textAlignVertical: 'top',
                        width: 300,
                        borderColor: '#B98EFF'
                    }}
                    placeholder="Insira a sua senha"
                    value={this.state.password}
                    secureTextEntry={true}
                    onChangeText={(text) => this.setState({ password: text })}
                />
                </View>
                <View>
                <Button 
                    style={{
                        marginTop: 20,
                        backgroundColor: '#FF63ED',
                        paddingHorizontal: 90,
                        paddingVertical: 10,
                    }}
                    mode="contained" 
                    onPress={() => this.register()}
                >
                    <Icon name="save"></Icon> Registrar
                </Button>
                <View>
                <Button 
                    style={{
                        marginTop: 20,
                        backgroundColor: '#A5BBFF',
                        paddingHorizontal: 70,
                        paddingVertical: 10
                    }}
                    mode="contained" 
                    onPress={() =>
                        this.props.navigation.goBack()
                }>
                    <Icon name="arrow-left"></Icon> Voltar
                </Button>
                </View>
                </View>
                <Snackbar
                    visible={this.state.visible}
                    onDismiss={() => this.onDismissSnackBar()}
                    style={{
                        backgroundColor: '#A5BBFF',
                    }}
                    action={{
                        label: 'Ok',
                        color: '#FFF',
                        onPress: () => {
                        },
                    }}>
                    {this.state.msg}
                </Snackbar>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },

    topText: {
        fontSize: 35,
        color: '#A5BBFF',
        fontFamily: 'sans-serif-medium',
        textTransform: 'uppercase'
    },

    input: {
        backgroundColor: '#fff',
        paddingVertical: 18,
        paddingHorizontal: 24,
        textAlignVertical: 'top',
        width: 300,
      },


    bottomButtons: {
        width: 170,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16
    },
})