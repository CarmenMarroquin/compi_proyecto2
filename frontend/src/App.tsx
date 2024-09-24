import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'


import Entrada from './assets/componentes/Entrada'
import Consola from './assets/componentes/Consol'
import Navb from './assets/componentes/navbar'
import { Stack } from 'react-bootstrap'

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from '@codemirror/lang-javascript';
import {dracula} from '@uiw/codemirror-theme-dracula';


function App() {
  const [count, setCount] = useState(0);
  const [amor, setAmor] = useState(2);

  const [code, setCode] = useState("// Escribe tu codigo");

  function handleCodeChange(value: string) {
    setCode(value);
  }

  function handleArchivos(eventKey: string){
    // algo
  }

  function handleEjecutar(eventKey: string){
    // algo
  }

  function handleReportes(eventKey: string){
    //alog
  }

  return (
    <div className='page'>

      <div>
        <Navb 
        handleArchivos={handleArchivos}
        handleEjecutar={handleEjecutar}
        handleReportes={handleReportes}
        />
      </div>

      <Stack gap={3}>
      <div className="p-2">
        <CodeMirror
          value={code}
          height='400px'
          theme={dracula}
          extensions={[javascript()]}
          onChange={(value) => handleCodeChange(value)}
        />
      </div>
      <div className="p-2">
        <Consola/>
      </div>

    </Stack>
  
      
    </div>

  )
}

export default App
