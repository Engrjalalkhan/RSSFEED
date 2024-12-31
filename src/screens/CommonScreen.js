/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const CommonScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiYTg1OGQyMTk2NTk1YzQwZDliYmVhNTdmOWVlMTdkNjkwZTdmZmQ1NDQ3ODM3NmNhOGY4Nzg3ZjQyY2YwMGIzYjc3YTdhZDEzMWM4ZDczMzYiLCJpYXQiOjE3MzU2MzA1MDEuOTIwMTc3LCJuYmYiOjE3MzU2MzA1MDEuOTIwMTgxLCJleHAiOjE3NjcxNjY1MDEuOTAxNDUzLCJzdWIiOiIxNCIsInNjb3BlcyI6W119.vOcLVAKKwSAHm8SaHHyMT3wCIzUYCot-N9yKGD5dJd-FuuHcvbR0syYVQORprbwd7jTgXajaazQsrq5EnMVNL3SamBxN3We56k8Z1bzqaTJ4tSVX4bDkk8cJVtav_y9UjmPOJlyzKh0BdfRJWrA08ySlLAlblKS83lhxSIPkpxxuSHEn4a64IdW6UeCe21D3CicGBMo6GPgea5qpC5DBUBsVihxGjS-aDUBo4_1UFmKtpsJJR7ghQbLlAxOBsx3j2pjfDy5T6I-wyTLn9Md2JIyGQv-vMkvfzBnbDTGwwk3ba3CW9GPWDCFhBuZ-RKL_gIRCebgp4fvATykYV7_tMosjLGlOfPHWxDT5gH9iJtqiiJsW9hBsmQmYQY8yT0GT-Y_dRfVPma6v95Fh3vvVYBXvcFJFySpt4Tprhzlg95BrU7Pc4Fr0YMqXgvr_IKFZBS5wGWxXZqXmiv086DrMaJ_9Fsq-3pjgwX8iyrRKQML7j0Uji4U0vDYzKRTz_nJhVn6zB4Qv9awSHMGGKvXcVBGYVhSzjaajKnx9FLsoxS9e5NmgyHQJ6GPQHFUHv_cjXp6yi_5CbmLZzKeseVngWPGt-Kk0LxCmhJUdjj7r4qVr5NSibZ-6urHi7xcoYOb1NBCrxzh68iVGjvOlXD86QefLCAabocE9oRTrdBm42-s';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://192.168.18.127:8000/api/rss-feed/index?page_type=allFeeds',
          {
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
            },
          },
        );
        if (
          response?.data &&
          response?.data?.payload &&
          response?.data?.payload?.feeds
        ) {
          setData(response?.data?.payload?.feeds?.data);
          console.log('Fetched Data:', response?.data?.payload?.feeds?.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render each item as a card
  const renderCards = () => {
    return data.map((item, index) => (
      <View key={index} style={styles.card}>
        <TouchableOpacity
          onPress={() => {
            if (item.parma_link) {
              Linking.openURL(item.parma_link).catch(err =>
                console.error('Error opening link:', err),
              );
            }
          }}>
          <Image source={{uri: item.thumbnail}} style={styles.image} />
          <View style={styles.cardContent}>
            <Text style={styles.header} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.body} numberOfLines={3}>
              {item.desc}
            </Text>
            <Text style={styles.body} numberOfLines={1}>
              {item.time}{' '}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    ));
  };

  if (loading) {
    return (
      <ActivityIndicator size={30} color="#DF4B38" style={{paddingTop: 10}} />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.gridContainer}>{renderCards()}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 1,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 3,
    elevation: 5,
    width: '48%',
  },
  image: {
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
  },
  header: {
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
});

export default CommonScreen;
