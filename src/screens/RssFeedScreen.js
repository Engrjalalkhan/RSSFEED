/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
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
  useColorScheme,
  RefreshControl,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
const RssFeedScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
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
  const [refreshing, setRefreshing] = useState(false);
  const [isListView, setIsListView] = useState(true);
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const searchTimeout = useRef(null);
  const Navigation = useNavigation();

  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const handleToggleSwitch = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };
  const styles = getDynamicStyles(isDarkMode);


  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiYTg1OGQyMTk2NTk1YzQwZDliYmVhNTdmOWVlMTdkNjkwZTdmZmQ1NDQ3ODM3NmNhOGY4Nzg3ZjQyY2YwMGIzYjc3YTdhZDEzMWM4ZDczMzYiLCJpYXQiOjE3MzU2MzA1MDEuOTIwMTc3LCJuYmYiOjE3MzU2MzA1MDEuOTIwMTgxLCJleHAiOjE3NjcxNjY1MDEuOTAxNDUzLCJzdWIiOiIxNCIsInNjb3BlcyI6W119.vOcLVAKKwSAHm8SaHHyMT3wCIzUYCot-N9yKGD5dJd-FuuHcvbR0syYVQORprbwd7jTgXajaazQsrq5EnMVNL3SamBxN3We56k8Z1bzqaTJ4tSVX4bDkk8cJVtav_y9UjmPOJlyzKh0BdfRJWrA08ySlLAlblKS83lhxSIPkpxxuSHEn4a64IdW6UeCe21D3CicGBMo6GPgea5qpC5DBUBsVihxGjS-aDUBo4_1UFmKtpsJJR7ghQbLlAxOBsx3j2pjfDy5T6I-wyTLn9Md2JIyGQv-vMkvfzBnbDTGwwk3ba3CW9GPWDCFhBuZ-RKL_gIRCebgp4fvATykYV7_tMosjLGlOfPHWxDT5gH9iJtqiiJsW9hBsmQmYQY8yT0GT-Y_dRfVPma6v95Fh3vvVYBXvcFJFySpt4Tprhzlg95BrU7Pc4Fr0YMqXgvr_IKFZBS5wGWxXZqXmiv086DrMaJ_9Fsq-3pjgwX8iyrRKQML7j0Uji4U0vDYzKRTz_nJhVn6zB4Qv9awSHMGGKvXcVBGYVhSzjaajKnx9FLsoxS9e5NmgyHQJ6GPQHFUHv_cjXp6yi_5CbmLZzKeseVngWPGt-Kk0LxCmhJUdjj7r4qVr5NSibZ-6urHi7xcoYOb1NBCrxzh68iVGjvOlXD86QefLCAabocE9oRTrdBm42-s';

  const handleSearch = query => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchLoading(false);
      setFilterData([]);
      return;
    }

    setSearchLoading(true);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }


    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await axios.get(
          'http://192.168.18.127:8000/api/rss-feed/search',
          {
            params: { search_value: query },
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

            setFilterData(filteredResults);
          } else {
            setFilterData([]);
          }
        } else {
          setFilterData([]);
        }
      } catch (error) {
        console.log('Error fetching filtered content:', error.message);
        setSearchLoading(false);
      } finally {
        setSearchLoading(false);
      }
    }, 500);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentpage(1);
    await RssfeedGetApi();
    setRefreshing(false);
  };


  const fetchCategories = async () => {
    setloading(false);
    if (!data.length === 0 && !loading) {
      setloading(true);
    }
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
        const feedTypes = response?.data?.payload?.feed_types || [];
        setData(Array.isArray(feedTypes) ? feedTypes : []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log('Error fetching categories:', error);
      setData([]);
    } finally {
      setloading(false);
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
      console.log('Error fetching categories:', error);
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
    setData(prevData =>
      prevData.map(item =>
        item.id === id
          ? { ...item, is_selected: !item.is_selected }
          : item
      )
    );
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

  useEffect(() => {
    const loadViewMode = async () => {
      try {
        const savedViewMode = await AsyncStorage.getItem('viewMode');
        if (savedViewMode !== null) {
          setIsListView(savedViewMode === 'list');
        }
      } catch (error) {
        console.log('Error loading view mode:', error);
      }
    };

    loadViewMode();
  }, []);

  const toggleViewMode = async () => {
    try {
      const newViewMode = !isListView;
      setIsListView(newViewMode);
      await AsyncStorage.setItem('viewMode', newViewMode ? 'list' : 'grid');
    } catch (error) {
      console.log('Error saving view mode:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headertext}>Palsome</Text>
      </View>
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={() => Navigation.navigate('Splash')}>
          <Image
            source={require('../assets/icon/arrow-left.jpg')}
            style={styles.backicon}
          />
        </TouchableOpacity>
        <Text style={styles.Rsstext}>RSS Feed</Text>
        <Switch
          value={isDarkMode}
          onValueChange={handleToggleSwitch}
          thumbColor={isDarkMode ? '#fff' : 'gray'}
          trackColor={{ false: '#ccc', true: '#DF4B38' }}
          style={{ right: 50 }}
        />
        <TouchableOpacity onPress={handleModalOpen}>
          <Image
            source={require('../assets/icon/plus-icon.png')}
            style={styles.plusicon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.searchbox}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Search RSS Feed..."
            placeholderTextColor={isDarkMode ? '#DADADA' : 'gray'}
            style={styles.input}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity onPress={() => handleSearch(searchQuery)}>
            <Icon name="search" size={25} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={toggleViewMode}>
          <Icon
            name={isListView ? 'grid' : 'list'}
            size={25}
            color={isDarkMode ? '#FF6F61' : '#DF4B38'}
            style={{ paddingLeft: 10, marginTop: 7 }}
          />
        </TouchableOpacity>
      </View>

      {searchLoading ? (
        <ActivityIndicator
          size="large"
          color="#DF4B38"
          style={{ marginTop: 20 }}
        />
      ) : searchQuery.length > 0 &&
        filterData.length === 0 ? (
        <View style={styles.noResultContainer}>
          <Image
            source={require('../assets/icon/nosearch.png')}
            style={{ width: 30, height: 40 }}
          />
          <Text style={styles.noResultText}>No Record Found</Text>
          <Text style={{ fontSize: 14, color: 'gray' }}>
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
                You haven't selected any feed yet.
              </Text>
              <Text style={{ fontSize: 14, color: isDarkMode ? '#DADADA' : 'black' }}>
                Selected RSS Feed will appear here.
              </Text>
            </View>
          </View>
        </ScrollView>
      ) : loading ? (
        <ActivityIndicator size="large" color={'#DF4B38'} />
      ) : (
        <FlatList
          data={searchQuery.length === 0 ? rssData : filterData}
          keyExtractor={(item, index) => `${index}-${item.id}`}
          key={isListView ? 'list' : 'grid'}
          numColumns={isListView ? 1 : 2}
          columnWrapperStyle={!isListView && styles.gridContainer}
          renderItem={({ item }) => {
            const imageSource = item.thumbnail
              ? { uri: item.thumbnail }
              : require('../assets/download.png');
            const description = item.desc?.trim() || 'Click to view details';

            return (
              <View
                style={[
                  styles.cardContainer,
                  isListView ? styles.cardContainerSingle : styles.cardContainerSingleGrid,
                  filterData.length === 1 && isListView,
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (item.parma_link) {
                      Linking.openURL(item.parma_link).catch(err =>
                        console.error('Error opening link:', err),
                      );
                    }
                  }}
                >
                  <Image
                    source={imageSource}
                    style={styles.thumbnail}
                  />
                  <View style={styles.cardContent}>
                    <Text style={styles.title} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.body} numberOfLines={3}>
                      {description}
                    </Text>
                    <View style={styles.timeContainer}>
                      <Text style={styles.time} numberOfLines={1}>
                        {item.time}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            paginationLoading && (
              <ActivityIndicator
                size="large"
                color="#DF4B38"
                style={{ margin: 20 }}
              />
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#DF4B38']}
              tintColor="#DF4B38"
            />
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
                  size={25}
                  color={isDarkMode ? '#202020' : 'white'}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>
            {data.length === 0 ? (
              <ActivityIndicator
                size="large"
                color="#DF4B38"
                style={{ margin: 30 }}
              />
            ) : loading ? (
              <Text style={{ margin: 10 }}>No Feeds available</Text>
            ) : (
              data.map(item => (
                <View key={item.id} style={styles.categories}>
                  <TouchableOpacity
                    onPress={() => toggleCategorySelection(item.id)}
                    style={[
                      { height: 40, borderRadius: 5 },
                      selectedIds.includes(item.id) || item.is_selected
                        ? { backgroundColor: '#DF4B38' }
                        : { backgroundColor: '#D8D8D8' },
                    ]}>
                    <Text
                      style={[
                        styles.categoriestext,
                        selectedIds.includes(item.id) || item.is_selected
                          ? { color: 'white' }
                          : { color: 'black' },
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
              disabled={saveLoading}
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

const getDynamicStyles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
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
    color: isDarkMode ? '#FFFFFF' : 'white',
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
    width: 27,
    height: 27,
    borderRadius: 20,
    elevation: 10,
  },
  plusicon: {
    width: 25,
    height: 25,
    borderRadius: 20,
    right: 45,
  },
  Rsstext: {
    fontSize: 24,
    color: isDarkMode ? '#FFFFFF' : 'black',
    fontWeight: '500',
    marginHorizontal: 100,
  },
  searchbox: {
    flexDirection: 'row',
    margin: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#2C2C2C' : 'lightgray',
    borderRadius: 10,
    width: '90%',
    borderColor: isDarkMode ? '#DADADA' : 'lightgray',
    borderWidth: 1,
    position: 'relative',
  },
  icon: {
    right: 10,
    color: isDarkMode ? '#FF6F61' : '#DF4B38',
  },
  input: {
    height: 40,
    flex: 1,
    paddingLeft: 40,
    color: isDarkMode ? '#FFFFFF' : 'black',
    right: 20,
  },
  defaultContainer: {
    paddingTop: 20,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: isDarkMode ? '#424242' : '#2C3E50',
    borderRadius: 50,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodytext: {
    fontSize: 16,
    paddingTop: 30,
    color: isDarkMode ? '#DADADA' : 'black',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '95%',
    padding: 20,
    backgroundColor: isDarkMode ? '#1F1F1F' : 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '112%',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#444' : 'lightgray',
    paddingBottom: 5,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDarkMode ? '#DADADA' : '#000000',
    left: 20,
  },
  closeIcon: {
    backgroundColor: isDarkMode ? '#DADADA' : '#2C3E50',
    borderRadius: 25,
    right: 20,
    bottom: 3,
  },
  saveButton: {
    backgroundColor: isDarkMode ? '#FF6F61' : '#DF4B38',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: isDarkMode ? '#DADADA' : 'white',
    fontSize: 16,
  },
  savedDataDetails: {
    fontSize: 16,
    marginTop: 10,
    color: isDarkMode === 'dark' ? '#FFFFFF' : '#000000',
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 180,
  },
  cardContainer: {
    margin: 5,
    borderRadius: 8,
    backgroundColor: isDarkMode === 'dark' ? '#2C2C2C' : '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: isDarkMode === 'dark' ? 0.2 : 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    width: '97%',
  },
  thumbnail: {
    width: '100%',
    height: 150,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  cardContent: {
    borderWidth: 1,
    borderColor: isDarkMode === 'dark' ? '#DF4B38' : '#DF4B38',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    height: 150,
    backgroundColor: isDarkMode === 'dark' ? '#3C3C3C' : '#FFFFFF',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#DF4B38',
    height: 40,
    paddingTop: 7,
    width: '100%',
    padding: 10,
  },
  body: {
    fontSize: 14,
    color: isDarkMode === 'dark' ? '#FFFFFF' : '#000000',
    marginBottom: 10,
    padding: 10,
  },
  timeContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  time: {
    fontSize: 14,
    color: isDarkMode === 'dark' ? '#FFFFFF' : '#000000',
  },
  cardContainerSingle: {
    margin: 10,
    width: '95%',
    backgroundColor: isDarkMode === 'dark' ? '#2C2C2C' : '#FFFFFF',
  },
  cardContainerSingleGrid: {
    width: 180,
    backgroundColor: isDarkMode === 'dark' ? '#2C2C2C' : '#FFFFFF',
  },
  noResultContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noResultText: {
    fontSize: 16,
    color: isDarkMode === 'dark' ? '#BBBBBB' : '#888888',
    fontWeight: 'bold',
  },
});

