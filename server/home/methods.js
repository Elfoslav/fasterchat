//Methods for home view
Meteor.methods({
  /**
   * @param {String} accessToken
   */
  getUserFriends: function(accessToken) {
    var future = new Future();

    if (accessToken) {
      FB.setAccessToken(accessToken);
    } else if (Meteor.user() && Meteor.user().services && Meteor.user().services.facebook) {
      FB.setAccessToken(Meteor.user().services.facebook.accessToken);
    } else {
      future.throw(new Error('User is not logged in or missing Facebook service in user profile'));
    }

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
      $set: { 'profile.online': false, inChat: false }
    });
  },
  getUnreadMessagesCount: function(senderFbId) {
    var user = Meteor.users.findOne(this.userId);

    return Messages.find({
      senderFbId: senderFbId,
      receiverFbId: user.services.facebook.id,
      isRead: false
    }).count();
  }
});