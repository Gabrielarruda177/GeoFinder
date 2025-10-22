import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 20,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E3A8A',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 5,
  },
  inputContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  map: {
    flex: 1,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 40,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
});
