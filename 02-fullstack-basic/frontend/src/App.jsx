import { useEffect, useState } from 'react'
import axios from 'axios';
import './App.css'

function App() {
  const [jokes,setJokes] = useState([])

  useEffect(()=>{
    axios.get('/api/jokes')
    .then(response=>setJokes(response.data))
    .catch((error)=>console.log(error))
  },[])

  return (
    <>
      <p>Jokes:{jokes.length}</p>
      {
        jokes.map(joke =>{
            const {title,content} = joke
            return (
              <div>
              <div>Title :{title}</div>
              <div>Joke : {content}</div>
              </div>
            )
        })
      }
    </>
  )
}

export default App
