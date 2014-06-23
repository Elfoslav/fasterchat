Meteor.startup(function() {
	window.onbeforeunload = onWindowClose;
});

function onWindowClose() {
  Meteor.call('userGoesOffline');
}