import * as React from 'react'
import { StyleSheet, View, Linking, TouchableOpacity, Image, Text, Modal, ScrollView } from 'react-native'
import { Button, Paragraph } from 'react-native-paper'
import firebase from 'firebase'
import MapView, { Marker } from 'react-native-maps'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class infoMechanic extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: null,
            modal: false,
            nome: null,
            imagem: null,
            nomeMecanico: null,
            telefoneMecanico: null,
            especificacao: null,
            path: null,
            marker: {
                longitude: -52.47247338294983,
                latitude: -26.8855631452057
            },
            region: {
                longitude: -52.47247338294983,
                latitude: -26.8855631452057,
            },
            mecanicoEdit: [],
        }
    }

    remover = (id) => {
        var mecanicoRef = firebase.database().ref("mecanico/" + id)

        mecanicoRef.remove().then(() => {
            this.props.navigation.navigate("mechanicList")
        }).catch((error) => {
            console.log(error);
        })

    };

    componentDidMount() {
        const id = firebase.auth().currentUser.uid
        var nomeTemp = ""
        var userRef = firebase.database().ref('usuario').child(id).get().then(snapshot => {
            nomeTemp = snapshot.val().nome
            this.setState({
                nome: nomeTemp
            })
        })
        
        var tempVar = this.props.route.params.telefoneMecanico
        const tempNum = tempVar.replace(/[^\d]+/g, '')
        this.setState({
            nomeMecanico: this.props.route.params.nomeMecanico,
            id: this.props.route.params.id,
            especificacao: this.props.route.params.especificacao,
            imagem: this.props.route.params.imagem,
            telefoneMecanico: tempNum,
            marker: this.props.route.params.marker,
            region: {
                longitude: this.props.route.params.marker.longitude,
                latitude: this.props.route.params.marker.latitude
            },
        })

    }

    handleVisible(visible) {
        this.setState({
            modal: visible
        })
    }


    render() {
        let mecanico = {
            id: this.state.id,
            nomeMecanico: this.state.nomeMecanico,
            especificacao: this.state.especificacao,
            marker: this.state.marker,
            telefoneMecanico: this.state.telefoneMecanico,
            imagem: this.state.imagem,
        }
        return (
            <ScrollView>
            <View style={{
                flex: 1,
            }}>

                <Modal
                    style={styles.centeredView}
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modal}
                >
                    <View style={styles.itemAlign}>
                        <MapView style={styles.map}
                            initialRegion={{
                                latitude: this.state.region.latitude,
                                longitude: this.state.region.longitude,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0,
                            }}
                            showsUserLocation={true}>
                            {

                                this.state.marker &&
                                <Marker coordinate={this.state.marker}
                                />
                            }
                        </MapView>
                        <Button
                            style={styles.mapConfirmButton}
                            mode="contained"
                            onPress={() => this.handleVisible(!this.state.modal)}
                        >
                            Voltar
                        </Button>
                    </View>

                </Modal>

                <View style={{
                    backgroundColor: '#B98EFF',
                    marginBottom: '5%',
                    width: '100%',
                    height: 130,
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
                        {this.state.nomeMecanico}
                    </Text>
                </View>
                <View style={styles.itemAlign}>
                    <Image
                        source={{
                            uri: 'data:image/png;base64,'+this.state.imagem
                        }}
                        style={{
                            marginTop: 12,
                            borderRadius: 20,
                            width: '60%',
                            height: 240,
                            borderColor: '#B98EFF',
                            borderWidth: 2
                        }}
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
                            Dados do Mecânico:
                        </Text>
                    </View>
                    <View>
                        <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
                            <Icon name="clipboard-list" color="#B98EFF" size={45} />
                            <Text style={{ color: "#777777", marginLeft: 10, fontSize: 23.5 }}>{this.state.especificacao}</Text >
                        </View>

                        <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
                            <Icon name="phone" color="#B98EFF" size={45} />
                            <Text style={{ color: "#777777", marginLeft: 10, fontSize: 23.5 }}>{this.props.route.params.telefoneMecanico}</Text >
                        </View>

                        <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
                            <Icon name="map-marker-distance" color="#B98EFF" size={45} />
                            <Paragraph style={{ color: "#7c7aff", fontSize: 18, fontFamily: 'sans-serif', textTransform: 'uppercase' }} onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${this.state.marker.latitude},${this.state.marker.longitude}`)}> Traçar rota</Paragraph>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.botaoVisualizarMapa}
                    onPress={() => this.handleVisible(!this.state.modal)}
                >
                    <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', }}>
                        <Icon name="map-marker" color="#B98EFF" size={45} />
                        <Text
                            style={{
                                color: '#777777',
                                fontSize: 22
                            }}
                        >
                            VISUALIZAR O MAPA
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        backgroundColor: '#2EAA5C',
                        width: '90%',
                        height: '7%',
                        borderRadius: 20,
                        margin: 20,
                        marginBottom: 5
                    }}
                    onPress={() => Linking.openURL(`https://api.whatsapp.com/send?phone=55` + this.state.telefoneMecanico + `&text=Olá%20` + this.state.nomeMecanico + `, aqui é o ` + this.state.nome + `, te encontrei no Strumenti Meccanici, estou precisando de ajuda!`)}
                >
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginLeft: '5%'
                    }}>
                        <Image
                            source={require('../assets/icon-whatsApp.png')}
                            style={{
                                width: 60,
                                height: 60,
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
                <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={styles.botaozinhoUmDoLadoDoOutro}
                onPress={
                    () => {this.props.navigation.navigate("Adicionar Mecanico", { mecanico } )}}
                >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="delete" color="#ffadad" size={45} />
                <Text style={{color: '#777777',fontSize: 22}}>
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
        marginTop: 10
    },
    modalButton: {
        position: 'absolute',
        left: 1,
        bottom: 1,
        width: 45,
    },
    userInfoSection: {
        paddingHorizontal: 30,
        marginBottom: 10,
        marginTop: 20,
        backgroundColor: '#F7FFFA',
        borderRadius: 20,
        margin: 20,
        marginTop: '5%'
    },
    botaoVisualizarMapa: {
        paddingTop: 20,
        paddingHorizontal: 30,
        marginBottom: 5,
        marginTop: '5%',
        backgroundColor: '#F7FFFA',
        borderRadius: 20,
        margin: 20,
        height: 80
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