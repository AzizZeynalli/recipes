import Image from 'next/image';
import Link from 'next/link';

async function getRecipeDetails(id) {
  const API_KEY = process.env.SPOONACULAR_API_KEY;
  const res = await fetch(
    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`,
    {
      next: { revalidate: 60 }
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch recipe details');
  }

  return res.json();
}

export default async function RecipeDetails({ params }) {
  const recipe = await getRecipeDetails(params.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-96">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h1 className="absolute bottom-6 left-6 right-6 text-4xl font-bold text-white">
              {recipe.title}
            </h1>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-4 p-6 bg-blue-50 rounded-xl">
              <div className="text-center">
                <p className="text-sm text-blue-600">Preparation Time</p>
                <p className="text-2xl font-semibold text-blue-900">
                  {recipe.readyInMinutes} mins
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-blue-600">Servings</p>
                <p className="text-2xl font-semibold text-blue-900">
                  {recipe.servings}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                Ingredients
              </h2>
              <ul className="grid gap-3">
                {recipe.extendedIngredients.map((ingredient, index) => (
                  <li 
                    key={`${ingredient.id}-${index}`}
                    className="text-black flex items-center bg-blue-50 p-3 rounded-lg"
                  >
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                    {ingredient.original}
                  </li>
                ))}
              </ul>
            </div>

            <Link 
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-200"
            >
              Back to search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 