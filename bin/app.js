(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var Hash = function() {
	this.h = { };
};
$hxClasses["Hash"] = Hash;
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = function() { }
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIter = function(min,max) {
	this.min = min;
	this.max = max;
};
$hxClasses["IntIter"] = IntIter;
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var Lambda = function() { }
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.mapi = function(it,f) {
	var l = new List();
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(i++,x));
	}
	return l;
}
Lambda.has = function(it,elt,cmp) {
	if(cmp == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			if(x == elt) return true;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(cmp(x,elt)) return true;
		}
	}
	return false;
}
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
}
Lambda.foreach = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
}
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
}
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
Lambda.concat = function(a,b) {
	var l = new List();
	var $it0 = $iterator(a)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	var $it1 = $iterator(b)();
	while( $it1.hasNext() ) {
		var x = $it1.next();
		l.add(x);
	}
	return l;
}
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = function() { }
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = function() { }
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = function() { }
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { }
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var brix = {}
brix.component = {}
brix.component.IBrixComponent = function() { }
$hxClasses["brix.component.IBrixComponent"] = brix.component.IBrixComponent;
brix.component.IBrixComponent.__name__ = ["brix","component","IBrixComponent"];
brix.component.IBrixComponent.prototype = {
	getBrixApplication: null
	,brixInstanceId: null
	,__class__: brix.component.IBrixComponent
}
brix.component.BrixComponent = function() { }
$hxClasses["brix.component.BrixComponent"] = brix.component.BrixComponent;
brix.component.BrixComponent.__name__ = ["brix","component","BrixComponent"];
brix.component.BrixComponent.initBrixComponent = function(component,brixInstanceId) {
	component.brixInstanceId = brixInstanceId;
}
brix.component.BrixComponent.getBrixApplication = function(component) {
	return brix.core.Application.get(component.brixInstanceId);
}
brix.component.BrixComponent.checkRequiredParameters = function(cmpClass,elt) {
	var requires = haxe.rtti.Meta.getType(cmpClass).requires;
	if(requires == null) return;
	var _g = 0;
	while(_g < requires.length) {
		var r = requires[_g];
		++_g;
		if(elt.getAttribute(Std.string(r)) == null || StringTools.trim(elt.getAttribute(Std.string(r))) == "") throw Std.string(r) + " parameter is required for " + Type.getClassName(cmpClass);
	}
}
brix.component.ui = {}
brix.component.ui.IDisplayObject = function() { }
$hxClasses["brix.component.ui.IDisplayObject"] = brix.component.ui.IDisplayObject;
brix.component.ui.IDisplayObject.__name__ = ["brix","component","ui","IDisplayObject"];
brix.component.ui.IDisplayObject.__interfaces__ = [brix.component.IBrixComponent];
brix.component.ui.IDisplayObject.prototype = {
	rootElement: null
	,__class__: brix.component.ui.IDisplayObject
}
brix.component.ui.DisplayObject = function(rootElement,brixId) {
	this.rootElement = rootElement;
	brix.component.BrixComponent.initBrixComponent(this,brixId);
	this.getBrixApplication().addAssociatedComponent(rootElement,this);
};
$hxClasses["brix.component.ui.DisplayObject"] = brix.component.ui.DisplayObject;
brix.component.ui.DisplayObject.__name__ = ["brix","component","ui","DisplayObject"];
brix.component.ui.DisplayObject.__interfaces__ = [brix.component.ui.IDisplayObject];
brix.component.ui.DisplayObject.isDisplayObject = function(cmpClass) {
	if(cmpClass == Type.resolveClass("brix.component.ui.DisplayObject")) return true;
	if(Type.getSuperClass(cmpClass) != null) return brix.component.ui.DisplayObject.isDisplayObject(Type.getSuperClass(cmpClass));
	return false;
}
brix.component.ui.DisplayObject.checkFilterOnElt = function(cmpClass,elt) {
	if(elt.nodeType != js.Lib.document.body.nodeType) throw "cannot instantiate " + Type.getClassName(cmpClass) + " on a non element node.";
	var tagFilter = haxe.rtti.Meta.getType(cmpClass) != null?haxe.rtti.Meta.getType(cmpClass).tagNameFilter:null;
	if(tagFilter == null) return;
	if(Lambda.exists(tagFilter,function(s) {
		return elt.nodeName.toLowerCase() == Std.string(s).toLowerCase();
	})) return;
	throw "cannot instantiate " + Type.getClassName(cmpClass) + " on this type of HTML element: " + elt.nodeName.toLowerCase();
}
brix.component.ui.DisplayObject.prototype = {
	clean: function() {
	}
	,init: function() {
	}
	,remove: function() {
		this.clean();
		this.getBrixApplication().removeAssociatedComponent(this.rootElement,this);
	}
	,getBrixApplication: function() {
		return brix.component.BrixComponent.getBrixApplication(this);
	}
	,rootElement: null
	,brixInstanceId: null
	,__class__: brix.component.ui.DisplayObject
}
brix.component.group = {}
brix.component.group.Group = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	var explodedClassName = rootElement.className.split(" ");
	if(Lambda.has(explodedClassName,"Group")) {
		brix.component.group.Group.GROUP_SEQ++;
		var newGroupId = "Group" + brix.component.group.Group.GROUP_SEQ + "r";
		HxOverrides.remove(explodedClassName,"Group");
		explodedClassName.unshift(newGroupId);
		rootElement.className = explodedClassName.join(" ");
		var $it0 = this.discoverGroupableChilds(rootElement).iterator();
		while( $it0.hasNext() ) {
			var gc = $it0.next();
			gc.setAttribute("data-group-id",newGroupId);
		}
	}
};
$hxClasses["brix.component.group.Group"] = brix.component.group.Group;
brix.component.group.Group.__name__ = ["brix","component","group","Group"];
brix.component.group.Group.__super__ = brix.component.ui.DisplayObject;
brix.component.group.Group.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	discoverGroupableChilds: function(elt) {
		var groupables = new List();
		var _g1 = 0, _g = elt.childNodes.length;
		while(_g1 < _g) {
			var childCnt = _g1++;
			if(elt.childNodes[childCnt].nodeType != 1) continue;
			if(elt.childNodes[childCnt].className != null) {
				var _g2 = 0, _g3 = elt.childNodes[childCnt].className.split(" ");
				while(_g2 < _g3.length) {
					var c = _g3[_g2];
					++_g2;
					var rc = this.getBrixApplication().resolveUIComponentClass(c,brix.component.group.IGroupable);
					if(rc == null) continue;
					groupables.add(elt.childNodes[childCnt]);
					break;
				}
				if(Lambda.has(elt.childNodes[childCnt].className.split(" "),"Group")) continue;
			}
			groupables = Lambda.concat(groupables,this.discoverGroupableChilds(elt.childNodes[childCnt]));
		}
		return groupables;
	}
	,__class__: brix.component.group.Group
});
brix.component.group.IGroupable = function() { }
$hxClasses["brix.component.group.IGroupable"] = brix.component.group.IGroupable;
brix.component.group.IGroupable.__name__ = ["brix","component","group","IGroupable"];
brix.component.group.IGroupable.__interfaces__ = [brix.component.ui.IDisplayObject];
brix.component.group.IGroupable.prototype = {
	groupElement: null
	,__class__: brix.component.group.IGroupable
}
brix.component.group.Groupable = function() { }
$hxClasses["brix.component.group.Groupable"] = brix.component.group.Groupable;
brix.component.group.Groupable.__name__ = ["brix","component","group","Groupable"];
brix.component.group.Groupable.startGroupable = function(groupable) {
	var groupId = groupable.rootElement.getAttribute("data-group-id");
	if(groupId == null) return;
	var groupElements = groupable.getBrixApplication().htmlRootElement.getElementsByClassName(groupId);
	if(groupElements.length < 1) return;
	if(groupElements.length > 1) throw "ERROR " + groupElements.length + " Group components are declared with the same group id " + groupId;
	groupable.groupElement = groupElements[0];
}
brix.component.navigation = {}
brix.component.navigation.LayerStatus = $hxClasses["brix.component.navigation.LayerStatus"] = { __ename__ : ["brix","component","navigation","LayerStatus"], __constructs__ : ["showTransition","hideTransition","visible","hidden","notInit"] }
brix.component.navigation.LayerStatus.showTransition = ["showTransition",0];
brix.component.navigation.LayerStatus.showTransition.toString = $estr;
brix.component.navigation.LayerStatus.showTransition.__enum__ = brix.component.navigation.LayerStatus;
brix.component.navigation.LayerStatus.hideTransition = ["hideTransition",1];
brix.component.navigation.LayerStatus.hideTransition.toString = $estr;
brix.component.navigation.LayerStatus.hideTransition.__enum__ = brix.component.navigation.LayerStatus;
brix.component.navigation.LayerStatus.visible = ["visible",2];
brix.component.navigation.LayerStatus.visible.toString = $estr;
brix.component.navigation.LayerStatus.visible.__enum__ = brix.component.navigation.LayerStatus;
brix.component.navigation.LayerStatus.hidden = ["hidden",3];
brix.component.navigation.LayerStatus.hidden.toString = $estr;
brix.component.navigation.LayerStatus.hidden.__enum__ = brix.component.navigation.LayerStatus;
brix.component.navigation.LayerStatus.notInit = ["notInit",4];
brix.component.navigation.LayerStatus.notInit.toString = $estr;
brix.component.navigation.LayerStatus.notInit.__enum__ = brix.component.navigation.LayerStatus;
brix.component.navigation.Layer = function(rootElement,brixId) {
	this.hasTransitionStarted = false;
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	this.childrenArray = new Array();
	this.status = brix.component.navigation.LayerStatus.notInit;
	this.styleAttrDisplay = rootElement.style.display;
};
$hxClasses["brix.component.navigation.Layer"] = brix.component.navigation.Layer;
brix.component.navigation.Layer.__name__ = ["brix","component","navigation","Layer"];
brix.component.navigation.Layer.getLayerNodes = function(pageName,brixId,root) {
	var document = root;
	if(root == null) document = js.Lib.document.documentElement;
	return document.getElementsByClassName(pageName);
}
brix.component.navigation.Layer.__super__ = brix.component.ui.DisplayObject;
brix.component.navigation.Layer.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	cleanupVideoElements: function(nodeList) {
		var _g1 = 0, _g = nodeList.length;
		while(_g1 < _g) {
			var idx = _g1++;
			try {
				var element = nodeList[idx];
				element.pause();
				element.currentTime = 0;
			} catch( e ) {
				null;
			}
		}
	}
	,cleanupAudioElements: function(nodeList) {
		var _g1 = 0, _g = nodeList.length;
		while(_g1 < _g) {
			var idx = _g1++;
			try {
				var element = nodeList[idx];
				element.pause();
				element.currentTime = 0;
			} catch( e ) {
				null;
			}
		}
	}
	,setupVideoElements: function(nodeList) {
		var _g1 = 0, _g = nodeList.length;
		while(_g1 < _g) {
			var idx = _g1++;
			try {
				var element = nodeList[idx];
				if(element.autoplay == true) {
					element.currentTime = 0;
					element.play();
				}
				element.muted = brix.component.sound.SoundOn.isMuted;
			} catch( e ) {
				null;
			}
		}
	}
	,setupAudioElements: function(nodeList) {
		var _g1 = 0, _g = nodeList.length;
		while(_g1 < _g) {
			var idx = _g1++;
			try {
				var element = nodeList[idx];
				if(element.autoplay == true) {
					element.currentTime = 0;
					element.play();
				}
				element.muted = brix.component.sound.SoundOn.isMuted;
			} catch( e ) {
				null;
			}
		}
	}
	,doHide: function(transitionData,preventTransitions,e) {
		if(e != null && e.target != this.rootElement) return;
		if(preventTransitions == false && this.doHideCallback == null) return;
		if(preventTransitions == false) {
			this.endTransition(brix.component.navigation.transition.TransitionType.hide,transitionData,this.doHideCallback);
			this.doHideCallback = null;
		}
		this.status = brix.component.navigation.LayerStatus.hidden;
		try {
			var event = js.Lib.document.createEvent("CustomEvent");
			event.initCustomEvent("onLayerHide",false,false,{ transitionData : transitionData, target : this.rootElement, layer : this});
			this.rootElement.dispatchEvent(event);
		} catch( e1 ) {
			null;
		}
		var audioNodes = this.rootElement.getElementsByTagName("audio");
		this.cleanupAudioElements(audioNodes);
		var videoNodes = this.rootElement.getElementsByTagName("video");
		this.cleanupVideoElements(videoNodes);
		while(this.rootElement.childNodes.length > 0) {
			var element = this.rootElement.childNodes[0];
			this.rootElement.removeChild(element);
			this.childrenArray.push(element);
		}
		this.rootElement.style.display = "none";
		this.rootElement.style.visibility = "hidden";
	}
	,hide: function(transitionData,preventTransitions) {
		if(this.status != brix.component.navigation.LayerStatus.visible && this.status != brix.component.navigation.LayerStatus.notInit) return;
		if(this.status == brix.component.navigation.LayerStatus.hideTransition) {
			this.doHideCallback(null);
			this.removeTransitionEvent(this.doHideCallback);
		} else if(this.status == brix.component.navigation.LayerStatus.showTransition) {
			this.doShowCallback(null);
			this.removeTransitionEvent(this.doShowCallback);
		}
		this.status = brix.component.navigation.LayerStatus.hideTransition;
		if(preventTransitions == false) {
			this.doHideCallback = (function(f,a1,a2) {
				return function(e) {
					return f(a1,a2,e);
				};
			})($bind(this,this.doHide),transitionData,preventTransitions);
			this.startTransition(brix.component.navigation.transition.TransitionType.hide,transitionData,this.doHideCallback);
		} else this.doHide(transitionData,preventTransitions,null);
	}
	,doShow: function(transitionData,preventTransitions,e) {
		if(e != null && e.target != this.rootElement) return;
		if(preventTransitions == false && this.doShowCallback == null) return;
		if(preventTransitions == false) this.endTransition(brix.component.navigation.transition.TransitionType.show,transitionData,this.doShowCallback);
		this.doShowCallback = null;
		this.status = brix.component.navigation.LayerStatus.visible;
	}
	,show: function(transitionData,preventTransitions) {
		if(preventTransitions == null) preventTransitions = false;
		if(this.status != brix.component.navigation.LayerStatus.hidden && this.status != brix.component.navigation.LayerStatus.notInit) return;
		if(this.status == brix.component.navigation.LayerStatus.hideTransition) {
			this.doHideCallback(null);
			this.removeTransitionEvent(this.doHideCallback);
		} else if(this.status == brix.component.navigation.LayerStatus.showTransition) {
			this.doShowCallback(null);
			this.removeTransitionEvent(this.doShowCallback);
		}
		this.status = brix.component.navigation.LayerStatus.showTransition;
		while(this.childrenArray.length > 0) {
			var element = this.childrenArray.shift();
			this.rootElement.appendChild(element);
		}
		var audioNodes = this.rootElement.getElementsByTagName("audio");
		this.setupAudioElements(audioNodes);
		var videoNodes = this.rootElement.getElementsByTagName("video");
		this.setupVideoElements(videoNodes);
		try {
			var event = js.Lib.document.createEvent("CustomEvent");
			event.initCustomEvent("onLayerShow",false,false,{ transitionData : transitionData, target : this.rootElement, layer : this});
			this.rootElement.dispatchEvent(event);
		} catch( e ) {
			null;
		}
		if(preventTransitions == false) {
			this.doShowCallback = (function(f,a1,a2) {
				return function(e) {
					return f(a1,a2,e);
				};
			})($bind(this,this.doShow),transitionData,preventTransitions);
			this.startTransition(brix.component.navigation.transition.TransitionType.show,transitionData,this.doShowCallback);
		} else this.doShow(transitionData,preventTransitions,null);
		this.rootElement.style.display = this.styleAttrDisplay;
		this.rootElement.style.visibility = "visible";
	}
	,removeTransitionEvent: function(onEndCallback) {
		this.rootElement.removeEventListener("transitionend",onEndCallback,false);
		this.rootElement.removeEventListener("transitionEnd",onEndCallback,false);
		this.rootElement.removeEventListener("webkitTransitionEnd",onEndCallback,false);
		this.rootElement.removeEventListener("oTransitionEnd",onEndCallback,false);
		this.rootElement.removeEventListener("MSTransitionEnd",onEndCallback,false);
	}
	,addTransitionEvent: function(onEndCallback) {
		this.rootElement.addEventListener("transitionend",onEndCallback,false);
		this.rootElement.addEventListener("transitionEnd",onEndCallback,false);
		this.rootElement.addEventListener("webkitTransitionEnd",onEndCallback,false);
		this.rootElement.addEventListener("oTransitionEnd",onEndCallback,false);
		this.rootElement.addEventListener("MSTransitionEnd",onEndCallback,false);
	}
	,endTransition: function(type,transitionData,onComplete) {
		this.removeTransitionEvent(onComplete);
		if(transitionData != null) brix.util.DomTools.removeClass(this.rootElement,transitionData.endStyleName);
		var transitionData2 = brix.component.navigation.transition.TransitionTools.getTransitionData(this.rootElement,type);
		if(transitionData2 != null) brix.util.DomTools.removeClass(this.rootElement,transitionData2.endStyleName);
	}
	,doStartTransition: function(sumOfTransitions,onComplete) {
		var _g = 0;
		while(_g < sumOfTransitions.length) {
			var transition = sumOfTransitions[_g];
			++_g;
			brix.util.DomTools.removeClass(this.rootElement,transition.startStyleName);
		}
		if(onComplete != null) this.addTransitionEvent(onComplete);
		brix.component.navigation.transition.TransitionTools.setTransitionProperty(this.rootElement,"transitionDuration",null);
		var _g = 0;
		while(_g < sumOfTransitions.length) {
			var transition = sumOfTransitions[_g];
			++_g;
			brix.util.DomTools.addClass(this.rootElement,transition.endStyleName);
		}
	}
	,startTransition: function(type,transitionData,onComplete) {
		var transitionData2 = brix.component.navigation.transition.TransitionTools.getTransitionData(this.rootElement,type);
		var sumOfTransitions = new Array();
		if(transitionData != null) sumOfTransitions.push(transitionData);
		if(transitionData2 != null) sumOfTransitions.push(transitionData2);
		if(sumOfTransitions.length == 0) {
			if(onComplete != null) onComplete(null);
		} else {
			this.hasTransitionStarted = true;
			brix.component.navigation.transition.TransitionTools.setTransitionProperty(this.rootElement,"transitionDuration","0");
			var _g = 0;
			while(_g < sumOfTransitions.length) {
				var transition = sumOfTransitions[_g];
				++_g;
				brix.util.DomTools.addClass(this.rootElement,transition.startStyleName);
			}
			brix.util.DomTools.doLater((function(f,a1,a2) {
				return function() {
					return f(a1,a2);
				};
			})($bind(this,this.doStartTransition),sumOfTransitions,onComplete));
		}
	}
	,doHideCallback: null
	,doShowCallback: null
	,styleAttrDisplay: null
	,hasTransitionStarted: null
	,status: null
	,childrenArray: null
	,__class__: brix.component.navigation.Layer
});
brix.component.navigation.Page = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	brix.component.group.Groupable.startGroupable(this);
	this.name = rootElement.getAttribute("name");
	if(this.name == null || this.name == "") throw "Pages have to have a 'name' attribute";
};
$hxClasses["brix.component.navigation.Page"] = brix.component.navigation.Page;
brix.component.navigation.Page.__name__ = ["brix","component","navigation","Page"];
brix.component.navigation.Page.__interfaces__ = [brix.component.group.IGroupable];
brix.component.navigation.Page.openPage = function(pageName,isPopup,transitionDataShow,transitionDataHide,brixId,root) {
	var document = root;
	if(root == null) document = js.Lib.document.documentElement;
	var page = brix.component.navigation.Page.getPageByName(pageName,brixId,document);
	if(page == null) {
		page = brix.component.navigation.Page.getPageByName(pageName,brixId);
		if(page == null) throw "Error, could not find a page with name " + pageName;
	}
	page.open(transitionDataShow,transitionDataHide,!isPopup);
}
brix.component.navigation.Page.closePage = function(pageName,transitionData,brixId,root) {
	var document = root;
	if(root == null) document = js.Lib.document.documentElement;
	var page = brix.component.navigation.Page.getPageByName(pageName,brixId,document);
	if(page == null) {
		page = brix.component.navigation.Page.getPageByName(pageName,brixId);
		if(page == null) throw "Error, could not find a page with name " + pageName;
	}
	page.close(transitionData);
}
brix.component.navigation.Page.getPageNodes = function(brixId,root) {
	var document = root;
	if(root == null) document = js.Lib.document.documentElement;
	return document.getElementsByClassName("Page");
}
brix.component.navigation.Page.getPageByName = function(pageName,brixId,root) {
	var document = root;
	if(root == null) document = js.Lib.document.documentElement;
	var pages = brix.component.navigation.Page.getPageNodes(brixId,document);
	var _g1 = 0, _g = pages.length;
	while(_g1 < _g) {
		var pageIdx = _g1++;
		if(pages[pageIdx].getAttribute("name") == pageName) {
			var pageInstances = brix.core.Application.get(brixId).getAssociatedComponents(pages[pageIdx],brix.component.navigation.Page);
			var $it0 = pageInstances.iterator();
			while( $it0.hasNext() ) {
				var page = $it0.next();
				return page;
			}
			return null;
		}
	}
	return null;
}
brix.component.navigation.Page.__super__ = brix.component.ui.DisplayObject;
brix.component.navigation.Page.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	close: function(transitionData,preventCloseByClassName,preventTransitions) {
		if(preventTransitions == null) preventTransitions = false;
		if(preventCloseByClassName == null) preventCloseByClassName = new Array();
		var nodes = brix.component.navigation.Layer.getLayerNodes(this.name,this.brixInstanceId,this.groupElement);
		var _g1 = 0, _g = nodes.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var layerNode = nodes[idxLayerNode];
			var hasForbiddenClass = false;
			var _g2 = 0;
			while(_g2 < preventCloseByClassName.length) {
				var className = preventCloseByClassName[_g2];
				++_g2;
				if(brix.util.DomTools.hasClass(layerNode,className)) {
					hasForbiddenClass = true;
					break;
				}
			}
			if(!hasForbiddenClass) {
				var layerInstances = this.getBrixApplication().getAssociatedComponents(layerNode,brix.component.navigation.Layer);
				var $it0 = layerInstances.iterator();
				while( $it0.hasNext() ) {
					var layerInstance = $it0.next();
					(js.Boot.__cast(layerInstance , brix.component.navigation.Layer)).hide(transitionData,preventTransitions);
				}
			}
		}
		var nodes1 = brix.util.DomTools.getElementsByAttribute(this.groupElement,"href",this.name);
		var _g1 = 0, _g = nodes1.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var element = nodes1[idxLayerNode];
			brix.util.DomTools.removeClass(element,"page-opened");
		}
		var nodes2 = brix.util.DomTools.getElementsByAttribute(this.groupElement,"href","#" + this.name);
		var _g1 = 0, _g = nodes2.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var element = nodes2[idxLayerNode];
			brix.util.DomTools.removeClass(element,"page-opened");
		}
	}
	,doOpen: function(transitionData,preventTransitions) {
		if(preventTransitions == null) preventTransitions = false;
		var nodes = brix.component.navigation.Layer.getLayerNodes(this.name,this.brixInstanceId,this.groupElement);
		var _g1 = 0, _g = nodes.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var layerNode = nodes[idxLayerNode];
			var layerInstances = this.getBrixApplication().getAssociatedComponents(layerNode,brix.component.navigation.Layer);
			var $it0 = layerInstances.iterator();
			while( $it0.hasNext() ) {
				var layerInstance = $it0.next();
				layerInstance.show(transitionData,preventTransitions);
			}
		}
		var nodes1 = brix.util.DomTools.getElementsByAttribute(this.groupElement,"href",this.name);
		var _g1 = 0, _g = nodes1.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var element = nodes1[idxLayerNode];
			brix.util.DomTools.addClass(element,"page-opened");
		}
		var nodes2 = brix.util.DomTools.getElementsByAttribute(this.groupElement,"href","#" + this.name);
		var _g1 = 0, _g = nodes2.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var element = nodes2[idxLayerNode];
			brix.util.DomTools.addClass(element,"page-opened");
		}
	}
	,closeOthers: function(transitionData,preventTransitions) {
		if(preventTransitions == null) preventTransitions = false;
		var nodes = brix.component.navigation.Page.getPageNodes(this.brixInstanceId,this.groupElement);
		var _g1 = 0, _g = nodes.length;
		while(_g1 < _g) {
			var idxPageNode = _g1++;
			var pageNode = nodes[idxPageNode];
			var pageInstances = this.getBrixApplication().getAssociatedComponents(pageNode,brix.component.navigation.Page);
			var $it0 = pageInstances.iterator();
			while( $it0.hasNext() ) {
				var pageInstance = $it0.next();
				if(pageInstance != this) pageInstance.close(transitionData,[this.name],preventTransitions);
			}
		}
	}
	,open: function(transitionDataShow,transitionDataHide,doCloseOthers,preventTransitions) {
		if(preventTransitions == null) preventTransitions = false;
		if(doCloseOthers == null) doCloseOthers = true;
		if(doCloseOthers) this.closeOthers(transitionDataHide,preventTransitions);
		this.doOpen(transitionDataShow,preventTransitions);
	}
	,setPageName: function(newPageName) {
		this.rootElement.setAttribute("name",newPageName);
		this.name = newPageName;
		return newPageName;
	}
	,init: function() {
		brix.component.ui.DisplayObject.prototype.init.call(this);
		if(this.groupElement == null) this.groupElement = js.Lib.document.body;
		if(brix.util.DomTools.getMeta("initialPageName") == this.name || this.groupElement.getAttribute("data-initial-page-name") == this.name) brix.util.DomTools.doLater((function(f,a1,a2,a3,a4) {
			return function() {
				return f(a1,a2,a3,a4);
			};
		})($bind(this,this.open),null,null,true,true));
	}
	,groupElement: null
	,name: null
	,__class__: brix.component.navigation.Page
});
brix.component.navigation.link = {}
brix.component.navigation.link.LinkBase = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	brix.component.group.Groupable.startGroupable(this);
	rootElement.addEventListener("click",$bind(this,this.onClick),false);
	if(rootElement.getAttribute("href") != null) {
		this.linkName = StringTools.trim(rootElement.getAttribute("href"));
		this.linkName = HxOverrides.substr(this.linkName,this.linkName.indexOf("#") + 1,null);
	} else null;
	if(rootElement.getAttribute("target") != null && StringTools.trim(rootElement.getAttribute("target")) != "") this.targetAttr = StringTools.trim(rootElement.getAttribute("target"));
};
$hxClasses["brix.component.navigation.link.LinkBase"] = brix.component.navigation.link.LinkBase;
brix.component.navigation.link.LinkBase.__name__ = ["brix","component","navigation","link","LinkBase"];
brix.component.navigation.link.LinkBase.__interfaces__ = [brix.component.group.IGroupable];
brix.component.navigation.link.LinkBase.__super__ = brix.component.ui.DisplayObject;
brix.component.navigation.link.LinkBase.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	onClick: function(e) {
		e.preventDefault();
		this.transitionDataShow = brix.component.navigation.transition.TransitionTools.getTransitionData(this.rootElement,brix.component.navigation.transition.TransitionType.show);
		this.transitionDataHide = brix.component.navigation.transition.TransitionTools.getTransitionData(this.rootElement,brix.component.navigation.transition.TransitionType.hide);
	}
	,transitionDataHide: null
	,transitionDataShow: null
	,targetAttr: null
	,linkName: null
	,groupElement: null
	,__class__: brix.component.navigation.link.LinkBase
});
brix.component.navigation.link.LinkClosePage = function(rootElement,brixId) {
	brix.component.navigation.link.LinkBase.call(this,rootElement,brixId);
};
$hxClasses["brix.component.navigation.link.LinkClosePage"] = brix.component.navigation.link.LinkClosePage;
brix.component.navigation.link.LinkClosePage.__name__ = ["brix","component","navigation","link","LinkClosePage"];
brix.component.navigation.link.LinkClosePage.__super__ = brix.component.navigation.link.LinkBase;
brix.component.navigation.link.LinkClosePage.prototype = $extend(brix.component.navigation.link.LinkBase.prototype,{
	onClick: function(e) {
		brix.component.navigation.link.LinkBase.prototype.onClick.call(this,e);
		brix.component.navigation.Page.closePage(this.linkName,this.transitionDataHide,this.brixInstanceId);
	}
	,__class__: brix.component.navigation.link.LinkClosePage
});
brix.component.navigation.link.LinkToPage = function(rootElement,brixId) {
	brix.component.navigation.link.LinkBase.call(this,rootElement,brixId);
};
$hxClasses["brix.component.navigation.link.LinkToPage"] = brix.component.navigation.link.LinkToPage;
brix.component.navigation.link.LinkToPage.__name__ = ["brix","component","navigation","link","LinkToPage"];
brix.component.navigation.link.LinkToPage.__super__ = brix.component.navigation.link.LinkBase;
brix.component.navigation.link.LinkToPage.prototype = $extend(brix.component.navigation.link.LinkBase.prototype,{
	onClick: function(e) {
		brix.component.navigation.link.LinkBase.prototype.onClick.call(this,e);
		brix.component.navigation.Page.openPage(this.linkName,this.targetAttr == "_top",this.transitionDataShow,this.transitionDataHide,this.brixInstanceId,this.groupElement);
	}
	,__class__: brix.component.navigation.link.LinkToPage
});
brix.component.navigation.link.TouchType = $hxClasses["brix.component.navigation.link.TouchType"] = { __ename__ : ["brix","component","navigation","link","TouchType"], __constructs__ : ["swipeLeft","swipeRight","swipeUp","swipeDown","pinchOpen","pinchClose"] }
brix.component.navigation.link.TouchType.swipeLeft = ["swipeLeft",0];
brix.component.navigation.link.TouchType.swipeLeft.toString = $estr;
brix.component.navigation.link.TouchType.swipeLeft.__enum__ = brix.component.navigation.link.TouchType;
brix.component.navigation.link.TouchType.swipeRight = ["swipeRight",1];
brix.component.navigation.link.TouchType.swipeRight.toString = $estr;
brix.component.navigation.link.TouchType.swipeRight.__enum__ = brix.component.navigation.link.TouchType;
brix.component.navigation.link.TouchType.swipeUp = ["swipeUp",2];
brix.component.navigation.link.TouchType.swipeUp.toString = $estr;
brix.component.navigation.link.TouchType.swipeUp.__enum__ = brix.component.navigation.link.TouchType;
brix.component.navigation.link.TouchType.swipeDown = ["swipeDown",3];
brix.component.navigation.link.TouchType.swipeDown.toString = $estr;
brix.component.navigation.link.TouchType.swipeDown.__enum__ = brix.component.navigation.link.TouchType;
brix.component.navigation.link.TouchType.pinchOpen = ["pinchOpen",4];
brix.component.navigation.link.TouchType.pinchOpen.toString = $estr;
brix.component.navigation.link.TouchType.pinchOpen.__enum__ = brix.component.navigation.link.TouchType;
brix.component.navigation.link.TouchType.pinchClose = ["pinchClose",5];
brix.component.navigation.link.TouchType.pinchClose.toString = $estr;
brix.component.navigation.link.TouchType.pinchClose.__enum__ = brix.component.navigation.link.TouchType;
brix.component.navigation.link.TouchLink = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	brix.component.group.Groupable.startGroupable(this);
	var element;
	if(this.groupElement != null) element = this.groupElement; else element = js.Lib.document.body;
	var attrStr = rootElement.getAttribute("data-touch-detection-distance");
	if(attrStr == null || attrStr == "") this.detectDistance = 10; else this.detectDistance = Std.parseInt(attrStr);
	element.addEventListener("touchmove",$bind(this,this.onTouchMove),false);
	element.addEventListener("touchstart",$bind(this,this.onTouchStart),false);
	element.addEventListener("touchend",$bind(this,this.onTouchEnd),false);
	switch(rootElement.getAttribute("data-touch-type")) {
	case "left":
		this.touchType = brix.component.navigation.link.TouchType.swipeLeft;
		break;
	case "right":
		this.touchType = brix.component.navigation.link.TouchType.swipeRight;
		break;
	case "up":
		this.touchType = brix.component.navigation.link.TouchType.swipeUp;
		break;
	case "down":
		this.touchType = brix.component.navigation.link.TouchType.swipeDown;
		break;
	case "open":
		this.touchType = brix.component.navigation.link.TouchType.pinchOpen;
		throw "not implemented";
		break;
	case "close":
		this.touchType = brix.component.navigation.link.TouchType.pinchClose;
		throw "not implemented";
		break;
	default:
		throw "Error in param " + "data-touch-type" + " for touch event type (requires left, right, up, down, in, out)";
	}
};
$hxClasses["brix.component.navigation.link.TouchLink"] = brix.component.navigation.link.TouchLink;
brix.component.navigation.link.TouchLink.__name__ = ["brix","component","navigation","link","TouchLink"];
brix.component.navigation.link.TouchLink.__interfaces__ = [brix.component.group.IGroupable];
brix.component.navigation.link.TouchLink.__super__ = brix.component.ui.DisplayObject;
brix.component.navigation.link.TouchLink.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	dispatchClick: function() {
		var evt = js.Lib.document.createEvent("MouseEvent");
		evt.initEvent("click",true,true);
		this.rootElement.dispatchEvent(evt);
	}
	,onTouchEnd: function(e) {
		var event = e;
		this.touchStart = null;
	}
	,onTouchMove: function(e) {
		var event = e;
		event.preventDefault();
		if(this.touchStart == null) return;
		var xOffset = event.touches.item(0).screenX - this.touchStart.x;
		var yOffset = event.touches.item(0).screenY - this.touchStart.y;
		if(Math.abs(xOffset) > this.detectDistance) {
			this.touchStart = null;
			if(xOffset > 0) {
				if(this.touchType == brix.component.navigation.link.TouchType.swipeLeft) this.dispatchClick();
			} else if(this.touchType == brix.component.navigation.link.TouchType.swipeRight) this.dispatchClick();
		} else if(Math.abs(yOffset) > this.detectDistance) {
			this.touchStart = null;
			if(yOffset > 0) {
				if(this.touchType == brix.component.navigation.link.TouchType.swipeUp) this.dispatchClick();
			} else if(this.touchType == brix.component.navigation.link.TouchType.swipeDown) this.dispatchClick();
		}
	}
	,onClick: function(e) {
		null;
	}
	,onTouchStart: function(e) {
		var event = e;
		this.touchStart = { x : event.touches.item(0).screenX, y : event.touches.item(0).screenY};
	}
	,touchStart: null
	,touchType: null
	,detectDistance: null
	,groupElement: null
	,__class__: brix.component.navigation.link.TouchLink
});
brix.component.navigation.transition = {}
brix.component.navigation.transition.TransitionType = $hxClasses["brix.component.navigation.transition.TransitionType"] = { __ename__ : ["brix","component","navigation","transition","TransitionType"], __constructs__ : ["show","hide"] }
brix.component.navigation.transition.TransitionType.show = ["show",0];
brix.component.navigation.transition.TransitionType.show.toString = $estr;
brix.component.navigation.transition.TransitionType.show.__enum__ = brix.component.navigation.transition.TransitionType;
brix.component.navigation.transition.TransitionType.hide = ["hide",1];
brix.component.navigation.transition.TransitionType.hide.toString = $estr;
brix.component.navigation.transition.TransitionType.hide.__enum__ = brix.component.navigation.transition.TransitionType;
brix.component.navigation.transition.TransitionTools = function() { }
$hxClasses["brix.component.navigation.transition.TransitionTools"] = brix.component.navigation.transition.TransitionTools;
brix.component.navigation.transition.TransitionTools.__name__ = ["brix","component","navigation","transition","TransitionTools"];
brix.component.navigation.transition.TransitionTools.getTransitionData = function(rootElement,type) {
	var res = null;
	if(type == brix.component.navigation.transition.TransitionType.show) {
		var start = rootElement.getAttribute("data-show-start-style");
		var end = rootElement.getAttribute("data-show-end-style");
		if(start != null && end != null) res = { startStyleName : start, endStyleName : end};
	} else {
		var start = rootElement.getAttribute("data-hide-start-style");
		var end = rootElement.getAttribute("data-hide-end-style");
		if(start != null && end != null) res = { startStyleName : start, endStyleName : end};
	}
	return res;
}
brix.component.navigation.transition.TransitionTools.setTransitionProperty = function(rootElement,name,value) {
	Reflect.setProperty(rootElement.style,name,value);
	var prefixed = "MozT" + HxOverrides.substr(name,1,null);
	rootElement.style[prefixed] = value;
	var prefixed1 = "webkitT" + HxOverrides.substr(name,1,null);
	rootElement.style[prefixed1] = value;
	var prefixed2 = "oT" + HxOverrides.substr(name,1,null);
	rootElement.style[prefixed2] = value;
}
brix.component.sound = {}
brix.component.sound.SoundOn = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	rootElement.onclick = $bind(this,this.onClick);
};
$hxClasses["brix.component.sound.SoundOn"] = brix.component.sound.SoundOn;
brix.component.sound.SoundOn.__name__ = ["brix","component","sound","SoundOn"];
brix.component.sound.SoundOn.mute = function(doMute) {
	var audioTags = js.Lib.document.getElementsByTagName("audio");
	var _g1 = 0, _g = audioTags.length;
	while(_g1 < _g) {
		var idx = _g1++;
		audioTags[idx].muted = doMute;
	}
	brix.component.sound.SoundOn.isMuted = doMute;
	var soundOffButtons = js.Lib.document.getElementsByClassName("SoundOff");
	var soundOnButtons = js.Lib.document.getElementsByClassName("SoundOn");
	var _g1 = 0, _g = soundOffButtons.length;
	while(_g1 < _g) {
		var idx = _g1++;
		if(doMute) soundOffButtons[idx].style.visibility = "hidden"; else soundOffButtons[idx].style.visibility = "visible";
	}
	var _g1 = 0, _g = soundOnButtons.length;
	while(_g1 < _g) {
		var idx = _g1++;
		if(!doMute) soundOnButtons[idx].style.visibility = "hidden"; else soundOnButtons[idx].style.visibility = "visible";
	}
}
brix.component.sound.SoundOn.__super__ = brix.component.ui.DisplayObject;
brix.component.sound.SoundOn.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	onClick: function(e) {
		brix.component.sound.SoundOn.mute(false);
	}
	,init: function() {
		brix.component.sound.SoundOn.mute(false);
	}
	,__class__: brix.component.sound.SoundOn
});
brix.component.sound.SoundOff = function(rootElement,brixId) {
	brix.component.sound.SoundOn.call(this,rootElement,brixId);
};
$hxClasses["brix.component.sound.SoundOff"] = brix.component.sound.SoundOff;
brix.component.sound.SoundOff.__name__ = ["brix","component","sound","SoundOff"];
brix.component.sound.SoundOff.__super__ = brix.component.sound.SoundOn;
brix.component.sound.SoundOff.prototype = $extend(brix.component.sound.SoundOn.prototype,{
	onClick: function(e) {
		brix.component.sound.SoundOn.mute(true);
	}
	,__class__: brix.component.sound.SoundOff
});
brix.core = {}
brix.core.Application = function(id,args) {
	this.dataObject = args;
	this.id = id;
	this.nodesIdSequence = 0;
	this.registeredUIComponents = new Array();
	this.registeredNonUIComponents = new Array();
	this.nodeToCmpInstances = new Hash();
	this.applicationContext = new brix.core.ApplicationContext();
};
$hxClasses["brix.core.Application"] = brix.core.Application;
$hxExpose(brix.core.Application, "app");
brix.core.Application.__name__ = ["brix","core","Application"];
brix.core.Application.get = function(BrixId) {
	return brix.core.Application.instances.get(BrixId);
}
brix.core.Application.main = function() {
	var newApp = brix.core.Application.createApplication();
	js.Lib.window.onload = function(e) {
		newApp.initDom();
		newApp.initComponents();
	};
}
brix.core.Application.createApplication = function(args) {
	var newId = brix.core.Application.generateUniqueId();
	var newInstance = new brix.core.Application(newId,args);
	brix.core.Application.instances.set(newId,newInstance);
	return newInstance;
}
brix.core.Application.generateUniqueId = function() {
	return Std.string(Math.round(Math.random() * 10000));
}
brix.core.Application.prototype = {
	resolveComponentClass: function(classname) {
		var componentClass = Type.resolveClass(classname);
		if(componentClass == null) {
			throw "ERROR cannot resolve " + classname;
			null;
		}
		return componentClass;
	}
	,resolveUIComponentClass: function(className,typeFilter) {
		var _g = 0, _g1 = this.getRegisteredUIComponents();
		while(_g < _g1.length) {
			var rc = _g1[_g];
			++_g;
			var componentClassAttrValues = [this.getUnconflictedClassTag(rc.classname)];
			if(componentClassAttrValues[0] != rc.classname) componentClassAttrValues.push(rc.classname);
			if(!Lambda.exists(componentClassAttrValues,function(s) {
				return s == className;
			})) continue;
			var componentClass = this.resolveComponentClass(rc.classname);
			if(componentClass == null) continue;
			if(typeFilter != null) {
				if(!js.Boot.__instanceof(Type.createEmptyInstance(componentClass),typeFilter)) return null;
			}
			return componentClass;
		}
		return null;
	}
	,getUnconflictedClassTag: function(displayObjectClassName) {
		var classTag = displayObjectClassName;
		if(classTag.indexOf(".") != -1) classTag = HxOverrides.substr(classTag,classTag.lastIndexOf(".") + 1,null);
		var _g = 0, _g1 = this.getRegisteredUIComponents();
		while(_g < _g1.length) {
			var rc = _g1[_g];
			++_g;
			if(rc.classname != displayObjectClassName && classTag == HxOverrides.substr(rc.classname,classTag.lastIndexOf(".") + 1,null)) return displayObjectClassName;
		}
		return classTag;
	}
	,getComponents: function(typeFilter) {
		var l = new List();
		var $it0 = this.nodeToCmpInstances.iterator();
		while( $it0.hasNext() ) {
			var n = $it0.next();
			var $it1 = n.iterator();
			while( $it1.hasNext() ) {
				var i = $it1.next();
				if(js.Boot.__instanceof(i,typeFilter)) {
					var inst = i;
					l.add(inst);
				}
			}
		}
		return l;
	}
	,getAssociatedComponents: function(node,typeFilter) {
		var nodeId = node.getAttribute("data-brix-id");
		if(nodeId != null) {
			var l = new List();
			if(this.nodeToCmpInstances.exists(nodeId)) {
				var $it0 = this.nodeToCmpInstances.get(nodeId).iterator();
				while( $it0.hasNext() ) {
					var i = $it0.next();
					if(js.Boot.__instanceof(i,typeFilter)) {
						var inst = i;
						l.add(inst);
					}
				}
			}
			return l;
		}
		return new List();
	}
	,removeAllAssociatedComponent: function(node) {
		var nodeId = node.getAttribute("data-brix-id");
		if(nodeId != null) {
			node.removeAttribute("data-brix-id");
			var isError = !this.nodeToCmpInstances.remove(nodeId);
			if(isError) throw "Could not find the node in the associated components list.";
		} else null;
	}
	,removeAssociatedComponent: function(node,cmp) {
		var nodeId = node.getAttribute("data-brix-id");
		var associatedCmps;
		if(nodeId != null) {
			associatedCmps = this.nodeToCmpInstances.get(nodeId);
			var isError = !associatedCmps.remove(cmp);
			if(isError) throw "Could not find the component in the node's associated components list.";
			if(associatedCmps.isEmpty()) {
				node.removeAttribute("data-brix-id");
				this.nodeToCmpInstances.remove(nodeId);
			}
		} else null;
	}
	,addAssociatedComponent: function(node,cmp) {
		var nodeId = node.getAttribute("data-brix-id");
		var associatedCmps;
		if(nodeId != null) associatedCmps = this.nodeToCmpInstances.get(nodeId); else {
			this.nodesIdSequence++;
			nodeId = Std.string(this.nodesIdSequence);
			node.setAttribute("data-brix-id",nodeId);
			associatedCmps = new List();
		}
		associatedCmps.add(cmp);
		this.nodeToCmpInstances.set(nodeId,associatedCmps);
	}
	,cleanNode: function(node) {
		if(node.nodeType != js.Lib.document.body.nodeType) return;
		var comps = this.getAssociatedComponents(node,brix.component.ui.DisplayObject);
		var $it0 = comps.iterator();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			c.remove();
		}
		var _g1 = 0, _g = node.childNodes.length;
		while(_g1 < _g) {
			var childCnt = _g1++;
			this.cleanNode(node.childNodes[childCnt]);
		}
	}
	,createNonUIComponents: function() {
		var _g = 0, _g1 = this.getRegisteredNonUIComponents();
		while(_g < _g1.length) {
			var rc = _g1[_g];
			++_g;
			var componentClass = this.resolveComponentClass(rc.classname);
			if(componentClass == null) continue;
			var cmpInstance = null;
			if(rc.args != null) cmpInstance = Type.createInstance(componentClass,[rc.args]); else cmpInstance = Type.createInstance(componentClass,[]);
			if(cmpInstance != null && js.Boot.__instanceof(cmpInstance,brix.component.IBrixComponent)) cmpInstance.initBrixComponent(this.id);
		}
	}
	,initUIComponents: function(compInstances) {
		var $it0 = compInstances.iterator();
		while( $it0.hasNext() ) {
			var ci = $it0.next();
			ci.init();
		}
	}
	,createUIComponents: function(node) {
		if(node.nodeType != 1) return null;
		var nodeId = node.getAttribute("data-brix-id");
		if(nodeId != null) {
			if(!this.nodeToCmpInstances.exists(nodeId)) node.removeAttribute("data-brix-id"); else return null;
		}
		var compsToInit = new List();
		if(node.className != null) {
			var _g = 0, _g1 = node.className.split(" ");
			while(_g < _g1.length) {
				var classValue = _g1[_g];
				++_g;
				var componentClass = this.resolveUIComponentClass(classValue);
				if(componentClass == null) continue;
				var newDisplayObject = null;
				newDisplayObject = Type.createInstance(componentClass,[node,this.id]);
				compsToInit.add(newDisplayObject);
			}
		}
		var _g1 = 0, _g = node.childNodes.length;
		while(_g1 < _g) {
			var cc = _g1++;
			var res = this.createUIComponents(node.childNodes[cc]);
			if(res != null) compsToInit = Lambda.concat(compsToInit,res);
		}
		return compsToInit;
	}
	,initNode: function(node) {
		var comps = this.createUIComponents(node);
		if(comps == null) return;
		this.initUIComponents(comps);
	}
	,initComponents: function() {
		this.initNode(this.htmlRootElement);
		this.createNonUIComponents();
	}
	,initDom: function(appendTo) {
		this.htmlRootElement = appendTo;
		if(this.htmlRootElement == null || this.htmlRootElement.nodeType != js.Lib.document.documentElement.nodeType) this.htmlRootElement = js.Lib.document.documentElement;
		if(this.htmlRootElement == null) return;
	}
	,getRegisteredNonUIComponents: function() {
		return this.applicationContext.registeredNonUIComponents;
	}
	,registeredNonUIComponents: null
	,getRegisteredUIComponents: function() {
		return this.applicationContext.registeredUIComponents;
	}
	,registeredUIComponents: null
	,applicationContext: null
	,dataObject: null
	,htmlRootElement: null
	,nodeToCmpInstances: null
	,nodesIdSequence: null
	,id: null
	,__class__: brix.core.Application
	,__properties__: {get_registeredUIComponents:"getRegisteredUIComponents",get_registeredNonUIComponents:"getRegisteredNonUIComponents"}
}
brix.core.ApplicationContext = function() {
	this.registeredUIComponents = new Array();
	this.registeredNonUIComponents = new Array();
	this.registerComponentsforInit();
};
$hxClasses["brix.core.ApplicationContext"] = brix.core.ApplicationContext;
brix.core.ApplicationContext.__name__ = ["brix","core","ApplicationContext"];
brix.core.ApplicationContext.prototype = {
	registerComponentsforInit: function() {
		brix.component.group.Group;
		this.registeredUIComponents.push({ classname : "brix.component.group.Group", args : null});
		brix.component.navigation.link.LinkClosePage;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.link.LinkClosePage", args : null});
		brix.component.navigation.link.LinkToPage;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.link.LinkToPage", args : null});
		brix.component.navigation.Layer;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.Layer", args : null});
		brix.component.navigation.link.TouchLink;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.link.TouchLink", args : null});
		brix.component.navigation.Page;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.Page", args : null});
		brix.component.sound.SoundOn;
		this.registeredUIComponents.push({ classname : "brix.component.sound.SoundOn", args : null});
		brix.component.sound.SoundOff;
		this.registeredUIComponents.push({ classname : "brix.component.sound.SoundOff", args : null});
	}
	,registeredNonUIComponents: null
	,registeredUIComponents: null
	,__class__: brix.core.ApplicationContext
}
brix.util = {}
brix.util.DomTools = function() { }
$hxClasses["brix.util.DomTools"] = brix.util.DomTools;
brix.util.DomTools.__name__ = ["brix","util","DomTools"];
brix.util.DomTools.doLater = function(callbackFunction,nFrames) {
	if(nFrames == null) nFrames = 1;
	haxe.Timer.delay(callbackFunction,Math.round(200 * nFrames));
}
brix.util.DomTools.getElementsByAttribute = function(elt,attr,value) {
	var childElts = elt.getElementsByTagName("*");
	var filteredChildElts = new Array();
	var _g1 = 0, _g = childElts.length;
	while(_g1 < _g) {
		var cCount = _g1++;
		if(childElts[cCount].getAttribute(attr) != null && (value == "*" || childElts[cCount].getAttribute(attr) == value)) filteredChildElts.push(childElts[cCount]);
	}
	return filteredChildElts;
}
brix.util.DomTools.getSingleElement = function(rootElement,className,required) {
	if(required == null) required = true;
	var domElements = rootElement.getElementsByClassName(className);
	if(domElements.length > 1) throw "Error: search for the element with class name \"" + className + "\" gave " + domElements.length + " results";
	if(domElements != null && domElements.length == 1) return domElements[0]; else {
		if(required) throw "Error: search for the element with class name \"" + className + "\" gave " + domElements.length + " results";
		return null;
	}
}
brix.util.DomTools.getElementBoundingBox = function(htmlDom) {
	if(htmlDom.nodeType != 1) return null;
	var offsetTop = 0;
	var offsetLeft = 0;
	var offsetWidth = 0.0;
	var offsetHeight = 0.0;
	var element = htmlDom;
	while(element != null) {
		var halfBorderH = (element.offsetWidth - element.clientWidth) / 2.0;
		var halfBorderV = (element.offsetHeight - element.clientHeight) / 2.0;
		offsetTop -= element.scrollTop;
		offsetLeft -= element.scrollLeft;
		offsetTop += element.offsetTop;
		offsetLeft += element.offsetLeft;
		element = element.offsetParent;
	}
	return { x : Math.round(offsetLeft), y : Math.round(offsetTop), w : Math.round(htmlDom.offsetWidth + offsetWidth), h : Math.round(htmlDom.offsetHeight + offsetHeight)};
}
brix.util.DomTools.inspectTrace = function(obj,callingClass) {
	var _g = 0, _g1 = Reflect.fields(obj);
	while(_g < _g1.length) {
		var prop = _g1[_g];
		++_g;
		null;
	}
	null;
}
brix.util.DomTools.toggleClass = function(element,className) {
	if(brix.util.DomTools.hasClass(element,className)) brix.util.DomTools.removeClass(element,className); else brix.util.DomTools.addClass(element,className);
}
brix.util.DomTools.addClass = function(element,className) {
	if(element.className == null) element.className = "";
	Lambda.iter(className.split(" "),function(cn) {
		if(!Lambda.has(element.className.split(" "),cn)) {
			if(element.className != "") element.className += " ";
			element.className += cn;
		}
	});
}
brix.util.DomTools.removeClass = function(element,className) {
	if(element.className == null || StringTools.trim(element.className) == "") return;
	var classNamesToKeep = new Array();
	var cns = className.split(" ");
	Lambda.iter(element.className.split(" "),function(ecn) {
		if(!Lambda.has(cns,ecn)) classNamesToKeep.push(ecn);
	});
	element.className = classNamesToKeep.join(" ");
}
brix.util.DomTools.hasClass = function(element,className,orderedClassName) {
	if(orderedClassName == null) orderedClassName = false;
	if(element.className == null || StringTools.trim(element.className) == "" || className == null || StringTools.trim(className) == "") return false;
	if(orderedClassName) {
		var cns = className.split(" ");
		var ecns = element.className.split(" ");
		var result = Lambda.map(cns,function(cn) {
			return Lambda.indexOf(ecns,cn);
		});
		var prevR = 0;
		var $it0 = result.iterator();
		while( $it0.hasNext() ) {
			var r = $it0.next();
			if(r < prevR) return false;
			prevR = r;
		}
		return true;
	} else {
		var _g = 0, _g1 = className.split(" ");
		while(_g < _g1.length) {
			var cn = _g1[_g];
			++_g;
			if(cn == null || StringTools.trim(cn) == "") continue;
			var found = Lambda.has(element.className.split(" "),cn);
			if(!found) return false;
		}
		return true;
	}
}
brix.util.DomTools.setMeta = function(metaName,metaValue,attributeName) {
	if(attributeName == null) attributeName = "content";
	var res = new Hash();
	var metaTags = js.Lib.document.getElementsByTagName("META");
	var found = false;
	var _g1 = 0, _g = metaTags.length;
	while(_g1 < _g) {
		var idxNode = _g1++;
		var node = metaTags[idxNode];
		var configName = node.getAttribute("name");
		var configValue = node.getAttribute(attributeName);
		if(configName != null && configValue != null) {
			if(configName == metaName) {
				configValue = metaValue;
				node.setAttribute(attributeName,metaValue);
				found = true;
			}
			res.set(configName,configValue);
		}
	}
	if(!found) {
		var node = js.Lib.document.createElement("meta");
		node.setAttribute("name",metaName);
		node.setAttribute("content",metaValue);
		var head = js.Lib.document.getElementsByTagName("head")[0];
		head.appendChild(node);
		res.set(metaName,metaValue);
	}
	return res;
}
brix.util.DomTools.getMeta = function(name,attributeName,head) {
	if(attributeName == null) attributeName = "content";
	if(head == null) head = js.Lib.document.documentElement.getElementsByTagName("head")[0];
	var metaTags = head.getElementsByTagName("meta");
	var _g1 = 0, _g = metaTags.length;
	while(_g1 < _g) {
		var idxNode = _g1++;
		var node = metaTags[idxNode];
		var configName = node.getAttribute("name");
		var configValue = node.getAttribute(attributeName);
		if(configName == name) return configValue;
	}
	return null;
}
brix.util.DomTools.addCssRules = function(css,head) {
	if(head == null) head = js.Lib.document.documentElement.getElementsByTagName("head")[0];
	var node = js.Lib.document.createElement("style");
	node.setAttribute("type","text/css");
	node.appendChild(js.Lib.document.createTextNode(css));
	head.appendChild(node);
	return node;
}
brix.util.DomTools.embedScript = function(src) {
	var head = js.Lib.document.getElementsByTagName("head")[0];
	var scriptNodes = js.Lib.document.getElementsByTagName("script");
	var _g1 = 0, _g = scriptNodes.length;
	while(_g1 < _g) {
		var idxNode = _g1++;
		var node = scriptNodes[idxNode];
		if(node.getAttribute("src") == src) return node;
	}
	var node = js.Lib.document.createElement("script");
	node.setAttribute("src",src);
	head.appendChild(node);
	return node;
}
brix.util.DomTools.getBaseTag = function() {
	var head = js.Lib.document.getElementsByTagName("head")[0];
	var baseNodes = js.Lib.document.getElementsByTagName("base");
	if(baseNodes.length > 0) return baseNodes[0].getAttribute("href"); else return null;
}
brix.util.DomTools.setBaseTag = function(href) {
	var head = js.Lib.document.getElementsByTagName("head")[0];
	var baseNodes = js.Lib.document.getElementsByTagName("base");
	if(baseNodes.length > 0) baseNodes[0].setAttribute("href",href); else {
		var node = js.Lib.document.createElement("base");
		node.setAttribute("href",href);
		node.setAttribute("target","_self");
		if(head.childNodes.length > 0) head.insertBefore(node,head.childNodes[0]); else head.appendChild(node);
	}
}
var haxe = {}
haxe.Log = function() { }
$hxClasses["haxe.Log"] = haxe.Log;
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe._Template = {}
haxe._Template.TemplateExpr = $hxClasses["haxe._Template.TemplateExpr"] = { __ename__ : ["haxe","_Template","TemplateExpr"], __constructs__ : ["OpVar","OpExpr","OpIf","OpStr","OpBlock","OpForeach","OpMacro"] }
haxe._Template.TemplateExpr.OpVar = function(v) { var $x = ["OpVar",0,v]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpExpr = function(expr) { var $x = ["OpExpr",1,expr]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpIf = function(expr,eif,eelse) { var $x = ["OpIf",2,expr,eif,eelse]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpStr = function(str) { var $x = ["OpStr",3,str]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpBlock = function(l) { var $x = ["OpBlock",4,l]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpForeach = function(expr,loop) { var $x = ["OpForeach",5,expr,loop]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpMacro = function(name,params) { var $x = ["OpMacro",6,name,params]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe.Template = function(str) {
	var tokens = this.parseTokens(str);
	this.expr = this.parseBlock(tokens);
	if(!tokens.isEmpty()) throw "Unexpected '" + Std.string(tokens.first().s) + "'";
};
$hxClasses["haxe.Template"] = haxe.Template;
haxe.Template.__name__ = ["haxe","Template"];
haxe.Template.prototype = {
	run: function(e) {
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			this.buf.b += Std.string(Std.string(this.resolve(v)));
			break;
		case 1:
			var e1 = $e[2];
			this.buf.b += Std.string(Std.string(e1()));
			break;
		case 2:
			var eelse = $e[4], eif = $e[3], e1 = $e[2];
			var v = e1();
			if(v == null || v == false) {
				if(eelse != null) this.run(eelse);
			} else this.run(eif);
			break;
		case 3:
			var str = $e[2];
			this.buf.b += Std.string(str);
			break;
		case 4:
			var l = $e[2];
			var $it0 = l.iterator();
			while( $it0.hasNext() ) {
				var e1 = $it0.next();
				this.run(e1);
			}
			break;
		case 5:
			var loop = $e[3], e1 = $e[2];
			var v = e1();
			try {
				var x = $iterator(v)();
				if(x.hasNext == null) throw null;
				v = x;
			} catch( e2 ) {
				try {
					if(v.hasNext == null) throw null;
				} catch( e3 ) {
					throw "Cannot iter on " + Std.string(v);
				}
			}
			this.stack.push(this.context);
			var v1 = v;
			while( v1.hasNext() ) {
				var ctx = v1.next();
				this.context = ctx;
				this.run(loop);
			}
			this.context = this.stack.pop();
			break;
		case 6:
			var params = $e[3], m = $e[2];
			var v = Reflect.field(this.macros,m);
			var pl = new Array();
			var old = this.buf;
			pl.push($bind(this,this.resolve));
			var $it1 = params.iterator();
			while( $it1.hasNext() ) {
				var p = $it1.next();
				var $e = (p);
				switch( $e[1] ) {
				case 0:
					var v1 = $e[2];
					pl.push(this.resolve(v1));
					break;
				default:
					this.buf = new StringBuf();
					this.run(p);
					pl.push(this.buf.b);
				}
			}
			this.buf = old;
			try {
				this.buf.b += Std.string(Std.string(v.apply(this.macros,pl)));
			} catch( e1 ) {
				var plstr = (function($this) {
					var $r;
					try {
						$r = pl.join(",");
					} catch( e2 ) {
						$r = "???";
					}
					return $r;
				}(this));
				var msg = "Macro call " + m + "(" + plstr + ") failed (" + Std.string(e1) + ")";
				throw msg;
			}
			break;
		}
	}
	,makeExpr2: function(l) {
		var p = l.pop();
		if(p == null) throw "<eof>";
		if(p.s) return this.makeConst(p.p);
		switch(p.p) {
		case "(":
			var e1 = this.makeExpr(l);
			var p1 = l.pop();
			if(p1 == null || p1.s) throw p1.p;
			if(p1.p == ")") return e1;
			var e2 = this.makeExpr(l);
			var p2 = l.pop();
			if(p2 == null || p2.p != ")") throw p2.p;
			return (function($this) {
				var $r;
				switch(p1.p) {
				case "+":
					$r = function() {
						return e1() + e2();
					};
					break;
				case "-":
					$r = function() {
						return e1() - e2();
					};
					break;
				case "*":
					$r = function() {
						return e1() * e2();
					};
					break;
				case "/":
					$r = function() {
						return e1() / e2();
					};
					break;
				case ">":
					$r = function() {
						return e1() > e2();
					};
					break;
				case "<":
					$r = function() {
						return e1() < e2();
					};
					break;
				case ">=":
					$r = function() {
						return e1() >= e2();
					};
					break;
				case "<=":
					$r = function() {
						return e1() <= e2();
					};
					break;
				case "==":
					$r = function() {
						return e1() == e2();
					};
					break;
				case "!=":
					$r = function() {
						return e1() != e2();
					};
					break;
				case "&&":
					$r = function() {
						return e1() && e2();
					};
					break;
				case "||":
					$r = function() {
						return e1() || e2();
					};
					break;
				default:
					$r = (function($this) {
						var $r;
						throw "Unknown operation " + p1.p;
						return $r;
					}($this));
				}
				return $r;
			}(this));
		case "!":
			var e = this.makeExpr(l);
			return function() {
				var v = e();
				return v == null || v == false;
			};
		case "-":
			var e = this.makeExpr(l);
			return function() {
				return -e();
			};
		}
		throw p.p;
	}
	,makeExpr: function(l) {
		return this.makePath(this.makeExpr2(l),l);
	}
	,makePath: function(e,l) {
		var p = l.first();
		if(p == null || p.p != ".") return e;
		l.pop();
		var field = l.pop();
		if(field == null || !field.s) throw field.p;
		var f = field.p;
		haxe.Template.expr_trim.match(f);
		f = haxe.Template.expr_trim.matched(1);
		return this.makePath(function() {
			return Reflect.field(e(),f);
		},l);
	}
	,makeConst: function(v) {
		haxe.Template.expr_trim.match(v);
		v = haxe.Template.expr_trim.matched(1);
		if(HxOverrides.cca(v,0) == 34) {
			var str = HxOverrides.substr(v,1,v.length - 2);
			return function() {
				return str;
			};
		}
		if(haxe.Template.expr_int.match(v)) {
			var i = Std.parseInt(v);
			return function() {
				return i;
			};
		}
		if(haxe.Template.expr_float.match(v)) {
			var f = Std.parseFloat(v);
			return function() {
				return f;
			};
		}
		var me = this;
		return function() {
			return me.resolve(v);
		};
	}
	,parseExpr: function(data) {
		var l = new List();
		var expr = data;
		while(haxe.Template.expr_splitter.match(data)) {
			var p = haxe.Template.expr_splitter.matchedPos();
			var k = p.pos + p.len;
			if(p.pos != 0) l.add({ p : HxOverrides.substr(data,0,p.pos), s : true});
			var p1 = haxe.Template.expr_splitter.matched(0);
			l.add({ p : p1, s : p1.indexOf("\"") >= 0});
			data = haxe.Template.expr_splitter.matchedRight();
		}
		if(data.length != 0) l.add({ p : data, s : true});
		var e;
		try {
			e = this.makeExpr(l);
			if(!l.isEmpty()) throw l.first().p;
		} catch( s ) {
			if( js.Boot.__instanceof(s,String) ) {
				throw "Unexpected '" + s + "' in " + expr;
			} else throw(s);
		}
		return function() {
			try {
				return e();
			} catch( exc ) {
				throw "Error : " + Std.string(exc) + " in " + expr;
			}
		};
	}
	,parse: function(tokens) {
		var t = tokens.pop();
		var p = t.p;
		if(t.s) return haxe._Template.TemplateExpr.OpStr(p);
		if(t.l != null) {
			var pe = new List();
			var _g = 0, _g1 = t.l;
			while(_g < _g1.length) {
				var p1 = _g1[_g];
				++_g;
				pe.add(this.parseBlock(this.parseTokens(p1)));
			}
			return haxe._Template.TemplateExpr.OpMacro(p,pe);
		}
		if(HxOverrides.substr(p,0,3) == "if ") {
			p = HxOverrides.substr(p,3,p.length - 3);
			var e = this.parseExpr(p);
			var eif = this.parseBlock(tokens);
			var t1 = tokens.first();
			var eelse;
			if(t1 == null) throw "Unclosed 'if'";
			if(t1.p == "end") {
				tokens.pop();
				eelse = null;
			} else if(t1.p == "else") {
				tokens.pop();
				eelse = this.parseBlock(tokens);
				t1 = tokens.pop();
				if(t1 == null || t1.p != "end") throw "Unclosed 'else'";
			} else {
				t1.p = HxOverrides.substr(t1.p,4,t1.p.length - 4);
				eelse = this.parse(tokens);
			}
			return haxe._Template.TemplateExpr.OpIf(e,eif,eelse);
		}
		if(HxOverrides.substr(p,0,8) == "foreach ") {
			p = HxOverrides.substr(p,8,p.length - 8);
			var e = this.parseExpr(p);
			var efor = this.parseBlock(tokens);
			var t1 = tokens.pop();
			if(t1 == null || t1.p != "end") throw "Unclosed 'foreach'";
			return haxe._Template.TemplateExpr.OpForeach(e,efor);
		}
		if(haxe.Template.expr_splitter.match(p)) return haxe._Template.TemplateExpr.OpExpr(this.parseExpr(p));
		return haxe._Template.TemplateExpr.OpVar(p);
	}
	,parseBlock: function(tokens) {
		var l = new List();
		while(true) {
			var t = tokens.first();
			if(t == null) break;
			if(!t.s && (t.p == "end" || t.p == "else" || HxOverrides.substr(t.p,0,7) == "elseif ")) break;
			l.add(this.parse(tokens));
		}
		if(l.length == 1) return l.first();
		return haxe._Template.TemplateExpr.OpBlock(l);
	}
	,parseTokens: function(data) {
		var tokens = new List();
		while(haxe.Template.splitter.match(data)) {
			var p = haxe.Template.splitter.matchedPos();
			if(p.pos > 0) tokens.add({ p : HxOverrides.substr(data,0,p.pos), s : true, l : null});
			if(HxOverrides.cca(data,p.pos) == 58) {
				tokens.add({ p : HxOverrides.substr(data,p.pos + 2,p.len - 4), s : false, l : null});
				data = haxe.Template.splitter.matchedRight();
				continue;
			}
			var parp = p.pos + p.len;
			var npar = 1;
			while(npar > 0) {
				var c = HxOverrides.cca(data,parp);
				if(c == 40) npar++; else if(c == 41) npar--; else if(c == null) throw "Unclosed macro parenthesis";
				parp++;
			}
			var params = HxOverrides.substr(data,p.pos + p.len,parp - (p.pos + p.len) - 1).split(",");
			tokens.add({ p : haxe.Template.splitter.matched(2), s : false, l : params});
			data = HxOverrides.substr(data,parp,data.length - parp);
		}
		if(data.length > 0) tokens.add({ p : data, s : true, l : null});
		return tokens;
	}
	,resolve: function(v) {
		if(Reflect.hasField(this.context,v)) return Reflect.field(this.context,v);
		var $it0 = this.stack.iterator();
		while( $it0.hasNext() ) {
			var ctx = $it0.next();
			if(Reflect.hasField(ctx,v)) return Reflect.field(ctx,v);
		}
		if(v == "__current__") return this.context;
		return Reflect.field(haxe.Template.globals,v);
	}
	,execute: function(context,macros) {
		this.macros = macros == null?{ }:macros;
		this.context = context;
		this.stack = new List();
		this.buf = new StringBuf();
		this.run(this.expr);
		return this.buf.b;
	}
	,buf: null
	,stack: null
	,macros: null
	,context: null
	,expr: null
	,__class__: haxe.Template
}
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = window.setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.measure = function(f,pos) {
	var t0 = haxe.Timer.stamp();
	var r = f();
	haxe.Log.trace(haxe.Timer.stamp() - t0 + "s",pos);
	return r;
}
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
}
haxe.Timer.prototype = {
	run: function() {
	}
	,stop: function() {
		if(this.id == null) return;
		window.clearInterval(this.id);
		this.id = null;
	}
	,id: null
	,__class__: haxe.Timer
}
haxe.rtti = {}
haxe.rtti.Meta = function() { }
$hxClasses["haxe.rtti.Meta"] = haxe.rtti.Meta;
haxe.rtti.Meta.__name__ = ["haxe","rtti","Meta"];
haxe.rtti.Meta.getType = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.obj == null?{ }:meta.obj;
}
haxe.rtti.Meta.getStatics = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.statics == null?{ }:meta.statics;
}
haxe.rtti.Meta.getFields = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.fields == null?{ }:meta.fields;
}
var js = {}
js.Boot = function() { }
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = function() { }
$hxClasses["js.Lib"] = js.Lib;
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib["eval"] = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
brix.component.group.Group.GROUP_ID_ATTR = "data-group-id";
brix.component.group.Group.GROUP_SEQ = 0;
brix.component.navigation.Layer.EVENT_TYPE_SHOW = "onLayerShow";
brix.component.navigation.Layer.EVENT_TYPE_HIDE = "onLayerHide";
brix.component.navigation.Page.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.navigation.Page.CLASS_NAME = "Page";
brix.component.navigation.Page.CONFIG_NAME_ATTR = "name";
brix.component.navigation.Page.CONFIG_INITIAL_PAGE_NAME = "initialPageName";
brix.component.navigation.Page.ATTRIBUTE_INITIAL_PAGE_NAME = "data-initial-page-name";
brix.component.navigation.Page.OPENED_PAGE_CSS_CLASS = "page-opened";
brix.component.navigation.link.LinkBase.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.navigation.link.LinkBase.CONFIG_PAGE_NAME_ATTR = "href";
brix.component.navigation.link.LinkBase.CONFIG_TARGET_ATTR = "target";
brix.component.navigation.link.LinkBase.CONFIG_TARGET_IS_POPUP = "_top";
brix.component.navigation.link.LinkClosePage.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.navigation.link.LinkToPage.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.navigation.link.TouchLink.ATTR_TOUCH_TYPE = "data-touch-type";
brix.component.navigation.link.TouchLink.ATTR_TOUCH_DETECT_DISTANCE = "data-touch-detection-distance";
brix.component.navigation.link.TouchLink.DEFAULT_DETECT_DISTANCE = 10;
brix.component.navigation.transition.TransitionTools.SHOW_START_STYLE_ATTR_NAME = "data-show-start-style";
brix.component.navigation.transition.TransitionTools.SHOW_END_STYLE_ATTR_NAME = "data-show-end-style";
brix.component.navigation.transition.TransitionTools.HIDE_START_STYLE_ATTR_NAME = "data-hide-start-style";
brix.component.navigation.transition.TransitionTools.HIDE_END_STYLE_ATTR_NAME = "data-hide-end-style";
brix.component.navigation.transition.TransitionTools.EVENT_TYPE_REQUEST = "transitionEventTypeRequest";
brix.component.navigation.transition.TransitionTools.EVENT_TYPE_STARTED = "transitionEventTypeStarted";
brix.component.navigation.transition.TransitionTools.EVENT_TYPE_ENDED = "transitionEventTypeEnded";
brix.component.sound.SoundOn.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.sound.SoundOn.CLASS_NAME = "SoundOn";
brix.component.sound.SoundOn.isMuted = false;
brix.component.sound.SoundOff.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.sound.SoundOff.CLASS_NAME = "SoundOff";
brix.core.Application.BRIX_ID_ATTR_NAME = "data-brix-id";
brix.core.Application.instances = new Hash();
haxe.Template.splitter = new EReg("(::[A-Za-z0-9_ ()&|!+=/><*.\"-]+::|\\$\\$([A-Za-z0-9_-]+)\\()","");
haxe.Template.expr_splitter = new EReg("(\\(|\\)|[ \r\n\t]*\"[^\"]*\"[ \r\n\t]*|[!+=/><*.&|-]+)","");
haxe.Template.expr_trim = new EReg("^[ ]*([^ ]+)[ ]*$","");
haxe.Template.expr_int = new EReg("^[0-9]+$","");
haxe.Template.expr_float = new EReg("^([+-]?)(?=\\d|,\\d)\\d*(,\\d*)?([Ee]([+-]?\\d+))?$","");
haxe.Template.globals = { };
js.Lib.onerror = null;
brix.core.Application.main();
function $hxExpose(src, path) {
	var o = window;
	var parts = path.split(".");
	for(var ii = 0; ii < parts.length-1; ++ii) {
		var p = parts[ii];
		if(typeof o[p] == "undefined") o[p] = {};
		o = o[p];
	}
	o[parts[parts.length-1]] = src;
}
})();
