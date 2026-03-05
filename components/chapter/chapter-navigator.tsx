import { getDetailManga } from '@/api/otruyen/get-detail-manga'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Error from '../status/error'
import Loading from '../status/loading'

interface ChapterNavigatorProps {
  mangaId: string
  currentChapterId: string // chapter_api_data, tại lười đổi tên :v
}

const ChapterNavigator: React.FC<ChapterNavigatorProps> = ({ mangaId, currentChapterId }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const router = useRouter()
  // const limit = 500
  const { data: manga, isLoading, isError } = useQuery(getDetailManga({ slug: mangaId }))
  const chapters = useMemo(() => manga?.data?.item?.chapters[0].server_data ?? [], [manga])
  const currentIndex = useMemo(
    () => chapters.findIndex(c => c.chapter_api_data === currentChapterId),
    [chapters, currentChapterId]
  )

  const currentChapter = chapters[currentIndex]
  const currentLabel = currentChapter ? `Chapter ${currentChapter.chapter_name ?? 'Oneshot'}` : 'Danh sách Chapter'

  const navigateTo = (index: number) => {
    const chapter = chapters[index]
    if (!chapter) return
    router.replace({
      pathname: `/reader/[id]`,
      params: { id: chapter.chapter_api_data, slug: mangaId, chapter_name: chapter.chapter_name }
    })
  }

  return (
    <View style={styles.footer}>
      {/* Nút Lùi */}
      <TouchableOpacity style={styles.button} disabled={currentIndex <= 0} onPress={() => navigateTo(currentIndex - 1)}>
        <Ionicons name='arrow-back' size={20} color={currentIndex <= 0 ? '#666' : '#fff'} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.text}>{currentLabel}</Text>
      </TouchableOpacity>

      {/* Nút Tiến */}
      <TouchableOpacity
        style={styles.button}
        disabled={currentIndex < 0 || currentIndex >= chapters.length - 1}
        onPress={() => navigateTo(currentIndex + 1)}
      >
        <Ionicons
          name='arrow-forward'
          size={20}
          color={currentIndex < 0 || currentIndex >= chapters.length - 1 ? '#666' : '#fff'}
        />
      </TouchableOpacity>

      {/* Modal Danh Sách Chapter */}
      <Modal visible={modalVisible} transparent animationType='slide' onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {isLoading ? (
              <Loading />
            ) : isError || !chapters.length ? (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Error />
                <Text style={{ color: '#fff' }}>Không có chapter nào</Text>
              </View>
            ) : (
              <FlatList
                data={chapters}
                keyExtractor={item => item.chapter_api_data}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.chapterItem, item?.chapter_api_data === currentChapterId && styles.activeItem]}
                    onPress={() => {
                      setModalVisible(false)
                      router.replace({
                        pathname: `/reader/[id]`,
                        params: { id: item.chapter_api_data, slug: mangaId }
                      })
                    }}
                  >
                    <Text style={styles.chapterText}>Chapter {item.chapter_name ?? 'Oneshot'}</Text>
                  </TouchableOpacity>
                )}
                // ListFooterComponent={
                //   <ActivityIndicator size='small' color='#60a5fa' style={{ marginVertical: 12 }} />
                // }
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ChapterNavigator

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingVertical: 8
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  text: {
    color: '#fff',
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  modalContent: {
    maxHeight: '90%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 12
  },
  chapterItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  activeItem: {
    backgroundColor: '#15803d'
  },
  chapterText: {
    color: '#fff',
    fontWeight: '500'
  },
  date: {
    color: '#9ca3af',
    fontSize: 12
  }
})
