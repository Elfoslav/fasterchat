//this is just a config example
//for development & production create config.js in this folder and insert content of this file into it.

App = {
  FB: {}
};

if(/localhost/.test(Meteor.absoluteUrl())) {
  App.FB.appId = 'localhostappID';
  App.FB.secret = 'localhostFBsecret';
} else {
  App.FB.appId = 'productionappID';
  App.FB.secret = 'productionFBsecret';
}

if (/localhost/.test(Meteor.absoluteUrl())) {
  ServiceConfiguration.configurations.remove({
    service: "facebook"
  });
  //create your Facebook app on https://developers.facebook.com/apps and insert appId & secret
  ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: App.FB.appId, //insert your app id here
    secret: App.FB.secret //insert your secret here
  });
} else {
  ServiceConfiguration.configurations.remove({
    service: "facebook"
  });
  //create your Facebook app on https://developers.facebook.com/apps and insert appId & secret
  ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: App.FB.appId, //insert your app id here
    secret: App.FB.secret //insert your secret here
  });
}
