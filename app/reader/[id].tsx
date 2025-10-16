import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import ChapterReaderScreen from '../screen/chapter-reader-screen'
import { useLocalSearchParams } from 'expo-router'
import { updateChapterInfoIfExists } from '@/hooks/use-read-history'

export default function MangaReaderPageWrapper() {
  return <MangaReaderContent />
}

function MangaReaderContent() {
  const { id, slug, chapter_name } = useLocalSearchParams()
  const chapterId = String(id) // chapter_api_data, tại lười đổi tên :v
  const slugManga = String(slug)
  const chapterName = String(chapter_name)
  const backgroundColor = '#0f172a'

  useEffect(() => {
    if (slugManga && chapterId) {
      updateChapterInfoIfExists(slugManga, chapterName, chapterId)
    }
  }, [slugManga, chapterName, chapterId])

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
