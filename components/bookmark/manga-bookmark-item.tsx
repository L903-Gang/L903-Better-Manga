import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

interface BookmarkItemProps {
  slug: string
  name: string
  image?: string
}

const MangaBookmarkItem: React.FC<BookmarkItemProps> = ({ slug, name, image }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const coverImageUrl =
    image?.startsWith('http')
      ? image
      : `https://img.otruyenapi.com/uploads/comics/${image}`

  const handlePress = () => {
    if (slug.trim()) {
      router.push(`/manga-detail/${slug}`)
    }
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.8}>
      <View style={[styles.imageWrapper, styles.imageLarge]}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color='#ccc' />
          </View>
        )}
        <Image
          source={{
            uri: coverImageUrl || '@/assets/images/xin-loi-ouguri-cap-cua-toi-an-het-anh-roi.jpg'
          }}
          style={styles.image}
          resizeMode='cover'
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.title} numberOfLines={2}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default React.memo(MangaBookmarkItem)

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b', 
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    height: 310
  },
  imageWrapper: {
    position: 'relative'
  },
  imageLarge: {
    width: '100%',
    height: 250,
    maxWidth: 200,
    alignSelf: 'center'
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16
  },
  textWrapper: {
    padding: 8
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4
  }
})
