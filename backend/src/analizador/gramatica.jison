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
"is"                                   return "RW_IS";


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
%left "TK_MENOR" "TK_MENOR_IGUAL" "TK_MAYOR" "TK_MAYOR_IGUAL" "TK_IGUALACION" "TK_DIFERENCIACION"
%left "TK_MAS" "TK_MENOS"
%left "TK_MULTI" "TK_DIV" "TK_MOD"
%nonassoc "TK_RAIZ" "TK_POTENCIA"
%right "UMINUS"

/*to regonize this token we should call it with %prec UMINUS after delcaring a production



/*---------------------------Grammar Definition---------------------------*/
%start inicio

// TODO add error handling
%%

inicio: 
    instrucciones EOF    
|   EOF                 
;

global:
    declaracion_variables TK_PUNTO_COMA
|   declaracion_constantes TK_PUNTO_COMA
|   declaracion_vectores TK_PUNTO_COMA
|   declaracion_funciones
|   declaracion_metodo
|   ejecutar TK_PUNTO_COMA
;

instrucciones:
    instrucciones instruccion 
|   instruccion
;

instruccion : 
/*----------------------------DECLARACION----------------------------*/
    declaracion_variables TK_PUNTO_COMA 
|   declaracion_constantes TK_PUNTO_COMA
|   declaracion_vectores TK_PUNTO_COMA
|   asignacion_variables TK_PUNTO_COMA
|   incremento_decremento TK_PUNTO_COMA
/*--------------------------SENTENCIAS CONTROL---------------------------*/
|   sentencias_control
/*--------------------------SENTENCIAS CICLICAS---------------------------*/
|   sentencias_ciclicas
/*----------------------------TRANSFERENCIA----------------------------*/
|   RW_BREAK TK_PUNTO_COMA
|   RW_CONTINUE TK_PUNTO_COMA
|   RW_RETURN expresion TK_PUNTO_COMA
|   RW_RETURN TK_PUNTO_COMA
/*----------------------------FUNCIONES----------------------------*/
//|   declaracion_funciones TK_PUNTO_COMA
//|   delcaracion_metodos
|   llamadas TK_PUNTO_COMA
|   echo TK_PUNTO_COMA
;

/* 
+++++++++++++++++++++++++++++
+         EJECUTAR          +
+++++++++++++++++++++++++++++
*/
ejecutar:
    RW_EJECUTAR TK_ID TK_IPAR TK_DPAR
|   RW_EJECUTAR TK_ID TK_IPAR parametros_llamada TK_DPAR
;



/* 
+++++++++++++++++++++++++++++
+   SENTENCIAS DE CONTROL   +
+++++++++++++++++++++++++++++
*/
sentencias_control:
    sentencia_if
|   sentencia_switch
;

// TODO: CHECK IF STATEMENT
sentencia_if:
    RW_IF TK_IPAR expresion TK_DPAR TK_ICORCHETE entorno TK_DCORCHETE
|   RW_IF TK_IPAR expresion TK_DPAR TK_ICORCHETE entorno TK_DCORCHETE RW_ELSE TK_ICORCHETE instrucciones TK_DCORCHETE
|   RW_IF TK_IPAR expresion TK_DPAR TK_ICORCHETE entorno TK_DCORCHETE RW_ELSE sentencia_if
;


// TODO: CHECK IF SWITCH STATEMENT WORKS
sentencia_switch:
    RW_SWITCH TK_IPAR expresion TK_DPAR TK_ICORCHETE cases case_default TK_DCORCHETE
|   RW_SWITCH TK_IPAR expresion TK_DPAR TK_ICORCHETE cases TK_DCORCHETE
|   RW_SWITCH TK_IPAR expresion TK_DPAR TK_ICORCHETE case_default TK_DCORCHETE
;

cases:
    cases case
|   case
;

case:
    RW_CASE expresion TK_DOS_PUNTOS entorno
;

case_default:
    RW_DEFAULT TK_DOS_PUNTOS entorno
;


