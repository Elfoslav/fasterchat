Meteor.startup(function() {
  console.log('starting meteor server: ' + Meteor.absoluteUrl());

  Messages._ensureIndex({ receiverFbId: 1 });
  Messages._ensureIndex({ senderFbId: 1 });

  Future = Npm.require('fibers/future');

  Meteor.publish('currentUser', function() {
    return Meteor.users.find({ _id: this.userId }, {
      fields: {
        "friends": 1,
        "services.facebook.id": 1
      }
    });
  });

  Meteor.publish('userFriends', function(friendIds) {
    var fields = App.userFriendFields;
    if (friendIds) {
      return Meteor.users.find({
        'services.facebook.id': { $in: friendIds }
      }, {
        fields: fields
      });
    } else {
      var user = Meteor.users.findOne(this.userId);
      if (user && user.friends) {
        return Meteor.users.find({
          'services.facebook.id': { $in: user.friends }
        }, {
          fields: fields
        });
      }

      return this.ready();
    }
  });

  Meteor.publish('userMessages', function(fbId) {
    var user = Meteor.users.findOne(this.userId);
    var userFbId = user && user.services && user.services.facebook && user.services.facebook.id;

    return Messages.find({
      $or: [
        { $and: [
          { receiverFbId: userFbId },
          { senderFbId: fbId }
        ]},
        { $and: [
          { receiverFbId: fbId },
          { senderFbId: userFbId }
        ]}
      ]
    }, {
      sort: { timestamp: -1 },
      limit: 15
    });
  });

  Accounts.onCreateUser(function(options, user) {

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