Template.layout.events({
  'click .logout': function(e) {
    e.preventDefault();
    Meteor.logout(function(err) {
      if(err) {
        console.log(err);
      } else {
        Router.go('/');
      }
    });
  }
});