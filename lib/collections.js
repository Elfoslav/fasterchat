/**
 * {
  senderFbId: String, //I send a message
  receiverFbId: String, //My friend receives a message
  message: String,
  timestamp: Date,
  isRead: Boolean,
  isReadAt: Date
 }
 */
Messages = new Meteor.Collection('messages');