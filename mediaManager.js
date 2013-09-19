var mongoServer = 'localhost';
var mongoPort = 27017;

MediaManager = function(app){
    var MediaProvider = require('./mediaProvider-mongodb').MediaProvider;
    var mediaProvider = new MediaProvider(mongoServer, mongoPort);

    mediaProvider.insertMedia({name:'Item 1'}, function(a,b){});
    mediaProvider.insertMedia({name:'Item 2'}, function(a,b){});
 
    app.get('/media', function(req,res){
        mediaProvider.fetchAllMedia(function(err,items){
           res.send(items);
        });
    });

    app.post('/media', function(req, res){
        mediaProvider.insertMedia(req.files.cameraBtn, function(err, id){
            if(err){
                res.send(err, 500);
            }
            else{
            	var photos = [];
            	photos.push(id);
                res.json(photos);
            }
            console.dir(req.files);
        });
    });

    app.get('/media/:id', function(req,res){
        mediaProvider.fetchMediaById(req.params.id, function(err,item){
            if(item == null){
                res.send(err,404);
            }
            else{
                res.sendfile(item);
            }
        });
    });

    app.post('/media/:id', function(req,res){
        var _item = req.body;
        _item._id = req.params.id;

        mediaProvider.updateMedia(_item, function(err,item){
            if(item == null){
                res.send(err,404);
            }
            else{
                res.send(item);
            }
         });
     });

     app.delete('/media/:id', function(req, res){
         mediaProvider.deleteMedia(req.params.id, function(err, item){
             if( item == null ){
                 res.send(err,404);
             }
             else{
                 res.send(item);
             }
         });
     });
};

exports.MediaManager = MediaManager;
