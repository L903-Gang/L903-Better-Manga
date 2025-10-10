import React, { useState } from 'react'
import { View, Text, Image, Dimensions, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
import Swiper from 'react-native-swiper'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { MangaStatus } from '@/utils/enums'
import { getListByType } from '@/api/otruyen/list/get-list-by-type'

const { width } = Dimensions.get('window')

interface Props {
  id: string
}

const SlideMangaCardFullWidth: React.FC<Props> = () => {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)

  const { data: newManga, isLoading, isError } = useQuery(getListByType({ type: 'truyen-moi', page: 1 }))

  if (isLoading) return <ActivityIndicator size='large' color='#999' style={{ marginTop: 50 }} />
  if (isError || !newManga) return <Text style={{ marginTop: 50, textAlign: 'center' }}>Lỗi rồi</Text>

  return (
    <View style={{ width, height: 450, paddingVertical: 3 }}>
      <Swiper autoplay autoplayTimeout={3.5} showsPagination={false} loop>
        {newManga?.data.items.map(manga => {
          const title = manga.name
          const altTitle = manga.origin_name
          const status = MangaStatus[manga.status as keyof typeof MangaStatus] || 'Không rõ'
          const coverImageUrl = newManga.data.APP_DOMAIN_CDN_IMAGE + '/uploads/comics/' + manga.thumb_url
          const categoryNames = manga.category.map(c => c.name).join(', ')

          const handleClick = () => {
            if (manga.slug.trim()) {
              router.push(`/manga-detail/${manga.slug}`)
            }
          }

          return (
            <TouchableOpacity key={manga.slug} onPress={handleClick} activeOpacity={0.8} style={{ flex: 1 }}>
              {coverImageUrl ? (
                <Image
                  source={{ uri: coverImageUrl, cache: 'force-cache' }}
                  style={StyleSheet.absoluteFillObject}
                  resizeMode='cover'
                />
              ) : (
                <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#222' }]} />
              )}
              <View style={styles.overlay}>
                <View style={[styles.contentContainer, { paddingTop: 15 }]}>
                  <View style={styles.coverContainer}>
                    <Image
                      source={{ uri: coverImageUrl }}
                      style={styles.coverImage}
                      onLoadEnd={() => setIsLoaded(true)}
                    />
                    {!isLoaded && <ActivityIndicator size='small' color='#fff' style={styles.loadingIndicator} />}
                  </View>

                  <View style={styles.infoContainer}>
                    <Text style={styles.title} numberOfLines={2}>
                      {title}
                    </Text>
                    {altTitle && <Text style={styles.altTitle}>{altTitle}</Text>}
                    <Text style={styles.infoText}>Tình trạng: {status}</Text>
                    <Text style={styles.infoText}>Thể loại: {categoryNames}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
      </Swiper>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2
  },
  coverContainer: {
    width: 160,
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16
  },
  coverImage: {
    width: '100%',
    height: '100%'
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -10
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4
  },
  altTitle: {
    color: '#ccc',
    fontStyle: 'italic',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8
  },
  infoText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 12
  },
  rating: {
    paddingHorizontal: 6,
    borderRadius: 4,
    color: '#fff',
    fontWeight: 'bold'
  }
})

export default SlideMangaCardFullWidth
