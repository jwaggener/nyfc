//GET home page.
var db = require('../../db/nyfc');
exports.index = exports.show = function(req, res){
  res.locals = {
    title: 'Name Your Favorite Color',
  };
  return res.render(
    'master-layout',
    {
      partials:
      {
        pageContent: 'index',
      }
    }
  );
};

exports.create = function (req, res) {
  console.log('db', db);
  console.log('req.param(name)', req.param('name'));
}
