import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import axios from 'axios';

const RssFeedScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiNzQ4YmVmYWQ1MWU5M2Q4NWM4M2NmNDFjNzQ5ZDQzMzM5MjdiMTg3NDQ3OGYwY2U0MzY0YjI3OWVkMTgwMTczMDNjNWM2MTQyYzc2N2UxYmUiLCJpYXQiOjE3MzU1NTAwNTAuMzM0NzUxLCJuYmYiOjE3MzU1NTAwNTAuMzM0NzU2LCJleHAiOjE3NjcwODYwNTAuMjQ4MDIsInN1YiI6IjE0Iiwic2NvcGVzIjpbXX0.Fpk998tlk2TYlM1glFpeNNM1S7JP5Y0F1FuV1vntXPV2AfasMl1nO0ix41bAhTQaDBLgkSbS_bDA1y8t6Nvm1GLskN9qHqlZ396piYmoKuabKUPXi2UkXTWlYalHUsshWRyP99zjjIZSvVLuQOlz_iRwqqnmcKIVAaTWpZ7YRkkjmRafFGnhLsVENu8uw89o9PRFqSZHCf2R2dNRlQIBokIwZD19TlocNvJ6PBrW5R7CA_ZFlwVJm43CBhVSDhXvWydq0xnci8mWtj8O-PoZ_iCqlZ9Nr5bG_5yofzBRIO9YTzp2JrO7jwJD5wkM-HTmP1_Evquu-uP-khzWLjX9GdA682LOicg7KwUfhJYDHzte9jKyAC8ssVDZB0lmQP389yBsUe0soT4p9syskAXqBHNOr1m9rAXo45iIRxXsppd6fW3MxD8WSJXT2lbTSHRtX6-f5CTuT0mWJKNILijB2HuNfW_VC2GbAbkF5G7fbdSFu-JAnsyTUJ4TWQBhQ-m1JiZa4hekOUuNfI3_Cc-ho_PnavDy7VI22FYo5Oss9R8RfCQlCRgjObQ_nQeQel-GtilXdhYUOSV_FVfkGDAhn7bPyudH_ipRLxV7w0pV6Ks6akThlJr2smgfM9b2i2ejAIoWJvnMdouXvwpWj5Fr0jfqefU_CxAoT4aS79Gpg-c';

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
          response.data &&
          response.data.payload &&
          response.data.payload.feeds
        ) {
          setData(response.data.payload.feeds.data);
          console.log('Fetched Data:', response.data.payload.feeds.data);
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
      <View
        key={index}
        style={[
          styles.card,
          // index % 2 === 0 ? styles.leftCard : styles.rightCard,
        ]}>
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
    return <Text>Loading...</Text>;
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
    padding: 10,
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
  // leftCard: {
  //   marginRight: '2%',
  // },
  // rightCard: {
  //   marginLeft: '2%',
  // },
  image: {
    width: '100%',
    height: 150,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  cardContent: {
    // padding: 10,
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

export default RssFeedScreen;
