Template.chat.events({
  'keydown .chat-textarea': function(e) {
    if (e.which == 13) {
      //prevent new line
      e.preventDefault();
    }
  },
  'keyup .chat-textarea': function(e) {
    var receiverId = Session.get('friend')._id;
    var receiverFbId = Session.get('friend').services.facebook.id;
    var senderId = Meteor.userId();
    var senderFbId = Meteor.user().services.facebook.id;
    var msg = $.trim($(e.currentTarget).val());
    //13 is enter key
    if (e.which == 13) {
      e.preventDefault();

      if(msg === '') {
        //prevent empty message to be sent
        return;
      }

      //send & save message
      var data = {
        senderFbId: senderFbId,
        receiverFbId: receiverFbId,
        message: msg
      };
      Meteor.call('saveMessage', data, function(err, msgId) {
        if(err) {
          alert('An error occured, please try again.');
        } else {
          $(e.currentTarget).val('');
          messageStream.emit('msgSent' + receiverId, msgId, senderFbId, senderId);
        }
      });
    } else {
      //send key strokes to a friend
      messageStream.emit('msg' + receiverId, msg, senderId);
    }
  },

  'click .hide-chat-with': function(e) {
    $('.chat-with').addClass('hidden');
    $('#chat .messages').addClass('chat-with-hidden');
  }
});

Template.chat.helpers({
  messagesLoaded: function() {
    return Session.get('messagesLoaded');
  },
  formatMessage: function(message) {
    if (message) {
      message = Handlebars._escape(message); //escape some <html> tags
      return new Handlebars.SafeString(message.replace(/(?:(https?\:\/\/[^\s]+))/g,
        "<a href='$1' target='_blank'>$1</a>")); //return safe string
    }
  }
});