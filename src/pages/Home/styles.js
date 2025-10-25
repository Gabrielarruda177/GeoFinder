// styles.js - Home Screen
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    // Loading
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },

    // Search Container (Header)
    searchContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: '#FFFFFF',
        // Ajuste para deixar a barra de busca mais limpa (estilo da img2)
        paddingTop: 50, 
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomLeftRadius: 0, // Removendo bordas arredondadas na parte inferior
        borderBottomRightRadius: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 12, // Espaço entre a busca e os botões de filtro
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
    },

    // Filter Buttons
    filterButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    filterBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    filterBtnActive: {
        backgroundColor: '#10B981',
    },
    filterBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    filterBtnTextActive: {
        color: '#FFFFFF',
    },

    // Map
    map: {
        flex: 1,
    },

    // Custom Markers
    markerGreen: {
        width: 36,
        height: 36,
        backgroundColor: '#10B981',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    markerRed: {
        width: 36,
        height: 36,
        backgroundColor: '#EF4444',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    markerIcon: {
        fontSize: 18,
    },
    // Novo estilo para o marcador de localização do usuário (como um ponto de foco)
    myLocationMarker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#10B981',
    },
    myLocationIcon: {
        fontSize: 20,
    },


    // Bottom Card (Preview - Estilo da img2)
    bottomCard: {
        position: 'absolute',
        bottom: 0, // Ancorado na parte inferior
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24, // Bordas arredondadas apenas no topo
        borderTopRightRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    bottomCardHeader: {
        marginBottom: 8,
    },
    bottomCardTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1F2937',
    },
    bottomCardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    bottomCardType: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    bottomCardDot: {
        fontSize: 14,
        color: '#9CA3AF',
        marginHorizontal: 8,
    },
    bottomCardDistance: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    bottomCardRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    bottomCardStars: {
        fontSize: 18,
        marginRight: 8,
        color: '#FFD700', // Cor amarela para as estrelas
    },
    bottomCardRatingNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    viewDetailsBtn: {
        backgroundColor: '#10B981',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%', // Ocupa toda a largura
    },
    viewDetailsBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
        // Padding superior removido daqui para ser aplicado no corpo interno
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12, // Colocado no topo do modal content
        marginBottom: 16, 
    },

    // Imagem do modal (simulando a img3)
    modalHeaderImagePlaceholder: {
        width: '100%',
        height: 180, // Altura da imagem de cabeçalho
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        // Estilo da imagem de fundo com bordas arredondadas (como na img3)
        borderTopLeftRadius: 24, 
        borderTopRightRadius: 24,
        // Remover a margem inferior para o corpo ficar colado
        marginBottom: 0, 
    },
    modalImagePlaceholderText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#6B7280',
    },

    // Corpo do modal (as 3 linhas iniciais da img2)
    modalBody: {
        paddingHorizontal: 24,
        paddingTop: 16,
        backgroundColor: '#FFFFFF',
    },
    modalTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        flex: 1,
    },
    modalClose: {
        fontSize: 24,
        color: '#9CA3AF',
        fontWeight: '600',
        paddingLeft: 12,
    },
    modalMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalMetaText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    modalMetaDot: {
        fontSize: 14,
        color: '#9CA3AF',
        marginHorizontal: 8,
    },
    modalRatingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalRatingStars: {
        fontSize: 20,
        marginRight: 8,
        color: '#FFD700', 
    },
    modalRatingNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    modalViewDetailsBtn: {
        backgroundColor: '#10B981',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
    },
    modalViewDetailsBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // Conteúdo de detalhes do modal (a partir da img3)
    modalDetailsContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    
    // Info Badges
    modalInfoBadges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24, // Espaço após os badges
    },
    modalBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    modalBadgeIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    modalBadgeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
    },

    // Rating Section (Barra de progresso de rating da img3)
    ratingSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    ratingNumber: {
        fontSize: 48,
        fontWeight: '700',
        color: '#1F2937',
        marginRight: 16,
    },
    ratingStars: {
        flex: 1,
    },
    ratingStarsText: {
        fontSize: 20,
        marginBottom: 4,
        color: '#FFD700',
    },
    ratingReviews: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },

    // Rating Bars
    ratingBars: {
        marginBottom: 24,
    },
    ratingBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingBarLabel: {
        width: 12,
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
        marginRight: 12,
    },
    ratingBarTrack: {
        flex: 1,
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
        marginRight: 12,
    },
    ratingBarFill: {
        height: '100%',
        backgroundColor: '#10B981',
        borderRadius: 4,
    },
    ratingBarPercent: {
        width: 40,
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
        textAlign: 'right',
    },

    // Map Button
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#10B981',
        paddingVertical: 16,
        borderRadius: 14,
        marginBottom: 10,
    },
    mapButtonIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    mapButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // Generating Overlay
    generatingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
});