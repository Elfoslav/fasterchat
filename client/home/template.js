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
      Session.set('friends', friends);
    });
    return Session.get('friends');
  },
  isOnline: function(fbId) {
    var user = Meteor.users.findOne({
      'services.facebook.id': fbId
    });
    user = user || {};
    user.profile = user.profile || {};
    return user.profile.online;
  },
  url: function() {
    return Meteor.absoluteUrl();
  }
});