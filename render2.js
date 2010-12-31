//render2.js
//a better renderer using traverser

var traverser = require('traverser')
  , log = require('logger')
  
exports = module.exports = render

var defaults = {
  indent: ''
, pad: ' '
, joiner: ', '
, value: function (value,p){
    if(p.value === undefined)
      return 'undefined'
    if('string' === typeof value)
      return "\"" + value.split('\n').join('\n ') + "\""

    return JSON.stringify(value)
  }
, key: function (key, p){
    return p.parent instanceof Array ? '' : (/^\w+$/(key) ? key : "'" + key + "'") + ": "
  }
, join: function (lines,p,def){
    var self = this
      , pad = lines.length ? self.pad : ''
    return ( pad + 
          lines.map 
        ( function (e) {return indent(e, self.indent)} ).join (this.joiner) + pad)
  }
, reference: function (rendered,p){
  return 'var' + p.index.repeated //+ "dfsdfdsf"
}
, referenced: function (index,p){
   return 'var' + index + '='
}
, surround: function (objString,p){
 
    if(p.value instanceof Date || p.value instanceof RegExp)
      return p.value.toString()
    if(p.value instanceof Array)
      return '[' + objString + ']'
    if(p.value === null)
      return 'null'
    if('function' == typeof p.value)
      return  p.value.toString().replace(/{.+}$/m,'{...}')
    return '{' + objString + '}'
  }
}
function render (obj, options){
  options = options || {}
  if(options.multi){
    options.indent = '  '
    options.joiner = '\n, '
  }

    options.__proto__ = defaults
  return traverser(obj, {branch: branch, leaf: leaf, isBranch:isBranch, pre:true})
  
  function isBranch(p){
    return ('function' == typeof p.value || 'object' == typeof p.value)
  }
  function branch (p){
    var key = (p.parent ? call('key',p.key,p) : '')    
  
    if(p.reference){
     var r = call('reference',p.index.seen,p)
      if(r !== undefined) return key + r
    }
    return key + (p.referenced ? call('referenced',p.index.repeated,p) : '') + 
      call('surround',call('join',p.map(),p),p)
  }
  function leaf (p){
    return (p.parent ? call('key',p.key,p) : '') + call('value',p.value,p) 
  }
  function call(method,value,p){
    return options[method](value,p,options.__proto__[method])
  }
}

function indent (s, ch){
    return s.split('\n').join('\n' + ch)
}

