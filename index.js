const moment = require("moment")
const WebSocket = require('ws');
const request = require('request')

function connectSDDP() {
  var outletObject = {
    OutletKeyService: {
      // replace below {outletid} value with your unique ID provided to you by our Client/Account Services 
      outletid: '7vzjbeh98kgm12i8frsfl25x1'
    }
  };
  // initialize WebSocket connection
  var connection = new WebSocket('wss://content.performgroup.io');
  connection.onopen = function (event) {
    // when connection is opened, send outlet data to get authorized
    connection.send(JSON.stringify({
      outlet: outletObject
    }));
  };
  connection.onmessage = (msg) => {
    var msg = JSON.parse(msg.data);
    // first time subscription sending for particular fixtureUuid
    // based on response from outlet plugin
    if (msg.outlet && msg.outlet.msg && msg.outlet.msg === 'is_authorised') {
      console.log('subscribe to a fixture' );
      subscriptionObj = {
        "name": "subscribe",
      // required.
        "feed": ['matchEvent'],
      // required. Value: Feed name you subscribe to, for example 'matchEvent' 'matchEventStats' 'stats' (replace feedName)
        "fixtureUuid": "ddsn6eyqw3t3j6h5vukrlvckq",
      // required. Value: Unique ID (UUID) of a fixture you want to subscribe to (eg c359t8yjkrvm9oyzm80pgjemt - replace uuid). Get UUIDs from the Tournament Schedule feed
        "optaId": true
      // optional (include if you want Opta IDs). Value: true|false (Opta IDs are not returned if you specify "optaId": false)
      }
      // send subscription request
      connection.send(JSON.stringify({
        content: subscriptionObj
      }));
    }
    // do something with received match data
    console.log(msg);
  }
}
request.get("localhost:9200/rmc/eventsOpta/_search?size=1000")
    .then(res => {
        console.log(res)
    }).catch(console.error)

