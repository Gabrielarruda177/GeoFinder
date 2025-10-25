import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  Linking,
  ScrollView,
  Animated,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Haptics from 'expo-haptics';
import styles from './styles';

const SEARCH_RADIUS = 10000; // 10 km

function randomPointWithinRadius(lat, lng, radiusMeters) {
  const rd = radiusMeters / 111300;
  const u = Math.random();
  const v = Math.random();
  const w = rd * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  return {
    latitude: lat + y,
    longitude: lng + x / Math.cos(lat * (Math.PI / 180)),
  };
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Home() {
  const mapRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [generating, setGenerating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão negada');
        return;
      }
      const current = await Location.getCurrentPositionAsync({});
      setLocation(current);

      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();

      // Gera locais automaticamente
      setTimeout(() => generateMockPlaces(current), 800);
    })();
  }, []);

  const generateMockPlaces = (loc = location) => {
    if (!loc) return;

    setGenerating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const baseLat = loc.coords.latitude;
    const baseLng = loc.coords.longitude;
    const mk = [];
    const rs = [];

    const marketNames = ['Mercado Fresco', 'Hortifruti Verde', 'Empório da Cidade', 'Feira Orgânica', 'Mercado Local'];
    const restaurantNames = ['Bella Italia', 'Sushi House', 'Burger King', 'Tacos Mexicanos', 'Pizzaria Napoli'];

    for (let i = 0; i < 5; i++) {
      const p = randomPointWithinRadius(baseLat, baseLng, SEARCH_RADIUS);
      const rating = (4 + Math.random()).toFixed(1);
      mk.push({
        id: `market_${i}`,
        title: marketNames[i],
        description: 'Mercado',
        latitude: p.latitude,
        longitude: p.longitude,
        type: 'market',
        rating: parseFloat(rating),
        distance: (Math.random() * 2 + 0.5).toFixed(1),
      });
    }

    for (let i = 0; i < 5; i++) {
      const p = randomPointWithinRadius(baseLat, baseLng, SEARCH_RADIUS);
      const rating = (3.5 + Math.random() * 1.5).toFixed(1);
      rs.push({
        id: `rest_${i}`,
        title: restaurantNames[i],
        description: 'Restaurante',
        latitude: p.latitude,
        longitude: p.longitude,
        type: 'restaurant',
        rating: parseFloat(rating),
        distance: (Math.random() * 2 + 0.5).toFixed(1),
      });
    }

    setTimeout(() => {
      setMarkets(mk);
      setRestaurants(rs);
      setGenerating(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 600);
  };

  const onMarkerPress = (place) => {
    Haptics.selectionAsync();
    let distanceText = place.distance + ' km';
    if (location) {
      const d = haversineDistance(
        location.coords.latitude,
        location.coords.longitude,
        place.latitude,
        place.longitude
      );
      distanceText = d >= 1000 ? `${(d / 1000).toFixed(1)} km` : `${Math.round(d)} m`;
    }
    // O card é sempre redefinido ao tocar em um marcador
    setSelectedPlace({ ...place, distanceText }); 

    // Move o mapa para a localização selecionada
    mapRef.current.animateToRegion({
      latitude: place.latitude,
      longitude: place.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    }, 500);

    // Fecha o modal se estiver aberto
    setModalVisible(false);
  };

  const onViewDetails = () => {
    if (selectedPlace) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // Abre o modal APÓS tocar em "Ver Detalhes"
      setModalVisible(true);
    }
  };

  const openRouteInMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o mapa.');
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const visiblePlaces = (filter === 'all' ? [...markets, ...restaurants] : filter === 'market' ? markets : restaurants)
    .filter(place => place.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '⭐'.repeat(fullStars);
    if (hasHalfStar) {
      // Usando uma estrela vazia ou de meia
      // Para simplificar, vou usar 5 estrelas cheias e a nota ao lado
      // para ficar mais parecido com a img2/3.
      stars = '⭐⭐⭐⭐⭐'; 
    }
    return stars;
  };

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Buscando sua localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header com busca */}
      <Animated.View 
        style={[
          styles.searchContainer,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            // Alterado o texto de placeholder
            placeholder="Buscar mercados e restaurantes" 
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterBtnText, filter === 'all' && styles.filterBtnTextActive]}>
              Tudo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterBtn, filter === 'market' && styles.filterBtnActive]}
            onPress={() => setFilter('market')}
          >
            <Text style={[styles.filterBtnText, filter === 'market' && styles.filterBtnTextActive]}>
              Mercados
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterBtn, filter === 'restaurant' && styles.filterBtnActive]}
            onPress={() => setFilter('restaurant')}
          >
            <Text style={[styles.filterBtnText, filter === 'restaurant' && styles.filterBtnTextActive]}>
              Restaurantes
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        // Se o mapa for tocado, limpa o local selecionado
        onPress={() => setSelectedPlace(null)} 
        // Remove a linha para fechar o modal, ele deve ser fechado apenas pelo 'x' ou 'onRequestClose'
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Você está aqui"
          description="Sua localização atual"
        >
          {/* Marcador de localização do usuário com estilo da img2/3 - opcional */}
          <View style={styles.myLocationMarker}>
            <Text style={styles.myLocationIcon}>🎯</Text>
          </View>
        </Marker>

        <Circle
          center={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          radius={SEARCH_RADIUS}
          strokeWidth={1}
          strokeColor="rgba(16, 185, 129, 0.3)"
          fillColor="rgba(16, 185, 129, 0.05)"
        />

        {visiblePlaces.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            onPress={() => onMarkerPress(p)}
          >
            {/* Marcadores personalizados */}
            <View style={p.type === 'market' ? styles.markerGreen : styles.markerRed}>
              <Text style={styles.markerIcon}>
                {p.type === 'market' ? '🛒' : '🍽️'}
              </Text>
            </View>
          </Marker>
        ))}

        {/* Círculo do marcador selecionado para focar a atenção, como na img2 */}
        {selectedPlace && (
          <Circle
            center={{
              latitude: selectedPlace.latitude,
              longitude: selectedPlace.longitude,
            }}
            radius={200}
            strokeWidth={0}
            fillColor="rgba(16, 185, 129, 0.2)"
          />
        )}
      </MapView>

      {/* Card fixo na parte inferior com local selecionado (Estilo da img2) */}
      {selectedPlace && !modalVisible && (
        <View style={styles.bottomCard}>
          <View style={styles.bottomCardHeader}>
            <Text style={styles.bottomCardTitle}>{selectedPlace.title}</Text>
          </View>
          
          <View style={styles.bottomCardInfo}>
            {/* Tipo e Distância */}
            <Text style={styles.bottomCardType}>
              {selectedPlace.type === 'market' ? 'Mercado' : 'Restaurante'}
            </Text>
            <Text style={styles.bottomCardDot}>•</Text>
            <Text style={styles.bottomCardDistance}>{selectedPlace.distanceText} de distância</Text>
          </View>

          <View style={styles.bottomCardRating}>
            <Text style={styles.bottomCardStars}>{renderStars(selectedPlace.rating)}</Text>
            <Text style={styles.bottomCardRatingNumber}>{selectedPlace.rating}</Text>
          </View>

          <TouchableOpacity 
            style={styles.viewDetailsBtn}
            onPress={onViewDetails} // Abre o modal
            activeOpacity={0.8}
          >
            <Text style={styles.viewDetailsBtnText}>Ver Detalhes</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* <--- Linhas removidas para evitar a seleção automática
      {!selectedPlace && (visibleMarkets.length > 0 || visibleRestaurants.length > 0) && (
        setTimeout(() => {
          const firstPlace = visibleMarkets[0] || visibleRestaurants[0];
          if (firstPlace) onMarkerPress(firstPlace);
        }, 100)
      )} 
      --> */}

      {/* Modal de detalhes (Estilo da img3) */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPlace ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Handle */}
                <View style={styles.modalHandle} />

                {/* Header do modal, estilo da img3, sem a imagem de fundo aqui */}
                <View style={styles.modalHeaderImagePlaceholder}>
                    {/* Placeholder para a imagem da img3 */}
                    <Text style={styles.modalImagePlaceholderText}>
                        {selectedPlace.type === 'market' ? 'Produtos Frescos' : 'Comida Deliciosa'}
                    </Text>
                </View>

                <View style={styles.modalBody}>
                    {/* Header: Título e Fechar (O "X") */}
                    <View style={styles.modalTitleRow}>
                        <Text style={styles.modalTitle}>{selectedPlace.title}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalClose}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Info básica (Mercado • 1.2 km away) - Traduzido */}
                    <View style={styles.modalMeta}>
                        <Text style={styles.modalMetaText}>
                            {selectedPlace.type === 'market' ? 'Mercado' : 'Restaurante'}
                        </Text>
                        <Text style={styles.modalMetaDot}>•</Text>
                        <Text style={styles.modalMetaText}>
                           {selectedPlace.distanceText} de distância
                        </Text>
                    </View>

                    {/* Rating (Estrelas e número) - Estilo da img2 */}
                    <View style={styles.modalRatingRow}>
                        <Text style={styles.modalRatingStars}>{renderStars(selectedPlace.rating)}</Text>
                        <Text style={styles.modalRatingNumber}>{selectedPlace.rating}</Text>
                    </View>
                    
                    {/* Botão de Ver Detalhes (Estilo da img2) */}
                    <TouchableOpacity 
                        style={styles.modalViewDetailsBtn} 
                        onPress={() => {/* Ação de ver detalhes, se houver */}}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.modalViewDetailsBtnText}>Ver Detalhes</Text>
                    </TouchableOpacity>

                </View>
                
                {/* Resto do conteúdo do modal (Detalhes da img3) */}
                <View style={styles.modalDetailsContent}>
                    {/* Info básica (Badges com ícones) - Traduzido */}
                    <View style={styles.modalInfoBadges}>
                        <View style={styles.modalBadge}>
                            <Text style={styles.modalBadgeIcon}>🛒</Text>
                            <Text style={styles.modalBadgeText}>
                                {selectedPlace.type === 'market' ? 'Mercado' : 'Restaurante'}
                            </Text>
                        </View>
                        
                        <View style={styles.modalBadge}>
                            <Text style={styles.modalBadgeIcon}>📏</Text>
                            <Text style={styles.modalBadgeText}>{selectedPlace.distanceText}</Text>
                        </View>
                        
                        <View style={styles.modalBadge}>
                            <Text style={styles.modalBadgeIcon}>🕐</Text>
                            <Text style={styles.modalBadgeText}>Aberto até 21h</Text>
                        </View>
                    </View>

                    {/* Rating detalhado - Traduzido */}
                    <View style={styles.ratingSection}>
                        <Text style={styles.ratingNumber}>{selectedPlace.rating}</Text>
                        <View style={styles.ratingStars}>
                            <Text style={styles.ratingStarsText}>
                                {renderStars(selectedPlace.rating)}
                            </Text>
                            <Text style={styles.ratingReviews}>120 avaliações</Text>
                        </View>
                    </View>

                    {/* Barras de rating */}
                    <View style={styles.ratingBars}>
                        {[
                            { stars: 5, percent: 50 },
                            { stars: 4, percent: 30 },
                            { stars: 3, percent: 14 },
                            { stars: 2, percent: 4 },
                            { stars: 1, percent: 2 },
                        ].map((item) => (
                            <View key={item.stars} style={styles.ratingBar}>
                                <Text style={styles.ratingBarLabel}>{item.stars}</Text>
                                <View style={styles.ratingBarTrack}>
                                    <View style={[styles.ratingBarFill, { width: `${item.percent}%` }]} />
                                </View>
                                <Text style={styles.ratingBarPercent}>{item.percent}%</Text>
                            </View>
                        ))}
                    </View>

                    {/* Botão de ação - Traduzido */}
                    <TouchableOpacity
                        style={styles.mapButton}
                        onPress={() => openRouteInMaps(selectedPlace.latitude, selectedPlace.longitude)}
                    >
                        <Text style={styles.mapButtonIcon}>🗺️</Text>
                        <Text style={styles.mapButtonText}>Abrir no Google Maps</Text>
                    </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (
              <ActivityIndicator size="large" color="#10B981" />
            )}
          </View>
        </View>
      </Modal>

      {generating && (
        <View style={styles.generatingOverlay}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      )}
    </View>
  );
}