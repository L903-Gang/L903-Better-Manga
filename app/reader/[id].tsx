import { isBookmarked, updateBookmarkChapter } from '@/api/otruyen/bookmark/bookmark'
import { updateChapterInfoIfExists } from '@/hooks/use-read-history'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import ChapterReaderScreen from '../screen/chapter-reader-screen'

export default function MangaReaderPageWrapper() {
  return <MangaReaderContent />
}

function MangaReaderContent() {
  const { id, slug, chapter_name } = useLocalSearchParams()
  const chapterId = String(id) // chapter_url tại lười đổi tên
  const slugManga = String(slug)
  const chapterName = String(chapter_name)
  const backgroundColor = '#0f172a'

  useEffect(() => {
    if (slugManga && chapterId) {
      // local storage
      updateChapterInfoIfExists(slugManga, chapterName, chapterId)

      // check bookmark, có thì lưu tiếp url
      isBookmarked(slugManga)
        .then(isFav => {
          if (isFav) {
            // truyền chapter_url
            updateBookmarkChapter(slugManga, chapterName, chapterId).catch(err =>
              console.error('Lỗi cập nhật tiến độ lên DB:', err)
            )
          }
        })
        .catch(err => console.error('Lỗi check bookmark:', err))
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
