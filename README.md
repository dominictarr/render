#Render#

get complete control of how your objects are turned into text.

    render(object,options)

options is a {} of functions which overwrite the default way to stringify each part of the object.

see `render.js`

these functions are:

    value // display a primitive value
    key // display a key (on an object, but not an array)
    join // join a list object key->value strings into one string (default joins with ','s
    surround // puts the brackets on {} or [] 
    referenced // when a object is repeated later (default: varX={...})
    reference // when a object is a repeat (varX

    


    
