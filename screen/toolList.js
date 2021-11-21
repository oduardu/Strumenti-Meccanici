import * as React from "react"
import { View, Animated, TouchableOpacity, Alert, StyleSheet, ScrollView, Linking, Image } from 'react-native'
import { Divider, TextInput, Text, Title, Paragraph, List } from 'react-native-paper'
import firebase from 'firebase'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class toolList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: null,
            ferramentaList: [],
        }
    }
    async componentDidMount() {
        await this.getData();
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getData();
          });
    }

    getData = async () => {

        var ref = await firebase.database().ref("ferramenta");
        var vetorTemp = [];

        ref.on("value", function (snapshot) {
            if (snapshot) {
                snapshot.forEach((child) => {
                    vetorTemp.push({
                        id: child.key,
                        nomeFerramenta: child.val().nomeFerramenta,
                        disponibilidade: child.val().disponibilidade,
                        imagem: child.val().imagem
                    });

                })

            }
        }, (error) => {
            console.log("Error: " + error.code);
        });
        this.setState({ ferramentaList: vetorTemp });
    };

    filtrar = () => {
        let novaFerramenta = this.state.ferramentaList.filter(
            (item) => item.nomeFerramenta.length > 4
        );
        this.setState({ ferramentaList: novaFerramenta });
    };

    remover = (key) => {
        var ref = firebase.database().ref("ferramenta/" + key);
        ref.remove().then(() => {
            console.log("Removido" + key);
        }).catch((error) => {
            console.log(error);
        });

        this.getData();
    };

    pesquisar = async (text) => {
        if (text != '') {
            const newArray = this.state.ferramentaList.filter((item) => {
                const itemDado = item.nomeFerramenta ? item.nomeFerramenta.toUpperCase() : ''.toUpperCase();
                const textDado = text.toUpperCase();
                return itemDado.indexOf(textDado) > -1;
            });
            this.setState({
                ferramentaList: newArray,
                search: text,
            });
        } else {
            await this.getData();
            this.setState({ search: null });
        }

    }

    rightActions = (progress, dragX, objFerramenta) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [0.7, 0]
        })
        return (
            <>
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            "Remover Ferramenta",
                            "Deseja realmente remover a ferramenta?",
                            [
                                {
                                    text: "Cancelar",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                },
                                { text: "OK", onPress: () => this.remover(objFerramenta.id) }
                            ]
                        );
                    }
                    }
                >
                    <View style={{ flex: 1, backgroundColor: '#6B0515', justifyContent: 'center' }}>
                        <Animated.Text
                            style={{
                                color: 'white',
                                paddingHorizontal: 10,
                                fontWeight: '600',
                                transform: [{ scale }]
                            }}>
                            Remover
                        </Animated.Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate("Adicionar Ferramenta", {
                            ferramenta: objFerramenta
                        });
                    }}
                >
                    <View style={{ flex: 1, backgroundColor: '#B80923', justifyContent: 'center' }}>
                        <Animated.Text
                            style={{
                                color: 'white',
                                paddingHorizontal: 10,
                                fontWeight: '600',
                                transform: [{ scale }]
                            }}>
                            Editar
                        </Animated.Text>
                    </View>
                </TouchableOpacity>
            </>
        )
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
                            <Text style={{ flex: 1, padding: 0 }} onPress={() => { this.props.navigation.navigate('Adicionar Ferramenta') }}>
                                Adicionar Ferramenta
                            </Text>
                            <Ionicons name='add-circle-outline' size={20} onPress={() => { this.props.navigation.navigate('Adicionar Ferramenta') }} />
                        </View>
                    </View>

                            <List.Section style={{ borderRadius: 30, width: '90%', marginLeft: '5%',}}>
                                {this.state.ferramentaList?.map((item, i) => (
                                    <>
                                        <Swipeable
                                         style={{marginBottom: '5%', width: '90%'}}>
                                             <Divider/>
                                            <TouchableOpacity
                                            style={{backgroundColor: '#FFF', marginBottom: '5%', borderRadius: 30
                                    }}
                                                onPress={() => this.props.navigation.navigate('infoTool', item)}>
                                                <View style={{backgroundColor: '#FFF', marginBottom: '5%', borderRadius: 30}}>
                                                <View style={{marginLeft: '5%'}}>
                                                <Title style={{ color: '#001219' }}>Ferramenta:</Title>
                                                <Paragraph style={{ textTransform: 'capitalize' }}>{item.nomeFerramenta}</Paragraph>
                                                <Title>Disponibilidade:</Title>
                                                <Paragraph>{item.disponibilidade}</Paragraph>
                                                <View style={{ position: 'absolute', marginLeft: 250 }}>
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
                                                </View>
                                                </View>
                                            </TouchableOpacity>
                                        </Swipeable >
                                    </>
                                ))}
                            </List.Section>
                            <Divider/>
                </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#fff',
        borderColor: '#B98EFF',
        paddingVertical: 18,
        paddingHorizontal: 24,
        textAlignVertical: 'top',
        width: '100%',
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
});