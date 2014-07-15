Meteor.startup(function() {
  console.log('starting meteor server: ' + Meteor.absoluteUrl());

  Future = Npm.require('fibers/future');

  Meteor.publish('currentUser', function() {
    return Meteor.users.find({ _id: this.userId }, {
      fields: {
        "services.facebook.id": 1
      }
    });
  });

  Meteor.publish('userFriends', function(friendIds) {
    return Meteor.users.find({
      'services.facebook.id': { $in: friendIds }
    }, {
      fields: {
        'services.facebook.id': 1,
        'profile.online': 1,
        'profile.name': 1,
        inChat: 1
      }
    });
  });

  Meteor.publish('userMessages', function(fbId) {
    var user = Meteor.users.findOne(this.userId);
    return Messages.find({
      $or: [
        { $and: [
          { receiverFbId: user.services.facebook.id },
          { senderFbId: fbId }
        ]},
        { $and: [
          { receiverFbId: fbId },
          { senderFbId: user.services.facebook.id }
        ]}
      ]
    }, {
      sort: { timestamp: -1 },
      limit: 15
    });
  });

  Accounts.onCreateUser(function(options, user) {

    console.log('user: ', user);
    console.log('userId: ', Meteor.userId());

    var fbService = user.services.facebook;

    if(user.profile) {
      user.profile.name = fbService.name;
    } else {
      user.profile = {
        name: fbService.name
      }
    }

    //update facebook friends of other clients
    Meteor.call('getUserFriends', fbService.accessToken, function(err, friends) {
      if(friends) {
        friends.forEach(function(friend) {
          messageStream.emit('newFriend' + friend.id);
        });
      }
    });

    return user;
  });
});