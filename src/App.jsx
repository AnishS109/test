import { useState } from 'react'
import Test from './Test'
import Exp from './Exp'
import CountdownAnimation from './Ani'
import Resume from './Resume'
import Video from './Video'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* Jai Shree ganesh */}
      {/* <Test/> */}
      {/* <Exp/> */}
      {/* <CountdownAnimation/> */}
      {/* <Resume/> */}
      <Video/>
    </>
  )
}

export default App