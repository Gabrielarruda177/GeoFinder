import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import styles from './styles';

export default function Home() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null);

  const [points, setPoints] = useState([
    {
      id: 1,
      latitude: -23.517672,
      longitude: -46.467439,
      title: 'Mercado São Lucas',
      description: 'Mercado local próximo à estação.',
    },
    {
      id: 2,
      latitude: -23.518,
      longitude: -46.4675,
      title: 'Farmácia Popular',
      description: 'Aberta 24h com atendimento rápido.',
    },
  ]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar a localização foi negada');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const handleSearchLocation = async () => {
    if (address.trim() === '') {
      alert('Por favor, insira um endereço');
      return;
    }

    try {
      const result = await Location.geocodeAsync(address);
      if (result.length > 0) {
        const { latitude, longitude } = result[0];
        setSearchedLocation({ latitude, longitude });
      } else {
        alert('Endereço não encontrado');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao buscar o endereço');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>GeoFinder</Text>

      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite um endereço"
          value={address}
          onChangeText={setAddress}
        />
        <Button title="Buscar" onPress={handleSearchLocation} color="#10B981" />
      </View>

      {location ? (
        <MapView
          style={styles.map}
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Sua Localização"
            description="Você está aqui"
          />

          {points.map((point) => (
            <Marker
              key={point.id}
              coordinate={{ latitude: point.latitude, longitude: point.longitude }}
              title={point.title}
              description={point.description}
              pinColor="#1E3A8A"
            />
          ))}

          {searchedLocation && (
            <Marker
              coordinate={searchedLocation}
              title="Local buscado"
              description={address}
              pinColor="#10B981"
            />
          )}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>Obtendo sua localização...</Text>
      )}
    </View>
  );
}
