import * as React from 'react'
import { Text, View, StyleSheet, Platform, Image, TextInput, TouchableOpacity } from 'react-native'
import { Avatar, Button, Icon } from 'react-native-paper'
import firebase from 'firebase'
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class addTool extends React.Component {
    constructor(props) {
        super(props);

        const paramsValidos = this.props.route.params != undefined && this.props.route.params.ferramenta != undefined;

        this.state = {
            id: null,
            nomeFerramenta: null,
            disponibilidade: null,
            imagem: null,
            editar: paramsValidos,
            date: new Date(),
            mode: 'date',
            show: false,
            hasPermission: false
        };
    }
    async componentDidMount() {
        this.getPermissao()
        this.carrregarDados()
    }

    onChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.date;
        let dataFormatada = ((currentDate.getDate())) + "/" + ((currentDate.getMonth() + 1)) + "/" + currentDate.getFullYear();
        this.setState({ show: Platform.OS === 'ios', date: dataFormatada })
    }

    showMode = (currentMode) => {
        this.setState({ show: true });
        this.setState({ mode: currentMode });
    };

    showDatepicker = () => {
        this.showMode('date');
    };

    salvar = async () => {
        let tools = {
            id: this.state.id,
            nomeFerramenta: this.state.nomeFerramenta,
            disponibilidade: this.state.date,
            imagem: this.state.imagem,
        }
    
        if (tools.id != null) {

            var ferramentaRef = firebase.database().ref("ferramenta/" + tools.id);

            ferramentaRef.update({
                nomeFerramenta: tools.nomeFerramenta,
                disponibilidade: tools.disponibilidade,
                imagem: tools.imagem
            }).then(() => {
                console.log("Atualizado");
            }).catch((error) => {
                console.log(error);
            });

        } else {
            var ferramentaRef = firebase.database().ref("ferramenta");

            ferramentaRef.push({
                nomeFerramenta: tools.nomeFerramenta,
                disponibilidade: tools.disponibilidade,
                imagem: tools.imagem
            }).then(() => {
                console.log("inserido");
            }).catch((error) => {
                console.log(error);
            });
        }

        this.setState({
            nomeFerramenta: null,
            telefoneMecanico: null,
            imagem: null,

        });
        this.props.navigation.navigate("toolList")
    }

    async escolherImagem() {
        this.getPermissao();
        if (this.state.hasPermission) {
            let resultado = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
                base64: true
            });

            if (!resultado.cancelled) {
                await this.setState({ imagem: resultado.base64 });
            }
        }
    }

    // uploadImage = async (uri, tipoImagem) => {
    //     try {
    //         const response = await fetch(uri);
    //         const blob = await response.blob(uri);

    //         // let now = new Date();

    //         // let datetime = now.getFullYear() + '_' + (now.getMonth() + 1) + '_' + now.getDate();
    //         // datetime += '_' + now.getHours() + '_' + now.getMinutes() + '_' + now.getSeconds();

    //         // let path = "imagem/" + datetime;

    //         // return new Promise((res, rej) => {
    //         //     firebase.storage().ref()
    //         //         .child(path)
    //         //         .put(blob)
    //         //         .then((snapshot) => {
    //         //             snapshot.ref.getDownloadURL().then((downloadUrl) => {
    //         //                 res({ uri: downloadUrl, path: path })
    //         //             })
    //         //         })
    //         //         .catch((error) => {
    //         //             rej(error)
    //         //         })
    //         // })

    //     }
    //     catch (error) {
    //         console.error(error);
    //     }
    // }

    async getPermissao() {
        if (Platform.OS === "ios") {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if (status !== 'granted') {
                alert('Por favor, aceite as permissões!')
            }
        }
        const { status } = await Permissions.askAsync(Permissions.CAMERA)
        this.setState({ hasPermission: status === 'granted' })
    }

    carrregarDados = () => {
        let { route } = this.props;
        if (route.params != null) {
            this.setState({
                id: route.params.ferramenta.id,
                nomeFerramenta: route.params.ferramenta.nomeFerramenta,
                imagem: route.params.ferramenta.imagem,
            });
        }
    }

    render() {
        
        const dateTimerPickerView =
            <DateTimePicker
                testID="dateTimePicker"
                value={this.state.date}
                mode={this.state.mode}
                is24Hour={true}
                display="default"
                onChange={this.onChange}
            />

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
                    onPress={() => this.escolherImagem()}
                >
                    <Image style={styles.imagem} source={{
                        uri: this.state.imagem == null || this.state.imagem == undefined ? 'https://cdn-icons-png.flaticon.com/512/2983/2983067.png' : 'data:image/png;base64,' + this.state.imagem
                    }} />
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
                    {this.state.show ? dateTimerPickerView : null}
                    <View>
                        <Button
                            color='#FFF'
                            style={{ borderRadius: 20, marginTop: 5, width: 300, backgroundColor: '#B98EFF' }}
                            onPress={() => this.showDatepicker()}
                        >
                            Selecionar Disponibilidade
                        </Button>
                    </View>
                    <Text style={{
                    fontSize: 20,
                    color: '#B98EFF'
                }}>{this.state.date ? dataFormatada : ""}</Text>

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
    imagem: {
        marginTop: 2,
        width: 200,
        height: 200,
        marginBottom: '2%',
        opacity: 0.8,
    },

    topText: {
        fontSize: 22,
    },

    map: {
        width: 600,
        height: 300,
    }
})