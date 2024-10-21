import React from 'react';
import "../scss/Errors.scss"

type Errors = {
    lex: Array<any>,
    sem: Array<any>,
    syn: Array<any>
}

type Props = {
    errors: Errors;
}

export default function OutputErrors({ errors }: Props){
  console.log(errors)

    return(
        <div className="terminal">

            <h2 className="table-title" style={{"margin": "15px"}}>Lexical Errors</h2>
    <table>
      <thead>
        <tr>
          <th>Character</th>
          <th>Line</th>
          <th>Column</th>
        </tr>
      </thead>
      <tbody>
        {errors.lex.map((item, index) => (
          <tr key={index}>
            <td>{item.character}</td>
            <td>{item.line}</td>
            <td>{item.column}</td>
          </tr>
        ))}
      </tbody>
    </table>
            <h2 className="table-title" style={{"margin": "15px"}}>Syntax Errors</h2>
    <table>
      <thead>
        <tr>
          <th>Unexpected</th>
          <th>Line</th>
          <th>Column</th>
          <th>Expected</th>
        </tr>
      </thead>
      <tbody>
        {errors.syn.map((item, index) => (
          <tr key={index}>
            <td>{`Unexpected Token '${item.token}'`}</td>
            <td>{item.line}</td>
            <td>{item.column}</td>
            <td>{`Tokens Expected: " ${item.expected} "`}</td>
          </tr>
        ))}
      </tbody>
    </table>

            <h2 className="table-title" style={{"margin": "15px"}}>Semantic Errors</h2>
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Description</th>
          <th>Line</th>
          <th>Column</th>
          <th>Environment</th>
        </tr>
      </thead>
      <tbody>
        {errors.sem.map((item, index) => (
          <tr key={index}>
            <td>{item.type}</td>
            <td>{item.description}</td>
            <td>{item.line}</td>
            <td>{item.column}</td>
            <td>{item.environment}</td>
          </tr>
        ))}
      </tbody>
    </table>


        </div>
    );
}
