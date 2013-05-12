
# promisify

converts a callback based api to promise based

## example

```js
var promisify = require('promisify');

var add = promisify(function(a, b, cb){
  setTimeout(function(){
    cb(null, a+b);
  }, 0);
});

var result = add(3, 3);
var again = add(result, 5);
var waaat = add(again, result);
add(result, waaat).when(function(err, res){
  console.log(res); // 23
});

var math = {};
math.add = function(a, b, cb){ cb(null, a+b); };
math.sub = function(a, b, cb){ cb(null, a-b); };
math.mul = function(a, b, cb){ cb(null, a*b); };

var p = promisify(math);

p.add(1,p.sub(6,p.mul(2,2))).when(function(err, res){
  console.log(res); // 3
});
```

## License

MIT
