Meteor.startup(function() {
  window.onbeforeunload = onWindowClose;

  Deps.autorun(function() {

    //handler on message typing
    messageStream.on('msg' + Meteor.userId(), function(msg) {
      if(msg) {
        $('.typing-now').removeClass('hidden');
        $('.typing-now-text').text(msg);
      } else {
        $('.typing-now').addClass('hidden');
      }
    });

    //when user sends a message
    messageStream.on('msgSent' + Meteor.userId(), function(msgId, senderFbId) {
      //typing now is also on homepage
      $('.typing-now').addClass('hidden');
      if(Router.current().route.name == 'chat') {
        //user is in /chat page
        $('.typing-now-text').text('');
        Meteor.call('markMessageAsRead', msgId);
      } else {
        //update unread messages
        if(typeof Session.get('unreadMessages' + senderFbId) !== 'undefined') {
          Session.set('unreadMessages' + senderFbId, Session.get('unreadMessages' + senderFbId) + 1);
        }
      }
    });

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