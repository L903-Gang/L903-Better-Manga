import React, { useState, useMemo, useEffect } from 'react'
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  RefreshControl
} from 'react-native'
import { useInfiniteQuery } from '@tanstack/react-query'
import { request } from '@/utils/request'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import Loading from '@/components/status/loading'
import Error from '@/components/status/error'
import MangaItem from '@/components/manga/manga-items'
import FilterSelection from '@/components/filter/filter-selection'
import { ItemsResponseData } from '@/api/otruyen/list/get-list-by-category'
import { otruyen } from '@/utils/env'

// const limit = 20

export default function FilterMangaScreen() {
  const { id } = useLocalSearchParams()
  const slug = String(id)
  const [selectedTags, setSelectedTags] = useState(slug)
  const [showFilter, setShowFilter] = useState(false)

  // Handle back button
  const navigation = useNavigation()
  useEffect(() => {
    const backAction = () => {
      if (showFilter) {
        setShowFilter(false)
        return true
      } else if (navigation.canGoBack()) {
        navigation.goBack()
        return true
      }
      return false
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => backHandler.remove()
  }, [showFilter, navigation])

  // Infinite Query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error, refetch, isRefetching } =
    useInfiniteQuery({
      queryKey: ['get-list-by-category', selectedTags],
      queryFn: ({ pageParam = 1 }) =>
        request<ItemsResponseData>(
          `v1/api/the-loai/${selectedTags}`,
          'GET',
          { page: pageParam },
          {},
          // import sẵn: otruyen
          otruyen
        ),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const totalPages = lastPage.data?.params?.pagination?.pageRanges ?? 1
        const currentPage = lastPage.data?.params?.pagination?.currentPage ?? 1
        return currentPage < totalPages ? currentPage + 1 : undefined
      }
    })

  // Gộp list từ các page
  const mangas = useMemo(() => {
    return data?.pages.flatMap(page => page.data?.items ?? []) ?? []
  }, [data])

  // Thêm placeholder nếu số lẻ
  const displayedMangas = useMemo(() => {
    if (!mangas || mangas.length === 0) return []
    const list = [...mangas]
    const isOdd = list.length % 2 !== 0
    if (isOdd) list.push({ _id: 'placeholder' } as any)
    return list
  }, [mangas])

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size='large' color='#60a5fa' />
          <Text style={styles.loadingText}>Đang tải thêm...</Text>
        </View>
      )
    }
    if (!hasNextPage && mangas.length > 0) {
      return (
        <View style={styles.endFooter}>
          <Text style={styles.endText}>Đã hiển thị tất cả kết quả</Text>
        </View>
      )
    }
    return null
  }

  if (isError) {
    console.log(error)
    return <Error />
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View key={'showFilter'} style={{ paddingVertical: 12, alignItems: 'center' }}>
        <TouchableOpacity style={styles.toggleBtn} onPress={() => setShowFilter(prev => !prev)}>
          <Text style={styles.toggleText}>{showFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}</Text>
        </TouchableOpacity>
      </View>

      {showFilter && (
        <View style={styles.fullScreenFilter}>
          <FilterSelection
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            setShowFilter={setShowFilter}
          />
        </View>
      )}

      {!showFilter &&
        (isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={displayedMangas}
            keyExtractor={item => item._id?.toString()}
            numColumns={2}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor='#fff'
                colors={['#60a5fa']}
                progressBackgroundColor='#1e293b'
              />
            }
            columnWrapperStyle={displayedMangas.length > 0 ? styles.row : undefined}
            renderItem={({ item }) => {
              if (item._id === 'placeholder') {
                return <View style={[styles.gridItem, { backgroundColor: 'transparent' }]} />
              }
              return (
                <View style={styles.gridItem}>
                  <MangaItem manga={item} />
                </View>
              )
            }}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        ))}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  toggleBtn: {
    paddingVertical: 12,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    width: '60%'
  },
  toggleText: { color: '#fff', fontWeight: '600' },
  fullScreenFilter: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  row: { justifyContent: 'space-between' },
  gridItem: { flex: 1, margin: 4 },
  loadingFooter: { padding: 20, alignItems: 'center' },
  loadingText: { color: '#e5e7eb', marginTop: 8 },
  endFooter: { padding: 20, alignItems: 'center' },
  endText: { color: '#6b7280', fontStyle: 'italic' }
})
