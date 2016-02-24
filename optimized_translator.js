function acs(lang, theString){
	return (theString.toLowerCase().split(",").indexOf(lang.toLowerCase()) !== -1);
}
function pattern_to_output(theDict, thePattern, theLang){
	var theString;
	
	if((thePattern === 'static_method') && theDict.type === undefined){
		return pattern_to_output(theDict, 'typeless_static_method', theLang);
	}
	else if((thePattern === 'function') && theDict.type === undefined){
		return pattern_to_output(theDict, 'typeless_function', theLang);
	}
	else if((thePattern === 'grammar_parameter') && theDict.name === undefined){
		return pattern_to_output(theDict, 'nameless_grammar_parameter', theLang);
	}
	else if(thePattern === 'instance_method' && theDict.type === undefined){
		return pattern_to_output(theDict, 'typeless_instance_method', theLang);
	}
	else if(thePattern === 'initialize_var' && theDict.type === undefined){
		return pattern_to_output(theDict, 'typeless_initialize_var', theLang);
	}
	else if(thePattern === 'declare_constant' && theDict.type === undefined){
		return pattern_to_output(theDict, 'typeless_declare_constant', theLang);
	}
	else if(thePattern === 'function_parameter' && theDict.type === undefined){
		return pattern_to_output(theDict, 'typeless_parameter', theLang);
	}
	
	for(var i in thePatterns[thePattern]){
		if(acs(theLang, i)){
			theString = thePatterns[thePattern][i].replace('\\\\', '\\');
			break;
		}
	}
	if(theString === undefined){
		throw("\nnot yet defined in string_to_dict: " + JSON.stringify(thePattern) + " in " + theLang);
	}
	theString = theString.split(" ");
	for(var i = 0; i < theString.length; i++){
		if(theString[i][0] === ":" || theString[i][theString[i].length-1] === ":"){
			theString[i] = theString[i];
		}
		else if(theString[i].indexOf(":") !== -1){
			var currentKey = theDict[theString[i].split(":")[0]];
			if(currentKey === undefined){
				throw theString[i].split(":")[0] + " is not defined for " + thePattern + " in " + theLang+"\n"+JSON.stringify(theDict);
			}
			theString[i] = currentKey;
		}
		else if(theString[i] === "__"){
			theString[i] = " ";
		}
		else if(theString[i] === "_"){
			theString[i] = '';
		}
	}
	return theString.join("");
}
const list_of_languages = ["ebnf"];
var thePatterns = {"grammar_statement,name:Identifier,value:grammar_Or":{"Nearley":"name:Identifier _ -> _ value:grammar_Or","Parslet":"rule _ ( _ : _ name:Identifier _ ) _ { _ value:grammar_Or _ }","Marpa":"name:Identifier _ ::= _ value:grammar_Or","EBNF":"name:Identifier _ = _ value:grammar_Or _ ;","Yacc":"name:Identifier _ : _ value:grammar_Or _ ;","PEG.js,LPeg":"name:Identifier _ = _ value:grammar_Or","Wirth syntax notation":"name:Identifier _ = _ value:grammar_Or _ .","Perl 6":"token __ name:Identifier _ { _ value:grammar_Or _ }","Prolog":"name:Identifier _ --> _ value:grammar_Or _ .","REBOL":"name:Identifier _ : __ value:grammar_Or"},"statement,a:statement":{"Lua":"a:(if/import/while/for/function/statement_with_semicolon/comment/multiline_comment)","Octave":"a:(if/import/while/foreach/function/statement_with_semicolon/comment/multiline_comment)","MiniZinc":"a:(if/function/foreach/statement_with_semicolon/comment)","EnglishScript,VBScript,Java,Scala,Python,Dart,JavaScript,TypeScript,C#,PHP,Haxe,Ruby,C++,Visual Basic .NET,Go,Swift,REBOL,Fortran":"a:(function/foreach/import/switch/if/class/class_extends/enum/while/for/statement_with_semicolon/comment/multiline_comment)","C,R,Julia,Perl":"a:(if/import/while/for/function/statement_with_semicolon/comment/multiline_comment)","Picat":"a:(if/import/while/for/statement_with_semicolon/comment/multiline_comment)","Z3,Prolog,Haskell,Erlang,Common Lisp,Emacs Lisp,MiniZinc":"a:(function/import/if/statement_with_semicolon/comment/multiline_comment)","Mathematical notation,Polish notation,Reverse Polish notation":"a:(function/if/statement_with_semicolon)"},"statement_with_semicolon,var1:(print/set_var/plus_equals/minus_equals/exception/declare_constant/initialize_var/declare_new_object/typeless_initialize_var/set_array_size/initialize_empty_var/return/function_call)":{"C,PHP,Dafny,Chapel,Katahdin,Frink,Falcon,Aldor,IDP,Processing,Maxima,Seed7,Drools,EngScript,OpenOffice Basic,Ada,ALGOL 68,D,Ceylon,Rust,TypeScript,Octave,AutoHotKey,Pascal,Delphi,JavaScript,Pike,Objective-C,OCaml,Java,Scala,Dart,PHP,C#,C++,Haxe,AWK,bc,Perl,Perl 6,Nemerle,Vala":"var1:(print/set_var/plus_equals/minus_equals/exception/declare_constant/initialize_var/declare_new_object/typeless_initialize_var/set_array_size/initialize_empty_var/return/function_call) ;","MiniZinc":"var1:(return/initialize_var/initialize_empty_var/declare_constant/set_var/import/set_array_size)","Visual Basic .NET,Lua,Swift,REBOL,Fortran,Python,Go,Picat,Julia":"var1:(print/set_var/plus_equals/minus_equals/exception/declare_constant/initialize_var/declare_new_object/typeless_initialize_var/set_array_size/initialize_empty_var/return/function_call)","Prolog":"var1:(print/declare_constant/initialize_var/typeless_initialize_var/return/function_call)","Mathematical notation,Polish notation,Reverse Polish notation":"var1:(function_call)","Z3":"var1:(print/declare_constant/initialize_empty_var/set_var/return)","Ruby":"var1:(print/set_var/initialize_empty_var/plus_equals/minus_equals/declare_constant/initialize_var/typeless_initialize_var/return/function_call)","Haskell,Erlang,Common Lisp":"var1:(print/function_call/return)"},"one_or_more,a:grammar_expression":{"Marpa":"( _ a:grammar_expression _ ) _ +"},"grammar_optional,a:grammar_expression":{"pypeg":"optional _ ( _ a:grammar_expression _ )"},"grammar_parameter,name:Identifier,type:Identifier":{"PEG.js":"name:Identifier _ : _ type:Identifier","LPeg":"lpeg.V\" _ type:Identifier _ \"","Parslet":"type:Identifier _ . _ as _ ( _ name:Identifier _ )","Marpa,Yacc,EBNF,REBOL,Prolog":"type:Identifier","Perl 6":"< _ type:Identifier _ >"},"nameless_grammar_parameter,type:Identifier":{"PEG.js,Parslet,nearley,Marpa,Yacc,EBNF,REBOL,Prolog":"type:Identifier","LPeg":"lpeg.V\" _ type:Identifier _ \"","Perl 6":"< _ type:Identifier _ >"},"grammar_string_literal,the_str:string_literal":{"PEG.js,LPeg,Marpa,Yacc,EBNF,REBOL":"the_str:string_literal","Parslet":"str _ ( _ the_str:string_literal _ )"},"initialize_instance_variable,type:type,name:var_name":{"Java,C#":"private __ type:type __ name:var_name","PHP":"private __ name:var_name","C++,D":"type:type __ name:var_name","Haxe,Swift":"var __ name:var_name _ : _ type:type","Visual Basic .NET":"Private __ name:var_name __ As __ type:type","VBScript":"Private __ name:var_name"},"initialize_instance_variable_with_value,type:type,name:var_name,value:expression":{"Java,C#":"private __ type:type __ name:var_name _ = _ value:expression","PHP":"private __ name:var_name _ = _ value:expression","C++":"type:type __ name:var_name _ = _ value:expression","Python":"self _ . _ name:var_name _ = _ value:expression","Haxe,Swift":"var __ name:var_name _ : _ type:type _ = _ value:expression","Ruby":"@ _ name:var_name _ = _ value:expression","Visual Basic .NET":"Private __ name:var_name __ As __ type:type _ = _ value:expression"},"enum,name:Identifier,body:enum_list":{"C":"typedef __ enum _ { _ body:enum_list _ } _ name:Identifier _ ;","Ada":"type __ name:Identifier __ is __ ( _ body:enum_list _ ) _ ;","Perl 6":"enum __ name:Identifier __ < _ body:enum_list _ > _ ;","Python":"class __ name:Identifier _ ( _ AutoNumber _ ) _ : _ \\n _ #indent _ \\n _ b _ \\n _ #unindent","Java":"public __ enum __ name:Identifier _ { _ body:enum_list _ }","C#,C++,TypeScript":"enum __ name:Identifier _ { _ body:enum_list _ } _ ;","Haxe,Rust,Swift,Vala":"enum __ name:Identifier _ { _ body:enum_list _ }","Swift":"enum __ name:Identifier _ { _ case __ body:enum_list _ }","Visual Basic .NET":"Enum __ name:Identifier __ body:enum_list __ End __ Enum","Fortran":"ENUM _ :: _ name:Identifier __ body:enum_list __ END __ ENUM","Go":"type __ name:Identifier __ int __ const _ ( __ body:enum_list __ )","Scala":"object __ name:Identifier __ extends __ Enumeration _ { _ val __ body:enum_list _ = _ Value _ }"},"_enum_list,a:Identifier":{"Java,Perl 6,Swift,C++,C#,Visual Basic .NET,Haxe,Fortran,TypeScript,C,Ada,Scala":"a:Identifier","Go":"a:Identifier _ = _ iota","Python":"a:Identifier _ = _ ( _ )"},"enum_list,a:_enum_list,b:enum_list":{"Java,C++,C#,C,TypeScript,Fortran,Ada,Scala":"a:_enum_list _ , _ b:enum_list","Haxe":"a:_enum_list _ ; _ b:enum_list","Go,Perl 6,Swift,Visual Basic .NET":"a:_enum_list __ b:enum_list"},"list_comprehension,result:expression,variable:var_name,array:expression,condition:expression":{"Python,Cython":"[ _ result:expression __ for __ variable:var_name __ in __ array:expression __ if __ condition:expression _ ]","Ceylon":"{ _ for _ ( _ variable:var_name __ in __ array:expression _ ) __ if _ ( _ condition:expression _ ) __ result:expression _ }","JavaScript":"[ _ result:expression __ for _ ( _ variable:var_name __ of __ array:expression _ ) _ if __ condition:expression _ ]","CoffeeScript":"( _ result:expression __ for __ variable:var_name __ in __ array:expression __ when __ condition:expression _ )","MiniZinc":"[ _ result:expression _ | _ variable:var_name __ in __ array:expression __ where __ condition:expression _ ]","Haxe":"[ _ for _ ( _ variable:var_name __ in __ array:expression _ ) _ if _ ( _ condition:expression _ ) _ result:expression _ ]","C#":"( _ from __ variable:var_name __ in __ array:expression __ where __ condition:expression __ select __ result:expression _ )","Haskell":"[ _ result:expression _ | _ variable:var_name _ <- _ array:expression _ , _ condition:expression _ ]","Erlang":"[ _ result:expression _ || _ variable:var_name _ <- _ array:expression _ , _ condition:expression _ ]","Ruby":"array:expression _ . _ select _ { _ | _ variable:var_name _ | _ condition:expression _ } _ . _ collect _ { _ | _ variable:var_name _ | _ result:expression _ }","Scala":"( _ for _ ( _ variable:var_name _ <- _ array:expression __ if __ condition:expression _ ) _ yield __ result:expression _ )","Groovy":"array.grep _ { _ variable:var_name _ -> _ condition:expression _ }.collect _ { _ variable:var_name _ -> _ result:expression _ }","Dart":"array:expression _ . _ where _ ( _ variable:var_name _ => _ condition:expression _ ) _ . _ map _ ( _ variable:var_name _ => _ result:expression _ )","Picat":"[ _ result:expression _ : _ variable:var_name __ in __ array:expression _ , _ condition:expression _ ]"},"array_type,var1:_type,var2:\"[]\"":{"Java,C,C#,Haxe,C++":"var1:_type var2:array_type_suffix","MiniZinc":"array _ [ _ var1:_type _ ] __ of __ var1:_type","Go":"var2:array_type_suffix var1:_type","Dart":"array_type _ = _ List< _ var1:_type _ >","Swift":"[ _ var1:_type _ ]","Z3":"( _ Array __ var1:_type __ var1:_type _ )","Python,Picat":"var1:\"list\"","Lua":"var1:\"table\"","JavaScript,Ruby":"var1:\"Array\"","PHP":"var1:\"array\"","REBOL":"var1:\"block!\"","Octave":"var1:\"matrix\"","Erlang":"var1:\"List\""},"constructor,name:Identifier,params:function_parameters,body:series_of_statements":{"REBOL":"new: __ func _ [ _ params:function_parameters _ ] _ [ _ make __ self _ [ _ body:series_of_statements _ ] _ ]","crosslanguage":"( _ constructor __ name:Identifier __ params:function_parameters __ body:series_of_statements _ )","Visual Basic .NET":"Sub __ New _ ( _ params:function_parameters _ ) __ body:series_of_statements __ End __ Sub","Python":"def __ __init__ _ ( _  _ self _ , _ params:function_parameters _ ) _ : _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent","Java,C#":"public __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Swift":"init _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","JavaScript":"constructor _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Ruby":"def __ initialize _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","PHP":"function __ construct _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Perl":"sub __ new _ { _ body:series_of_statements _ }","Haxe":"public __ function __ new _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","C++,Dart":"name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","D":"this _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Chapel":"proc __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Julia":"function __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end"},"set_array_size,name:var_name,type:_type,size:expression":{"Scala":"var __ name:var_name _ = _ Array _ . _ fill _ ( _ size:expression _ ) _ { _ 0 _ }","Octave":"name:var_name _ = _ zeros _ ( _ size:expression _ )","MiniZinc":"array _ [ _ 1 _ .. _ size:expression _ ] __ of __ type:_type _ : _ name:var_name _ ;","Dart":"List __ name:var_name _ = _ new __ List _ ( _ size:expression _ )","Java,C#":"type:_type _ [] __ name:var_name _  _ = _ new __ type:_type _ [ _ size:expression _ ]","Fortran":"type:_type _ ( _ LEN _ = _ size:expression _ ) _  _ :: _ name:var_name","Go":"var __ name:var_name __ [ _ size:expression _ ] _ type:_type","Swift":"var __ name:var_name _ = _ [ _ type:_type _ ] _ ( _ count: _ size:expression _ , _ repeatedValue _ : _ 0 _ )","C,C++":"type:_type __ name:var_name _ [ _ size:expression _ ]","REBOL":"name:var_name _ : _ array __ size:expression","Visual Basic .NET":"Dim __ name:var_name _ ( _ size:expression _ ) __ as __ type:_type","PHP":"name:var_name _ = _ array_fill _ ( _ 0 _ , _ size:expression _ , _ 0 _ )","Haxe":"var __ vector _ = _  __ haxe _ . _ ds _ . _ Vector _ ( _ size:expression _ )","JavaScript":"var __ name:var_name _ = _ Array _ . _ apply _ ( _ null _ , _ Array _ ( _ size:expression _ ) _ ) _ . _ map _ ( _ function _ ( _ ) _ { _ } _ )","VBScript":"Dim __ name:var_name _ ( _ size:expression _ )"},"typeless_parameter,name:var_name":{"Haskell,LiveCode,TypeScript,Visual Basic .NET,REBOL,Prolog,Haxe,Scheme,Python,Mathematical notation,LispyScript,CLIPS,Clojure,F#,ML,Racket,OCaml,Tcl,Common Lisp,newLisp,Python,Cython,Frink,Picat,IDP,PowerShell,Maxima,Icon,CoffeeScript,Fortran,Octave,AutoHotKey,Julia,Prolog,AWK,Kotlin,Dart,JavaScript,Nemerle,Erlang,PHP,AutoIt,Lua,Ruby,R,bc":"name:var_name","Java,C#":"Object __ name:var_name","C++":"auto __ name:var_name","Perl":"name:var_name _ = _ push _ ;"},"asin,a:expression":{"Java,JavaScript,Ruby,Haxe,TypeScript":"Math _ . _ asin _ ( _ a:expression _ )","Python,Lua":"math _ . _ asin _ ( _ a:expression _ )","Perl,C,Fortran,D,PHP,Hack,Dart,Scala":"asin _ ( _ a:expression _ )","C#,Visual Basic,Visual Basic .NET":"Math _ . _ Asin _ ( _ a:expression _ )","Gambas":"Asin _ ( _ a:expression _ )","Erlang":"math _ : _ asin _ ( _ a:expression _ )","C++":"std _ :: _ asin _ ( _ a:expression _ )","Wolfram":"ArcSin _ [ _ a:expression _ ]","Common Lisp,Racket":"( _ asin __ a:expression _ )","Clojure":"( _ Math/asin __ a:expression _ )"},"typeless_function,name:Identifier,params:function_parameters,body:series_of_statements":{"Visual Basic .NET,VBScript":"Function __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ End __ Function","JavaScript,PHP,TypeScript":"function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Python":"def __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent","EnglishScript":"def __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ \\n _ body:series_of_statements _ \\n _ end","REBOL":"name:Identifier _ : __ func _ [ _ params:function_parameters _ ] _ [ _ body:series_of_statements _ ]","C#":"public __ static __ object __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","C++,D":"auto __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Java":"public __ static __ Object __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Ruby":"def __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","Perl":"sub __ name:Identifier _ { _ params:function_parameters _ body:series_of_statements _ }","Lua":"function __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","Octave":"function __ retval _ = _ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ endfunction","Prolog":"name:Identifier _ ( _ params:function_parameters _ ) __ :- __ body:series_of_statements _ .","Picat":"name:Identifier _ ( _ params:function_parameters _ ) _ = _ retval _ => _ body:series_of_statements _ .","Erlang":"name:Identifier _ ( _ params:function_parameters _ ) _ -> _ body:series_of_statements _ .","Haxe":"static __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Wolfram":"name:Identifier _ [ _ params:function_parameters _ ] _ := _ [ _ body:series_of_statements _ ]","Dart":"name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Haskell":"name:Identifier __ params:function_parameters _ = _ body:statement","Pydatalog":"name:Identifier _ [ _ params:function_parameters _ ] _ = _ body:series_of_statements","Emacs Lisp":"( _ defun __ name:Identifier __ ( _ params:function_parameters _ ) __ body:series_of_statements _ )"},"acos,a:expression":{"Java,JavaScript,Ruby,Haxe,TypeScript":"Math _ . _ acos _ ( _ a:expression _ )","C#,Visual Basic,Visual Basic .NET":"Math _ . _ Acos _ ( _ a:expression _ )","Python,Lua":"math _ . _ acos _ ( _ a:expression _ )","Perl,C,Fortran,D,PHP,Scala":"acos _ ( _ a:expression _ )","Gambas":"Acos _ ( _ a:expression _ )","C++":"std _ :: _ acos _ ( _ a:expression _ )","Erlang":"math _ : _ acos _ ( _ a:expression _ )","Wolfram":"ArcCos _ [ _ a:expression _ ]","Common Lisp,Racket":"( _ acos __ a:expression _ )","Clojure":"( _ Math/acos __ a:expression _ )"},"atan,a:expression":{"Java,JavaScript,Ruby,Haxe,TypeScript":"Math _ . _ atan _ ( _ a:expression _ )","Python,Lua":"math _ . _ atan _ ( _ a:expression _ )","Erlang":"math _ : _ atan _ ( _ a:expression _ )","Perl,C,Fortran,D,PHP,Scala":"atan _ ( _ a:expression _ )","C#,Visual Basic,Visual Basic .NET":"Math _ . _ Atan _ ( _ a:expression _ )","Gambas":"Atan _ ( _ a:expression _ )","C++":"std _ :: _ atan _ ( _ a:expression _ )","Wolfram":"ArcTan _ [ _ a:expression _ ]","Common Lisp,Racket":"( _ atan __ a:expression _ )","Clojure":"( _ Math/atan __ a:expression _ )"},"less_than,a:Add,b:Add":{"Pascal,Pydatalog,E,VBScript,LiveCode,Monkey X,Perl 6,EnglishScript,Cython,GAP,Mathematical notation,Wolfram,Chapel,Elixir,Katahdin,Frink,MiniZinc,Picat,Java,ECLiPSe,D,ooc,Genie,Janus,PL/I,IDP,Processing,Maxima,Seed7,Self,GNU Smalltalk,Drools,Standard ML,Oz,Cobra,Pike,EngScript,Kotlin,Pawn,FreeBASIC,MATLAB,Ada,FreeBASIC,Gosu,Gambas,Nimrod,AutoIt,ALGOL 68,Ceylon,Groovy,Rust,CoffeeScript,TypeScript,Fortran,Octave,ML,Hack,AutoHotKey,Scala,Delphi,Tcl,Swift,Vala,C,F#,C++,Dart,JavaScript,REBOL,Julia,Erlang,OCaml,crosslanguage,C#,Nemerle,AWK,Java,Lua,Perl,Haxe,Python,PHP,Haskell,Go,Ruby,R,bc,Visual Basic,Visual Basic .NET":"a:Add _ < _ b:Add","Prolog":"a:Add _ #< _ b:Add","Racket,Z3,CLIPS,GNU Smalltalk,newLisp,Hy,Common Lisp,Emacs Lisp,Clojure,Sibilant,LispyScript":"( _ < __ a:Factor __ b:Factor _ )","English":"a:Add __ is __ less __ than __ b:Add","Polish notation":"< __ a:Add __ b:Add","Reverse Polish notation":"a:Add __ b:Add __ <"},"less_than_or_equal,a:Add,b:Add":{"C,Pydatalog,VBScript,LiveCode,Monkey X,EnglishScript,GAP,Dafny,Janus,Perl 6,Wolfram,Chapel,Fortran,Elixir,Frink,Mathematical notation,MiniZinc,Picat,ooc,Genie,PL/I,IDP,Processing,EngScript,Maxima,GNU Smalltalk,Pyke,Self,Boo,Cobra,Standard ML,Prolog,Kotlin,Pawn,FreeBASIC,Ada,MATLAB,ALGOL 68,Gambas,Nimrod,Gosu,AutoIt,Ceylon,D,Groovy,Rust,CoffeeScript,TypeScript,Octave,Hack,AutoHotKey,Julia,Scala,Pascal,Delphi,Swift,Visual Basic,F#,Objective-C,Pike,Python,Cython,Oz,ML,Vala,Dart,C++,Java,OCaml,REBOL,C#,Nemerle,Ruby,PHP,Lua,Visual Basic .NET,Haskell,Haxe,Perl,JavaScript,R,AWK,crosslanguage,Go":"a:Add _ <= _ b:Add","Erlang":"a:Add _ =< _ b:Add","Racket,Z3,CLIPS,newLisp,Hy,Sibilant,LispyScript,Scheme,Clojure,Common Lisp,Emacs Lisp,crosslanguage":"( _ <= __ a:Factor __ b:Factor _ )","English":"a:Add __ is __ less __ than __ or __ equal __ to __ b:Add","Polish notation":"<= __ a:Add __ b:Add","Reverse Polish notation":"a:Add __ b:Add __ <="},"Multiply,a:Factor,b:Multiply,symbol:(\"*\"/\"/\")":{"C,Pydatalog,E,LiveCode,VBScript,Monkey X,Perl 6,EnglishScript,Cython,Agda,GAP,POP-11,Dafny,Wolfram,Chapel,Katahdin,Mathematical notation,Frink,MiniZinc,COBOL,ooc,Genie,B-Prolog,ECLiPSe,Elixir,nools,Pyke,Picat,PL/I,REXX,IDP,Falcon,Processing,Maxima,Sympy,Mercury,Self,GNU Smalltalk,Boo,Drools,Seed7,Occam,Standard ML,EngScript,Pike,Oz,Kotlin,Pawn,MATLAB,Ada,PowerShell,Gosu,AWK,Gambas,Nimrod,AutoHotKey,Julia,OpenOffice Basic,ALGOL 68,D,Groovy,Ceylon,Rust,CoffeeScript,ActionScript,TypeScript,Fortran,Octave,ML,Haxe,Pascal,Delphi,Swift,Nemerle,Vala,R,Red,C++,Erlang,Scala,AutoIt,Cobra,F#,Perl,PHP,Go,Ruby,Lua,Haskell,Hack,Java,OCaml,REBOL,Python,JavaScript,C#,Visual Basic,Visual Basic .NET,Dart":"a:Factor _ symbol:(\"*\"/\"/\") _ b:Multiply","Racket,Z3,crosslanguage,Common Lisp,CLIPS,newLisp,Hy,Scheme,Clojure,Common Lisp,Emacs Lisp,Sibilant,LispyScript":"( _ symbol:(\"*\"/\"/\") __ a:Factor __ b:Factor _ )","Prolog":"a:Factor _ symbol:\"#*\"/\"#/\" _ b:Multiply","Polish notation":"symbol:(\"*\"/\"/\") __ a:Factor __ b:Multiply","Reverse Polish notation":"a:Factor __ b:Multiply __ symbol:(\"*\"/\"/\")"},"Add,a:Multiply,b:Add,symbol:(\"+\"/\"-\")":{"Java,Pydatalog,E,LiveCode,VBScript,Monkey X,EnglishScript,GAP,POP-11,Dafny,Janus,Wolfram,Chapel,Bash,Perl 6,Mathematical notation,Katahdin,Frink,MiniZinc,Aldor,COBOL,ooc,Genie,ECLiPSe,nools,B-Prolog,Agda,Picat,PL/I,REXX,IDP,Falcon,Processing,Sympy,Maxima,Pyke,Elixir,GNU Smalltalk,Seed7,Standard ML,Occam,Boo,Drools,Icon,Mercury,EngScript,Pike,Oz,Kotlin,Pawn,FreeBASIC,Ada,PowerShell,Gosu,Nimrod,Cython,OpenOffice Basic,ALGOL 68,D,Ceylon,Rust,CoffeeScript,ActionScript,TypeScript,Fortran,Octave,ML,AutoHotKey,Delphi,Pascal,F#,Self,Swift,Nemerle,Dart,C,AutoIt,Cobra,Julia,Groovy,Scala,OCaml,Erlang,Gambas,Hack,C++,MATLAB,REBOL,Red,Lua,Go,AWK,Haskell,Perl,Python,JavaScript,C#,PHP,Ruby,R,Haxe,Visual Basic,Visual Basic .NET,Vala,bc":"a:Multiply _ symbol:(\"+\"/\"-\") _ b:Add","Prolog":"a:Multiply _ symbol:\"#+\"/\"#-\" _ b:Add","Racket,Z3,crosslanguage,Common Lisp,CLIPS,newLisp,Hy,Scheme,Clojure,Common Lisp,Emacs Lisp,Sibilant,LispyScript":"( _ symbol:(\"+\"/\"-\") __ a:Factor __ b:Factor _ )","Polish notation":"symbol:(\"+\"/\"-\") __ a:Multiply __ b:Add","Reverse Polish notation":"a:Multiply __ b:Add __ symbol:(\"+\"/\"-\")"},"greater_than_or_equal,a:Add,b:Add":{"C,Pydatalog,VBScript,LiveCode,Monkey X,EnglishScript,GAP,Dafny,Perl 6,Wolfram,Chapel,Frink,Mathematical notation,MiniZinc,Picat,ooc,Genie,PL/I,IDP,Processing,EngScript,Maxima,GNU Smalltalk,Pyke,Self,Boo,Cobra,Standard ML,Prolog,Kotlin,Pawn,FreeBASIC,Ada,MATLAB,ALGOL 68,Gambas,Nimrod,Gosu,AutoIt,Ceylon,D,Groovy,Rust,CoffeeScript,TypeScript,Octave,Hack,AutoHotKey,Julia,Scala,Pascal,Delphi,Swift,Visual Basic,F#,Objective-C,Pike,Python,Cython,Oz,ML,Vala,Dart,C++,Java,OCaml,REBOL,Erlang,C#,Nemerle,Ruby,PHP,Lua,Visual Basic .NET,Haskell,Haxe,Perl,JavaScript,R,AWK,crosslanguage,Go,Janus":"a:Add _ >= _ b:Add","Fortran":"a:Add __ .GE. __ b:Add","Racket,Z3,crosslanguage,Common Lisp,CLIPS,newLisp,Hy,Scheme,Clojure,Common Lisp,Emacs Lisp,Sibilant,LispyScript":"( _ >= __ a:Factor __ b:Factor _ )","Polish notation":">= __ a:Add __ b:Add","Reverse Polish notation":"a:Add __ b:Add __ >="},"function_call_parameters,var1:(function_call_named_parameter/expression),var2:function_call_parameters":{"JavaScript,Wolfram,D,Frink,Delphi,EngScript,Chapel,Perl,Swift,Perl 6,OCaml,Janus,Mathematical notation,Pascal,Rust,Picat,AutoHotKey,Maxima,Octave,Julia,R,Prolog,Fortran,Go,MiniZinc,Erlang,CoffeeScript,PHP,Hack,Java,C#,C,C++,Lua,TypeScript,Dart,Ruby,Python,Haxe,Scala,Visual Basic,Visual Basic .NET':":"var1:(function_call_named_parameter/expression) _ , _ var2:function_call_parameters","Hy,crosslanguage,Coq,Scheme,Racket,Common Lisp,CLIPS,REBOL,Haskell,Racket,Clojure,Z3":"function_call_parameters _ = _ var1:(function_call_named_parameter/expression) __ var2:function_call_parameters"},"greater_than,a:Add,b:Add":{"Pascal,Pydatalog,E,VBScript,LiveCode,Monkey X,Perl 6,EnglishScript,Cython,GAP,Mathematical notation,Wolfram,Chapel,Katahdin,Frink,MiniZinc,Picat,Java,ECLiPSe,D,ooc,Genie,Janus,PL/I,IDP,Processing,Maxima,Seed7,Self,GNU Smalltalk,Drools,Standard ML,Oz,Cobra,Pike,Prolog,EngScript,Kotlin,Pawn,FreeBASIC,MATLAB,Ada,FreeBASIC,Gosu,Gambas,Nimrod,AutoIt,ALGOL 68,Ceylon,Groovy,Rust,CoffeeScript,TypeScript,Fortran,Octave,ML,Hack,AutoHotKey,Scala,Delphi,Tcl,Swift,Vala,C,F#,C++,Dart,JavaScript,REBOL,Julia,Erlang,OCaml,crosslanguage,C#,Nemerle,AWK,Java,Lua,Perl,Haxe,Python,PHP,Haskell,Go,Ruby,R,bc,Visual Basic,Visual Basic .NET":"a:Add _ > _ b:Add","Racket,Z3,CLIPS,GNU Smalltalk,newLisp,Hy,Common Lisp,Emacs Lisp,Clojure,Sibilant,LispyScript":"( _ > __ a:Factor __ b:Factor _ )","Polish notation":"> __ a:Add __ b:Add","Reverse Polish notation":"a:Add __ b:Add __ >"},"typeof,theObject:parentheses_expression":{"Python,Lua":"type _ ( _ theObject:parentheses_expression _ )","JavaScript":"typeof _ ( _ theObject:parentheses_expression _ )","Visual Basic .NET":"( _ TypeOf _ theObject:parentheses_expression _ )","crosslanguage":"( _ typeof __ theObject:parentheses_expression _ )","Go":"reflect _ . _ TypeOf _ ( _ theObject:parentheses_expression _ ) _ . _ Name _ ( _ )","Java":"theObject:parentheses_expression _ . _ getClass _ ( _ ) _ . _ getName _ ( _ )","Haxe":"Type _ . _ typeof _ ( _ theObject:parentheses_expression _ )","Ruby":"class _ ( _ theObject:parentheses_expression _ )","C#":"theObject:parentheses_expression _ . _ getType _ ( _ )","Perl":"ref _ ( _ theObject:parentheses_expression _ )","PHP":"getType _ ( _ theObject:parentheses_expression _ )","C++":"typeid _ ( _ theObject:parentheses_expression _ ) _ . _ name _ ( _ )"},"absolute_value,a:expression":{"Lua":"math _ . _ abs _ ( _ a:expression _ )","C,Octave,Picat,C++,Swift,Python,Fortran,PHP,Hack,Perl,Dart,Julia,Scala,LiveCode":"abs _ ( _ a:expression _ )","C#,Visual Basic,Visual Basic .NET":"Math _ . _ Abs _ ( _ a:expression _ )","Ruby":"a:parentheses_expression _ . _ abs","Java,JavaScript,Haxe,TypeScript":"Math _ . _ abs _ ( _ a:expression _ )","Wolfram":"Abs _ [ _ a:expression _ ]","REBOL":"absolute __ a:expression","Go":"math _ . _ Abs _ ( _ a:expression _ )","Z3":"( _ ite __ ( _ >= __ a:expression __ 0 _ ) __ a:expression __ ( _ - __ a:expression _ ) _ )","Common Lisp,Racket":"( _ abs __ a:expression _ )"},"natural_logarithm,a:expression":{"Python,Lua":"math _ . _ log _ ( _ a:expression _ )","JavaScript,Java,Ruby,Haxe,TypeScript":"Math _ . _ log _ ( _ a:expression _ )","C#,Visual Basic,Visual Basic .NET":"Math _ . _ Log _ ( _ a:expression _ )","C,Fortran,Perl,PHP,C++":"log _ ( _ a:expression _ )","Mathematical notation":"ln _ ( _ a:expression _ )"},"charAt,aString:expression,index:expression":{"Java,Haxe,Scala,JavaScript,TypeScript":"aString:parentheses_expression _ . _ charAt _ ( _ index:expression _ )","Z3":"( _ CharAt __ expression __ index:expression _ )","Python,C,PHP,C#,MiniZinc,C++,Ruby,Picat,Haskell,Dart":"aString:parentheses_expression _ [ _ index:expression _ ]","Lua":"aString:parentheses_expression _ : _ sub( _ index:parentheses_expression _ + _ 1 _ , _ index:parentheses_expression _ + _ 1 _ )","Octave":"aString:parentheses_expression _ ( _ index:expression _ )","Chapel":"aString:parentheses_expression _ . _ substring _ ( _ index:expression _ )","Visual Basic .NET":"aString:parentheses_expression _ . _ Chars _ ( _ index:expression _ )","Go":"string _ ( _ [ _ ] _ rune _ ( _ aString:expression _ ) _ [ _ index:expression _ ] _ )","Swift":"aString:parentheses_expression _ [ _ aString:parentheses_expression _ . _ startIndex _ . _ advancedBy _ ( _ index:expression _ ) _ ]","REBOL":"aString:parentheses_expression _ / _ index:Identifier","Perl":"substr _ ( _ aString:expression _ , _ index:expression _ - _ 1 _ , _ 1 _ )"},"import,a:Identifier":{"R":"source _ ( _ \\\" _ a:Identifier _ . _ r\\\" _ )","JavaScript":"import __ * __ as __ a:Identifier __ from __ ' _ a:Identifier _ ' _ ;","Clojure":"( _ import __ a:Identifier _ )","Monkey X":"Import __ a:Identifier","Fortran":"USE __ a:Identifier","Visual Basic .NET":"Imports __ a:Identifier","REBOL":"a:Identifier _ : __ load __ % _ a:Identifier _ .r","Prolog":":- _ consult( _ a:Identifier _ ) _ .","MiniZinc":"include __ ' _ a:Identifier _ .mzn' _ ;","PHP":"include __ ' _ a:Identifier _ .php' _ ;","C,C++":"#include __ \\\" _ a:Identifier _ .h\\\"","C#,Vala":"using __ a:Identifier _ ;","Julia":"using __ a:Identifier","Haskell,EngScript,Python,Scala,Go,Groovy,Picat,Elm,Swift,Monkey X":"import __ a:Identifier","Java,D,Haxe,Ceylon":"import __ a:Identifier _ ;","Dart":"import __ ' _ a:Identifier _ .dart' _ ;","Ruby,Lua":"require __ ' _ a:Identifier _ '","Perl,Perl 6,Chapel":"\\\"use _ a:Identifier _ ;\\\""},"array_contains,container:parentheses_expression,contained:parentheses_expression":{"Python,Julia,MiniZinc":"container:parentheses_expression __ in __ contained:parentheses_expression","Swift":"contains _ ( _ container:expression _ , _ contained:expression _ )","Lua":"container:parentheses_expression _ [ _ contained:expression _ ] _ ~= _ nil","REBOL":"not __ none? __ find __ container:parentheses_expression __ contained:parentheses_expression","JavaScript,CoffeeScript":"container:parentheses_expression _ . _ indexOf _ ( _ contained:expression _ ) _ !== _ -1","CoffeeScript":"container:parentheses_expression _ . _ indexOf _ ( _ contained:expression _ ) _ != _ -1","Ruby":"container:parentheses_expression _ . _ include? _ ( _ contained:expression _ )","Haxe":"Lambda _ . _ has _ ( _ container:expression _ , _ contained:expression _ )","PHP":"in_array _ ( _ container:expression _ , _ container:expression _ )","C#,Visual Basic .NET":"container:parentheses_expression _ . _ Contains _ ( _ contained:expression _ )","Java":"Arrays _ . _ asList _ ( _ container:expression _ ) _ . _ contains _ ( _ contained:expression _ )","Haskell":"( _ elem __ contained:parentheses_expression __ container:parentheses_expression _ )","C++":"( _ std _ :: _ find _ ( _ std::begin _ ( _ container:parentheses_expression _ ) _ , _ std _ :: _ end _ ( _ container:parentheses_expression _ ) _ , _ contained:parentheses_expression _ ) _ != _ std _ :: _ end _ ( _ container:parentheses_expression _ ) _ )"},"key_value_separator":{"Python,Picat,Go,Dart,Visual Basic .NET,D,C#,Frink,Swift,JavaScript,TypeScript,PHP,Perl,Lua,Ruby,Julia,Haxe,C++,Scala,Octave,Elixir,Wolfram":",","Java":";","REBOL":"__"},"dictionary,a:(key_value_list/key_value),input:type,output:type":{"Python,Dart,JavaScript,TypeScript,Lua,Ruby,Julia,C++,EngScript,Visual Basic .NET":"{ _ a:(key_value_list/key_value) _ }","Picat":"new_map _ ( _ [ _ a:(key_value_list/key_value) _ ] _ )","Go":"map _ [ _ input:type _ ] _ output:type _ { _ a:(key_value_list/key_value) _ }","Java":"new __ HashMap _ < _ input:type _ , _ output:type _ > _ ( _ ) _ { _ { _ a:(key_value_list/key_value) _ } _ }","C#":"new __ Dictionary _ < _ input:type _ , _ output:type _ > _ { _ a:(key_value_list/key_value) _ }","Perl":"( _ a:(key_value_list/key_value) _ )","PHP":"array _ ( _ a:(key_value_list/key_value) _ )","Haxe,Frink,Swift,Elixir,D,Wolfram":"[ _ a:(key_value_list/key_value) _ ]","Scala":"Map( _ a:(key_value_list/key_value) _ )","Octave":"struct _ ( _ a:(key_value_list/key_value) _ )","REBOL":"to-hash _ [ _ a:(key_value_list/key_value) _ ]"},"var_name,name:Identifier":{"PHP,Perl,Bash,Tcl,AutoIt,Perl 6,Puppet,Hack,AWK,PowerShell":"$ name:Identifier","EngScript,EnglishScript,VBScript,Polish notation,Reverse Polish notation,Wolfram,crosslanguage,Erlang,English,Mathematical notation,Pascal,Picat,Prolog,Katahdin,TypeScript,JavaScript,Frink,MiniZinc,Aldor,Flora-2,F-logic,D,Genie,ooc,Janus,Chapel,ABAP,COBOL,PicoLisp,REXX,PL/I,Falcon,IDP,Processing,Sympy,Maxima,Z3,Shen,Ceylon,nools,Pyke,Self,GNU Smalltalk,Elixir,LispyScript,Standard ML,Nimrod,Occam,Boo,Seed7,pyparsing,Agda,Icon,Octave,Cobra,Kotlin,C++,Drools,Oz,Pike,Delphi,Racket,ML,Java,Pawn,Fortran,Ada,FreeBASIC,MATLAB,newLisp,Hy,OCaml,Julia,AutoIt,C#,Gosu,AutoHotKey,Groovy,Rust,R,Swift,Vala,Go,Scala,Nemerle,Visual Basic,Visual Basic .NET,Clojure,Haxe,CoffeeScript,Dart,JavaScript,C#,Python,Ruby,Haskell,C,Lua,Gambas,Common Lisp,Scheme,REBOL,F#":"name:Identifier","CLIPS":"? name:Identifier"},"default_parameter,type:type,name:var_name,value:expression":{"Python,AutoHotKey,Julia,Nemerle,PHP":"name:var_name _ = _ value:expression","C#,D,Groovy,C++":"type:type __ name:var_name _ = _ value:expression","Dart":"[ _ type:type __ name:var_name _ = _ value:expression _ ]","Ruby":"name:var_name _ : _ value:expression","Scala,Swift,Python":"name:var_name _ : _ type:type _ = _ value:expression","Haxe":"? _ name:var_name _ = _ value:expression","Visual Basic .NET":"Optional __ name:var_name __ As __ type:type _ = _ value:expression"},"_initializer_list,var1:expression,var2:initializer_list_separator,var3:(_initializer_list/expression)":{"Lua,Octave,Picat,Julia,Polish notation,Reverse Polish notation,Visual Basic .NET,Dart,Java,Go,C++,JavaScript,C#,Perl,Fortran,C,PHP,Haskell,Haxe,Python,Ruby,TypeScript,MiniZinc,Prolog,REBOL,Swift":"var1:expression _ var2:initializer_list_separator _ var3:(_initializer_list/expression)"},"initialize_empty_var,type:type,name:var_name":{"Swift,Scala,TypeScript":"var __ name:var_name _ : _ type:type","Java,C#,C++,C,D,Janus,Fortran,Dart":"type:type __ name:var_name","JavaScript,Haxe":"var __ name:var_name","MiniZinc":"type:type _ : _ name:var_name","Pascal":"name:var_name _ : _ type:type","Go":"var __ name:var_name __ type:type","Z3":"( _ declare-const __ name:var_name __ type:type _ )","Lua,Julia":"local __ name:var_name","Visual Basic .NET":"Dim __ name:var_name __ As __ type:type","Perl":"my __ name:var_name"},"anonymous_function,params:function_parameters,b:series_of_statements,type:type":{"Matlab,Octave":"( _ @ _ ( _ params:function_parameters _ ) _ body _ )","Picat":"lambda _ ( _ [ _ params:function_parameters _ ] _ , _ body _ )","Visual Basic .NET":"Function _ ( _ params:function_parameters _ ) __ body __ End __ Function","Ruby":"Proc _ . _ new _ { _ | _ params:function_parameters _ | _ b:series_of_statements _ }","JavaScript,TypeScript,Haxe,R,PHP":"function _ ( _ params:function_parameters _ ) _ { _ b:series_of_statements _ }","Haskell":"( _ \\\\ _ params:function_parameters _ -> _ b:series_of_statements _ )","Frink":"{ _ | _ params:function_parameters _ | _ body _ }","Erlang":"fun _ ( _ params:function_parameters _ ) __ b:series_of_statements __ end","Lua,Julia":"function _ ( _ params:function_parameters _ ) __ b:series_of_statements __ end","Swift":"{ _ ( _ params:function_parameters _ ) _ -> _ type:type __ in __ b:series_of_statements _ }","Go":"func _ ( _ params:function_parameters _ ) _ type:type _ { _ b:series_of_statements _ }","Dart,Scala":"( _ ( _ params:function_parameters _ ) _ => _ b:series_of_statements _ )","C++":"[ _ = _ ] _ ( _ params:function_parameters _ ) _ -> _ type:type _ { _ b:series_of_statements _ }","Java":"( _ params:function_parameters _ ) _ -> _ { _ b:series_of_statements _ }","Haxe":"( _ name __ params:function_parameters _ -> _ b:series_of_statements _ )","Python":"( _ lambda __ params:function_parameters _ : _ b:series_of_statements _ )","Delphi":"function _ ( _ params:function_parameters _ ) _ begin __ b:series_of_statements __ end _ ;","D":"( _ params:function_parameters _ ) _ { _ body _ }","REBOL":"func __ [ _ params:function_parameters _ ] _ [ _ body _ ]","Rust":"fn _ ( _ params:function_parameters _ ) _ { _ b:series_of_statements _ }"},"function_parameters,a:function_parameter,b:function_parameter":{"Hy,F#,Polish notation,Reverse Polish notation,Z3,Scheme,Racket,Common Lisp,CLIPS,REBOL,Haskell,Racket,Clojure,Perl":"a:function_parameter __ b:function_parameter","JavaScript,Pydatalog,E,VBScript,Monkey X,LiveCode,Ceylon,Delphi,EnglishScript,Cython,Vala,Dafny,Wolfram,Gambas,D,Frink,Chapel,Swift,Perl 6,OCaml,Janus,Mathematical notation,Pascal,Rust,Picat,AutoHotKey,Maxima,Octave,Julia,R,Prolog,Fortran,Go,MiniZinc,Erlang,CoffeeScript,PHP,Hack,Java,C#,C,C++,Lua,TypeScript,Dart,Ruby,Python,Haxe,Scala,Visual Basic,Visual Basic .NET":"a:function_parameter _ , _ b:function_parameter"},"strlen,a:parentheses_expression":{"crosslanguage":"( _ strlen __ a:parentheses_expression __ b _ )","Python,Go,Erlang":"len _ ( _ a:parentheses_expression _ )","R":"nchar _ ( _ a:parentheses_expression _ )","Erlang":"string:len _ ( _ a:parentheses_expression _ )","Visual Basic,Visual Basic .NET,Gambas":"Len _ ( _ a:parentheses_expression _ )","JavaScript,TypeScript,Ruby,Scala,Gosu,Picat,Haxe,OCaml,D,Dart":"a:parentheses_expression _ . _ length","REBOL":"length? __ a:parentheses_expression","Java,C++,Kotlin":"a:parentheses_expression _ . _ length _ ( _ )","PHP,C,Pawn,Hack":"strlen _ ( _ a:parentheses_expression _ )","MiniZinc,Julia":"length _ ( _ a:parentheses_expression _ )","Haskell":"( _ length _ a:parentheses_expression _ )","C#":"a:parentheses_expression _ . _ Length","Swift":"countElements _ ( _ a:parentheses_expression _ )","AutoIt":"StringLen _ ( _ a:parentheses_expression _ )","Common Lisp":"( _ length __ a:parentheses_expression _ )","Racket,Scheme":"( _ string-length __ a:parentheses_expression _ )","Perl,Octave":"length _ ( _ a:parentheses_expression _ )","Nemerle":"a:parentheses_expression _ . _ Length","Fortran":"LEN _ ( _ a:parentheses_expression _ )","Lua":"string _ . _ len _ ( _ a:parentheses_expression _ )","Wolfram":"StringLength _ [ _ a:parentheses_expression _ ]","Z3":"( _ Length __ a:parentheses_expression _ )"},"not_equal,a:parentheses_expression,b:parentheses_expression":{"Clojure":"( _ not= __ a:parentheses_expression __ b:parentheses_expression _ )","Maxima":"a:parentheses_expression __ not __ = __ b:parentheses_expression","Lua":"a:parentheses_expression _ ~= _ b:parentheses_expression","JavaScript,PHP,TypeScript":"a:parentheses_expression _ !== _ b:parentheses_expression","Java,Octave,R,Picat,EnglishScript,Perl 6,Wolfram,C,C++,D,C#,Julia,Perl,Ruby,Haxe,Python,Cython,MiniZinc,Scala,Swift,Go,Rust,Vala":"a:parentheses_expression _ != _ b:parentheses_expression","English":"a:parentheses_expression __ does __ not __ equal __ b:parentheses_expression","Prolog":"not _ ( _ a:parentheses_expression _ == _ b:parentheses_expression _ )","Common Lisp":"( _ not _ ( _ = __ a:parentheses_expression __ b:parentheses_expression _ ) _ )","Mathematical notation":"a:parentheses_expression _ != _  _ b:parentheses_expression","Janus":"a:parentheses_expression _ # _ b:parentheses_expression","Fortran":"a:parentheses_expression _ .NE. _ b:parentheses_expression","Z3":"( _ not _ ( _ = __ a:parentheses_expression __ b:parentheses_expression _ ) _ )","REBOL,Visual Basic .NET,Visual Basic,GAP,OCaml,LiveCode,Monkey X,VBScript,Delphi":"a:parentheses_expression _ <> _ b:parentheses_expression","Erlang,Haskell":"a:parentheses_expression _ /= _ b:parentheses_expression"},"not,a:parentheses_expression":{"Python,Cython,Mathematical notation,Emacs Lisp,MiniZinc,Picat,Genie,Seed7,Z3,IDP,Maxima,CLIPS,EngScript,Hy,OCaml,Clojure,Erlang,Pascal,Delphi,F#,ML,Lua,Racket,Common Lisp,crosslanguage,REBOL,Haskell,Sibilant":"( _ not __ a:expression _ )","Java,Perl 6,Katahdin,CoffeeScript,Frink,D,ooc,Ceylon,Processing,Janus,Pawn,AutoHotKey,Groovy,Scala,Hack,Rust,Octave,TypeScript,Julia,AWK,Swift,Scala,Vala,Nemerle,Pike,Perl,C,C++,Objective-C,Tcl,JavaScript,R,Dart,Java,Go,Ruby,PHP,Haxe,C#,Wolfram":"! a:parentheses_expression","Prolog":"\\\\+ a:parentheses_expression","Visual Basic,Visual Basic .NET,AutoIt,LiveCode,Monkey X,VBScript":"( _ Not _ a:parentheses_expression _ )","Fortran":".NOT. a:parentheses_expression","Gambas":"NOT a:parentheses_expression","Rexx":"\\\\ a:parentheses_expression","PL/I":"^ a:parentheses_expression","PowerShell":"-not a:parentheses_expression","Polish notation":"not __ a:parentheses_expression __ b","Reverse Polish notation":"a:parentheses_expression __ not"},"async_function,name:var_name,params:function_parameters,type:type,body:series_of_statements":{"C#":"async __ type:type __ name:var_name _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","JavaScript,Hack":"async __ function __ name:var_name _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Visual Basic .NET":"Async __ Function __ name:var_name _ ( _ params:function_parameters _ ) _ As __ return_type"},"varargs,name:Identifier,type:type":{"Java":"type:type _ ... __ name:Identifier","PHP":" _ type:type _ ... __ $ _ name:Identifier","C#":"params __ type:type __ name:Identifier","Perl 6":"*@ name:Identifier","Ruby":"* name:Identifier","Scala":"name:Identifier _ : _ type:type _ *","Go":"name:Identifier _ ... _ type:type"},"key_value_list,var1:key_value,var2:key_value_separator,var3:(key_value_list/key_value)":{"Lua,Octave,Picat,Julia,JavaScript,Dart,Java,C#,C++,Ruby,PHP,Python,Perl,Haxe,TypeScript,Visual Basic .NET,Scala,Swift,REBOL,Go":"var1:key_value _ var2:key_value_separator _ var3:(key_value_list/key_value)"},"grammar_Or,var1:grammar_concatenate_string,var2:grammar_Or":{"Marpa,EBNF,Nearley,Parslet,Yacc,Perl 6,REBOL":"var1:grammar_concatenate_string _ | _ var2:grammar_Or","LPEG":"var1:grammar_concatenate_string _ + _ var2:grammar_Or","PEG.js":"var1:grammar_concatenate_string _ / _ var2:grammar_Or"},"Or,var1:greater_than,var2:Or":{"JavaScript,Perl 6,Wolfram,Chapel,Elixir,Frink,ooc,Picat,Janus,Processing,Pike,nools,Pawn,MATLAB,Hack,Gosu,Rust,AutoIt,AutoHotKey,TypeScript,Ceylon,Groovy,D,Octave,AWK,Julia,Scala,F#,Swift,Nemerle,Vala,Go,Perl,Java,Haskell,Haxe,C,C++,C#,Dart,R":"var1:greater_than _ || _ var2:Or","Python,Pydatalog,LiveCode,EnglishScript,Cython,GAP,Mathematical notation,Genie,IDP,Maxima,EngScript,Ada,newLisp,OCaml,Nimrod,CoffeeScript,Pascal,Delphi,Erlang,REBOL,Lua,PHP,crosslanguage,Ruby":"var1:greater_than __ or __ var2:Or","Fortran":"var1:greater_than __ .OR. __ var2:Or","Z3,CLIPS,CLojure,Common Lisp,Emacs Lisp,Clojure,Racket":"( _ or __ var1:Factor __ var2:Factor _ )","Prolog":"var1:greater_than _ ; _ var2:Or","MiniZinc":"var1:greater_than _ \\\\/ _ var2:Or","Visual Basic,Visual Basic .NET,Monkey X":"var1:greater_than __ Or __ var2:Or","Polish notation":"or __ a __ b","Reverse Polish notation":"a __ b __ or"},"And,a:Or,b:And":{"JavaScript,Perl 6,Wolfram,Chapel,Elixir,Frink,ooc,Picat,Janus,Processing,Pike,nools,Pawn,MATLAB,Hack,Gosu,Rust,AutoIt,AutoHotKey,TypeScript,Ceylon,Groovy,D,Octave,AWK,Julia,Scala,F#,Swift,Nemerle,Vala,Go,Perl,Java,Haskell,Haxe,C,C++,C#,Dart,R":"a:Or _ && _ b:And","Pydatalog":"a:Or _ & _ b:And","Python,LiveCode,EnglishScript,Cython,GAP,Mathematical notation,Genie,IDP,Maxima,EngScript,Ada,newLisp,OCaml,Nimrod,CoffeeScript,Pascal,Delphi,Erlang,REBOL,Lua,PHP,crosslanguage,Ruby":"a:Or __ and __ b:And","MiniZinc":"a:Or _ /\\\\ _ b:And","Fortran":"a:Or _ .AND. _ b:And","Common Lisp,Z3,newLisp,Racket,Clojure,Sibilant,Hy,CLIPS,Emacs Lisp":"( _ and __ a:Factor __ b:Factor _ )","Prolog":"a:Or _ , _ b:And","Visual Basic,Visual Basic .NET,VBScript,OpenOffice Basic,Monkey X":"a:Or __ And __ b:And","Polish notation":"and __ a:Or __ b:And","Reverse Polish notation":"a:Or __ b:And __ and"},"this,a:Identifier":{"Ruby,CoffeeScript":"@ a:Identifier","Java,EngScript,Dart,Groovy,TypeScript,JavaScript,C#,C++,Haxe,Chapel,Julia":"this _ . _ a:Identifier","Python":"self _ . _ a:Identifier","PHP,Hack":"$ _ this _ -> _ a:Identifier","Swift,Scala":"a:Identifier","REBOL":"self _ / _ a:Identifier","Visual Basic .NET":"Me _ . _ a:Identifier","Perl":"$self _ -> _ a:Identifier"},"array_length,a:parentheses_expression":{"crosslanguage":"( _ array_length __ a:parentheses_expression _ )","Lua":"# a:parentheses_expression","Python,Cython,Go":"len _ ( _ a:parentheses_expression _ )","Java,Picat,Scala,D,CoffeeScript,TypeScript,Dart,Vala,JavaScript,Ruby,Haxe,Cobra":"a:parentheses_expression _ . _ length","C#,Visual Basic,Visual Basic .NET,PowerShell":"a:parentheses_expression _ . _ Length","MiniZinc,Julia,R":"length _ ( _ a:parentheses_expression _ )","Common Lisp":"( _ list-length __ a:parentheses_expression _ )","PHP":"count _ ( _ a:parentheses_expression _ )","Rust":"a:parentheses_expression _ . _ len _ ( _ )","Emacs Lisp,Scheme,Racket,Haskell":"( _ length __ a:parentheses_expression _ )","C++,Groovy":"a:parentheses_expression _ . _ size _ ( _ )","C":"sizeof _ ( _ a:parentheses_expression _ ) _ / _ sizeof _ ( _ a:parentheses_expression _ [ _ 0 _ ] _ )","Perl":"scalar _ ( _ a:parentheses_expression _ )","REBOL":"length? __ a:parentheses_expression","Swift":"a:parentheses_expression _ . _ count","Clojure":"( _ count __ array _ )","Hy":"( _ len __ a:parentheses_expression _ )","Octave":"length _ ( _ a:parentheses_expression _ )","Fortran,Janus":"size _ ( _ a:parentheses_expression _ )","Wolfram":"Length _ [ _ a:parentheses_expression _ ]"},"initializer_list_separator":{"Python,Polish notation,Reverse Polish notation,D,Frink,Fortran,Chapel,Octave,Julia,English,Pascal,Delphi,Prolog,MiniZinc,EngScript,Cython,Groovy,Dart,TypeScript,CoffeeScript,Nemerle,JavaScript,Haxe,Haskell,Ruby,REBOL,Polish notation,Swift,Java,Picat,C#,Go,Lua,C++,C,Visual Basic .NET,Visual Basic,PHP,Scala,Perl,Wolfram":",","REBOL":"__"},"initializer_list,a:(_initializer_list/expression)":{"Java,Picat,C#,Go,Lua,C++,C,Visual Basic .NET,Visual Basic,Wolfram":"{ _ a:(_initializer_list/expression) _ }","Python,D,Frink,REBOL,Octave,Julia,Prolog,MiniZinc,EngScript,Cython,Groovy,Dart,TypeScript,CoffeeScript,Nemerle,JavaScript,Haxe,Haskell,Ruby,REBOL,Polish notation,Swift":"[ _ a:(_initializer_list/expression) _ ]","PHP":"array _ ( _ a:(_initializer_list/expression) _ )","Scala":"Array _ ( _ a:(_initializer_list/expression) _ )","Perl,Chapel":"( _ a:(_initializer_list/expression) _ )","Fortran":"(/ _ a:(_initializer_list/expression) _ /)"},"key_value,a:Identifier,b:expression":{"Groovy,D,Dart,JavaScript,TypeScript,CoffeeScript,Swift,Elixir,Swift,Go":"a:Identifier _ : _ b:expression","Python":"' _ a:Identifier _ ' _ : _ b:expression","Ruby,PHP,Haxe,Perl,Julia":"a:Identifier _ => _ b:expression","REBOL":"a:Identifier __ b:expression","Lua,Picat":"a:Identifier _ = _ b:expression","C++,C#,Visual Basic .NET":"{ _ a:Identifier _ , _ b:expression _ }","Scala,Wolfram":"a:Identifier _ -> _ b:expression","Octave":"a:Identifier _ , _ b:expression","Frink":"[ _ a:Identifier _ , _ b:expression _ ]","Java":"put _ ( _ a:Identifier _ , _ b:expression _ )"},"strcmp,a:parentheses_expression,b:parentheses_expression":{"R":"identical _ ( _ a:parentheses_expression _ , _ b:parentheses_expression _ )","Emacs Lisp":"( _ string= __ a:parentheses_expression __ b:parentheses_expression _ )","Clojure":"( _ = __ a:parentheses_expression __ b:parentheses_expression _ )","Visual Basic,Delphi,Visual Basic .NET,VBScript,F#,Prolog,Mathematical notation,OCaml,LiveCode,Monkey X":"a:parentheses_expression _ = _ b:parentheses_expression","Python,Pydatalog,Perl 6,EnglishScript,Chapel,Julia,Fortran,MiniZinc,Picat,Go,Vala,AutoIt,REBOL,Ceylon,Groovy,Scala,CoffeeScript,AWK,Ruby,Haskell,Haxe,Dart,Lua,Swift":"a:parentheses_expression _ == _ b:parentheses_expression","JavaScript,PHP,TypeScript,Hack":"a:parentheses_expression _ === _ b:parentheses_expression","C,Octave":"strcmp _ ( _ a:parentheses_expression _ , _ b:parentheses_expression _ ) _ == _ 0","C++":"a:parentheses_expression _ . _ compare _ ( _ b:parentheses_expression _ )","C#":"a:parentheses_expression _ . _ Equals _ ( _ b:parentheses_expression _ )","Java":"a:parentheses_expression _ . _ equals _ ( _ b:parentheses_expression _ )","Common Lisp":"( _ equal __ a:parentheses_expression __ b:parentheses_expression _ )","CLIPS":"( _ str-compare __ a:parentheses_expression __ b:parentheses_expression _ )","Hy":"( _ = __ a:parentheses_expression __ b:parentheses_expression _ )","Perl":"a:parentheses_expression __ eq __ b:parentheses_expression","Erlang":"string _ : _ equal _ ( _ a:parentheses_expression _ , _ b:parentheses_expression _ )","Polish notation":"= __ a:parentheses_expression __ b:parentheses_expression","Reverse Polish notation":"a:parentheses_expression __ b:parentheses_expression __ ="},"sqrt,x:expression":{"LiveCode":"(the __ sqrt __ of __ x:expression _ )","Java,JavaScript,TypeScript,Ruby,Haxe":"Math _ . _ sqrt _ ( _ x:expression _ )","C#,Visual Basic .NET":"Math _ . _ Sqrt _ ( _ x:expression _ )","C,Julia,Perl,PHP,Perl 6,Maxima,MiniZinc,Prolog,Octave,D,Haskell,Swift,Mathematical notation,Dart,Picat":"sqrt _ ( _ x:expression _ )","Lua,Python":"math _ . _ sqrt _ ( _ x:expression _ )","REBOL":"square-root __ x:expression","Scala":"scala _ . _ math _ . _ sqrt _ ( _ x:expression _ )","C++":"std _ :: _ sqrt _ ( _ x:expression _ )","Erlang":"math _ : _ sqrt _ ( _ x:expression _ )","Wolfram":"Sqrt _ [ _ x:expression _ ]","Common Lisp,Racket":"( _ sqrt __ x:expression _ )","Fortran":"SQRT _ ( _ x:expression _ )","Go":"math _ . _ Sqrt _ ( _ x:expression _ )"},"grammar_parentheses_expression,a:grammar_Or":{"Marpa,Wirth syntax notation,Yacc,LPeg,Parslet,PEG.js,EBNF,Nearley,Prolog,Perl 6":"( _ a:grammar_Or _ )","REBOL":"[ _ a:grammar_Or _ ]"},"parentheses_expression,a:expression":{"Pydatalog,Pascal,VBScript,Monkey X,LiveCode,Perl 6,EnglishScript,Wolfram,Cython,Mathematical notation,Katahdin,Frink,MiniZinc,Picat,Java,ECLiPSe,D,ooc,Genie,Janus,PL/I,IDP,Processing,Maxima,Seed7,Self,GNU Smalltalk,Drools,Standard ML,Oz,Cobra,Pike,Prolog,EngScript,Kotlin,Pawn,FreeBASIC,MATLAB,Ada,FreeBASIC,Gosu,Gambas,Nimrod,AutoIt,ALGOL 68,Ceylon,Groovy,Rust,CoffeeScript,TypeScript,Fortran,Octave,ML,Hack,AutoHotKey,Scala,Delphi,Tcl,Swift,Vala,C,F#,C++,Dart,JavaScript,REBOL,Julia,Erlang,OCaml,crosslanguage,C#,Nemerle,AWK,Java,Lua,Perl,Haxe,Python,PHP,Haskell,Go,Ruby,R,bc,Visual Basic,Visual Basic .NET":"( _ a:expression _ )","Racket,Polish notation,Reverse Polish notation,Z3,CLIPS,GNU Smalltalk,newLisp,Hy,Common Lisp,Emacs Lisp,Clojure,Sibilant,LispyScript":"a:expression"},"join,array:parentheses_expression,separator:parentheses_expression":{"Swift":"array:parentheses_expression _ . _ joinWithSeparator _ ( _ separator:parentheses_expression _ )","C#":"String _ . _ Join _ ( _ separator:parentheses_expression _ , _ array:parentheses_expression _ )","PHP":"implode _ ( _ separator:parentheses_expression _ , _ array:parentheses_expression _ )","Perl":"join _ ( _ separator:parentheses_expression _ , _ array:parentheses_expression _ )","D,Julia":"join _ ( _ array:parentheses_expression _ , _ separator:parentheses_expression _ )","Lua":"table _ . _ concat _ ( _ array:parentheses_expression _ , _ separator:parentheses_expression _ )","Go":"Strings _ . _ join _ ( _ array:parentheses_expression _ , _ separator:parentheses_expression _ )","JavaScript,Haxe,CoffeeScript,Ruby,Groovy,Java,TypeScript,Rust,Dart":"array:parentheses_expression _ . _ join _ ( _ separator:parentheses_expression _ )","Python":"separator:parentheses_expression _ . _ join _ ( _ array:parentheses_expression _ )","Scala":"array:parentheses_expression _ . _ mkString _ ( _ separator:parentheses_expression _ )","Visual Basic .NET":"Join _ ( _ array, _ separator:parentheses_expression _ )"},"plus_equals,a:(access_array/dot_notation/Identifier),b:expression":{"Janus,Perl 6,Dart,Visual Basic .NET,TypeScript,Python,Lua,Java,C,C++,C#,JavaScript,Haxe,PHP,Chapel,Perl,Julia,Scala,Rust,Go,Swift":"a:(access_array/dot_notation/Identifier) _ += _ b:expression","Ruby,Haskell,Fortran,OCaml,MiniZinc,Octave,Delphi":"a:(access_array/dot_notation/Identifier) _ = _ a:(access_array/dot_notation/Identifier) _ + _ b:expression","Picat":"a:(access_array/dot_notation/Identifier) _ := _ a:(access_array/dot_notation/Identifier) _ + _ b:expression","REBOL":"a:(access_array/dot_notation/Identifier) _ : _ a:(access_array/dot_notation/Identifier) _ + _ b:expression","LiveCode":"add __ b:expression __ to __ a:(access_array/dot_notation/Identifier)"},"minus_equals,a:(dot_notation/access_array/Identifier),b:expression":{"Janus,Perl 6,Dart,Perl,Visual Basic .NET,TypeScript,Python,Lua,Java,C,C++,C#,JavaScript,PHP,Haxe,Hack,Julia,Scala,Rust,Go,Swift":"a:(dot_notation/access_array/Identifier) _ -= _ b:expression","Ruby,Haskell,Fortran,OCaml,MiniZinc,Octave,Delphi":"a:(dot_notation/access_array/Identifier) _ = _ a:(dot_notation/access_array/Identifier) _ - _ b:expression","Picat":"a:(dot_notation/access_array/Identifier) _ := _ a:(dot_notation/access_array/Identifier) _ + _ b:expression","REBOL,Picat":"a:(dot_notation/access_array/Identifier) _ : _ a:(dot_notation/access_array/Identifier) _ - _ b:expression","LiveCode":"subtract __ b:expression __ from __ a:(dot_notation/access_array/Identifier)"},"grammar_concatenate_string,a:Factor,b:grammar_concatenate_string":{"EBNF,Prolog":"a:Factor _ , _ b:grammar_concatenate_string","LPEG":"a:Factor _ * _ b:grammar_concatenate_string","PEG.js,Marpa,nearley,Yacc,Wirth syntax notation,Perl 6,REBOL":"a:Factor __ b:grammar_concatenate_string","Parslet":"a:Factor _ >> _ b:grammar_concatenate_string"},"concatenate_string,a:Multiply,b:concatenate_string":{"R":"paste0 _ ( _ a:Multiply _ , _ b:concatenate_string _ )","Maxima":"sconcat _ ( _ a:Multiply _ , _ b:concatenate_string _ )","Common Lisp":"( _ concatenate __ 'string __ a:Multiply __ b:concatenate_string _ )","C,Monkey X,EnglishScript,Mathematical notation,Go,Java,Chapel,Frink,FreeBASIC,Nemerle,D,Cython,Ceylon,CoffeeScript,TypeScript,Dart,Gosu,Groovy,Scala,Swift,F#,Python,JavaScript,C#,Haxe,Ruby,C++,Vala":"a:Multiply _ + _ b:concatenate_string","Lua,EngScript":"a:Multiply _ .. _ b:concatenate_string","Fortran":"a:Multiply _ // _ b:concatenate_string","PHP,AutoHotKey,Hack,Perl":"a:Multiply _ . _ b:concatenate_string","OCaml":"a:Multiply _ ^ _ b:concatenate_string","REBOL":"append __ a:Multiply __ b:concatenate_string","Haskell,MiniZinc,Picat,Elm":"a:Multiply _ ++ _ b:concatenate_string","CLIPS":"( _ str-cat _ a:Multiply _ b:concatenate_string _ )","Clojure":"( _ str _ a:Multiply _ b:concatenate_string _ )","Erlang":"string _ : _ concat _ ( _ a:Multiply _ , _ b:concatenate_string _ )","Julia":"string _ ( _ a:Multiply _ , _ b:concatenate_string _ )","Octave":"strcat _ ( _ a:Multiply _ , _ b:concatenate_string _ )","Racket":"( _ string-append _ a:Multiply _ b:concatenate_string _ )","Delphi":"Concat _ ( _ a:Multiply _ , _ b:concatenate_string _ )","Visual Basic,Gambas,Nimrod,AutoIt,Visual Basic .NET,OpenOffice Basic,LiveCode,VBScript":"a:Multiply _ & _ b:concatenate_string","Elixir,Wolfram":"a:Multiply _ <> _ b:concatenate_string","Perl 6":"a:Multiply _ ~ _ b:concatenate_string","Z3":"( _ Concat __ a:Multiply __ b:concatenate_string _ )","Emacs Lisp":"( _ concat __ a:Multiply __ b:concatenate_string _ )","Polish notation":"+ __ a:Multiply __ b:concatenate_string","Reverse Polish notation":"a:Multiply __ b:concatenate_string __ +"},"range,a:expression,b:expression":{"Swift,Perl,Picat,Ruby,MiniZinc,Chapel":"a:expression _ .. _ b:expression","Python":"range _ ( _ a:expression _ , _ b:expression _ - _ 1 _ )","Octave,Julia,R":"a:expression _ : _ b:expression","Haxe":"a:expression _ ... _ ( _ b:expression _ - _ 1 _ )"},"split,aString:parentheses_expression,separator:parentheses_expression":{"Swift":"aString:parentheses_expression _ . _ componentsSeparatedByString _ ( _ separator:expression _ )","Octave":"strsplit _ ( _ aString:expression _ , _ separator:expression _ )","Go":"strings _ . _ Split _ ( _ aString:expression _ , _ separator:expression _ )","JavaScript,CoffeeScript,Java,Python,Dart,Scala,Groovy,Haxe,Ruby,Rust,TypeScript,Cython":"aString:parentheses_expression _ . _ split _ ( _ separator:expression _ )","Lua":"string _ . _ gmatch _ ( _ aString:expression _ , _ separator:expression _ )","PHP":"explode _ ( _ separator:expression _ , _ aString:expression _ )","Perl,Processing":"split _ ( _ separator:expression _ , _ aString:expression _ )","REBOL":"split __ aString:parentheses_expression __ separator:parentheses_expression","C#":"aString:parentheses_expression _ . _ Split _ ( _ new _ string[] _ { _ separator:expression _ } _ , _ StringSplitOptions _ . _ None _ )","Picat,D,Julia":"split _ ( _ aString:expression _ , _ separator:expression _ )","Haskell":"( _ splitOn __ aString:parentheses_expression __ separator:parentheses_expression _ )","Wolfram":"StringSplit _ [ _ aString:expression _ , _ separator:expression _ ]","Visual Basic .NET":"Split _ ( _ aString:expression _ , _ separator:expression _ )"},"pow,a:expression,b:expression":{"Lua":"math _ . _ pow _ ( _ a:expression _ , _ b:expression _ )","Scala":"scala.math.pow _ ( _ a:expression _ , _ b:expression _ )","C#,Visual Basic .NET":"Math _ . _ Pow _ ( _ a:expression _ , _ b:expression _ )","JavaScript,Java,TypeScript,Haxe":"Math _ . _ pow _ ( _ a:expression _ , _ b:expression _ )","Python,Cython,Chapel,Haskell,COBOL,Picat,ooc,PL/I,REXX,Maxima,AWK,R,F#,AutoHotKey,Tcl,AutoIt,Groovy,Octave,Ruby,Perl,Fortran":"( _ a:expression _ ** _ b:expression _ )","REBOL":"power __ a:expression __ b:expression","C,C++,PHP,Hack,Swift,MiniZinc,Dart,D":"pow _ ( _ a:expression _ , _ b:expression _ )","Julia,EngScript,Visual Basic,Visual Basic .NET,Gambas,Go,Ceylon,Wolfram,Mathematical notation":"a:parentheses_expression _ ^ _ b:parentheses_expression","Rust":"num::pow _ ( _ a:expression _ , _ b:expression _ )","Hy,Common Lisp,Racket,Clojure":"( _ expt __ num1 __ num2 _ )","Erlang":"math _ : _ pow _ ( _ a:expression _ , _ b:expression _ )"},"case_statements,a:case,b:case_statements":{"Java,Octave,OCaml,C,C#,C++,JavaScript,PHP,Haxe,Fortran,Ruby,Dart,TypeScript,Scala,Haskell,Visual Basic .NET,Swift,REBOL":"a:case __ b:case_statements","Erlang":"a:case _ ; _ b:case_statements"},"substring,a:parentheses_expression,b:expression,c:expression":{"JavaScript,CoffeeScript,TypeScript,Java,Scala,Dart":"a:parentheses_expression _ . _ substring _ ( _ b:expression _ , _ c:expression _ )","C++":"a:parentheses_expression _ . _ substring _ ( _ b:expression _ , _ c:expression _ - _ b:expression _ )","Z3":"( _ Substring __ a:parentheses_expression __ b:expression __ c:expression _ )","Python,Cython,Icon,Go":"a:parentheses_expression _ [ _ b:expression _ : _ c:expression _ ]","Julia:":"a:parentheses_expression _ [ _ b:expression _ - _ 1 _ : _ c:expression _ ]","Fortran":"a:parentheses_expression _ ( _ b:expression _ : _ c:expression _ )","C#,Visual Basic .NET,Nemerle":"a:parentheses_expression _ . _ Substring _ ( _ b:expression _ , _ c:expression _ )","Haskell":"take _ ( _ c:expression _ - _ b:expression _ ) _ . _ drop _ b:expression _ $ _ a:parentheses_expression","PHP,AWK,Perl,Hack":"substr _ ( _ a:parentheses_expression _ , _ b:expression _ , _ c:expression _ )","Haxe":"a:parentheses_expression _ . _ substr _ ( _ b:expression _ , _ c:expression _ )","REBOL":"copy/part __ skip __ a:parentheses_expression __ b:expression __ c:expression","Clojure":"( _ subs __ a:parentheses_expression __ b:expression __ c:expression _ )","Erlang":"string _ : _ sub_string _ ( _ a:parentheses_expression _ , _ b:expression _ , _ c:expression _ )","Ruby,Pike,Groovy":"a:parentheses_expression _ [ _ b:expression _ .. _ c:expression _ ]","Racket":"( _ substring __ a:parentheses_expression __ b:expression __ c:expression _ )","Common Lisp":"( _ subseq __ a:parentheses_expression __ b:expression __ c:expression _ )","Lua":"string _ . _ sub _ ( _ a:parentheses_expression _ , _ start _ , _ end _ )"},"mod,a:parentheses_expression,b:parentheses_expression":{"Java,Perl 6,Cython,Rust,TypeScript,Frink,ooc,Genie,Pike,Ceylon,Pawn,PowerShell,CoffeeScript,Gosu,Groovy,EngScript,AWK,Julia,Scala,F#,Swift,R,Perl,Nemerle,Haxe,PHP,Hack,Vala,Lua,Tcl,Go,Dart,JavaScript,Python,C,C++,C#,Ruby":"a:parentheses_expression _ % _ b:parentheses_expression","REBOL":"mod __ a:parentheses_expression __ b:parentheses_expression","Haskell,MiniZinc,OCaml,Delphi,Pascal,Picat,LiveCode":"a:parentheses_expression __ mod __ b:parentheses_expression","Prolog,Octave,MATLAB,AutoHotKey,Fortran":"mod _ ( _ a:expression _ , _ b:expression _ )","Erlang":"a:parentheses_expression __ rem __ b:parentheses_expression","CLIPS,Clojure,Common Lisp,Z3":"( _ mod __ a:parentheses_expression __ b:parentheses_expression _ )","Visual Basic,Visual Basic .NET,Monkey X":"a:parentheses_expression __ Mod __ b:parentheses_expression","Wolfram":"Mod _ [ _ a:parentheses_expression _ , _ b:parentheses_expression _ ]"},"dot_notation,var_name:Identifier,var_name:dot_notation":{"Java,Octave,Scala,Julia,Python,JavaScript,TypeScript,Dart,D,Haxe,C#,Perl 6,Lua,C++,Visual Basic .NET,Ruby,Go,Swift":"var1 _ . _ var2","PHP,C,Perl":"var1 _ -> _ var2","REBOL":"var1 _ / _ var2","Fortran":"var1 _ % _ var2"},"sin,var1:expression":{"Java,JavaScript,TypeScript,Ruby,Haxe":"Math _ . _ sin _ ( _ var1:expression _ )","Lua,Python":"math _ . _ sin _ ( _ var1:expression _ )","C,Erlang,Picat,Mathematical notation,Julia,D,PHP,Perl,Perl 6,Maxima,Fortran,MiniZinc,Swift,Prolog,Octave,Dart,Haskell,C++,Scala":"sin _ ( _ var1:expression _ )","C#,Visual Basic .NET":"Math _ . _ Sin _ ( _ var1:expression _ )","Wolfram":"Sin _ [ _ var1:expression _ ]","REBOL":"sine/radians __ var1:expression","Go":"math _ . _ Sin _ ( _ var1:expression _ )","Common Lisp,Racket":"( _ sin __ a _ )","Clojure":"( _ Math/sin __ a _ )"},"cos,var1:expression":{"Java,JavaScript,TypeScript,Ruby,Haxe":"Math _ . _ cos _ ( _ var1:expression _ )","Lua,Python":"math _ . _ cos _ ( _ var1:expression _ )","C,Erlang,Picat,Mathematical notation,Julia,D,PHP,Perl,Perl 6,Maxima,Fortran,MiniZinc,Swift,Prolog,Octave,Dart,Haskell,C++,Scala":"cos _ ( _ var1:expression _ )","C#,Visual Basic .NET":"Math _ . _ Cos _ ( _ var1:expression _ )","Wolfram":"Cos _ [ _ var1:expression _ ]","Go":"math _ . _ Cos _ ( _ var1:expression _ )","REBOL":"cosine/radians __ var1:expression","Common Lisp,Racket":"( _ cos __ a _ )","Clojure":"( _ Math/cos __ a _ )"},"tan,var1:expression":{"Java,JavaScript,TypeScript,Ruby,Haxe":"Math _ . _ tan _ ( _ var1:expression _ )","Lua,Python":"math _ . _ tan _ ( _ var1:expression _ )","C,Erlang,Picat,Mathematical notation,Julia,D,PHP,Perl,Perl 6,Maxima,Fortran,MiniZinc,Swift,Prolog,Octave,Dart,Haskell,C++,Scala":"tan _ ( _ var1:expression _ )","C#,Visual Basic .NET":"Math _ . _ Tan _ ( _ var1:expression _ )","Wolfram":"Tan _ [ _ var1:expression _ ]","REBOL":"tangent/radians __ var1:expression","Go":"math _ . _ Tan _ ( _ var1:expression _ )","Common Lisp,Racket":"( _ tan __ a _ )","Clojure":"( _ Math/tan __ a _ )"},"instance_method,name:Identifier,type:type,params:function_parameters,body:series_of_statements":{"Swift":"func __ name:Identifier _ ( _ params:function_parameters _ ) _ -> _ type:type _ { _ body:series_of_statements _ }","Visual Basic .NET":"Public __ Function __ InstanceMethod _ ( _ params:function_parameters _ ) _ As __ type:type __ body:series_of_statements __ End __ Function","JavaScript":"name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Perl 6":"method __ name:Identifier __ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Chapel":"def __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ type:type _ { _ body:series_of_statements _ }","Java,C#":"public __ type:type __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","PHP":"public __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Ruby":"def __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","C++,D,Dart":"type:type __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Haxe":"public __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ type:type _ { _ body:series_of_statements _ }","Lua":"_","Python":"def __ name:Identifier _ ( _ self, _ params:function_parameters _ ) _ : _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent"},"typeless_instance_method,name:Identifier,params:function_parameters,body:series_of_statements":{"Swift":"func __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Visual Basic .NET":"Public __ Function __ InstanceMethod _ ( _ params:function_parameters _ ) __ body:series_of_statements __ End __ Function","JavaScript,Dart":"name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Chapel":"def __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Java":"public __ Object __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","C#":"public __ object __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","PHP":"public __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Ruby":"def __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","C++,D":"auto __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Haxe":"public __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Lua":"_","Python":"def __ name:Identifier _ ( _ self, _ params:function_parameters _ ) _ : _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent"},"typeless_static_method,name:Identifier,params:function_parameters,body:series_of_statements":{"Swift":"class __ func __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Visual Basic .NET":"Public __ Shared __ Function __ InstanceMethod _ ( _ params:function_parameters _ ) __ body:series_of_statements __ End __ Function","JavaScript":"static __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Haxe":"public __ static __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Lua,Julia":"function __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","Java":"public __ static __ Object __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","C#":"public __ static __ object __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Dart":"static __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","C++":"static __ auto __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","PHP":"public __ static __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Ruby":"def __ self _ . _ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","Python":"@staticmethod _ \\n __ def __ name:Identifier _ ( _  _ params:function_parameters _ ) _ : _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent"},"static_method,name:Identifier,type:type,params:function_parameters,body:series_of_statements":{"Swift":"class __ func __ name:Identifier _ ( _ params:function_parameters _ ) _ -> _ type:type _ { _ body:series_of_statements _ }","Visual Basic .NET":"Public __ Shared __ Function __ InstanceMethod _ ( _ params:function_parameters _ ) __ As __ type:type __ body:series_of_statements __ End __ Function","Haxe":"public __ static __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Lua,Julia":"function __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","Java,C#":"public __ static __ type:type __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","C++,Dart":"static __ type:type __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","PHP":"public __ static __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Ruby":"def __ self _ . _ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","C":"type:type __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","JavaScript":"static __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Picat":"_","Python":"@staticmethod _ \\n __ def __ name:Identifier _ ( _  _ params:function_parameters _ ) _ : _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent"},"declare_new_object,var_name:var_name,class_name:Identifier,params:function_call_parameters":{"Visual Basic .NET":"Private __ var_name:var_name __ As __ New __ class_name:Identifier _ ( _ params:function_call_parameters _ )","Java,C#,D,Dart":"class_name:Identifier __ var_name:var_name _ = _ new __ class_name:Identifier _ ( _ params:function_call_parameters _ )","JavaScript,Haxe,Chapel,Scala":"var __ var_name:var_name _ = _ new __ class_name:Identifier _ ( _ params:function_call_parameters _ )","PHP":"var_name:var_name _ = _ new __ class_name:Identifier _ ( _ params:function_call_parameters _ )","Python,Swift,Octave":"var_name:var_name _ = _ class_name:Identifier _ ( _ params:function_call_parameters _ )","Ruby":"var_name:var_name _ = _ class_name:Identifier _ . _ new _ ( _ params:function_call_parameters _ )","Perl":"my __ var_name:var_name _ = _ class_name:Identifier _ -> _ new _ ( _ params:function_call_parameters _ )","Perl 6":"my __ var_name:var_name _ = _ class_name:Identifier _ -> _ new _ ( _ params:function_call_parameters _ )","C++":"class_name:Identifier __ var_name:var_name _ ( _ params:function_call_parameters _ )"},"string_to_int,a:expression":{"Common Lisp":"( _ parse-integer __ a:expression _ )","Rust":"a:parentheses_expression _ . _ parse _ :: _ <int> _ ( _ )","Perl 6":"+ _ ( _ a:expression _ )","Go":"strconv _ . _ Atoi _ ( _ a:expression _ )","Python,Julia":"int _ ( _ a:expression _ )","Haxe":"Std _ . _ parseInt _ ( _ a:expression _ )","PHP":"( _ int _ ) _ a:expression","Haskell":"( _ read __ a:expression _ )","C#":"Int32 _ . _ Parse( _ a:expression _ )","Visual Basic .NET":"Convert _ . _ toInt32 _ ( _ a:expression _ )","Java":"Integer _ . _ parseInt _ ( _ a:expression _ )","Ceylon":"parseInteger _ ( _ a:expression _ )","C":"atoi _ ( _ a:expression _ )","Scala":"a:expression _ . _ toInt","D":"std _ . _ conv _ . _ to!int _ ( _ a:expression _ )","Ruby":"Integer _ ( _ a:expression _ )","REBOL":"to __ integer! __ a:expression","Lua":"tonumber _ ( _ a:expression _ )","JavaScript,TypeScript":"parseInt _ ( _ a:expression _ )","C++":"atoi _ ( _ a:expression _ . _ c_str _ ( _ ) _ )","Dart":"int _ . _ parse _ ( _ a:expression _ )","Swift":"Int _ ( _ a:expression _ )","Octave":"str2double _ ( _ a:expression _ )"},"int_to_string,a:parentheses_expression":{"Perl 6":"~ _ ( _ a:parentheses_expression _ )","Go":"strconv _ . _ Itoa _ ( _ a:parentheses_expression _ )","Python":"str _ ( _ a:parentheses_expression _ )","Wolfram":"ToString _ [ _ a:parentheses_expression _ ]","Swift,JavaScript,TypeScript":"String _ ( _ a:parentheses_expression _ )","Java":"Integer _ . _ toString _ ( _ a:parentheses_expression _ )","Haskell":"( _ show __ a:parentheses_expression _ )","Perl":"a:parentheses_expression","C#,Visual Basic .NET":"Convert _ . _ ToString _ ( _ a:parentheses_expression _ )","Ruby":"a:parentheses_expression _ . _ to_s","REBOL":"to __ string! __ a:parentheses_expression","C++":"std _ :: _ to_string _ ( _ a:parentheses_expression _ )","Lua":"tostring _ ( _ a:parentheses_expression _ )","Haxe":"Std _ . _ toString _ ( _ a:parentheses_expression _ )","D":"std _ . _ conv _ . _ to!string _ ( _ a:parentheses_expression _ )","PHP":"( _ string _ ) _ a:parentheses_expression","Dart":"a:parentheses_expression _ . _ toString _ ( _ )","Scala":"a:parentheses_expression _ . _ toString","Rust":"a:parentheses_expression _ . _ to_string _ ( _ )","Julia":"string _ ( _ a:parentheses_expression _ )","Octave":"num2str _ ( _ a:parentheses_expression _ )"},"typeless_declare_constant,name:var_name,value:expression":{"Polish notation":"= __ name:var_name __ value:expression","Reverse Polish notation":"name:var_name __ value:expression __ =","Go":"const __ type __ name:var_name _ = _ value:expression","PHP,JavaScript,TypeScript":"const __ name:var_name _ = _ value:expression","Visual Basic .NET":"Public __ Const __ name:var_name _ = _ value:expression","Rust,Swift":"let __ name:var_name _ = _ value:expression","C":"static __ const __ name:var_name _ = _ value:expression","C#":"const __ object __ name:var_name _ = _ value:expression","D,C++":"const __ auto __ name:var_name _ = _ value:expression","Common Lisp":"( _ setf __ name:var_name __ value:expression _ )","Scala":"val __ name:var_name _ = _ value:expression","Python,Ruby,Haskell,Erlang,Julia,Picat,Prolog":"name:var_name _ = _ value:expression","Lua":"local __ name:var_name _ = _ value:expression","Perl":"my __ name:var_name _ = _ value:expression","REBOL":"name:var_name _ : _ value:expression","Haxe":"static __ inline __ var __ name:var_name _ = _ value:expression","Java":"final __ Object __ name:var_name _ = _ value:expression","Dart":"final __ name:var_name _ = _ value:expression","Chapel":"var _ name:var_name _ = _ value:expression","Perl 6":"constant __ name:var_name _ = _ value:expression"},"assert,a:expression":{"C,C++,Lua,Python,Swift,PHP,Ceylon":"assert _ ( _ a:expression _ )","C#,Visual Basic .NET":"Debug _ . _ Assert _ ( _ a:expression _ )","Java,EnglishScript,F#":"assert a:expression","Clojure":"( _ assert __ a:expression _ )","R":"stopifnot _ ( _ a:expression _ )"},"declare_constant,name:var_name,type:type,value:expression":{"Polish notation":"= __ name:var_name __ value:expression","Reverse Polish notation":"name:var_name __ value:expression __ =","Fortran":"type:type _ , _ PARAMETER _ :: _ name:var_name _ = _ expression","Go":"const __ type:type __ name:var_name _ = _ value:expression","Perl 6":"constant __ type:type __ name:var_name _ = _ value:expression","PHP,JavaScript,Dart":"const __ name:var_name _ = _ value:expression","Z3":"( _ declare-const __ name:var_name __ type:type _ ) _ ( _ assert __ ( _ = __ name:var_name __ value:expression _ ) _ )","Visual Basic .NET":"Public __ Const __ name:var_name __ As __ type:type _ = _ value:expression","Rust,Swift":"let __ name:var_name _ = _ value:expression","C++,C,D,C#":"const __ type:type __ name:var_name _ = _ value:expression","Common Lisp":"( _ setf __ name:var_name __ value:expression _ )","MiniZinc":"type:type _ : _ name:var_name _ = _ value:expression","Scala":"val __ name:var_name _ : _ type:type _ = _ value:expression","Python,Ruby,Haskell,Erlang,Julia,Picat,Prolog":"name:var_name _ = _ value:expression","Lua":"local __ name:var_name _ = _ value:expression","Perl":"my __ name:var_name _ = _ value:expression","REBOL":"name:var_name _ : _ value:expression","Haxe":"static __ inline __ var __ name:var_name _ = _ value:expression","Java,Dart":"final __ type:type __ name:var_name _ = _ value:expression","C":"static __ const __ name:var_name _ = _ value:expression","Chapel":"var __ name:var_name _ : _ type:type _ = _ value:expression","TypeScript":"const __ name:var_name _ : _ type:type _ = _ value:expression"},"index_of,string:parentheses_expression,substring:parentheses_expression":{"JavaScript,Java":"string:parentheses_expression _ . _ indexOf _ ( _ substring:expression _ )","D":"string:parentheses_expression _ . _ indexOfAny _ ( _ substring:expression _ )","Ruby":"string:parentheses_expression _ . _ index _ ( _ substring:expression _ )","C#":"string:parentheses_expression _ . _ IndexOf _ ( _ substring:expression _ )","Python":"string:parentheses_expression _ . _ find _ ( _ substring:expression _ )","Go":"strings _ . _ Index _ ( _ string:expression _ , _ substring:expression _ )"},"function_call_named_parameter,name:Identifier,value:expression":{"Python,C#,Fortran,Scala":"name:Identifier _ = _ value:expression","Modula-3,Visual Basic .NET":"name:Identifier _ := _ value:expression","Ruby,Swift,Dart":"name:Identifier _ : _ value:expression","JavaScript,Erlang,Octave,Picat,Julia,Mathematical notation,Lua,Java,C,PHP,Haxe,MiniZinc,C++,Prolog,Z3,REBOL,Haskell,Go,Polish notation,Reverse Polish notation":"value:expression","Perl":" _ name:Identifier _ => _ value:expression"},"function_call,theName:dot_notation,args:(function_call_parameters/_)":{"C,GAP,Mathematical notation,Chapel,Elixir,Janus,Perl 6,Pascal,Rust,Hack,Katahdin,MiniZinc,Pawn,Aldor,Picat,D,Genie,ooc,PL/I,Delphi,Standard ML,REXX,Falcon,IDP,Processing,Maxima,Swift,Boo,R,MATLAB,AutoIt,Pike,Gosu,AWK,AutoHotKey,Gambas,Kotlin,Nemerle,EngScript,Prolog,Groovy,Scala,CoffeeScript,Julia,TypeScript,Fortran,Octave,C++,Go,Cobra,Ruby,Vala,F#,Java,Ceylon,OCaml,Erlang,Python,C#,Lua,Haxe,JavaScript,Dart,bc,Visual Basic,Visual Basic .NET,PHP,Perl":"theName:dot_notation _ ( _ args:(function_call_parameters/_) _ )","Haskell,Z3,CLIPS,Clojure,Common Lisp,CLIPS,Racket,Scheme,crosslanguage,REBOL":"( _ theName:dot_notation __ args:(function_call_parameters/_) _ )","Polish notation":"theName:dot_notation __ args:(function_call_parameters/_)","Reverse Polish notation":"args:(function_call_parameters/_) __ theName:dot_notation","Pydatalog":"theName:dot_notation _ [ _ args:(function_call_parameters/_) _ ]"},"reverse_string,a:expression":{"Python":"a:expression _  _ [ _ :: _ -1 _ ]","Ruby":"a:expression _ . _ reverse!","Java":"new __ StringBuilder _ ( _ theString _ ) _ . _ reverse _ ( _ ) _ . _ toString _ ( _ )","JavaScript":"a:expression _ . _ reverse _ ( _ )","PHP":"strrev _ ( _ a:expression _ )","Visual Basic .NET":"StrReverse _ ( _ a:expression _ )","Haskell":"( _ reverse __ a:expression _ )"},"reverse_array,a:expression":{"Haskell":"( _ reverse __ a:expression _ )","Ruby":"a:expression _ . _ reverse","JavaScript,Haxe":"a:expression _ . _ reverse _ ( _ )","Python":"a:expression _ [ _ :: _ -1 _ ]","Perl":"reverse _ ( _ a:expression _ )","PHP":"array_reverse _ ( _ a:expression _ )","Visual Basic .NET,C#":"Array _ . _ Reverse _ ( _ a:expression _ )"},"for,statement_1:initialize_var,condition:expression,statement_2:set_var,body:series_of_statements":{"Java,D,Pawn,Groovy,JavaScript,Dart,TypeScript,PHP,Hack,C#,Perl,C++,AWK,Pike":"for _ ( _ statement_1:initialize_var _ ; _ condition:expression _ ; _ statement_2:set_var _ ) _ { _ body:series_of_statements _ }","C":"init:initialize_empty_var _ ; _ for _ ( _ statement_1:initialize_var _ ; _ condition:expression _ ; _ statement_2:set_var _ ) _ { _ body:series_of_statements _ }","Haxe":"statement_1:initialize_var _ ; _  _ while _ ( _ condition:expression _ ) _ { _ body:series_of_statements _ statement_2:set_var _ ; _ }","Lua,Ruby":"statement_1:initialize_var __ while __ condition:expression __ do __ body:series_of_statements __ statement_2:set_var __ end"},"while,a:expression,b:series_of_statements":{"GAP":"while __ a:expression __ do __ b:series_of_statements __ od _ ;","EnglishScript":"while __ a:expression __ do __ b:series_of_statements __ od _ ;","Fortran":"WHILE __ ( _ a:expression _ ) __ DO __ b:series_of_statements __ ENDDO","Pascal":"while __ a:expression __ do __ begin __ b:series_of_statements __ end;","Delphi":"While __ a:expression __ do __ begin __ b:series_of_statements __ end;","Rust,Frink,Dafny":"while __ a:expression _ { _ b:series_of_statements _ }","C,Perl 6,Katahdin,Chapel,ooc,Processing,Pike,Kotlin,Pawn,PowerShell,Hack,Gosu,AutoHotKey,Ceylon,D,TypeScript,ActionScript,Nemerle,Dart,Swift,Groovy,Scala,Java,JavaScript,PHP,C#,Perl,C++,Haxe,R,AWK,Vala":"while _ ( _ a:expression _ ) _ { _ b:series_of_statements _ }","Lua,Ruby,Julia":"while __ a:expression __ b:series_of_statements __ end","Picat":"while __ ( _ a:expression _ ) __ b:series_of_statements __ end","REBOL":"while _ [ _ a:expression _ ] _ [ _ b:series_of_statements _ ]","Common Lisp":"( _ loop __ while __ a:expression __ do __ b:series_of_statements _ )","Hy,newLisp,CLIPS":"( _ while __ a:expression __ b:series_of_statements _ )","Python,Cython":"while __ a:expression _ : _ \\n _ #indent _ \\n _ b:series_of_statements _ \\n _ #unindent","Visual Basic,Visual Basic .NET,VBScript":"While __ a:expression __ b:series_of_statements __ End _ While","Octave":"while _ ( _ a:expression _ ) __ endwhile","Wolfram":"While _ [ _ a:expression _ , _ b:series_of_statements _ ]","Go":"for __ a:expression _ { _ b:series_of_statements _ }","VBScript":"Do __ While __ a:expression __ b:series_of_statements __ Loop"},"exception,a:expression":{"Python":"raise __ Exception _ ( _ a:expression _ )","Ruby,OCaml":"raise __ a:expression","JavaScript,Dart,Java,C++,Swift,REBOL,Haxe,C#,Picat,Scala":"throw __ a:expression","Julia,E":"throw _ ( _ a:expression _ )","Visual Basic .NET":"Throw __ a:expression","Perl,Perl 6":"die __ a:expression","Octave":"error _ ( _ a:expression _ )","PHP":"throw __ new __ Exception _ ( _ a:expression _ )"},"function,type:type,params:function_parameters,name:Identifier,body:series_of_statements":{"LiveCode":"function __ name:Identifier __ params:function_parameters __ body:series_of_statements __ end __ name:Identifier","Monkey X":"Function _ name:Identifier _ : _ type:type _ ( _ params:function_parameters _ ) _ body:series_of_statements __ End","Emacs Lisp":"( _ defun __ name:Identifier __ ( _ params:function_parameters _ ) __ body:series_of_statements _ )","Go":"func __ name:Identifier _ ( _ params:function_parameters _ ) __ type:type _ { _ body:series_of_statements _ }","C++,Vala,C,Dart,Ceylon,Pike,D,EnglishScript":"type:type __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Pydatalog":"name:Identifier _ ( _ params:function_parameters _ ) _ <= _ body:series_of_statements","Java,C#":"public __ static __ type:type __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","JavaScript,PHP":"function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Lua,Julia":"function __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","Wolfram":"name:Identifier _ [ _ params:function_parameters _ ] _ := _ body:series_of_statements","Frink":"name:Identifier _ [ _ params:function_parameters _ ] _ := _ { _ body:series_of_statements _ }","POP-11":"define __ name:Identifier _ ( _ params:function_parameters _ ) _ -> _ Result; __ body:series_of_statements __ enddefine;","Z3":"( _ define-fun __ name:Identifier _ ( _ params:function_parameters _ ) __ type:type __ body:series_of_statements _ )","Mathematical notation":"name:Identifier _ ( _ params:function_parameters _ ) _ = _ { _ body:series_of_statements _ }","Chapel":"proc __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ type:type _ { _ body:series_of_statements _ }","Prolog":"name:Identifier _ ( _ params:function_parameters _ ) __ :- __ body:statement _ .","Picat":"name:Identifier _ ( _ params:function_parameters _ ) _ = _ retval _ => _ body:series_of_statements _ .","Swift":"func __ name:Identifier _ ( _ params:function_parameters _ ) _ -> _ type:type _ { _ body:series_of_statements _ }","Maxima":"name:Identifier _ ( _ params:function_parameters _ ) _ := _ body:series_of_statements","Rust":"fn __ name:Identifier _ ( _ params:function_parameters _ ) _ -> _ type:type _ { _ body:series_of_statements _ }","Clojure":"( _ defn _ name:Identifier _ [ _ params:function_parameters _ ] _ body:series_of_statements _ )","Octave":"function __ retval _ = _ name:Identifier _ ( _ params:function_parameters _ ) _ body:series_of_statements __ endfunction","Haskell":"name:Identifier __ params:function_parameters _ = _ body:statement","Common Lisp":"(defun __ name:Identifier _ ( _ params:function_parameters _ ) _ body:series_of_statements _ )","Fortran":"FUNC __ name:Identifier __ ( _ params:function_parameters _ ) __ RESULT _ ( _ retval _ ) __ type:type _ :: _ retval __ body:series_of_statements __ END __ FUNCTION __ name:Identifier","Scala":"def __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ type:type _ = _ { _ body:series_of_statements _ }","MiniZinc":"function __ type:type _ : _ name:Identifier _ ( _ params:function_parameters _ ) _ = _ body:series_of_statements _ ;","CLIPS":"( _ deffunction __ name:Identifier _ ( _ params:function_parameters _ ) _ body:series_of_statements _ )","Erlang":"name:Identifier _ ( _ params:function_parameters _ ) _ -> _ body:series_of_statements","Perl":"sub __ name:Identifier _ { _ params:function_parameters _ body:series_of_statements _ }","Perl 6":"sub __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Pawn":"name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Ruby":"def __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","TypeScript":"function __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ type:type _ { _ body:series_of_statements _ }","REBOL":"name:Identifier _ : __ func _ [ _ params:function_parameters _ ] _ [ _ body:series_of_statements _ ]","Haxe":"public __ static __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ type:type _ { _ body:series_of_statements _ }","Hack":"function __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ type:type _ { _ body:series_of_statements _ }","R":"name:Identifier _ <- _ function _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","bc":"define __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Visual Basic,Visual Basic .NET":"Function __ name:Identifier _ ( _ params:function_parameters _ ) _ As __ type:type __ body:series_of_statements __ End __ Function","VBScript":"Function __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ End __ Function","Racket,newLisp":"(define _ (name _ params) _ body:series_of_statements _ )","Janus":"procedure __ name:Identifier _ ( _ params:function_parameters _ ) _ body:series_of_statements","Python":"def __ name:Identifier _ ( _ params:function_parameters _ ) _ -> _ type:type _ : _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent","F#":"let __ name:Identifier __ params:function_parameters _ = _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent","Polish notation":"= _ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements","Reverse Polish notation":"name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ =","OCaml":"let __ name:Identifier __ params:function_parameters _ = _ body:series_of_statements","E":"def __ name:Identifier _ ( _ params:function_parameters _ ) _ type:type _ { _ body:series_of_statements _ }","Pascal,Delphi":"function __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ type:type _ ; _ begin __ body:series_of_statements __ end _ ;"},"else,a:series_of_statements":{"Clojure":":else __ a:series_of_statements","Fortran":"ELSE __ a:series_of_statements","Hack,E,ooc,EnglishScript,Mathematical notation,Dafny,Perl 6,Frink,Chapel,Katahdin,Pawn,PowerShell,Puppet,Ceylon,D,Rust,TypeScript,Scala,AutoHotKey,Gosu,Groovy,Java,Swift,Dart,AWK,JavaScript,Haxe,PHP,C#,Go,Perl,C++,C,Tcl,R,Vala,bc":"else _ { _ a:series_of_statements _ }","Ruby,LiveCode,Janus,Lua,Haskell,CLIPS,MiniZinc,Julia,Octave,Picat,Pascal,Delphi,Maxima,OCaml,F#":"else __ a:series_of_statements","Erlang":"true _ -> _ a:series_of_statements","Wolfram,Prolog":"a:series_of_statements","Z3":"a:statement","Python,Cython":"else _ : _ \\n _ #indent _ \\n _ b _ \\n _ #unindent","Visual Basic .NET,Monkey X,VBScript":"Else __ a:series_of_statements","REBOL":"true _ [ _ a:series_of_statements _ ]","Common Lisp":"( _ t __ a:series_of_statements _ )","English":"otherwise __ a:series_of_statements","Polish notation":"else __ a:series_of_statements","Reverse Polish notation":"a:series_of_statements __ else"},"true":{"Java,LiveCode,GAP,Dafny,Z3,Perl 6,Chapel,C,Frink,Elixir,English,Pascal,MiniZinc,EngScript,Picat,Rust,Clojure,Nimrod,Hack,Ceylon,D,Groovy,CoffeeScript,TypeScript,Octave,Prolog,Julia,F#,Swift,Nemerle,Vala,C++,Dart,JavaScript,Ruby,Erlang,C#,Haxe,Go,OCaml,Lua,Scala,PHP,REBOL":"true","Python,Pydatalog,Hy,Cython,AutoIt,Haskell,Visual Basic .NET,VBScript,Visual Basic,Monkey X,Wolfram,Delphi":"True","Perl,AWK,Tcl":"1","Racket":"#t","Common Lisp":"t","Fortran":".TRUE.","R":"TRUE"},"false":{"Java,LiveCode,GAP,Dafny,Z3,Perl 6,Chapel,C,Frink,Elixir,Pascal,Rust,MiniZinc,EngScript,Picat,Clojure,Nimrod,Groovy,D,Ceylon,TypeScript,CoffeeScript,Octave,Prolog,Julia,Vala,F#,Swift,C++,Nemerle,Dart,JavaScript,Ruby,Erlang,C#,Haxe,Go,OCaml,Lua,Scala,PHP,REBOL,Hack":"false","Python,Pydatalog,Hy,Cython,AutoIt,Haskell,Visual Basic .NET,VBScript,Visual Basic,Monkey X,Wolfram,Delphi":"False","Perl,AWK,Tcl":"0","Common Lisp":"nil","Racket":"#f","Fortran":".FALSE.","R":"FALSE"},"elif_or_else,a:statement":{"Java,Common Lisp,Octave,Picat,MiniZinc,Vala,Clojure,Monkey X,ooc,Ceylon,F#,Delphi,Perl 6,EnglishScript,Wolfram,Julia,OCaml,Maxima,Python,Cython,Erlang,Mathematical notation,REBOL,Scheme,Dart,JavaScript,TypeScript,C,C#,Haxe,PHP,Lua,Ruby,R,Fortran,Perl,C++,Visual Basic .NET,VBScript,Prolog,Scala,Rust,Go,Swift,Haskell,Z3":"a:(elif/else)","Z3":"a:statement"},"elif,a:And,b:series_of_statements,c:elif_or_else":{"D,E,Mathematical notation,Chapel,Pawn,Ceylon,Scala,TypeScript,AutoHotKey,AWK,R,Groovy,Gosu,Katahdin,Java,Swift,Nemerle,C,Dart,Vala,JavaScript,C#,C++,Haxe":"else __ if _ ( _ a:And _ ) _ { _ b:series_of_statements _ } _ c:elif_or_else","Z3":"( _ ite __ a:Factor __ b:statement __ c:elif_or_else _ )","Rust,Go,EnglishScript":"else __ if __ a:And _ { _ b:series_of_statements _ } _ c:elif_or_else","PHP,Hack,Perl":"elseif _ ( _ a:And _ ) _ { _ b:series_of_statements _ } _ c:elif_or_else","Julia,Octave,Lua":"elseif __ a:And __ b:series_of_statements __ c:elif_or_else","Monkey X":"ElseIf __ a:And __ b:series_of_statements __ c:elif_or_else","Ruby":"elsif __ a:And __ then __ b:series_of_statements __ c:elif_or_else","Perl 6":"elsif __ a:And __ { _ b:series_of_statements _ } _ c:elif_or_else","Picat":"elseif __ a:And __ then __ b:series_of_statements __ c:elif_or_else","Erlang":"a:And _ -> _ b:series_of_statements __ c:elif_or_else","Prolog":"( _ a:And _ -> _ b:series_of_statements _ ; _ c:elif_or_else _ )","R,F#":"a:And _ <- _ b:series_of_statements __ c:elif_or_else","CLIPS":"( _ if __ a:And __ then __ ( _ b:series_of_statements __ c:elif_or_else _ ) _ )","MiniZinc,OCaml,Haskell,Pascal,Maxima,Delphi,F#,LiveCode":"else __ if __ a:And __ then __ b:series_of_statements __ c:elif_or_else","Python,Cython":"elif __ a:And _ : _ \\n _ #indent _ \\n _ b:series_of_statements _ \\n _ #unindent __ c:elif_or_else","Visual Basic .NET":"ElseIf __ a:And __ Then __ b:series_of_statements __ c:elif_or_else","Fortran":"ELSE __ IF __ a:And __ THEN __ b:series_of_statements __ c:elif_or_else","REBOL":"a:And _ [ _ b:series_of_statements _ ] __ c:elif_or_else","Common Lisp":"( _ a:And __ b:series_of_statements _ ) __ c:elif_or_else","Wolfram":"If _ [ _ a:And _ , _ b:series_of_statements _ , _ c:elif_or_else _ ]","Polish notation":"elif __ a:And __ b:series_of_statements __ c:elif_or_else","Reverse Polish notation":"a:And __ b:series_of_statements __ c:elif_or_else __ elif","Clojure":"a:expression __ b:statement __ c:elif_or_else"},"return,a:expression,function_name:Identifier":{"VBScript":"function_name:Identifier _ = _ a:expression","Java,E,LiveCode,EnglishScript,Cython,GAP,Kal,EngScript,Pawn,Ada,PowerShell,Rust,D,Ceylon,TypeScript,Hack,AutoHotKey,Gosu,Swift,Pike,Objective-C,C,Groovy,Scala,CoffeeScript,Julia,Dart,C#,JavaScript,Go,Haxe,PHP,C++,Perl,Vala,Lua,Python,REBOL,Ruby,Tcl,AWK,bc,Chapel,Perl 6":"return __ a:expression","MiniZinc,Pydatalog,Polish notation,Reverse Polish notation,Mathematical notation,Emacs Lisp,Z3,Erlang,Maxima,Standard ML,Icon,Oz,CLIPS,newLisp,Hy,Sibilant,LispyScript,ALGOL 68,Clojure,Prolog,Common Lisp,F#,OCaml,Haskell,ML,Racket,Nemerle":"a:expression","Visual Basic,Visual Basic .NET,AutoIt,Monkey X":"Return __ a:expression","Octave,Fortran":"retval _ = _ a:expression","Pascal":"Exit _ ( _ a:expression _ )","Picat":"retval _ = _ a:expression","R":"return _ ( _ a:expression _ )","Wolfram":"Return _ [ _ a:expression _ ]","POP-11":"a:expression _ -> _ Result","Delphi,Pascal":"Result _ = _ a:expression"},"set_var,name:(access_array/var_name),value:expression":{"JavaScript,Mathematical notation,Perl 6,Wolfram,Chapel,Katahdin,Frink,Picat,ooc,D,Genie,Janus,Ceylon,IDP,Sympy,Prolog,Processing,Java,Boo,Gosu,Pike,Kotlin,Icon,PowerShell,EngScript,Pawn,FreeBASIC,Hack,Nimrod,OpenOffice Basic,Groovy,TypeScript,Rust,CoffeeScript,Fortran,AWK,Go,Swift,Vala,C,Julia,Scala,Cobra,Erlang,AutoIt,Dart,Java,OCaml,Haxe,C#,MATLAB,C++,PHP,Perl,Python,Lua,Ruby,Gambas,Octave,Visual Basic,Visual Basic .NET,bc":"name:(access_array/var_name) _ = _ value:expression","MiniZinc":"constraint __ name:(access_array/var_name) _ = _ value:expression _ ;","REBOL":"name:(access_array/var_name) _ : _ value:expression","Z3":"( _ assert _ ( _ = __ name:(access_array/var_name) __ value:expression _ ) _ )","GAP,Delphi":"name:(access_array/var_name) _ := _ value:expression","LiveCode":"put __ expression __ into __ name:(access_array/var_name)","VBScript":"Set __ a _ = _ b"},"print,a:expression":{"OCaml":"print_string __ a:expression","MiniZinc":"trace _ ( _ a:expression _ , _ true _ )","Perl 6":"say __ a:expression","Erlang":"io _ : _ fwrite _ ( _ a:expression _ )","C++":"cout _ << _ a:expression","Haxe":"trace _ ( _ a:expression _ )","Go":"fmt _ . _ Println _ ( _ a:expression _ )","Prolog":"write _ ( _ a:expression _ )","C#":"Console _ . _ WriteLine _ ( _ a:expression _ )","REBOL,Fortran,Perl,PHP":"print __ a:expression","Ruby":"puts _ ( _ a:expression _ )","Visual Basic .NET":"System _ . _ Console _ . _ WriteLine _ ( _ a:expression _ )","Scala,Julia,Swift":"println _ ( _ a:expression _ )","JavaScript,TypeScript":"console _ . _ log _ ( _ a:expression _ )","Python,EnglishScript,Cython,Ceylon,R,Gosu,Dart,Vala,Perl,PHP,Hack,AWK,Lua":"print _ ( _ a:expression _ )","Java":"System _ . _ out _ . _ println _ ( _ a:expression _ )","C":"printf _ ( _ a:expression _ )","Haskell":"( _ putStrLn __ a:expression _ )","Hy,Common Lisp,crosslanguage":"( _ print __ a:expression _ )","Rust":"println!( _ a:expression _ )","Octave":"disp _ ( _ a:expression _ )","Chapel,D":"writeln _ ( _ a:expression _ )","Delphi":"WriteLn _ ( _ a:expression _ )","Frink":"print _ [ _ a:expression _ ]","Wolfram":"Print _ [ _ a:expression _ ]","Z3":"( _ echo __ a:expression _ )","Picat":"println _ ( _ a:expression _ )","Monkey X":"Print __ a:expression"},"grammar_series_of_statements,var1:grammar_statement,var2:grammar_series_of_statements":{"PEG.js,Wirth syntax notation,Yacc,Pyparsing,EBNF,Nearley,ANTLR,Marpa,Parslet,Perl 6,Prolog,REBOL":"var1:grammar_statement __ var2:grammar_series_of_statements"},"series_of_statements,var1:statement,var2:(series_of_statements/statement)":{"Pydatalog,Java,Racket,VBScript,Monkey X,LiveCode,Polish notation,Reverse Polish notation,Clojure,CLIPS,Common Lisp,Emacs Lisp,Scheme,Prolog,Dafny,Z3,Elm,Bash,Perl 6,Mathematical notation,Katahdin,Frink,MiniZinc,Aldor,COBOL,ooc,Genie,ECLiPSe,nools,Agda,PL/I,REXX,IDP,Falcon,Processing,Sympy,Maxima,Pyke,Elixir,GNU Smalltalk,Seed7,Standard ML,Occam,Boo,Drools,Icon,Mercury,EngScript,Pike,Oz,Kotlin,Pawn,FreeBASIC,Ada,PowerShell,Gosu,Nimrod,Cython,OpenOffice Basic,ALGOL 68,D,Ceylon,Rust,CoffeeScript,ActionScript,TypeScript,Fortran,Octave,ML,AutoHotKey,Delphi,Pascal,F#,Self,Swift,Nemerle,Dart,C,AutoIt,Cobra,Julia,Groovy,Scala,OCaml,Gambas,Hack,C++,MATLAB,REBOL,Red,Lua,Go,AWK,Haskell,Perl,Python,JavaScript,C#,PHP,Ruby,R,Haxe,Visual Basic,Visual Basic .NET,Vala,bc":"var1:statement __ var2:(series_of_statements/statement)","Wolfram":"var1:statement _ ; _ var2:(series_of_statements/statement)","EnglishScript,Python":"var1:statement _ \\n _ var2:(series_of_statements/statement)","Picat,Prolog,Erlang,LPeg":"var1:statement _ , _ var2:(series_of_statements/statement)"},"class_statements,var1:class_statement,var2:class_statements":{"Java,Perl 6,Scala,Julia,Python,Dart,C#,Ruby,C++,JavaScript,TypeScript,Visual Basic .NET,PHP,Haxe,Visual Basic .NET,Swift":"var1:class_statement __ var2:class_statements"},"class_statement,a:(constructor/static_method/instance_method)":{"Java,Julia,C#,Visual Basic .NET,Ruby,PHP,C++,Haxe,Swift,Dart,Python":"a:(constructor/static_method/instance_method/initialize_static_variable/initialize_instance_variable/initialize_instance_variable_with_value/initialize_static_variable_with_value)","JavaScript,TypeScript":"a:(constructor/static_method/instance_method)"},"comment,var1:[^\\n]+":{"Java,Dafny,Janus,Chapel,Rust,Frink,D,Genie,Ceylon,Hack,Maxima,Kotlin,Delphi,Dart,TypeScript,Swift,Vala,C#,JavaScript,Haxe,Scala,Go,C,C++,Pike,PHP,F#,Nemerle,crosslanguage,Gosu,Groovy":"// _ var1:[^\\n]+ _ \\n","OCaml,Standard ML,ML":"(*{ _ var1:[^\\n]+ _ }*)","MATLAB,MiniZinc,Octave,Erlang,Prolog,Picat":"% _ var1:[^\\n]+ _ \\n","REBOL":"comment _ [ _ var1:[^\\n]+ _ ]","Wolfram":"(* _ var1:[^\\n]+ _ *)","Pascal":"{ _ var1:[^\\n]+ _ }","Fortran":"! _ var1:[^\\n]+ _ \\n","Z3":"; _ var1:[^\\n]+ _ \\n","Bash,Perl 6,PowerShell,Seed7,Cobra,Icon,EngScript,Nimrod,CoffeeScript,Julia,AWK,Ruby,Perl,R,Tcl,bc,Python,Cython":"# _ var1:[^\\n]+ _ \\n","Lua,Haskell,Ada":"-- _ var1:[^\\n]+ _ \\n","Gambas,Visual Basic,Visual Basic .NET,Monkey X,VBScript":"' _ var1:[^\\n]+ _ \\n"},"initialize_var,name:var_name,type:type,value:expression":{"Polish notation":"= __ name:var_name __ value:expression","Reverse Polish notation":"name:var_name __ value:expression __ =","Go":"var __ name:var_name __ type:type _ = _ value:expression","Rust":"let __ mut __ name:var_name _ = _ value:expression","Dafny":"var _ name:var_name _ : _ type:type _ := _ value:expression","Z3":"( _ declare-const __ name:var_name __ type:type _ ) _ ( _ assert __ ( _ = __ name:var_name __ value:expression _ ) _ )","F#":"let __ mutable __ name:var_name _ = _ value:expression","Common Lisp":"( _ setf __ name:var_name __ value:expression _ )","MiniZinc":"type:type _ : _ name:var_name _ = _ value:expression _ ;","Python,Ruby,Haskell,Erlang,Prolog,Julia,Picat,Octave,Wolfram":"name:var_name _ = _ value:expression","JavaScript,PHP,Hack,Swift":"var __ name:var_name _ = _ value:expression","Lua":"local __ name:var_name _ = _ value:expression","Janus":"local __ type:type __ name:var_name _ = _ value:expression","Perl":"my __ name:var_name _ = _ value:expression","Perl 6":"my __ type:type __ name:var_name _ = _ value:expression","C,Java,C#,C++,D,Dart,EnglishScript,Ceylon,Vala":"type:type __ name:var_name _ = _ value:expression","REBOL":"name:var_name _ : _ value:expression","Visual Basic,Visual Basic .NET,OpenOffice Basic":"Dim __ name:var_name __ As __ type:type _ = _ value:expression","R":"name:var_name _ <- _ value:expression","Fortran":"type:type _ :: _ name:var_name _ = _ value:expression","Chapel,Haxe,Scala,TypeScript":"var __ name:var_name _ : _ type:type _ = _ value:expression","Monkey X":"Local __ name:var_name _ : _ type:type _ = _ value:expression","VBScript":"Dim __ name:var_name __ Set __ name:var_name _ = _ value:expression"},"typeless_initialize_var,name:var_name,value:expression":{"Monkey X":"Local __ name:var_name _ = _ value:expression","Rust":"let __ mut __ name:var_name _ = _ value:expression","R":"name:var_name _ <- _ value:expression","C++,D":"auto __ name:var_name _ = _ value:expression","C#,Dafny,JavaScript,Haxe,PHP,TypeScript,Dart,Swift,Scala,Go,Vala":"var __ name:var_name _ = _ value:expression","Lua":"local __ name:var_name _ = _ value:expression","Python,Ruby,Haskell,Erlang,Prolog,Julia,Picat,Octave,PHP,Wolfram":"name:var_name _ = _ value:expression","C":"__auto_type __ name:var_name _ = _ value:expression","Java":"Object __ name:var_name _ = _ value:expression","C#,JavaScript,Haxe,Swift":"var __ name:var_name _ = _ value:expression","Perl,Perl 6":"my __ name:var_name _ = _ value:expression","REBOL":"name:var_name _ : _ value:expression","Visual Basic .NET":"Dim __ name:var_name _ = _ value:expression","VBScript":"Dim __ name:var_name __ Set __ name:var_name _ = _ value:expression","Polish notation":"= __ name:var_name __ value:expression","Reverse Polish notation":"name:var_name __ value:expression __ ="},"int,t1:type":{"Hack,Dafny,Janus,Chapel,MiniZinc,EngScript,Cython,ALGOL 68,D,Octave,Tcl,crosslanguage,ML,AWK,Julia,Gosu,OCaml,F#,Pike,Objective-C,Go,Cobra,Dart,Groovy,Python,Hy,Java,C#,C,C++,Vala,Nemerle,crosslanguage":"int","PHP,Common Lisp,Picat":"integer","Fortran":"INTEGER","REBOL":"integer!","Ceylon,Gambas,OpenOffice Basic,Pascal,Erlang,Delphi,Visual Basic,Visual Basic .NET":"Integer","Haxe,ooc,Swift,Scala,Perl 6,Z3,Monkey X":"Int","JavaScript,TypeScript,CoffeeScript,Lua,Perl":"number","Haskell":"Num","Ruby":"fixnum"},"char":{"Java,C,C++":"char","Visual Basic .NET,Haskell":"Char","Swift":"Character","REBOL":"char!","Fortran":"CHARACTER","Go":"rune"},"string":{"Z3,Java,Ceylon,Gambas,Dart,Gosu,Groovy,Scala,Pascal,Swift,Ruby,Haxe,Haskell,Visual Basic,Visual Basic .NET,Monkey X":"String","Vala,Octave,Picat,Mathematical notation,Polish notation,Reverse Polish notation,Prolog,D,crosslanguage,Chapel,MiniZinc,Genie,Hack,Nimrod,ALGOL 68,TypeScript,CoffeeScript,Octave,Tcl,AWK,Julia,C#,F#,Perl,Lua,JavaScript,Go,PHP,C++,Nemerle,Erlang":"string","C":"char*","REBOL":"string!","Fortran":"CHARACTER ( LEN = * )","Python,Hy":"str"},"void":{"EngScript,PHP,Hy,Cython,Go,Pike,Objective-C,Java,C,C++,C#,Vala,TypeScript,D,JavaScript,Lua,Dart":"void","Haxe,Swift":"Void","Scala":"Unit"},"boolean":{"TypeScript,Python,Hy,Java,JavaScript,Lua,Perl":"boolean","C++,Octave,Dafny,Chapel,C,crosslanguage,Rust,MiniZinc,EngScript,Dart,D,Vala,crosslanguage,Go,Cobra,C#,F#,PHP,Hack":"bool","Haxe,Haskell,Swift,Julia,Perl 6,Z3,Monkey X":"Bool","Fortran":"LOGICAL","Visual Basic,OpenOffice Basic,Ceylon,Delphi,Pascal,Scala,Visual Basic .NET":"Boolean","REBOL":"logic!"},"double":{"Java,C,C#,C++,Dart":"double","Go":"float64","Haxe":"Float","JavaScript,Lua":"number","Ruby,MiniZinc,PHP,Python":"float","Visual Basic .NET,Swift":"Double","Haskell":"Num","REBOL":"decimal!","Fortran":"double __ precision","Z3":"Real","Octave":"scalar"},"if,c:elif_or_else,b:series_of_statements,a:expression":{"Erlang":"if __ a:expression _ -> _ b:statement __ c:elif_or_else __ end","Fortran":"IF __ a:expression __ THEN __ b:series_of_statements __ c:elif_or_else __ END __ IF","REBOL":"case _ [ _ a:expression _ [ _ b:series_of_statements _ ] _ c:elif_or_else _ ]","Julia":"if __ a:expression __ b:series_of_statements __ c:elif_or_else __ end","Lua,Ruby,Picat":"if __ a:expression __ then __ b:series_of_statements __ c:elif_or_else __ end","Octave":"if __ a:expression __ b:series_of_statements __ c:elif_or_else __ endif","Haskell,Pascal,Delphi,Maxima,OCaml":"if __ a:expression __ then __ b:series_of_statements __ c:elif_or_else","LiveCode":"if __ a:expression __ then __ b:series_of_statements __ c:elif_or_else __ end __ if","Java,E,ooc,EnglishScript,Mathematical notation,Polish notation,Reverse Polish notation,Perl 6,Chapel,Katahdin,Pawn,PowerShell,D,Ceylon,TypeScript,ActionScript,Hack,AutoHotKey,Gosu,Nemerle,Swift,Nemerle,Pike,Groovy,Scala,Dart,JavaScript,C#,C,C++,Perl,Haxe,PHP,R,AWK,Vala,bc,Squirrel":"if _ ( _ a:expression _ ) _ { _ b:series_of_statements _ } _ c:elif_or_else","Rust,Go":"if __ a:expression _ { _ b:series_of_statements _ } _ c:elif_or_else","Visual Basic,Visual Basic .NET":"If __ a:expression __ b:series_of_statements __ c:elif_or_else","CLIPS":"( _ if __ a:expression __ then __ b:series_of_statements __ c:elif_or_else _ )","Z3":"( _ ite __ a:expression __ b:statement __ c:elif_or_else _ )","MiniZinc":"if __ a:expression __ then __ b:series_of_statements __ c:elif_or_else __ endif","Python,Cython":"if __ a:expression _ : _ \\n _ #indent _ \\n _ b:series_of_statements _ \\n _ #unindent _ \\n _ c:elif_or_else","Prolog":"( _ a:expression _ -> _ b:series_of_statements _ ; _ c:elif_or_else _ )","Visual Basic":"If __ a:expression __ Then __ b:series_of_statements __ c:elif_or_else __ End __ If","Common Lisp":"( _ cond _ ( _ a:expression __ b:series_of_statements _ ) __ c:elif_or_else _ )","Wolfram":"If _ [ _ a:expression _ , _ b:series_of_statements _ , _ c:elif_or_else _ ]","Polish notation":"if __ a:expression __ b:series_of_statements","Reverse Polish notation":"a:expression __ b:series_of_statements __ if","Monkey X":"if __ a:expression __ b:series_of_statements __ c:elif_or_else __ EndIf","Clojure":""},"foreach,array:expression,var_name:var_name,typeInArray:type,body:series_of_statements":{"JavaScript,TypeScript":"array:expression _ . _ forEach _ ( _ function _ ( _ var_name:var_name _ ) _ { _ body:series_of_statements _  _ } _ ) _ ;","Octave":"for __ var_name:var_name _ = _ array:expression __ body:series_of_statements __ endfor","Z3":"( _ forall __ ( _ ( _ var_name:var_name __ a _ ) _ ) __ ( _ => _ select __ array:expression _ ) _ )","GAP":"for __ var_name:var_name __ in __ array:expression __ do __ body:series_of_statements __ od;","MiniZinc":"forall _ ( _ var_name:var_name __ in __ array:expression _ ) _ ( _ body:series_of_statements _ )","PHP,Hack":"foreach _ ( _ array:expression __ as __ var_name:var_name _ ) _ { _ body:series_of_statements _ }","Java":"for _ ( _ typeInArray:type __ var_name:var_name _ : _ array:expression _ ) _ { _ body:series_of_statements _ }","C#,Vala":"foreach _ ( _ typeInArray:type __ var_name:var_name __ in __ array:expression _ ) _ { _ body:series_of_statements _ }","Lua":"for __ var_name:var_name __ in __ array:expression __ do __ body:series_of_statements __ end","Python,Cython":"for __ var_name:var_name __ in __ array:expression _ : _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent","Julia":"for __ var_name:var_name __ in __ array:expression __ body:series_of_statements __ end","Chapel,Swift":"for __ var_name:var_name __ in __ array:expression _ { _ body:series_of_statements _ }","Pawn":"foreach _ ( _ new __ var_name:var_name _ : _ array:expression _ ) _ { _ body:series_of_statements _ }","Picat":"foreach _ ( _ var_name:var_name __ in __ array:expression _ ) _ ( _ body:series_of_statements _ ) _ end","AWK,Ceylon":"for __ ( __ var_name:var_name __ in __ array:expression _ ) _ { _ body:series_of_statements _ }","Go":"for __ var_name:var_name _ := _ range __ array:expression _ { _ body:series_of_statements _ }","Haxe,Groovy":"for _ ( _ var_name:var_name __ in __ array:expression _ ) _ { _ body:series_of_statements _ }","Ruby":"array:expression _ . _ each __ do _ | _ var_name:var_name _ | __ body:series_of_statements __ end","Nemerle,PowerShell":"foreach _ ( _ var_name:var_name __ in __ array:expression _ ) _ { _ body:series_of_statements _ }","Scala":"for _ ( _ var_name:var_name _ -> _ array:expression _ ) _ { _ body:series_of_statements _ }","REBOL":"foreach __ var_name:var_name __ array:expression _ [ _ body:series_of_statements _ ]","C++":"for _ ( _ typeInArray:type __ & __ var_name:var_name _ : _ array:expression _ ){ _ body:series_of_statements _ }","Perl":"for __ array:expression _ -> _ var_name:var_name _ { _ body:series_of_statements _ }","D":"foreach _ ( _ var_name:var_name _ , _ array:expression _ ) _ { _ body:series_of_statements _ }","Gambas":"FOR __ EACH __ var_name:var_name __ IN __ array:expression __ body:series_of_statements __ NEXT","Visual Basic .NET":"For __ Each __ var_name:var_name __ As __ typeInArray:type __ In __ array:expression __ body:series_of_statements __ Next","VBScript":"For __ Each __ var_name:var_name __ In __ array:expression __ body:series_of_statements __ Next","Dart":"for _ ( _ var __ var_name:var_name __ in __ array:expression _ ) _ { _ body:series_of_statements _ }"},"compare_ints,var1:Add,var2:Add":{"R":"identical _ ( _ var1:Add _ , _ var2:Add _ )","Lua,Pydatalog,E,Ceylon,Perl 6,EnglishScript,Cython,Mathematical notation,Dafny,Wolfram,D,Rust,R,MiniZinc,Frink,Picat,Pike,Pawn,Processing,C++,Ceylon,CoffeeScript,Octave,Swift,AWK,Julia,Perl,Groovy,Erlang,Haxe,Scala,Java,Vala,Dart,Python,C#,C,Go,Haskell,Ruby":"var1:Add _ == _ var2:Add","JavaScript,PHP,TypeScript,Hack":"var1:Add _ === _ var2:Add","Z3,Emacs Lisp,Common Lisp,CLIPS,Racket":"( _ = __ var1:Factor __ var2:Factor _ )","Fortran":"var1:Add _ .eq. _ var2:Add","Maxima,Monkey X,GAP,REBOL,F#,AutoIt,Pascal,Delphi,Visual Basic,Visual Basic .NET,OCaml,LiveCode,VBScript":"var1:Add _ = _ var2:Add","Prolog":"var1:Add _ =:= _ var2:Add","Clojure":"( _ = __ a __ b _ )","Reverse Polish notation":"a __ b __ =","Polish notation":"= __ a __ b"},"class,name:Identifier,body:class_statements":{"Julia":"type __ name:Identifier __ body:class_statements __ end","C,Z3,Lua,Prolog,Haskell,MiniZinc,R,Go,REBOL,Fortran":"body:function","Java,C#":"public __ class __ name:Identifier _ { _ body:class_statements _ }","C++":"class __ name:Identifier _ { _ body:class_statements _ } _ ;","JavaScript,Hack,PHP,Scala,Haxe,Chapel,Swift,D,TypeScript,Dart,Perl 6":"class __ name:Identifier _ { _ body:class_statements _ }","Ruby":"class __ name:Identifier __ body:class_statements __ end","Visual Basic .NET":"Public __ Class __ name:Identifier __ body:class_statements __ End __ Class","VBScript":"Public __ Class __ name:Identifier __ body:class_statements __ End __ Class","Python":"class __ name:Identifier _ : _ \\n _ #indent _ \\n _ body:class_statements _ \\n _ #unindent","Monkey X":"Class __ name:Identifier __ body:class_statements __ End"},"class_extends,c1:Identifier,c2:Identifier,b:class_statements":{"Python":"class __ c1:Identifier _ ( _ c2:Identifier _ ) _ : _ \\n _ #indent _ \\n _ b:class_statements _ \\n _ #unindent","Visual Basic .NET":"Public __ Class __ c1:Identifier __ Inherits __ c2:Identifier __ b:class_statements __ End __ Class","Swift,Chapel,D,Swift":"class __ c1:Identifier _ : _ c2:Identifier _ { _ b:class_statements _ }","Haxe,PHP,JavaScript,Dart,TypeScript":"class __ c1:Identifier __ extends __ c2:Identifier _ { _ b:class_statements _ }","Java,C#,Scala":"public __ class __ c1:Identifier __ extends __ c2:Identifier _ { _ b:class_statements _ }","C":"#include __ ' _ c2:Identifier _ .h' __ b:class_statements","C++":"class __ c1:Identifier _ : _ public __ c2:Identifier _ { _ b:class_statements _ }","Ruby":"class __ c1:Identifier __ < __ c2:Identifier __ b:class_statements __ end","Perl 6":"class __ c1:Identifier __ is __ c2:Identifier _ { _ b:class_statements _ }","Monkey X":"Class __ c1:Identifier __ Extends __ c2:Identifier __ b:class_statements __ End"},"function_parameter,type:type,name:var_name":{"crosslanguage":"( _ parameter __ type:type __ name:var_name _ )","C#,Java,EnglishScript,Ceylon,ALGOL 68,Groovy,D,C++,Pawn,Pike,Vala,C,Janus":"type:type __ name:var_name","Haxe,Dafny,Chapel,Pascal,Rust,Genie,Hack,Nimrod,TypeScript,Gosu,Delphi,Nemerle,Scala,Swift":"name:var_name _ : _ type:type","Go":"name:var_name __ type:type","MiniZinc":"var __ type:type _ : _ name:var_name","Haskell,Polish notation,Reverse Polish notation,Scheme,Python,Mathematical notation,LispyScript,CLIPS,Clojure,F#,ML,Racket,OCaml,Tcl,Common Lisp,newLisp,Python,Cython,Frink,Picat,IDP,PowerShell,Maxima,Icon,CoffeeScript,Fortran,Octave,AutoHotKey,Prolog,AWK,Kotlin,Dart,JavaScript,Nemerle,Erlang,PHP,AutoIt,Lua,Ruby,R,bc":"name:var_name","Julia":"name:var_name _ :: _ type:type","REBOL":"type:type _ [ _ name:var_name _ ]","OpenOffice Basic,Gambas":"name:var_name __ As __ type:type","Visual Basic,Visual Basic .NET":"name:var_name __ as __ type:type","Perl":"name:var_name _ = _ push _ ;","Wolfram":"name:var_name _","Z3":"( _ name:var_name __ type:type _ )"},"switch,a:expression,b:case_statements,c:default":{"crosslanguage":"( _ switch __ a:expression __ b:case_statements __ c:default _ )","Rust":"match __ a:expression _ { _ b:case_statements __ c:default _ }","OCaml":"match __ a:expression __ with","Elixir":"case __ a:expression __ do __ b:case_statements __ c:default __ end","Scala":"a:expression __ match _ { _ b:case_statements __ c:default _ }","Octave":"switch _ ( _ a:expression _ ) _ b:case_statements __ endswitch","Java,D,PowerShell,Nemerle,D,TypeScript,Hack,Swift,Groovy,Dart,AWK,C#,JavaScript,C++,PHP,C,Go,Haxe,Vala":"switch _ ( _ a:expression _ ) _ { _ b:case_statements __ c:default _ }","Ruby":"case __ a:expression __ b:case_statements __ c:default __ end","Haskell,Erlang":"case __ a:expression __ of __ b:case_statements __ c:default __ end","Delphi,Pascal":"Case __ a:expression __ of __ b:case_statements __ c:default __ end;","CLIPS":"( _ switch __ a:expression __ b:case_statements __ c:default _ )","Visual Basic .NET,Visual Basic":"Select __ Case __ a:expression __ b:case_statements __ c:default __ End __ Select","REBOL":"switch/default _ [ _ a:expression __ b:case_statements _ ]","Fortran":"SELECT __ CASE _ ( _ a:expression _ ) __ b:case_statements __ c:default __ END __ SELECT","Clojure":"( _ case __ a:expression __ b:case_statements __ c:default _ )","Chapel":"select _ ( _ a:expression _ ) _ { _ b:case_statements _ c:default _ }","Wolfram":"Switch _ [ _ a:expression _ , _ b:case_statements _ , _ c:default _ ]"},"case,a:expression,b:series_of_statements":{"crosslanguage":"( _ case __ a:expression __ b:series_of_statements _ )","JavaScript,D,Java,C#,C,C++,TypeScript,Dart,PHP,Hack":"case __ a:expression _ : _ b:series_of_statements _ break _ ;","Go,Haxe,Swift":"case __ a:expression _ : _ b:series_of_statements","Fortran":"CASE _ ( _ a:expression _ ) __ b:series_of_statements","Rust":"a:expression _ => _ { _ b:series_of_statements _ }","Ruby":"when __ a:expression __ b:series_of_statements","Haskell,Erlang,Elixir,OCaml":"a:expression _ -> _ b:series_of_statements","CLIPS":"( _ case __ a:expression __ then __ b:series_of_statements _ )","Scala":"case __ a:expression _ => _ b:series_of_statements","Visual Basic .NET":"Case __ a:expression __ b:series_of_statements","REBOL":"a:expression _ [ _ b:series_of_statements _ ]","Octave":"case __ a:expression __ b:series_of_statements","Clojure":"( _ a:expression __ b:series_of_statements _ )","Pascal,Delphi:":"a:expression _ : _ b:series_of_statements","Chapel":"when __ a:expression _ { _ b:series_of_statements _ }","Wolfram":"a:expression _ , _ b:series_of_statements"},"access_array,a:Identifier,b:(array_access_index/array_access_list)":{"Python,Lua,C#,Julia,D,Swift,Julia,Janus,MiniZinc,Picat,Nimrod,AutoIt,Cython,CoffeeScript,Dart,TypeScript,AWK,Vala,Perl,Java,JavaScript,Ruby,Go,C++,PHP,Haxe,C":"a:Identifier _ [ _ b:(array_access_index/array_access_list) _ ]","Scala,Octave,Fortran,Visual Basic,Visual Basic .NET":"a:Identifier _ ( _ b:(array_access_index/array_access_list) _ )","Haskell":"( _ a:Identifier _ !! _ b:(array_access_index/array_access_list) _ )","Frink":"a:Identifier _ @ _ b:(array_access_index/array_access_list)","Z3":"( _ select __ a:Identifier __ b:expression _ )","REBOL":"a:Identifier _ / _ b:(array_access_index/array_access_list)"},"array_access_list,var1:array_access_index,var2:array_access_list,separator:array_access_separator":{"Java,Octave,Picat,Julia,Go,C#,Lua,C++,Python,JavaScript,C,PHP,Ruby,Scala,Haxe,Fortran,TypeScript,MiniZinc,Dart,Visual Basic .NET,Perl,Swift,Haskell,REBOL":"var1:array_access_index _ separator:array_access_separator _ var2:array_access_list"},"array_access_separator":{"C#,MiniZinc,Fortran,Julia,Visual Basic,Visual Basic .NET,Octave":",","Python,Pydatalog,D,Lua,Picat,Janus,Nimrod,AutoIt,Cython,CoffeeScript,Dart,TypeScript,AWK,Vala,Perl,Java,JavaScript,Ruby,Go,C++,PHP,Haxe,C,Swift":"][","Haskell":"!!","Scala":")(","Frink":"@","REBOL":"/"},"array_access_index,a:expression":{"Lua,MiniZinc,REBOL":"a:array_access_index_2","Haskell,D,Frink,C#,Visual Basic,Janus,Visual Basic .NET,Scala,Octave,Fortran,Python,Swift,Julia,Picat,Nimrod,AutoIt,Cython,CoffeeScript,Dart,TypeScript,AWK,Vala,Perl,Java,JavaScript,Ruby,Go,C++,PHP,Haxe,C":"a:array_access_index_1"},"array_access_index_1,a:expression":{"Lua,MiniZinc,REBOL":"a:expression _ + _ 1","Haskell,D,Frink,C#,Visual Basic,Janus,Visual Basic .NET,Scala,Octave,Fortran,Python,Swift,Julia,Picat,Nimrod,AutoIt,Cython,CoffeeScript,Dart,TypeScript,AWK,Vala,Perl,Java,JavaScript,Ruby,Go,C++,PHP,Haxe,C":"a:expression"},"array_access_index_2,a:expression":{"Lua,MiniZinc,REBOL":"a:expression","Haskell,D,Frink,C#,Visual Basic,Janus,Visual Basic .NET,Scala,Octave,Fortran,Python,Swift,Julia,Picat,Nimrod,AutoIt,Cython,CoffeeScript,Dart,TypeScript,AWK,Vala,Perl,Java,JavaScript,Ruby,Go,C++,PHP,Haxe,C":"a:expression _ - _ 1"},"initialize_static_variable,type:type,name:var_name":{"Swift":"static __ var __ name:var_name","Java,C#":"public __ static __ type:type __ name:var_name","PHP":"public __ static __ name:var_name","C++,Dart":"static __ type:type __ name:var_name","Python":"_","Haxe":"static __ var __ name:var_name _ : _ type:type","Ruby":"__","Visual Basic .NET":"Public __ Shared __ name:var_name __ As __ type:type"},"initialize_static_variable_with_value,type:type,name:var_name,value:expression":{"Swift":"static __ var __ name:var_name _ = _ value:expression","Java,C#":"public __ static __ type:type __ name:var_name _ = _ value:expression","PHP":"public __ static __ name:var_name _ = _ value:expression","C++,Dart":"static __ type:type __ name:var_name _ = _ value:expression","Python":"name:var_name _ = _ value:expression","Ruby":"@@ _ name:var_name _ = _ type:type","Haxe":"static __ var __ name:var_name _ : _ type:type _ = _ value:expression","Visual Basic .NET":"Public __ Shared __ name:var_name __ As __ type:type _ = _ value:expression"},"default,a:series_of_statements":{"Fortran":"CASE __ DEFAULT __ a:series_of_statements","crosslanguage":"( _ default __ a:series_of_statements _ )","JavaScript,D,C,Java,C#,C++,TypeScript,Dart,PHP,Haxe,Hack,Go,Swift":"default _ : _ a:series_of_statements","Ruby,Pascal,Delphi":"else __ a:series_of_statements","Haskell,Erlang,OCaml":"_ _ -> __ a:series_of_statements","Rust":"_ _ => _ a:series_of_statements","CLIPS":"( _ default __ a:series_of_statements _ )","Scala":"case __ _ => _ a:series_of_statements","Visual Basic .NET":"Case __ Else __ a:series_of_statements","REBOL":"][ a:series_of_statements","Octave":"otherwise __ a:series_of_statements","Chapel":"otherwise _ { _ a:series_of_statements _ }","Clojure":"a:series_of_statements","Wolfram":"_ _ , _ a:series_of_statements"},"":{},"grammar_statement":{"Nearley":"name:Identifier _ -> _ value:grammar_Or","Parslet":"rule _ ( _ : _ name:Identifier _ ) _ { _ value:grammar_Or _ }","Marpa":"name:Identifier _ ::= _ value:grammar_Or","EBNF":"name:Identifier _ = _ value:grammar_Or _ ;","Yacc":"name:Identifier _ : _ value:grammar_Or _ ;","PEG.js,LPeg":"name:Identifier _ = _ value:grammar_Or","Wirth syntax notation":"name:Identifier _ = _ value:grammar_Or _ .","Perl 6":"token __ name:Identifier _ { _ value:grammar_Or _ }","Prolog":"name:Identifier _ --> _ value:grammar_Or _ .","REBOL":"name:Identifier _ : __ value:grammar_Or"},"statement":{"Lua":"a:(if/import/while/for/function/statement_with_semicolon/comment/multiline_comment)","Octave":"a:(if/import/while/foreach/function/statement_with_semicolon/comment/multiline_comment)","MiniZinc":"a:(if/function/foreach/statement_with_semicolon/comment)","EnglishScript,VBScript,Java,Scala,Python,Dart,JavaScript,TypeScript,C#,PHP,Haxe,Ruby,C++,Visual Basic .NET,Go,Swift,REBOL,Fortran":"a:(function/foreach/import/switch/if/class/class_extends/enum/while/for/statement_with_semicolon/comment/multiline_comment)","C,R,Julia,Perl":"a:(if/import/while/for/function/statement_with_semicolon/comment/multiline_comment)","Picat":"a:(if/import/while/for/statement_with_semicolon/comment/multiline_comment)","Z3,Prolog,Haskell,Erlang,Common Lisp,Emacs Lisp,MiniZinc":"a:(function/import/if/statement_with_semicolon/comment/multiline_comment)","Mathematical notation,Polish notation,Reverse Polish notation":"a:(function/if/statement_with_semicolon)"},"statement_with_semicolon":{"C,PHP,Dafny,Chapel,Katahdin,Frink,Falcon,Aldor,IDP,Processing,Maxima,Seed7,Drools,EngScript,OpenOffice Basic,Ada,ALGOL 68,D,Ceylon,Rust,TypeScript,Octave,AutoHotKey,Pascal,Delphi,JavaScript,Pike,Objective-C,OCaml,Java,Scala,Dart,PHP,C#,C++,Haxe,AWK,bc,Perl,Perl 6,Nemerle,Vala":"var1:(print/set_var/plus_equals/minus_equals/exception/declare_constant/initialize_var/declare_new_object/typeless_initialize_var/set_array_size/initialize_empty_var/return/function_call) ;","MiniZinc":"var1:(return/initialize_var/initialize_empty_var/declare_constant/set_var/import/set_array_size)","Visual Basic .NET,Lua,Swift,REBOL,Fortran,Python,Go,Picat,Julia":"var1:(print/set_var/plus_equals/minus_equals/exception/declare_constant/initialize_var/declare_new_object/typeless_initialize_var/set_array_size/initialize_empty_var/return/function_call)","Prolog":"var1:(print/declare_constant/initialize_var/typeless_initialize_var/return/function_call)","Mathematical notation,Polish notation,Reverse Polish notation":"var1:(function_call)","Z3":"var1:(print/declare_constant/initialize_empty_var/set_var/return)","Ruby":"var1:(print/set_var/initialize_empty_var/plus_equals/minus_equals/declare_constant/initialize_var/typeless_initialize_var/return/function_call)","Haskell,Erlang,Common Lisp":"var1:(print/function_call/return)"},"one_or_more":{"Marpa":"( _ a:grammar_expression _ ) _ +"},"grammar_optional":{"pypeg":"optional _ ( _ a:grammar_expression _ )"},"grammar_parameter":{"PEG.js":"name:Identifier _ : _ type:Identifier","LPeg":"lpeg.V\" _ type:Identifier _ \"","Parslet":"type:Identifier _ . _ as _ ( _ name:Identifier _ )","Marpa,Yacc,EBNF,REBOL,Prolog":"type:Identifier","Perl 6":"< _ type:Identifier _ >"},"nameless_grammar_parameter":{"PEG.js,Parslet,nearley,Marpa,Yacc,EBNF,REBOL,Prolog":"type:Identifier","LPeg":"lpeg.V\" _ type:Identifier _ \"","Perl 6":"< _ type:Identifier _ >"},"grammar_string_literal":{"PEG.js,LPeg,Marpa,Yacc,EBNF,REBOL":"the_str:string_literal","Parslet":"str _ ( _ the_str:string_literal _ )"},"initialize_instance_variable":{"Java,C#":"private __ type:type __ name:var_name","PHP":"private __ name:var_name","C++,D":"type:type __ name:var_name","Haxe,Swift":"var __ name:var_name _ : _ type:type","Visual Basic .NET":"Private __ name:var_name __ As __ type:type","VBScript":"Private __ name:var_name"},"initialize_instance_variable_with_value":{"Java,C#":"private __ type:type __ name:var_name _ = _ value:expression","PHP":"private __ name:var_name _ = _ value:expression","C++":"type:type __ name:var_name _ = _ value:expression","Python":"self _ . _ name:var_name _ = _ value:expression","Haxe,Swift":"var __ name:var_name _ : _ type:type _ = _ value:expression","Ruby":"@ _ name:var_name _ = _ value:expression","Visual Basic .NET":"Private __ name:var_name __ As __ type:type _ = _ value:expression"},"enum":{"C":"typedef __ enum _ { _ body:enum_list _ } _ name:Identifier _ ;","Ada":"type __ name:Identifier __ is __ ( _ body:enum_list _ ) _ ;","Perl 6":"enum __ name:Identifier __ < _ body:enum_list _ > _ ;","Python":"class __ name:Identifier _ ( _ AutoNumber _ ) _ : _ \\n _ #indent _ \\n _ b _ \\n _ #unindent","Java":"public __ enum __ name:Identifier _ { _ body:enum_list _ }","C#,C++,TypeScript":"enum __ name:Identifier _ { _ body:enum_list _ } _ ;","Haxe,Rust,Swift,Vala":"enum __ name:Identifier _ { _ body:enum_list _ }","Swift":"enum __ name:Identifier _ { _ case __ body:enum_list _ }","Visual Basic .NET":"Enum __ name:Identifier __ body:enum_list __ End __ Enum","Fortran":"ENUM _ :: _ name:Identifier __ body:enum_list __ END __ ENUM","Go":"type __ name:Identifier __ int __ const _ ( __ body:enum_list __ )","Scala":"object __ name:Identifier __ extends __ Enumeration _ { _ val __ body:enum_list _ = _ Value _ }"},"_enum_list":{"Java,Perl 6,Swift,C++,C#,Visual Basic .NET,Haxe,Fortran,TypeScript,C,Ada,Scala":"a:Identifier","Go":"a:Identifier _ = _ iota","Python":"a:Identifier _ = _ ( _ )"},"enum_list":{"Java,C++,C#,C,TypeScript,Fortran,Ada,Scala":"a:_enum_list _ , _ b:enum_list","Haxe":"a:_enum_list _ ; _ b:enum_list","Go,Perl 6,Swift,Visual Basic .NET":"a:_enum_list __ b:enum_list"},"list_comprehension":{"Python,Cython":"[ _ result:expression __ for __ variable:var_name __ in __ array:expression __ if __ condition:expression _ ]","Ceylon":"{ _ for _ ( _ variable:var_name __ in __ array:expression _ ) __ if _ ( _ condition:expression _ ) __ result:expression _ }","JavaScript":"[ _ result:expression __ for _ ( _ variable:var_name __ of __ array:expression _ ) _ if __ condition:expression _ ]","CoffeeScript":"( _ result:expression __ for __ variable:var_name __ in __ array:expression __ when __ condition:expression _ )","MiniZinc":"[ _ result:expression _ | _ variable:var_name __ in __ array:expression __ where __ condition:expression _ ]","Haxe":"[ _ for _ ( _ variable:var_name __ in __ array:expression _ ) _ if _ ( _ condition:expression _ ) _ result:expression _ ]","C#":"( _ from __ variable:var_name __ in __ array:expression __ where __ condition:expression __ select __ result:expression _ )","Haskell":"[ _ result:expression _ | _ variable:var_name _ <- _ array:expression _ , _ condition:expression _ ]","Erlang":"[ _ result:expression _ || _ variable:var_name _ <- _ array:expression _ , _ condition:expression _ ]","Ruby":"array:expression _ . _ select _ { _ | _ variable:var_name _ | _ condition:expression _ } _ . _ collect _ { _ | _ variable:var_name _ | _ result:expression _ }","Scala":"( _ for _ ( _ variable:var_name _ <- _ array:expression __ if __ condition:expression _ ) _ yield __ result:expression _ )","Groovy":"array.grep _ { _ variable:var_name _ -> _ condition:expression _ }.collect _ { _ variable:var_name _ -> _ result:expression _ }","Dart":"array:expression _ . _ where _ ( _ variable:var_name _ => _ condition:expression _ ) _ . _ map _ ( _ variable:var_name _ => _ result:expression _ )","Picat":"[ _ result:expression _ : _ variable:var_name __ in __ array:expression _ , _ condition:expression _ ]"},"array_type":{"Java,C,C#,Haxe,C++":"var1:_type var2:array_type_suffix","MiniZinc":"array _ [ _ var1:_type _ ] __ of __ var1:_type","Go":"var2:array_type_suffix var1:_type","Dart":"array_type _ = _ List< _ var1:_type _ >","Swift":"[ _ var1:_type _ ]","Z3":"( _ Array __ var1:_type __ var1:_type _ )","Python,Picat":"var1:\"list\"","Lua":"var1:\"table\"","JavaScript,Ruby":"var1:\"Array\"","PHP":"var1:\"array\"","REBOL":"var1:\"block!\"","Octave":"var1:\"matrix\"","Erlang":"var1:\"List\""},"constructor":{"REBOL":"new: __ func _ [ _ params:function_parameters _ ] _ [ _ make __ self _ [ _ body:series_of_statements _ ] _ ]","crosslanguage":"( _ constructor __ name:Identifier __ params:function_parameters __ body:series_of_statements _ )","Visual Basic .NET":"Sub __ New _ ( _ params:function_parameters _ ) __ body:series_of_statements __ End __ Sub","Python":"def __ __init__ _ ( _  _ self _ , _ params:function_parameters _ ) _ : _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent","Java,C#":"public __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Swift":"init _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","JavaScript":"constructor _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Ruby":"def __ initialize _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","PHP":"function __ construct _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Perl":"sub __ new _ { _ body:series_of_statements _ }","Haxe":"public __ function __ new _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","C++,Dart":"name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","D":"this _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Chapel":"proc __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Julia":"function __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end"},"set_array_size":{"Scala":"var __ name:var_name _ = _ Array _ . _ fill _ ( _ size:expression _ ) _ { _ 0 _ }","Octave":"name:var_name _ = _ zeros _ ( _ size:expression _ )","MiniZinc":"array _ [ _ 1 _ .. _ size:expression _ ] __ of __ type:_type _ : _ name:var_name _ ;","Dart":"List __ name:var_name _ = _ new __ List _ ( _ size:expression _ )","Java,C#":"type:_type _ [] __ name:var_name _  _ = _ new __ type:_type _ [ _ size:expression _ ]","Fortran":"type:_type _ ( _ LEN _ = _ size:expression _ ) _  _ :: _ name:var_name","Go":"var __ name:var_name __ [ _ size:expression _ ] _ type:_type","Swift":"var __ name:var_name _ = _ [ _ type:_type _ ] _ ( _ count: _ size:expression _ , _ repeatedValue _ : _ 0 _ )","C,C++":"type:_type __ name:var_name _ [ _ size:expression _ ]","REBOL":"name:var_name _ : _ array __ size:expression","Visual Basic .NET":"Dim __ name:var_name _ ( _ size:expression _ ) __ as __ type:_type","PHP":"name:var_name _ = _ array_fill _ ( _ 0 _ , _ size:expression _ , _ 0 _ )","Haxe":"var __ vector _ = _  __ haxe _ . _ ds _ . _ Vector _ ( _ size:expression _ )","JavaScript":"var __ name:var_name _ = _ Array _ . _ apply _ ( _ null _ , _ Array _ ( _ size:expression _ ) _ ) _ . _ map _ ( _ function _ ( _ ) _ { _ } _ )","VBScript":"Dim __ name:var_name _ ( _ size:expression _ )"},"typeless_parameter":{"Haskell,LiveCode,TypeScript,Visual Basic .NET,REBOL,Prolog,Haxe,Scheme,Python,Mathematical notation,LispyScript,CLIPS,Clojure,F#,ML,Racket,OCaml,Tcl,Common Lisp,newLisp,Python,Cython,Frink,Picat,IDP,PowerShell,Maxima,Icon,CoffeeScript,Fortran,Octave,AutoHotKey,Julia,Prolog,AWK,Kotlin,Dart,JavaScript,Nemerle,Erlang,PHP,AutoIt,Lua,Ruby,R,bc":"name:var_name","Java,C#":"Object __ name:var_name","C++":"auto __ name:var_name","Perl":"name:var_name _ = _ push _ ;"},"asin":{"Java,JavaScript,Ruby,Haxe,TypeScript":"Math _ . _ asin _ ( _ a:expression _ )","Python,Lua":"math _ . _ asin _ ( _ a:expression _ )","Perl,C,Fortran,D,PHP,Hack,Dart,Scala":"asin _ ( _ a:expression _ )","C#,Visual Basic,Visual Basic .NET":"Math _ . _ Asin _ ( _ a:expression _ )","Gambas":"Asin _ ( _ a:expression _ )","Erlang":"math _ : _ asin _ ( _ a:expression _ )","C++":"std _ :: _ asin _ ( _ a:expression _ )","Wolfram":"ArcSin _ [ _ a:expression _ ]","Common Lisp,Racket":"( _ asin __ a:expression _ )","Clojure":"( _ Math/asin __ a:expression _ )"},"typeless_function":{"Visual Basic .NET,VBScript":"Function __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ End __ Function","JavaScript,PHP,TypeScript":"function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Python":"def __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent","EnglishScript":"def __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ \\n _ body:series_of_statements _ \\n _ end","REBOL":"name:Identifier _ : __ func _ [ _ params:function_parameters _ ] _ [ _ body:series_of_statements _ ]","C#":"public __ static __ object __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","C++,D":"auto __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Java":"public __ static __ Object __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Ruby":"def __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","Perl":"sub __ name:Identifier _ { _ params:function_parameters _ body:series_of_statements _ }","Lua":"function __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","Octave":"function __ retval _ = _ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ endfunction","Prolog":"name:Identifier _ ( _ params:function_parameters _ ) __ :- __ body:series_of_statements _ .","Picat":"name:Identifier _ ( _ params:function_parameters _ ) _ = _ retval _ => _ body:series_of_statements _ .","Erlang":"name:Identifier _ ( _ params:function_parameters _ ) _ -> _ body:series_of_statements _ .","Haxe":"static __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Wolfram":"name:Identifier _ [ _ params:function_parameters _ ] _ := _ [ _ body:series_of_statements _ ]","Dart":"name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Haskell":"name:Identifier __ params:function_parameters _ = _ body:statement","Pydatalog":"name:Identifier _ [ _ params:function_parameters _ ] _ = _ body:series_of_statements","Emacs Lisp":"( _ defun __ name:Identifier __ ( _ params:function_parameters _ ) __ body:series_of_statements _ )"},"acos":{"Java,JavaScript,Ruby,Haxe,TypeScript":"Math _ . _ acos _ ( _ a:expression _ )","C#,Visual Basic,Visual Basic .NET":"Math _ . _ Acos _ ( _ a:expression _ )","Python,Lua":"math _ . _ acos _ ( _ a:expression _ )","Perl,C,Fortran,D,PHP,Scala":"acos _ ( _ a:expression _ )","Gambas":"Acos _ ( _ a:expression _ )","C++":"std _ :: _ acos _ ( _ a:expression _ )","Erlang":"math _ : _ acos _ ( _ a:expression _ )","Wolfram":"ArcCos _ [ _ a:expression _ ]","Common Lisp,Racket":"( _ acos __ a:expression _ )","Clojure":"( _ Math/acos __ a:expression _ )"},"atan":{"Java,JavaScript,Ruby,Haxe,TypeScript":"Math _ . _ atan _ ( _ a:expression _ )","Python,Lua":"math _ . _ atan _ ( _ a:expression _ )","Erlang":"math _ : _ atan _ ( _ a:expression _ )","Perl,C,Fortran,D,PHP,Scala":"atan _ ( _ a:expression _ )","C#,Visual Basic,Visual Basic .NET":"Math _ . _ Atan _ ( _ a:expression _ )","Gambas":"Atan _ ( _ a:expression _ )","C++":"std _ :: _ atan _ ( _ a:expression _ )","Wolfram":"ArcTan _ [ _ a:expression _ ]","Common Lisp,Racket":"( _ atan __ a:expression _ )","Clojure":"( _ Math/atan __ a:expression _ )"},"less_than":{"Pascal,Pydatalog,E,VBScript,LiveCode,Monkey X,Perl 6,EnglishScript,Cython,GAP,Mathematical notation,Wolfram,Chapel,Elixir,Katahdin,Frink,MiniZinc,Picat,Java,ECLiPSe,D,ooc,Genie,Janus,PL/I,IDP,Processing,Maxima,Seed7,Self,GNU Smalltalk,Drools,Standard ML,Oz,Cobra,Pike,EngScript,Kotlin,Pawn,FreeBASIC,MATLAB,Ada,FreeBASIC,Gosu,Gambas,Nimrod,AutoIt,ALGOL 68,Ceylon,Groovy,Rust,CoffeeScript,TypeScript,Fortran,Octave,ML,Hack,AutoHotKey,Scala,Delphi,Tcl,Swift,Vala,C,F#,C++,Dart,JavaScript,REBOL,Julia,Erlang,OCaml,crosslanguage,C#,Nemerle,AWK,Java,Lua,Perl,Haxe,Python,PHP,Haskell,Go,Ruby,R,bc,Visual Basic,Visual Basic .NET":"a:Add _ < _ b:Add","Prolog":"a:Add _ #< _ b:Add","Racket,Z3,CLIPS,GNU Smalltalk,newLisp,Hy,Common Lisp,Emacs Lisp,Clojure,Sibilant,LispyScript":"( _ < __ a:Factor __ b:Factor _ )","English":"a:Add __ is __ less __ than __ b:Add","Polish notation":"< __ a:Add __ b:Add","Reverse Polish notation":"a:Add __ b:Add __ <"},"less_than_or_equal":{"C,Pydatalog,VBScript,LiveCode,Monkey X,EnglishScript,GAP,Dafny,Janus,Perl 6,Wolfram,Chapel,Fortran,Elixir,Frink,Mathematical notation,MiniZinc,Picat,ooc,Genie,PL/I,IDP,Processing,EngScript,Maxima,GNU Smalltalk,Pyke,Self,Boo,Cobra,Standard ML,Prolog,Kotlin,Pawn,FreeBASIC,Ada,MATLAB,ALGOL 68,Gambas,Nimrod,Gosu,AutoIt,Ceylon,D,Groovy,Rust,CoffeeScript,TypeScript,Octave,Hack,AutoHotKey,Julia,Scala,Pascal,Delphi,Swift,Visual Basic,F#,Objective-C,Pike,Python,Cython,Oz,ML,Vala,Dart,C++,Java,OCaml,REBOL,C#,Nemerle,Ruby,PHP,Lua,Visual Basic .NET,Haskell,Haxe,Perl,JavaScript,R,AWK,crosslanguage,Go":"a:Add _ <= _ b:Add","Erlang":"a:Add _ =< _ b:Add","Racket,Z3,CLIPS,newLisp,Hy,Sibilant,LispyScript,Scheme,Clojure,Common Lisp,Emacs Lisp,crosslanguage":"( _ <= __ a:Factor __ b:Factor _ )","English":"a:Add __ is __ less __ than __ or __ equal __ to __ b:Add","Polish notation":"<= __ a:Add __ b:Add","Reverse Polish notation":"a:Add __ b:Add __ <="},"Multiply":{"C,Pydatalog,E,LiveCode,VBScript,Monkey X,Perl 6,EnglishScript,Cython,Agda,GAP,POP-11,Dafny,Wolfram,Chapel,Katahdin,Mathematical notation,Frink,MiniZinc,COBOL,ooc,Genie,B-Prolog,ECLiPSe,Elixir,nools,Pyke,Picat,PL/I,REXX,IDP,Falcon,Processing,Maxima,Sympy,Mercury,Self,GNU Smalltalk,Boo,Drools,Seed7,Occam,Standard ML,EngScript,Pike,Oz,Kotlin,Pawn,MATLAB,Ada,PowerShell,Gosu,AWK,Gambas,Nimrod,AutoHotKey,Julia,OpenOffice Basic,ALGOL 68,D,Groovy,Ceylon,Rust,CoffeeScript,ActionScript,TypeScript,Fortran,Octave,ML,Haxe,Pascal,Delphi,Swift,Nemerle,Vala,R,Red,C++,Erlang,Scala,AutoIt,Cobra,F#,Perl,PHP,Go,Ruby,Lua,Haskell,Hack,Java,OCaml,REBOL,Python,JavaScript,C#,Visual Basic,Visual Basic .NET,Dart":"a:Factor _ symbol:(\"*\"/\"/\") _ b:Multiply","Racket,Z3,crosslanguage,Common Lisp,CLIPS,newLisp,Hy,Scheme,Clojure,Common Lisp,Emacs Lisp,Sibilant,LispyScript":"( _ symbol:(\"*\"/\"/\") __ a:Factor __ b:Factor _ )","Prolog":"a:Factor _ symbol:\"#*\"/\"#/\" _ b:Multiply","Polish notation":"symbol:(\"*\"/\"/\") __ a:Factor __ b:Multiply","Reverse Polish notation":"a:Factor __ b:Multiply __ symbol:(\"*\"/\"/\")"},"Add":{"Java,Pydatalog,E,LiveCode,VBScript,Monkey X,EnglishScript,GAP,POP-11,Dafny,Janus,Wolfram,Chapel,Bash,Perl 6,Mathematical notation,Katahdin,Frink,MiniZinc,Aldor,COBOL,ooc,Genie,ECLiPSe,nools,B-Prolog,Agda,Picat,PL/I,REXX,IDP,Falcon,Processing,Sympy,Maxima,Pyke,Elixir,GNU Smalltalk,Seed7,Standard ML,Occam,Boo,Drools,Icon,Mercury,EngScript,Pike,Oz,Kotlin,Pawn,FreeBASIC,Ada,PowerShell,Gosu,Nimrod,Cython,OpenOffice Basic,ALGOL 68,D,Ceylon,Rust,CoffeeScript,ActionScript,TypeScript,Fortran,Octave,ML,AutoHotKey,Delphi,Pascal,F#,Self,Swift,Nemerle,Dart,C,AutoIt,Cobra,Julia,Groovy,Scala,OCaml,Erlang,Gambas,Hack,C++,MATLAB,REBOL,Red,Lua,Go,AWK,Haskell,Perl,Python,JavaScript,C#,PHP,Ruby,R,Haxe,Visual Basic,Visual Basic .NET,Vala,bc":"a:Multiply _ symbol:(\"+\"/\"-\") _ b:Add","Prolog":"a:Multiply _ symbol:\"#+\"/\"#-\" _ b:Add","Racket,Z3,crosslanguage,Common Lisp,CLIPS,newLisp,Hy,Scheme,Clojure,Common Lisp,Emacs Lisp,Sibilant,LispyScript":"( _ symbol:(\"+\"/\"-\") __ a:Factor __ b:Factor _ )","Polish notation":"symbol:(\"+\"/\"-\") __ a:Multiply __ b:Add","Reverse Polish notation":"a:Multiply __ b:Add __ symbol:(\"+\"/\"-\")"},"greater_than_or_equal":{"C,Pydatalog,VBScript,LiveCode,Monkey X,EnglishScript,GAP,Dafny,Perl 6,Wolfram,Chapel,Frink,Mathematical notation,MiniZinc,Picat,ooc,Genie,PL/I,IDP,Processing,EngScript,Maxima,GNU Smalltalk,Pyke,Self,Boo,Cobra,Standard ML,Prolog,Kotlin,Pawn,FreeBASIC,Ada,MATLAB,ALGOL 68,Gambas,Nimrod,Gosu,AutoIt,Ceylon,D,Groovy,Rust,CoffeeScript,TypeScript,Octave,Hack,AutoHotKey,Julia,Scala,Pascal,Delphi,Swift,Visual Basic,F#,Objective-C,Pike,Python,Cython,Oz,ML,Vala,Dart,C++,Java,OCaml,REBOL,Erlang,C#,Nemerle,Ruby,PHP,Lua,Visual Basic .NET,Haskell,Haxe,Perl,JavaScript,R,AWK,crosslanguage,Go,Janus":"a:Add _ >= _ b:Add","Fortran":"a:Add __ .GE. __ b:Add","Racket,Z3,crosslanguage,Common Lisp,CLIPS,newLisp,Hy,Scheme,Clojure,Common Lisp,Emacs Lisp,Sibilant,LispyScript":"( _ >= __ a:Factor __ b:Factor _ )","Polish notation":">= __ a:Add __ b:Add","Reverse Polish notation":"a:Add __ b:Add __ >="},"function_call_parameters":{"JavaScript,Wolfram,D,Frink,Delphi,EngScript,Chapel,Perl,Swift,Perl 6,OCaml,Janus,Mathematical notation,Pascal,Rust,Picat,AutoHotKey,Maxima,Octave,Julia,R,Prolog,Fortran,Go,MiniZinc,Erlang,CoffeeScript,PHP,Hack,Java,C#,C,C++,Lua,TypeScript,Dart,Ruby,Python,Haxe,Scala,Visual Basic,Visual Basic .NET':":"var1:(function_call_named_parameter/expression) _ , _ var2:function_call_parameters","Hy,crosslanguage,Coq,Scheme,Racket,Common Lisp,CLIPS,REBOL,Haskell,Racket,Clojure,Z3":"function_call_parameters _ = _ var1:(function_call_named_parameter/expression) __ var2:function_call_parameters"},"greater_than":{"Pascal,Pydatalog,E,VBScript,LiveCode,Monkey X,Perl 6,EnglishScript,Cython,GAP,Mathematical notation,Wolfram,Chapel,Katahdin,Frink,MiniZinc,Picat,Java,ECLiPSe,D,ooc,Genie,Janus,PL/I,IDP,Processing,Maxima,Seed7,Self,GNU Smalltalk,Drools,Standard ML,Oz,Cobra,Pike,Prolog,EngScript,Kotlin,Pawn,FreeBASIC,MATLAB,Ada,FreeBASIC,Gosu,Gambas,Nimrod,AutoIt,ALGOL 68,Ceylon,Groovy,Rust,CoffeeScript,TypeScript,Fortran,Octave,ML,Hack,AutoHotKey,Scala,Delphi,Tcl,Swift,Vala,C,F#,C++,Dart,JavaScript,REBOL,Julia,Erlang,OCaml,crosslanguage,C#,Nemerle,AWK,Java,Lua,Perl,Haxe,Python,PHP,Haskell,Go,Ruby,R,bc,Visual Basic,Visual Basic .NET":"a:Add _ > _ b:Add","Racket,Z3,CLIPS,GNU Smalltalk,newLisp,Hy,Common Lisp,Emacs Lisp,Clojure,Sibilant,LispyScript":"( _ > __ a:Factor __ b:Factor _ )","Polish notation":"> __ a:Add __ b:Add","Reverse Polish notation":"a:Add __ b:Add __ >"},"typeof":{"Python,Lua":"type _ ( _ theObject:parentheses_expression _ )","JavaScript":"typeof _ ( _ theObject:parentheses_expression _ )","Visual Basic .NET":"( _ TypeOf _ theObject:parentheses_expression _ )","crosslanguage":"( _ typeof __ theObject:parentheses_expression _ )","Go":"reflect _ . _ TypeOf _ ( _ theObject:parentheses_expression _ ) _ . _ Name _ ( _ )","Java":"theObject:parentheses_expression _ . _ getClass _ ( _ ) _ . _ getName _ ( _ )","Haxe":"Type _ . _ typeof _ ( _ theObject:parentheses_expression _ )","Ruby":"class _ ( _ theObject:parentheses_expression _ )","C#":"theObject:parentheses_expression _ . _ getType _ ( _ )","Perl":"ref _ ( _ theObject:parentheses_expression _ )","PHP":"getType _ ( _ theObject:parentheses_expression _ )","C++":"typeid _ ( _ theObject:parentheses_expression _ ) _ . _ name _ ( _ )"},"absolute_value":{"Lua":"math _ . _ abs _ ( _ a:expression _ )","C,Octave,Picat,C++,Swift,Python,Fortran,PHP,Hack,Perl,Dart,Julia,Scala,LiveCode":"abs _ ( _ a:expression _ )","C#,Visual Basic,Visual Basic .NET":"Math _ . _ Abs _ ( _ a:expression _ )","Ruby":"a:parentheses_expression _ . _ abs","Java,JavaScript,Haxe,TypeScript":"Math _ . _ abs _ ( _ a:expression _ )","Wolfram":"Abs _ [ _ a:expression _ ]","REBOL":"absolute __ a:expression","Go":"math _ . _ Abs _ ( _ a:expression _ )","Z3":"( _ ite __ ( _ >= __ a:expression __ 0 _ ) __ a:expression __ ( _ - __ a:expression _ ) _ )","Common Lisp,Racket":"( _ abs __ a:expression _ )"},"natural_logarithm":{"Python,Lua":"math _ . _ log _ ( _ a:expression _ )","JavaScript,Java,Ruby,Haxe,TypeScript":"Math _ . _ log _ ( _ a:expression _ )","C#,Visual Basic,Visual Basic .NET":"Math _ . _ Log _ ( _ a:expression _ )","C,Fortran,Perl,PHP,C++":"log _ ( _ a:expression _ )","Mathematical notation":"ln _ ( _ a:expression _ )"},"charAt":{"Java,Haxe,Scala,JavaScript,TypeScript":"aString:parentheses_expression _ . _ charAt _ ( _ index:expression _ )","Z3":"( _ CharAt __ expression __ index:expression _ )","Python,C,PHP,C#,MiniZinc,C++,Ruby,Picat,Haskell,Dart":"aString:parentheses_expression _ [ _ index:expression _ ]","Lua":"aString:parentheses_expression _ : _ sub( _ index:parentheses_expression _ + _ 1 _ , _ index:parentheses_expression _ + _ 1 _ )","Octave":"aString:parentheses_expression _ ( _ index:expression _ )","Chapel":"aString:parentheses_expression _ . _ substring _ ( _ index:expression _ )","Visual Basic .NET":"aString:parentheses_expression _ . _ Chars _ ( _ index:expression _ )","Go":"string _ ( _ [ _ ] _ rune _ ( _ aString:expression _ ) _ [ _ index:expression _ ] _ )","Swift":"aString:parentheses_expression _ [ _ aString:parentheses_expression _ . _ startIndex _ . _ advancedBy _ ( _ index:expression _ ) _ ]","REBOL":"aString:parentheses_expression _ / _ index:Identifier","Perl":"substr _ ( _ aString:expression _ , _ index:expression _ - _ 1 _ , _ 1 _ )"},"import":{"R":"source _ ( _ \\\" _ a:Identifier _ . _ r\\\" _ )","JavaScript":"import __ * __ as __ a:Identifier __ from __ ' _ a:Identifier _ ' _ ;","Clojure":"( _ import __ a:Identifier _ )","Monkey X":"Import __ a:Identifier","Fortran":"USE __ a:Identifier","Visual Basic .NET":"Imports __ a:Identifier","REBOL":"a:Identifier _ : __ load __ % _ a:Identifier _ .r","Prolog":":- _ consult( _ a:Identifier _ ) _ .","MiniZinc":"include __ ' _ a:Identifier _ .mzn' _ ;","PHP":"include __ ' _ a:Identifier _ .php' _ ;","C,C++":"#include __ \\\" _ a:Identifier _ .h\\\"","C#,Vala":"using __ a:Identifier _ ;","Julia":"using __ a:Identifier","Haskell,EngScript,Python,Scala,Go,Groovy,Picat,Elm,Swift,Monkey X":"import __ a:Identifier","Java,D,Haxe,Ceylon":"import __ a:Identifier _ ;","Dart":"import __ ' _ a:Identifier _ .dart' _ ;","Ruby,Lua":"require __ ' _ a:Identifier _ '","Perl,Perl 6,Chapel":"\\\"use _ a:Identifier _ ;\\\""},"array_contains":{"Python,Julia,MiniZinc":"container:parentheses_expression __ in __ contained:parentheses_expression","Swift":"contains _ ( _ container:expression _ , _ contained:expression _ )","Lua":"container:parentheses_expression _ [ _ contained:expression _ ] _ ~= _ nil","REBOL":"not __ none? __ find __ container:parentheses_expression __ contained:parentheses_expression","JavaScript,CoffeeScript":"container:parentheses_expression _ . _ indexOf _ ( _ contained:expression _ ) _ !== _ -1","CoffeeScript":"container:parentheses_expression _ . _ indexOf _ ( _ contained:expression _ ) _ != _ -1","Ruby":"container:parentheses_expression _ . _ include? _ ( _ contained:expression _ )","Haxe":"Lambda _ . _ has _ ( _ container:expression _ , _ contained:expression _ )","PHP":"in_array _ ( _ container:expression _ , _ container:expression _ )","C#,Visual Basic .NET":"container:parentheses_expression _ . _ Contains _ ( _ contained:expression _ )","Java":"Arrays _ . _ asList _ ( _ container:expression _ ) _ . _ contains _ ( _ contained:expression _ )","Haskell":"( _ elem __ contained:parentheses_expression __ container:parentheses_expression _ )","C++":"( _ std _ :: _ find _ ( _ std::begin _ ( _ container:parentheses_expression _ ) _ , _ std _ :: _ end _ ( _ container:parentheses_expression _ ) _ , _ contained:parentheses_expression _ ) _ != _ std _ :: _ end _ ( _ container:parentheses_expression _ ) _ )"},"dictionary":{"Python,Dart,JavaScript,TypeScript,Lua,Ruby,Julia,C++,EngScript,Visual Basic .NET":"{ _ a:(key_value_list/key_value) _ }","Picat":"new_map _ ( _ [ _ a:(key_value_list/key_value) _ ] _ )","Go":"map _ [ _ input:type _ ] _ output:type _ { _ a:(key_value_list/key_value) _ }","Java":"new __ HashMap _ < _ input:type _ , _ output:type _ > _ ( _ ) _ { _ { _ a:(key_value_list/key_value) _ } _ }","C#":"new __ Dictionary _ < _ input:type _ , _ output:type _ > _ { _ a:(key_value_list/key_value) _ }","Perl":"( _ a:(key_value_list/key_value) _ )","PHP":"array _ ( _ a:(key_value_list/key_value) _ )","Haxe,Frink,Swift,Elixir,D,Wolfram":"[ _ a:(key_value_list/key_value) _ ]","Scala":"Map( _ a:(key_value_list/key_value) _ )","Octave":"struct _ ( _ a:(key_value_list/key_value) _ )","REBOL":"to-hash _ [ _ a:(key_value_list/key_value) _ ]"},"var_name":{"PHP,Perl,Bash,Tcl,AutoIt,Perl 6,Puppet,Hack,AWK,PowerShell":"$ name:Identifier","EngScript,EnglishScript,VBScript,Polish notation,Reverse Polish notation,Wolfram,crosslanguage,Erlang,English,Mathematical notation,Pascal,Picat,Prolog,Katahdin,TypeScript,JavaScript,Frink,MiniZinc,Aldor,Flora-2,F-logic,D,Genie,ooc,Janus,Chapel,ABAP,COBOL,PicoLisp,REXX,PL/I,Falcon,IDP,Processing,Sympy,Maxima,Z3,Shen,Ceylon,nools,Pyke,Self,GNU Smalltalk,Elixir,LispyScript,Standard ML,Nimrod,Occam,Boo,Seed7,pyparsing,Agda,Icon,Octave,Cobra,Kotlin,C++,Drools,Oz,Pike,Delphi,Racket,ML,Java,Pawn,Fortran,Ada,FreeBASIC,MATLAB,newLisp,Hy,OCaml,Julia,AutoIt,C#,Gosu,AutoHotKey,Groovy,Rust,R,Swift,Vala,Go,Scala,Nemerle,Visual Basic,Visual Basic .NET,Clojure,Haxe,CoffeeScript,Dart,JavaScript,C#,Python,Ruby,Haskell,C,Lua,Gambas,Common Lisp,Scheme,REBOL,F#":"name:Identifier","CLIPS":"? name:Identifier"},"default_parameter":{"Python,AutoHotKey,Julia,Nemerle,PHP":"name:var_name _ = _ value:expression","C#,D,Groovy,C++":"type:type __ name:var_name _ = _ value:expression","Dart":"[ _ type:type __ name:var_name _ = _ value:expression _ ]","Ruby":"name:var_name _ : _ value:expression","Scala,Swift,Python":"name:var_name _ : _ type:type _ = _ value:expression","Haxe":"? _ name:var_name _ = _ value:expression","Visual Basic .NET":"Optional __ name:var_name __ As __ type:type _ = _ value:expression"},"_initializer_list":{"Lua,Octave,Picat,Julia,Polish notation,Reverse Polish notation,Visual Basic .NET,Dart,Java,Go,C++,JavaScript,C#,Perl,Fortran,C,PHP,Haskell,Haxe,Python,Ruby,TypeScript,MiniZinc,Prolog,REBOL,Swift":"var1:expression _ var2:initializer_list_separator _ var3:(_initializer_list/expression)"},"initialize_empty_var":{"Swift,Scala,TypeScript":"var __ name:var_name _ : _ type:type","Java,C#,C++,C,D,Janus,Fortran,Dart":"type:type __ name:var_name","JavaScript,Haxe":"var __ name:var_name","MiniZinc":"type:type _ : _ name:var_name","Pascal":"name:var_name _ : _ type:type","Go":"var __ name:var_name __ type:type","Z3":"( _ declare-const __ name:var_name __ type:type _ )","Lua,Julia":"local __ name:var_name","Visual Basic .NET":"Dim __ name:var_name __ As __ type:type","Perl":"my __ name:var_name"},"anonymous_function":{"Matlab,Octave":"( _ @ _ ( _ params:function_parameters _ ) _ body _ )","Picat":"lambda _ ( _ [ _ params:function_parameters _ ] _ , _ body _ )","Visual Basic .NET":"Function _ ( _ params:function_parameters _ ) __ body __ End __ Function","Ruby":"Proc _ . _ new _ { _ | _ params:function_parameters _ | _ b:series_of_statements _ }","JavaScript,TypeScript,Haxe,R,PHP":"function _ ( _ params:function_parameters _ ) _ { _ b:series_of_statements _ }","Haskell":"( _ \\\\ _ params:function_parameters _ -> _ b:series_of_statements _ )","Frink":"{ _ | _ params:function_parameters _ | _ body _ }","Erlang":"fun _ ( _ params:function_parameters _ ) __ b:series_of_statements __ end","Lua,Julia":"function _ ( _ params:function_parameters _ ) __ b:series_of_statements __ end","Swift":"{ _ ( _ params:function_parameters _ ) _ -> _ type:type __ in __ b:series_of_statements _ }","Go":"func _ ( _ params:function_parameters _ ) _ type:type _ { _ b:series_of_statements _ }","Dart,Scala":"( _ ( _ params:function_parameters _ ) _ => _ b:series_of_statements _ )","C++":"[ _ = _ ] _ ( _ params:function_parameters _ ) _ -> _ type:type _ { _ b:series_of_statements _ }","Java":"( _ params:function_parameters _ ) _ -> _ { _ b:series_of_statements _ }","Haxe":"( _ name __ params:function_parameters _ -> _ b:series_of_statements _ )","Python":"( _ lambda __ params:function_parameters _ : _ b:series_of_statements _ )","Delphi":"function _ ( _ params:function_parameters _ ) _ begin __ b:series_of_statements __ end _ ;","D":"( _ params:function_parameters _ ) _ { _ body _ }","REBOL":"func __ [ _ params:function_parameters _ ] _ [ _ body _ ]","Rust":"fn _ ( _ params:function_parameters _ ) _ { _ b:series_of_statements _ }"},"function_parameters":{"Hy,F#,Polish notation,Reverse Polish notation,Z3,Scheme,Racket,Common Lisp,CLIPS,REBOL,Haskell,Racket,Clojure,Perl":"a:function_parameter __ b:function_parameter","JavaScript,Pydatalog,E,VBScript,Monkey X,LiveCode,Ceylon,Delphi,EnglishScript,Cython,Vala,Dafny,Wolfram,Gambas,D,Frink,Chapel,Swift,Perl 6,OCaml,Janus,Mathematical notation,Pascal,Rust,Picat,AutoHotKey,Maxima,Octave,Julia,R,Prolog,Fortran,Go,MiniZinc,Erlang,CoffeeScript,PHP,Hack,Java,C#,C,C++,Lua,TypeScript,Dart,Ruby,Python,Haxe,Scala,Visual Basic,Visual Basic .NET":"a:function_parameter _ , _ b:function_parameter"},"strlen":{"crosslanguage":"( _ strlen __ a:parentheses_expression __ b _ )","Python,Go,Erlang":"len _ ( _ a:parentheses_expression _ )","R":"nchar _ ( _ a:parentheses_expression _ )","Erlang":"string:len _ ( _ a:parentheses_expression _ )","Visual Basic,Visual Basic .NET,Gambas":"Len _ ( _ a:parentheses_expression _ )","JavaScript,TypeScript,Ruby,Scala,Gosu,Picat,Haxe,OCaml,D,Dart":"a:parentheses_expression _ . _ length","REBOL":"length? __ a:parentheses_expression","Java,C++,Kotlin":"a:parentheses_expression _ . _ length _ ( _ )","PHP,C,Pawn,Hack":"strlen _ ( _ a:parentheses_expression _ )","MiniZinc,Julia":"length _ ( _ a:parentheses_expression _ )","Haskell":"( _ length _ a:parentheses_expression _ )","C#":"a:parentheses_expression _ . _ Length","Swift":"countElements _ ( _ a:parentheses_expression _ )","AutoIt":"StringLen _ ( _ a:parentheses_expression _ )","Common Lisp":"( _ length __ a:parentheses_expression _ )","Racket,Scheme":"( _ string-length __ a:parentheses_expression _ )","Perl,Octave":"length _ ( _ a:parentheses_expression _ )","Nemerle":"a:parentheses_expression _ . _ Length","Fortran":"LEN _ ( _ a:parentheses_expression _ )","Lua":"string _ . _ len _ ( _ a:parentheses_expression _ )","Wolfram":"StringLength _ [ _ a:parentheses_expression _ ]","Z3":"( _ Length __ a:parentheses_expression _ )"},"not_equal":{"Clojure":"( _ not= __ a:parentheses_expression __ b:parentheses_expression _ )","Maxima":"a:parentheses_expression __ not __ = __ b:parentheses_expression","Lua":"a:parentheses_expression _ ~= _ b:parentheses_expression","JavaScript,PHP,TypeScript":"a:parentheses_expression _ !== _ b:parentheses_expression","Java,Octave,R,Picat,EnglishScript,Perl 6,Wolfram,C,C++,D,C#,Julia,Perl,Ruby,Haxe,Python,Cython,MiniZinc,Scala,Swift,Go,Rust,Vala":"a:parentheses_expression _ != _ b:parentheses_expression","English":"a:parentheses_expression __ does __ not __ equal __ b:parentheses_expression","Prolog":"not _ ( _ a:parentheses_expression _ == _ b:parentheses_expression _ )","Common Lisp":"( _ not _ ( _ = __ a:parentheses_expression __ b:parentheses_expression _ ) _ )","Mathematical notation":"a:parentheses_expression _ != _  _ b:parentheses_expression","Janus":"a:parentheses_expression _ # _ b:parentheses_expression","Fortran":"a:parentheses_expression _ .NE. _ b:parentheses_expression","Z3":"( _ not _ ( _ = __ a:parentheses_expression __ b:parentheses_expression _ ) _ )","REBOL,Visual Basic .NET,Visual Basic,GAP,OCaml,LiveCode,Monkey X,VBScript,Delphi":"a:parentheses_expression _ <> _ b:parentheses_expression","Erlang,Haskell":"a:parentheses_expression _ /= _ b:parentheses_expression"},"not":{"Python,Cython,Mathematical notation,Emacs Lisp,MiniZinc,Picat,Genie,Seed7,Z3,IDP,Maxima,CLIPS,EngScript,Hy,OCaml,Clojure,Erlang,Pascal,Delphi,F#,ML,Lua,Racket,Common Lisp,crosslanguage,REBOL,Haskell,Sibilant":"( _ not __ a:expression _ )","Java,Perl 6,Katahdin,CoffeeScript,Frink,D,ooc,Ceylon,Processing,Janus,Pawn,AutoHotKey,Groovy,Scala,Hack,Rust,Octave,TypeScript,Julia,AWK,Swift,Scala,Vala,Nemerle,Pike,Perl,C,C++,Objective-C,Tcl,JavaScript,R,Dart,Java,Go,Ruby,PHP,Haxe,C#,Wolfram":"! a:parentheses_expression","Prolog":"\\\\+ a:parentheses_expression","Visual Basic,Visual Basic .NET,AutoIt,LiveCode,Monkey X,VBScript":"( _ Not _ a:parentheses_expression _ )","Fortran":".NOT. a:parentheses_expression","Gambas":"NOT a:parentheses_expression","Rexx":"\\\\ a:parentheses_expression","PL/I":"^ a:parentheses_expression","PowerShell":"-not a:parentheses_expression","Polish notation":"not __ a:parentheses_expression __ b","Reverse Polish notation":"a:parentheses_expression __ not"},"async_function":{"C#":"async __ type:type __ name:var_name _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","JavaScript,Hack":"async __ function __ name:var_name _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Visual Basic .NET":"Async __ Function __ name:var_name _ ( _ params:function_parameters _ ) _ As __ return_type"},"varargs":{"Java":"type:type _ ... __ name:Identifier","PHP":" _ type:type _ ... __ $ _ name:Identifier","C#":"params __ type:type __ name:Identifier","Perl 6":"*@ name:Identifier","Ruby":"* name:Identifier","Scala":"name:Identifier _ : _ type:type _ *","Go":"name:Identifier _ ... _ type:type"},"key_value_list":{"Lua,Octave,Picat,Julia,JavaScript,Dart,Java,C#,C++,Ruby,PHP,Python,Perl,Haxe,TypeScript,Visual Basic .NET,Scala,Swift,REBOL,Go":"var1:key_value _ var2:key_value_separator _ var3:(key_value_list/key_value)"},"grammar_Or":{"Marpa,EBNF,Nearley,Parslet,Yacc,Perl 6,REBOL":"var1:grammar_concatenate_string _ | _ var2:grammar_Or","LPEG":"var1:grammar_concatenate_string _ + _ var2:grammar_Or","PEG.js":"var1:grammar_concatenate_string _ / _ var2:grammar_Or"},"Or":{"JavaScript,Perl 6,Wolfram,Chapel,Elixir,Frink,ooc,Picat,Janus,Processing,Pike,nools,Pawn,MATLAB,Hack,Gosu,Rust,AutoIt,AutoHotKey,TypeScript,Ceylon,Groovy,D,Octave,AWK,Julia,Scala,F#,Swift,Nemerle,Vala,Go,Perl,Java,Haskell,Haxe,C,C++,C#,Dart,R":"var1:greater_than _ || _ var2:Or","Python,Pydatalog,LiveCode,EnglishScript,Cython,GAP,Mathematical notation,Genie,IDP,Maxima,EngScript,Ada,newLisp,OCaml,Nimrod,CoffeeScript,Pascal,Delphi,Erlang,REBOL,Lua,PHP,crosslanguage,Ruby":"var1:greater_than __ or __ var2:Or","Fortran":"var1:greater_than __ .OR. __ var2:Or","Z3,CLIPS,CLojure,Common Lisp,Emacs Lisp,Clojure,Racket":"( _ or __ var1:Factor __ var2:Factor _ )","Prolog":"var1:greater_than _ ; _ var2:Or","MiniZinc":"var1:greater_than _ \\\\/ _ var2:Or","Visual Basic,Visual Basic .NET,Monkey X":"var1:greater_than __ Or __ var2:Or","Polish notation":"or __ a __ b","Reverse Polish notation":"a __ b __ or"},"And":{"JavaScript,Perl 6,Wolfram,Chapel,Elixir,Frink,ooc,Picat,Janus,Processing,Pike,nools,Pawn,MATLAB,Hack,Gosu,Rust,AutoIt,AutoHotKey,TypeScript,Ceylon,Groovy,D,Octave,AWK,Julia,Scala,F#,Swift,Nemerle,Vala,Go,Perl,Java,Haskell,Haxe,C,C++,C#,Dart,R":"a:Or _ && _ b:And","Pydatalog":"a:Or _ & _ b:And","Python,LiveCode,EnglishScript,Cython,GAP,Mathematical notation,Genie,IDP,Maxima,EngScript,Ada,newLisp,OCaml,Nimrod,CoffeeScript,Pascal,Delphi,Erlang,REBOL,Lua,PHP,crosslanguage,Ruby":"a:Or __ and __ b:And","MiniZinc":"a:Or _ /\\\\ _ b:And","Fortran":"a:Or _ .AND. _ b:And","Common Lisp,Z3,newLisp,Racket,Clojure,Sibilant,Hy,CLIPS,Emacs Lisp":"( _ and __ a:Factor __ b:Factor _ )","Prolog":"a:Or _ , _ b:And","Visual Basic,Visual Basic .NET,VBScript,OpenOffice Basic,Monkey X":"a:Or __ And __ b:And","Polish notation":"and __ a:Or __ b:And","Reverse Polish notation":"a:Or __ b:And __ and"},"this":{"Ruby,CoffeeScript":"@ a:Identifier","Java,EngScript,Dart,Groovy,TypeScript,JavaScript,C#,C++,Haxe,Chapel,Julia":"this _ . _ a:Identifier","Python":"self _ . _ a:Identifier","PHP,Hack":"$ _ this _ -> _ a:Identifier","Swift,Scala":"a:Identifier","REBOL":"self _ / _ a:Identifier","Visual Basic .NET":"Me _ . _ a:Identifier","Perl":"$self _ -> _ a:Identifier"},"array_length":{"crosslanguage":"( _ array_length __ a:parentheses_expression _ )","Lua":"# a:parentheses_expression","Python,Cython,Go":"len _ ( _ a:parentheses_expression _ )","Java,Picat,Scala,D,CoffeeScript,TypeScript,Dart,Vala,JavaScript,Ruby,Haxe,Cobra":"a:parentheses_expression _ . _ length","C#,Visual Basic,Visual Basic .NET,PowerShell":"a:parentheses_expression _ . _ Length","MiniZinc,Julia,R":"length _ ( _ a:parentheses_expression _ )","Common Lisp":"( _ list-length __ a:parentheses_expression _ )","PHP":"count _ ( _ a:parentheses_expression _ )","Rust":"a:parentheses_expression _ . _ len _ ( _ )","Emacs Lisp,Scheme,Racket,Haskell":"( _ length __ a:parentheses_expression _ )","C++,Groovy":"a:parentheses_expression _ . _ size _ ( _ )","C":"sizeof _ ( _ a:parentheses_expression _ ) _ / _ sizeof _ ( _ a:parentheses_expression _ [ _ 0 _ ] _ )","Perl":"scalar _ ( _ a:parentheses_expression _ )","REBOL":"length? __ a:parentheses_expression","Swift":"a:parentheses_expression _ . _ count","Clojure":"( _ count __ array _ )","Hy":"( _ len __ a:parentheses_expression _ )","Octave":"length _ ( _ a:parentheses_expression _ )","Fortran,Janus":"size _ ( _ a:parentheses_expression _ )","Wolfram":"Length _ [ _ a:parentheses_expression _ ]"},"initializer_list":{"Java,Picat,C#,Go,Lua,C++,C,Visual Basic .NET,Visual Basic,Wolfram":"{ _ a:(_initializer_list/expression) _ }","Python,D,Frink,REBOL,Octave,Julia,Prolog,MiniZinc,EngScript,Cython,Groovy,Dart,TypeScript,CoffeeScript,Nemerle,JavaScript,Haxe,Haskell,Ruby,REBOL,Polish notation,Swift":"[ _ a:(_initializer_list/expression) _ ]","PHP":"array _ ( _ a:(_initializer_list/expression) _ )","Scala":"Array _ ( _ a:(_initializer_list/expression) _ )","Perl,Chapel":"( _ a:(_initializer_list/expression) _ )","Fortran":"(/ _ a:(_initializer_list/expression) _ /)"},"key_value":{"Groovy,D,Dart,JavaScript,TypeScript,CoffeeScript,Swift,Elixir,Swift,Go":"a:Identifier _ : _ b:expression","Python":"' _ a:Identifier _ ' _ : _ b:expression","Ruby,PHP,Haxe,Perl,Julia":"a:Identifier _ => _ b:expression","REBOL":"a:Identifier __ b:expression","Lua,Picat":"a:Identifier _ = _ b:expression","C++,C#,Visual Basic .NET":"{ _ a:Identifier _ , _ b:expression _ }","Scala,Wolfram":"a:Identifier _ -> _ b:expression","Octave":"a:Identifier _ , _ b:expression","Frink":"[ _ a:Identifier _ , _ b:expression _ ]","Java":"put _ ( _ a:Identifier _ , _ b:expression _ )"},"strcmp":{"R":"identical _ ( _ a:parentheses_expression _ , _ b:parentheses_expression _ )","Emacs Lisp":"( _ string= __ a:parentheses_expression __ b:parentheses_expression _ )","Clojure":"( _ = __ a:parentheses_expression __ b:parentheses_expression _ )","Visual Basic,Delphi,Visual Basic .NET,VBScript,F#,Prolog,Mathematical notation,OCaml,LiveCode,Monkey X":"a:parentheses_expression _ = _ b:parentheses_expression","Python,Pydatalog,Perl 6,EnglishScript,Chapel,Julia,Fortran,MiniZinc,Picat,Go,Vala,AutoIt,REBOL,Ceylon,Groovy,Scala,CoffeeScript,AWK,Ruby,Haskell,Haxe,Dart,Lua,Swift":"a:parentheses_expression _ == _ b:parentheses_expression","JavaScript,PHP,TypeScript,Hack":"a:parentheses_expression _ === _ b:parentheses_expression","C,Octave":"strcmp _ ( _ a:parentheses_expression _ , _ b:parentheses_expression _ ) _ == _ 0","C++":"a:parentheses_expression _ . _ compare _ ( _ b:parentheses_expression _ )","C#":"a:parentheses_expression _ . _ Equals _ ( _ b:parentheses_expression _ )","Java":"a:parentheses_expression _ . _ equals _ ( _ b:parentheses_expression _ )","Common Lisp":"( _ equal __ a:parentheses_expression __ b:parentheses_expression _ )","CLIPS":"( _ str-compare __ a:parentheses_expression __ b:parentheses_expression _ )","Hy":"( _ = __ a:parentheses_expression __ b:parentheses_expression _ )","Perl":"a:parentheses_expression __ eq __ b:parentheses_expression","Erlang":"string _ : _ equal _ ( _ a:parentheses_expression _ , _ b:parentheses_expression _ )","Polish notation":"= __ a:parentheses_expression __ b:parentheses_expression","Reverse Polish notation":"a:parentheses_expression __ b:parentheses_expression __ ="},"sqrt":{"LiveCode":"(the __ sqrt __ of __ x:expression _ )","Java,JavaScript,TypeScript,Ruby,Haxe":"Math _ . _ sqrt _ ( _ x:expression _ )","C#,Visual Basic .NET":"Math _ . _ Sqrt _ ( _ x:expression _ )","C,Julia,Perl,PHP,Perl 6,Maxima,MiniZinc,Prolog,Octave,D,Haskell,Swift,Mathematical notation,Dart,Picat":"sqrt _ ( _ x:expression _ )","Lua,Python":"math _ . _ sqrt _ ( _ x:expression _ )","REBOL":"square-root __ x:expression","Scala":"scala _ . _ math _ . _ sqrt _ ( _ x:expression _ )","C++":"std _ :: _ sqrt _ ( _ x:expression _ )","Erlang":"math _ : _ sqrt _ ( _ x:expression _ )","Wolfram":"Sqrt _ [ _ x:expression _ ]","Common Lisp,Racket":"( _ sqrt __ x:expression _ )","Fortran":"SQRT _ ( _ x:expression _ )","Go":"math _ . _ Sqrt _ ( _ x:expression _ )"},"grammar_parentheses_expression":{"Marpa,Wirth syntax notation,Yacc,LPeg,Parslet,PEG.js,EBNF,Nearley,Prolog,Perl 6":"( _ a:grammar_Or _ )","REBOL":"[ _ a:grammar_Or _ ]"},"parentheses_expression":{"Pydatalog,Pascal,VBScript,Monkey X,LiveCode,Perl 6,EnglishScript,Wolfram,Cython,Mathematical notation,Katahdin,Frink,MiniZinc,Picat,Java,ECLiPSe,D,ooc,Genie,Janus,PL/I,IDP,Processing,Maxima,Seed7,Self,GNU Smalltalk,Drools,Standard ML,Oz,Cobra,Pike,Prolog,EngScript,Kotlin,Pawn,FreeBASIC,MATLAB,Ada,FreeBASIC,Gosu,Gambas,Nimrod,AutoIt,ALGOL 68,Ceylon,Groovy,Rust,CoffeeScript,TypeScript,Fortran,Octave,ML,Hack,AutoHotKey,Scala,Delphi,Tcl,Swift,Vala,C,F#,C++,Dart,JavaScript,REBOL,Julia,Erlang,OCaml,crosslanguage,C#,Nemerle,AWK,Java,Lua,Perl,Haxe,Python,PHP,Haskell,Go,Ruby,R,bc,Visual Basic,Visual Basic .NET":"( _ a:expression _ )","Racket,Polish notation,Reverse Polish notation,Z3,CLIPS,GNU Smalltalk,newLisp,Hy,Common Lisp,Emacs Lisp,Clojure,Sibilant,LispyScript":"a:expression"},"join":{"Swift":"array:parentheses_expression _ . _ joinWithSeparator _ ( _ separator:parentheses_expression _ )","C#":"String _ . _ Join _ ( _ separator:parentheses_expression _ , _ array:parentheses_expression _ )","PHP":"implode _ ( _ separator:parentheses_expression _ , _ array:parentheses_expression _ )","Perl":"join _ ( _ separator:parentheses_expression _ , _ array:parentheses_expression _ )","D,Julia":"join _ ( _ array:parentheses_expression _ , _ separator:parentheses_expression _ )","Lua":"table _ . _ concat _ ( _ array:parentheses_expression _ , _ separator:parentheses_expression _ )","Go":"Strings _ . _ join _ ( _ array:parentheses_expression _ , _ separator:parentheses_expression _ )","JavaScript,Haxe,CoffeeScript,Ruby,Groovy,Java,TypeScript,Rust,Dart":"array:parentheses_expression _ . _ join _ ( _ separator:parentheses_expression _ )","Python":"separator:parentheses_expression _ . _ join _ ( _ array:parentheses_expression _ )","Scala":"array:parentheses_expression _ . _ mkString _ ( _ separator:parentheses_expression _ )","Visual Basic .NET":"Join _ ( _ array, _ separator:parentheses_expression _ )"},"plus_equals":{"Janus,Perl 6,Dart,Visual Basic .NET,TypeScript,Python,Lua,Java,C,C++,C#,JavaScript,Haxe,PHP,Chapel,Perl,Julia,Scala,Rust,Go,Swift":"a:(access_array/dot_notation/Identifier) _ += _ b:expression","Ruby,Haskell,Fortran,OCaml,MiniZinc,Octave,Delphi":"a:(access_array/dot_notation/Identifier) _ = _ a:(access_array/dot_notation/Identifier) _ + _ b:expression","Picat":"a:(access_array/dot_notation/Identifier) _ := _ a:(access_array/dot_notation/Identifier) _ + _ b:expression","REBOL":"a:(access_array/dot_notation/Identifier) _ : _ a:(access_array/dot_notation/Identifier) _ + _ b:expression","LiveCode":"add __ b:expression __ to __ a:(access_array/dot_notation/Identifier)"},"minus_equals":{"Janus,Perl 6,Dart,Perl,Visual Basic .NET,TypeScript,Python,Lua,Java,C,C++,C#,JavaScript,PHP,Haxe,Hack,Julia,Scala,Rust,Go,Swift":"a:(dot_notation/access_array/Identifier) _ -= _ b:expression","Ruby,Haskell,Fortran,OCaml,MiniZinc,Octave,Delphi":"a:(dot_notation/access_array/Identifier) _ = _ a:(dot_notation/access_array/Identifier) _ - _ b:expression","Picat":"a:(dot_notation/access_array/Identifier) _ := _ a:(dot_notation/access_array/Identifier) _ + _ b:expression","REBOL,Picat":"a:(dot_notation/access_array/Identifier) _ : _ a:(dot_notation/access_array/Identifier) _ - _ b:expression","LiveCode":"subtract __ b:expression __ from __ a:(dot_notation/access_array/Identifier)"},"grammar_concatenate_string":{"EBNF,Prolog":"a:Factor _ , _ b:grammar_concatenate_string","LPEG":"a:Factor _ * _ b:grammar_concatenate_string","PEG.js,Marpa,nearley,Yacc,Wirth syntax notation,Perl 6,REBOL":"a:Factor __ b:grammar_concatenate_string","Parslet":"a:Factor _ >> _ b:grammar_concatenate_string"},"concatenate_string":{"R":"paste0 _ ( _ a:Multiply _ , _ b:concatenate_string _ )","Maxima":"sconcat _ ( _ a:Multiply _ , _ b:concatenate_string _ )","Common Lisp":"( _ concatenate __ 'string __ a:Multiply __ b:concatenate_string _ )","C,Monkey X,EnglishScript,Mathematical notation,Go,Java,Chapel,Frink,FreeBASIC,Nemerle,D,Cython,Ceylon,CoffeeScript,TypeScript,Dart,Gosu,Groovy,Scala,Swift,F#,Python,JavaScript,C#,Haxe,Ruby,C++,Vala":"a:Multiply _ + _ b:concatenate_string","Lua,EngScript":"a:Multiply _ .. _ b:concatenate_string","Fortran":"a:Multiply _ // _ b:concatenate_string","PHP,AutoHotKey,Hack,Perl":"a:Multiply _ . _ b:concatenate_string","OCaml":"a:Multiply _ ^ _ b:concatenate_string","REBOL":"append __ a:Multiply __ b:concatenate_string","Haskell,MiniZinc,Picat,Elm":"a:Multiply _ ++ _ b:concatenate_string","CLIPS":"( _ str-cat _ a:Multiply _ b:concatenate_string _ )","Clojure":"( _ str _ a:Multiply _ b:concatenate_string _ )","Erlang":"string _ : _ concat _ ( _ a:Multiply _ , _ b:concatenate_string _ )","Julia":"string _ ( _ a:Multiply _ , _ b:concatenate_string _ )","Octave":"strcat _ ( _ a:Multiply _ , _ b:concatenate_string _ )","Racket":"( _ string-append _ a:Multiply _ b:concatenate_string _ )","Delphi":"Concat _ ( _ a:Multiply _ , _ b:concatenate_string _ )","Visual Basic,Gambas,Nimrod,AutoIt,Visual Basic .NET,OpenOffice Basic,LiveCode,VBScript":"a:Multiply _ & _ b:concatenate_string","Elixir,Wolfram":"a:Multiply _ <> _ b:concatenate_string","Perl 6":"a:Multiply _ ~ _ b:concatenate_string","Z3":"( _ Concat __ a:Multiply __ b:concatenate_string _ )","Emacs Lisp":"( _ concat __ a:Multiply __ b:concatenate_string _ )","Polish notation":"+ __ a:Multiply __ b:concatenate_string","Reverse Polish notation":"a:Multiply __ b:concatenate_string __ +"},"range":{"Swift,Perl,Picat,Ruby,MiniZinc,Chapel":"a:expression _ .. _ b:expression","Python":"range _ ( _ a:expression _ , _ b:expression _ - _ 1 _ )","Octave,Julia,R":"a:expression _ : _ b:expression","Haxe":"a:expression _ ... _ ( _ b:expression _ - _ 1 _ )"},"split":{"Swift":"aString:parentheses_expression _ . _ componentsSeparatedByString _ ( _ separator:expression _ )","Octave":"strsplit _ ( _ aString:expression _ , _ separator:expression _ )","Go":"strings _ . _ Split _ ( _ aString:expression _ , _ separator:expression _ )","JavaScript,CoffeeScript,Java,Python,Dart,Scala,Groovy,Haxe,Ruby,Rust,TypeScript,Cython":"aString:parentheses_expression _ . _ split _ ( _ separator:expression _ )","Lua":"string _ . _ gmatch _ ( _ aString:expression _ , _ separator:expression _ )","PHP":"explode _ ( _ separator:expression _ , _ aString:expression _ )","Perl,Processing":"split _ ( _ separator:expression _ , _ aString:expression _ )","REBOL":"split __ aString:parentheses_expression __ separator:parentheses_expression","C#":"aString:parentheses_expression _ . _ Split _ ( _ new _ string[] _ { _ separator:expression _ } _ , _ StringSplitOptions _ . _ None _ )","Picat,D,Julia":"split _ ( _ aString:expression _ , _ separator:expression _ )","Haskell":"( _ splitOn __ aString:parentheses_expression __ separator:parentheses_expression _ )","Wolfram":"StringSplit _ [ _ aString:expression _ , _ separator:expression _ ]","Visual Basic .NET":"Split _ ( _ aString:expression _ , _ separator:expression _ )"},"pow":{"Lua":"math _ . _ pow _ ( _ a:expression _ , _ b:expression _ )","Scala":"scala.math.pow _ ( _ a:expression _ , _ b:expression _ )","C#,Visual Basic .NET":"Math _ . _ Pow _ ( _ a:expression _ , _ b:expression _ )","JavaScript,Java,TypeScript,Haxe":"Math _ . _ pow _ ( _ a:expression _ , _ b:expression _ )","Python,Cython,Chapel,Haskell,COBOL,Picat,ooc,PL/I,REXX,Maxima,AWK,R,F#,AutoHotKey,Tcl,AutoIt,Groovy,Octave,Ruby,Perl,Fortran":"( _ a:expression _ ** _ b:expression _ )","REBOL":"power __ a:expression __ b:expression","C,C++,PHP,Hack,Swift,MiniZinc,Dart,D":"pow _ ( _ a:expression _ , _ b:expression _ )","Julia,EngScript,Visual Basic,Visual Basic .NET,Gambas,Go,Ceylon,Wolfram,Mathematical notation":"a:parentheses_expression _ ^ _ b:parentheses_expression","Rust":"num::pow _ ( _ a:expression _ , _ b:expression _ )","Hy,Common Lisp,Racket,Clojure":"( _ expt __ num1 __ num2 _ )","Erlang":"math _ : _ pow _ ( _ a:expression _ , _ b:expression _ )"},"case_statements":{"Java,Octave,OCaml,C,C#,C++,JavaScript,PHP,Haxe,Fortran,Ruby,Dart,TypeScript,Scala,Haskell,Visual Basic .NET,Swift,REBOL":"a:case __ b:case_statements","Erlang":"a:case _ ; _ b:case_statements"},"substring":{"JavaScript,CoffeeScript,TypeScript,Java,Scala,Dart":"a:parentheses_expression _ . _ substring _ ( _ b:expression _ , _ c:expression _ )","C++":"a:parentheses_expression _ . _ substring _ ( _ b:expression _ , _ c:expression _ - _ b:expression _ )","Z3":"( _ Substring __ a:parentheses_expression __ b:expression __ c:expression _ )","Python,Cython,Icon,Go":"a:parentheses_expression _ [ _ b:expression _ : _ c:expression _ ]","Julia:":"a:parentheses_expression _ [ _ b:expression _ - _ 1 _ : _ c:expression _ ]","Fortran":"a:parentheses_expression _ ( _ b:expression _ : _ c:expression _ )","C#,Visual Basic .NET,Nemerle":"a:parentheses_expression _ . _ Substring _ ( _ b:expression _ , _ c:expression _ )","Haskell":"take _ ( _ c:expression _ - _ b:expression _ ) _ . _ drop _ b:expression _ $ _ a:parentheses_expression","PHP,AWK,Perl,Hack":"substr _ ( _ a:parentheses_expression _ , _ b:expression _ , _ c:expression _ )","Haxe":"a:parentheses_expression _ . _ substr _ ( _ b:expression _ , _ c:expression _ )","REBOL":"copy/part __ skip __ a:parentheses_expression __ b:expression __ c:expression","Clojure":"( _ subs __ a:parentheses_expression __ b:expression __ c:expression _ )","Erlang":"string _ : _ sub_string _ ( _ a:parentheses_expression _ , _ b:expression _ , _ c:expression _ )","Ruby,Pike,Groovy":"a:parentheses_expression _ [ _ b:expression _ .. _ c:expression _ ]","Racket":"( _ substring __ a:parentheses_expression __ b:expression __ c:expression _ )","Common Lisp":"( _ subseq __ a:parentheses_expression __ b:expression __ c:expression _ )","Lua":"string _ . _ sub _ ( _ a:parentheses_expression _ , _ start _ , _ end _ )"},"mod":{"Java,Perl 6,Cython,Rust,TypeScript,Frink,ooc,Genie,Pike,Ceylon,Pawn,PowerShell,CoffeeScript,Gosu,Groovy,EngScript,AWK,Julia,Scala,F#,Swift,R,Perl,Nemerle,Haxe,PHP,Hack,Vala,Lua,Tcl,Go,Dart,JavaScript,Python,C,C++,C#,Ruby":"a:parentheses_expression _ % _ b:parentheses_expression","REBOL":"mod __ a:parentheses_expression __ b:parentheses_expression","Haskell,MiniZinc,OCaml,Delphi,Pascal,Picat,LiveCode":"a:parentheses_expression __ mod __ b:parentheses_expression","Prolog,Octave,MATLAB,AutoHotKey,Fortran":"mod _ ( _ a:expression _ , _ b:expression _ )","Erlang":"a:parentheses_expression __ rem __ b:parentheses_expression","CLIPS,Clojure,Common Lisp,Z3":"( _ mod __ a:parentheses_expression __ b:parentheses_expression _ )","Visual Basic,Visual Basic .NET,Monkey X":"a:parentheses_expression __ Mod __ b:parentheses_expression","Wolfram":"Mod _ [ _ a:parentheses_expression _ , _ b:parentheses_expression _ ]"},"dot_notation":{"Java,Octave,Scala,Julia,Python,JavaScript,TypeScript,Dart,D,Haxe,C#,Perl 6,Lua,C++,Visual Basic .NET,Ruby,Go,Swift":"var1 _ . _ var2","PHP,C,Perl":"var1 _ -> _ var2","REBOL":"var1 _ / _ var2","Fortran":"var1 _ % _ var2"},"sin":{"Java,JavaScript,TypeScript,Ruby,Haxe":"Math _ . _ sin _ ( _ var1:expression _ )","Lua,Python":"math _ . _ sin _ ( _ var1:expression _ )","C,Erlang,Picat,Mathematical notation,Julia,D,PHP,Perl,Perl 6,Maxima,Fortran,MiniZinc,Swift,Prolog,Octave,Dart,Haskell,C++,Scala":"sin _ ( _ var1:expression _ )","C#,Visual Basic .NET":"Math _ . _ Sin _ ( _ var1:expression _ )","Wolfram":"Sin _ [ _ var1:expression _ ]","REBOL":"sine/radians __ var1:expression","Go":"math _ . _ Sin _ ( _ var1:expression _ )","Common Lisp,Racket":"( _ sin __ a _ )","Clojure":"( _ Math/sin __ a _ )"},"cos":{"Java,JavaScript,TypeScript,Ruby,Haxe":"Math _ . _ cos _ ( _ var1:expression _ )","Lua,Python":"math _ . _ cos _ ( _ var1:expression _ )","C,Erlang,Picat,Mathematical notation,Julia,D,PHP,Perl,Perl 6,Maxima,Fortran,MiniZinc,Swift,Prolog,Octave,Dart,Haskell,C++,Scala":"cos _ ( _ var1:expression _ )","C#,Visual Basic .NET":"Math _ . _ Cos _ ( _ var1:expression _ )","Wolfram":"Cos _ [ _ var1:expression _ ]","Go":"math _ . _ Cos _ ( _ var1:expression _ )","REBOL":"cosine/radians __ var1:expression","Common Lisp,Racket":"( _ cos __ a _ )","Clojure":"( _ Math/cos __ a _ )"},"tan":{"Java,JavaScript,TypeScript,Ruby,Haxe":"Math _ . _ tan _ ( _ var1:expression _ )","Lua,Python":"math _ . _ tan _ ( _ var1:expression _ )","C,Erlang,Picat,Mathematical notation,Julia,D,PHP,Perl,Perl 6,Maxima,Fortran,MiniZinc,Swift,Prolog,Octave,Dart,Haskell,C++,Scala":"tan _ ( _ var1:expression _ )","C#,Visual Basic .NET":"Math _ . _ Tan _ ( _ var1:expression _ )","Wolfram":"Tan _ [ _ var1:expression _ ]","REBOL":"tangent/radians __ var1:expression","Go":"math _ . _ Tan _ ( _ var1:expression _ )","Common Lisp,Racket":"( _ tan __ a _ )","Clojure":"( _ Math/tan __ a _ )"},"instance_method":{"Swift":"func __ name:Identifier _ ( _ params:function_parameters _ ) _ -> _ type:type _ { _ body:series_of_statements _ }","Visual Basic .NET":"Public __ Function __ InstanceMethod _ ( _ params:function_parameters _ ) _ As __ type:type __ body:series_of_statements __ End __ Function","JavaScript":"name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Perl 6":"method __ name:Identifier __ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Chapel":"def __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ type:type _ { _ body:series_of_statements _ }","Java,C#":"public __ type:type __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","PHP":"public __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Ruby":"def __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","C++,D,Dart":"type:type __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Haxe":"public __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ type:type _ { _ body:series_of_statements _ }","Lua":"_","Python":"def __ name:Identifier _ ( _ self, _ params:function_parameters _ ) _ : _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent"},"typeless_instance_method":{"Swift":"func __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Visual Basic .NET":"Public __ Function __ InstanceMethod _ ( _ params:function_parameters _ ) __ body:series_of_statements __ End __ Function","JavaScript,Dart":"name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Chapel":"def __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Java":"public __ Object __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","C#":"public __ object __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","PHP":"public __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Ruby":"def __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","C++,D":"auto __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Haxe":"public __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Lua":"_","Python":"def __ name:Identifier _ ( _ self, _ params:function_parameters _ ) _ : _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent"},"typeless_static_method":{"Swift":"class __ func __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Visual Basic .NET":"Public __ Shared __ Function __ InstanceMethod _ ( _ params:function_parameters _ ) __ body:series_of_statements __ End __ Function","JavaScript":"static __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Haxe":"public __ static __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Lua,Julia":"function __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","Java":"public __ static __ Object __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","C#":"public __ static __ object __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Dart":"static __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","C++":"static __ auto __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","PHP":"public __ static __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Ruby":"def __ self _ . _ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","Python":"@staticmethod _ \\n __ def __ name:Identifier _ ( _  _ params:function_parameters _ ) _ : _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent"},"static_method":{"Swift":"class __ func __ name:Identifier _ ( _ params:function_parameters _ ) _ -> _ type:type _ { _ body:series_of_statements _ }","Visual Basic .NET":"Public __ Shared __ Function __ InstanceMethod _ ( _ params:function_parameters _ ) __ As __ type:type __ body:series_of_statements __ End __ Function","Haxe":"public __ static __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Lua,Julia":"function __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","Java,C#":"public __ static __ type:type __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","C++,Dart":"static __ type:type __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","PHP":"public __ static __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Ruby":"def __ self _ . _ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","C":"type:type __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","JavaScript":"static __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Picat":"_","Python":"@staticmethod _ \\n __ def __ name:Identifier _ ( _  _ params:function_parameters _ ) _ : _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent"},"declare_new_object":{"Visual Basic .NET":"Private __ var_name:var_name __ As __ New __ class_name:Identifier _ ( _ params:function_call_parameters _ )","Java,C#,D,Dart":"class_name:Identifier __ var_name:var_name _ = _ new __ class_name:Identifier _ ( _ params:function_call_parameters _ )","JavaScript,Haxe,Chapel,Scala":"var __ var_name:var_name _ = _ new __ class_name:Identifier _ ( _ params:function_call_parameters _ )","PHP":"var_name:var_name _ = _ new __ class_name:Identifier _ ( _ params:function_call_parameters _ )","Python,Swift,Octave":"var_name:var_name _ = _ class_name:Identifier _ ( _ params:function_call_parameters _ )","Ruby":"var_name:var_name _ = _ class_name:Identifier _ . _ new _ ( _ params:function_call_parameters _ )","Perl":"my __ var_name:var_name _ = _ class_name:Identifier _ -> _ new _ ( _ params:function_call_parameters _ )","Perl 6":"my __ var_name:var_name _ = _ class_name:Identifier _ -> _ new _ ( _ params:function_call_parameters _ )","C++":"class_name:Identifier __ var_name:var_name _ ( _ params:function_call_parameters _ )"},"string_to_int":{"Common Lisp":"( _ parse-integer __ a:expression _ )","Rust":"a:parentheses_expression _ . _ parse _ :: _ <int> _ ( _ )","Perl 6":"+ _ ( _ a:expression _ )","Go":"strconv _ . _ Atoi _ ( _ a:expression _ )","Python,Julia":"int _ ( _ a:expression _ )","Haxe":"Std _ . _ parseInt _ ( _ a:expression _ )","PHP":"( _ int _ ) _ a:expression","Haskell":"( _ read __ a:expression _ )","C#":"Int32 _ . _ Parse( _ a:expression _ )","Visual Basic .NET":"Convert _ . _ toInt32 _ ( _ a:expression _ )","Java":"Integer _ . _ parseInt _ ( _ a:expression _ )","Ceylon":"parseInteger _ ( _ a:expression _ )","C":"atoi _ ( _ a:expression _ )","Scala":"a:expression _ . _ toInt","D":"std _ . _ conv _ . _ to!int _ ( _ a:expression _ )","Ruby":"Integer _ ( _ a:expression _ )","REBOL":"to __ integer! __ a:expression","Lua":"tonumber _ ( _ a:expression _ )","JavaScript,TypeScript":"parseInt _ ( _ a:expression _ )","C++":"atoi _ ( _ a:expression _ . _ c_str _ ( _ ) _ )","Dart":"int _ . _ parse _ ( _ a:expression _ )","Swift":"Int _ ( _ a:expression _ )","Octave":"str2double _ ( _ a:expression _ )"},"int_to_string":{"Perl 6":"~ _ ( _ a:parentheses_expression _ )","Go":"strconv _ . _ Itoa _ ( _ a:parentheses_expression _ )","Python":"str _ ( _ a:parentheses_expression _ )","Wolfram":"ToString _ [ _ a:parentheses_expression _ ]","Swift,JavaScript,TypeScript":"String _ ( _ a:parentheses_expression _ )","Java":"Integer _ . _ toString _ ( _ a:parentheses_expression _ )","Haskell":"( _ show __ a:parentheses_expression _ )","Perl":"a:parentheses_expression","C#,Visual Basic .NET":"Convert _ . _ ToString _ ( _ a:parentheses_expression _ )","Ruby":"a:parentheses_expression _ . _ to_s","REBOL":"to __ string! __ a:parentheses_expression","C++":"std _ :: _ to_string _ ( _ a:parentheses_expression _ )","Lua":"tostring _ ( _ a:parentheses_expression _ )","Haxe":"Std _ . _ toString _ ( _ a:parentheses_expression _ )","D":"std _ . _ conv _ . _ to!string _ ( _ a:parentheses_expression _ )","PHP":"( _ string _ ) _ a:parentheses_expression","Dart":"a:parentheses_expression _ . _ toString _ ( _ )","Scala":"a:parentheses_expression _ . _ toString","Rust":"a:parentheses_expression _ . _ to_string _ ( _ )","Julia":"string _ ( _ a:parentheses_expression _ )","Octave":"num2str _ ( _ a:parentheses_expression _ )"},"typeless_declare_constant":{"Polish notation":"= __ name:var_name __ value:expression","Reverse Polish notation":"name:var_name __ value:expression __ =","Go":"const __ type __ name:var_name _ = _ value:expression","PHP,JavaScript,TypeScript":"const __ name:var_name _ = _ value:expression","Visual Basic .NET":"Public __ Const __ name:var_name _ = _ value:expression","Rust,Swift":"let __ name:var_name _ = _ value:expression","C":"static __ const __ name:var_name _ = _ value:expression","C#":"const __ object __ name:var_name _ = _ value:expression","D,C++":"const __ auto __ name:var_name _ = _ value:expression","Common Lisp":"( _ setf __ name:var_name __ value:expression _ )","Scala":"val __ name:var_name _ = _ value:expression","Python,Ruby,Haskell,Erlang,Julia,Picat,Prolog":"name:var_name _ = _ value:expression","Lua":"local __ name:var_name _ = _ value:expression","Perl":"my __ name:var_name _ = _ value:expression","REBOL":"name:var_name _ : _ value:expression","Haxe":"static __ inline __ var __ name:var_name _ = _ value:expression","Java":"final __ Object __ name:var_name _ = _ value:expression","Dart":"final __ name:var_name _ = _ value:expression","Chapel":"var _ name:var_name _ = _ value:expression","Perl 6":"constant __ name:var_name _ = _ value:expression"},"assert":{"C,C++,Lua,Python,Swift,PHP,Ceylon":"assert _ ( _ a:expression _ )","C#,Visual Basic .NET":"Debug _ . _ Assert _ ( _ a:expression _ )","Java,EnglishScript,F#":"assert a:expression","Clojure":"( _ assert __ a:expression _ )","R":"stopifnot _ ( _ a:expression _ )"},"declare_constant":{"Polish notation":"= __ name:var_name __ value:expression","Reverse Polish notation":"name:var_name __ value:expression __ =","Fortran":"type:type _ , _ PARAMETER _ :: _ name:var_name _ = _ expression","Go":"const __ type:type __ name:var_name _ = _ value:expression","Perl 6":"constant __ type:type __ name:var_name _ = _ value:expression","PHP,JavaScript,Dart":"const __ name:var_name _ = _ value:expression","Z3":"( _ declare-const __ name:var_name __ type:type _ ) _ ( _ assert __ ( _ = __ name:var_name __ value:expression _ ) _ )","Visual Basic .NET":"Public __ Const __ name:var_name __ As __ type:type _ = _ value:expression","Rust,Swift":"let __ name:var_name _ = _ value:expression","C++,C,D,C#":"const __ type:type __ name:var_name _ = _ value:expression","Common Lisp":"( _ setf __ name:var_name __ value:expression _ )","MiniZinc":"type:type _ : _ name:var_name _ = _ value:expression","Scala":"val __ name:var_name _ : _ type:type _ = _ value:expression","Python,Ruby,Haskell,Erlang,Julia,Picat,Prolog":"name:var_name _ = _ value:expression","Lua":"local __ name:var_name _ = _ value:expression","Perl":"my __ name:var_name _ = _ value:expression","REBOL":"name:var_name _ : _ value:expression","Haxe":"static __ inline __ var __ name:var_name _ = _ value:expression","Java,Dart":"final __ type:type __ name:var_name _ = _ value:expression","C":"static __ const __ name:var_name _ = _ value:expression","Chapel":"var __ name:var_name _ : _ type:type _ = _ value:expression","TypeScript":"const __ name:var_name _ : _ type:type _ = _ value:expression"},"index_of":{"JavaScript,Java":"string:parentheses_expression _ . _ indexOf _ ( _ substring:expression _ )","D":"string:parentheses_expression _ . _ indexOfAny _ ( _ substring:expression _ )","Ruby":"string:parentheses_expression _ . _ index _ ( _ substring:expression _ )","C#":"string:parentheses_expression _ . _ IndexOf _ ( _ substring:expression _ )","Python":"string:parentheses_expression _ . _ find _ ( _ substring:expression _ )","Go":"strings _ . _ Index _ ( _ string:expression _ , _ substring:expression _ )"},"function_call_named_parameter":{"Python,C#,Fortran,Scala":"name:Identifier _ = _ value:expression","Modula-3,Visual Basic .NET":"name:Identifier _ := _ value:expression","Ruby,Swift,Dart":"name:Identifier _ : _ value:expression","JavaScript,Erlang,Octave,Picat,Julia,Mathematical notation,Lua,Java,C,PHP,Haxe,MiniZinc,C++,Prolog,Z3,REBOL,Haskell,Go,Polish notation,Reverse Polish notation":"value:expression","Perl":" _ name:Identifier _ => _ value:expression"},"function_call":{"C,GAP,Mathematical notation,Chapel,Elixir,Janus,Perl 6,Pascal,Rust,Hack,Katahdin,MiniZinc,Pawn,Aldor,Picat,D,Genie,ooc,PL/I,Delphi,Standard ML,REXX,Falcon,IDP,Processing,Maxima,Swift,Boo,R,MATLAB,AutoIt,Pike,Gosu,AWK,AutoHotKey,Gambas,Kotlin,Nemerle,EngScript,Prolog,Groovy,Scala,CoffeeScript,Julia,TypeScript,Fortran,Octave,C++,Go,Cobra,Ruby,Vala,F#,Java,Ceylon,OCaml,Erlang,Python,C#,Lua,Haxe,JavaScript,Dart,bc,Visual Basic,Visual Basic .NET,PHP,Perl":"theName:dot_notation _ ( _ args:(function_call_parameters/_) _ )","Haskell,Z3,CLIPS,Clojure,Common Lisp,CLIPS,Racket,Scheme,crosslanguage,REBOL":"( _ theName:dot_notation __ args:(function_call_parameters/_) _ )","Polish notation":"theName:dot_notation __ args:(function_call_parameters/_)","Reverse Polish notation":"args:(function_call_parameters/_) __ theName:dot_notation","Pydatalog":"theName:dot_notation _ [ _ args:(function_call_parameters/_) _ ]"},"reverse_string":{"Python":"a:expression _  _ [ _ :: _ -1 _ ]","Ruby":"a:expression _ . _ reverse!","Java":"new __ StringBuilder _ ( _ theString _ ) _ . _ reverse _ ( _ ) _ . _ toString _ ( _ )","JavaScript":"a:expression _ . _ reverse _ ( _ )","PHP":"strrev _ ( _ a:expression _ )","Visual Basic .NET":"StrReverse _ ( _ a:expression _ )","Haskell":"( _ reverse __ a:expression _ )"},"reverse_array":{"Haskell":"( _ reverse __ a:expression _ )","Ruby":"a:expression _ . _ reverse","JavaScript,Haxe":"a:expression _ . _ reverse _ ( _ )","Python":"a:expression _ [ _ :: _ -1 _ ]","Perl":"reverse _ ( _ a:expression _ )","PHP":"array_reverse _ ( _ a:expression _ )","Visual Basic .NET,C#":"Array _ . _ Reverse _ ( _ a:expression _ )"},"for":{"Java,D,Pawn,Groovy,JavaScript,Dart,TypeScript,PHP,Hack,C#,Perl,C++,AWK,Pike":"for _ ( _ statement_1:initialize_var _ ; _ condition:expression _ ; _ statement_2:set_var _ ) _ { _ body:series_of_statements _ }","C":"init:initialize_empty_var _ ; _ for _ ( _ statement_1:initialize_var _ ; _ condition:expression _ ; _ statement_2:set_var _ ) _ { _ body:series_of_statements _ }","Haxe":"statement_1:initialize_var _ ; _  _ while _ ( _ condition:expression _ ) _ { _ body:series_of_statements _ statement_2:set_var _ ; _ }","Lua,Ruby":"statement_1:initialize_var __ while __ condition:expression __ do __ body:series_of_statements __ statement_2:set_var __ end"},"while":{"GAP":"while __ a:expression __ do __ b:series_of_statements __ od _ ;","EnglishScript":"while __ a:expression __ do __ b:series_of_statements __ od _ ;","Fortran":"WHILE __ ( _ a:expression _ ) __ DO __ b:series_of_statements __ ENDDO","Pascal":"while __ a:expression __ do __ begin __ b:series_of_statements __ end;","Delphi":"While __ a:expression __ do __ begin __ b:series_of_statements __ end;","Rust,Frink,Dafny":"while __ a:expression _ { _ b:series_of_statements _ }","C,Perl 6,Katahdin,Chapel,ooc,Processing,Pike,Kotlin,Pawn,PowerShell,Hack,Gosu,AutoHotKey,Ceylon,D,TypeScript,ActionScript,Nemerle,Dart,Swift,Groovy,Scala,Java,JavaScript,PHP,C#,Perl,C++,Haxe,R,AWK,Vala":"while _ ( _ a:expression _ ) _ { _ b:series_of_statements _ }","Lua,Ruby,Julia":"while __ a:expression __ b:series_of_statements __ end","Picat":"while __ ( _ a:expression _ ) __ b:series_of_statements __ end","REBOL":"while _ [ _ a:expression _ ] _ [ _ b:series_of_statements _ ]","Common Lisp":"( _ loop __ while __ a:expression __ do __ b:series_of_statements _ )","Hy,newLisp,CLIPS":"( _ while __ a:expression __ b:series_of_statements _ )","Python,Cython":"while __ a:expression _ : _ \\n _ #indent _ \\n _ b:series_of_statements _ \\n _ #unindent","Visual Basic,Visual Basic .NET,VBScript":"While __ a:expression __ b:series_of_statements __ End _ While","Octave":"while _ ( _ a:expression _ ) __ endwhile","Wolfram":"While _ [ _ a:expression _ , _ b:series_of_statements _ ]","Go":"for __ a:expression _ { _ b:series_of_statements _ }","VBScript":"Do __ While __ a:expression __ b:series_of_statements __ Loop"},"exception":{"Python":"raise __ Exception _ ( _ a:expression _ )","Ruby,OCaml":"raise __ a:expression","JavaScript,Dart,Java,C++,Swift,REBOL,Haxe,C#,Picat,Scala":"throw __ a:expression","Julia,E":"throw _ ( _ a:expression _ )","Visual Basic .NET":"Throw __ a:expression","Perl,Perl 6":"die __ a:expression","Octave":"error _ ( _ a:expression _ )","PHP":"throw __ new __ Exception _ ( _ a:expression _ )"},"function":{"LiveCode":"function __ name:Identifier __ params:function_parameters __ body:series_of_statements __ end __ name:Identifier","Monkey X":"Function _ name:Identifier _ : _ type:type _ ( _ params:function_parameters _ ) _ body:series_of_statements __ End","Emacs Lisp":"( _ defun __ name:Identifier __ ( _ params:function_parameters _ ) __ body:series_of_statements _ )","Go":"func __ name:Identifier _ ( _ params:function_parameters _ ) __ type:type _ { _ body:series_of_statements _ }","C++,Vala,C,Dart,Ceylon,Pike,D,EnglishScript":"type:type __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Pydatalog":"name:Identifier _ ( _ params:function_parameters _ ) _ <= _ body:series_of_statements","Java,C#":"public __ static __ type:type __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","JavaScript,PHP":"function __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Lua,Julia":"function __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","Wolfram":"name:Identifier _ [ _ params:function_parameters _ ] _ := _ body:series_of_statements","Frink":"name:Identifier _ [ _ params:function_parameters _ ] _ := _ { _ body:series_of_statements _ }","POP-11":"define __ name:Identifier _ ( _ params:function_parameters _ ) _ -> _ Result; __ body:series_of_statements __ enddefine;","Z3":"( _ define-fun __ name:Identifier _ ( _ params:function_parameters _ ) __ type:type __ body:series_of_statements _ )","Mathematical notation":"name:Identifier _ ( _ params:function_parameters _ ) _ = _ { _ body:series_of_statements _ }","Chapel":"proc __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ type:type _ { _ body:series_of_statements _ }","Prolog":"name:Identifier _ ( _ params:function_parameters _ ) __ :- __ body:statement _ .","Picat":"name:Identifier _ ( _ params:function_parameters _ ) _ = _ retval _ => _ body:series_of_statements _ .","Swift":"func __ name:Identifier _ ( _ params:function_parameters _ ) _ -> _ type:type _ { _ body:series_of_statements _ }","Maxima":"name:Identifier _ ( _ params:function_parameters _ ) _ := _ body:series_of_statements","Rust":"fn __ name:Identifier _ ( _ params:function_parameters _ ) _ -> _ type:type _ { _ body:series_of_statements _ }","Clojure":"( _ defn _ name:Identifier _ [ _ params:function_parameters _ ] _ body:series_of_statements _ )","Octave":"function __ retval _ = _ name:Identifier _ ( _ params:function_parameters _ ) _ body:series_of_statements __ endfunction","Haskell":"name:Identifier __ params:function_parameters _ = _ body:statement","Common Lisp":"(defun __ name:Identifier _ ( _ params:function_parameters _ ) _ body:series_of_statements _ )","Fortran":"FUNC __ name:Identifier __ ( _ params:function_parameters _ ) __ RESULT _ ( _ retval _ ) __ type:type _ :: _ retval __ body:series_of_statements __ END __ FUNCTION __ name:Identifier","Scala":"def __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ type:type _ = _ { _ body:series_of_statements _ }","MiniZinc":"function __ type:type _ : _ name:Identifier _ ( _ params:function_parameters _ ) _ = _ body:series_of_statements _ ;","CLIPS":"( _ deffunction __ name:Identifier _ ( _ params:function_parameters _ ) _ body:series_of_statements _ )","Erlang":"name:Identifier _ ( _ params:function_parameters _ ) _ -> _ body:series_of_statements","Perl":"sub __ name:Identifier _ { _ params:function_parameters _ body:series_of_statements _ }","Perl 6":"sub __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Pawn":"name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Ruby":"def __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ end","TypeScript":"function __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ type:type _ { _ body:series_of_statements _ }","REBOL":"name:Identifier _ : __ func _ [ _ params:function_parameters _ ] _ [ _ body:series_of_statements _ ]","Haxe":"public __ static __ function __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ type:type _ { _ body:series_of_statements _ }","Hack":"function __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ type:type _ { _ body:series_of_statements _ }","R":"name:Identifier _ <- _ function _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","bc":"define __ name:Identifier _ ( _ params:function_parameters _ ) _ { _ body:series_of_statements _ }","Visual Basic,Visual Basic .NET":"Function __ name:Identifier _ ( _ params:function_parameters _ ) _ As __ type:type __ body:series_of_statements __ End __ Function","VBScript":"Function __ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ End __ Function","Racket,newLisp":"(define _ (name _ params) _ body:series_of_statements _ )","Janus":"procedure __ name:Identifier _ ( _ params:function_parameters _ ) _ body:series_of_statements","Python":"def __ name:Identifier _ ( _ params:function_parameters _ ) _ -> _ type:type _ : _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent","F#":"let __ name:Identifier __ params:function_parameters _ = _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent","Polish notation":"= _ name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements","Reverse Polish notation":"name:Identifier _ ( _ params:function_parameters _ ) __ body:series_of_statements __ =","OCaml":"let __ name:Identifier __ params:function_parameters _ = _ body:series_of_statements","E":"def __ name:Identifier _ ( _ params:function_parameters _ ) _ type:type _ { _ body:series_of_statements _ }","Pascal,Delphi":"function __ name:Identifier _ ( _ params:function_parameters _ ) _ : _ type:type _ ; _ begin __ body:series_of_statements __ end _ ;"},"else":{"Clojure":":else __ a:series_of_statements","Fortran":"ELSE __ a:series_of_statements","Hack,E,ooc,EnglishScript,Mathematical notation,Dafny,Perl 6,Frink,Chapel,Katahdin,Pawn,PowerShell,Puppet,Ceylon,D,Rust,TypeScript,Scala,AutoHotKey,Gosu,Groovy,Java,Swift,Dart,AWK,JavaScript,Haxe,PHP,C#,Go,Perl,C++,C,Tcl,R,Vala,bc":"else _ { _ a:series_of_statements _ }","Ruby,LiveCode,Janus,Lua,Haskell,CLIPS,MiniZinc,Julia,Octave,Picat,Pascal,Delphi,Maxima,OCaml,F#":"else __ a:series_of_statements","Erlang":"true _ -> _ a:series_of_statements","Wolfram,Prolog":"a:series_of_statements","Z3":"a:statement","Python,Cython":"else _ : _ \\n _ #indent _ \\n _ b _ \\n _ #unindent","Visual Basic .NET,Monkey X,VBScript":"Else __ a:series_of_statements","REBOL":"true _ [ _ a:series_of_statements _ ]","Common Lisp":"( _ t __ a:series_of_statements _ )","English":"otherwise __ a:series_of_statements","Polish notation":"else __ a:series_of_statements","Reverse Polish notation":"a:series_of_statements __ else"},"elif_or_else":{"Java,Common Lisp,Octave,Picat,MiniZinc,Vala,Clojure,Monkey X,ooc,Ceylon,F#,Delphi,Perl 6,EnglishScript,Wolfram,Julia,OCaml,Maxima,Python,Cython,Erlang,Mathematical notation,REBOL,Scheme,Dart,JavaScript,TypeScript,C,C#,Haxe,PHP,Lua,Ruby,R,Fortran,Perl,C++,Visual Basic .NET,VBScript,Prolog,Scala,Rust,Go,Swift,Haskell,Z3":"a:(elif/else)","Z3":"a:statement"},"elif":{"D,E,Mathematical notation,Chapel,Pawn,Ceylon,Scala,TypeScript,AutoHotKey,AWK,R,Groovy,Gosu,Katahdin,Java,Swift,Nemerle,C,Dart,Vala,JavaScript,C#,C++,Haxe":"else __ if _ ( _ a:And _ ) _ { _ b:series_of_statements _ } _ c:elif_or_else","Z3":"( _ ite __ a:Factor __ b:statement __ c:elif_or_else _ )","Rust,Go,EnglishScript":"else __ if __ a:And _ { _ b:series_of_statements _ } _ c:elif_or_else","PHP,Hack,Perl":"elseif _ ( _ a:And _ ) _ { _ b:series_of_statements _ } _ c:elif_or_else","Julia,Octave,Lua":"elseif __ a:And __ b:series_of_statements __ c:elif_or_else","Monkey X":"ElseIf __ a:And __ b:series_of_statements __ c:elif_or_else","Ruby":"elsif __ a:And __ then __ b:series_of_statements __ c:elif_or_else","Perl 6":"elsif __ a:And __ { _ b:series_of_statements _ } _ c:elif_or_else","Picat":"elseif __ a:And __ then __ b:series_of_statements __ c:elif_or_else","Erlang":"a:And _ -> _ b:series_of_statements __ c:elif_or_else","Prolog":"( _ a:And _ -> _ b:series_of_statements _ ; _ c:elif_or_else _ )","R,F#":"a:And _ <- _ b:series_of_statements __ c:elif_or_else","CLIPS":"( _ if __ a:And __ then __ ( _ b:series_of_statements __ c:elif_or_else _ ) _ )","MiniZinc,OCaml,Haskell,Pascal,Maxima,Delphi,F#,LiveCode":"else __ if __ a:And __ then __ b:series_of_statements __ c:elif_or_else","Python,Cython":"elif __ a:And _ : _ \\n _ #indent _ \\n _ b:series_of_statements _ \\n _ #unindent __ c:elif_or_else","Visual Basic .NET":"ElseIf __ a:And __ Then __ b:series_of_statements __ c:elif_or_else","Fortran":"ELSE __ IF __ a:And __ THEN __ b:series_of_statements __ c:elif_or_else","REBOL":"a:And _ [ _ b:series_of_statements _ ] __ c:elif_or_else","Common Lisp":"( _ a:And __ b:series_of_statements _ ) __ c:elif_or_else","Wolfram":"If _ [ _ a:And _ , _ b:series_of_statements _ , _ c:elif_or_else _ ]","Polish notation":"elif __ a:And __ b:series_of_statements __ c:elif_or_else","Reverse Polish notation":"a:And __ b:series_of_statements __ c:elif_or_else __ elif","Clojure":"a:expression __ b:statement __ c:elif_or_else"},"return":{"VBScript":"function_name:Identifier _ = _ a:expression","Java,E,LiveCode,EnglishScript,Cython,GAP,Kal,EngScript,Pawn,Ada,PowerShell,Rust,D,Ceylon,TypeScript,Hack,AutoHotKey,Gosu,Swift,Pike,Objective-C,C,Groovy,Scala,CoffeeScript,Julia,Dart,C#,JavaScript,Go,Haxe,PHP,C++,Perl,Vala,Lua,Python,REBOL,Ruby,Tcl,AWK,bc,Chapel,Perl 6":"return __ a:expression","MiniZinc,Pydatalog,Polish notation,Reverse Polish notation,Mathematical notation,Emacs Lisp,Z3,Erlang,Maxima,Standard ML,Icon,Oz,CLIPS,newLisp,Hy,Sibilant,LispyScript,ALGOL 68,Clojure,Prolog,Common Lisp,F#,OCaml,Haskell,ML,Racket,Nemerle":"a:expression","Visual Basic,Visual Basic .NET,AutoIt,Monkey X":"Return __ a:expression","Octave,Fortran":"retval _ = _ a:expression","Pascal":"Exit _ ( _ a:expression _ )","Picat":"retval _ = _ a:expression","R":"return _ ( _ a:expression _ )","Wolfram":"Return _ [ _ a:expression _ ]","POP-11":"a:expression _ -> _ Result","Delphi,Pascal":"Result _ = _ a:expression"},"set_var":{"JavaScript,Mathematical notation,Perl 6,Wolfram,Chapel,Katahdin,Frink,Picat,ooc,D,Genie,Janus,Ceylon,IDP,Sympy,Prolog,Processing,Java,Boo,Gosu,Pike,Kotlin,Icon,PowerShell,EngScript,Pawn,FreeBASIC,Hack,Nimrod,OpenOffice Basic,Groovy,TypeScript,Rust,CoffeeScript,Fortran,AWK,Go,Swift,Vala,C,Julia,Scala,Cobra,Erlang,AutoIt,Dart,Java,OCaml,Haxe,C#,MATLAB,C++,PHP,Perl,Python,Lua,Ruby,Gambas,Octave,Visual Basic,Visual Basic .NET,bc":"name:(access_array/var_name) _ = _ value:expression","MiniZinc":"constraint __ name:(access_array/var_name) _ = _ value:expression _ ;","REBOL":"name:(access_array/var_name) _ : _ value:expression","Z3":"( _ assert _ ( _ = __ name:(access_array/var_name) __ value:expression _ ) _ )","GAP,Delphi":"name:(access_array/var_name) _ := _ value:expression","LiveCode":"put __ expression __ into __ name:(access_array/var_name)","VBScript":"Set __ a _ = _ b"},"print":{"OCaml":"print_string __ a:expression","MiniZinc":"trace _ ( _ a:expression _ , _ true _ )","Perl 6":"say __ a:expression","Erlang":"io _ : _ fwrite _ ( _ a:expression _ )","C++":"cout _ << _ a:expression","Haxe":"trace _ ( _ a:expression _ )","Go":"fmt _ . _ Println _ ( _ a:expression _ )","Prolog":"write _ ( _ a:expression _ )","C#":"Console _ . _ WriteLine _ ( _ a:expression _ )","REBOL,Fortran,Perl,PHP":"print __ a:expression","Ruby":"puts _ ( _ a:expression _ )","Visual Basic .NET":"System _ . _ Console _ . _ WriteLine _ ( _ a:expression _ )","Scala,Julia,Swift":"println _ ( _ a:expression _ )","JavaScript,TypeScript":"console _ . _ log _ ( _ a:expression _ )","Python,EnglishScript,Cython,Ceylon,R,Gosu,Dart,Vala,Perl,PHP,Hack,AWK,Lua":"print _ ( _ a:expression _ )","Java":"System _ . _ out _ . _ println _ ( _ a:expression _ )","C":"printf _ ( _ a:expression _ )","Haskell":"( _ putStrLn __ a:expression _ )","Hy,Common Lisp,crosslanguage":"( _ print __ a:expression _ )","Rust":"println!( _ a:expression _ )","Octave":"disp _ ( _ a:expression _ )","Chapel,D":"writeln _ ( _ a:expression _ )","Delphi":"WriteLn _ ( _ a:expression _ )","Frink":"print _ [ _ a:expression _ ]","Wolfram":"Print _ [ _ a:expression _ ]","Z3":"( _ echo __ a:expression _ )","Picat":"println _ ( _ a:expression _ )","Monkey X":"Print __ a:expression"},"grammar_series_of_statements":{"PEG.js,Wirth syntax notation,Yacc,Pyparsing,EBNF,Nearley,ANTLR,Marpa,Parslet,Perl 6,Prolog,REBOL":"var1:grammar_statement __ var2:grammar_series_of_statements"},"series_of_statements":{"Pydatalog,Java,Racket,VBScript,Monkey X,LiveCode,Polish notation,Reverse Polish notation,Clojure,CLIPS,Common Lisp,Emacs Lisp,Scheme,Prolog,Dafny,Z3,Elm,Bash,Perl 6,Mathematical notation,Katahdin,Frink,MiniZinc,Aldor,COBOL,ooc,Genie,ECLiPSe,nools,Agda,PL/I,REXX,IDP,Falcon,Processing,Sympy,Maxima,Pyke,Elixir,GNU Smalltalk,Seed7,Standard ML,Occam,Boo,Drools,Icon,Mercury,EngScript,Pike,Oz,Kotlin,Pawn,FreeBASIC,Ada,PowerShell,Gosu,Nimrod,Cython,OpenOffice Basic,ALGOL 68,D,Ceylon,Rust,CoffeeScript,ActionScript,TypeScript,Fortran,Octave,ML,AutoHotKey,Delphi,Pascal,F#,Self,Swift,Nemerle,Dart,C,AutoIt,Cobra,Julia,Groovy,Scala,OCaml,Gambas,Hack,C++,MATLAB,REBOL,Red,Lua,Go,AWK,Haskell,Perl,Python,JavaScript,C#,PHP,Ruby,R,Haxe,Visual Basic,Visual Basic .NET,Vala,bc":"var1:statement __ var2:(series_of_statements/statement)","Wolfram":"var1:statement _ ; _ var2:(series_of_statements/statement)","EnglishScript,Python":"var1:statement _ \\n _ var2:(series_of_statements/statement)","Picat,Prolog,Erlang,LPeg":"var1:statement _ , _ var2:(series_of_statements/statement)"},"class_statements":{"Java,Perl 6,Scala,Julia,Python,Dart,C#,Ruby,C++,JavaScript,TypeScript,Visual Basic .NET,PHP,Haxe,Visual Basic .NET,Swift":"var1:class_statement __ var2:class_statements"},"class_statement":{"Java,Julia,C#,Visual Basic .NET,Ruby,PHP,C++,Haxe,Swift,Dart,Python":"a:(constructor/static_method/instance_method/initialize_static_variable/initialize_instance_variable/initialize_instance_variable_with_value/initialize_static_variable_with_value)","JavaScript,TypeScript":"a:(constructor/static_method/instance_method)"},"comment":{"Java,Dafny,Janus,Chapel,Rust,Frink,D,Genie,Ceylon,Hack,Maxima,Kotlin,Delphi,Dart,TypeScript,Swift,Vala,C#,JavaScript,Haxe,Scala,Go,C,C++,Pike,PHP,F#,Nemerle,crosslanguage,Gosu,Groovy":"// _ var1:[^\\n]+ _ \\n","OCaml,Standard ML,ML":"(*{ _ var1:[^\\n]+ _ }*)","MATLAB,MiniZinc,Octave,Erlang,Prolog,Picat":"% _ var1:[^\\n]+ _ \\n","REBOL":"comment _ [ _ var1:[^\\n]+ _ ]","Wolfram":"(* _ var1:[^\\n]+ _ *)","Pascal":"{ _ var1:[^\\n]+ _ }","Fortran":"! _ var1:[^\\n]+ _ \\n","Z3":"; _ var1:[^\\n]+ _ \\n","Bash,Perl 6,PowerShell,Seed7,Cobra,Icon,EngScript,Nimrod,CoffeeScript,Julia,AWK,Ruby,Perl,R,Tcl,bc,Python,Cython":"# _ var1:[^\\n]+ _ \\n","Lua,Haskell,Ada":"-- _ var1:[^\\n]+ _ \\n","Gambas,Visual Basic,Visual Basic .NET,Monkey X,VBScript":"' _ var1:[^\\n]+ _ \\n"},"initialize_var":{"Polish notation":"= __ name:var_name __ value:expression","Reverse Polish notation":"name:var_name __ value:expression __ =","Go":"var __ name:var_name __ type:type _ = _ value:expression","Rust":"let __ mut __ name:var_name _ = _ value:expression","Dafny":"var _ name:var_name _ : _ type:type _ := _ value:expression","Z3":"( _ declare-const __ name:var_name __ type:type _ ) _ ( _ assert __ ( _ = __ name:var_name __ value:expression _ ) _ )","F#":"let __ mutable __ name:var_name _ = _ value:expression","Common Lisp":"( _ setf __ name:var_name __ value:expression _ )","MiniZinc":"type:type _ : _ name:var_name _ = _ value:expression _ ;","Python,Ruby,Haskell,Erlang,Prolog,Julia,Picat,Octave,Wolfram":"name:var_name _ = _ value:expression","JavaScript,PHP,Hack,Swift":"var __ name:var_name _ = _ value:expression","Lua":"local __ name:var_name _ = _ value:expression","Janus":"local __ type:type __ name:var_name _ = _ value:expression","Perl":"my __ name:var_name _ = _ value:expression","Perl 6":"my __ type:type __ name:var_name _ = _ value:expression","C,Java,C#,C++,D,Dart,EnglishScript,Ceylon,Vala":"type:type __ name:var_name _ = _ value:expression","REBOL":"name:var_name _ : _ value:expression","Visual Basic,Visual Basic .NET,OpenOffice Basic":"Dim __ name:var_name __ As __ type:type _ = _ value:expression","R":"name:var_name _ <- _ value:expression","Fortran":"type:type _ :: _ name:var_name _ = _ value:expression","Chapel,Haxe,Scala,TypeScript":"var __ name:var_name _ : _ type:type _ = _ value:expression","Monkey X":"Local __ name:var_name _ : _ type:type _ = _ value:expression","VBScript":"Dim __ name:var_name __ Set __ name:var_name _ = _ value:expression"},"typeless_initialize_var":{"Monkey X":"Local __ name:var_name _ = _ value:expression","Rust":"let __ mut __ name:var_name _ = _ value:expression","R":"name:var_name _ <- _ value:expression","C++,D":"auto __ name:var_name _ = _ value:expression","C#,Dafny,JavaScript,Haxe,PHP,TypeScript,Dart,Swift,Scala,Go,Vala":"var __ name:var_name _ = _ value:expression","Lua":"local __ name:var_name _ = _ value:expression","Python,Ruby,Haskell,Erlang,Prolog,Julia,Picat,Octave,PHP,Wolfram":"name:var_name _ = _ value:expression","C":"__auto_type __ name:var_name _ = _ value:expression","Java":"Object __ name:var_name _ = _ value:expression","C#,JavaScript,Haxe,Swift":"var __ name:var_name _ = _ value:expression","Perl,Perl 6":"my __ name:var_name _ = _ value:expression","REBOL":"name:var_name _ : _ value:expression","Visual Basic .NET":"Dim __ name:var_name _ = _ value:expression","VBScript":"Dim __ name:var_name __ Set __ name:var_name _ = _ value:expression","Polish notation":"= __ name:var_name __ value:expression","Reverse Polish notation":"name:var_name __ value:expression __ ="},"int":{"Hack,Dafny,Janus,Chapel,MiniZinc,EngScript,Cython,ALGOL 68,D,Octave,Tcl,crosslanguage,ML,AWK,Julia,Gosu,OCaml,F#,Pike,Objective-C,Go,Cobra,Dart,Groovy,Python,Hy,Java,C#,C,C++,Vala,Nemerle,crosslanguage":"int","PHP,Common Lisp,Picat":"integer","Fortran":"INTEGER","REBOL":"integer!","Ceylon,Gambas,OpenOffice Basic,Pascal,Erlang,Delphi,Visual Basic,Visual Basic .NET":"Integer","Haxe,ooc,Swift,Scala,Perl 6,Z3,Monkey X":"Int","JavaScript,TypeScript,CoffeeScript,Lua,Perl":"number","Haskell":"Num","Ruby":"fixnum"},"if":{"Erlang":"if __ a:expression _ -> _ b:statement __ c:elif_or_else __ end","Fortran":"IF __ a:expression __ THEN __ b:series_of_statements __ c:elif_or_else __ END __ IF","REBOL":"case _ [ _ a:expression _ [ _ b:series_of_statements _ ] _ c:elif_or_else _ ]","Julia":"if __ a:expression __ b:series_of_statements __ c:elif_or_else __ end","Lua,Ruby,Picat":"if __ a:expression __ then __ b:series_of_statements __ c:elif_or_else __ end","Octave":"if __ a:expression __ b:series_of_statements __ c:elif_or_else __ endif","Haskell,Pascal,Delphi,Maxima,OCaml":"if __ a:expression __ then __ b:series_of_statements __ c:elif_or_else","LiveCode":"if __ a:expression __ then __ b:series_of_statements __ c:elif_or_else __ end __ if","Java,E,ooc,EnglishScript,Mathematical notation,Polish notation,Reverse Polish notation,Perl 6,Chapel,Katahdin,Pawn,PowerShell,D,Ceylon,TypeScript,ActionScript,Hack,AutoHotKey,Gosu,Nemerle,Swift,Nemerle,Pike,Groovy,Scala,Dart,JavaScript,C#,C,C++,Perl,Haxe,PHP,R,AWK,Vala,bc,Squirrel":"if _ ( _ a:expression _ ) _ { _ b:series_of_statements _ } _ c:elif_or_else","Rust,Go":"if __ a:expression _ { _ b:series_of_statements _ } _ c:elif_or_else","Visual Basic,Visual Basic .NET":"If __ a:expression __ b:series_of_statements __ c:elif_or_else","CLIPS":"( _ if __ a:expression __ then __ b:series_of_statements __ c:elif_or_else _ )","Z3":"( _ ite __ a:expression __ b:statement __ c:elif_or_else _ )","MiniZinc":"if __ a:expression __ then __ b:series_of_statements __ c:elif_or_else __ endif","Python,Cython":"if __ a:expression _ : _ \\n _ #indent _ \\n _ b:series_of_statements _ \\n _ #unindent _ \\n _ c:elif_or_else","Prolog":"( _ a:expression _ -> _ b:series_of_statements _ ; _ c:elif_or_else _ )","Visual Basic":"If __ a:expression __ Then __ b:series_of_statements __ c:elif_or_else __ End __ If","Common Lisp":"( _ cond _ ( _ a:expression __ b:series_of_statements _ ) __ c:elif_or_else _ )","Wolfram":"If _ [ _ a:expression _ , _ b:series_of_statements _ , _ c:elif_or_else _ ]","Polish notation":"if __ a:expression __ b:series_of_statements","Reverse Polish notation":"a:expression __ b:series_of_statements __ if","Monkey X":"if __ a:expression __ b:series_of_statements __ c:elif_or_else __ EndIf","Clojure":""},"foreach":{"JavaScript,TypeScript":"array:expression _ . _ forEach _ ( _ function _ ( _ var_name:var_name _ ) _ { _ body:series_of_statements _  _ } _ ) _ ;","Octave":"for __ var_name:var_name _ = _ array:expression __ body:series_of_statements __ endfor","Z3":"( _ forall __ ( _ ( _ var_name:var_name __ a _ ) _ ) __ ( _ => _ select __ array:expression _ ) _ )","GAP":"for __ var_name:var_name __ in __ array:expression __ do __ body:series_of_statements __ od;","MiniZinc":"forall _ ( _ var_name:var_name __ in __ array:expression _ ) _ ( _ body:series_of_statements _ )","PHP,Hack":"foreach _ ( _ array:expression __ as __ var_name:var_name _ ) _ { _ body:series_of_statements _ }","Java":"for _ ( _ typeInArray:type __ var_name:var_name _ : _ array:expression _ ) _ { _ body:series_of_statements _ }","C#,Vala":"foreach _ ( _ typeInArray:type __ var_name:var_name __ in __ array:expression _ ) _ { _ body:series_of_statements _ }","Lua":"for __ var_name:var_name __ in __ array:expression __ do __ body:series_of_statements __ end","Python,Cython":"for __ var_name:var_name __ in __ array:expression _ : _ \\n _ #indent _ \\n _ body:series_of_statements _ \\n _ #unindent","Julia":"for __ var_name:var_name __ in __ array:expression __ body:series_of_statements __ end","Chapel,Swift":"for __ var_name:var_name __ in __ array:expression _ { _ body:series_of_statements _ }","Pawn":"foreach _ ( _ new __ var_name:var_name _ : _ array:expression _ ) _ { _ body:series_of_statements _ }","Picat":"foreach _ ( _ var_name:var_name __ in __ array:expression _ ) _ ( _ body:series_of_statements _ ) _ end","AWK,Ceylon":"for __ ( __ var_name:var_name __ in __ array:expression _ ) _ { _ body:series_of_statements _ }","Go":"for __ var_name:var_name _ := _ range __ array:expression _ { _ body:series_of_statements _ }","Haxe,Groovy":"for _ ( _ var_name:var_name __ in __ array:expression _ ) _ { _ body:series_of_statements _ }","Ruby":"array:expression _ . _ each __ do _ | _ var_name:var_name _ | __ body:series_of_statements __ end","Nemerle,PowerShell":"foreach _ ( _ var_name:var_name __ in __ array:expression _ ) _ { _ body:series_of_statements _ }","Scala":"for _ ( _ var_name:var_name _ -> _ array:expression _ ) _ { _ body:series_of_statements _ }","REBOL":"foreach __ var_name:var_name __ array:expression _ [ _ body:series_of_statements _ ]","C++":"for _ ( _ typeInArray:type __ & __ var_name:var_name _ : _ array:expression _ ){ _ body:series_of_statements _ }","Perl":"for __ array:expression _ -> _ var_name:var_name _ { _ body:series_of_statements _ }","D":"foreach _ ( _ var_name:var_name _ , _ array:expression _ ) _ { _ body:series_of_statements _ }","Gambas":"FOR __ EACH __ var_name:var_name __ IN __ array:expression __ body:series_of_statements __ NEXT","Visual Basic .NET":"For __ Each __ var_name:var_name __ As __ typeInArray:type __ In __ array:expression __ body:series_of_statements __ Next","VBScript":"For __ Each __ var_name:var_name __ In __ array:expression __ body:series_of_statements __ Next","Dart":"for _ ( _ var __ var_name:var_name __ in __ array:expression _ ) _ { _ body:series_of_statements _ }"},"compare_ints":{"R":"identical _ ( _ var1:Add _ , _ var2:Add _ )","Lua,Pydatalog,E,Ceylon,Perl 6,EnglishScript,Cython,Mathematical notation,Dafny,Wolfram,D,Rust,R,MiniZinc,Frink,Picat,Pike,Pawn,Processing,C++,Ceylon,CoffeeScript,Octave,Swift,AWK,Julia,Perl,Groovy,Erlang,Haxe,Scala,Java,Vala,Dart,Python,C#,C,Go,Haskell,Ruby":"var1:Add _ == _ var2:Add","JavaScript,PHP,TypeScript,Hack":"var1:Add _ === _ var2:Add","Z3,Emacs Lisp,Common Lisp,CLIPS,Racket":"( _ = __ var1:Factor __ var2:Factor _ )","Fortran":"var1:Add _ .eq. _ var2:Add","Maxima,Monkey X,GAP,REBOL,F#,AutoIt,Pascal,Delphi,Visual Basic,Visual Basic .NET,OCaml,LiveCode,VBScript":"var1:Add _ = _ var2:Add","Prolog":"var1:Add _ =:= _ var2:Add","Clojure":"( _ = __ a __ b _ )","Reverse Polish notation":"a __ b __ =","Polish notation":"= __ a __ b"},"class":{"Julia":"type __ name:Identifier __ body:class_statements __ end","C,Z3,Lua,Prolog,Haskell,MiniZinc,R,Go,REBOL,Fortran":"body:function","Java,C#":"public __ class __ name:Identifier _ { _ body:class_statements _ }","C++":"class __ name:Identifier _ { _ body:class_statements _ } _ ;","JavaScript,Hack,PHP,Scala,Haxe,Chapel,Swift,D,TypeScript,Dart,Perl 6":"class __ name:Identifier _ { _ body:class_statements _ }","Ruby":"class __ name:Identifier __ body:class_statements __ end","Visual Basic .NET":"Public __ Class __ name:Identifier __ body:class_statements __ End __ Class","VBScript":"Public __ Class __ name:Identifier __ body:class_statements __ End __ Class","Python":"class __ name:Identifier _ : _ \\n _ #indent _ \\n _ body:class_statements _ \\n _ #unindent","Monkey X":"Class __ name:Identifier __ body:class_statements __ End"},"class_extends":{"Python":"class __ c1:Identifier _ ( _ c2:Identifier _ ) _ : _ \\n _ #indent _ \\n _ b:class_statements _ \\n _ #unindent","Visual Basic .NET":"Public __ Class __ c1:Identifier __ Inherits __ c2:Identifier __ b:class_statements __ End __ Class","Swift,Chapel,D,Swift":"class __ c1:Identifier _ : _ c2:Identifier _ { _ b:class_statements _ }","Haxe,PHP,JavaScript,Dart,TypeScript":"class __ c1:Identifier __ extends __ c2:Identifier _ { _ b:class_statements _ }","Java,C#,Scala":"public __ class __ c1:Identifier __ extends __ c2:Identifier _ { _ b:class_statements _ }","C":"#include __ ' _ c2:Identifier _ .h' __ b:class_statements","C++":"class __ c1:Identifier _ : _ public __ c2:Identifier _ { _ b:class_statements _ }","Ruby":"class __ c1:Identifier __ < __ c2:Identifier __ b:class_statements __ end","Perl 6":"class __ c1:Identifier __ is __ c2:Identifier _ { _ b:class_statements _ }","Monkey X":"Class __ c1:Identifier __ Extends __ c2:Identifier __ b:class_statements __ End"},"function_parameter":{"crosslanguage":"( _ parameter __ type:type __ name:var_name _ )","C#,Java,EnglishScript,Ceylon,ALGOL 68,Groovy,D,C++,Pawn,Pike,Vala,C,Janus":"type:type __ name:var_name","Haxe,Dafny,Chapel,Pascal,Rust,Genie,Hack,Nimrod,TypeScript,Gosu,Delphi,Nemerle,Scala,Swift":"name:var_name _ : _ type:type","Go":"name:var_name __ type:type","MiniZinc":"var __ type:type _ : _ name:var_name","Haskell,Polish notation,Reverse Polish notation,Scheme,Python,Mathematical notation,LispyScript,CLIPS,Clojure,F#,ML,Racket,OCaml,Tcl,Common Lisp,newLisp,Python,Cython,Frink,Picat,IDP,PowerShell,Maxima,Icon,CoffeeScript,Fortran,Octave,AutoHotKey,Prolog,AWK,Kotlin,Dart,JavaScript,Nemerle,Erlang,PHP,AutoIt,Lua,Ruby,R,bc":"name:var_name","Julia":"name:var_name _ :: _ type:type","REBOL":"type:type _ [ _ name:var_name _ ]","OpenOffice Basic,Gambas":"name:var_name __ As __ type:type","Visual Basic,Visual Basic .NET":"name:var_name __ as __ type:type","Perl":"name:var_name _ = _ push _ ;","Wolfram":"name:var_name _","Z3":"( _ name:var_name __ type:type _ )"},"switch":{"crosslanguage":"( _ switch __ a:expression __ b:case_statements __ c:default _ )","Rust":"match __ a:expression _ { _ b:case_statements __ c:default _ }","OCaml":"match __ a:expression __ with","Elixir":"case __ a:expression __ do __ b:case_statements __ c:default __ end","Scala":"a:expression __ match _ { _ b:case_statements __ c:default _ }","Octave":"switch _ ( _ a:expression _ ) _ b:case_statements __ endswitch","Java,D,PowerShell,Nemerle,D,TypeScript,Hack,Swift,Groovy,Dart,AWK,C#,JavaScript,C++,PHP,C,Go,Haxe,Vala":"switch _ ( _ a:expression _ ) _ { _ b:case_statements __ c:default _ }","Ruby":"case __ a:expression __ b:case_statements __ c:default __ end","Haskell,Erlang":"case __ a:expression __ of __ b:case_statements __ c:default __ end","Delphi,Pascal":"Case __ a:expression __ of __ b:case_statements __ c:default __ end;","CLIPS":"( _ switch __ a:expression __ b:case_statements __ c:default _ )","Visual Basic .NET,Visual Basic":"Select __ Case __ a:expression __ b:case_statements __ c:default __ End __ Select","REBOL":"switch/default _ [ _ a:expression __ b:case_statements _ ]","Fortran":"SELECT __ CASE _ ( _ a:expression _ ) __ b:case_statements __ c:default __ END __ SELECT","Clojure":"( _ case __ a:expression __ b:case_statements __ c:default _ )","Chapel":"select _ ( _ a:expression _ ) _ { _ b:case_statements _ c:default _ }","Wolfram":"Switch _ [ _ a:expression _ , _ b:case_statements _ , _ c:default _ ]"},"case":{"crosslanguage":"( _ case __ a:expression __ b:series_of_statements _ )","JavaScript,D,Java,C#,C,C++,TypeScript,Dart,PHP,Hack":"case __ a:expression _ : _ b:series_of_statements _ break _ ;","Go,Haxe,Swift":"case __ a:expression _ : _ b:series_of_statements","Fortran":"CASE _ ( _ a:expression _ ) __ b:series_of_statements","Rust":"a:expression _ => _ { _ b:series_of_statements _ }","Ruby":"when __ a:expression __ b:series_of_statements","Haskell,Erlang,Elixir,OCaml":"a:expression _ -> _ b:series_of_statements","CLIPS":"( _ case __ a:expression __ then __ b:series_of_statements _ )","Scala":"case __ a:expression _ => _ b:series_of_statements","Visual Basic .NET":"Case __ a:expression __ b:series_of_statements","REBOL":"a:expression _ [ _ b:series_of_statements _ ]","Octave":"case __ a:expression __ b:series_of_statements","Clojure":"( _ a:expression __ b:series_of_statements _ )","Pascal,Delphi:":"a:expression _ : _ b:series_of_statements","Chapel":"when __ a:expression _ { _ b:series_of_statements _ }","Wolfram":"a:expression _ , _ b:series_of_statements"},"access_array":{"Python,Lua,C#,Julia,D,Swift,Julia,Janus,MiniZinc,Picat,Nimrod,AutoIt,Cython,CoffeeScript,Dart,TypeScript,AWK,Vala,Perl,Java,JavaScript,Ruby,Go,C++,PHP,Haxe,C":"a:Identifier _ [ _ b:(array_access_index/array_access_list) _ ]","Scala,Octave,Fortran,Visual Basic,Visual Basic .NET":"a:Identifier _ ( _ b:(array_access_index/array_access_list) _ )","Haskell":"( _ a:Identifier _ !! _ b:(array_access_index/array_access_list) _ )","Frink":"a:Identifier _ @ _ b:(array_access_index/array_access_list)","Z3":"( _ select __ a:Identifier __ b:expression _ )","REBOL":"a:Identifier _ / _ b:(array_access_index/array_access_list)"},"array_access_list":{"Java,Octave,Picat,Julia,Go,C#,Lua,C++,Python,JavaScript,C,PHP,Ruby,Scala,Haxe,Fortran,TypeScript,MiniZinc,Dart,Visual Basic .NET,Perl,Swift,Haskell,REBOL":"var1:array_access_index _ separator:array_access_separator _ var2:array_access_list"},"array_access_index":{"Lua,MiniZinc,REBOL":"a:array_access_index_2","Haskell,D,Frink,C#,Visual Basic,Janus,Visual Basic .NET,Scala,Octave,Fortran,Python,Swift,Julia,Picat,Nimrod,AutoIt,Cython,CoffeeScript,Dart,TypeScript,AWK,Vala,Perl,Java,JavaScript,Ruby,Go,C++,PHP,Haxe,C":"a:array_access_index_1"},"array_access_index_1":{"Lua,MiniZinc,REBOL":"a:expression _ + _ 1","Haskell,D,Frink,C#,Visual Basic,Janus,Visual Basic .NET,Scala,Octave,Fortran,Python,Swift,Julia,Picat,Nimrod,AutoIt,Cython,CoffeeScript,Dart,TypeScript,AWK,Vala,Perl,Java,JavaScript,Ruby,Go,C++,PHP,Haxe,C":"a:expression"},"array_access_index_2":{"Lua,MiniZinc,REBOL":"a:expression","Haskell,D,Frink,C#,Visual Basic,Janus,Visual Basic .NET,Scala,Octave,Fortran,Python,Swift,Julia,Picat,Nimrod,AutoIt,Cython,CoffeeScript,Dart,TypeScript,AWK,Vala,Perl,Java,JavaScript,Ruby,Go,C++,PHP,Haxe,C":"a:expression _ - _ 1"},"initialize_static_variable":{"Swift":"static __ var __ name:var_name","Java,C#":"public __ static __ type:type __ name:var_name","PHP":"public __ static __ name:var_name","C++,Dart":"static __ type:type __ name:var_name","Python":"_","Haxe":"static __ var __ name:var_name _ : _ type:type","Ruby":"__","Visual Basic .NET":"Public __ Shared __ name:var_name __ As __ type:type"},"initialize_static_variable_with_value":{"Swift":"static __ var __ name:var_name _ = _ value:expression","Java,C#":"public __ static __ type:type __ name:var_name _ = _ value:expression","PHP":"public __ static __ name:var_name _ = _ value:expression","C++,Dart":"static __ type:type __ name:var_name _ = _ value:expression","Python":"name:var_name _ = _ value:expression","Ruby":"@@ _ name:var_name _ = _ type:type","Haxe":"static __ var __ name:var_name _ : _ type:type _ = _ value:expression","Visual Basic .NET":"Public __ Shared __ name:var_name __ As __ type:type _ = _ value:expression"},"default":{"Fortran":"CASE __ DEFAULT __ a:series_of_statements","crosslanguage":"( _ default __ a:series_of_statements _ )","JavaScript,D,C,Java,C#,C++,TypeScript,Dart,PHP,Haxe,Hack,Go,Swift":"default _ : _ a:series_of_statements","Ruby,Pascal,Delphi":"else __ a:series_of_statements","Haskell,Erlang,OCaml":"_ _ -> __ a:series_of_statements","Rust":"_ _ => _ a:series_of_statements","CLIPS":"( _ default __ a:series_of_statements _ )","Scala":"case __ _ => _ a:series_of_statements","Visual Basic .NET":"Case __ Else __ a:series_of_statements","REBOL":"][ a:series_of_statements","Octave":"otherwise __ a:series_of_statements","Chapel":"otherwise _ { _ a:series_of_statements _ }","Clojure":"a:series_of_statements","Wolfram":"_ _ , _ a:series_of_statements"}};
var parsers = {'ebnf':(function() {
  "use strict";

  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},
        parser  = this,

        peg$FAILED = {},

        peg$startRuleFunctions = { Main: peg$parseMain },
        peg$startRuleFunction  = peg$parseMain,

        peg$c0 = function(var1) {return var1;},
        peg$c1 = ",",
        peg$c2 = { type: "literal", value: ",", description: "\",\"" },
        peg$c3 = function(a, b) {return ["grammar_concatenate_string", {a:a,b:b,}];},
        peg$c4 = "|",
        peg$c5 = { type: "literal", value: "|", description: "\"|\"" },
        peg$c6 = function(var1, var2) {return ["grammar_Or", {var1:var1,var2:var2,}];},
        peg$c7 = function(var1, var2) {return ["grammar_series_of_statements", {var1:var1,var2:var2,}];},
        peg$c8 = "=",
        peg$c9 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c10 = ";",
        peg$c11 = { type: "literal", value: ";", description: "\";\"" },
        peg$c12 = function(name, value) {return ["grammar_statement", {name:name,value:value,}];},
        peg$c13 = function(type) {return ["grammar_parameter", {type:type,}];},
        peg$c14 = function(type) {return ["nameless_grammar_parameter", {type:type,}];},
        peg$c15 = function(the_str) {return ["grammar_string_literal", {the_str:the_str,}];},
        peg$c16 = "(",
        peg$c17 = { type: "literal", value: "(", description: "\"(\"" },
        peg$c18 = ")",
        peg$c19 = { type: "literal", value: ")", description: "\")\"" },
        peg$c20 = function(a) {return ["grammar_parentheses_expression", {a:a,}];},
        peg$c21 = { type: "other", description: "identifier" },
        peg$c22 = "local",
        peg$c23 = { type: "literal", value: "local", description: "\"local\"" },
        peg$c24 = "As",
        peg$c25 = { type: "literal", value: "As", description: "\"As\"" },
        peg$c26 = "Concat",
        peg$c27 = { type: "literal", value: "Concat", description: "\"Concat\"" },
        peg$c28 = "CharAt",
        peg$c29 = { type: "literal", value: "CharAt", description: "\"CharAt\"" },
        peg$c30 = "retval",
        peg$c31 = { type: "literal", value: "retval", description: "\"retval\"" },
        peg$c32 = "function",
        peg$c33 = { type: "literal", value: "function", description: "\"function\"" },
        peg$c34 = "return",
        peg$c35 = { type: "literal", value: "return", description: "\"return\"" },
        peg$c36 = "Return",
        peg$c37 = { type: "literal", value: "Return", description: "\"Return\"" },
        peg$c38 = "Function",
        peg$c39 = { type: "literal", value: "Function", description: "\"Function\"" },
        peg$c40 = "End",
        peg$c41 = { type: "literal", value: "End", description: "\"End\"" },
        peg$c42 = "false",
        peg$c43 = { type: "literal", value: "false", description: "\"false\"" },
        peg$c44 = "true",
        peg$c45 = { type: "literal", value: "true", description: "\"true\"" },
        peg$c46 = "False",
        peg$c47 = { type: "literal", value: "False", description: "\"False\"" },
        peg$c48 = "split",
        peg$c49 = { type: "literal", value: "split", description: "\"split\"" },
        peg$c50 = "join",
        peg$c51 = { type: "literal", value: "join", description: "\"join\"" },
        peg$c52 = "equals",
        peg$c53 = { type: "literal", value: "equals", description: "\"equals\"" },
        peg$c54 = "Console",
        peg$c55 = { type: "literal", value: "Console", description: "\"Console\"" },
        peg$c56 = "System",
        peg$c57 = { type: "literal", value: "System", description: "\"System\"" },
        peg$c58 = "break",
        peg$c59 = { type: "literal", value: "break", description: "\"break\"" },
        peg$c60 = "while",
        peg$c61 = { type: "literal", value: "while", description: "\"while\"" },
        peg$c62 = "if",
        peg$c63 = { type: "literal", value: "if", description: "\"if\"" },
        peg$c64 = "else",
        peg$c65 = { type: "literal", value: "else", description: "\"else\"" },
        peg$c66 = "ite",
        peg$c67 = { type: "literal", value: "ite", description: "\"ite\"" },
        peg$c68 = "end",
        peg$c69 = { type: "literal", value: "end", description: "\"end\"" },
        peg$c70 = "then",
        peg$c71 = { type: "literal", value: "then", description: "\"then\"" },
        peg$c72 = "and",
        peg$c73 = { type: "literal", value: "and", description: "\"and\"" },
        peg$c74 = "or",
        peg$c75 = { type: "literal", value: "or", description: "\"or\"" },
        peg$c76 = /^[a-zA-Z0-9_]/,
        peg$c77 = { type: "class", value: "[a-zA-Z0-9_]", description: "[a-zA-Z0-9_]" },
        peg$c78 = function() {return text();},
        peg$c79 = "-",
        peg$c80 = { type: "literal", value: "-", description: "\"-\"" },
        peg$c81 = function(a) {return "-" + a;},
        peg$c82 = ".",
        peg$c83 = { type: "literal", value: ".", description: "\".\"" },
        peg$c84 = function(a, b) {return a + "." + b;},
        peg$c85 = { type: "other", description: "integer" },
        peg$c86 = /^[0-9]/,
        peg$c87 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c88 = function() { return text(); },
        peg$c89 = { type: "other", description: "whitespace" },
        peg$c90 = /^[ \t\n\r]/,
        peg$c91 = { type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]" },
        peg$c92 = { type: "other", description: "whitespace2" },
        peg$c93 = "\"",
        peg$c94 = { type: "literal", value: "\"", description: "\"\\\"\"" },
        peg$c95 = function(var1) {return ["string_literal", {var1:var1}];},
        peg$c96 = "'",
        peg$c97 = { type: "literal", value: "'", description: "\"'\"" },
        peg$c98 = function(var1) {return ["string literal", var1];},
        peg$c99 = /^[^"]/,
        peg$c100 = { type: "class", value: "[^\"]", description: "[^\"]" },
        peg$c101 = /^[^']/,
        peg$c102 = { type: "class", value: "[^']", description: "[^']" },

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1, seenCR: false }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$resultsCache = {},

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function error(message) {
      throw peg$buildException(
        message,
        null,
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos],
          p, ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column,
          seenCR: details.seenCR
        };

        while (p < pos) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0100-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1000-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parseMain() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 19 + 0,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsegrammar_series_of_statements();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c0(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parse_();
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsegrammar_concatenate_string() {
      var s0, s1, s2, s3, s4, s5;

      var key    = peg$currPos * 19 + 1,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseFactor();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c1;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c2); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsegrammar_concatenate_string();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c3(s1, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseFactor();
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseFactor() {
      var s0;

      var key    = peg$currPos * 19 + 2,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$parsegrammar_string_literal();
      if (s0 === peg$FAILED) {
        s0 = peg$parsegrammar_parentheses_expression();
        if (s0 === peg$FAILED) {
          s0 = peg$parsegrammar_parameter();
          if (s0 === peg$FAILED) {
            s0 = peg$parsenameless_grammar_parameter();
          }
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsegrammar_Or() {
      var s0, s1, s2, s3, s4, s5;

      var key    = peg$currPos * 19 + 3,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsegrammar_concatenate_string();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 124) {
            s3 = peg$c4;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c5); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsegrammar_Or();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c6(s1, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parsegrammar_concatenate_string();
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsegrammar_series_of_statements() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 19 + 4,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsegrammar_statement();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse__();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsegrammar_series_of_statements();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c7(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parsegrammar_statement();
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsegrammar_statement() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      var key    = peg$currPos * 19 + 5,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseIdentifier();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s3 = peg$c8;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c9); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsegrammar_Or();
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 59) {
                    s7 = peg$c10;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c11); }
                  }
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c12(s1, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsegrammar_parameter() {
      var s0, s1;

      var key    = peg$currPos * 19 + 6,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseIdentifier();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c13(s1);
      }
      s0 = s1;

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsenameless_grammar_parameter() {
      var s0, s1;

      var key    = peg$currPos * 19 + 7,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseIdentifier();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c14(s1);
      }
      s0 = s1;

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsegrammar_string_literal() {
      var s0, s1;

      var key    = peg$currPos * 19 + 8,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsestring_literal();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c15(s1);
      }
      s0 = s1;

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsegrammar_parentheses_expression() {
      var s0, s1, s2, s3, s4, s5;

      var key    = peg$currPos * 19 + 9,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c16;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c17); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsegrammar_Or();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s5 = peg$c18;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c19); }
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c20(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseIdentifier() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 19 + 10,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      s2 = peg$parseInteger();
      if (s2 === peg$FAILED) {
        s2 = peg$parseInteger();
        if (s2 === peg$FAILED) {
          if (input.substr(peg$currPos, 5) === peg$c22) {
            s2 = peg$c22;
            peg$currPos += 5;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c23); }
          }
          if (s2 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c24) {
              s2 = peg$c24;
              peg$currPos += 2;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c25); }
            }
            if (s2 === peg$FAILED) {
              if (input.substr(peg$currPos, 6) === peg$c26) {
                s2 = peg$c26;
                peg$currPos += 6;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c27); }
              }
              if (s2 === peg$FAILED) {
                if (input.substr(peg$currPos, 6) === peg$c28) {
                  s2 = peg$c28;
                  peg$currPos += 6;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c29); }
                }
                if (s2 === peg$FAILED) {
                  if (input.substr(peg$currPos, 6) === peg$c30) {
                    s2 = peg$c30;
                    peg$currPos += 6;
                  } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c31); }
                  }
                  if (s2 === peg$FAILED) {
                    if (input.substr(peg$currPos, 8) === peg$c32) {
                      s2 = peg$c32;
                      peg$currPos += 8;
                    } else {
                      s2 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c33); }
                    }
                    if (s2 === peg$FAILED) {
                      if (input.substr(peg$currPos, 6) === peg$c34) {
                        s2 = peg$c34;
                        peg$currPos += 6;
                      } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c35); }
                      }
                      if (s2 === peg$FAILED) {
                        if (input.substr(peg$currPos, 6) === peg$c36) {
                          s2 = peg$c36;
                          peg$currPos += 6;
                        } else {
                          s2 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c37); }
                        }
                        if (s2 === peg$FAILED) {
                          if (input.substr(peg$currPos, 8) === peg$c38) {
                            s2 = peg$c38;
                            peg$currPos += 8;
                          } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c39); }
                          }
                          if (s2 === peg$FAILED) {
                            if (input.substr(peg$currPos, 3) === peg$c40) {
                              s2 = peg$c40;
                              peg$currPos += 3;
                            } else {
                              s2 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c41); }
                            }
                            if (s2 === peg$FAILED) {
                              if (input.substr(peg$currPos, 5) === peg$c42) {
                                s2 = peg$c42;
                                peg$currPos += 5;
                              } else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c43); }
                              }
                              if (s2 === peg$FAILED) {
                                if (input.substr(peg$currPos, 4) === peg$c44) {
                                  s2 = peg$c44;
                                  peg$currPos += 4;
                                } else {
                                  s2 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c45); }
                                }
                                if (s2 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 5) === peg$c46) {
                                    s2 = peg$c46;
                                    peg$currPos += 5;
                                  } else {
                                    s2 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c47); }
                                  }
                                  if (s2 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 4) === peg$c44) {
                                      s2 = peg$c44;
                                      peg$currPos += 4;
                                    } else {
                                      s2 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c45); }
                                    }
                                    if (s2 === peg$FAILED) {
                                      if (input.substr(peg$currPos, 5) === peg$c48) {
                                        s2 = peg$c48;
                                        peg$currPos += 5;
                                      } else {
                                        s2 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c49); }
                                      }
                                      if (s2 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 4) === peg$c50) {
                                          s2 = peg$c50;
                                          peg$currPos += 4;
                                        } else {
                                          s2 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c51); }
                                        }
                                        if (s2 === peg$FAILED) {
                                          if (input.substr(peg$currPos, 6) === peg$c52) {
                                            s2 = peg$c52;
                                            peg$currPos += 6;
                                          } else {
                                            s2 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c53); }
                                          }
                                          if (s2 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 7) === peg$c54) {
                                              s2 = peg$c54;
                                              peg$currPos += 7;
                                            } else {
                                              s2 = peg$FAILED;
                                              if (peg$silentFails === 0) { peg$fail(peg$c55); }
                                            }
                                            if (s2 === peg$FAILED) {
                                              if (input.substr(peg$currPos, 6) === peg$c56) {
                                                s2 = peg$c56;
                                                peg$currPos += 6;
                                              } else {
                                                s2 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c57); }
                                              }
                                              if (s2 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 5) === peg$c58) {
                                                  s2 = peg$c58;
                                                  peg$currPos += 5;
                                                } else {
                                                  s2 = peg$FAILED;
                                                  if (peg$silentFails === 0) { peg$fail(peg$c59); }
                                                }
                                                if (s2 === peg$FAILED) {
                                                  if (input.substr(peg$currPos, 5) === peg$c60) {
                                                    s2 = peg$c60;
                                                    peg$currPos += 5;
                                                  } else {
                                                    s2 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c61); }
                                                  }
                                                  if (s2 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 2) === peg$c62) {
                                                      s2 = peg$c62;
                                                      peg$currPos += 2;
                                                    } else {
                                                      s2 = peg$FAILED;
                                                      if (peg$silentFails === 0) { peg$fail(peg$c63); }
                                                    }
                                                    if (s2 === peg$FAILED) {
                                                      if (input.substr(peg$currPos, 4) === peg$c64) {
                                                        s2 = peg$c64;
                                                        peg$currPos += 4;
                                                      } else {
                                                        s2 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c65); }
                                                      }
                                                      if (s2 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 3) === peg$c66) {
                                                          s2 = peg$c66;
                                                          peg$currPos += 3;
                                                        } else {
                                                          s2 = peg$FAILED;
                                                          if (peg$silentFails === 0) { peg$fail(peg$c67); }
                                                        }
                                                        if (s2 === peg$FAILED) {
                                                          if (input.substr(peg$currPos, 3) === peg$c68) {
                                                            s2 = peg$c68;
                                                            peg$currPos += 3;
                                                          } else {
                                                            s2 = peg$FAILED;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c69); }
                                                          }
                                                          if (s2 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 4) === peg$c70) {
                                                              s2 = peg$c70;
                                                              peg$currPos += 4;
                                                            } else {
                                                              s2 = peg$FAILED;
                                                              if (peg$silentFails === 0) { peg$fail(peg$c71); }
                                                            }
                                                            if (s2 === peg$FAILED) {
                                                              if (input.substr(peg$currPos, 3) === peg$c72) {
                                                                s2 = peg$c72;
                                                                peg$currPos += 3;
                                                              } else {
                                                                s2 = peg$FAILED;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c73); }
                                                              }
                                                              if (s2 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 2) === peg$c74) {
                                                                  s2 = peg$c74;
                                                                  peg$currPos += 2;
                                                                } else {
                                                                  s2 = peg$FAILED;
                                                                  if (peg$silentFails === 0) { peg$fail(peg$c75); }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = void 0;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c76.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c77); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c76.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c77); }
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c78();
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c21); }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseInteger() {
      var s0, s1, s2;

      var key    = peg$currPos * 19 + 11,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 45) {
        s1 = peg$c79;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c80); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_Integer();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c81(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parse_Integer();
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parse_Integer() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 19 + 12,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parse__Integer();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s2 = peg$c82;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c83); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse__Integer();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c84(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parse__Integer();
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parse__Integer() {
      var s0, s1, s2;

      var key    = peg$currPos * 19 + 13,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      if (peg$c86.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c87); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c86.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c87); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c88();
      }
      s0 = s1;
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c85); }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parse_() {
      var s0, s1;

      var key    = peg$currPos * 19 + 14,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      peg$silentFails++;
      s0 = [];
      if (peg$c90.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c91); }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c90.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c91); }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c89); }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parse__() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 19 + 15,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      peg$silentFails++;
      s0 = peg$currPos;
      if (peg$c90.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c91); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c90.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c91); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c90.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c91); }
          }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c92); }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsestring_literal() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 19 + 16,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 34) {
        s1 = peg$c93;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c94); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_string_literal();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 34) {
            s3 = peg$c93;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c94); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c95(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 39) {
          s1 = peg$c96;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c97); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse__string_literal();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 39) {
              s3 = peg$c96;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c97); }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c98(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parse_string_literal() {
      var s0, s1, s2;

      var key    = peg$currPos * 19 + 17,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      if (peg$c99.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c100); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c99.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c100); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c78();
      }
      s0 = s1;

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parse__string_literal() {
      var s0, s1, s2;

      var key    = peg$currPos * 19 + 18,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      if (peg$c101.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c102); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c101.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c102); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c78();
      }
      s0 = s1;

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(
        null,
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})(),};function typeInference(parseTree){
	const arithmetic_expressions = "Add,sin,cos,Multiply,sqrt,pow,-,*,/";
	const string_expressions = "join,concatenate_string,int_to_string,string_literal";
	if(typeof(parseTree) === "string"){
		return parseTree;
	}
	else if(typeof(parseTree) === "number"){
		return parseTree;
	}
	console.log(JSON.stringify(parseTree))
	for(var current in parseTree[1]){
		parseTree[1][current] = typeInference(parseTree[1][current]);
	}
	if(acs(parseTree[0], "set_var,key_value,initializer_list_separator,initializer_list,_initializer_list,split,statement_with_semicolon,Or,And,parameters,function_call_parameters,var_name,if,elif,else,function_parameter,int,boolean,void,double,function_parameter,default_parameter,type,sin,cos,tan,pow,print,-,/,*,string_literal,pow")){
		return parseTree;
	}
	else if(acs(parseTree[0], 'add')){
		if(acs(parseTree[1]["var1"][0], string_expressions)){
			parseTree[0] = 'concatenate_string';
		}
		else if(acs(parseTree[1]["var2"][0], string_expressions)){
			parseTree[0] = 'concatenate_string';
		}
	}
	else if(acs(parseTree[0], 'concatenate_string')){
		if(acs(parseTree[1]["var1"][0], arithmetic_expressions)){
			parseTree[0] = '+';
		}
		else if(acs(parseTree[1]["var2"][0], arithmetic_expressions)){
			parseTree[0] = '+';
		}
	}
	else if(parseTree[0] === 'array_type' && parseTree[1]["var2"] === undefined){
		parseTree[1]["var2"] = '[]';
	}
	else if(acs(parseTree[0], "typeless_initialize_var,initialize_var,initialize_static_variable,initialize_static_variable_with_value,declare_constant,typeless_declare_constant,typeless_declare_constant")){
		if(acs(parseTree[1]["value"][0], arithmetic_expressions)){
			parseTree[1]["type"] = ["double", {}];
			return parseTree;
		}
		else if(acs(parseTree[1]["value"][0], "And,Or")){
			parseTree[1]["type"] = ["boolean", {}];
			return parseTree;
		}
		else if(acs(parseTree[1]["value"][0], "split")){
			parseTree[1]["type"] = ["type",{"var1":["string",{}],"var2":"[]"}];
			return parseTree;
		}
		else if(acs(parseTree[1]["value"][0], "string_to_int")){
			parseTree[1]["type"] = ["int", {}];
			return parseTree;
		}
		else if(acs(parseTree[1]["value"][0], string_expressions)){
			parseTree[1]["type"] = ["string", {}];
			return parseTree;
		}
		else if(parseTree[1]["type"] !== undefined){
			return parseTree;
		}
	}
	else{
		throw("typeInference is not yet defined for " +parseTree[0]);
	}
}
function generateCode(parseTree, outputLang){
	if(typeof(parseTree) === "string"){
		return parseTree;
	}
	var d = {};
	for(var current in parseTree[1]){
		d[current] = generateCode(parseTree[1][current], outputLang);
	}
	switch(parseTree[0]){
		case "string_literal":
			return "\"" + d.var1 + "\"";
		break;
		case "parameters":
			if(acs(outputLang,"JavaScript,Dafny,Wolfram,Gambas,D,Frink,Chapel,Swift,Perl 6,OCaml,Janus,Mathematical notation,Pascal,Rust,Picat,AutoHotKey,Maxima,Octave,Julia,R,Prolog,Fortran,Go,MiniZinc,Erlang,CoffeeScript,PHP,Hack,Java,C#,C,C++,Lua,TypeScript,Dart,Ruby,Python,Haxe,Scala,Visual Basic,Visual Basic .NET")){
				return d.var1 +","+ d.var2;
			}
			else if(acs(outputLang, "Hy,Z3,Scheme,Racket,Common Lisp,CLIPS,REBOL,Haskell,Racket,Clojure")){
				return d.var1 +" "+d.var2;
			}
		break;
		case "compare_ints":
			var toReturn = pattern_to_output(d,"compare_ints",outputLang);
			if(!acs(outputLang, "Racket,Z3,CLIPS,GNU Smalltalk,newLisp,Hy,Common Lisp,Emacs Lisp,Clojure,Sibilant,LispyScript")){
				return "(" + toReturn +")";
			}
			return toReturn;
		break;
		case "type":
			if(d.var2 === undefined){
				return d.var1;
			}
			else
				return d.var1 + d.var2;
		case "array_type_suffix":
			if(d.var2 === undefined){
				return d.var1;
			}
			else
				return d.var1 + d.var2;
		case undefined:
			throw JSON.stringify(parseTree);
		default:
			return pattern_to_output(d,parseTree[0],outputLang);
	}
	
	var keys = [];
	for(var k in parseTree[1]) keys.push(k);
	throw parseTree[0] + " is not yet defined for " + outputLang + " with keys " + keys.join(",")
}
function translateLang(lang1, lang2, text){
	var parseTree = parsers[lang1.toLowerCase()].parse(text);
	//alert(JSON.stringify(parseTree));
	return generateCode(parseTree, lang2.toLowerCase())
}
