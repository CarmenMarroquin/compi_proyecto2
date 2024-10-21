import Form from 'react-bootstrap/Form';
import React from 'react';
import OutputText from './OutputText';
import OutputErrors from './OutputErrors';
import OutputSymbols from './OutputSymTable';
import OutputImage from './OutputImage';

import '../scss/Terminal.scss';

export enum Estado{
  Consola,
  Ast,
  Errores,
  Simbolos
}

type Errors = {
  lex: Array<any>,
  sem: Array<any>,
  syn: Array<any>
}

type Props = {
  estado: Estado,
  consola: string,
  ast: string,
  errores: Errors,
  simbolos: Array<any>
}


function Consola({estado, consola, ast, errores, simbolos}: Props) {

  const titulo = {
    [Estado.Consola]: "Consola",
    [Estado.Simbolos]: "Tabla de Simbolos",
    [Estado.Ast]: "Arbol de Sintaxis Abstracta",
    [Estado.Errores]: "Tabla de Errores"
  }[estado];

  const contenido = {
    [Estado.Consola]: <OutputText errors={errores} stdOut={consola}/>,
    [Estado.Simbolos]: <OutputSymbols  symTable={simbolos}/>,
    [Estado.Ast]: <OutputImage dotCode={ast} />,
    [Estado.Errores]: <OutputErrors errors={errores} />,
  }[estado];


    return (
      <div>
      <h2>{titulo}</h2>
      <div className="terminal">
        {contenido}
      </div>
        </div>
    );
  }


  export default Consola;

