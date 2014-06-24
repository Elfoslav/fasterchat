Template.layout.helpers({
  getFriendPhoto: function(fbId) {
    console.log('lala');
    Meteor.call('getFriendPhoto', fbId, function(err, photoUrl) {
      Session.set('friendPhoto', photoUrl);
    });
    return Session.get('friendPhoto');
  }
});