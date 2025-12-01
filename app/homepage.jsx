import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomePage() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>♪</Text>
        <Text style={styles.title}>Listify</Text>
        <Text style={styles.bell}>🔔</Text>
      </View>

      {/* Featured Album Card */}
      <View style={styles.featureCard}>
        <Image
          source={require('./assets/abbey.jpg')}
          style={styles.featureImage}
        />
        <View style={styles.featureContent}>
          <Text style={styles.featureLabel}>FEATURED ALBUM</Text>
          <Text style={styles.featureTitle}>Abbey Road</Text>
          <Text style={styles.featureArtist}>The Beatles</Text>
          <TouchableOpacity style={styles.rateButton}>
            <Text style={styles.rateButtonText}>Rate Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.activeTabText}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveTab}>
          <Text style={styles.inactiveTabText}>Trending</Text>
        </TouchableOpacity>
      </View>

      {/* Post 1 */}
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <Image source={require('./assets/user1.png')} style={styles.userImg} />
          <Text style={styles.postHeaderText}>John Doe rated</Text>
        </View>
        <View style={styles.postRow}>
          <View>
            <Text style={styles.postTitle}>Abbey Road</Text>
            <Text style={styles.postArtist}>The Beatles</Text>
            <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
          </View>
          <Image source={require('./assets/abbey.jpg')} style={styles.postThumb} />
        </View>
        <View style={styles.postFooter}>
          <Text style={styles.icon}>♡ 12</Text>
          <Text style={styles.icon}>💬 3</Text>
        </View>
      </View>

      {/* Post 2 */}
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <Image source={require('./assets/user2.png')} style={styles.userImg} />
          <Text style={styles.postHeaderText}>Jane Smith rated</Text>
        </View>
        <View style={styles.postRow}>
          <View>
            <Text style={styles.postTitle}>As It Was</Text>
            <Text style={styles.postArtist}>Harry Styles</Text>
            <Text style={styles.stars}>⭐⭐⭐⭐</Text>
          </View>
          <Image source={require('./assets/asiwas.png')} style={styles.postThumb} />
        </View>
        <View style={styles.postFooter}>
          <Text style={styles.icon}>♡ 31</Text>
          <Text style={styles.icon}>💬 7</Text>
        </View>
      </View>

      {/* Bottom Nav Placeholder (since navigation is separate) */}
      <View style={styles.bottomNav}>
        <Text style={styles.navActive}>🏠 Home</Text>
        <Text style={styles.navText}>🔍 Search</Text>
        <Text style={styles.navText}>📋 Lists</Text>
        <Text style={styles.navText}>👤 Profile</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: { color: '#fff', fontSize: 20 },
  title: { color: '#fff', fontSize: 20, fontWeight: '600' },
  bell: { color: '#fff', fontSize: 20 },

  featureCard: {
    backgroundColor: '#222',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  featureImage: {
    width: '100%',
    height: 200,
  },
  featureContent: {
    padding: 15,
  },
  featureLabel: { color: '#ccc', fontSize: 12 },
  featureTitle: { color: '#fff', fontSize: 26, fontWeight: '700' },
  featureArtist: { color: '#ccc', fontSize: 16 },
  rateButton: {
    marginTop: 10,
    backgroundColor: '#1DB954',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  rateButtonText: { color: '#fff', fontWeight: '600' },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  activeTab: {
    backgroundColor: '#222',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  inactiveTab: {
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  activeTabText: { color: '#fff', fontWeight: '600' },
  inactiveTabText: { color: '#888' },

  postCard: {
    backgroundColor: '#181818',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImg: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 10,
  },
  postHeaderText: { color: '#aaa' },
  postRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  postArtist: { color: '#888', marginBottom: 5 },
  stars: { color: '#1DB954', fontSize: 16 },
  postThumb: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    gap: 20,
  },
  icon: { color: '#fff' },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    marginTop: 10,
  },
  navActive: { color: '#1DB954' },
  navText: { color: '#888' },
});
