const moment = require("moment")
const request = require('request')
const fs = require("fs")

const calendar = [];
const contestant = [];
request.get({
    uri: 'http://api.performfeeds.com/soccerdata/tournamentcalendar/7vzjbeh98kgm12i8frsfl25x1/active/authorized?_fmt=json&_rt=b&stages=yes'
}, function(err, res, body){
  body = JSON.parse(body)
  body.competition.forEach(competition => {
      competition.tournamentCalendar.forEach(element => {
        calendar.push(element.id)
      })
    })
});

calendar.forEach(id => {
  request.get({
      uri: 'http://api.performfeeds.com/soccerdata/tournamentcalendar/7vzjbeh98kgm12i8frsfl25x1/active/authorized?_fmt=json&_rt=b&stages=yes'
  }, function(err, res, body){
    body = JSON.parse(body)
    body.contestant.forEach(contestant => {
      contestant.push(contestant)
      
    })
  });
})
fs.writeFile("../pretty.json", JSON.stringify(contestant), (err) => {
  if (err) throw err;
});

