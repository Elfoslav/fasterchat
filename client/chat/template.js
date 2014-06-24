Template.chat.events({
  'keydown .chat-textarea': function(e) {
    if (e.which == 13) {
      //prevent new line
      e.preventDefault();
    }
  },
  'keyup .chat-textarea': function(e) {
    var receiverId = Router.getData().friend._id;
    var receiverFbId = Router.getData().friend.services.facebook.id;
    var msg = $.trim($(e.currentTarget).val());
    //13 is enter key
    if (e.which == 13) {
      e.preventDefault();
      //send & save message
      var data = {
        senderFbId: Meteor.user().services.facebook.id,
        receiverFbId: receiverFbId,
        message: msg
      };
      Meteor.call('saveMessage', data, function(err) {
        if(err) {
          alert('An error occured, please try again.');
        } else {
          $(e.currentTarget).val('');
          messageStream.emit('msgSent' + receiverId);
        }
      });
    } else {
      //send key strokes to a friend
      messageStream.emit('msg' + receiverId, msg);
    }
  }
})

Template.chat.helpers({
  getUserFbId: function(receiverFbId, senderFbId) {
    if(senderFbId == Meteor.user().services.facebook.id) {
      console.log('returning senderFbId: ', senderFbId);
      return senderFbId;
    }
    console.log('returning receiverFbId: ', receiverFbId);
    return receiverFbId;
  }
});