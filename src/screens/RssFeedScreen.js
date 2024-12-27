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
  const [data, setData] = useState();
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiNzhkOTIxZGVhYzNkZmY1ZWU1ODExMTYwOTg5MDNjNTc0MWZiMmJiNTQ2ZWE5ZjgxMjdiYzE3MGU1Y2NmOWJkYmEyZDc3OWM5YmY2NWIwNjQiLCJpYXQiOjE3MzQ5MzMwMjIuOTMzNDUzLCJuYmYiOjE3MzQ5MzMwMjIuOTMzNDU3LCJleHAiOjE3NjY0NjkwMjIuOTE5NDI0LCJzdWIiOiIxNCIsInNjb3BlcyI6W119.B6auUlAWzTqDQddZuNILql0tmP2ktMkaAFqp047WGRZsJZMhIWhSU2CCv6UvwI9uQwR1yevszrcwWdnt8KEMFE1u_W3wVmai3AZM-y0rktM1dfOxgZNwCodyjcTobU2YgsJViuEv-0W6BsIk2rouyZHmFSMD84haRSi2SkIGYKxymBLzT8ikmLMNBEa_slNkmpCPmamTl-1wdYA_WbvO3lH71-OzByjrmpP5rRXI91sasTYn_Upn9E79DKDZfkktc9Qf8c-P5pdHjxZ1cGgw1VRGt6nt3XOiozH-gxn2NvncvTDTYlNF7Iys0UQ4_hcoj--5ikbg0h5o_2rJvKMOR-OgULa1V4G715itx4YTrl4duik4sVvU42IO5nvMhkKC19iRoe3l1ZSFR-4zEv0vxg-GYM-faTGOUvUj1LmiuA8ZOp8UJ3MjCuQ7ILa38oZV8qghAr2QzW9ONio8JIKKoV6mzEC9LIaQxLfrvoRpo2nrX3Ec3ECipw-gyerUb_dbhdSx1IdMhdyBcTv_Rh0oM4rae6dCOPx7TrmSpelUSzkTanC4gpzsgrZtKPymhvMVaMRlABTAIrec9Nh6sFRw80G1miZvRhWFxEFhMdDEhC57N3Kr_qm8SGrZZkm0_qujQV7l6G8zFQ5rmPxdwB19V59EwNNHtdQzJBGRideQ8uw';

    const handleSave = async () => {
  if (!id) {
    console.log('No RSS Feed selected to save');
    return;
  }

  try {
    const response = await axios.post(
      'http://192.168.18.127:8000/api/rss-feed/save-rss-feed',
      { feed_id: id }, // Payload for the POST request
      {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response?.data?.responseCode === 200) {
      console.log('RSS Feed saved successfully:', response?.data);
      setModalVisible(false); // Close the modal upon success
    } else {
      console.error('Failed to save RSS Feed:', response?.data?.message);
    }
  } catch (error) {
    console.error('Error saving RSS Feed:', error);
  }
};

  useEffect(() => {
    fetchCategories();
  }, []);
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

  const handleModalOpen = () => {
    console.log('Opening Modal');

    setModalVisible(true);
  };

  const handleModalClose = () => {
    console.log('Closing Modal');
    setModalVisible(false);
  };
  // console.log(modalVisible);
  console.log('--------', data);
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
          <View style={styles.iconContainer}>
            <Icon name="calendar" size={50} color="white" />
          </View>
          <Text style={styles.bodytext}>You have not created any reminder</Text>
          <Text style={{fontSize: 14}}>
            Created reminders will appear here.
          </Text>
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
            {data?.map(item => {
              return (
                <View key={item.id} style={styles.categories}>
                  <TouchableOpacity
                    onPress={() => console.log(item.id)}
                    style={{height: 40}}>
                    <Text style={styles.categoriestext}>{item.feed_name}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
            <TouchableOpacity style={styles.saveButton}>
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
});
