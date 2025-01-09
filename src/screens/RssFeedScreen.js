/* eslint-disable react-hooks/exhaustive-deps */
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
  ActivityIndicator,
  Linking,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const RssFeedScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]); // Array to store selected category ids
  const [data, setData] = useState([]);
  const [rssData, setRssData] = useState([]);
  const [loading, setloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentpage, setCurrentpage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [lastpage, setLastpage] = useState(false);

  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiYTg1OGQyMTk2NTk1YzQwZDliYmVhNTdmOWVlMTdkNjkwZTdmZmQ1NDQ3ODM3NmNhOGY4Nzg3ZjQyY2YwMGIzYjc3YTdhZDEzMWM4ZDczMzYiLCJpYXQiOjE3MzU2MzA1MDEuOTIwMTc3LCJuYmYiOjE3MzU2MzA1MDEuOTIwMTgxLCJleHAiOjE3NjcxNjY1MDEuOTAxNDUzLCJzdWIiOiIxNCIsInNjb3BlcyI6W119.vOcLVAKKwSAHm8SaHHyMT3wCIzUYCot-N9yKGD5dJd-FuuHcvbR0syYVQORprbwd7jTgXajaazQsrq5EnMVNL3SamBxN3We56k8Z1bzqaTJ4tSVX4bDkk8cJVtav_y9UjmPOJlyzKh0BdfRJWrA08ySlLAlblKS83lhxSIPkpxxuSHEn4a64IdW6UeCe21D3CicGBMo6GPgea5qpC5DBUBsVihxGjS-aDUBo4_1UFmKtpsJJR7ghQbLlAxOBsx3j2pjfDy5T6I-wyTLn9Md2JIyGQv-vMkvfzBnbDTGwwk3ba3CW9GPWDCFhBuZ-RKL_gIRCebgp4fvATykYV7_tMosjLGlOfPHWxDT5gH9iJtqiiJsW9hBsmQmYQY8yT0GT-Y_dRfVPma6v95Fh3vvVYBXvcFJFySpt4Tprhzlg95BrU7Pc4Fr0YMqXgvr_IKFZBS5wGWxXZqXmiv086DrMaJ_9Fsq-3pjgwX8iyrRKQML7j0Uji4U0vDYzKRTz_nJhVn6zB4Qv9awSHMGGKvXcVBGYVhSzjaajKnx9FLsoxS9e5NmgyHQJ6GPQHFUHv_cjXp6yi_5CbmLZzKeseVngWPGt-Kk0LxCmhJUdjj7r4qVr5NSibZ-6urHi7xcoYOb1NBCrxzh68iVGjvOlXD86QefLCAabocE9oRTrdBm42-s';

  const handleSearch = async query => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchLoading(false);
      setFilterData([]);
      return;
    }
    if (searchQuery) {
      setSearchLoading(true);
    }

    try {
      const response = await axios.get(
        'http://192.168.18.127:8000/api/rss-feed/search',
        {
          params: {search_value: query},
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response?.data?.responseCode === 200) {
        const feeds = response?.data?.payload?.feeds;

        if (feeds?.length > 0) {
          const feedsArray = Object.values(feeds);
          const filteredResults = feedsArray.filter(item => {
            const titleMatch = item?.title
              ?.toLowerCase()
              ?.includes(query.toLowerCase());
            const descriptionMatch = item?.desc
              ?.toLowerCase()
              ?.includes(query.toLowerCase());
            return titleMatch || descriptionMatch;
          });

          if (filteredResults.length > 0) {
            setFilterData(filteredResults);
          } else {
            setFilterData([]);
          }
        } else {
          setFilterData([]);
        }
      }
    } catch (error) {
      console.log('Error fetching filtered content:', error.message);
    }
  };

  const RssfeedGetApi = async () => {
    if (currentpage === 1) {
      setloading(true);
    }

    try {
      const response = await axios.get(
        `http://192.168.18.127:8000/api/rss-feed/index?page_type=allFeeds&page=${currentpage}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response?.data?.responseCode === 200) {
        const newFeeds = response?.data?.payload?.feeds?.data || [];
        setLastpage(response?.data?.payload?.feeds?.last_page);

        const updatedFeeds = newFeeds.filter(
          newFeed =>
            !rssData.some(existingFeed => existingFeed.id === newFeed.id),
        );

        setRssData(prevData => [...prevData, ...updatedFeeds]);
      }
    } catch (error) {
      console.log('Error fetching RSS feeds:', error);
    } finally {
      setloading(false);
      setPaginationLoading(false);
    }
  };

  useEffect(() => {
    RssfeedGetApi();
  }, [currentpage]);

  const handleLoadMore = () => {
    if (
      !loading &&
      !paginationLoading &&
      !searchQuery &&
      currentpage < lastpage
    ) {
      setPaginationLoading(true);
      setCurrentpage(prevPage => prevPage + 1);
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

      if (response?.data?.responseCode === 200) {
        setData(response?.data?.payload?.feed_types);
        setloading(false);
      }
    } catch (error) {
      console.log('Error fetching categories:', error);
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const response = await axios.post(
        'http://192.168.18.127:8000/api/rss-feed/save-rss-feed',
        {
          selected_ids: selectedIds,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response?.data?.responseCode === 200) {
        setCurrentpage(1);
        setRssData([]);
        setModalVisible(false);
        RssfeedGetApi();
        setSearchQuery('');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const toggleCategorySelection = id => {
    setSelectedIds(prevSelectedIds => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter(itemId => itemId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
    setSearchQuery('');
  };

  const handleModalOpen = () => {
    setSelectedIds([...selectedIds]);
    setModalVisible(true);
    fetchCategories();
  };

  const handleModalClose = () => {
    setSelectedIds([]);
    setModalVisible(false);
  };

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
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      {/* Conditionally render filtered or full RSS data */}
      {searchLoading ? (
        <ActivityIndicator
          size="large"
          color="#DF4B38"
          style={{marginTop: 20}}
        />
      ) : searchQuery.length > 0 &&
        filterData.length === 0 &&
        !searchLoading ? (
        <View style={styles.noResultContainer}>
          <Image
            source={require('../assets/icon/nosearch.png')}
            style={{width: 30, height: 40}}
          />
          <Text style={styles.noResultText}>No Record Found</Text>
          <Text style={{fontSize: 14, color: 'gray'}}>
            What you searched was unfortunately not found.
          </Text>
        </View>
      ) : rssData.length === 0 && !loading ? (
        <ScrollView>
          <View style={styles.defaultContainer}>
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
          </View>
        </ScrollView>
      ) : loading ? (
        <ActivityIndicator size={'large'} color={'#DF4B38'} />
      ) : (
        <FlatList
          data={searchQuery.length === 0 ? rssData : filterData}
          keyExtractor={(item, index) => `${index}-${item.id}`}
          numColumns={2}
          renderItem={({item}) => (
            <View
              style={[
                styles.cardContainer,
                filterData.length === 1 && styles.cardContainerSingle,
              ]}>
              <TouchableOpacity
                onPress={() => {
                  if (item.parma_link) {
                    Linking.openURL(item.parma_link).catch(err =>
                      console.error('Error opening link:', err),
                    );
                  }
                }}>
                <Image
                  source={{uri: item.thumbnail}}
                  style={styles.thumbnail}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.body} numberOfLines={3}>
                    {item.desc}
                  </Text>
                  <Text style={styles.body} numberOfLines={1}>
                    {item.time}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          columnWrapperStyle={styles.columnWrapper}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5} // Trigger when 50% from the bottom
          ListFooterComponent={
            paginationLoading && (
              <ActivityIndicator
                size="large"
                color="#DF4B38"
                style={{margin: 20}}
              />
            )
          }
        />
      )}

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
            {data.length === 0 ? (
              <ActivityIndicator
                size={'large'}
                color={'red'}
                style={{margin: 30}}
              />
            ) : (
              data.map(item => (
                <View key={item.id} style={styles.categories}>
                  <TouchableOpacity
                    onPress={() => toggleCategorySelection(item.id)}
                    style={[
                      {height: 40, borderRadius: 5},
                      selectedIds.includes(item.id) || item.is_selected
                        ? {backgroundColor: '#DF4B38'}
                        : {backgroundColor: '#D8D8D8'},
                    ]}>
                    <Text
                      style={[
                        styles.categoriestext,
                        selectedIds.includes(item.id) || item.is_selected
                          ? {color: 'white'}
                          : {color: 'black'},
                      ]}>
                      {item.feed_name}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={saveLoading} // Disable button during save
            >
              {saveLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
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
    paddingTop: 20,
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
    width: '113%',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    margin: 3,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    width: 180,
  },
  thumbnail: {
    width: '100%',
    height: 150,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  cardContent: {
    borderWidth: 1,
    borderColor: '#DF4B38',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    height: 170,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#DF4B38',
    height: 40,
    paddingTop: 7,
    width: '100%',
    padding: 10,
  },
  body: {
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
    padding: 10,
  },
  cardContainerSingle: {
    margin: 10,
    width: 180,
    marginRight: 180,
  },
  noResultContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noResultText: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'bold',
  },
});
