import React from 'react';

const Questionnaire = ({ questionnaire, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          What is the name of the restaurant?
        </label>
        <input
          type="text"
          name="restaurantName"
          value={questionnaire.restaurantName}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded-md"
          placeholder="Enter restaurant name"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Where is it located?
        </label>
        <input
          type="text"
          name="location"
          value={questionnaire.location}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded-md"
          placeholder="Enter restaurant location"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Was the food good?
        </label>
        <select
          name="question1"
          value={questionnaire.question1}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select an option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="Best food ever!">Best food ever!</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          How was the service?
        </label>
        <select
          name="question2"
          value={questionnaire.question2}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select an option</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Poor">Poor</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          How many stars would you rate it? (out of 5)
        </label>
        <select
          name="rating"
          value={questionnaire.rating}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select rating</option>
          <option value="1">1 Star ★</option>
          <option value="2">2 Stars ★★</option>
          <option value="3">3 Stars ★★★</option>
          <option value="4">4 Stars ★★★★</option>
          <option value="5">5 Stars ★★★★★</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          What did you order?
        </label>
        <textarea
          name="orderedItems"
          value={questionnaire.orderedItems}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded-md min-h-[100px]"
          placeholder="Please list the items you ordered..."
        />
      </div>
    </div>
  );
};

export default Questionnaire;