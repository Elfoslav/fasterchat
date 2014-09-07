Template.home.events({

});

Template.home.helpers({
  getUserFriends: function() {
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
        Meteor.subscribe('userFriends', ids);

        var users = Meteor.users.find({
          'services.facebook.id': { $in:  ids }
        }, {
          sort: { 'profile.online': -1 }
        }).fetch();

        //uncomment if you need to see test user
        //users.push({
        //  profile: {
        //    name: 'Test user',
        //  },
        //  services: {
        //    facebook: {
        //      id: '10203286670160141'
        //    }
        //  }
        //});

        console.log('getUserFriends called : ', Session.get('friends'));
        Session.set('friends', users);
      } else {
        console.log('No friends.');
      }
    });

    return Session.get('friends');
  },

  //just return session friends so we don't need to call getUserFriends again in template
  userFriends: function() {
    return Session.get('friends');
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