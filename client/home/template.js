Template.home.events({
  'click .fb-login': function(e) {
    //Router.go('chat');
    Meteor.loginWithFacebook({
        requestPermissions: ['user_friends']
      }, function(err) {
      console.log(err);
    });
  }
});