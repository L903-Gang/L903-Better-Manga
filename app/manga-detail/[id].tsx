import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getDetailManga } from '@/api/otruyen/get-detail-manga'
import MangaDetailScreen from '../screen/manga-detail-screen'
import Loading from '@/components/status/loading'
import Error from '@/components/status/error'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { addOrUpdateHistory } from '@/hooks/use-read-history'

export default function MangaDetailPageWrapper() {
  return <MangaDetailContent />
}

function MangaDetailContent() {
  const { id } = useLocalSearchParams()
  const slug_manga = String(id)
  const backgroundColor = '#0f172a'

  const { data: manga, isFetching, isError } = useQuery(getDetailManga({ slug: slug_manga }))

  // lưu lại
  useEffect(() => {
    if (manga?.data) {
      addOrUpdateHistory({
        slug: manga.data.item.slug,
        name: manga.data.item.name,
        image: ''
      })
    }
  }, [manga])

  if (isFetching) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Loading />
      </View>
    )
  }

  if (isError || !manga?.data) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Error />
      </View>
    )
  }

  return (
    <SafeAreaView edges={['bottom']} style={[styles.container, { flex: 1, backgroundColor }]}>
      <MangaDetailScreen manga={manga.data} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 32
  }
})
