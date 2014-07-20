Template.layout.events({
  'click .logout': function(e) {
    e.preventDefault();
    //call setIsInChat before logout
    Meteor.call('setIsInChat', false);
    Meteor.logout(function(err) {
      if(err) {
        console.log(err);
      } else {
        Router.go('/');
      }
    });
  }
});