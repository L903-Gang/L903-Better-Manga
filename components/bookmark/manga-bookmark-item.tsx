import { removeBookmark } from '@/api/otruyen/bookmark/bookmark'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface BookmarkItemProps {
  slug: string
  name: string
  image?: string
  chapter_name?: string
  chapter_url?: string
  onRefetch?: () => void // callback refetch sau khi xóa
}

const MangaBookmarkItem: React.FC<BookmarkItemProps> = ({
  slug,
  name,
  image,
  chapter_name,
  chapter_url,
  onRefetch
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [removing, setRemoving] = useState(false)

  const coverImageUrl = image?.startsWith('http') ? image : `https://img.otruyenapi.com/uploads/comics/${image}`

  const handleCardPress = () => {
    setShowActionModal(true)
  }
  const handleViewInfo = () => {
    setShowActionModal(false)
    if (slug.trim()) {
      router.push(`/manga-detail/${slug}`)
    }
  }

  const handleContinue = () => {
    setShowActionModal(false)
    if (chapter_url) {
      router.push({
        pathname: `/reader/[id]`,
        params: { id: chapter_url, slug: slug, chapter_name: chapter_name }
      })
    }
  }

  const handleRemove = async () => {
    try {
      setRemoving(true)
      await removeBookmark(slug)
      setShowDeleteModal(false)
      onRefetch?.() // gọi refetch lại danh sách
    } catch (error) {
      console.error('Lỗi khi xóa bookmark:', error)
    } finally {
      setRemoving(false)
    }
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.8}>
        <View style={[styles.imageWrapper, styles.imageLarge]}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color='#ccc' />
            </View>
          )}
          <Image
            source={{
              uri: coverImageUrl || 'https://via.placeholder.com/200x300.png?text=No+Image'
            }}
            style={styles.image}
            resizeMode='cover'
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />

          <TouchableOpacity style={styles.removeButton} onPress={() => setShowDeleteModal(true)}>
            <Text style={styles.removeText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.textWrapper}>
          <Text style={styles.title} numberOfLines={2}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Coi thông tin */}
      <Modal
        transparent
        visible={showActionModal}
        animationType='fade'
        onRequestClose={() => setShowActionModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowActionModal(false)}>
          <View style={[styles.actionModal, { paddingTop: 20 }]}>
            <Text style={styles.modalTitleAction}>{name}</Text>

            <TouchableOpacity
              style={[styles.actionButton, !chapter_url && { backgroundColor: '#475569', opacity: 0.6 }]}
              disabled={!chapter_url}
              onPress={handleContinue}
            >
              <Text style={styles.actionButtonText}>
                {chapter_url && chapter_name ? `Chapter ${chapter_name}` : 'Chưa có lịch sử đọc'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleViewInfo}>
              <Text style={styles.actionButtonText}>Xem thông tin</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showDeleteModal}
        transparent
        animationType='fade'
        onRequestClose={() => setShowDeleteModal(false)}
        onDismiss={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>≧☉_☉≦</Text>
            <Text style={styles.modalText}>Xóa khỏi danh sách yêu thích hả?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
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
  imageWrapper: {
    position: 'relative'
  },
  imageLarge: {
    width: '100%',
    height: 220,
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
  chapterText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4
  },

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
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 8
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
    fontWeight: '600',
    textAlign: 'center'
  },

  actionModal: {
    width: '80%',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 20
  },
  modalTitleAction: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  actionButton: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8
  },
  actionButtonText: {
    textAlign: 'center',
    color: '#f1f5f9',
    fontSize: 16
  }
})
