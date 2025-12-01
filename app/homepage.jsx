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

