import React, { Component } from 'react'
import { Text, View, TextInput, StyleSheet, ScrollView } from "react-native";
import { Button, Snackbar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "../../api/firebase";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            visible: false,
            msg: "",
            loading: false,
        }
    }

    login = async () => {
        const { email, password } = this.state;
        let msg = "";

        this.setState({ loading: true });

        if (email != null && password != null) {
            await firebase.auth().signInWithEmailAndPassword(email, password)
                .then(async () => {
                    // Signed in
                    console.log("Login - Usuario Logou Com Sucesso!");
                    this.props.navigation.navigate("Dashboard");

                    this.setState({ loading: false });
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    if (errorCode == "auth/invalid-email") {
                        msg = "Email esta fora do formato padrão ou senha errada!";

                    } else if (errorCode == "auth/email-already-exists") {
                        msg = "Email já esta cadastrado!";

                    } else if (errorCode == "auth/wrong-password") {
                        msg = "Senha invalida, tente novamente!";

                    } else if (errorCode == "auth/user-not-found") {
                        msg = "Usuário não encontrado!";

                    } else if (errorCode == "auth/email-already-in-use") {
                        msg = "Email já esta cadastrado!";

                    } else if (errorCode == "auth/too-many-requests") {
                        msg = "O acesso a esta conta foi temporariamente desativado devido a muitas tentativas de login com falha. Você pode imediatamente restaurá-lo redefinindo sua senha ou você pode tentar novamente mais tarde!";

                    } else {
                        msg = errorMessage;
                    }

                    this.setState({ msg: msg, visible: true, loading: false })
                    console.log(errorCode);
                    console.log(errorMessage);
                    //
                });
        } else {
            this.setState({ msg: "Email ou senha vazios!", visible: true, loading: false })
        }

    };
    onToggleSnackBar = () => { this.setState(!this.state.visible) };

    onDismissSnackBar = () => this.setState({ visible: false });

    render() {

        if (this.state.loading) {
            return (<View
                style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}>
                <Button mode="contained" loading={true} color={'#B98EFF'}>
                    Carregando
                </Button>
            </View>)
        }

        return (
            <View style={styles.container}>
                <ScrollView style={{marginTop: 150}}>
                <View style={{position: 'absolute', left: 25, top: 100}}>
                <Text style={styles.topText}>
                    Bem Vindo
                </Text>
                </View>
                <View style={{marginTop: 200}}>
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
                        marginBottom: 20,
                    }}
                    placeholder="Email"
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
                        borderColor: '#B98EFF'}}
                    placeholder="Senha"
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
                        marginTop: 50,
                    }}
                    mode="contained" 
                    onPress={() => this.login()}
                >
                    <Icon name="send"></Icon> Logar
                </Button>
                </View>
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
                        this.props.navigation.navigate("Register")
                }>
                    <Icon name="user-plus"></Icon> Registrar
                </Button>
                </View>
                </ScrollView>
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
      backgroundColor: '#FFF',
      alignItems: 'center',
      justifyContent: 'center',
    },

    topText: {
        fontSize: 40,
        color: '#A5BBFF',
        fontFamily: 'sans-serif-medium',
        textTransform: 'uppercase'
    },

    input: {
        borderRadius: 30,
        borderWidth: 5,
        backgroundColor: '#fff',
        padding: 18,
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