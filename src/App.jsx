import { useState } from 'react'
import Test from './Test'
import Exp from './Exp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      Jai Shree ganesh
      {/* <Test/> */}
      <Exp/>
    </>
  )
}

export default App