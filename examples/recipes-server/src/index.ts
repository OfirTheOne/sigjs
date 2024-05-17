import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';

const app = express();
app.use(json());
app.use(cors());

const recipes = [
  {
    id: '1',
    title: 'Maca Chocolate Smoothie',
    image: 'https://static.wixstatic.com/media/827c6d_ed58ad4a55174a35b6f0d34465e02289~mv2.jpg/v1/fill/w_520,h_650,al_c,lg_1,q_80,enc_auto/827c6d_ed58ad4a55174a35b6f0d34465e02289~mv2.jpg',
    category: 'beverages',
    directions: [
      'Add all ingredients to blender and enjoy!'
    ],
    ingredients: [
      '2 frozen bananas (peel before freezing)',
      '2 tablespoons organic cacao powder',
      '1 ½ cups unsweetened almond milk',
      '1 tablespoon maca powder',
      '1-2 tablespoons Cacao nibs',
    ],
    comments: [
      {
        author: 'John Doe',
        comment: 'This is a great recipe!'
      },
      {
        author: 'Bob Smith',
        comment: 'I love this recipe!'
      }
    ]
  },
  {
    title: 'Coconut Almond Milk',
    id: '2',
    image: 'https://static.wixstatic.com/media/827c6d_7cb8d36c0d284e34a726d84fc70e4a16~mv2.jpg/v1/fill/w_650,h_720,al_c,lg_1,q_85,enc_auto/827c6d_7cb8d36c0d284e34a726d84fc70e4a16~mv2.jpg',
    directions: [
      'Rinse almonds and add to blender.',
      'Open the coconut and add its water to the blender.',
      'Use a spoon to peel out the rest of the meat on the inside of the coconut, rinse well, getting all of the tough part off and add to blender.',
      'Add vanilla powder and water. Blend well.',
      'Pour mixture from blender through a fine meshed strainer bag and into a bowl.',
      'Store the contents in glass bottles for 3-4 days in the fridge.',
      'Shake before use as the contents separate when they sit. Enjoy.',
    ],
    ingredients: [
      '1 cup almonds (soak almonds immersed in water overnight)',
      '1 young coconut',
      'Teaspoon vanilla powder',
      '3 cups filtered water',
    ],
    comments: [
      {
        author: 'John Doe',
        comment: 'This is a great recipe!'
      },
      {
        author: 'Katie Smith',
        comment: 'I tried this recipe and it was delicious!'
      }
    ]
  },
  {
    title: 'Cucumber Spinach Smoothie',
    id: '3',
    image: 'https://static.wixstatic.com/media/827c6d_89ad7bd2eb364e41a1c5cf96a6df2f1f~mv2.jpg/v1/fill/w_720,h_396,al_c,lg_1,q_80,enc_auto/827c6d_89ad7bd2eb364e41a1c5cf96a6df2f1f~mv2.jpg',
    directions: [
      'Peel all the skin off the cucumber.',
      'Core the pear.',
      'Add all liquids to blender.',
      'Add all remaining ingredients to blender and blend.',
      'Taste.',
      'Add more lemon or sweetness if desired.',
    ],
    ingredients: [
      '2 cups (approx. 1 large english cucumber)',
      '1 ripe green pear',
      '2 ripe bananas',
      '3 cups packed organic spinach',
      '2 tablespoons lemon juice (approx. 1-2 lemons)',
      '1 teaspoon spirulina',
      'Juice of one young coconut (or ¾ cup cold water or ½ cup water and ½ cup ice)',
      '8-10 big mint leaves (optional)',
    ],
    comments: [
      {
        author: 'John Doe',
        comment: 'This is a great recipe!'
      }
    ]
  },
  {
    "id": '4',
    "title": "Sopa Paraguaya",
    "image": "https://www.kingarthurbaking.com/sites/default/files/styles/featured_image_2x/public/recipe_legacy/1084-3-large.jpg?itok=d-lPpFdW",
    "description": "A traditional Paraguayan dish, Sopa Paraguaya is a cornbread made with cornmeal, cheese, and onions.",
    "category": "Bread",
    "directions": [
      "Preheat oven to 350°F (175°C).",
      "In a large bowl, mix cornmeal, cheese, and onions.",
      "Add eggs and milk, and stir until well combined.",
      "Pour the batter into a greased baking dish.",
      "Bake for 45-50 minutes, or until golden brown."
    ],
    "ingredients": [
      "2 cups cornmeal",
      "1 cup grated cheese",
      "1 cup chopped onions",
      "4 eggs",
      "2 cups milk"
    ],
    "comments": [
      {
        "author": "John Doe",
        "comment": "Delicious! Reminds me of my grandmother's cooking."
      },
      {
        "author": "Jane Smith",
        "comment": "A bit too dry for my taste, but still good."
      }
    ]
  },
  {
    "id": '5',
    "title": "Pancake",
    "image": "https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/fluffyamericanpancak_74828_16x9.jpg",
    "description": "Classic American pancakes are fluffy, soft, and easy to make. Perfect for a hearty breakfast.",
    "category": "Breakfast",
    "directions": [
      "In a large bowl, mix flour, sugar, baking powder, and salt.",
      "In another bowl, whisk together milk, eggs, and melted butter.",
      "Pour the wet ingredients into the dry ingredients and stir until just combined.",
      "Heat a non-stick skillet over medium heat and pour 1/4 cup of batter for each pancake.",
      "Cook until bubbles form on the surface, then flip and cook until golden brown."
    ],
    "ingredients": [
      "1 1/2 cups flour",
      "3 1/2 tsp baking powder",
      "1 tsp salt",
      "1 tbsp sugar",
      "1 1/4 cups milk",
      "1 egg",
      "3 tbsp butter, melted"
    ],
    "comments": [
      {
        "author": "Emily Clark",
        "comment": "Perfect for Sunday brunch!"
      },
      {
        "author": "Michael Brown",
        "comment": "Kids loved it! Will make again."
      }
    ]
  },
  {
    "id": '6',
    "title": "Mbejú",
    "image": "https://cdn0.recetasgratis.net/es/posts/0/1/4/mbeju_o_mbeyu_9410_orig.jpg",
    "description": "Mbejú is a traditional Paraguayan starch cake made with cassava flour, cheese, and milk.",
    "category": "Snack",
    "directions": [
      "In a bowl, mix cassava flour, cheese, and salt.",
      "Add milk gradually, mixing until the dough is crumbly.",
      "Heat a non-stick skillet over medium heat.",
      "Press a portion of the dough into a flat disc and cook on the skillet until golden brown on both sides."
    ],
    "ingredients": [
      "2 cups cassava flour",
      "1 cup grated cheese",
      "1/2 tsp salt",
      "1 cup milk"
    ],
    "comments": []
  },
  {
    "id": "7",
    "title": "Chicken Parmesan",
    image: 'https://assets.bonappetit.com/photos/5ea8f0df16738800085ad5d2/1:1/w_2240,c_limit/Chicken-Parmesean-Recipe-Lede.jpg',
    "category": "Italian",
    "directions": [
        "Preheat oven to 400°F (200°C).",
        "Season chicken with salt and pepper.",
        "Dip chicken in beaten eggs, then coat with bread crumbs.",
        "Fry chicken in oil until golden brown.",
        "Place fried chicken in a baking dish, top with marinara sauce and mozzarella cheese.",
        "Bake in the preheated oven until cheese is melted and bubbly."
    ],
    "ingredients": [
        "2 chicken breasts",
        "1 cup bread crumbs",
        "2 cups marinara sauce",
        "1 cup mozzarella cheese",
        "2 eggs",
        "Salt and pepper to taste",
        "Olive oil for frying"
    ],
    "comments": [
        {
            "author": "JohnD",
            "comment": "Loved this recipe! Easy to follow and delicious."
        },
        {
            "author": "Foodie123",
            "comment": "I added some Parmesan cheese to the bread crumbs for extra flavor."
        }
    ]
},
{
  id: '8',
  title: 'Chocolate Chip Cookies',
  image: 'https://sallysbakingaddiction.com/wp-content/uploads/2013/05/classic-chocolate-chip-cookies.jpg',
  "category": "Dessert",
  "directions": [
      "Preheat oven to 350°F (175°C).",
      "Cream together the butter, white sugar, and brown sugar.",
      "Beat in the eggs one at a time, then stir in the vanilla.",
      "Dissolve baking soda in hot water, add to batter along with salt.",
      "Stir in flour and chocolate chips.",
      "Drop by large spoonfuls onto ungreased pans.",
      "Bake for about 10 minutes or until edges are nicely browned."
  ],
  "ingredients": [
      "1 cup butter, softened",
      "1 cup white sugar",
      "1 cup packed brown sugar",
      "2 eggs",
      "2 teaspoons vanilla extract",
      "3 cups all-purpose flour",
      "1 teaspoon baking soda",
      "2 teaspoons hot water",
      "1/2 teaspoon salt",
      "2 cups semisweet chocolate chips"
  ],
  "comments": [
      {
          "author": "BakerMom",
          "comment": "Perfect texture! Crispy edges and chewy center."
      },
      {
          "author": "SweetTooth",
          "comment": "I used dark chocolate chips and they were amazing."
      }
  ]
},
{
  id: '8',
  title: 'Caesar Salad',
  image: 'https://natashaskitchen.com/wp-content/uploads/2019/01/Caesar-Salad-Recipe-3.jpg', 
  "category": "Salad",
  "directions": [
      "In a large bowl, whisk together garlic, anchovy paste, lemon juice, Dijon mustard, and Worcestershire sauce.",
      "Add the mayonnaise, Parmigiano-Reggiano, salt, and pepper and whisk until well combined.",
      "Toss the romaine lettuce with the dressing, then sprinkle with croutons and additional Parmigiano-Reggiano."
  ],
  "ingredients": [
      "1 clove garlic, minced",
      "1 teaspoon anchovy paste",
      "2 tablespoons lemon juice",
      "1 teaspoon Dijon mustard",
      "1 teaspoon Worcestershire sauce",
      "1 cup mayonnaise",
      "1/2 cup grated Parmigiano-Reggiano",
      "Salt and pepper to taste",
      "4 cups romaine lettuce, torn into bite-size pieces",
      "1 cup croutons"
  ],
  "comments": [
      {
          "author": "HealthyEater",
          "comment": "Great recipe! I added grilled chicken for a complete meal."
      },
      {
          "author": "SaladLover",
          "comment": "Easy to make and very tasty. The dressing is spot on."
      }
  ]
},
{
  id: '9',
  title: 'Beef Stroganoff',
  image: 'https://saltedmint.com/wp-content/uploads/2024/01/Beef-stroganoff-with-rice-1.jpg',
  "category": "Russian",
  "directions": [
      "In a large skillet, cook the onions and mushrooms in butter until tender.",
      "Add the beef and cook until browned.",
      "Stir in the flour until well blended.",
      "Add the broth, Worcestershire sauce, and bring to a boil.",
      "Reduce heat and simmer for about 10 minutes.",
      "Stir in the sour cream and heat through, but do not boil.",
      "Serve over egg noodles or rice."
  ],
  "ingredients": [
      "1 pound beef sirloin, cut into strips",
      "1 cup sliced mushrooms",
      "1 onion, chopped",
      "1/4 cup butter",
      "2 tablespoons all-purpose flour",
      "2 cups beef broth",
      "1 tablespoon Worcestershire sauce",
      "1 cup sour cream",
      "Salt and pepper to taste",
      "Egg noodles or rice for serving"
  ],
  "comments": [
      {
          "author": "HomeCook",
          "comment": "Comfort food at its best. I used Greek yogurt instead of sour cream."
      },
      {
          "author": "MeatLover",
          "comment": "Delicious and easy to prepare. My family loved it!"
      }
  ]
}


];


