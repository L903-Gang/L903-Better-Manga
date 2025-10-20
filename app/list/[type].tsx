import React, { useMemo, useCallback } from 'react'
import { View, FlatList, ActivityIndicator, Text, StyleSheet, RefreshControl } from 'react-native'
import { useInfiniteQuery } from '@tanstack/react-query'
import { request } from '@/utils/request'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import Loading from '@/components/status/loading'
import Error from '@/components/status/error'
import MangaItem from '@/components/manga/manga-items'
import { ItemsResponseData } from '@/api/otruyen/list/get-list-by-category'
import { otruyen } from '@/utils/env'

// const limit = 20

export default function FilterMangaScreen() {
  const { type, title } = useLocalSearchParams()
  const typelist = String(type)
  const headTitle = String(title)

  // Infinite Query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error, refetch, isRefetching } =
    useInfiniteQuery({
      queryKey: ['get-list-by-type', typelist],
      queryFn: ({ pageParam = 1 }) =>
        request<ItemsResponseData>(`v1/api/danh-sach/${typelist}`, 'GET', { page: pageParam }, {}, otruyen),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const totalPages = lastPage.data?.params?.pagination?.pageRanges ?? 1
        const currentPage = lastPage.data?.params?.pagination?.currentPage ?? 1
        return currentPage < totalPages ? currentPage + 1 : undefined
      }
    })

  const onRefresh = useCallback(async () => {
    try {
      await refetch()
    } finally {
    }
  }, [refetch])

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
      {headTitle && <Text>{headTitle}</Text>}
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={displayedMangas}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
              tintColor='#fff'
              colors={['#60a5fa']}
              progressBackgroundColor='#1e293b'
            />
          }
          keyExtractor={item => item._id?.toString()}
          numColumns={2}
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
          ListEmptyComponent={<Text style={styles.emptyText}>Không có truyện nào.</Text>}
        />
      )}
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
  endText: { color: '#6b7280', fontStyle: 'italic' },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 12
  }
})
