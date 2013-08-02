
/*
 * GET home page.
 */

exports.index = function(req, res){
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