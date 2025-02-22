"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    query: '',
    cuisine: '',
    maxReadyTime: ''
  });

  const cuisineOptions = [
    'American',
    'British',
    'Italian',
    'Mexican',
    'French',
    'Japanese'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = formData.query || formData.cuisine || formData.maxReadyTime;

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (formData.query) params.append('query', formData.query);
    if (formData.cuisine) params.append('cuisine', formData.cuisine);
    if (formData.maxReadyTime) params.append('maxReadyTime', formData.maxReadyTime);
    
    router.push(`/recipes?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <main className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <Image
                src="/cooking.png"
                alt="just icon"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
            Search recipes
          </h1>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 border border-blue-100"
        >
          <div>
            <label htmlFor="query" className="block text-blue-900 font-medium mb-2">
              Enter dish name
            </label>
            <input
              type="text"
              id="query"
              name="query"
              value={formData.query}
              onChange={handleInputChange}
              className="text-black w-full px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              placeholder="sushi"
            />
          </div>

          {/* Cuisine Select */}
          <div>
            <label htmlFor="cuisine" className="block text-blue-900 font-medium mb-2">
              Choose cuisine
            </label>
            <select
              id="cuisine"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleInputChange}
              className="text-black w-full px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 bg-white"
            >
              <option value="">All cuisines</option>
              {cuisineOptions.map(cuisine => (
                <option key={cuisine} value={cuisine.toLowerCase()} className="text-black">
                  {cuisine}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="maxReadyTime" className="block text-blue-900 font-medium mb-2">
              Maximum cooking time in minutes
            </label>
            <div className="relative">
              <input
                type="number"
                id="maxReadyTime"
                name="maxReadyTime"
                value={formData.maxReadyTime}
                onChange={handleInputChange}
                min="0"
                className="text-black w-full px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                placeholder="15"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3 px-6 rounded-xl font-medium text-lg transition duration-200 ${
              isFormValid 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                : 'bg-blue-200 cursor-not-allowed text-blue-400'
            }`}
          >
            Find recipes
          </button>
        </form>
      </main>
    </div>
  );
}
