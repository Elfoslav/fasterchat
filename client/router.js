Router.map(function() {
  this.route('home', {
    path: '/',
    onRun: function() {
      Meteor.call('setIsInChat', false);
    }
  });
  this.route('chat', {
    path: '/chat/:fbId',
    waitOn: function() {
      return [
        Meteor.subscribe('userFriends', [ this.params.fbId ]),
        Meteor.subscribe('userMessages', this.params.fbId)
      ];
    },
    data: function() {
      return {
        friend: Meteor.users.findOne({
          'services.facebook.id': this.params.fbId
        }),
        messages: Messages.find({}, { sort: { timestamp: 1 } })
      }
    },
    onRun: function() {
      Session.set('senderFbId', this.params.fbId);
      Meteor.call('setIsInChat', true);
      Meteor.call('markMessagesAsRead', this.params.fbId);
    },
    onStop: function() {
      Meteor.call('setIsInChat', false);
    }
  });

  this.route('notFound', {path: '*' });
});

Router.configure({
  layoutTemplate: 'layout'
});