/* 
+++++++++++++++++++++++++++++
+  SENTENCIAS DE CICLICAS   +
+++++++++++++++++++++++++++++
*/
sentencias_ciclicas:
    sentencia_while
|   sentencia_for
|   sentencia_do
|   sentencia_loop
;

sentencia_while:
    RW_WHILE TK_IPAR expresion TK_DPAR TK_ICORCHETE entorno TK_DCORCHETE
;

sentencia_for:
    RW_FOR TK_IPAR declaracion_variables TK_PUNTO_COMA logica TK_PUNTO_COMA actualizacion_for TK_IPAR TK_ICORCHETE entorno TK_DCORCHETE
|   RW_FOR TK_IPAR asignacion_variables TK_PUNTO_COMA logica TK_PUNTO_COMA actualizacion_for TK_IPAR TK_ICORCHETE entorno TK_DCORCHETE
;

actualizacion_for:
    incremento_decremento
|   TK_ID TK_IGUAL expresion
;

sentencia_do:
    RW_DO TK_ICORCHETE entorno TK_DCORCHETE until TK_IPAR expresion TK_DPAR
;

sentencia_loop:
    RW_LOOP TK_ICORCHETE entorno TK_DCORCHETE
;

/*
+++++++++++++++++++++++++++++
+          ENTORNOS         +
+++++++++++++++++++++++++++++
*/

entorno:
    instrucciones
|                   { $$ = undefined; }
;

/* 
+++++++++++++++++++++++++++++
+        INCRE DECRE        +
+++++++++++++++++++++++++++++
*/
incremento_decremento:
    TK_ID TK_MAS TK_MAS
|   TK_ID TK_MENOS TK_MENOS
;


/* 
+++++++++++++++++++++++++++++
+        VARIABLES          +
+++++++++++++++++++++++++++++
*/
declaracion_variables:
    RW_LET identificadores TK_DOS_PUNTOS tipo TK_IGUAL expresion 
|   RW_LET identificadores TK_DOS_PUNTOS tipo 
;

declaracion_constantes:
    RW_CONST identificadores TK_DOS_PUNTOS tipo 
|   RW_CONST identificadores TK_DOS_PUNTOS tipo TK_IGUAL expresion 
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

declaracion_vectores:
    RW_LET TK_ID TK_DOS_PUNTOS tipo TK_ICORCHETE TK_DCORCHETE TK_IGUAL RW_NEW RW_VECTOR tipo TK_ICORCHETE expresion TK_DCORCHETE
|   RW_LET TK_ID TK_DOS_PUNTOS tipo TK_ICORCHETE TK_DCORCHETE TK_ICORCHETE TK_DCORCHETE TK_IGUAL RW_NEW RW_VECTOR tipo TK_ICORCHETE expresion TK_DCORCHETE TK_ICORCHETE expresion TK_DCORCHETE
|   RW_LET TK_ID TK_DOS_PUNTOS tipo TK_ICORCHETE TK_DCORCHETE TK_IGUAL TK_ICORCHETE lista_valores TK_DCORCHETE 
|   RW_LET TK_ID TK_DOS_PUNTOS tipo TK_ICORCHETE TK_DCORCHETE TK_ICORCHETE TK_DCORCHETE TK_IGUAL TK_ICORCHETE TK_ICORCHETE lista_valores TK_DCORCHETE TK_COMA TK_ICORCHETE lista_valores TK_DCORCHETE TK_DCORCHETE
;

lista_valores:
    lista_valores TK_COMA expresion
|   expresion
;


asignacion_variables:
    TK_ID TK_ICORCHETE expresion TK_DCORCHETE TK_IGUAL expresion
|   TK_ID TK_ICORCHETE expresion TK_DCORCHETE TK_ICORCHETE expresion TK_DCORCHETE TK_IGUAL expresion
|   TK_ID TK_IGUAL expresion
;


/* 
+++++++++++++++++++++++++++++
+        FUNCIONES          +
+++++++++++++++++++++++++++++
*/

