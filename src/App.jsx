import { useState } from 'react'
import Test from './Test'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      Jai Shree ganesh
      <Test/>
    </>
  )
}

export default App