//Methods for home view
Meteor.methods({
  getUserFriends: function() {
    FB.setAccessToken(Meteor.user().services.facebook.accessToken);

    var future = new Future();
    FB.api('/me/friends', function(err, friends) {
      if(err) {
        future.throw(err);
      }
      future.return(friends.data);
    });

    return future.wait();
  },
  userGoesOffline: function() {
    Meteor.users.update({ _id: this.userId }, {
      $set: { 'profile.online': false }
    });
  },
  getUnreadMessagesCount: function(senderFbId) {
    return Messages.find({
      senderFbId: senderFbId,
      isRead: false
    }).count();
  }
});