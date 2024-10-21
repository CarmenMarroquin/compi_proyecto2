import React from 'react';


type Props = {
    symTable: Array<any>;
}

export default function OutputSymbols({ symTable}: Props){

    let newSymTable: Array<any> = symTable.slice(26, -1);

    return(
        <div className="terminal">
            <h1 style={{"margin": "10px", "color": "#b4befe"}}>Symbols Table</h1>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Var Type</th>
          <th>Type</th>
          <th>Line</th>
          <th>Column</th>
          <th>Environment</th>
        </tr>
      </thead>
      <tbody>
        {newSymTable.map((item, index) => (
          <tr key={index}>
            <td>{item[0]}</td>
            <td>{item[1].symType === "let" ? "variable" : item[1].symType === "const" ? "constant" : item[1].symType}</td>
            <td>{item[1].type}</td>
            <td>{item[1].row}</td>
            <td>{item[1].column}</td>
            <td>{item[1].environment.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
        </div>
    );
}
