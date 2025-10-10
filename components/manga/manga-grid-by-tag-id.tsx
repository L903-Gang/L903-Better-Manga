import React from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import MangaItem from '@/components/manga/manga-items'
import { useQuery } from '@tanstack/react-query'
import Loading from '../status/loading'
import Error from '../status/error'
import { useRouter } from 'expo-router'
import { getListByType } from '@/api/otruyen/list/get-list-by-type'

interface MangaGridProps {
  title?: string
  type: string
  page?: number
}

const MangaGridByTagId: React.FC<MangaGridProps> = ({ title, type, page = 1 }) => {
  const router = useRouter()
  const { data: mangas, isLoading, isError, error } = useQuery(getListByType({ type: type, page: page }))

  if (isLoading) {
    return <Loading />
  }

  if (isError || !mangas) {
    console.log('API error:', error)
    return <Error />
  }

  let data = mangas?.data?.items ? [...mangas?.data?.items] : []

  // Nếu số item lẻ → thêm placeholder nhìn cho đỡ bẩn mắt
  if (data.length % 2 !== 0) {
    data.push({ slug: 'placeholder' } as any)
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      {title ? (
        <View style={styles.headerRow}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: `/tag/[id]`,
                params: { id: type }
              })
            }}
          >
            <Text style={styles.seeMore}>Xem thêm</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Grid 2 cột */}

      <FlatList
        data={data}
        keyExtractor={item => item.slug.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          if (item.slug === 'placeholder') {
            return <View style={[styles.gridItem, { backgroundColor: 'transparent' }]} />
          }
          return (
            <View style={styles.gridItem}>
              <MangaItem manga={item} />
            </View>
          )
        }}
        scrollEnabled={false} // scroll cha handle
      />
    </View>
  )
}

export default MangaGridByTagId

const styles = StyleSheet.create({
  container: {
    marginBottom: 24
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 1
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 10
  },
  seeMore: {
    fontSize: 14,
    color: '#60a5fa',
    paddingHorizontal: 10
  },
  row: {
    justifyContent: 'space-between'
  },
  gridItem: {
    flex: 1,
    margin: 4
  }
})
