import { Link, Stack } from 'expo-router'
import { StyleSheet, Image } from 'react-native'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Không tìm thấy trang' }} />
      <ThemedView style={styles.container}>
        <Image
          source={require('@/assets/images/bocchi.jpg')} // bocchi
          style={styles.image}
          resizeMode='contain'
        />

        <ThemedText type='title' style={styles.title}>
          Trang này không tồn tại
        </ThemedText>

        <Link href='/' style={styles.link}>
          <ThemedText type='link'>Quay lại trang chủ</ThemedText>
        </Link>
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0f172a'
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 24
  },
  title: {
    textAlign: 'center',
    color: '#f1f5f9',
    marginBottom: 12
  },
  link: {
    marginTop: 8,
    paddingVertical: 10
  }
})
