Template.home.events({
  'click .fb-login': function(e) {
    Meteor.loginWithFacebook({
        requestPermissions: ['user_friends']
      }, function(err) {
      console.log(err);
    });
  }
});

Template.home.helpers({
  getUserFriends: function() {
    Meteor.call('getUserFriends', function(err, friends) {
      if(err) {
        alert('Something wrong happened');
        console.log(err);
      }
      var ids = friends.map(function(friend) {
        return friend.id;
      });
      Meteor.subscribe('userFriends', ids);

      var users = Meteor.users.find({
        'services.facebook.id': { $in:  ids }
      }, {
        sort: { 'profile.online': -1 }
      }).fetch();

      Session.set('friends', users);
    });
    return Session.get('friends');
  },
  url: function() {
    return Meteor.absoluteUrl();
  },
  getUnreadMessagesCount: function(senderFbId) {
    if(!senderFbId) {
      console.error('senderFbId parameter missing in getUnreadMessagesCount');
    }
    Meteor.call('getUnreadMessagesCount', senderFbId, function(err, messagesCount) {
      if(err) {
        console.log(err);
      } else {
        Session.set('unreadMessages' + senderFbId, messagesCount);
      }
    });
    return Session.get('unreadMessages' + senderFbId);
  }
});