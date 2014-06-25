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
      if($('.typing-now').length) {
        //user is in /chat page
        $('.typing-now-text').text('');
        $('.typing-now').addClass('hidden');
        Meteor.call('markMessageAsRead', msgId);
      } else {
        //update unread messages
        if(typeof Session.get('unreadMessages' + senderFbId) !== 'undefined') {
          Session.set('unreadMessages' + senderFbId, Session.get('unreadMessages' + senderFbId) + 1);
        }
      }
    });

  });
});

function onWindowClose() {
  Meteor.call('userGoesOffline');
}