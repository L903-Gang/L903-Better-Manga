import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getCategory } from '@/api/otruyen/get-category'

type Props = {
  selectedTags: string
  setSelectedTags: React.Dispatch<React.SetStateAction<string>>
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>
}

export default function FilterSelection({ selectedTags, setSelectedTags, setShowFilter }: Props) {
  const { data, isLoading, error } = useQuery(getCategory())
  const categories = data?.data.items ?? []

  const toggleTag = (tagSlug: string) => {
    setSelectedTags(tagSlug)
    setShowFilter(false)
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#60a5fa' />
        <Text style={{ color: '#fff', marginTop: 8 }}>Đang tải thể loại...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#fff' }}>Không thể tải thể loại</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tagGroup}>
        <Text style={styles.groupTitle}>Thể loại</Text>
        <View style={styles.tagContainer}>
          {categories.map(cat => {
            const isSelected = selectedTags === cat.slug
            return (
              <TouchableOpacity
                key={cat.id + cat.slug}
                style={[styles.tagItem, isSelected && styles.tagSelected]}
                onPress={() => toggleTag(cat.slug)}
              >
                <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>{cat.name}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20, color: '#272e35ff' },
  groupTitle: { fontSize: 16, fontWeight: 'bold', color: '#f9fafb', marginBottom: 8 },
  tagGroup: { marginBottom: 16 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagItem: { backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginBottom: 8 },
  tagText: { color: '#9ca3af', fontSize: 14 },
  tagSelected: { backgroundColor: '#60a5fa' },
  tagTextSelected: { color: '#fff', fontWeight: '600' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
})