app.get('/layout', async (req, res) => {
  const query = req.query;
  const color = query.color || 'blue';
  // await delay(5000);
  res.send(`
  <div class=" flex flex-col min-h-screen bg-gray-100">
    <header class="shadow" style="background-color: ${color}">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between">
                <div class="flex-shrink-0">
                    <img class="h-8 w-8" src="logo.svg" alt="Logo" />
                </div>
                <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    <a href="#feature" class="mr-5 hover:text-gray-900">Feature</a>
                    <a href="#pricing" class="mr-5 hover:text-gray-900">Pricing</a>
                    <a href="#contact" class="mr-5 hover:text-gray-900">Contact</a>
                </nav>
            </div>
        </div>
    </header>
    <main class="flex flex-1 flex-row">
    
      <sig-outlet></sig-outlet>

      <div class="w-2/5 flex flex-col flex-1">
        <div class="flex flex-col items-center justify-center flex-1">
          <div class="flex flex-row h-1/2 gap-4 py-6">
              <div class="flex justify-start items-end flex-col gap-4">
                  <div class="flex flex-row gap-2">
                      <div class="h-2 w-2 bg-slate-400/20 -mt-16"></div>
                      <div class="h-6 w-6 bg-blue-400/20 -mt-14"></div>
                      <div class="h-12 w-12 bg-blue-600/20 -mt-8"></div>
                      <div class="h-24 w-24 items-end bg-indigo-400/20"></div>
                  </div>
                  <div class="h-32 w-32 bg-purple-400/20"></div>
              </div>
              <div class="flex justify-end flex-end flex-col gap-4">
                  <div class="h-24 w-24 bg-teal-400/20"></div>
                  <div class="h-36 w-36 bg-orange-400/20"></div>
              </div>
          </div>
        </div>
      </div>
    </main>
  </div>  
  `);
});


