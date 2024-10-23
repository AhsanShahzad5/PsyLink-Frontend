import './App.css'
import {useNavigate} from 'react-router-dom'

function App() {
  const navigate = useNavigate()
  return (
    <>
      <p className='text-primary'>this is primary color</p>
      <p className='text-secondary bg-primary'>this is secondary color</p>
      <p className='text-base bg-black'>this is base color</p>
      <button className='bg-secondary text-primary border-r-4 ' onClick={()=>{
        navigate('/login')
      }}>Login</button>
    </>
  )
}

export default App
