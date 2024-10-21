import { useEffect, useRef } from "react";

import React from 'react';

type Errors = {
    lex: Array<any>,
    sem: Array<any>,
    syn: Array<any>
}

type Props = {
    errors: Errors;
    stdOut: string;
}

export default function OutputText({ errors, stdOut }: Props){
    const terminalRef = useRef(null);
    console.log(errors)

    useEffect(() => {
        if (terminalRef.current) {
            // @ts-ignore
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    })

    let errContent;
  if (errors.lex.length > 0 || errors.sem.length > 0 || errors.syn.length > 0){
    errContent = "ERROR";
  }

  /*
    if (errors.lex.length > 0){
        errContent = errors.lex.map((item:any, index:any) => {
            return <div id={index}><pre style={{"color": "#f38ba8"}} key={index}>{`Lexical Error: Character '${item.character}' at line: ${item.line} column: ${item.column} not recognized in the language`}</pre></div>
        })
    } else if (errors.syn.length > 0){
        errContent = errors.syn.map((item:any, index:any) => {
            if (index > 2){
                return
            }
            return <div id={index}><pre style={{"color": "#f38ba8"}} key={index}>{`Syntax Error: Unexpected Token '${item.token}' at line: ${item.line} column: ${item.column}. Tokens Expected: [${item.expected}]`}</pre></div>
        })
    } else if (errors.sem.length > 0){
        errContent = errors.sem.map((item:any, index:any) => {
            return <div id={index}><pre style={{"color": "#f38ba8"}} key={index}>{`type: ${item.type}\n"${item.description}"\nline: ${item.line} column: ${item.column}  Environment: ${item.environment}`}</pre></div>
        })
    }
    */

    //const lines: string[] = content.split('\n');
    //console.log(content === null);


    //<div dangerouslySetInnerHTML={{__html: content}}>{content ? content : "<div></div>"}</div>
    return(
        <div className="terminal-console" ref={terminalRef}>
            <div dangerouslySetInnerHTML={{__html: stdOut}}></div>
            {errContent}
        </div>
    );
}
