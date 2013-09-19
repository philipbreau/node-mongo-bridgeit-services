var mediaTable = 'media';

var mongo = require('mongodb');
var GridStore = mongo.GridStore;
var Server = mongo.Server;
var ObjectID = mongo.ObjectID;
var Db = mongo.Db;
var BSON = mongo.BSONPure;
var fs = require('fs');

MediaProvider = function(host, port){
    this.server = new Server('localhost', 27017, {auto_reconnect:true});
    this.db = new Db(mediaTable, this.server);
    this.db.open(function(){});

    this.fetchAllMedia = function(cb){
	this.db.collection(mediaTable, function(err,media){        
            if(err){
                cb(err,null);
            }
            else{
                media.find().toArray(function(err, results){
                    cb(err, results);
                });
             }
         });
    };

    this.fetchMediaById = function(id, cb){
        //create out file path & get write stream
        var outputFromDbFile = __dirname + '/public/uploads/FromDB_' + id + '.jpg';
        var writestream = fs.createWriteStream(outputFromDbFile);
        
        //construct objectID from 'id' string
        var o_id = BSON.ObjectID.createFromHexString(id);
        
        //create gridstore in READ mode
        var gridstore = new GridStore(this.db, o_id, 'r');
        gridstore.open(function(err, gridstore){
        	if(err){
        		console.log('error: ' + err);
        	}
        	else{
        		var readstream = gridstore.stream(true);
        		readstream.on('end', function(){
        			console.log('End was called');
        		});
        		//when writing is done
        		readstream.on('close', function(){
        			console.log('Close was called');
        			cb(null,outputFromDbFile);
        		});
        		readstream.pipe(writestream);
        	}
        });
    };

    this.insertMedia = function(item, cb){
        var id = new ObjectID();
        var gridStoreWrite = new GridStore(this.db, id, item, "w",
        	{chunkSize:1024});
    	gridStoreWrite.writeFile(item.path, function(err,result){
    		if(err){
    			console.log('write error');
    		}
    		else{
    			console.dir(result);
    			cb(null,id);
    		}
    	});
    };

    this.updateMedia = function(item, cb){
        console.log('updateMedia');
        this.db.collection(mediaTable, function(err, media){
            if(err){
                cb(err, null);
            }
            else{
                media.update({_id: media.db.bson_serializer.ObjectID.createFromHexString(item._id)},
                    {name: item.name},
                    function(err, result){
                        cb(err,result);
                });
             }
         });
    };

    this.deleteMedia = function(id, cb){
        this.db.collection(mediaTable, function(err, media){
            if(err){
                cb(err,null);
            }
            else{
                media.remove({_id: media.db.bson_serializer.ObjectID.createFromHexString(id)},
                    function(err, result){
                        cb(err,result);
                 });
            }
         });
    };

};

exports.MediaProvider = MediaProvider;
