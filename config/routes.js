var nyfc = require('../app/controllers/nyfc');
  
module.exports = function (app) {
  app.get('/', nyfc.index);
  app.get('/nyfc/show', nyfc.index);
  app.post('/nyfc/create', nyfc.create);
  //app.get('/users', user.list);
}