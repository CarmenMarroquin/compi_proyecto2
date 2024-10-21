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
    import { Primitive, Undefined, VariableTypes, ArithmeticOperator, RelationalOperator, LogicalOperator, IncDec } from "./herramientas/tipos";

    import { VarDeclaration, ConstDeclaration, VectorDeclaration } from "./instrucciones/declaration";
    import { SetVar } from "./instrucciones/setVar";
    import { SetVector } from "./instrucciones/setVector";
    import { IncDecVar } from "./instrucciones/incDec";
    import { CodeBlock } from "./instrucciones/codeBlock";
    import { If } from "./instrucciones/if";
    import { Switch } from "./instrucciones/switch";
    import { While } from "./instrucciones/while";
    import { For } from "./instrucciones/for";
    import { DoUntil } from "./instrucciones/do_until";
    import { Break, Continue, Return } from "./instrucciones/transferOp";
    import { Echo } from "./instrucciones/echo";
    import { Function, Method } from "./instrucciones/functions";

    import { Vector } from "./expresiones/vector";
    import { NewVector } from "./expresiones/newVectores";
    import { Cast } from "./expresiones/cast";
    import { PrimitiveVal } from "./expresiones/primitives";
    import { CallVar } from "./expresiones/callVar";
    import { VectorAccess } from "./expresiones/vectorAccess";
    import { Relational } from "./expresiones/relational";
    import { Arithmetic } from "./expresiones/arithmetic";
    import { Logical } from "./expresiones/logical";
    import { TernaryOperator } from "./expresiones/ternaryOperator";
    import { IsFunction } from "./expresiones/isFunction";
    import { CallFunc } from "./expresiones/callFunc";

    import Environment from "./herramientas/entornos";
%}

