%{
    // files to import should be the js files
    /*
    //import { LexError, SynError } from "./errors.js"
    */
    // use this import while testing
    //const { LexError, SynError } = require("./errors");
    import {LexError, SynError } from "./errores";
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
[/][/].*                                      // comment inline
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
"function"                              return "RW_FUNTION";
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
<string>"\\'"                   {controlString+="\'";}
<string>["]                     {yytext=controlString; this.popState(); return "TK_STRING";}

[']([!-~])[']                   return "TK_CHAR";

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
    import { VarDeclaration, ConstDeclaration, VectorDeclaration } from "./instrucciones/declaration";
    import { Primitive, Undefined, VariableTypes } from "./herramientas/tipos";
    import { Vector } from "./expresiones/vector";
    import { NewVector } from "./expresiones/newVectores";

%}


/*---------------------------Operators Precedence---------------------------*/
//%nonassoc 
%right "RW_IS"
%right "RW_IF" "TK_DOS_PUNTOS"
%left "TK_OR"
%left "TK_AND"
%right "TK_NOT"
%left "TK_MENOR" "TK_MENOR_IGUAL" "TK_MAYOR" "TK_MAYOR_IGUAL" "TK_IGUALACION" "TK_DIFERENCIACION"
%left "TK_SUMA" "TK_RESTA"
%left "TK_MULTI" "TK_DIV" "TK_MODULO"
%nonassoc "TK_RAIZ" "TK_POTENCIA"
%right "UMINUS"
%right "TK_IPAR" "TK_DPAR"
%left "TK_ID"

/*to regonize this token we should call it with %prec UMINUS after delcaring a production



/*---------------------------Grammar Definition---------------------------*/
%start inicio

// TODO add error handling
%%

inicio: 
    entorno_global EOF  { return $1; }   
|   EOF                 { return null; } 
;

entorno_global:
    entorno_global global   { $1.push($2); $$ = $1; }
|   global                  { $$ = [$1]; }
;

global:
    declaracion_vectores TK_PUNTO_COMA      { $$ = $1; }
|   declaracion_variables TK_PUNTO_COMA     { $$ = $1; }
|   declaracion_constantes TK_PUNTO_COMA    { $$ = $1; }
|   declaracion_metodos                     { $$ = $1; }
|   declaracion_funciones                   { $$ = $1; }
|   ejecutar TK_PUNTO_COMA                  { $$ = $1; }
;

instrucciones:
    instrucciones instruccion 
|   instruccion
;

instruccion : 
/*----------------------------DECLARACION----------------------------*/
    declaracion_vectores TK_PUNTO_COMA
|   declaracion_variables TK_PUNTO_COMA 
|   declaracion_constantes TK_PUNTO_COMA
/*----------------------------ASIGNACION----------------------------*/
|   incremento_decremento TK_PUNTO_COMA
|   asignacion_variables TK_PUNTO_COMA
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
    RW_IF TK_IPAR expresion TK_DPAR TK_ILLAVE entorno TK_DLLAVE
|   RW_IF TK_IPAR expresion TK_DPAR TK_ILLAVE entorno TK_DLLAVE RW_ELSE TK_ILLAVE instrucciones TK_DLLAVE
|   RW_IF TK_IPAR expresion TK_DPAR TK_ILLAVE entorno TK_DLLAVE RW_ELSE sentencia_if
;


// TODO: CHECK IF SWITCH STATEMENT WORKS
sentencia_switch:
    RW_SWITCH TK_IPAR expresion TK_DPAR TK_ILLAVE cases case_default TK_DLLAVE
|   RW_SWITCH TK_IPAR expresion TK_DPAR TK_ILLAVE cases TK_DLLAVE
|   RW_SWITCH TK_IPAR expresion TK_DPAR TK_ILLAVE case_default TK_DLLAVE
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
|   sentencia_do TK_PUNTO_COMA
|   sentencia_loop
;

sentencia_while:
    RW_WHILE TK_IPAR expresion TK_DPAR TK_ILLAVE entorno TK_DLLAVE
;

sentencia_for:
    RW_FOR TK_IPAR declaracion_variables TK_PUNTO_COMA logica TK_PUNTO_COMA actualizacion_for TK_DPAR TK_ILLAVE entorno TK_DLLAVE
|   RW_FOR TK_IPAR asignacion_variables TK_PUNTO_COMA logica TK_PUNTO_COMA actualizacion_for TK_DPAR TK_ILLAVE entorno TK_DLLAVE
;

actualizacion_for:
    incremento_decremento
|   TK_ID TK_IGUAL expresion
;

sentencia_do:
    RW_DO TK_ILLAVE entorno TK_DLLAVE RW_UNTIL TK_IPAR expresion TK_DPAR
;

sentencia_loop:
    RW_LOOP TK_ILLAVE entorno TK_DLLAVE
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
    TK_ID TK_INCREMETO
|   TK_ID TK_DRECREMENTO
;


/* 
+++++++++++++++++++++++++++++
+        VARIABLES          +
+++++++++++++++++++++++++++++
*/
declaracion_variables:
    RW_LET identificadores TK_DOS_PUNTOS tipo TK_IGUAL expresion    { $$ = new VarDeclaration($2, $4, $6, @1.first_line, @1.first_column); }
|   RW_LET identificadores TK_DOS_PUNTOS tipo                       { $$ = new VarDeclaration($2, $4, undefined, @1.first_line, @1.first_column); }
;

declaracion_constantes:
    RW_CONST identificadores TK_DOS_PUNTOS tipo TK_IGUAL expresion  { $$ = new ConstDeclaration($2, $4, $6, @1.first_line, @1.first_column); }
|   RW_CONST identificadores TK_DOS_PUNTOS tipo                     { $$ = new ConstDeclaration($2, $4, undefined, @1.first_line, @1.first_column); }
;

identificadores:
    identificadores TK_COMA TK_ID   { $1.push($3); $$ = $1; }
|   TK_ID                           { $$ = [$1]; }
;  

tipo: 
    RW_INT      { $$ = Primitive.INT; }
|   RW_DOUBLE   { $$ = Primitive.DOUBLE; }
|   RW_STRING   { $$ = Primitive.STRING; }
|   RW_BOOL     { $$ = Primitive.BOOL; }
|   RW_CHAR     { $$ = Primitive.CHAR; }
|   RW_NULL     { $$ = Primitive.NULL; }
;

declaracion_vectores:
    RW_LET TK_ID TK_DOS_PUNTOS tipo TK_ICORCHETE TK_DCORCHETE TK_IGUAL new_vector { $$ = new VectorDeclaration($2, $4, $8, @1.first_line, @1.first_column); }
|   RW_LET TK_ID TK_DOS_PUNTOS tipo TK_ICORCHETE TK_DCORCHETE TK_ICORCHETE TK_DCORCHETE TK_IGUAL new_vectores   { $$ = new VectorDeclaration($2, $4, $10, @1.first_line, @1.first_column); }
|   RW_LET TK_ID TK_DOS_PUNTOS tipo TK_ICORCHETE TK_DCORCHETE TK_IGUAL TK_ICORCHETE lista_valores TK_DCORCHETE  { $$ = new VectorDeclaration($2, $4, $9, @1.first_line, @1.first_column); }
|   RW_LET TK_ID TK_DOS_PUNTOS tipo TK_ICORCHETE TK_DCORCHETE TK_ICORCHETE TK_DCORCHETE TK_IGUAL TK_ICORCHETE lista_vectores TK_DCORCHETE { $$ = new VectorDeclaration($2, $4, $11, @1.first_line, @1.first_column); }
;


lista_valores:
    lista_valores TK_COMA expresion { $1.values.push($3); $1.length += 1; $$ = $1; }
|   expresion                       { $$ = new Vector(1, Primitive.NULL, [$1]); }     
;

lista_vectores:
    lista_vectores TK_COMA TK_ICORCHETE lista_valores TK_DCORCHETE  { $1.values.push($4); $1.length += 1; $$ = $1; } 
|   TK_ICORCHETE lista_valores TK_DCORCHETE                         { $$ = new Vector(1, VariableTypes.ARRAY, [$2]); }
;

new_vector:
    RW_NEW RW_VECTOR tipo TK_ICORCHETE expresion TK_DCORCHETE   { $$ = new NewVector($3, $5, undefined, @1.first_line, @1.first_column); }
;

new_vectores:
    RW_NEW RW_VECTOR tipo TK_ICORCHETE expresion TK_DCORCHETE TK_ICORCHETE expresion TK_DCORCHETE   { $$ = new NewVector($3, $5, $8, @1.first_line, @1.first_column); }
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
    RW_FUNTION tipo TK_ID TK_IPAR parametros_funcion TK_DPAR TK_ILLAVE entorno TK_DLLAVE
|   RW_FUNTION tipo TK_ID TK_IPAR TK_DPAR TK_ILLAVE entorno TK_DLLAVE
;

parametros_funcion:
    parametros_funcion TK_COMA parametro_funcion
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
declaracion_metodos:
    RW_FUNTION RW_VOID TK_ID TK_IPAR parametros_funcion TK_DPAR TK_ILLAVE entorno TK_DLLAVE
|   RW_FUNTION RW_VOID TK_ID TK_IPAR TK_DPAR TK_ILLAVE entorno TK_DLLAVE
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
    operador_ternario
|   logica
|   booleanas
|   aritmeticas
|   llamadas
|   acceso_vectores
|   cast
|   is_value
|   primitivo
|   TK_ID
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
    expresion TK_IGUALACION expresion
|   expresion TK_DIFERENCIACION expresion
|   expresion TK_MAYOR expresion
|   expresion TK_MENOR expresion
|   expresion TK_MAYOR_IGUAL expresion
|   expresion TK_MENOR_IGUAL expresion
;

booleanas:
    expresion TK_AND expresion
|   expresion TK_OR expresion
|   TK_NOT expresion
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
    parametros_llamada TK_COMA TK_ID TK_IGUAL expresion
|   TK_ID TK_IGUAL expresion
;
