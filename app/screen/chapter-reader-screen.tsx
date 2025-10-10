import React, { useState, useEffect } from 'react'
import {
  View,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,
  ToastAndroid
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Modal from 'react-native-modal'
import ImageViewer from 'react-native-image-zoom-viewer'
import ChapterNavigator from '@/components/chapter/chapter-navigator'
import Loading from '@/components/status/loading'
import { fetchChapterData } from '@/api/otruyen/chapter/get-detail-chapter'

const { width } = Dimensions.get('window')

interface ChapterReaderScreenProps {
  chapterId: string
  slug: string
  index: number
}

const ChapterReaderScreen: React.FC<ChapterReaderScreenProps> = ({ chapterId, slug, index }) => {
  const [chapterData, setChapterData] = useState<any>(null)
  const [isModalVisible, setModalVisible] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchChapterData(chapterId)
      if (res.status === 'success') {
        setChapterData(res.data)
      } else {
        ToastAndroid.show(`Lỗi: ${res.message}`, ToastAndroid.SHORT)
      }
      setLoading(false)
    }
    fetchData()
  }, [chapterId])

  const openModal = (index: number) => {
    setSelectedIndex(index)
    setModalVisible(true)
  }

  const domain = chapterData?.data?.domain_cdn
  const chapter_path = chapterData?.data?.item?.chapter_path
  const chapter_image = chapterData?.data?.item?.chapter_image
  const imageUrls =
    chapter_image?.map((img: any) => ({
      url: `${domain}/${chapter_path}/${img.image_file}`,
    })) ?? []

  useEffect(() => {
    const backAction = () => {
      if (isModalVisible) {
        setModalVisible(false)
        return true
      }
      return false
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => backHandler.remove()
  }, [isModalVisible])

  if (loading) {
    return (
      <View style={[styles.container]}>
        <Loading />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'top']}>
      <FlatList
        data={imageUrls}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity activeOpacity={0.9} onPress={() => openModal(index)}>
            <ChapterImage uri={item.url} />
          </TouchableOpacity>
        )}
      />

      <Modal
        onModalShow={() => ToastAndroid.show('Vuốt xuống để thoát', ToastAndroid.SHORT)}
        isVisible={isModalVisible}
        style={{ margin: 0 }}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
      >
        <ImageViewer
          imageUrls={imageUrls}
          index={selectedIndex}
          enableSwipeDown
          enableImageZoom
          saveToLocalByLongPress={false}
          onSwipeDown={() => setModalVisible(false)}
          backgroundColor='#000'
          loadingRender={() => <View style={[styles.container]}>
            <Loading />
          </View>}
        />
      </Modal>
    </SafeAreaView>
  )
}


export default ChapterReaderScreen

const ChapterImage: React.FC<{ uri: string }> = ({ uri }) => {
  const [loading, setLoading] = useState(true)

  return (
    <View style={styles.wrapper}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size='large' color='#60a5fa' />
        </View>
      )}
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode='contain'
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  image: { width: width * 0.95, height: undefined, aspectRatio: 1 / 1.5 },
  footer: { height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  wrapper: {
    width: '100%',
    aspectRatio: 1 / 1.4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }
})
