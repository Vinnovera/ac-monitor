module.exports = {
  listenPort: 8080,

  googleCredentials: {
    username: "foo@gmail.com",
    password: "somepassword"
  },

  pushdataCredentials: {
    email: "foo@email.com",
    apiKey: "someapikey"
  },

  remote: "AC",
  sensors: [
    { name: "inside", type: "1wire", id: "28-000005494d43" },
    { name: "outside", type: "1wire", id: "28-0000052112e9" }
  ],
  pollInterval: 300000, // 5 minute interval

  commands: [
    {
      name: "A/C mode",
      commands: [
        { name: "Wake up", type: "ir", id: "KEY_WAKEUP", state: "on" },
        { name: "Sleep", type: "ir", id: "KEY_SLEEP", state: "off" }
      ]
    }
  ],

  alarms: {
    sensor: "inside",
    steps: [5, 15],
    emailFrom: "Foo <foo@gmail.com>",
    emailRecipients: ["foo@gmail.com"]
  },

  texts: {
    title: "A/C monitor",
    send: "Are you sure you want to",
    sent: "sent!",
    alarmSubject: "Temperature alarm",
    alarmMessage:
      "<h1>Temperature alarm</h1>\n" +
      "<p>The inside temperature is now <strong>{{#if above}}above{{/if}}{{#if below}}below{{/if}}</strong> the <strong>{{alarm}}° alarm</strong> at <strong>{{temperature}}°</strong></p>"
  }
};
