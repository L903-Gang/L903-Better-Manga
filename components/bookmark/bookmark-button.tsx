import React, { useEffect, useState } from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { supabase } from '@/lib/supabase'
import { isBookmarked, addBookmark, removeBookmark } from '@/api/otruyen/bookmark/bookmark'

export default function BookmarkButton({ slug, name, image }: { slug: string, name: string, image: string }) {
    const [loading, setLoading] = useState(true)
    const [bookmarked, setBookmarked] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)

    // 🔹 Lấy user hiện tại
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const {
                    data: { user }
                } = await supabase.auth.getUser()
                if (!user) {
                    setUserId(null)
                    setLoading(false)
                    return
                }

                setUserId(user.id)
                const exists = await isBookmarked(slug)
                setBookmarked(exists)
            } catch (error) {
                console.error('BookmarkButton error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [slug])

    // 🔹 Xử lý toggle
    const toggleBookmark = async () => {
        if (!userId) {
            Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để sử dụng tính năng này.')
            return
        }

        try {
            setLoading(true)
            if (bookmarked) {
                await removeBookmark(slug)
                setBookmarked(false)
            } else {
                await addBookmark({ slug, name, image })
                setBookmarked(true)
            }
        } catch (err: any) {
            Alert.alert('Lỗi', err.message || 'Không thể cập nhật bookmark.')
        } finally {
            setLoading(false)
        }
    }

    // 🔹 Màu và text nút
    let bgColor = '#94a3b8'
    if (userId) {
        bgColor = bookmarked ? '#ef4444' : '#22c55e'
    }

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: bgColor }]}
            onPress={toggleBookmark}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.text}>
                    {!userId
                        ? 'Đăng nhập để bookmark'
                        : bookmarked
                            ? 'Xóa khỏi yêu thích'
                            : 'Thêm vào yêu thích'}
                </Text>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    text: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600'
    }
})
