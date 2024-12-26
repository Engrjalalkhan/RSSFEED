/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  FlatList,
  Linking,
} from 'react-native';
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Sports from './Sports';
import Politics from './Politics';
import {fetchContentData} from '../components/FetchContentData';
import axios from 'axios';
import BusinessScreen from './Business';
import TopStoriesScreen from './TopStories';
const {width} = Dimensions.get('window');

const RssFeedScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmedCategories, setConfirmedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState({});
  const [results, setResults] = useState([]);
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiNzhkOTIxZGVhYzNkZmY1ZWU1ODExMTYwOTg5MDNjNTc0MWZiMmJiNTQ2ZWE5ZjgxMjdiYzE3MGU1Y2NmOWJkYmEyZDc3OWM5YmY2NWIwNjQiLCJpYXQiOjE3MzQ5MzMwMjIuOTMzNDUzLCJuYmYiOjE3MzQ5MzMwMjIuOTMzNDU3LCJleHAiOjE3NjY0NjkwMjIuOTE5NDI0LCJzdWIiOiIxNCIsInNjb3BlcyI6W119.B6auUlAWzTqDQddZuNILql0tmP2ktMkaAFqp047WGRZsJZMhIWhSU2CCv6UvwI9uQwR1yevszrcwWdnt8KEMFE1u_W3wVmai3AZM-y0rktM1dfOxgZNwCodyjcTobU2YgsJViuEv-0W6BsIk2rouyZHmFSMD84haRSi2SkIGYKxymBLzT8ikmLMNBEa_slNkmpCPmamTl-1wdYA_WbvO3lH71-OzByjrmpP5rRXI91sasTYn_Upn9E79DKDZfkktc9Qf8c-P5pdHjxZ1cGgw1VRGt6nt3XOiozH-gxn2NvncvTDTYlNF7Iys0UQ4_hcoj--5ikbg0h5o_2rJvKMOR-OgULa1V4G715itx4YTrl4duik4sVvU42IO5nvMhkKC19iRoe3l1ZSFR-4zEv0vxg-GYM-faTGOUvUj1LmiuA8ZOp8UJ3MjCuQ7ILa38oZV8qghAr2QzW9ONio8JIKKoV6mzEC9LIaQxLfrvoRpo2nrX3Ec3ECipw-gyerUb_dbhdSx1IdMhdyBcTv_Rh0oM4rae6dCOPx7TrmSpelUSzkTanC4gpzsgrZtKPymhvMVaMRlABTAIrec9Nh6sFRw80G1miZvRhWFxEFhMdDEhC57N3Kr_qm8SGrZZkm0_qujQV7l6G8zFQ5rmPxdwB19V59EwNNHtdQzJBGRideQ8uw';

  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://192.168.18.127:8000/api/rss-feed/select-rss-feed',
          {
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
            },
          },
        );
        console.log('API Response:', response.data);
        const data = response?.data?.payload?.feed_types;
        if (Array.isArray(data)) {
          setCategories(data); // Set categories if data is an array
        } else {
          console.error('Received data is not an array:', data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = category => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter(item => item !== category),
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSaveCategories = async () => {
    try {
      // Predefined sequence of categories
      const predefinedSequence = ['Business', 'Sports', 'Top stories'];

      // Map selected categories to their IDs
      const selectedIds = selectedCategories
        .map(category => {
          const selectedCategory = categories.find(
            cat => cat.feed_name === category,
          );
          return selectedCategory ? selectedCategory.id : null;
        })
        .filter(id => id !== null);

      // Check if any categories were selected
      if (selectedIds.length === 0) {
        console.log('No categories selected');
        setConfirmedCategories([]); // Explicitly reset confirmed categories
        setModalVisible(false);
        return;
      }

      // Sort the selected categories based on predefined sequence
      const sortedSelectedCategories = selectedCategories.sort((a, b) => {
        const indexA = predefinedSequence.indexOf(a);
        const indexB = predefinedSequence.indexOf(b);
        return indexA - indexB;
      });

      // Log or alert each saved category ID in the predefined order
      sortedSelectedCategories.forEach(category => {
        const categoryId = categories.find(
          cat => cat.feed_name === category,
        )?.id;
        const categoryName = category;
        if (categoryId) {
          console.log(
            `Category "${categoryName}" (ID: ${categoryId}) saved successfully!`,
          );
          // Optionally, you can display an alert for each category:
          // alert(`Category "${categoryName}" saved successfully!`);
        }
      });

      // Make the API request to save selected categories
      const response = await axios.post(
        'http://192.168.18.127:8000/api/rss-feed/save-rss-feed',
        null, // No body content (data is sent as query params)
        {
          params: {
            'selected_ids[]': selectedIds,
          },
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Save Response:', response.data);
      setConfirmedCategories(sortedSelectedCategories); // Update confirmed categories only when there are selected ones
      setModalVisible(false);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving categories.');
    }
  };

  const handleSearch = async query => {
    setSearchQuery(query);

    if (query) {
      const data = await fetchContentData(query);
      setResults(data);
    } else {
      setResults([]); // Clear results when there's no search query
    }
  };

  const renderContent = () => {
    if (searchQuery && results.length > 0) {
      return (
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => Linking.openURL(item.parma_link)}>
              <Image source={{uri: item.thumbnail}} style={styles.image} />
              <View style={{backgroundColor: '#DF4B38'}}>
                <Text
                  style={styles.headertitle}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {item.title}
                </Text>
              </View>
              <View style={styles.cardContent}>
                <Text
                  style={styles.body}
                  numberOfLines={3}
                  ellipsizeMode="tail">
                  {item.desc}
                </Text>
                <Text
                  style={styles.body}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {item.time}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          numColumns={2} // Display two cards in a row
          contentContainerStyle={styles.grid}
        />
      );
    }

    if (confirmedCategories.length === 0) {
      return (
        <View style={styles.defaultContainer}>
          <View style={styles.iconContainer}>
            <Icon name="calendar" size={50} color="white" />
          </View>
          <Text style={styles.bodytext}>You have not created any reminder</Text>
          <Text style={{fontSize: 14}}>
            Created reminders will appear here.
          </Text>
        </View>
      );
    }

    return confirmedCategories.map(category => {
      const data = filteredData[category];

      switch (category) {
        case 'Business':
          return <BusinessScreen key={category} data={data} />;
        case 'Sports':
          return <Sports key={category} data={data} />;
        case 'Politics':
          return <Politics key={category} data={data} />;
        case 'TopStories': // Ensure this case renders TopStoriesScreen
          return <TopStoriesScreen key={category} data={data} />;
        default:
          return null;
      }
    });
  };

  useEffect(() => {
    if (modalVisible) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scale, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible, scale]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headertext}>Palsome</Text>
      </View>
      <View style={styles.rowContainer}>
        <TouchableOpacity>
          <Image
            source={require('../assets/icon/arrow-left.jpg')}
            style={styles.backicon}
          />
        </TouchableOpacity>
        <Text style={styles.Rsstext}>RSS Feed</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={require('../assets/icon/plus-icon.png')}
            style={styles.plusicon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.searchbox}>
        <View style={styles.inputContainer}>
          <Icon name="search" size={20} color="gray" style={styles.icon} />
          <TextInput
            placeholder="Search RSS Feed..."
            placeholderTextColor={'gray'}
            style={styles.input}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      <ScrollView>
        <View style={styles.contentContainer}>{renderContent()}</View>
      </ScrollView>

      {/* Modal with zoom animation */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, {transform: [{scale}]}]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>RSS Feed</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon
                  name="close"
                  size={24}
                  color="white"
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Check if categories are still loading */}
            {loading ? (
              <Text>Loading categories...</Text>
            ) : // Check if categories is an array before calling map
            Array.isArray(categories) && categories.length > 0 ? (
              categories.map(category => (
                <TouchableOpacity
                  key={category.id} // Assuming category has an 'id' field
                  style={[
                    styles.categoryButton,
                    selectedCategories.includes(category.feed_name) &&
                      styles.selectedCategoryButton,
                  ]}
                  onPress={() => handleCategorySelect(category.feed_name)}>
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategories.includes(category.feed_name) &&
                        styles.selectedCategoryText,
                    ]}>
                    {category.feed_name}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No categories available.</Text> // Show a message if categories are empty or not in expected format
            )}

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveCategories}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default RssFeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#DF4B38',
    width: 420,
    height: 40,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headertext: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
    marginTop: 30,
  },
  backicon: {
    width: 25,
    height: 25,
    borderRadius: 20,
    elevation: 10,
  },
  plusicon: {
    width: 25,
    height: 25,
    borderRadius: 20,
  },
  Rsstext: {
    fontSize: 24,
    color: 'black',
    fontWeight: '500',
    marginHorizontal: 10,
  },
  searchbox: {
    flexDirection: 'row',
    margin: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 20,
    width: '70%',
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: 10,
    color: '#DF4B38',
  },
  input: {
    height: 40,
    flex: 1,
    paddingLeft: 40,
    color: 'black',
  },
  defaultContainer: {
    marginTop: 150,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#2C3E50',
    borderRadius: 50,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodytext: {
    fontSize: 16,
    paddingTop: 30,
    color: 'black',
    fontWeight: '500',
  },
  contentContainer: {
    marginTop: 30,
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '111%',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 0.5,
    overflow: 'hidden',
    paddingBottom: 5,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    left: 20,
  },
  closeIcon: {
    backgroundColor: '#2C3E50',
    borderRadius: 15,
    right: 20,
  },
  categoryButton: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  selectedCategoryButton: {
    backgroundColor: '#DF4B38',
  },
  categoryButtonText: {
    color: 'black',
    fontSize: 16,
  },
  selectedCategoryText: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#DF4B38',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: 400,
    paddingHorizontal: 10,
    marginTop: 20,
  },

  card: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 1,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 3,
    elevation: 5,
    width: width * 0.45, // Set the width based on screen size (90% of screen width)
    alignSelf: 'center',
  },

  image: {
    width: '100%',
    height: 150,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },

  headertitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    padding: 5,
    color: 'white',
    paddingLeft: 15,
  },

  cardContent: {
    borderWidth: 1,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderColor: '#DF4B38',
    padding: 5,
  },

  body: {
    fontSize: 14,
    color: 'black',
    padding: 5,
    paddingLeft: 10,
    fontWeight: '500',
  },
});
