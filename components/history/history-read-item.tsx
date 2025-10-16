import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable } from 'react-native'
import { formatDate } from '@/utils/format'
import { ReadHistory } from '@/hooks/use-read-history'

type Props = {
  item: ReadHistory
  onReadContinue?: (item: ReadHistory) => void
  onViewInfo?: (item: ReadHistory) => void
}

export default function ReadHistoryItem({ item, onReadContinue, onViewInfo }: Props) {
  const [modalVisible, setModalVisible] = useState(false)

  const handlePress = () => setModalVisible(true)
  const handleClose = () => setModalVisible(false)

  const handleContinue = () => {
    handleClose()
    onReadContinue?.(item)
  }

  const handleViewInfo = () => {
    handleClose()
    onViewInfo?.(item)
  }

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          {item.chapterName ? (
            <Text style={styles.chapter}>Chapter: {item.chapterName}</Text>
          ) : (
            <View style={{ marginVertical: 12 }}></View>
          )}
          <Text style={styles.time}>Đọc lần cuối: {formatDate(item.updatedAt)}</Text>
        </View>
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType='fade' onRequestClose={handleClose}>
        <Pressable style={styles.overlay} onPress={handleClose}>
          <View style={[styles.modal, { paddingTop: 20 }]}>
            <Text style={styles.modalTitle}>{item.name}</Text>
            <TouchableOpacity
              style={[styles.button, !item.chapterApi && { backgroundColor: '#475569', opacity: 0.6 }]}
              disabled={!item.chapterApi}
              onPress={handleContinue}
            >
              <Text style={styles.buttonText}>Đọc tiếp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleViewInfo}>
              <Text style={styles.buttonText}>Xem thông tin</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6
  },
  name: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: 'bold'
  },
  chapter: {
    color: '#cbd5e1',
    marginTop: 4
  },
  time: {
    color: '#94a3b8',
    marginTop: 6,
    fontSize: 12
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: '80%',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 20
  },
  modalTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  modalSub: {
    color: '#cbd5e1',
    marginBottom: 16
  },
  button: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 8
  },
  buttonText: {
    textAlign: 'center',
    color: '#f1f5f9',
    fontSize: 16
  }
})
