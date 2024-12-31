/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const RssFeedScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState(null);
  const [data, setData] = useState([]);
  const [savedData, setSavedData] = useState(null);
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiYTllNTUxNDM5ODM1MTg2ZmQyNjM2NmM0MWI2ZDRiNjNmZmFkN2E4MmVjMTcwNjZlOTMwM2Y1YTU3MGE0NmUyMjczMjdlZDk2YmI1ZTllODUiLCJpYXQiOjE3MzU1MzkyOTYuMDA1OTc4LCJuYmYiOjE3MzU1MzkyOTYuMDA1OTgyLCJleHAiOjE3NjcwNzUyOTUuNzc0NTE4LCJzdWIiOiIxNCIsInNjb3BlcyI6W119.vyUJUi47Iu-UjzJC_Hu_dn4DOk7vKr7PnpKGPQZ8A8J9a_T1vL0uJl26SA9UIMG1OGJkp4wVC9t2LwdiNRMywq0Y5cTb1t15UYTuD6vyHCGTnVlqDcBEJAHF3G0kN0qysG6ySs0CIM06HuXWO0U69r46DLJ1sk1yvuFs1pRQEwOw2eA6OU6cMmn7R621EMnW5BMBs9YD7Castyh0tuQYk3rIPfaoLMxmW_fR6Vk6y2ayo10xvOsJGOcu3YNdNxM9rStpfRFgY0AbXfmuUq2Ef5wfE603KAc2LJukApNm4OSRglnmDx9IGqhotScxaBhlg84_2qtUTVIvJNbFj1OD3bQ9qqji2jgit5NWY-lgbLxKjWCzPsL__gQZkUOkGmzRd6txquMU77Toim9HXrXSh3yaL2sA4_b9iZQn_c5h6mtsDxWwuBpbt55rq_hrlHIAqY6gZGwCwT_iu9bsG3zahZkW7WrvVP-XlYOLl7wODo3HMDA-cs2_FFIg6uq2btM8BHKzLJeI_KKq5XDK6eIxMjUKjn_xBv9XBNnODD6gHdn2Dm13OKBIz4X2k2UGRfzhVa-kArsq0MfAX3uK0_iPI0EKf7sB8W9yoLnPCdCxYmHSVDtGrxr2ZCO3I1pvg5q6jrVFAWgt4eSJttZAyKOaA6Uzs7goGdVCoaSlchkRJs4';

  const handleSave = async () => {
    if (!id) {
      console.log('No RSS Feed selected to save');
      return;
    }

    try {
      const response = await axios.post(
        'http://192.168.18.127:8000/api/rss-feed/save-rss-feed',
        {feed_id: id}, // Payload for the POST request
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response?.data?.responseCode === 200) {
        console.log('RSS Feed saved successfully:', response?.data);
        setModalVisible(false);
        fetchSavedFeedData(id);
      } else {
        console.error('Failed to save RSS Feed:', response?.data?.message);
      }
    } catch (error) {
      console.error('Error saving RSS Feed:', error);
    }
  };

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
      console.log('API Response DATA ------>:', response?.data);
      if (response?.data?.responseCode === 200) {
        setData(response?.data?.payload?.feed_types);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSavedFeedData = async feedId => {
    try {
      const response = await axios.get(
        `http://192.168.18.127:8000/api/rss-feed/get-rss-feed/${feedId}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response?.data?.responseCode === 200) {
        setSavedData(response?.data?.payload); // Update state with saved feed data
      } else {
        console.error(
          'Failed to fetch saved feed data:',
          response?.data?.message,
        );
      }
    } catch (error) {
      console.error('Error fetching saved feed data:', error);
    }
  };

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
        <TouchableOpacity onPress={handleModalOpen}>
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
          />
        </View>
      </View>
      <ScrollView>
        <View style={styles.defaultContainer}>
          {savedData ? (
            <View style={styles.savedDataContainer}>
              <Text style={styles.savedDataText}>Saved Feed:</Text>
              <Text style={styles.savedDataDetails}>
                {savedData?.feed_name}
              </Text>
              <Text style={styles.savedDataDetails}>
                {savedData?.description}
              </Text>
            </View>
          ) : (
            <View style={styles.defaultContainer}>
              <View style={styles.iconContainer}>
                <Icon name="calendar" size={50} color="white" />
              </View>
              <Text style={styles.bodytext}>
                You have not created any reminder
              </Text>
              <Text style={{fontSize: 14}}>
                Created reminders will appear here.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal with zoom animation */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={handleModalClose}>
        <View style={styles.modalContainer}>
          <Animated.View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>RSS Feed</Text>
              <TouchableOpacity onPress={handleModalClose}>
                <Icon
                  name="close"
                  size={24}
                  color="white"
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>
            {data?.map(item => (
              <View key={item.id} style={styles.categories}>
                <TouchableOpacity
                  onPress={() => setId(item.id)} // Set selected feed id
                  style={{height: 40}}>
                  <Text style={styles.categoriestext}>{item.feed_name}</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
    marginTop: 100,
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
  categories: {
    backgroundColor: '#D8D8D8',
    borderRadius: 5,
    width: '100%',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoriestext: {
    paddingTop: 7,
    color: 'black',
    fontSize: 16,
    left: 20,
  },
  savedDataContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginTop: 20,
  },
  savedDataText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  savedDataDetails: {
    fontSize: 16,
    marginTop: 10,
  },
});
