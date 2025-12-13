const {add} = require('./cal');
exports.add1 = (a) => {
     console.log(a);
     
     
     return add(a,1);
}