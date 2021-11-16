import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Animated, FlatList, Image, Dimensions } from 'react-native'
import { Button } from "react-native-paper";
import { NavigationContainer } from '@react-navigation/native';
import React from "react";

const bgs = ['#B98EFF', '#FF63ED', '#DDBEFE', '#A5BBFF'];
const { width, height } = Dimensions.get('screen')
const DATA = [
  {
    "key": "3571572",
    "title": "Encontre Mecânicos",
    "description": "Caso precise, chame ou vá a algum mecânico que está associado a nosso aplicativo!",
    "image": "https://cdn.discordapp.com/attachments/789554224132259890/904914579727990844/1155229.png"
  },
  {
    "key": "3571747",
    "title": "Alugue Ferramentas",
    "description": "Cansado de precisar gastar dinheiro para comprar ferramentas que usará poucas vezes?!\n\n Alugue ferramentas conosco!",
    "image": "https://cdn.discordapp.com/attachments/789554224132259890/904914193717809202/1058407.png"
  }
]

const Indicator = ({ scrollX }) => {
  return <View style={{ position: 'absolute', bottom: 100, flexDirection: 'row' }}>
    {DATA.map((_, i) => {
      const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.8, 1.4, 0.8],
        extrapolate: 'clamp'
      })
      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.4, 0.9, 0.4],
        extrapolate: 'clamp'
      })
      return (<Animated.View
        key={`indicator-${i}`}
        style={
          {
            height: 10,
            width: 10,
            borderRadius: 5,
            backgroundColor: '#FFF',
            opacity,
            margin: 10,
            transform: [
              {
                scale,
              }
            ]
          }
        }
      />
      )
    })}
  </View>
}

const Backdrop = ({ scrollX }) => {

  const backgroundColor = scrollX.interpolate({
    inputRange: bgs.map((_, i) => i * width),
    outputRange: bgs.map((bg) => bg),
  })
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor,
        },
      ]}
    />
  )
}

const Square = ({ scrollX }) => {
  const YOLO = Animated.modulo(
    Animated.divide(Animated.modulo(scrollX, width),
    new Animated.Value(width)
  ), 1)

  const rotate = YOLO.interpolate({
    inputRange: [0, .5, 1],
    outputRange: ['35deg', '0deg', '35deg'],
  })
  const translateX = YOLO.interpolate({
    inputRange: [0, .5, 1],
    outputRange: [0 , -height / 1.65, 0],
  })
  return <Animated.View
    style={{
      width: height, 
      height: height,
      backgroundColor: '#FFF', 
      borderRadius: 86, 
      position: 'absolute', 
      top: -height * 0.6,
      left: -height * 0.3,
      transform: [
        {
          rotate,
        },{
          translateX
        }
      ]
    }}
  />
}

export default function onBoarding({ navigation }) {
  const scrollX = React.useRef(new Animated.Value(0)).current
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Backdrop scrollX={scrollX} />
      <Square scrollX={scrollX}/>
      <Animated.FlatList
        data={DATA}
        horizontal
        contentContainerStyle={{ paddingBottom: 100 }}
        scrollEventThrottle={32}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        pagingEnabled
        renderItem={({ item }) => {
          return <View style={{ width, alignItems: 'center', padding: 30 }}>
            <View style={{ flex: 0.7, padding: 20, justifyContent: 'center' }}>
              <Image source={{ uri: item.image }} style={{ width: width / 2, height: height / 2, resizeMode: 'contain' }} />
            </View>
            <View style={{ flex: 0.3 }}>
              <Text style={{ fontWeight: '800', fontSize: 24, marginBottom: 10, color: '#FFF' }}>{item.title}</Text>
              <Text style={{ fontWeight: '300', color: '#FFF' }}>{item.description}</Text>
            </View>
          </View>
        }}
      />
      <Button style={{width: '30%', position: 'absolute', bottom: '17%', left: '10%', backgroundColor: '#A5BBFF'}} mode="contained" onPress={() => navigation.navigate("Login")}> 
        Login
      </Button>
      <Button style={{width: '40%', position: 'absolute', bottom: '17%', right: '15%', backgroundColor: '#DDBEFE'}} mode="contained"  onPress={() => navigation.navigate("Register") }> 
        Registrar-se
      </Button>
      <Indicator scrollX={scrollX} />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  }
})