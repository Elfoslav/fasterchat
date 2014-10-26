Router.map(function() {
  this.route('home', {
    path: '/',
    waitOn: function() {
      return Meteor.subscribe('userFriends');
    },
    data: function() {
      //find all subscribed users
      var friends = Meteor.users.find({}, {
        sort: { 'profile.online': -1 }
      });

      return {
        userFriends: friends
      }
    },
    onRun: function() {
      if (typeof messagesSub !== 'undefined') {
        //remove subscribed messages
        messagesSub.stop();
      }

      Meteor.call('setIsInChat', false);
    }
  });
  this.route('chat', {
    path: '/chat/:fbId',
    waitOn: function() {
      Session.set('messagesLoaded', undefined);
      //define global variable messagesSub
      messagesSub = Meteor.subscribe('userMessages', this.params.fbId, function onReady() {
        Session.set('messagesLoaded', true);
      });
      return [
        Meteor.subscribe('userFriends', [ this.params.fbId ]),
        messagesSub
      ];
    },
    data: function() {
      var friend = Meteor.users.findOne({
        'services.facebook.id': this.params.fbId
      });

      if (!friend) {
        return null;
      }

      Session.set('friend', friend);

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

  this.route('clientOauthFb', {
    path: '/oauth/facebook',
    action: function() {
      if (this.params.error) {
        console.log('oaut error: ', this.params.error);
        Router.go('/');
      } else {
        var str = window.location.hash;
        str = str.split('&');
        var accessToken = str[0];
        var expiresIn = str[1];
        accessToken = accessToken.split('=');
        expiresIn = expiresIn.split('=');
        var result = {
          access_token : accessToken[1],
          expires_in : expiresIn[1]
        };

        Accounts._setLoggingIn(true);
        Meteor.call('fbLogin', result, function(error, result) {
          if (error) {
            console.log('fbLogin Error: ', error);
            cordova.alert('An error occured, try again', function () {}, 'Error', 'Ok');
          } else {
            Meteor.loginWithToken(result.token, function(err) {
              if(err) {
                Meteor._debug("Error logging in with token: " + err);
              }
              Accounts._setLoggingIn(false);
              Router.go('/');
            });
          }
        });
      }
    }
  });

  this.route('notFound', {path: '*' });
});

Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound'
});
