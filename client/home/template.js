Template.home.events({

});

Template.home.helpers({
  getUserFriends: function() {
    if (Meteor.user() && Meteor.user().friends) {
      Session.set('friendsIds', Meteor.user().friends);
    }

    //call getUserFriends every time in order to check if new friend is in app
    Meteor.call('getUserFriends', function(err, friends) {
      if(err) {
        if (!Session.get('friends')) {
          Session.set('friends', []);
          //probably login token expired - re-authenticate user
          Meteor.call('getFbLoginUrl', function(err, url) {
            location.href = url;
          });
        }
        console.log(err);
      }

      if(friends) {
        var ids = friends.map(function(friend) {
          return friend.id;
        });

        var hook = Meteor.subscribe('userFriends', ids);
        Meteor.call('addUserFriends', ids);

        Session.set('friendsIds', ids);
      } else {
        console.log('No friends.');
      }
    });

    return Session.get('friendsIds');
  },

  //just return session friends so we don't need to call getUserFriends again in template
  userFriends: function() {
    var ids = Session.get('friendsIds') || [];
    return Meteor.users.find({
      'services.facebook.id': { $in:  ids }
    }, {
      sort: { 'profile.online': -1 }
    });
  },

  url: function() {
    return Meteor.absoluteUrl();
  },

  fbLoginUrl: function() {
    Meteor.call('getFbLoginUrl', function(err, url) {
      Session.set('fbLoginUrl', url);
    });

    return Session.get('fbLoginUrl');
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