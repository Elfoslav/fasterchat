//Methods for home view
Meteor.methods({
  /**
   * @param {String} accessToken
   */
  getUserFriends: function(accessToken) {
    var future = new Future();

    if (accessToken) {
      FB.setAccessToken(accessToken);
    } else if (Meteor.user() && Meteor.user().services && Meteor.user().services.facebook) {
      FB.setAccessToken(Meteor.user().services.facebook.accessToken);
    } else {
      future.throw(new Error('User is not logged in or missing Facebook service in user profile'));
    }

    FB.api('/me/friends', function(err, friends) {
      if(err) {
        console.log('getUserFriends Fb.api error: ', err);
        future.throw(err);
      } else if (friends) {
        future.return(friends.data);
      } else {
        console.log('no friends: ', friends);
        future.return([]);
      }
    });

    return future.wait();
  },

  userGoesOffline: function() {
    Meteor.users.update({ _id: this.userId }, {
      $set: { 'profile.online': false, inChat: false }
    });
  },

  getUnreadMessagesCount: function(senderFbId) {
    var user = Meteor.users.findOne(this.userId);

    return Messages.find({
      senderFbId: senderFbId,
      receiverFbId: user.services.facebook.id,
      isRead: false
    }).count();
  },

  getFbLoginUrl: function() {
    var url = 'https://www.facebook.com/dialog/oauth?client_id=' +
        App.FB.appId + '&redirect_uri=' + Meteor.absoluteUrl() +
        'oauth/facebook/&response_type=token&scope=user_friends';

    return url;
  },

  fbLogin: function(response) {
    var identity = Meteor.call('$getIdentity', response.access_token);
    // synchronous call to get the user info from Facebook

    var serviceData = {
      accessToken: response.access_token,
      expiresAt: (+new Date) + (1000 * response.expires_in)
    };
    // include all fields from facebook
    // http://developers.facebook.com/docs/reference/login/public-profile-and-friend-list/
    var whitelisted = ['id', 'email', 'name', 'first_name',
        'last_name', 'link', 'username', 'gender', 'locale', 'age_range'];

    var fields = _.pick(identity, whitelisted);
    _.extend(serviceData, fields);

    var stuff = {
        serviceName : 'facebook',
        serviceData: serviceData,
        options: {profile: {name: identity.name}}
      };
      var userData = Accounts.updateOrCreateUserFromExternalService(stuff.serviceName, stuff.serviceData, stuff.options);

      var x = DDP._CurrentInvocation.get();

      var token = Accounts._generateStampedLoginToken();
      Accounts._insertLoginToken(userData.userId, token);
      Accounts._setLoginToken(userData.userId, x.connection, Accounts._hashLoginToken(token.token))
      x.setUserId(userData.userId)


      return {
        id: userData.userId,
        token: token.token,
        tokenExpires: Accounts._tokenExpiration(token.when)
      };

  },

  $getIdentity: function(accessToken) {
    try {
      return HTTP.get("https://graph.facebook.com/me", {
        params: {access_token: accessToken}}).data;
    } catch (err) {
      throw _.extend(new Meteor.Error("Failed to fetch identity from Facebook. " + err.message),
             {response: err.response});
    }
  }
});