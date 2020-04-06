"use strict";

var fs = require("fs");

var _ = require("lodash");

var util = require('util');

var events = require('events');

function TestLive(path, logger) {
  var intervall = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  events.EventEmitter.call(this);
  this.topic = "RAW_FILE_rmc_opta_soccer_api_performfeeds_com_soccerdata_testlive_7vzjbeh98kgm12i8frsfl25x1";
  this.logger = logger;
  this.interval = intervall;
  this.tag = "rmc_opta_soccer";

  if (fs.lstatSync(path).isDirectory()) {
    var files = fs.readdirSync(path);
    files.forEach(function (file) {
      console.log(file);
      this.Start(JSON.parse(fs.readFileSync(path + "/" + file)));
    }, this);
  } else if (fs.lstatSync(path).isFile()) {
    this.Start(JSON.parse(fs.readFileSync(path)));
  }
}

util.inherits(TestLive, events.EventEmitter);

TestLive.prototype.Start = function (match) {
  var _this = this;

  var matchTmp = _.cloneDeep(match);

  delete matchTmp.liveData.goal;
  delete matchTmp.liveData.substitute;
  delete matchTmp.liveData.card;
  delete matchTmp.liveData.matchDetails.matchLengthMin;
  matchTmp.liveData.matchDetails.matchTime = 0;
  var i = 0;
  var int = setInterval(function () {
    if (matchTmp.liveData.matchDetails.matchTime < 45) {
      matchTmp.liveData.matchDetails.periodId = 1;
    } else if (matchTmp.liveData.matchDetails.matchTime > 45) {
      matchTmp.liveData.matchDetails.periodId = 2;
    } else if (matchTmp.liveData.period[1] && matchTmp.liveData.matchDetails.matchTime == matchTmp.liveData.period[1].lengthMin + matchTmp.liveData.period[0].lengthMin) {
      matchTmp.liveData.matchDetails.periodId = 3;
    } else if (matchTmp.liveData.period[2] && matchTmp.liveData.matchDetails.matchTime == matchTmp.liveData.period[1].lengthMin + matchTmp.liveData.period[0].lengthMin + matchTmp.liveData.period[2].lengthMin) {
      matchTmp.liveData.matchDetails.periodId = 4;
    }

    if (matchTmp.liveData.matchDetails.matchTime == 45 && i < 15) {
      console.log("oui");
      i++;
      delete matchTmp.liveData.matchDetails.matchTime;
      console.log(i);

      _this.emit("message", _this.topic, JSON.stringify(matchTmp), metadata);

      matchTmp.liveData.matchDetails.matchTime = 45;
    } else {
      var metadata = {
        topic: _this.topic,
        url: "TESTLIVE",
        size: 9000,
        tag: _this.tag,
        content_type: "application/json;charset=UTF-8",
        type: "json",
        provider: "opta_puller"
      };
      var sport = "soccerdata";
      metadata.sport_id = sport;
      metadata.ressource = "match";
      matchTmp.liveData.matchDetails.matchTime++;

      if (match.liveData.goal) {
        match.liveData.goal.forEach(function (element, index, object) {
          if (matchTmp.liveData.matchTime == element.timeMin) {
            if (!matchTmp.liveData.goal) {
              matchTmp.liveData.goal = [];
            }

            matchTmp.liveData.goal.push(element);
          }
        });
      }

      if (match.liveData.card) {
        match.liveData.card.forEach(function (element) {
          if (matchTmp.liveData.matchTime == element.timeMin) {
            if (!matchTmp.liveData.card) {
              matchTmp.liveData.card = [];
            }

            matchTmp.liveData.card.push(element);
          }
        });
      }

      if (match.liveData.substitute) {
        match.liveData.substitute.forEach(function (element) {
          if (matchTmp.liveData.matchTime == element.timeMin) {
            if (!matchTmp.liveData.substitute) {
              matchTmp.liveData.substitute = [];
            }

            matchTmp.liveData.substitute.push(element);
          }
        });
      }

      if (match.liveData.penaltyShot) {
        match.liveData.penaltyShot.forEach(function (element) {
          if (matchTmp.liveData.matchTime == element.timeMin) {
            if (!matchTmp.liveData.penaltyShot) {
              matchTmp.liveData.penaltyShot = [];
            }

            matchTmp.liveData.penaltyShot.push(element);
          }
        });
      }

      if (matchTmp.liveData.matchDetails.matchTime == match.liveData.matchDetails.matchLengthMin) {
        clearInterval(int);
      }

      _this.logger.info("Read from TEST LIVE", metadata);

      _this.emit("message", _this.topic, JSON.stringify(match), metadata);
    }
  }, 600 * this.interval, this);
};

exports.create = function (path, logger) {
  return new TestLive(path, logger);
};