app.get('/recipes', async (_req, res) => {
  await delay(5000);
  return res.json(recipes);
});

app.get('/recipes/:id', async (req, res) => {
  // await delay(5000);
  const id = req.params.id;
  console.log(id);
  const recipe = recipes.find(r => r.id === id);

  if (!recipe) return res.status(404).send('Recipe not found');

  return res.send(`
  <div class="w-4/5 mx-auto bg-white rounded-xl shadow-md overflow-hidden m-3">

    <div class="flex flex-row gap-4 recipe-body">
      <div class="flex w-1/3 p-8">
        <img 
          class="h-80 w-60 object-cover object-center rounded-lg"
          src=${recipe.image}
          alt=${recipe.title} 
        />
      </div>
      <div class="flex w-2/3 flex-col gap-2 p-8">
        <div class="uppercase tracking-wide text-indigo-500 font-semibold text-2xl">${recipe.title}</div>
        <h3 class="text-xl font-semibold">Ingredients</h3>
        <ul class="list-disc list-inside">
          ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
        <h3 class="text-xl font-semibold">Directions</h3>
        <ul class="list-decimal list-inside">
          ${recipe.directions.map(direction => `<li>${direction}</li>`).join('')}
        </ul>
      </div>
    </div>

    <hr class="border-t-2 border-gray-200">

    <div class="flex flex-col gap-4 p-8">
      <h3 class="text-xl font-semibold">Comments</h3>
      <ul class="list-disc list-inside flex flex-col gap-2">
        ${recipe.comments.map(comment => `<li class="flex flex-col">
          <div class="flex"><strong>${comment.author}</strong>:</div>
          <div class="flex ml-8"> ${comment.comment} </div>
        </li>`).join('')}
      </ul>
    </div>

    <div class="flex flex-col gap-4 p-8">
      <sig-outlet name="submit-comment"></sig-outlet>
    </div>

  </div>`);
});

app.post('/recipes/:id/comments', (req, res) => {
  const { author, comment } = req.body;
  const id = req.params.id;
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return res.status(404).send('Recipe not found');
  recipe.comments.push({ author, comment });
  res.json(recipe);
});

app.post('/recipes', (req, res) => {
  const { title, category, directions, ingredients, id, image } = req.body;
  const recipe = { title, category, directions, ingredients, id, image, comments: [] }
  recipes.push(recipe);
  res.json(recipe);
});

app.listen(3030, () => {
  console.log('Server is running on port 3030');
});


function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



// /**
//  * @param {string} title
//  * @param {string} content
//  * @returns {string}
//  */
// function buildPost(title: string, content: string): string {
//     return `<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3">
//     <div class="md:flex">
//       <div class="p-8">
//         <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">${title}</div>
//         <p class="mt-2 text-gray-500">${content}</p>
//         <sig-outlet/>
//       </div>
//     </div>
//   </div>`;
// }

export { }