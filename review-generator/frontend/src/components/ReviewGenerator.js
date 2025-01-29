import React, { useState } from 'react';
import axios from 'axios';
import Questionnaire from './Questionnaire';
import "../styles/App.css";  // Import the stylesheet

const ReviewGenerator = () => {
  const [questionnaire, setQuestionnaire] = useState({
    question1: '',
    question2: '',
    orderedItems: '',
    rating: ''
  });
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionnaire((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setReview(null);

    const keywords = [
      questionnaire.question1,
      questionnaire.question2,
      `Ordered: ${questionnaire.orderedItems}`,
    ];

    try {
      const response = await axios.post('http://localhost:5000/api/generate-review', { keywords,
      stars: parseInt(questionnaire.rating, 5)
      });
      setReview(response.data.review);
    } catch (error) {
      console.error('Error generating review:', error);
      setError('Failed to generate review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Review Generator</h1>
      
      <form onSubmit={handleFormSubmit} className="space-y-4 mb-6">
        <Questionnaire 
          questionnaire={questionnaire}
          handleInputChange={handleInputChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Generating...' : 'Generate Review'}
        </button>
      </form>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {review && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Generated Review:</h2>
          <div className="review-box mt-6 p-4 border rounded-lg shadow-sm">
            <p className="text-gray-800">{review.text}</p>  {/* Changed the text color to dark gray */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewGenerator;
