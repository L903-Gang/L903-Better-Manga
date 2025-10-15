import React from 'react'
import { View, StyleSheet } from 'react-native'
import ChapterReaderScreen from '../screen/chapter-reader-screen'
import { useLocalSearchParams } from 'expo-router'

export default function MangaReaderPageWrapper() {
  return <MangaReaderContent />
}

function MangaReaderContent() {
  const { id, slug } = useLocalSearchParams()
  const chapterId = String(id)
  const slugManga = String(slug)

  const backgroundColor = '#0f172a'

  return (
    <View style={[styles.container, { flex: 1, backgroundColor }]}>
      <ChapterReaderScreen chapterId={chapterId} slug={slugManga} />
    </View>
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
