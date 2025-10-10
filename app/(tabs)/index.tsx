import { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import MangaGridByTagId from '@/components/manga/manga-grid-by-tag-id'
import SlideMangaCardFullWidth from '@/components/slider/manga-slider'
import MangaItemSlider from '@/components/slider/manga-item-slider'

export default function HomeScreen() {
  const [showSecond, setShowSecond] = useState(false)
  const [showThird, setShowThird] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t1 = setTimeout(() => setShowSecond(true), 1000)
    const t2 = setTimeout(() => setShowThird(true), 2000)

    const interval = setInterval(() => {
      if (showSecond && showThird) {
        setLoading(false)
        clearInterval(interval)
      }
    }, 200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearInterval(interval)
    }
  }, [showSecond, showThird])

  return (
    <View style={{ flex: 1, backgroundColor: '#000000ff' }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: '#000000ff', paddingHorizontal: 4 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Slider */}
        <SlideMangaCardFullWidth id='home-slider' />

        <View
          style={{
            marginTop: 20,
            padding: 8,
            backgroundColor: '#111',
            borderRadius: 12
          }}
        >
          <MangaGridByTagId title='Đang phát hành' type={'ang-phat-hanh'} />
          <View style={styles.row}>
            {showSecond && (
              <View style={styles.sliderWrapper}>
                <MangaItemSlider title='Sắp ra mắt' type='sap-ra-mat' />
              </View>
            )}
            {showThird && (
              <View style={styles.sliderWrapper}>
                <MangaItemSlider title='Hoàn thành' type='hoan-thanh' />
              </View>
            )}
          </View>
        </View>

        {loading && (
          <ThemedView style={styles.loading}>
            <ThemedText type='default'>Đang tải...</ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 12
  },
  loading: {
    alignItems: 'center',
    marginVertical: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10
  },
  sliderWrapper: {
    flex: 1
  }
})
