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

app.get('/posts', (req, res) => {
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
        <outlet/>
      </div>
    </div>
  </div>`;
}