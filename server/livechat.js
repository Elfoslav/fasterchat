Meteor.startup(function() {
  console.log('starting meteor server: ' + Meteor.absoluteUrl());

  Future = Npm.require('fibers/future');

  Meteor.publish('currentUser', function() {
    return Meteor.users.find({ _id: this.userId }, {
      fields: { "services.facebook.id": 1 }
    });
  });

  Meteor.publish('userFriends', function(friendIds) {
    return Meteor.users.find({
      'services.facebook.id': { $in: friendIds }
    }, {
      fields: {
        'services.facebook.id': 1,
        'profile.online': 1,
        'profile.name': 1
      }
    });
  });

  Meteor.publish('userMessages', function(fbId) {
    var user = Meteor.users.findOne(this.userId);
    console.log('this.user.services.facebook.id', user.services.facebook.id);
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
    });
  });
});