import * as React from 'react'
import { View, Platform, TextInput, StyleSheet, Text, ScrollView, Image, TouchableOpacity, Modal } from 'react-native'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { HelperText, Button, Checkbox, FAB } from 'react-native-paper'
import MapView, { Marker } from 'react-native-maps'
import * as firebase from 'firebase'
import 'firebase/storage'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TextInputMask } from "react-native-masked-text";

export default class addMechanic extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      id: null,
      nomeMecanico: null,
      telefoneMecanico: null,
      especificacao: null,
      visibleModal: false,
      visible: false,
      marker: null,
      latitude: null,
      longitude: null,
      hasPermission: false,
      imagem: null,
      errorType: ''
    }
  }

  async componentDidMount() {
    this.getPermissao()

    const { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== 'granted') {

      this.setState({
        errorMessage: 'PERMISSÃO NÃO CONCEDIDA'
      })
    }
    const location = await Location.getCurrentPositionAsync()
    this.setState({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
    this.carrregarDados()
  }

  salvar = async () => {
    let mec = {
      id: this.state.id,
      nomeMecanico: this.state.nomeMecanico,
      telefoneMecanico: this.state.telefoneMecanico,
      especificacao: this.state.especificacao,
      marker: this.state.marker,
      imagem: this.state.imagem,
    };
    console.log(mec.marker)
    if (mec.id != null) {

      var mecanicoRef = firebase.database().ref("mecanico/" + mec.id);

      mecanicoRef.update({
        nomeMecanico: mec.nomeMecanico,
        telefoneMecanico: mec.telefoneMecanico,
        especificacao: mec.especificacao,
        marker: mec.marker,
        imagem: mec.imagem,
      }).then(() => {
        console.log("Atualizado");
      }).catch((error) => {
        console.log(error);
      });

    } else {
      var mecanicoRef = firebase.database().ref("mecanico");

      mecanicoRef.push({
        nomeMecanico: mec.nomeMecanico,
        telefoneMecanico: mec.telefoneMecanico,
        especificacao: mec.especificacao,
        marker: mec.marker,
        imagem: mec.imagem,
      }).then(() => {
        console.log("inserido");
      }).catch((error) => {
        console.log(error);
      });
    }

    this.setState({
      nomeMecanico: null,
      telefoneMecanico: null,
      especicifacao: null,
      marker: null,
      image: null,

    });
    this.props.navigation.navigate("Dashboard")
  };

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


  // uploadImage = async (uri, tipoImagem) => {
  // try {
  //     const response = await fetch(uri);
  //     const blob = await response.blob(uri);

  //     var now = new Date();

  //     var datetime = now.getFullYear() + '_' + (now.getMonth() + 1) + '_' + now.getDate();
  //     datetime += '_' + now.getHours() + '_' + now.getMinutes() + '_' + now.getSeconds();

  //     let path = "imagem/" + tipoImagem + '_' + datetime + ".jpg";

  //     return new Promise((res, rej) => {
  //         firebase.storage().ref()
  //             .child(path)
  //             .put(blob)
  //             .then((snapshot) => {
  //                 snapshot.ref.getDownloadURL().then((downloadUrl) => {
  //                     res({ uri: downloadUrl, path: path })
  //                 })
  //             })
  //             .catch((error) => {
  //                 rej(error)
  //             })
  //     })
  // }
  // catch (error) {
  //     console.error(error);
  // }
  // }

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

  handleVisible = (visible) => {
    this.setState({
      visibleModal: visible
    })
  }

  carrregarDados = () => {
    let { route } = this.props;
    if (route.params != null) {

        this.setState({
          id: route.params.mecanico.id,
          nomeMecanico: route.params.mecanico.nomeMecanico,
          telefoneMecanico: route.params.mecanico.telefoneMecanico,
          especificacao: route.params.mecanico.especificacao,
          imagem: route.params.mecanico.imagem,
          marker: route.params.mecanico.marker
        });
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Modal
          style={styles.centeredView}
          animationType={"fade"}
          transparent={true}
          visible={this.state.visibleModal}
        >
          <View style={styles.itemAlign}>
            <MapView style={styles.map}
              customMapStyle={mapViewCustom}
              initialRegion={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0,
              }}
              showsUserLocation={true}
              onPress={(e) => this.setState({
                marker: e.nativeEvent.coordinate
              })
              }>
              {
                this.state.marker &&
                <Marker coordinate={this.state.marker}
                />
              }
            </MapView>
            <Button style={styles.mapConfirmButton} mode="contained" onPress={() => this.handleVisible(!this.state.visibleModal)}>
              {this.state.marker == null ? "Voltar" : "Confirmar"}
            </Button>
          </View>
        </Modal>
        <View style={{ marginTop: '10%' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 40, color: '#A5BBFF', marginLeft: '20%', marginBottom: 50 }}>
            Informações:
          </Text>
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

          </TouchableOpacity>
          <View style={styles._input}>
            <TextInput
              placeholder="Nome do Mecânico"
              placeholderTextColor="#000"
              autoCapitalize="none"
              style={{ flex: 1, padding: 0 }}
              value={this.state.nomeMecanico}
              onChangeText={(text) => this.setState({ nomeMecanico: text })}
            />
          </View>
          <View style={styles._input}>
            <TextInput
              placeholder="Especificação"
              placeholderTextColor="#000"
              autoCapitalize="none"
              style={{ flex: 1, marginBottom: 20 }}
              value={this.state.especificacao}
              onChangeText={(text) => this.setState({ especificacao: text })}
            />
          </View>
          <View style={styles._input}>
            <TextInputMask
              placeholder="Telefone"
              placeholderTextColor="#000"
              value={this.state.telefoneMecanico}
              keyboardType="phone-pad"
              style={{ flex: 1, padding: 0 }}
              maxLength={15}
              onChangeText={(text) => this.setState({ telefoneMecanico: text })}
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) '
              }}
            />
          </View>
          <TouchableOpacity onPress={() => this.handleVisible(!this.state.visibleModal)}>
            <Image
              source={{
                uri: 'https://subli.info/wp-content/uploads/2015/05/google-maps-blur.png'
              }}
              style={{
                marginTop: 2,
                width: '90%',
                height: 200,
                marginLeft: '5%',
                opacity: 1,
                borderRadius: 20,
              }}
            />

          </TouchableOpacity>
          <View style={{ marginTop: 20 }}>
            <Button style={styles.saveButton} mode="contained" onPress={() => this.salvar()}>
              Salvar
            </Button>
          </View>
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <HelperText type="error" visible={this.state.visible}
            >
              {this.state.errorType}
            </HelperText>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    width: '100%'
  },
  imagem: {
    marginTop: 2,
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: '2%',
    opacity: 0.8,
  },
  buttonBack: {
    position: 'absolute',
    margin: 16,
    marginBottom: 100,
    right: 1,
    bottom: 0,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
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
  row: {
    flexDirection: 'row',
    marginBottom: 10
  },
  fab: {
    overflow: 'hidden',
    shadowOpacity: 0,
    marginTop: '32.5%',
    right: '30%',
    position: 'absolute',
  },
  fabFolder: {
    overflow: 'hidden',
    shadowOpacity: 0,
    marginTop: '32.5%',
    right: '30%',
    position: 'absolute',
    opacity: 0.8,
  },
  inputText: {
    backgroundColor: '#fff',
    borderWidth: 1.4,
    borderColor: '#f0f0ee',
    borderRadius: 20,
    height: 26,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    textAlignVertical: 'top',
    width: 750,
  },

  topText: {
    fontSize: 22,
  },
  _input: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },

  map: {
    width: '100%',
    height: '100%',
  },
  itemAlign: {
    alignItems: "center",
    overflow: 'hidden'
  },
  selectImageButton: {
    backgroundColor: "#A5BBFF",
    marginLeft: '5%',
    width: '90%',
    borderRadius: 30
  },
  saveButton: {
    backgroundColor: "#A5BBFF",
    marginLeft: '5%',
    width: '90%',
    borderRadius: 30,
    marginTop: 10
  },
  mapConfirmButton: {
    backgroundColor: "#A5BBFF",
    marginLeft: '15%',
    width: '60%',
    borderRadius: 30,
    marginTop: 10,
    position: 'absolute',
    bottom: '10%'
  }
})

const mapViewCustom = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]