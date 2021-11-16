import * as React from "react"
import { View, Animated, TouchableOpacity, Alert, StyleSheet, Linking, ScrollView } from 'react-native' 
import { Card,
    Divider,
    TextInput,
    Text,
    Title,
    Paragraph,
    Button,
    List,
    FAB, } from 'react-native-paper'
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
        await this.getData();;
    }
    getData = async () => {
        const id = firebase.auth().currentUser.uid
        var nomeTemp = ""
        var userRef = firebase.database().ref('usuario').child(id).get().then(snapshot =>{
            nomeTemp = snapshot.val().nome
            //console.log(nomeTemp)
            this.setState({
                nome: nomeTemp
            })
        })

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
                        latitude: child.val().marker.latitude,
                        longitude: child.val().marker.longitude
                    });
                })

            }
        }, (error) => {
            console.log("Error: " + error.code);
        });

        this.setState({ mecanicoList: vetorTemp})
    };
    

    filtrar = () => {
        let novoMecanico = this.state.mecanicoList.filter(
            (item) => item.nomeMecanico.length > 4
        );

        this.setState({ mecanicoList: novoMecanico });
    };

    remover = (uid) => {
        var mecanicoRef = firebase.database().ref("mecanico/" + uid);
        mecanicoRef.remove().then(() => {
        }).catch((error) => {
            console.log(error);
        });
        this.getData();
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
            <View style={{backgroundColor: '#FFF'}}>
            <ScrollView style={{width: '100%', backgroundColor: '#FFF'}}>
                <View style={{flex: 1}}>
                <View style={{marginTop: 30,flexDirection:"row",width: '100%',alignSelf:'center',backgroundColor: '#FFF'}}>
                <TextInput
                    dense='true'
                    mode='flat'
                    style={{flex:1,padding:0,backgroundColor: '#FFF'}}
                    label="Pesquisar"
                    value={this.state.search}
                    onChangeText={(text) => this.pesquisar(text)}
                />
                <Ionicons name="ios-search" size={30} style={{position: 'absolute', right: 20, top: 10}} />
                </View>
                </View>

                <Card>
                    <Card.Content>
                        <List.Section>
                            {this.state.mecanicoList?.map((item, key) => (
                                <>
                                    <Swipeable>
                                        <TouchableOpacity 
                                         onPress ={() => this.props.navigation.navigate('infoMechanic', item)}>
                                        <Title style={{textTransform: 'capitalize'}}>{item.nomeMecanico},</Title>
                                        <Title style={{fontSize: 15}}>Telefone do Mecanico:</Title>
                                        <Paragraph>{item.telefoneMecanico}</Paragraph>
                                        <Title style={{fontSize: 15}}>Especificação:</Title>
                                        <Paragraph>{item.especificacao}</Paragraph>
                                        <Title style={{fontSize: 15}}>Localização: </Title>
                                        <Paragraph style={{color: '#169'}} onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${item?.latitude},${item?.longitude}`)}>Ir para o Google Maps</Paragraph>
                                        <Paragraph></Paragraph>
                                        </TouchableOpacity>
                                        <Divider />
                                    </Swipeable>
                                </>
                            ))}
                        </List.Section>
                    </Card.Content>
                </Card>

                <View>
                </View>
            </ScrollView>
            <View style={{position: 'absolute', top: 825, right: 0}}>
            <FAB
                style={styles.fab}
                small
                color={'#FFF'}
                icon="plus"
                onPress={() => this.props.navigation.navigate("Adicionar Mecanico")}
            />
            </View>
            </View>
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: '#B98EFF',
        color: '#FFF',
        bottom: 0,
    },

    topText: {
        fontSize: 18
    },
});