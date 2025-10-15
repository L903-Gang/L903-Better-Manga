import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useRouter } from 'expo-router'

interface ChapterItem {
  filename: string
  chapter_name: string
  chapter_title: string
  chapter_api_data: string
}

interface ServerData {
  server_name: string
  server_data: ChapterItem[]
}

interface MangaChaptersListProps {
  chapters: ServerData[]
  slug: string
}

const MangaChaptersList: React.FC<MangaChaptersListProps> = ({ chapters, slug }) => {
  const router = useRouter()
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [visibleChapters, setVisibleChapters] = useState<ChapterItem[]>([])
  const [page, setPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const limit = 20

  const allChapters = useMemo(() => {
    const merged = chapters.flatMap(server => server.server_data)
    const sorted = [...merged].sort((a, b) =>
      sortOrder === 'asc'
        ? Number(a.chapter_name) - Number(b.chapter_name)
        : Number(b.chapter_name) - Number(a.chapter_name)
    )
    return sorted
  }, [chapters, sortOrder])

  useEffect(() => {
    setPage(1)
    setVisibleChapters(allChapters.slice(0, limit))
  }, [allChapters])

  const handleLoadMore = () => {
    if (visibleChapters.length >= allChapters.length || isLoadingMore) return
    setIsLoadingMore(true)

    setTimeout(() => {
      const nextPage = page + 1
      const newData = allChapters.slice(0, nextPage * limit)
      setVisibleChapters(newData)
      setPage(nextPage)
      setIsLoadingMore(false)
    }, 500)
  }

  const renderFooter = () => {
    if (isLoadingMore)
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size='large' color='#60a5fa' />
          <Text style={styles.loadingText}>Đang tải thêm chapters...</Text>
        </View>
      )
    if (visibleChapters.length >= allChapters.length)
      return (
        <View style={styles.endFooter}>
          <Text style={styles.endText}>Đã tải hết chapters</Text>
        </View>
      )
    return null
  }

  return (
    <View style={styles.container}>
      {/* Bộ lọc */}
      <View style={styles.filterRow}>
        <Picker
          selectedValue={sortOrder}
          onValueChange={v => setSortOrder(v)}
          style={[styles.picker, { height: 'auto' }]}
          dropdownIconColor='#fff'
        >
          <Picker.Item label='Cũ nhất' value='asc' />
          <Picker.Item label='Mới nhất' value='desc' />
        </Picker>
      </View>

      {/* Danh sách */}
      <FlatList
        data={visibleChapters}
        scrollEnabled={false}
        keyExtractor={item => item.chapter_api_data}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chapterItem}
            onPress={() =>
              router.push({
                pathname: `/reader/[id]`,
                params: { id: item?.chapter_api_data, slug: slug }
              })
            }
          >
            <Text style={styles.chapterText}>
              Chapter {item.chapter_name}
              {item.chapter_title ? <Text>: {item.chapter_title}</Text> : null}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

export default MangaChaptersList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 12
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingTop: 10
  },
  picker: {
    flex: 1,
    color: '#fff',
    backgroundColor: '#1e293b',
    marginHorizontal: 4
  },
  chapterItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    marginBottom: 8
  },
  chapterText: {
    paddingTop: 4,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center'
  },
  loadingText: {
    color: '#e5e7eb',
    marginTop: 12
  },
  endFooter: {
    paddingVertical: 20,
    alignItems: 'center'
  },
  endText: {
    color: '#6b7280',
    fontStyle: 'italic'
  }
})
