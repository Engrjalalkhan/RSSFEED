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
import CommonScreen from './CommonScreen';

const RssFeedScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]); // Array to store selected category ids
  const [data, setData] = useState([]);
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiYTg1OGQyMTk2NTk1YzQwZDliYmVhNTdmOWVlMTdkNjkwZTdmZmQ1NDQ3ODM3NmNhOGY4Nzg3ZjQyY2YwMGIzYjc3YTdhZDEzMWM4ZDczMzYiLCJpYXQiOjE3MzU2MzA1MDEuOTIwMTc3LCJuYmYiOjE3MzU2MzA1MDEuOTIwMTgxLCJleHAiOjE3NjcxNjY1MDEuOTAxNDUzLCJzdWIiOiIxNCIsInNjb3BlcyI6W119.vOcLVAKKwSAHm8SaHHyMT3wCIzUYCot-N9yKGD5dJd-FuuHcvbR0syYVQORprbwd7jTgXajaazQsrq5EnMVNL3SamBxN3We56k8Z1bzqaTJ4tSVX4bDkk8cJVtav_y9UjmPOJlyzKh0BdfRJWrA08ySlLAlblKS83lhxSIPkpxxuSHEn4a64IdW6UeCe21D3CicGBMo6GPgea5qpC5DBUBsVihxGjS-aDUBo4_1UFmKtpsJJR7ghQbLlAxOBsx3j2pjfDy5T6I-wyTLn9Md2JIyGQv-vMkvfzBnbDTGwwk3ba3CW9GPWDCFhBuZ-RKL_gIRCebgp4fvATykYV7_tMosjLGlOfPHWxDT5gH9iJtqiiJsW9hBsmQmYQY8yT0GT-Y_dRfVPma6v95Fh3vvVYBXvcFJFySpt4Tprhzlg95BrU7Pc4Fr0YMqXgvr_IKFZBS5wGWxXZqXmiv086DrMaJ_9Fsq-3pjgwX8iyrRKQML7j0Uji4U0vDYzKRTz_nJhVn6zB4Qv9awSHMGGKvXcVBGYVhSzjaajKnx9FLsoxS9e5NmgyHQJ6GPQHFUHv_cjXp6yi_5CbmLZzKeseVngWPGt-Kk0LxCmhJUdjj7r4qVr5NSibZ-6urHi7xcoYOb1NBCrxzh68iVGjvOlXD86QefLCAabocE9oRTrdBm42-s';

  const handleSave = async () => {
    if (selectedIds.length === 0) {
      console.log('No RSS Feed selected to save');
      setModalVisible(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://192.168.18.127:8000/api/rss-feed/save-rss-feed',
        {selected_ids: selectedIds}, // Directly send the array as an object property
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

        // After saving, navigate to the common screen and pass selectedIds as params
        navigation.navigate('CommonScreen', {selectedIds});
      } else {
        console.error('Failed to save RSS Feed:', response?.data?.message);
        setModalVisible(false);
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

  const toggleCategorySelection = id => {
    setSelectedIds(prevSelectedIds => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter(itemId => itemId !== id); // Deselect the category
      } else {
        return [...prevSelectedIds, id]; // Select the category
      }
    });
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
          {selectedIds.length > 0 ? (
            <View style={{flex:1,padding:5}}>
              <CommonScreen />
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
                  onPress={() => toggleCategorySelection(item.id)} // Toggle selection
                  style={[
                    {height: 40},
                    selectedIds.includes(item.id)
                      ? {backgroundColor: '#DF4B38'}
                      : {backgroundColor: '#D8D8D8'},
                  ]}>
                  <Text
                    style={[
                      styles.categoriestext,
                      selectedIds.includes(item.id)
                        ? {color: 'white'}
                        : {color: 'black'},
                    ]}>
                    {item.feed_name}
                  </Text>
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
    paddingTop:20,
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
    borderRadius: 5,
    width: '100%',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoriestext: {
    paddingTop: 7,
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
