import React, { useState } from 'react'
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native'
import { MangaResponseData } from '@/api/otruyen/get-detail-manga'
import { MangaStatus } from '@/utils/enums'
import MangaChaptersList from '@/components/tabs/manga-chapter-tab'
import { stripHtml } from '@/utils/format'

interface MangaDetailPageProps {
  manga: MangaResponseData
}

export default function MangaDetailScreen({ manga }: MangaDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'chapters' | 'related'>('chapters')
  const title = manga?.item?.name ?? 'Không rõ'
  const altTitle = manga?.item?.origin_name ?? ''
  const coverImageUrl = manga?.APP_DOMAIN_CDN_IMAGE + '/uploads/comics/' + manga?.item?.thumb_url || ''
  const categoryNames = manga?.item?.category.map(c => c.name).join(', ')
  const author = String(manga?.item?.author || '').trim() || 'Đang cập nhật'
  const content = stripHtml(manga?.item?.content ?? '')

  return (
    <View style={{ flex: 1, backgroundColor: '#000000ff' }}>
      <ScrollView style={{ flex: 1, backgroundColor: '#0f172a' }}>
        <View style={{ alignItems: 'center', padding: 16, paddingTop: 50 }}>
          <Image
            source={{ uri: coverImageUrl }}
            defaultSource={require('@/assets/images/xin-loi-ouguri-cap-cua-toi-an-het-anh-roi.jpg')}
            style={{ width: 200, height: 300, borderRadius: 12 }}
            resizeMode='cover'
          />
          <Text
            numberOfLines={2}
            style={[{ color: 'white', fontWeight: 'bold', fontSize: 22, marginTop: 16, insetInline: 2 }]}
          >
            {title}
          </Text>
          <Text numberOfLines={2} style={{ color: 'white', fontSize: 14, paddingTop: 16, fontStyle: 'italic' }}>
            {altTitle}
          </Text>
        </View>

        {/* Info */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
          <View style={{ backgroundColor: '#1e293b', borderRadius: 12, padding: 12, gap: 6 }}>
            <Text style={{ color: '#f8fafc', fontSize: 14 }}>
              <Text style={{ fontWeight: 'bold' }}>Tình trạng: </Text>
              {MangaStatus[manga?.item?.status as keyof typeof MangaStatus] || 'Không rõ'}
            </Text>

            <Text style={{ color: '#f8fafc', fontSize: 14 }}>
              <Text style={{ fontWeight: 'bold' }}>Thể loại: </Text>
              {categoryNames || 'Không rõ'}
            </Text>

            <Text style={{ color: '#f8fafc', fontSize: 14 }}>
              <Text style={{ fontWeight: 'bold' }}>Tác giả: </Text>
              {author}
            </Text>
          </View>

          {/* Mô tả */}
          {content ? (
            <View style={{ marginTop: 14, backgroundColor: '#1e293b', borderRadius: 12, padding: 12 }}>
              <Text style={{ color: '#f8fafc', fontSize: 14, lineHeight: 22, textAlign: 'justify' }}>{content}</Text>
            </View>
          ) : (
            <Text style={{ color: '#9ca3af', marginTop: 14 }}>Đang cập nhật nội dung...</Text>
          )}
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: activeTab === 'chapters' ? '#1e40af' : '#374151',
              borderRadius: 8,
              marginHorizontal: 4
            }}
            onPress={() => setActiveTab('chapters')}
          >
            <Text style={{ color: 'white' }}>Danh sách chương</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
          {activeTab === 'chapters' && <MangaChaptersList chapters={manga.item.chapters} slug={manga?.item.slug} />}
          {/* {activeTab === 'related' && <RelatedManga ids={relatedMangaIds} />} */}
        </View>
      </ScrollView>
    </View>
  )
}
