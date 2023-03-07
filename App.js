import React, { useEffect, useState } from 'react'
import { FlatList, SafeAreaView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import axios from 'axios'
import * as Location from 'expo-location'

export default function App() {

  const [previsao, setPrevisao] = useState()
  const [hora, setHora] = useState()
  const [temp, setTemp] = useState()
  const [localizacao, setLocalizacao] = useState()
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    getLocation()
  }, [])

  useEffect(() => {
    getWheatherInfo()
  }, [localizacao])

  //   useEffect(() => {
  //     if (!carregando) {
  //       console.log('teste', previsao)
  //     }
  // }, [carregando])

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      console.log('Permission to access location was denied')
      return
    }

    let location = await Location.getCurrentPositionAsync({})
    setLocalizacao(location)
  }

  function getWheatherInfo() {
    axios.get('https://api.open-meteo.com/v1/forecast?latitude=24.3&longitude=52&current_weather=true&hourly=temperature_2m')
      .then(function (res) {
        setPrevisao(res.data)
        setHora(res.data?.hourly?.time)
        setTemp(res.data?.hourly?.temperature_2m)
        console.log(res.data)
        setCarregando(false)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 35 }}>{previsao?.current_weather?.temperature} ºC</Text>
      </View>
      {/* <View>
        <Text>{data?.hourly?.time[0].split("T")[1]}</Text>
        <Text>{data?.hourly?.temperature_2m[0]} ºC</Text>
      </View> */}
      <View style={{ flex: 2, width: '100%' }}>
        {
          !carregando ?
            <FlatList
              data={hora}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ backgroundColor: '#ffffff', padding: 15, margin: 5, borderRadius: 10}}>
                    <Text>{item?.split("T")[1]}     {temp[index]} ºC</Text>
                  </View>
                )
              }}
            />
            : <></>
        }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
