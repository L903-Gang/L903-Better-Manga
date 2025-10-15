import React from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getCategory } from '@/api/otruyen/get-category'
import { router } from 'expo-router'
import Loading from '@/components/status/loading'
import Error from '@/components/status/error'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Category } from '@/api/otruyen/common/type'

const TagListScreen = () => {
  const { data, isLoading, error } = useQuery(getCategory())

  const category = data?.data.items ?? []

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    )
  }

  if (error || !data?.data) {
    return (
      <View style={styles.center}>
        <Error />
      </View>
    )
  }

  const renderGrid = (list: Category[]) => {
    let data = [...list]

    // nếu list lẻ thì đầy placeholder vào cho đỡ xấu
    if (data.length % 2 !== 0) {
      data.push({ slug: 'placeholder', name: 'placeholder', id: 'placeholder' })
    }

    return (
      <FlatList
        data={data}
        style={{}}
        keyExtractor={item => item.slug}
        numColumns={2}
        scrollEnabled={false}
        renderItem={({ item }) => {
          if (item.id === 'placeholder') {
            return <View style={[styles.tagItem, { backgroundColor: 'transparent' }]} />
          }
          return (
            <TouchableOpacity
              style={styles.tagItem}
              onPress={() => {
                router.push({
                  pathname: `/tag/[id]`,
                  params: { id: item.slug }
                })
              }}
            >
              <Text style={styles.tagText}>{item.name}</Text>
            </TouchableOpacity>
          )
        }}
      />
    )
  }

  return (
    <SafeAreaView edges={['top']} style={{ paddingBlockEnd: 20 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Thể loại</Text>
        {renderGrid(category)}
        <View style={{ paddingTop: 36 }}></View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12
    // paddingHorizontal: 12
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#f0f0f0'
  },
  tagItem: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tagText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center'
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default TagListScreen
