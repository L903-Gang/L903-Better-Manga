import React from 'react'
import { View, Text, FlatList, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native'
import MangaBookmarkItem from '../bookmark/manga-bookmark-item'

export default function BookmarkList({
  bookmarks,
  fetching,
  refreshing,
  onRefresh,
  onRefetch
}: {
  bookmarks: any[]
  fetching: boolean
  refreshing: boolean
  onRefresh: () => void
  onRefetch: () => void
}) {
  const data = bookmarks.length % 2 !== 0 ? [...bookmarks, { slug: 'placeholder' }] : bookmarks

  if (fetching) {
    return <ActivityIndicator color='#fff' style={{ marginTop: 20 }} />
  }

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.slug}
      numColumns={2}
      renderItem={({ item }) => {
        if (item?.slug === 'placeholder') {
          return <View style={[styles.gridItem, { backgroundColor: 'transparent' }]} />
        }
        return (
          <View style={styles.gridItem}>
            <MangaBookmarkItem slug={item.slug} name={item.name} image={item.image} onRefetch={onRefetch} />
          </View>
        )
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor='#fff'
          colors={['#60a5fa']}
          progressBackgroundColor='#1e293b'
        />
      }
      contentContainerStyle={{
        paddingBottom: 210,
        flexGrow: 1
      }}
      ListEmptyComponent={<Text style={styles.emptyText}>Bạn chưa có truyện yêu thích nào.</Text>}
    />
  )
}

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 4
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 12
  }
})
