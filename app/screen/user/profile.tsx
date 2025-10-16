import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { useAuth } from '@/context/auth-provider'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getBookmarks } from '@/api/otruyen/bookmark/bookmark'
import BookmarkList from '@/components/profile/bookmark-list'
import { getReadHistory, ReadHistory } from '@/hooks/use-read-history'
import ReadHistoryList from '@/components/profile/read-history-list'

export default function ProfileScreen() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [readHistory, setReadHistory] = useState<ReadHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [fetching, setFetching] = useState(true) // bookmark loading
  const [fetchingHistory, setFetchingHistory] = useState(true) // history loading
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'history'>('bookmarks')

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

  const fetchHistory = async () => {
    setFetchingHistory(true)
    const data = await getReadHistory()
    setReadHistory(data)
    setFetchingHistory(false)
  }

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  useEffect(() => {
    fetchHistory()
  }, [])

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
          {loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.buttonText}>Đăng xuất</Text>}
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'bookmarks' && styles.tabActiveLeft]}
            onPress={() => setActiveTab('bookmarks')}
          >
            <Text style={[styles.tabText, activeTab === 'bookmarks' && styles.tabTextActive]}>Yêu thích</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'history' && styles.tabActiveRight]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>Đã đọc</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingBottom: 32 }}>
          {activeTab === 'bookmarks' && (
            <BookmarkList
              bookmarks={bookmarks}
              fetching={fetching}
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true)
                await fetchBookmarks()
                setRefreshing(false)
              }}
              onRefetch={fetchBookmarks}
            />
          )}

          {activeTab === 'history' && (
            <ReadHistoryList
              history={readHistory}
              refreshing={refreshing}
              fetching={fetchingHistory}
              onRefetch={fetchHistory}
              onRefresh={async () => {
                setFetchingHistory(true)
                await fetchHistory()
                setFetchingHistory(false)
              }}
              onReadContinue={item => {
                router.push({
                  pathname: `/reader/[id]`,
                  params: {
                    id: item?.chapterApi!,
                    slug: item.slug,
                    chapter_name: item?.chapterName ?? 'Không rõ'
                  }
                })
              }}
              onViewInfo={item => {
                router.push(`/manga-detail/${item.slug}`)
              }}
            />
          )}
        </View>
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    marginBottom: 16
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center'
  },
  tabActiveLeft: {
    backgroundColor: '#3b82f6',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8
  },
  tabActiveRight: {
    backgroundColor: '#3b82f6',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8
  },
  tabText: {
    color: '#cbd5e1',
    fontSize: 16
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600'
  }
})
