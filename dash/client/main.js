var Messages = new Ground.Collection('messages', { connection: null });


Meteor.setInterval(function() {
  Session.set("time", new Date().getTime());
}, 1000);


Template.clock.helpers({
  currentTime: function() {
    var time = Session.get("time");

    return moment(time).format("h:mma");
  }
});


Template.trams.helpers({
  trams: function() {
    return Trams.find({}, {
      sort: { arrivalTime: -1 }
    });
  }
});


Template.messages.helpers({
  messages: function() {
    return Messages.find({}, {
      sort: { createdAt: 1 }
    });
  },

  editorActive: function() {
    return Session.get("messages-editorActive");
  }
});


Template.messages.events({
  "click .add-message-button": function () {
    Session.set("messages-editorActive", true); 
  },

  "click .cancel-message-button": function () {
    Session.set("messages-editorActive", false);
  },

  "submit .add-message-form": function (event) {
    event.preventDefault();

    if (!event.target.message.value) {
      return;
    }

    var message = event.target.message.value;

    Session.set("messages-editorActive", false);

    Messages.insert({
      message: message,
      createdAt: new Date()
    });
  }
});


Template.message.events({
  "click .remove-message-button": function () {
    Messages.remove(this._id);
  }
});