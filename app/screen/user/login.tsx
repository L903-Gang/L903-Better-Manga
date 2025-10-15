import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'expo-router'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ email và mật khẩu!')
      return
    }

    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      const user = data.user
      Alert.alert('Thành công', `Xin chào ${user.email}`)
      router.replace('/')
    } catch (e) {
      Alert.alert('Đăng nhập thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        style={styles.input}
        placeholder='Email'
        placeholderTextColor='#9ca3af'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
      />

      <TextInput
        style={styles.input}
        placeholder='Mật khẩu'
        placeholderTextColor='#9ca3af'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.buttonText}>Đăng nhập</Text>}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f9fafb',
    textAlign: 'center',
    marginBottom: 32
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16
  },
  button: {
    backgroundColor: '#60a5fa',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
})
