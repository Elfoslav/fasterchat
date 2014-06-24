Router.map(function() {
  this.route('home', {path: '/'});
  this.route('chat', {
    path: '/chat/:fbId',
    waitOn: function() {
      return Meteor.subscribe('userFriends', [ this.params.fbId ]);
    },
    data: function() {
      return {
        friend: Meteor.users.findOne({
          'services.facebook.id': this.params.fbId
        })
      }
    }
  });
  this.route('notFound', {path: '*' });
});

Router.configure({
  layoutTemplate: 'layout'
});

Router.onRun(function() {
  Meteor.subscribe('currentUser');
});