
import Dropdown from 'react-bootstrap/Dropdown';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';

export enum Estado{
  Consola,
  Ast,
  Errores,
  Simbolos
}

type Props = {
  estado: Estado,
  consola: string,
  ast: string,
  errores: string,
  simbolos: string
}


function Consola({estado, consola, ast, errores, simbolos}: Props) {

  const titulo = {
    [Estado.Consola]: "Consola",
    [Estado.Simbolos]: "Tabla de Simbolos",
    [Estado.Ast]: "Arbol de Sintaxis Abstracta",
    [Estado.Errores]: "Tabla de Errores"
  }[estado];

  const contenido = {
    [Estado.Consola]: consola,
    [Estado.Simbolos]: simbolos,
    [Estado.Ast]: ast,
    [Estado.Errores]: errores
  }[estado];

    return (
    <Form.Group controlId="exampleForm.ControlTextarea">
      <Form.Label>{titulo}</Form.Label>
      <div style={{ border: '1px solid #ced4da', padding: '10px', borderRadius: '5px', minHeight: '100px', backgroundColor: '#f8f9fa' }}>
        {contenido}
      </div>
    </Form.Group>
    );
  }
  
  export default Consola;

