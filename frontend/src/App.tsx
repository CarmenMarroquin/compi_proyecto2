import { useState } from 'react'



import Consola, { Estado } from './componentes/Consol'

import Navb from './componentes/navbar'
import { Stack } from 'react-bootstrap'

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from '@codemirror/lang-javascript';
import {dracula} from '@uiw/codemirror-theme-dracula';


function App() {
  const [code, setCode] = useState("// Escribe tu codigo");

  const [fileContent, setFileContent] = useState<string | null>(null);

  const [estado, setEstado] = useState<Estado>(Estado.Consola);
  const [consola, setConsola] = useState<string>("SALIDA DE CODIGO");
  const [simbolos, setSimbolos] = useState<string>("tabla de simbolos");
  const [errores, setErrores] = useState<string>("tabla de errores");
  const [ast, setAst] = useState<string>("Arbol de sintaxis abstracta");

  function handleFileUpload (event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; // Obtener el primer archivo

    if (file) {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        setCode("");
        const text = e.target?.result as string;
        setCode(text);
      };
      reader.readAsText(file); // Leer el archivo como texto
    }
  };


  function handleCodeChange(value: string) {
    setCode(value);
  }

  function nuevoArchivo(){
    setCode("");
  }

    // Función para guardar el contenido del archivo en uno nuevo
  function saveFileContent () {
      if (code !== "") {
        const blob = new Blob([code], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'archivo_guardado.ci'; // Nombre del archivo nuevo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

  function handleEjecutar(eventKey: string){
    // TODO
    console.log("EJECUTANDO")
  }

  function handleReportes(eventKey: string){
    switch(eventKey){
      case "1":
        setEstado(Estado.Errores);
        break;
      case "2":
        setEstado(Estado.Ast);
        break;
      case "3":
        setEstado(Estado.Simbolos); 
        break;
      case "4":
        setEstado(Estado.Consola);
    }
  }

  return (
    <div className='page'>

      <div>
        <Navb 
        handleFileUpload={handleFileUpload}
        nuevoArchivo={nuevoArchivo}
        saveFileContent={saveFileContent}
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
        <Consola
        estado={estado}
        ast={ast}
        simbolos={simbolos}
        errores={errores}
        consola={consola}
        />
      </div>

    </Stack>
  
      
    </div>

  )
}

export default App
