
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
```

## License

MIT
