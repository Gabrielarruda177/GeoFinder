// styles.js - Splash Screen
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EDF2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  
  card: {
    width: width - 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },

  // Logo Header (estilo LocalFinds)
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#10B981',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 24,
  },
  logoHeaderText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },

  // Logo principal (sua logo)
  logoContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FEF3E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  logo: {
    width: 160,
    height: 160,
  },

  // Textos
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 40,
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 16,
    paddingHorizontal: 8,
  },

  // Loading
  loadingContainer: {
    marginTop: 8,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
});