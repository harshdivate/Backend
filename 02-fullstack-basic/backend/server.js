import express from 'express';
const app = express();

const PORT = 5000;

// app.get('/',(req,res)=>{
//     res.send('Server is ready')
// })

app.get('/api/jokes',(req,res)=>{
    const jokes = [
        {
          "id": 1,
          "title": "The Coffee Joke",
          "content": "Why did the coffee file a police report? It got mugged!"
        },
        {
          "id": 2,
          "title": "The Book Joke",
          "content": "I told my wife she should embrace her mistakes. She gave me a hug."
        },
        {
          "id": 3,
          "title": "The Vegetarian Joke",
          "content": "Why did the tomato turn red? Because it saw the salad dressing!"
        },
        {
          "id": 4,
          "title": "The Light Bulb Joke",
          "content": "How many software engineers does it take to change a light bulb? None, that's a hardware issue!"
        },
        {
          "id": 5,
          "title": "The Music Joke",
          "content": "Why did the musician break up with metronome? It couldn't keep up with the beat of their hearts."
        }]
    res.send(jokes)
      
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

