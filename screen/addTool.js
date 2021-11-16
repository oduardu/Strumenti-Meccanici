import * as React from 'react'
import { Text, View, StyleSheet, Platform, Image, TextInput, TouchableOpacity } from 'react-native'
import { Avatar, Button, Icon } from 'react-native-paper'
import firebase from 'firebase'
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default class addTool extends React.Component {
    constructor(props) {
        super(props);

        const paramsValidos = this.props.route.params != undefined && this.props.route.params.ferramenta != undefined;

        this.state = {
            id: paramsValidos ? this.props.route.params.ferramenta.id : "",
            nomeFerramenta: paramsValidos ? this.props.route.params.ferramenta.nomeFerramenta : '',
            disponibilidade: paramsValidos ? this.props.route.params.ferramenta.disponibilidade : '',
            image: null,
            hasPermission: null,
            editar: paramsValidos,
        };

    }

    async componentDidMount() {
        this.getPermission();
    }

    salvar = async () => {
        let ferramenta = {
            id: this.state.id,
            nomeFerramenta: this.state.nomeFerramenta,
            disponibilidade: this.state.disponibilidade,
            imagem: this.state.image,
        };

        if (ferramenta.imagem) {

            ferramenta.imagem = await this.uploadImage(this.state.image, "ferramenta");
        }

        if (ferramenta.id != null) {

            console.log('id:' + ferramenta.id);

            var ferramentaRef = firebase.database().ref("ferramenta").child(ferramenta.id);

            ferramentaRef.update({
                nomeFerramenta: ferramenta.nomeFerramenta,
                disponibilidade: ferramenta.disponibilidade,
                imagem: ferramenta.url,
            }).then(() => {
                console.log("Atualizado");
            }).catch((error) => {
                console.log(error);
            });

        } else {

            console.log('criando novo');

            firebase.database().ref("ferramenta").push({
                nomeFerramenta: ferramenta.nomeFerramenta,
                disponibilidade: ferramenta.disponibilidade,
                imagem: ferramenta.url,
            }).then(() => {
            }).catch((error) => {
                console.log(error);
            });
        }
        this.setState({
            nomeFerramenta: null,
            disponibilidade: null,
            url: null,
        });

        this.props.navigation.navigate("Listagem Ferramenta");
    };

    async selecionarImagem() {
        this.getPermissao();
        if (this.state.hasPermission) {
          let resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
    
          if (!resultado.cancelled) {
            await this.setState({ image: result.uri });
          }
        }
      }
    
      uploadImage = async (uri, tipoImagem) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob(uri);

            var now = new Date();

            var datetime = now.getFullYear() + '_' + (now.getMonth() + 1) + '_' + now.getDate();
            datetime += '_' + now.getHours() + '_' + now.getMinutes() + '_' + now.getSeconds();

            let path = "imagem/" + tipoImagem + '_' + datetime + ".jpg";

            return new Promise((res, rej) => {
                firebase.storage().ref()
                    .child(path)
                    .put(blob)
                    .then((snapshot) => {
                        snapshot.ref.getDownloadURL().then((downloadUrl) => {
                            res({ uri: downloadUrl, path: path })
                        })
                    })
                    .catch((error) => {
                        rej(error)
                    })
            })
        }
        catch (error) {
            console.error(error);
        }
    }

    getPermission = async () => {
        if (Platform.OS === 'ios') {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Hey! You might want to enable gallery permissions for my app, they are good.');
            }
        }
        this.setState({ hasPermission: status === "granted" });
    };

    render() {
        return (
            <View style={styles.container}>

                <View style={{
                    paddingHorizontal: 30,
                    marginBottom: 25,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 15
                }}>
                    <Text style={{ fontSize: 20, color: '#A5BBFF' }}>
                        Formulario Ferramenta
                    </Text>
                    </View>
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            marginLeft: '30%',
                            marginBottom: 30,
                            width: '40%',
                            height: 200,
                        }}
                            onPress={() => this.selecionarImagem()}
                        >
                            <Image
                                source={{
                                    uri: this.state.url == null || this.state.url == undefined ? 'https://cdn-icons-png.flaticon.com/512/675/675579.png' : 'data:image/png;base64,'+this.state.url
                                }}
                                style={{
                                    marginTop: 2,
                                    width: 200,
                                    height: 200,
                                    borderRadius: 100,
                                    marginBottom: '2%',
                                    opacity: 0.8,
                                }
                                }
                            />
                            <View style={{
                                paddingHorizontal: 30,
                                marginBottom: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 15
                            }}>
                                
                            </View>
                            </TouchableOpacity>
                    <View style={{ alignItems: 'center' }}>
                        <TextInput
                            dense='true'
                            mode='outlined'
                            placeholder="Nome da Ferramenta"
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
                            value={this.state.nomeFerramenta}
                            onChangeText={(text) => this.setState({ nomeFerramenta: text })}
                        />
                        <TextInput
                            dense='true'
                            mode='outlined'
                            placeholder="Disponibilidade"
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
                            value={this.state.disponibilidade}
                            onChangeText={(text) => this.setState({ disponibilidade: text })}
                        />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Button style={{ borderRadius: 20, marginTop: 5, width: 300, backgroundColor: '#B98EFF' }} mode="contained" onPress={() => this.salvar()}>
                            Salvar
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
        justifyContent: 'center',
    },

    input: {
        borderRadius: 30,
        borderWidth: 5,
        backgroundColor: '#fff',
        padding: 18,
        textAlignVertical: 'top',
        width: 300,
    },

    topText: {
        fontSize: 22,
    },

    map: {
        width: 600,
        height: 300,
    }
})