messageStream = new Meteor.Stream('messages');

if(Meteor.isServer) {
  messageStream.permissions.read(function(eventName) {
    return true;
  });

  messageStream.permissions.write(function(eventName) {
    return true;
  });
}