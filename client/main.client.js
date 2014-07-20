Meteor.startup(function() {
  window.onbeforeunload = onWindowClose;

  //subscribe for user data so Meteor.user() gives us services object
  Meteor.subscribe('currentUser');

  var pageTitle = document.title;
  var pageTitleInterval;
  var isWindowActive;
  var isMobile = navigator.userAgent.indexOf("Mobile") !== -1;
  console.log('isMobile: ', isMobile);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      Session.set('isWindowActive', false);
    } else {
      //show
      Session.set('isWindowActive', true);
    }
  });

  window.onfocus = function() {
    Session.set('isWindowActive', true);
  }
  window.onblur = function() {
    Session.set('isWindowActive', false);
  }

  Deps.autorun(function() {
    if (Session.get('isWindowActive')) {
      pageTitleInterval = clearInterval(pageTitleInterval);
      document.title = pageTitle;
      Meteor.call('markMessagesAsRead', Session.get('senderFbId'));
    }
  });


  Deps.autorun(function() {

    //handler on message typing
    messageStream.on('msg' + Meteor.userId(), function(msg, senderId) {
      if (msg) {
        $('.typing-now-' + senderId).removeClass('hidden');
        $('.typing-now').removeClass('hidden');
        $('.typing-now-text').text(msg);
      } else {
        $('.typing-now-' + senderId).addClass('hidden');
        $('.typing-now').addClass('hidden');
      }
    });

    //when user sends a message
    messageStream.on('msgSent' + Meteor.userId(), function(msgId, senderFbId, senderId) {
      //typing now is also on homepage
      $('.typing-now-' + senderId).addClass('hidden');
      $('.typing-now').addClass('hidden');
      if (Router.current().route.name == 'chat') {
        //user is in /chat page
        $('.typing-now-text').text('');

        if (!Session.get('isWindowActive') && !pageTitleInterval && Session.get('senderFbId') == senderFbId) {
          pageTitleInterval = setInterval(function() {
            document.title = document.title == pageTitle ? 'New message...' : pageTitle;
          }, 1000);
        } else if (isMobile) {
          //mark message as read on mobile
          Meteor.call('markMessagesAsRead', senderFbId);
        }
      } else {
        //update unread messages
        if (typeof Session.get('unreadMessages' + senderFbId) !== 'undefined') {
          Session.set('unreadMessages' + senderFbId, Session.get('unreadMessages' + senderFbId) + 1);
        }
      }
    });

    if (Meteor.user() && Meteor.user().services && Meteor.user().services.facebook) {
      //re-render user friends when some friend is registered
      messageStream.on('newFriend' + Meteor.user().services.facebook.id, function() {
        Meteor.call('getUserFriends', function(err, friends) {
          if (err) {
            console.error('Error getting user friends: ', err);
          } else {
            Session.set('friends', friends);
          }
        });
      });
    }

  });

  Handlebars.registerHelper('isOnline', function(fbId) {
    var user = Meteor.users.findOne({
      'services.facebook.id': fbId
    });
    user = user || {};
    user.profile = user.profile || {};
    return user.profile.online;
  });

});

function onWindowClose() {
  Meteor.call('userGoesOffline');
}