import * as React from 'react'
import { StyleSheet, View, Linking, TouchableOpacity, Image, Text, ScrollView } from 'react-native'
import firebase from 'firebase'
import MapView, { Marker } from 'react-native-maps'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class infoMechanic extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: null,
            nome: '',
            nomeFerramenta: '',
            disponibilidade: '',
            imagem: ''
        }
    }

    remover = (id) => {
        var ferramentaRef = firebase.database().ref("ferramenta/" + id);
        ferramentaRef.remove().then(() => {
            this.props.navigation.navigate("toolList")
        }).catch((error) => {
            console.log(error);
        })
    }

    componentDidMount() {
        const id = firebase.auth().currentUser.uid
        var nomeTemp = ""
        var userRef = firebase.database().ref('usuario').child(id).get().then(snapshot => {
            nomeTemp = snapshot.val().nome
            this.setState({
                nome: nomeTemp
            })
        })
        this.setState({
            nomeFerramenta: this.props.route.params.nomeFerramenta,
            id: this.props.route.params.id,
            imagem: this.props.route.params.imagem,
            disponibilidade: this.props.route.params.disponibilidade,
        })
    }

    handleVisible(visible) {
        this.setState({
            modal: visible
        })
    }

    render() {
        let ferramenta = {
            id: this.state.id,
            nomeFerramenta: this.state.nomeFerramenta,
            disponibilidade: this.state.disponibilidade,
            imagem: this.state.imagem,
        }
        return (
            <ScrollView>
                <View style={{
                    flex: 1,
                }}>
                    <View style={{
                        backgroundColor: '#B98EFF',
                        marginBottom: '5%',
                        width: '100%',
                        height: 150,
                        borderBottomEndRadius: 30,
                        borderBottomLeftRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontFamily: 'sans-serif'
                    }}>
                        <Text style={{
                            color: '#fff',
                            fontSize: 35,
                            textTransform: 'capitalize',
                        }}>
                            {this.state.nomeFerramenta}
                        </Text>
                    </View>
                    <View style={styles.itemAlign}>
                        <Image
                            source={{
                                uri: 'data:image/png;base64,'+this.state.imagem
                            }}
                            style={{
                                marginTop: 2,
                                width: '60%',
                                height: 240,
                                borderRadius: 20,
                                marginBottom: '5%',
                            }
                            }
                        />
                    </View>
                    <View style={styles.userInfoSection}>
                        <View style={{
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                color: '#B98EFF',
                                fontSize: 23.5,
                                fontWeight: 'bold',
                                marginBottom: '5%',
                            }}>
                                Dados da Ferramenta:
                            </Text>
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
                                <Icon name="tools" color="#B98EFF" size={45} />
                                <Text style={{ color: "#777777", marginLeft: 10, fontSize: 23.5 }}>{this.state.nomeFerramenta}</Text >
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
                                <Icon name="calendar" color="#B98EFF" size={45} />
                                <Text style={{ color: "#777777", marginLeft: 10, fontSize: 23.5 }}>{this.props.route.params.disponibilidade}</Text >
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.botaozinhoUmDoLadoDoOutro}
                        onPress={
                            () => {this.props.navigation.navigate("Adicionar Ferramenta",  {ferramenta} )}}
                        >
                        
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="account-edit" color="#caffbf" size={40} />
                                <Text
                                    style={{
                                        color: '#777777',
                                        fontSize: 18
                                    }}
                                >
                                    EDITAR
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botaozinhoUmDoLadoDoOutro}
                            onPress={() => this.remover(this.state.id)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="delete" color="#ffadad" size={45} />
                                <Text style={{ color: '#777777', fontSize: 22 }}>
                                    DELETAR
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        marginBottom: 60
                    }}>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalButton: {
        position: 'absolute',
        left: 1,
        bottom: 1,
        width: 45,
    },
    userInfoSection: {
        paddingHorizontal: 30,
        marginBottom: 25,
        marginTop: 20,
        backgroundColor: '#F7FFFA',
        borderRadius: 20,
        margin: 20,
        marginTop: '5%'
    },
    botaozinhoUmDoLadoDoOutro: {
        paddingTop: 20,
        marginBottom: 5,
        marginTop: '5%',
        marginLeft: '5%',
        marginRight: '5%',
        backgroundColor: '#F7FFFA',
        borderRadius: 20,
        width: '40%',
        height: 80
    },
    botaoVisualizarMapa: {
        paddingHorizontal: 30,
        marginBottom: 25,
        marginTop: '20%',
        backgroundColor: '#F7FFFA',
        borderRadius: 20,
        margin: 20,
        height: '7%'
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#FFF",
        height: 200,
        width: '90%',
        borderRadius: 20,
        marginTop: '80%',
        marginLeft: '5%',

    },
    map: {
        width: '100%',
        height: '100%',
    },
    itemAlign: {
        alignItems: "center",
        overflow: 'hidden'
    },
    mapConfirmButton: {
        backgroundColor: "#B98EFF",
        marginLeft: '15%',
        width: '60%',
        borderRadius: 30,
        marginTop: 10,
        position: 'absolute',
        bottom: '10%'
    }
})