import * as React from "react"
import { View, Animated, TouchableOpacity, Alert, StyleSheet, Linking, ScrollView, Image } from 'react-native'
import {
    Card,
    Divider,
    TextInput,
    Text,
    Title,
    Paragraph,
    Button,
    List,
    FAB,
} from 'react-native-paper'
import firebase from 'firebase'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class mechanicList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: null,
            mecanicoList: [],
            nome: ''
        };
    }
    async componentDidMount() {
        await this.getData();
        this.focusListener = this.props.navigation.addListener("focus", () => {
            this.getData();
        });
    }

    getData = async () => {

        var ref = firebase.database().ref("mecanico");
        var vetorTemp = [];

        await ref.on("value", function (snapshot) {
            if (snapshot) {
                snapshot.forEach((child) => {
                    vetorTemp.push({
                        id: child.key,
                        nomeMecanico: child.val().nomeMecanico,
                        telefoneMecanico: child.val().telefoneMecanico,
                        especificacao: child.val().especificacao,
                        imagem: child.val().imagem,
                        marker: child.val().marker,
                    });
                })
            }
        }, (error) => {
            console.log("Error: " + error.code);
        });

        this.setState({ mecanicoList: vetorTemp })
    };


    filtrar = () => {
        let novoMecanico = this.state.mecanicoList.filter(
            (item) => item.nomeMecanico.length > 4
        );

        this.setState({ mecanicoList: novoMecanico });
    };

    pesquisar = async (text) => {
        if (text != '') {
            const newArray = this.state.mecanicoList.filter((item) => {
                const itemDado = item.nomeMecanico ? item.nomeMecanico.toUpperCase() : ''.toUpperCase();
                const textDado = text.toUpperCase();
                return itemDado.indexOf(textDado) > -1;
            });
            this.setState({
                mecanicoList: newArray,
                search: text,
            });
        } else {
            await this.getData();
            this.setState({ search: null });
        }

    }

    render() {
        return (
            <ScrollView style={{ margin: 0, alignSelf: 'stretch', backgroundColor: '#FFF' }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ marginTop: 30, flexDirection: "row", width: '100%', alignSelf: 'center', backgroundColor: '#FFF' }}>
                            <TextInput
                                dense='true'
                                mode='flat'
                                style={{ flex: 1, padding: 0, backgroundColor: '#FFF' }}
                                label="Pesquisar"
                                value={this.state.search}
                                onChangeText={(text) => this.pesquisar(text)}
                            />
                            <Ionicons name="ios-search" size={30} style={{ position: 'absolute', right: 20, top: 10 }} />
                        </View>
                        <View style={styles.adicionar} >
                            <Text style={{ flex: 1, padding: 0 }} onPress={() => { this.props.navigation.navigate('Adicionar Mecanico') }}>
                                Adicionar Mecânico
                            </Text>
                            <Ionicons name='add-circle-outline' size={20} onPress={() => { this.props.navigation.navigate('Adicionar Mecanico') }} />
                        </View>
                    </View>
                            <List.Section>
                                {this.state.mecanicoList?.map((item, key) => (
                                    <>
                                        <Swipeable>
                                        <Divider/>
                                        <TouchableOpacity
                                            style={{backgroundColor: '#FFF', marginBottom: '5%', borderRadius: 30
                                    }}
                                                onPress={() => this.props.navigation.navigate('infoMechanic', item)}>
                                                    <View style={{backgroundColor: '#FFF', marginBottom: '5%', borderRadius: 30}}>
                                                <View style={{marginLeft: '5%'}}>
                                                <Title style={{ textTransform: 'capitalize' }}>{item.nomeMecanico},</Title>
                                                <View style={{position: 'absolute', marginLeft: 250}}>
                                        <Image 
                                        source={{
                                            uri: 'data:image/png;base64,'+item.imagem
                                        }}
                                        style={{
                                            marginTop: 12,
                                            borderRadius: 20,
                                            width: 100,
                                            height: 100,
                                            borderColor: '#B98EFF',
                                            borderWidth: 2
                                        }}
                                        />
                                        </View>
                                                <Title style={{ fontSize: 15 }}>Telefone do Mecanico:</Title>
                                                <Paragraph>{item.telefoneMecanico}</Paragraph>
                                                <Title style={{ fontSize: 15 }}>Especificação:</Title>
                                                <Paragraph>{item.especificacao}</Paragraph>
                                                <Paragraph></Paragraph>
                                                </View>
                                                </View>
                                            </TouchableOpacity>
                                            <Divider />
                                        </Swipeable>
                                    </>
                                ))}
                            </List.Section>


                    <View>
                    </View>
                </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#fff',
        paddingVertical: 18,
        paddingHorizontal: 24,
        textAlignVertical: 'top',
        width: '90%',
    },

    adicionar: {
        flexDirection:"row",
        backgroundColor: '#fff',
        width: '90%',
        alignSelf:'center',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
        marginBottom: 20,
        marginTop: 20
      },

    topText: {
        fontSize: 18
    },
    imagemCard: {
        width: 140,
        height: 140,
        marginLeft: -20,
        borderRadius: 20
    }
});