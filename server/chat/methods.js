//Methods for home view
Meteor.methods({
  saveMessage: function(data) {

    var user = Meteor.users.findOne(this.userId);

    if(data.senderFbId != user.services.facebook.id) {
      throw new Error('Sender must be logged in user');
    }

    check(data, {
      senderFbId: String,
      receiverFbId: String,
      message: String
    });

    data.timestamp = new Date();
    //message is not read by default
    data.isRead = false;

    var fut = new Future();

    Messages.insert(data, function(err, id) {
      if(err) {
        fut.throw(err);
      } else {
        fut.return(id);
      }
    });

    return fut.wait();
  },
  //mark one message as read
  markMessageAsRead: function(msgId) {
    check(msgId, String);
    Messages.update(msgId, { $set: { isRead: true, isReadAt: new Date() } });
  },
  //mark multiple messages as read
  markMessagesAsRead: function(senderFbId) {
    var user = Meteor.users.findOne(this.userId);
    Messages.update(
      { senderFbId: senderFbId, receiverFbId: user.services.facebook.id },
      { $set: { isRead: true, isReadAt: new Date() } },
      { multi: true }
    );
  }
});