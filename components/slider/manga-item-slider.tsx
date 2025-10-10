import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-swiper'
import { useQuery } from '@tanstack/react-query'
import { getListByType } from '@/api/otruyen/list/get-list-by-type'
import MangaItem from '@/components/manga/manga-items'
import { useRouter } from 'expo-router'

interface SlideMangaListProps {
  title?: string
  mangas?: any[]
  type?: string
  page?: number
  height?: number
}

const MangaItemSlider: React.FC<SlideMangaListProps> = ({
  title,
  mangas,
  type = 'truyen-moi',
  page = 1,
  height = 370
}) => {
  const router = useRouter()
  const { data, isLoading, isError } = useQuery(getListByType({ type, page }))
  const list = mangas ?? data?.data?.items ?? []

  if (isLoading) return <ActivityIndicator size='large' color='#999' style={{ marginTop: 40 }} />
  if (isError || !list.length) return <Text style={{ color: '#fff', textAlign: 'center' }}>Không có dữ liệu</Text>

  return (
    <View style={[styles.container, { height }]}>
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

      <Swiper autoplay autoplayTimeout={3.5} showsPagination={false} loop containerStyle={styles.swiper}>
        {list.map(manga => (
          <View key={manga.slug}>
            <MangaItem manga={manga} />
          </View>
        ))}
      </Swiper>
    </View>
  )
}

export default MangaItemSlider

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    // marginLeft: 12,
    marginBottom: 8
  },
  swiper: {
    width: 'auto'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
    // paddingHorizontal: 1
  },
  seeMore: {
    fontSize: 14,
    color: '#60a5fa',
    paddingHorizontal: 10
  }
})
