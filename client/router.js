Router.map(function() {
  this.route('home', {path: '/'});
  this.route('chat', {path: '/chat'});
  this.route('notFound', {path: '*' });
});

Router.configure({
  layoutTemplate: 'layout'
});

Router.onRun(function() {
  Meteor.subscribe('currentUser');
});