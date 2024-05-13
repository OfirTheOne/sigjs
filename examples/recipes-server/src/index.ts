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
  /*
  {
      title: 'Recipe 3',
      id: '3',
      image: 'https://via.placeholder.com/180x220',
      description: 'Description 3'
  },
  {
      title: 'Recipe 4',
      id: '4',
      image: 'https://via.placeholder.com/180x220',
      description: 'Description 4'
  },
  {
      title: 'Recipe 5',
      id: '5',
      image: 'https://via.placeholder.com/180x220',
      description: 'Description 5'
  },
  {
      title: 'Recipe 6',
      id: '6',
      image: 'https://via.placeholder.com/180x220',
      description: 'Description 6'
  },
  */
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

  if(!recipe) return res.status(404).send('Recipe not found');

  return res.send(`
  <div class="w-4/5 mx-auto bg-white rounded-xl shadow-md overflow-hidden m-3">

    <div class="flex flex-row gap-4">
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
      <sig-outlet></sig-outlet>
    </div>

  </div>`);
});

app.post('/recipes/:id/comments', (req, res) => {
    const { author, comment } = req.body;
    const id = req.params.id;
    const recipe = recipes.find(r => r.id === id);
    if(!recipe) return res.status(404).send('Recipe not found');
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

export {}