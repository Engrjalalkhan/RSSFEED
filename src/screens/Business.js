/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  ScrollView,
} from 'react-native';
import axios from 'axios';

const Card = ({item}) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => Linking.openURL(item.parma_link)}>
    <Image source={{uri: item.thumbnail}} style={styles.image} />
    <View style={{backgroundColor: '#DF4B38'}}>
      <Text style={styles.header} numberOfLines={1} ellipsizeMode="tail">
        {item.title}
      </Text>
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.body} numberOfLines={3} ellipsizeMode="tail">
        {item.desc}
      </Text>
      <View style={{flexDirection: 'row'}}>
        <Text style={[styles.body]} numberOfLines={1} ellipsizeMode="tail">
          {item.time}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const BusinessScreen = () => {
  const [businessData, setBusinessData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiNzhkOTIxZGVhYzNkZmY1ZWU1ODExMTYwOTg5MDNjNTc0MWZiMmJiNTQ2ZWE5ZjgxMjdiYzE3MGU1Y2NmOWJkYmEyZDc3OWM5YmY2NWIwNjQiLCJpYXQiOjE3MzQ5MzMwMjIuOTMzNDUzLCJuYmYiOjE3MzQ5MzMwMjIuOTMzNDU3LCJleHAiOjE3NjY0NjkwMjIuOTE5NDI0LCJzdWIiOiIxNCIsInNjb3BlcyI6W119.B6auUlAWzTqDQddZuNILql0tmP2ktMkaAFqp047WGRZsJZMhIWhSU2CCv6UvwI9uQwR1yevszrcwWdnt8KEMFE1u_W3wVmai3AZM-y0rktM1dfOxgZNwCodyjcTobU2YgsJViuEv-0W6BsIk2rouyZHmFSMD84haRSi2SkIGYKxymBLzT8ikmLMNBEa_slNkmpCPmamTl-1wdYA_WbvO3lH71-OzByjrmpP5rRXI91sasTYn_Upn9E79DKDZfkktc9Qf8c-P5pdHjxZ1cGgw1VRGt6nt3XOiozH-gxn2NvncvTDTYlNF7Iys0UQ4_hcoj--5ikbg0h5o_2rJvKMOR-OgULa1V4G715itx4YTrl4duik4sVvU42IO5nvMhkKC19iRoe3l1ZSFR-4zEv0vxg-GYM-faTGOUvUj1LmiuA8ZOp8UJ3MjCuQ7ILa38oZV8qghAr2QzW9ONio8JIKKoV6mzEC9LIaQxLfrvoRpo2nrX3Ec3ECipw-gyerUb_dbhdSx1IdMhdyBcTv_Rh0oM4rae6dCOPx7TrmSpelUSzkTanC4gpzsgrZtKPymhvMVaMRlABTAIrec9Nh6sFRw80G1miZvRhWFxEFhMdDEhC57N3Kr_qm8SGrZZkm0_qujQV7l6G8zFQ5rmPxdwB19V59EwNNHtdQzJBGRideQ8uw';

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
        console.log('success---->', response.data);
        setBusinessData(response?.data?.payload?.feeds?.data || []);
      } catch (err) {
        console.log('Falied --->', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={'#DF4B38'} />
        <Text style={{left: 10}}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.error}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.gridContainer}>
        {businessData.map(item => (
          <Card key={item.parma_link} item={item} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
    width: '48%',
  },
  image: {
    width: '100%',
    height: 150,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  header: {
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
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  error: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default BusinessScreen;