%{
    export const environments: Environment[] = [];
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
|   EOF                 { return []; } 
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
    instrucciones instruccion   { $1.push($2); $$ = $1; }
|   instruccion                 { $$ = [$1]; }
;

instruccion : 
/*----------------------------DECLARACION----------------------------*/
    declaracion_vectores TK_PUNTO_COMA      { $$ = $1; }
|   declaracion_variables TK_PUNTO_COMA     { $$ = $1; } 
|   declaracion_constantes TK_PUNTO_COMA    { $$ = $1; }
/*----------------------------ASIGNACION----------------------------*/
|   asignacion_variables TK_PUNTO_COMA      { $$ = $1; }
|   incremento_decremento TK_PUNTO_COMA     { $$ = $1; }
/*--------------------------SENTENCIAS CONTROL---------------------------*/
|   sentencias_control  { $$ = $1; }
/*--------------------------SENTENCIAS CICLICAS---------------------------*/
|   sentencias_ciclicas { $$ = $1; }
/*----------------------------TRANSFERENCIA----------------------------*/
|   RW_BREAK TK_PUNTO_COMA              { $$ = new Break(@1.first_line, @1.first_column); }
|   RW_CONTINUE TK_PUNTO_COMA           { $$ = new Continue(@1.first_line, @1.first_column); }
|   RW_RETURN expresion TK_PUNTO_COMA   { $$ = new Return($2, @1.first_line, @1.first_column); }
|   RW_RETURN TK_PUNTO_COMA             { $$ = new Return(undefined, @1.first_line, @1.first_column); }
/*----------------------------FUNCIONES----------------------------*/
//|   declaracion_funciones TK_PUNTO_COMA
//|   delcaracion_metodos
|   llamadas TK_PUNTO_COMA  { $$ = $1; }
|   echo TK_PUNTO_COMA      { $$ = $1; }
;

/* 
+++++++++++++++++++++++++++++
+         EJECUTAR          +
+++++++++++++++++++++++++++++
*/
ejecutar:
    RW_EJECUTAR TK_ID TK_IPAR TK_DPAR   { $$ = new CallFunc($2, [], @1.first_line, @1.first_column); }
|   RW_EJECUTAR TK_ID TK_IPAR parametros_llamada TK_DPAR    { $$ = new CallFunc($2, $4, @1.first_line, @1.first_column); }
;



/* 
+++++++++++++++++++++++++++++
+   SENTENCIAS DE CONTROL   +
+++++++++++++++++++++++++++++
*/
sentencias_control:
    sentencia_if        { $$ = $1; }
|   sentencia_switch    { $$ = $1; }
;

// TODO: CHECK IF STATEMENT
sentencia_if:
    RW_IF TK_IPAR expresion TK_DPAR TK_ILLAVE entorno TK_DLLAVE { $6.envName = "if_env"; $$ = new If($3, $6, undefined, @1.first_line, @1.first_column); }
|   RW_IF TK_IPAR expresion TK_DPAR TK_ILLAVE entorno TK_DLLAVE RW_ELSE TK_ILLAVE entorno TK_DLLAVE { $6.envName = "if_env"; $10.envName = "else_env"; $$ = new If($3, $6, $10, @1.first_line, @1.first_column); }
|   RW_IF TK_IPAR expresion TK_DPAR TK_ILLAVE entorno TK_DLLAVE RW_ELSE sentencia_if    { $6.envName = "if_env"; $$ = new If($3, $6, $9, @1.first_line, @1.first_column); }
;


// TODO: CHECK IF SWITCH STATEMENT WORKS
sentencia_switch:
    RW_SWITCH TK_IPAR expresion TK_DPAR TK_ILLAVE cases case_default TK_DLLAVE  { $$ = new Switch($3, $6, $7, @1.first_line, @1.first_column); }
|   RW_SWITCH TK_IPAR expresion TK_DPAR TK_ILLAVE cases TK_DLLAVE               { $$ = new Switch($3, $6, undefined, @1.first_line, @1.first_column); }
|   RW_SWITCH TK_IPAR expresion TK_DPAR TK_ILLAVE case_default TK_DLLAVE        { $$ = new Switch($3, undefined, $6, @1.first_line, @1.first_column); }
;

cases:
    cases case  { $1.push($2); $$ = $1; }
|   case        { $$ = [$1]; }
;

case:
    RW_CASE expresion TK_DOS_PUNTOS entorno { $$ = {cond: $2, then: $4}; }
;

case_default:
    RW_DEFAULT TK_DOS_PUNTOS entorno    { $$ = $3; }
;


/* 
+++++++++++++++++++++++++++++
+  SENTENCIAS DE CICLICAS   +
+++++++++++++++++++++++++++++
*/
sentencias_ciclicas:
    sentencia_while             { $$ = $1; }
|   sentencia_for               { $$ = $1; }
|   sentencia_do TK_PUNTO_COMA  { $$ = $1; }
|   sentencia_loop              { $$ = $1; }
;

sentencia_while:
    RW_WHILE TK_IPAR expresion TK_DPAR TK_ILLAVE entorno TK_DLLAVE  { $$ = new While($3, $6, @1.first_line, @1.first_column); }
;

sentencia_for:
    RW_FOR TK_IPAR declaracion_variables TK_PUNTO_COMA logica TK_PUNTO_COMA actualizacion_for TK_DPAR TK_ILLAVE entorno TK_DLLAVE   { $$ = new For($3, $5, $7, $10, @1.first_line, @1.first_column); }
|   RW_FOR TK_IPAR asignacion_variables TK_PUNTO_COMA logica TK_PUNTO_COMA actualizacion_for TK_DPAR TK_ILLAVE entorno TK_DLLAVE    { $$ = new For($3, $5, $7, $10, @1.first_line, @1.first_column); }
;

actualizacion_for:
    incremento_decremento   { $$ = $1; }
|   asignacion_variables    { $$ = $1; }
;

sentencia_do:
    RW_DO TK_ILLAVE entorno TK_DLLAVE RW_UNTIL TK_IPAR expresion TK_DPAR    { $$ = new DoUntil($3, $7, @1.first_line, @1.first_column); }
;

sentencia_loop:
    RW_LOOP TK_ILLAVE entorno TK_DLLAVE { $$ = new While(new PrimitiveVal("true", Primitive.BOOL, @1.first_line, @1.first_column), $3, @1.first_line, @1.first_column); }
;

/*
+++++++++++++++++++++++++++++
+          ENTORNOS         +
+++++++++++++++++++++++++++++
*/

entorno:
    instrucciones   { $$ = new CodeBlock($1, @1.first_line, @1.first_column); }
|                   { $$ = new CodeBlock([], @1.first_line, @1.first_column); }
;

/* 
+++++++++++++++++++++++++++++
+        INCRE DECRE        +
+++++++++++++++++++++++++++++
*/
// TODO
incremento_decremento:
    TK_ID TK_INCREMETO      { $$ = new IncDecVar($1, IncDec.INC, @1.first_line, @1.first_column); }
|   TK_ID TK_DRECREMENTO    { $$ = new IncDecVar($1, IncDec.DEC, @1.first_line, @1.first_column); }
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
    TK_ID TK_ICORCHETE expresion TK_DCORCHETE TK_IGUAL expresion    { $$ = new SetVector($1, $3, undefined, $6, @1.first_line, @1.first_column); }    
|   TK_ID TK_ICORCHETE expresion TK_DCORCHETE TK_ICORCHETE expresion TK_DCORCHETE TK_IGUAL expresion    { $$ = new SetVector($1, $3, $6, $9, @1.first_line, @1.first_column); }
|   TK_ID TK_IGUAL expresion    { $$ = new SetVar($1, $3, @1.first_line, @1.first_column); }
;


/* 
+++++++++++++++++++++++++++++
+        FUNCIONES          +
+++++++++++++++++++++++++++++
*/

declaracion_funciones:
    RW_FUNTION tipo TK_ID TK_IPAR parametros_funcion TK_DPAR TK_ILLAVE entorno TK_DLLAVE    { $$ = new Function($2, $3, $5, $8, @1.first_line, @1.first_column); }
|   RW_FUNTION tipo TK_ID TK_IPAR TK_DPAR TK_ILLAVE entorno TK_DLLAVE                       { $$ = new Function($2, $3, [], $7, @1.first_line, @1.first_column); }
;

parametros_funcion:
    parametros_funcion TK_COMA parametro_funcion    { $1.push($3); $$ = $1; }
|   parametro_funcion                               { $$ = [$1]; }
;

parametro_funcion:
    TK_ID TK_DOS_PUNTOS tipo TK_IGUAL expresion { $$ = {id: $1, type: $3, deft: $5}; }
|   TK_ID TK_DOS_PUNTOS tipo                    { $$ = {id: $1, type: $3}; }
;

/* 
+++++++++++++++++++++++++++++
+         METODOS           +
+++++++++++++++++++++++++++++
*/
declaracion_metodos:
    RW_FUNTION RW_VOID TK_ID TK_IPAR parametros_funcion TK_DPAR TK_ILLAVE entorno TK_DLLAVE { $$ = new Method(undefined, $3, $5, $8, @1.first_line, @1.first_column); }
|   RW_FUNTION RW_VOID TK_ID TK_IPAR TK_DPAR TK_ILLAVE entorno TK_DLLAVE                    { $$ = new Method(undefined, $3, [], $7, @1.first_line, @1.first_column); }
;

/* 
+++++++++++++++++++++++++++++
+           ECHO            +
+++++++++++++++++++++++++++++
*/
echo:
    RW_ECHO expresion   { $$ = new Echo($2, @1.first_line, @1.first_column); }
;

/* 
+++++++++++++++++++++++++++++
+        EXPRESIONES        +
+++++++++++++++++++++++++++++
*/
expresion:
    operador_ternario           { $$ = $1; }
|   logica                      { $$ = $1; }
|   booleanas                   { $$ = $1; }
|   aritmeticas                 { $$ = $1; }
|   llamadas                    { $$ = $1; }
|   acceso_vectores             { $$ = $1; }
|   cast                        { $$ = $1; }
|   is_value                    { $$ = $1; }
|   primitivo                   { $$ = $1; }
|   TK_ID                       { $$ = new CallVar($1, @1.first_line, @1.first_column); }
|   TK_IPAR expresion TK_DPAR   { $$ = $2; }
;

primitivo:
    TK_INT      { $$ = new PrimitiveVal($1, Primitive.INT, @1.first_line, @1.first_column); }
|   TK_STRING   { $$ = new PrimitiveVal($1, Primitive.STRING, @1.first_line, @1.first_column); }
|   TK_DOUBLE   { $$ = new PrimitiveVal($1, Primitive.DOUBLE, @1.first_line, @1.first_column); }
|   TK_CHAR     { $$ = new PrimitiveVal($1, Primitive.CHAR, @1.first_line, @1.first_column); }
|   RW_NULL     { $$ = new PrimitiveVal($1, Primitive.NULL, @1.first_line, @1.first_column); }
|   RW_FALSE    { $$ = new PrimitiveVal($1, Primitive.BOOL, @1.first_line, @1.first_column); }
|   RW_TRUE     { $$ = new PrimitiveVal($1, Primitive.BOOL, @1.first_line, @1.first_column); }
;

aritmeticas:
    expresion TK_SUMA expresion         {$$ = new Arithmetic($1, ArithmeticOperator.PLUS, $3, @1.first_line, @1.first_column); }
|   expresion TK_RESTA expresion        {$$ = new Arithmetic($1, ArithmeticOperator.MINUS, $3, @1.first_line, @1.first_column); }
|   expresion TK_MULTI expresion        {$$ = new Arithmetic($1, ArithmeticOperator.MULT, $3, @1.first_line, @1.first_column); }
|   expresion TK_DIV expresion          {$$ = new Arithmetic($1, ArithmeticOperator.DIV, $3, @1.first_line, @1.first_column); }
|   expresion TK_POTENCIA expresion     {$$ = new Arithmetic($1, ArithmeticOperator.POWER, $3, @1.first_line, @1.first_column); }
|   expresion TK_RAIZ expresion         {$$ = new Arithmetic($1, ArithmeticOperator.ROOT, $3, @1.first_line, @1.first_column); }
|   expresion TK_MODULO expresion       {$$ = new Arithmetic($1, ArithmeticOperator.MOD, $3, @1.first_line, @1.first_column); }
|   TK_RESTA expresion %prec UMINUS     {$$ = new Arithmetic(undefined, ArithmeticOperator.UMINUS, $2, @1.first_line, @1.first_column); }
;

logica:
    expresion TK_IGUALACION expresion       {$$ = new Relational($1, RelationalOperator.EQ, $3, @1.first_line, @1.first_column); }
|   expresion TK_DIFERENCIACION expresion   {$$ = new Relational($1, RelationalOperator.NEQ, $3, @1.first_line, @1.first_column); }
|   expresion TK_MAYOR expresion            {$$ = new Relational($1, RelationalOperator.GREATER, $3, @1.first_line, @1.first_column); }
|   expresion TK_MENOR expresion            {$$ = new Relational($1, RelationalOperator.LESS, $3, @1.first_line, @1.first_column); }
|   expresion TK_MAYOR_IGUAL expresion      {$$ = new Relational($1, RelationalOperator.GEQ, $3, @1.first_line, @1.first_column); }
|   expresion TK_MENOR_IGUAL expresion      {$$ = new Relational($1, RelationalOperator.LEQ, $3, @1.first_line, @1.first_column); }
;

booleanas:
    expresion TK_AND expresion  {$$ = new  Logical($1, LogicalOperator.AND, $3, @1.first_line, @1.first_column); }
|   expresion TK_OR expresion   {$$ = new  Logical($1, LogicalOperator.OR, $3, @1.first_line, @1.first_column); }
|   TK_NOT expresion            {$$ = new  Logical(undefined, LogicalOperator.NOT, $2, @1.first_line, @1.first_column); }
;

cast:
    RW_CAST TK_IPAR expresion RW_AS tipo TK_DPAR    { $$ = new Cast($3, $5, @1.first_line, @1.first_column); }
;

operador_ternario:
    RW_IF TK_IPAR expresion TK_DPAR expresion TK_DOS_PUNTOS expresion   { $$ = new TernaryOperator($3, $5, $7, @1.first_line, @1.first_column); }
;


acceso_vectores:
    TK_ID TK_ICORCHETE expresion TK_DCORCHETE   { $$ = new VectorAccess($1, $3, undefined, @1.first_line, @1.first_column); }
|   TK_ID TK_ICORCHETE expresion TK_DCORCHETE TK_ICORCHETE expresion TK_DCORCHETE   { $$ = new VectorAccess($1, $3, $6, @1.first_line, @1.first_column); }
;
    
/* 
+++++++++++++++++++++++++++++
+          IS_VAL           +
+++++++++++++++++++++++++++++
*/
is_value:
    expresion RW_IS tipo    { $$ = new IsFunction($1, $3, @1.first_line, @1.first_column); }
;

/* 
+++++++++++++++++++++++++++++
+         LLAMADAS           +
+++++++++++++++++++++++++++++
*/

llamadas:
    TK_ID TK_IPAR parametros_llamada TK_DPAR    { $$ = new CallFunc($1, $3, @1.first_line, @1.first_column); }
|   TK_ID TK_IPAR TK_DPAR                       { $$ = new CallFunc($1, [], @1.first_line, @1.first_column); }
;

parametros_llamada:
    parametros_llamada TK_COMA TK_ID TK_IGUAL expresion { $1.push({id: $3, val: $5}); $$ = $1; }
|   TK_ID TK_IGUAL expresion    { $$ = [{id: $1, val: $3}]; }
;

llamada_nativa:
    TK_ID TK_IPAR expresion TK_DPAR { $$ = new CallFunc($1, [{id: "arg", val: $3}], @1.first_line, @1.first_column); }
;
