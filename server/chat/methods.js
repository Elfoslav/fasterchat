//Methods for home view
Meteor.methods({
  'saveMessage': function(data) {
    check(data, {
      senderFbId: String,
      receiverFbId: String,
      message: String
    });

    data.timestamp = new Date();

    var fut = new Future();

    Messages.insert(data, function(err, id) {
      if(err) {
        fut.throw(err);
      } else {
        fut.return(id);
      }
    });

    return fut.wait();
  }
});