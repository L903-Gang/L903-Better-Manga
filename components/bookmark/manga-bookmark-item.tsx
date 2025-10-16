import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Modal } from 'react-native'
import { useRouter } from 'expo-router'
import { removeBookmark } from '@/api/otruyen/bookmark/bookmark'

interface BookmarkItemProps {
  slug: string
  name: string
  image?: string
  onRefetch?: () => void // callback refetch sau khi xóa
}

const MangaBookmarkItem: React.FC<BookmarkItemProps> = ({ slug, name, image, onRefetch }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [removing, setRemoving] = useState(false)

  const coverImageUrl = image?.startsWith('http') ? image : `https://img.otruyenapi.com/uploads/comics/${image}`

  const handlePress = () => {
    if (slug.trim()) {
      router.push(`/manga-detail/${slug}`)
    }
  }

  const handleRemove = async () => {
    try {
      setRemoving(true)
      await removeBookmark(slug)
      setShowModal(false)
      onRefetch?.() // gọi refetch lại danh sách
    } catch (error) {
      console.error('Lỗi khi xóa bookmark:', error)
    } finally {
      setRemoving(false)
    }
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View style={[styles.imageWrapper, styles.imageLarge]}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color='#ccc' />
            </View>
          )}
          <Image
            source={{
              uri: coverImageUrl || '@/assets/images/xin-loi-ouguri-cap-cua-toi-an-het-anh-roi.jpg'
            }}
            style={styles.image}
            resizeMode='cover'
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />

          <TouchableOpacity style={styles.removeButton} onPress={() => setShowModal(true)}>
            <Text style={styles.removeText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.textWrapper}>
          <Text style={styles.title} numberOfLines={2}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType='fade'
        onRequestClose={() => setShowModal(false)}
        onDismiss={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>≧☉_☉≦</Text>
            <Text style={styles.modalText}>Xóa khỏi danh sách yêu thích hả?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
                disabled={removing}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>{removing ? 'Đang xóa...' : 'Không'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleRemove}
                disabled={removing}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>{removing ? 'Đang xóa...' : 'Hủy diệt'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default React.memo(MangaBookmarkItem)

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    height: 290,
    width: 'auto'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 8
  },
  imageWrapper: {
    position: 'relative'
  },
  imageLarge: {
    width: '100%',
    height: 230,
    maxWidth: 200,
    alignSelf: 'center'
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16
  },
  textWrapper: {
    padding: 8
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4
  },

  // Nút X
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ef4444',
    borderRadius: 20,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  removeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -2
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBox: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    width: '80%'
  },
  modalText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  cancelButton: {
    backgroundColor: '#475569'
  },
  confirmButton: {
    backgroundColor: '#ef4444'
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600'
  }
})