declaracion_funciones:
    RW_FUNTION tipo TK_ID TK_IPAR parametros_funcion TK_DPAR TK_ICORCHETE entorno TK_DCORCHETE
|   RW_FUNTION tipo TK_ID TK_IPAR TK_DPAR TK_ICORCHETE entorno TK_DCORCHETE
;

parametros_funcion:
    parametros_funcion, parametro_funcion
|   parametro_funcion
;

parametro_funcion:
    TK_ID TK_DOS_PUNTOS tipo TK_IGUAL expresion
|   TK_ID TK_DOS_PUNTOS tipo
;

/* 
+++++++++++++++++++++++++++++
+         METODOS           +
+++++++++++++++++++++++++++++
*/
delcaracion_metodos:
    RW_FUNTION RW_VOID TK_ID TK_IPAR parametros_funcion TK_DPAR TK_ICORCHETE entorno TK_DCORCHETE
|   RW_FUNTION RW_VOID TK_ID TK_IPAR TK_DPAR TK_ICORCHETE entorno TK_DCORCHETE
;


/* 
+++++++++++++++++++++++++++++
+         LLAMADAS           +
+++++++++++++++++++++++++++++
*/

llamadas:
    TK_ID TK_IPAR parametros_llamada TK_DPAR
|   TK_ID TK_IPAR TK_DPAR
;

parametros_llamada:
    parametros_llamada parametro_llamada
|   parametro_llamada
;

parametro_llamada:
    TK_ID TK_IGUAL expresion
;


/* 
+++++++++++++++++++++++++++++
+           ECHO            +
+++++++++++++++++++++++++++++
*/
echo:
    RW_ECHO expresion
;

/* 
+++++++++++++++++++++++++++++
+        EXPRESIONES        +
+++++++++++++++++++++++++++++
*/
expresion:
    primitivo
|   cast
|   is_value
|   aritmeticas
|   logica
|   booleanas
|   TK_ID
|   llamar_func
|   operador_ternario
|   acceso_vectores
|   TK_IPAR expresion TK_DPAR
;

primitivo:
    TK_INT
|   TK_STRING
|   TK_DOUBLE
|   TK_CHAR
|   RW_NULL
|   RW_FALSE
|   RW_TRUE
;

aritmeticas:
    expresion TK_SUMA expresion
|   expresion TK_RESTA expresion
|   expresion TK_MULTI expresion
|   expresion TK_DIV expresion
|   expresion TK_POTENCIA expresion
|   expresion TK_RAIZ expresion
|   expresion TK_MODULO expresion
|   TK_RESTA expresion %prec UMINUS
;

logica:
    expresion TK_MENOR_IGUAL expresion
|   expresion TK_MAYOR_IGUAL expresion
|   expresion TK_MENOR expresion
|   expresion TK_MAYOR expresion
|   expresion TK_IGUALACION expresion
|   expresion TK_IGUAL expresion
|   expresion TK_DIFERENCIACION expresion
;

booleanas:
    expresion TK_OR expresion
|   expresion TK_AND expresion
|   expresion TK_NOT expresion
;

argumentos:
    TK_ID TK_IGUAL expresion
|   argumentos TK_COMA TK_ID TK_IGUAL expresion 
;

llamar_func:
    TK_ID TK_IPAR argumentos TK_DPAR
|   TK_ID TK_IPAR TK_DPAR
;

cast:
    RW_CAST TK_IPAR expresion RW_AS tipo TK_DPAR 
;

operador_ternario:
    RW_IF TK_IPAR expresion TK_DPAR expresion TK_DOS_PUNTOS expresion
;


acceso_vectores:
    TK_ID TK_ICORCHETE expresion TK_DCORCHETE
|   TK_ID TK_ICORCHETE expresion TK_DCORCHETE TK_ICORCHETE expresion TK_DCORCHETE
;
    
/* 
+++++++++++++++++++++++++++++
+          IS_VAL           +
+++++++++++++++++++++++++++++
*/
is_value:
    expresion RW_IS tipo
;

