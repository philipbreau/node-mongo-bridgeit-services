var nextId = 1;

MediaProvider = function(){
    this.media = [];

    this.fetchAllMedia = function(cb){
        cb(null, this.media);
    };

    this.fetchMediaById = function(id, cb){
        var foundMedia = this.media.filter(function(item){ return item._id == id });
      
        if( foundMedia.length == 0 ){
            cb('Media not found', null);
        } 
        else{
            cb(null, foundMedia[0]);
        }
    };

    this.insertMedia = function(item, cb){
        item._id = nextId++;
        this.media.push(item);

        cb(null, item);
    };

    this.updateMedia = function(item, cb){
        this.fetchMediaById(item._id, function(err, _item){
            if(err){
                cb(err,null);
            }
            else{
                _item.name = item.name;
                
                cb(null, _item);
            }
        });
    };

    this.deleteMedia = function(id, cb){
        this.media = this.media.filter(function(item){return item._id != id});
        cb(null, {_id:id});
    };
};

exports.MediaProvider = MediaProvider;
