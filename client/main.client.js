Meteor.startup(function() {
  window.onbeforeunload = onWindowClose;

  //handler on message typing
  messageStream.on('msg' + Meteor.userId(), function(msg) {
    if(msg) {
      $('.typing-now').removeClass('hidden');
      $('.typing-now-text').text(msg);
    } else {
      $('.typing-now').addClass('hidden');
    }
  });

  messageStream.on('msgSent' + Meteor.userId(), function() {
    $('.typing-now-text').text('');
    $('.typing-now').addClass('hidden');
  });
});

function onWindowClose() {
  Meteor.call('userGoesOffline');
}