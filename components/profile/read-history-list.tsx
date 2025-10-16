import React from 'react'
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import ReadHistoryItem from '../history/history-read-item'
import { ReadHistory } from '@/hooks/use-read-history'

export default function ReadHistoryList({
  history,
  fetching,
  onReadContinue,
  onViewInfo
}: {
  history: ReadHistory[]
  fetching: boolean
  onReadContinue: (item: ReadHistory) => void
  onViewInfo: (item: ReadHistory) => void
}) {
  if (fetching) {
    return <ActivityIndicator color='#fff' style={{ marginTop: 20 }} />
  }

  return (
    <FlatList
      data={history}
      keyExtractor={item => item.slug}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <ReadHistoryItem item={item} onReadContinue={onReadContinue} onViewInfo={onViewInfo} />
        </View>
      )}
      contentContainerStyle={{
        paddingBottom: 24,
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
