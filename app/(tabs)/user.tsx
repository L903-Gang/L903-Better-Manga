import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useAuth } from '@/context/auth-provider'
import LoginScreen from '../screen/user/login'
import ProfileScreen from '../screen/user/profile'

export default function UserScreen() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color='#60a5fa' size='large' />
      </View>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  return <ProfileScreen />
}
