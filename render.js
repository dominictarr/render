//render

/*
this could be refactored into a traverser...

and then that used to make a renderer

this is definately better than what i did in inspect though!

instead make a traverser with methods like this:

{ key:
, object: //called on whole object, and can call cb to cancel.
, primitive: (string,number,boolean)
, typeof {string:, number:, boolean:, :function:, etc}
, instanceof {String:, Object:, Array:, Date:, etc}

pass everything the same args
{ key:
, value:
, path (list of keys so far)
, ancestors
, circular (boolean)
, referenced (boolean, if this object is referenced later)
, reference (path to first occurance, or null) 
, prune (stop exploring this branch)
, halt (stop exploring tree) }

*/

var log = require('logger')
  , style = require('style')
  , curry = require('curry')
exports = module.exports = render

function render(obj){
  return new Rendered(obj)
}

function Rendered(obj){
  var self = this
  self.obj = obj
  self._format = []
}

function applyIf(func,args,def){
  if ('function' === typeof func)
    return func.apply(null,args)
  return func == null ? def : func
}

Rendered.prototype = {
  ol: function (){
    var format = this._format
    format.indent = ' '
    format.brackets = ['','']
    format.after = '\n'
    format.before = ". "
    format.between = ''
    format.key = function (k){return k}
    return this
  },
  render: function (obj,opts){
      opts = opts || {path:[], indent: ''}
      
    var keys = Object.keys(obj)
      , format = this._format
      , after = format.after || ''
      , before = format.before || ''
      , brackets = applyIf(format.brackets,[obj,opts.path],['',''])
      , self = this
      , indent = opts.indent
      , nextIndent = indent + (format.indent || '')

      ,contents = 
      
     keys.map(function(key){
      var _key = key
      var line = ''
      var value = obj[key]
      var path = [].concat(opts.path).concat(_key)
      if('object' === typeof value) {
        key = applyIf(format.key,[key,opts.path,value,obj],key)
        line = key + self.render(value, {path: path, indent: (indent + key + before).replace(/./g,' ')})
      } else {
        key = applyIf(format.key,[key,opts.path,value,obj],key)
        value = applyIf(format.primitive,[value,path],value)
        line = key + before + value + after
      }
      return line
    }).join(format.between || '')

   return [brackets[0], contents, brackets[1]].join('')
  },
  toString: function (){
    return this.render(this.obj)
  },
  format : function (formatting){
    this._format = formatting
    return this
  },
  get renderer (){
    var self = this
    return function (obj){
      return self.render(obj)
    }
  }
}
/*
THE FOLLOWING IS REAL UGLY!
*/

var enabled = true

var styles = {
  brackets: style().grey.styler
, number: style().blue.styler
, string: style().green.styler
, 'boolean': style().yellow.styler
, 'undefined': style().red.styler
, key: style().magenta.bold.styler
}

var inspectFormat = 
  { key:
     function (key,path,value,obj){
       if(obj instanceof Array)
         return ''
       return styles.key(key,enabled) + ': '
     }
   , between: ', '
   , brackets: function (obj) {

      if(obj instanceof Array){
        return ['[',']']
      } else if ('object' === typeof obj){
        return ['{','}']
      } else if ('function' === typeof obj)
        var f = /(function \w* ?\(\w*\))/.exec(obj.toString())

        var sp = Object.keys(obj).length > 0 ? ' ' : ''
        return ['[' + f[1]  + sp,']']
      return ['','']
    }
  , primitive:
      function (value,path){
          return styles[typeof value](JSON.stringify(value),enabled)
     }
  }

var inspector = render().format(inspectFormat)

exports.inspect = function (obj,coloured){
  enabled = !coloured
  return inspector.render(obj)
  enabled = false
}
var other
var equalp = true
function get(obj,path){
  path.forEach(function (c){
    obj = obj [c]
  })
  return obj
}
function check(self,other,path){
  return get(self,path) == get(other,path)
}

var equalsFormat = 
  { key:
     function (key,path,value,obj){
       if(obj instanceof Array)
         return ''

        var s = (get(other,[].concat(path).concat(key)) == null ? 'red' : 'green')
      if (s == 'red') equalp = false
       return style(key)[s] + ': '
     }
   , between: ', '
   , brackets: function (obj,path) {
      if(obj instanceof Array){
        return ['[',']']
      } else if ('object' === typeof obj){
        return ['{','}']
      } else if ('function' === typeof obj)
        var f = /(function \w* ?\(\w*\))/.exec(obj.toString())

        var sp = Object.keys(obj).length > 0 ? ' ' : ''
        return ['[' + f[1]  + sp,']']
      return ['','']
    }
  , primitive:
      function (value,path){
        var s = (value != get(other,path) ? 'red' : 'green')

      if (s == 'red') equalp = false
        return style(JSON.stringify(value))[s]
     }
  }

var checker = render().format(equalsFormat)

exports.equals = function (_eqA,_eqB){
  equalp = true
  other = _eqB
  var a = checker.render(_eqA) 
  var ap = equalp
  equalp = true
  other = _eqA
  var b = checker.render(_eqB) 
  var bp = equalp
  
  return a + (ap && bp ? ' == ' : ' != ') + b
}

