Template.header.helpers({
  hasConnection: function() {
    return Meteor.status().connected;
  },
  showBackBtn: function() {
    //wrap with Meteor.defer because of Router
    Meteor.defer(function() {
      if(Router.current().path !== '/') {
        Session.set('showBackBtn', true);
      } else {
        Session.set('showBackBtn', false);
      }
    });
    return Session.get('showBackBtn');
  }
});