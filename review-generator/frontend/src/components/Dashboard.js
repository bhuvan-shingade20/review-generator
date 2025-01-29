import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starStats, setStarStats] = useState({});
  const [selectedReviewId, setSelectedReviewId] = useState(''); // For selected review ID
  const [selectedReview, setSelectedReview] = useState(null); // For selected review details

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/get-reviews')
      .then((response) => {
        setReviews(response.data);
        setLoading(false);
        calculateStarStats(response.data);
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
      });
  }, []);

  const calculateStarStats = (reviews) => {
    let stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      stats[review.stars] = (stats[review.stars] || 0) + 1;
    });
    setStarStats(stats);
  };

  const chartData = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        data: [
          starStats[1] || 0,
          starStats[2] || 0,
          starStats[3] || 0,
          starStats[4] || 0,
          starStats[5] || 0,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF5722'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const handleReviewSelection = (e) => {
    const selectedId = e.target.value;
    setSelectedReviewId(selectedId);

    // Find and display the review with the selected ID
    const review = reviews.find((review) => review.id === selectedId);
    setSelectedReview(review);
  };

  return (
    <div>
      <h2 className="fade-in">Review Dashboard</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="dashboard">
          <div className="card fade-in">
            <h3>Select a Review</h3>
            {/* Dropdown to select a review */}
            <select
              value={selectedReviewId}
              onChange={handleReviewSelection}
              className="p-2 border rounded-md"
            >
              <option value="">Select a Review</option>
              {reviews.map((review) => (
                <option key={review.id} value={review.id}>
                  {review.id}
                </option>
              ))}
            </select>
          </div>

          {/* Show selected review below the dropdown */}
          {selectedReview && (
            <div className="card fade-in mt-6">
              <h3>Review Details</h3>
              <p>
                <strong>Review:</strong> {selectedReview.text}
              </p>
              <p>
                <strong>Rating:</strong> {selectedReview.stars} Stars
              </p>
              <p>
                <strong>Keywords:</strong> {selectedReview.keywords.join(', ')}
              </p>
            </div>
          )}

          {/* Centered title and chart */}
          <div className="card fade-in chart-container mt-6">
            <h3 className="chart-title">Star Rating Distribution</h3>
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
