import * as React from 'react'
import { StyleSheet, View, Text, Dimensions, ScrollView, Linking} from 'react-native'
import { Title, Card, Button } from 'react-native-paper'
import { Video, AVPlaybackStatus } from 'expo-av';

export default class profile extends React.Component {

    render() {
        return (
            <View style={styles.flex}>
                <View style={styles.c}>
                    <Text style={{fontSize: 15, textTransform: 'uppercase', color: '#777'}}>
                        Aprenda um pouco mais sobre mecânica                        
                    </Text>
                </View>
            <ScrollView style={{
                marginLeft: '5%'
            }}>
                <Card style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              marginTop: 40,
              width: 0.9 * Dimensions.get('window').width,
            }}>
                <Card.Content>
                <Title style={{textAlign: 'center', paddingHorizontal: 5, color: '#deaaff'}}>Aprenda um pouco mais sobre suspensão</Title>
                    <Video
                        style={{width: 0.9 * Dimensions.get('window').width, height: 200}}
                        source={{
                            uri: 'https://firebasestorage.googleapis.com/v0/b/mecanicaapp-62e88.appspot.com/o/video%2Fsuspensao.mp4?alt=media&token=de2679ce-190d-48e9-b0f2-a3dbd8e0e906',
                        }}
                        useNativeControls
                        resizeMode="contain"
                        onPlaybackStatusUpdate={status => this.setState({ status: status })}
                    />
                </Card.Content>
            </Card>

            <Card style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              marginTop: 40,
              width: 0.9 * Dimensions.get('window').width,
            }}>
                <Card.Content>
                <Title style={{textAlign: 'center', paddingHorizontal: 5, color: '#deaaff'}}>Aprenda um pouco mais sobre rodas</Title>
                    <Video
                        style={{width: 0.9 * Dimensions.get('window').width, height: 200}}
                        source={{
                            uri: 'https://firebasestorage.googleapis.com/v0/b/mecanicaapp-62e88.appspot.com/o/video%2Frodas.mp4?alt=media&token=b957355b-618d-4e14-85d3-f893ebf4d27f',
                        }}
                        useNativeControls
                        resizeMode="contain"
                        onPlaybackStatusUpdate={status => this.setState({ status: status })}
                    />
                </Card.Content>
            </Card>

            <Card style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              marginTop: 40,
              width: 0.9 * Dimensions.get('window').width,
            }}>
                <Card.Content>
                <Title style={{textAlign: 'center', paddingHorizontal: 5, color: '#deaaff'}}>Aprenda um pouco mais sobre rolamentos</Title>
                    <Video
                        style={{width: 0.9 * Dimensions.get('window').width, height: 200}}
                        source={{
                            uri: 'https://firebasestorage.googleapis.com/v0/b/mecanicaapp-62e88.appspot.com/o/video%2Frolamentos.mp4?alt=media&token=7606351b-9329-4fb5-9530-54653b8ae835',
                        }}
                        useNativeControls
                        resizeMode="contain"
                        onPlaybackStatusUpdate={status => this.setState({ status: status })}
                    />
                </Card.Content>
            </Card>
            <View style={{
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: 14,
                marginBottom: 20,
                backgroundColor: '#A5BBFF',
                width: '90%',
                borderRadius: 20,
                height: 30
            }}>
            <Button
            color={'#FFF'}
            onPress={() => Linking.openURL('https://www.youtube.com/c/MTETHOMSON1')}
            >Fonte dos vídeos
            </Button>
            </View>

            </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    flex: { 
        flex: 1,
    },
    c:{
        backgroundColor: '#f2f9f2',
        height: 100, 
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomEndRadius: 50, 
        borderBottomLeftRadius: 50,  
        shadowColor: '#fff',
        shadowOffset: '#ffe',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.5,
        elevation: 5
    },
    return: {

    }
})