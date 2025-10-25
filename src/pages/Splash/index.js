import React, { useEffect, useRef } from 'react';
import { View, Image, Text, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

const { width } = Dimensions.get('window');

export default function Splash() {
  const navigation = useNavigation();
  
  // Animações
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    // Sequência de animações
    Animated.sequence([
      // 1. Logo aparece com escala e rotação
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // 2. Título aparece
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(titleTranslateY, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // 3. Subtítulo aparece
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(subtitleTranslateY, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Animação de pulso contínuo no logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animação shimmer no título
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Timer para navegação
    const timer = setTimeout(() => {
      // Animação de saída suave
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.replace('Home');
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const logoRotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={styles.container}>
      {/* Círculos decorativos de fundo */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      <View style={styles.backgroundCircle3} />

      {/* Logo com animações */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [
              { scale: Animated.multiply(logoScale, pulseAnim) },
              { rotate: logoRotateInterpolate },
            ],
          },
        ]}
      >
        <Image 
          source={require('../../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Título com shimmer effect */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          },
        ]}
      >
        <Text style={styles.title}>GeoFinder</Text>
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX: shimmerTranslate }],
            },
          ]}
        />
      </Animated.View>

      {/* Subtítulo */}
      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: subtitleOpacity,
            transform: [{ translateY: subtitleTranslateY }],
          },
        ]}
      >
        Encontre lugares próximos com facilidade
      </Animated.Text>

      {/* Indicador de loading */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingDot} />
        <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
        <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
      </View>
    </View>
  );
}