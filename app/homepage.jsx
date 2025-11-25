import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const HomePage = () => {
  const featuredAlbum = {
    title: 'Abbey Road',
    artist: 'The Beatles',
    image: 'https://link_to_album_cover.com/image.jpg', 
  };

  const friendsRatings = [
    {
      name: 'John Doe',
      album: 'Abbey Road',
      artist: 'The Beatles',
      rating: 5,
      id: '1',
    },
    {
      name: 'Jane Smith',
      album: 'As It Was',
      artist: 'Harry Styles',
      rating: 4,
      id: '2',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.featuredSection}>
        <Image source={{ uri: featuredAlbum.image }} style={styles.albumImage} />
        <Text style={styles.albumTitle}>{featuredAlbum.title}</Text>
        <Text style={styles.albumArtist}>{featuredAlbum.artist}</Text>
        <TouchableOpacity style={styles.rateButton}>
          <Text style={styles.rateButtonText}>Rate Now</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Friends</Text>
      <FlatList
        data={friendsRatings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.ratingCard}>
            <Text style={styles.friendName}>{item.name} rated</Text>
            <Text style={styles.albumInfo}>{item.album} by {item.artist}</Text>
            <Text style={styles.rating}>{'⭐'.repeat(item.rating)} {item.rating}</Text>
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>Trending</Text>
      {/* Add additional trending content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  featuredSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  albumImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  albumTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  albumArtist: {
    color: '#aaa',
    fontSize: 16,
  },
  rateButton: {
    backgroundColor: '#1DB954',
    padding: 10,
    borderRadius: 25,
    marginTop: 10,
  },
  rateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    marginVertical: 16,
  },
  ratingCard: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  friendName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  albumInfo: {
    color: '#aaa',
  },
  rating: {
    color: '#ffd700',
  },
});

export default HomePage;