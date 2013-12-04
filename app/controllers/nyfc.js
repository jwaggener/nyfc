//GET home page.
var db = require('../../db/nyfc');
exports.index = function(req, res){

	//this is querying the couchdb via cradlejs and returning a json
	/*var args = arguments;
	db.nyfc.view('nyfc/all', function (err, res) {
		console.log('res', res);
		args[1].send(res);
	    // loop through each row returned by the view
	    res.forEach(function (row) {
	        // print out to console it's name and isHyperlink flag
	        console.log(row.name + " - " + row.color);
	    });
	});*/
	
	// this is returning an actual web page with markup
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
	var createArgs = arguments,
		name = req.param('name'), 
		color = req.param('color'),
		another = req.param('another'),
		connection = db.nyfc;

	if(name && color){
		connection.save({
			name:name,
			color: color
		},
		function (err, res) {
      if (err) {
          createArgs[1].send('err');
      } else {
          createArgs[1].send('success');
      }
		});
	}else{
		createArgs[1].send('err');
	}
}
