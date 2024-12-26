import axios from 'axios';

export const fetchContentData = async searchQuery => {
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiNzhkOTIxZGVhYzNkZmY1ZWU1ODExMTYwOTg5MDNjNTc0MWZiMmJiNTQ2ZWE5ZjgxMjdiYzE3MGU1Y2NmOWJkYmEyZDc3OWM5YmY2NWIwNjQiLCJpYXQiOjE3MzQ5MzMwMjIuOTMzNDUzLCJuYmYiOjE3MzQ5MzMwMjIuOTMzNDU3LCJleHAiOjE3NjY0NjkwMjIuOTE5NDI0LCJzdWIiOiIxNCIsInNjb3BlcyI6W119.B6auUlAWzTqDQddZuNILql0tmP2ktMkaAFqp047WGRZsJZMhIWhSU2CCv6UvwI9uQwR1yevszrcwWdnt8KEMFE1u_W3wVmai3AZM-y0rktM1dfOxgZNwCodyjcTobU2YgsJViuEv-0W6BsIk2rouyZHmFSMD84haRSi2SkIGYKxymBLzT8ikmLMNBEa_slNkmpCPmamTl-1wdYA_WbvO3lH71-OzByjrmpP5rRXI91sasTYn_Upn9E79DKDZfkktc9Qf8c-P5pdHjxZ1cGgw1VRGt6nt3XOiozH-gxn2NvncvTDTYlNF7Iys0UQ4_hcoj--5ikbg0h5o_2rJvKMOR-OgULa1V4G715itx4YTrl4duik4sVvU42IO5nvMhkKC19iRoe3l1ZSFR-4zEv0vxg-GYM-faTGOUvUj1LmiuA8ZOp8UJ3MjCuQ7ILa38oZV8qghAr2QzW9ONio8JIKKoV6mzEC9LIaQxLfrvoRpo2nrX3Ec3ECipw-gyerUb_dbhdSx1IdMhdyBcTv_Rh0oM4rae6dCOPx7TrmSpelUSzkTanC4gpzsgrZtKPymhvMVaMRlABTAIrec9Nh6sFRw80G1miZvRhWFxEFhMdDEhC57N3Kr_qm8SGrZZkm0_qujQV7l6G8zFQ5rmPxdwB19V59EwNNHtdQzJBGRideQ8uw';

  try {
    const response = await axios.get(
      'http://192.168.18.127:8000/api/rss-feed/search',
      {
        params: {search_value: searchQuery},
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      },
    );

    const feeds = response?.data?.payload?.feeds;

    if (feeds && typeof feeds === 'object') {
      const feedsArray = Object.values(feeds);
      const filteredResults = feedsArray.filter(item => {
        const titleMatch = item?.title
          ?.toLowerCase()
          ?.includes(searchQuery.toLowerCase());
        const descriptionMatch = item?.desc
          ?.toLowerCase()
          ?.includes(searchQuery.toLowerCase());

        return titleMatch || descriptionMatch;
      });
      return filteredResults;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching content:', error.message);
    return [];
  }
};
