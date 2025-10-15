import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl
} from 'react-native'
import { useAuth } from '@/context/auth-provider'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getBookmarks } from '@/api/otruyen/bookmark/bookmark'
import MangaBookmarkItem from '@/components/bookmark/manga-bookmark-item'

export default function ProfileScreen() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const handleSignOut = async () => {
    try {
      setLoading(true)
      await signOut()
      Alert.alert('Đã đăng xuất')
      router.replace('/')
    } catch (error: any) {
      Alert.alert('Lỗi đăng xuất', error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookmarks = useCallback(async () => {
    try {
      setFetching(true)
      const res = await getBookmarks()
      setBookmarks(res.data || [])
    } catch (err: any) {
      console.error('Lỗi fetch bookmarks:', err)
    } finally {
      setFetching(false)
    }
  }, [])

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchBookmarks()
    setRefreshing(false)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Hồ sơ cá nhân</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#ff4d4f', marginBottom: 24 }]}
          onPress={handleSignOut}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Đăng xuất</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Danh sách yêu thích</Text>

        {fetching ? (
          <ActivityIndicator color="#fff" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={bookmarks}
            keyExtractor={(item) => item.slug}
            renderItem={({ item }) => (
              <MangaBookmarkItem
                slug={item.slug}
                name={item.name}
                image={item.image}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#fff"
                colors={['#60a5fa']}
                progressBackgroundColor="#1e293b"
                // progressViewOffset={-1002}
              />
            }
            contentContainerStyle={{
              paddingBottom: 24,
              flexGrow: 1,
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Bạn chưa có truyện yêu thích nào.
              </Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  )

}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  container: {
    flex: 1,
    padding: 24
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f9fafb',
    textAlign: 'center',
    marginBottom: 32
  },
  infoBox: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16
  },
  label: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 6
  },
  value: {
    color: '#f9fafb',
    fontSize: 16
  },
  button: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 12
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 12
  }
})
