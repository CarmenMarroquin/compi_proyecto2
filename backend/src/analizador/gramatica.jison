%{
    // files to import should be the js files
    /*
    import { LexError, SynError } from "./errors.js" 
    */
    // use this import while testing
    //const { LexError, SynError } = require("./errors");
    import {LexError, SynError } from "./errors";
%}

%{
    export const ast = [];
    export let errors = [];
    export let lexErrors: Array<LexError> = [];
    export let synErrors: Array<SynError> = [];
    export const clean_errors = () => {
        lexErrors = [];
        synErrors = [];
        errors = [];
    }
    let controlString = "";
%}

/*---------------------------lexical definitions---------------------------*/

%lex 
%options case-insensitive
%x string

%%

\s+                                         // spaces ignored
"--".*                                      // comment inline
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]         // MultiLineComment
[ \r\t]+
\n

/*---------------------------Reserved Words---------------------------*/

""                                     return;
"CREATE"                               return "RW_CREATE";
"int"                                  return "RW_INT";
"string"                               return "RW_STRING";
"double"                               return "RW_DOUBLE";
"bool"                                 return "RW_BOOL";
"char"                                 return "RW_CHAR";
"null"                                 return "RW_NULL";
"void"                                 return "RW_VOID";

"switch"                               return "RW_SWITCH";
"case"                                 return "RW_CASE";
"default"                              return "RW_DEFAULT";            
"if"                                   return "RW_IF";
"else"                                 return "RW_ELSE";
"let"                                  return "RW_LET";
"while"                                return "RW_WHILE";
"for"                                  return "RW_FOR";
"do"                                   return "RW_DO";
"until"                                return "RW_UNTIL";
"loop"                                 return "RW_LOOP";
"break"                                return "RW_BREAK";
"continue"                             return "RW_CONTINUE";
"return"                               return "RW_RETURN";
"fuction"                              return "RW_FUNTION";
"echo"                                 return "RW_ECHO";
"ejecutar"                             return "RW_EJECUTAR";
"false"                                return "RW_FALSE";
"true"                                 return "RW_TRUE";
"cast"                                 return "RW_CAST";
"as"                                   return "RW_AS";
"const"                                return "RW_CONST";
"new"                                  return "RW_NEW";
"vector"                               return "RW_VECTOR";


// good morning pineapple, looking very good and very nice AAAAAA :)


/*---------------------------Tokens---------------------------*/
[0-9]+("."[0-9]+)\b                         return "TK_DOUBLE";
[0-9]+\b                                    return "TK_INT";
(\_)*[a-zA-ZñÑ][a-zA-Z0-9ñÑ\_]*             return "TK_ID";

//                              if this doesnt work use this.begin() instead
["]                             {controlString=""; this.pushState("string");}
<string>[^"\\]+                 {controlString+=yytext; }
<string>"\\\""                  {controlString+="\"";}
<string>"\\n"                   {controlString+="\n";}
<string>"\\t"                   {controlString+="\t";}
<string>"\\\\"                  {controlString+="\\";}
<string>"\\\'"                  {controlString+="\'";}
<string>["]                     {yytext=controlString; this.popState(); return "TK_STRING";}

['][!~\_][']                    return "TK_CHAR";

"("                             return "TK_IPAR";
")"                             return "TK_DPAR";
";"                             return "TK_PUNTO_COMA";
","                             return "TK_COMA";
":"                             return "TK_DOS_PUNTOS";

"++"                            return "TK_INCREMETO";
"--"                            return "TK_DRECREMENTO";

"["                             return "TK_ICORCHETE";
"]"                             return "TK_DCORCHETE";

"{"                             return "TK_ILLAVE";
"}"                             return "TK_DLLAVE";


"$"                             return "TK_RAIZ";
"^"                             return "TK_POTENCIA";
"+"                             return "TK_SUMA";
"-"                             return "TK_RESTA";
"*"                             return "TK_MULTI";
"/"                             return "TK_DIV";
"%"                             return "TK_MODULO";

">="                            return "TK_MAYOR_IGUAL";
"<="                            return "TK_MENOR_IGUAL";
"=="                            return "TK_IGUALACION";
"!="                            return "TK_DIFERENCIACION";
">"                             return "TK_MAYOR";
"<"                             return "TK_MENOR";
"="                             return "TK_IGUAL";



"||"                            return "TK_OR";
"&&"                            return "TK_AND";
"!"                             return "TK_NOT";

<<EOF>>                         return 'EOF';
.                               
    { 
        const err = new LexError(yylloc.first_line, yylloc.first_column, yytext);
        lexErrors.push(err);
        err.print();
        return "INVALID";
    }

/lex

// IMPORTS FOR THE PARSER
%{

%}


/*---------------------------Operators Precedence---------------------------*/
//%nonassoc 
%left "TK_OR"
%left "TK_AND"
%right "TK_NOT"
%left "TK_IGUALACION" "TK_DIFERENCIACION"
%left "TK_MENOR" "TK_MENOR_IGUAL" "TK_MAYOR" "TK_MAYOR_IGUAL"
%left "TK_MAS" "TK_MENOS"
%left "TK_MULTI" "TK_DIV" "TK_MOD"
%left "TK_RAIZ" "TK_POTENCIA"
%right "UMINUS"

/*to regonize this token we should call it with %prec UMINUS after delcaring a production



/*---------------------------Grammar Definition---------------------------*/
%start inicio

// TODO add error handling
%%

inicio: 
    instructiones EOF    
|   EOF                 
;

instrucciones:
    instrucciones instruccion 
|   instruccion
;

instruccion : 
    declaracion_variables 
|   declaracion_funciones
|   ejecutar
;

declaracion_variables:
    RW_LET identificadores TK_DOS_PUNTOS tipo TK_IGUAL expresion TK_PUNTO_COMA
|   RW_LET identificadores TK_DOS_PUNTOS tipo TK_PUNTO_COMA
|   RW_CONST identificadores TK_DOS_PUNTOS tipo TK_PUNTO_COMA
|   RW_CONST identificadores TK_DOS_PUNTOS tipo TK_IGUAL expresion TK_PUNTO_COMA
|   RW_LET TK_ID TK_DOS_PUNTOS 
|   RW_CONST
;

/* ya no segui hay que termina*/
vectores:
    vectores 
    TK_ICORCHETE TK_DCORCHETE
|   
   
   
;

identificadores:
    identificadores TK_COMA TK_ID
|   TK_ID
;  

tipo: 
    RW_INT
|   RW_DOUBLE
|   RW_STRING
|   RW_BOOL
|   RW_CHAR
;



expresion:
    TK_INT
|   TK_STRING
|   TK_DOUBLE
|   TK_CHAR
|   RW_FALSE
|   RW_TRUE
|   tk_ipar expresion tk_dpar
|   cast
;

aritmeticas
 expresion tk_suma expresion
 expresion tk_resta expresion

logicas
 expresion tk_menor_igual expresion

booleanas
expresion tk_or expresion

primitivas 

cast:
    RW_CAST TK_IPAR expresion RW_AS tipo TK_DPAR 
;



    

