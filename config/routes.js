var nyfc = require('../app/controllers/nyfc');
  
module.exports = function (app) {
  app.get('/', nyfc.index);
  //app.get('/users', user.list);
}