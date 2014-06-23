//this is just a config example
//for development & production create config.js in this folder and insert content of this file into it.

if (/localhost/.test(Meteor.absoluteUrl())) {
  //local/development settings...
  ServiceConfiguration.configurations.remove({
    service: "facebook"
  });
  //create your Facebook app on https://developers.facebook.com/apps and insert appId & secret
  ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: "123123123", //insert your app id here
    secret: "75a730b58f5691de5522789070c319bc" //insert your secret here
  });
} else {
  //production settings...
  ServiceConfiguration.configurations.remove({
    service: "facebook"
  });
  //create your Facebook app on https://developers.facebook.com/apps and insert appId & secret
  ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: "123123123", //insert your app id here
    secret: "75a730b58f5691de5522789070c319bc" //insert your secret here
  });
}