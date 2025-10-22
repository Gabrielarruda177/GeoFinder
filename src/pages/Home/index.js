import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, Alert, Linking, TouchableOpacity, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import styles from './styles';
import * as Haptics from 'expo-haptics'; 

// Componente para o painel de detalhes flutuante (mantido)
const DetailsPanel = ({ selectedPoint, onClose }) => {
    if (!selectedPoint) return null;

    const openRouteInMaps = () => {
        const url = `http://maps.google.com/maps?daddr=${selectedPoint.latitude},${selectedPoint.longitude}`;
        
        Linking.openURL(url).catch(err => {
            console.error('Erro ao abrir o app de mapas:', err);
            Alert.alert("Erro", "Não foi possível abrir o aplicativo de mapas.");
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    return (
        <View style={detailsPanelStyles.panel}>
            <View style={detailsPanelStyles.header}>
                <Text style={detailsPanelStyles.title}>{selectedPoint.title}</Text>
                <TouchableOpacity onPress={onClose}>
                    <Text style={detailsPanelStyles.closeButton}>X</Text>
                </TouchableOpacity>
            </View>
            <Text style={detailsPanelStyles.description}>{selectedPoint.description}</Text>
            <View style={detailsPanelStyles.buttonContainer}>
                <Button 
                    title="Ver Rotas 🗺️" 
                    onPress={openRouteInMaps} 
                    color="#4F46E5"
                />
            </View>
        </View>
    );
};


export default function Home() {
    const mapRef = useRef(null); 

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [address, setAddress] = useState('');
    const [searchedLocation, setSearchedLocation] = useState(null);
    const [selectedPoint, setSelectedPoint] = useState(null); 

    const [points, setPoints] = useState([
        { id: 1, latitude: -23.517672, longitude: -46.467439, title: 'Mercado São Lucas', description: 'Mercado local próximo à estação.' },
        { id: 2, latitude: -23.518, longitude: -46.4675, title: 'Farmácia Popular', description: 'Aberta 24h com atendimento rápido.' },
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
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (address.trim() === '') {
            Alert.alert('Atenção', 'Por favor, insira um endereço para buscar.');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        try {
            const result = await Location.geocodeAsync(address);
            if (result.length > 0) {
                // SUCESSO
                const { latitude, longitude } = result[0];
                const newRegion = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.015,
                };
                
                setSearchedLocation({ latitude, longitude });
                mapRef.current?.animateToRegion(newRegion, 1000); 

                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); 
                Alert.alert('Sucesso!', 'Localização encontrada e marcada no mapa.');

            } else {
                // AVISO: Endereço não encontrado (AQUI ESTAVA O BLOCO FALTANTE)
                setSearchedLocation(null);
                
                // VIBRAÇÃO DE AVISO (WARNING) <-- AQUI ESTÁ A CORREÇÃO
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); 
                
                Alert.alert('Aviso', 'Endereço não encontrado. Tente ser mais específico.');
            }
        } catch (error) {
            // ERRO
            console.error(error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Erro', 'Ocorreu um erro ao buscar o endereço.');
        }
    };

    const handleMarkerPress = (point) => {
        Haptics.selectionAsync(); 
        setSelectedPoint(point);
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
                <Button 
                    title="Buscar" 
                    onPress={handleSearchLocation} 
                    color="#10B981" 
                />
            </View>

            {location ? (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    onRegionChange={() => setSelectedPoint(null)} 
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
                            onPress={() => handleMarkerPress(point)} 
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
            
            <DetailsPanel 
                selectedPoint={selectedPoint} 
                onClose={() => setSelectedPoint(null)} 
            />
        </View>
    );
}

// --- ESTILOS PARA O PAINEL DE DETALHES (mantido) ---
const detailsPanelStyles = StyleSheet.create({
    panel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#DC2626',
        padding: 5,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    buttonContainer: {
        marginTop: 5,
    },
});
