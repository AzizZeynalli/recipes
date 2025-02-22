import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';

async function getRecipes(searchParams) {
  const API_KEY = process.env.SPOONACULAR_API_KEY;
  
  try {
    const params = new URLSearchParams();
    params.append('apiKey', API_KEY);
    
    if (searchParams.query) params.append('query', searchParams.query);
    if (searchParams.cuisine) params.append('cuisine', searchParams.cuisine);
    if (searchParams.maxReadyTime) params.append('maxReadyTime', searchParams.maxReadyTime);

    const res = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`,
      {
        next: { revalidate: 60 }
      }
    );

    if (!res.ok) {
      return { error: true, results: [] };
    }

    const data = await res.json();
    return { error: false, results: data.results };
  } catch (error) {
    console.error('API Error:', error);
    return { error: true, results: [] };
  }
}

function ErrorMessage() {
  return (
    <div className="text-center py-12">
      <div className="mb-6">
        <svg 
          className="mx-auto h-24 w-24 text-red-200" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-blue-900 mb-4">
        ERROR
      </h2>
      <p className="text-blue-600 mb-8">
        Unexpected error happened.
      </p>
      <Link 
        href="/"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-200"
      >
        Back to Search
      </Link>
    </div>
  );
}

function NoRecipesFound() {
  return (
    <div className="text-center py-12">
      <div className="mb-6">
        <svg 
          className="mx-auto h-24 w-24 text-blue-200" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-blue-900 mb-4">
        No recipes found
      </h2>
      <p className="text-blue-600 mb-8">
        Change your search criterias
      </p>
      <Link 
        href="/"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-200"
      >
        Back to Search
      </Link>
    </div>
  );
}

function RecipeList({ recipes, hasError }) {
  if (hasError) {
    return <ErrorMessage />;
  }

  if (!recipes || recipes.length === 0) {
    return <NoRecipesFound />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {recipes.map(recipe => (
        <Link
          key={recipe.id}
          href={`/recipes/${recipe.id}`}
          className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
        >
          <div className="relative h-56">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-blue-900 group-hover:text-blue-600 transition duration-300">
              {recipe.title}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default async function RecipesPage({ searchParams }) {
  const { error, results } = await getRecipes(searchParams);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">
          Found recipes
        </h1>
        <Suspense 
          fallback={
            <div className="text-center text-blue-600">
              Loading
            </div>
          }
        >
          <RecipeList recipes={results} hasError={error} />
        </Suspense>
      </div>
    </div>
  );
} 