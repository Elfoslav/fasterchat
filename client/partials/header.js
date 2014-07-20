Template.header.helpers({
  isOnline: function() {
    return Meteor.status().connected;
  },
  showBackBtn: function() {
    if(Router.current().path !== '/') {
      Session.set('showBackBtn', true);
    } else {
      Session.set('showBackBtn', false);
    }
    return Session.get('showBackBtn');
  }
});