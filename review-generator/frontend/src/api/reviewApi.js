import axios from 'axios';

const generateReview = async (keywords) => {
  try {
    const response = await axios.post('http://localhost:5000/api/generate-review', { keywords });
    return response.data.review;
  } catch (error) {
    console.error('Error generating review:', error);
    return '';
  }
};

export default generateReview;
