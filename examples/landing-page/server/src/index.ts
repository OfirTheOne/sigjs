import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';

const app = express();
app.use(json());
app.use(cors());

/**
 * @type {Array<{title: string, content: string}>}
 */
let posts: { 
    title: string; 
    content: string; 
}[] = [
  {
    title: 'Post 1',
    content: 'This is the first post'
  }
];

app.get('/layout', async (_req, res) => {
  await delay(5000);
  res.send(`
  <div class=" flex flex-col min-h-screen bg-gray-100">
    <header class="bg-white shadow">
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


app.get('/posts', async (_req, res) => {
    await delay(5000);
    let postsHtml = posts.map(post => buildPost(post.title, post.content)).join('');
    res.send(postsHtml);
});

app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    posts.push({ title, content });
    res.send(`<h2>${title}</h2><p>${content}</p>`);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



/**
 * @param {string} title
 * @param {string} content
 * @returns {string}
 */
function buildPost(title: string, content: string): string {
    return `<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3">
    <div class="md:flex">
      <div class="p-8">
        <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">${title}</div>
        <p class="mt-2 text-gray-500">${content}</p>
        <sig-outlet/>
      </div>
    </div>
  </div>`;
}

export {}