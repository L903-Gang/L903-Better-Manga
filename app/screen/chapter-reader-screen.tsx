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
  chapterId: string // chapter_api_data, tại lười đổi tên :v
  slug: string
}

const ChapterReaderScreen: React.FC<ChapterReaderScreenProps> = ({ chapterId, slug }) => {
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
      url: `${domain}/${chapter_path}/${img.image_file}`
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
            <ChapterImage uri={item.url ?? '@/assets/images/xin-loi-ouguri-cap-cua-toi-an-het-anh-roi.jpg'} />
          </TouchableOpacity>
        )}
      />
      <View style={styles.footer}>
        <ChapterNavigator key={chapterId} mangaId={slug} currentChapterId={chapterId} />
      </View>

      <Modal
        onModalShow={() => ToastAndroid.show('Vuốt xuống để thoát', ToastAndroid.SHORT)}
        isVisible={isModalVisible}
        style={{ margin: 0 }}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
      >
        <ImageViewer
          // key={imageUrls + selectedIndex}
          imageUrls={imageUrls}
          index={selectedIndex}
          enableSwipeDown
          enableImageZoom
          saveToLocalByLongPress={false}
          onSwipeDown={() => setModalVisible(false)}
          backgroundColor='#000'
          loadingRender={() => (
            <View style={[styles.container]}>
              <Loading />
            </View>
          )}
        />
      </Modal>
    </SafeAreaView>
  )
}

export default ChapterReaderScreen

const ChapterImage: React.FC<{ uri: string }> = ({ uri }) => {
  const [loading, setLoading] = useState(true)
  const [ratio, setRatio] = useState<number | null>(null)
  const tempHeight = width * (ratio ?? 1.5)

  useEffect(() => {
    Image.getSize(
      uri,
      (w, h) => setRatio(h / w),
      () => setRatio(1.5) // fallback nếu không đo được
    )
  }, [uri])

  return (
    <View style={[styles.wrapper, { height: tempHeight }]}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size='large' color='#60a5fa' />
        </View>
      )}
      {ratio && (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            { height: width * ratio } // tự co theo tỷ lệ
          ]}
          resizeMode='contain'
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  image: { width: width * 0.95, height: undefined, aspectRatio: 1 / 1.5, resizeMode: 'contain' },
  footer: { height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
