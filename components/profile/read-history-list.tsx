import React from 'react'
import { View, Text, FlatList, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native'
import ReadHistoryItem from '../history/history-read-item'
import { ReadHistory } from '@/hooks/use-read-history'

export default function ReadHistoryList({
  history,
  fetching,
  refreshing,
  onReadContinue,
  onViewInfo,
  onRefresh,
  onRefetch
}: {
  history: ReadHistory[]
  fetching: boolean,
  refreshing: boolean
  onReadContinue: (item: ReadHistory) => void
  onViewInfo: (item: ReadHistory) => void
  onRefresh: () => void
  onRefetch: () => void
}) {
  if (fetching) {
    return <ActivityIndicator color='#fff' style={{ marginTop: 20 }} />
  }

  return (
    <FlatList
      data={history}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor='#fff'
          colors={['#60a5fa']}
          progressBackgroundColor='#1e293b'
        />
      }
      keyExtractor={item => item.slug}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <ReadHistoryItem item={item} onReadContinue={onReadContinue} onViewInfo={onViewInfo} />
        </View>
      )}
      contentContainerStyle={{
        paddingBottom: 210,
        flexGrow: 1
      }}
      ListEmptyComponent={<Text style={styles.emptyText}>Bạn chưa đọc truyện nào.</Text>}
    />
  )
}

const styles = StyleSheet.create({
  listItem: {
    marginHorizontal: 8,
    marginVertical: 4
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 12
  }
})
