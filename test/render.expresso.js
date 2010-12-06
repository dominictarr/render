
var render = require('render')
  , describe = require('should').describe
  , log = require('logger')
  , inspect = require('inspect')
exports ['can render array as list'] = function (test){
  var list = ['a','b','c']
    , rendered = render(list).ol()
    , it = 
      describe('' + rendered,"rendered ordered list")
    it.should.eql("0. a\n1. b\n2. c\n")
    
  log('' + rendered)

}

exports ['can render array same as Array.toString()'] = function (test){
  var list = ['a','b','c']
    , rendered = render(list).format({between:',',  key:''})
    , it = 
      describe('' + rendered,"rendered list with square brackets and ', '")
    it.should.eql(list.toString())
  log('' + rendered)
}

exports ['can render array same as JSON.stringify()'] = function (test){
  var list = ['a','b','c']
    , rendered = render(list).format({brackets: ['[',']'], between:',',  key:'', primitive: JSON.stringify})
    , it = 
      describe('' + rendered,"rendered list with square brackets and ', '")
    it.should.eql(JSON.stringify(list))
  log('' + rendered)
}

exports ['can render nested arrays with indentation'] = function (test){
  var list = ['a','b',[10,20,30],'c']
    , rendered = render(list).format({
        before: ''
      , between:'\n'
      , indent: ''
      , key: function (key,path,value){
          if('object' === typeof value)
            return ''
          return [].concat(path).concat(key).join('.') + ' - '
        } 
      } )
    , it = 
      describe('' + rendered,"rendered list with square brackets and ', '")
  log('' + rendered)

    it.should.eql(
        '0 - a\n'
      + '1 - b\n'
      + '2.0 - 10\n'
      + '2.1 - 20\n'
      + '2.2 - 30\n'
      + '3 - c' )
}
exports ['can be applied to any object'] = function (test){
  var list = ['a','b',[10,20,30],'c']
    , obj = {a: "AAA", b:"BBB", c: "CCC", d: [1,2,{'!':"wow!"}]}
    , r = render().format({
        before: ''
      , between:'\n'
      , indent: ''
      , key: function (key,path,value){ //functions are much more useful than the other stuff...
          if('object' === typeof value)
            return ''
          return [].concat(path).concat(key).join('.') + ' - '
        } 
      } )
      
  var rendered = '' + r.renderer(list)
  log(rendered)
   
  var it =
     describe(rendered, "rendered nested list with paths '")
    it.should.eql(
        '0 - a\n'
      + '1 - b\n'
      + '2.0 - 10\n'
      + '2.1 - 20\n'
      + '2.2 - 30\n'
      + '3 - c' )

  var rendered = '' + r.renderer(obj)
  log(rendered)
   
  var it =
     describe(rendered, "rendered nested list with paths '")

  log('' + r.render(obj))
    it.should.eql(
      'a - AAA\n'
    + 'b - BBB\n'
    + 'c - CCC\n'
    + 'd.0 - 1\n'
    + 'd.1 - 2\n'
    + 'd.2.! - wow!' )

  var it =
     describe(rendered, "rendered nested list with paths '")

  log('' + r.render(obj))
    it.should.eql(
      'a - AAA\n'
    + 'b - BBB\n'
    + 'c - CCC\n'
    + 'd.0 - 1\n'
    + 'd.1 - 2\n'
    + 'd.2.! - wow!' )
}


exports ['can render nested arrays same as inspect'] = function (test){
  var list = ['a','b',[10,20,30],'c']
    , obj = {a: "AAA", b:"BBB", c: "CCC", d: [1,2,{'!':"wow!"}]}
    , func = function func(){}
    , i = render.inspect
      
  var rendered = i(list)
  log(i(list,true))
   
  var it =
     describe(rendered, "rendered nested list, like inspect")
    it.should.eql(inspect(list))


  var rendered = i(obj)
  log(i(obj,true))
   
  var it =
     describe(rendered, "rendered nested object, like inspect")
    it.should.eql(inspect(obj))

  var rendered = i(func)
  log(i(func,true))
   
  var it =
     describe(rendered, "rendered nested object, like inspect")
    it.should.eql(inspect(func))
    
  func.x = 'xxx'

  var rendered = i(func)
  log(i(func,true))
  log(inspect(func))
   
  var it =
     describe(rendered, "rendered nested object, like inspect")
    it.should.eql(inspect(func))
}

exports ['can show how two objects are equal'] = function (test){
/*
  have this return an object and report what paths are unequal
  that toString()s to the print out
*/
  log(render.equals([1,2,3],[1,2,4]))
  log(render.equals([1,2,3],[1,2,3]))
  log(render.equals([1,2,3],[1,2,3,'X']))
  log(render.equals([1,2,3],[1,3,'X',2]))
  log(render.equals({a:2,b:3},{a:2,b:4}))
  log(render.equals({a:2,b:3},{a:2,b:3, c:3, d:3}))
  log(render.equals({a:2,b:{x:3}},{a:2,b:{x:30}}))
  log(render.equals({a:2,b:{}},{a:2,b:{x:30}}))
}

