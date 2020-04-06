const fs = require("fs");
const _ = require("lodash");

class Live {
  constructor(path, emit, logger, intervall = 1) {
    this.logger = logger;
    this.emit = emit;
    this.topic =
      "RAW_FILE_rmc_opta_soccer_api_performfeeds_com_soccerdata_testlive_7vzjbeh98kgm12i8frsfl25x1";
    this.logger = logger;
    this.interval = intervall;
    this.tag = "_rmc_opta_soccer_";
    if (fs.lstatSync(path).isDirectory()) {
      const files = fs.readdirSync(path);
      files.forEach(function(file) {
        console.log(file);
        this.Live(JSON.parse(fs.readFileSync(path + "/" + file)));
      }, this);
    } else if (fs.lstatSync(path).isFile()) {
      this.Live(JSON.parse(fs.readFileSync(path)));
    }
  }

  Live(match) {
    let matchTmp = _.cloneDeep(match);
    delete matchTmp.liveData.goal;
    delete matchTmp.liveData.substitute;
    delete matchTmp.liveData.card;
    delete matchTmp.liveData.matchDetails.matchLengthMin;
    matchTmp.liveData.matchDetails.matchTime = 0;
    let i = 0;
    const int = setInterval(
      () => {
        if(matchTmp.liveData.matchDetails.matchTime < 45) {
          matchTmp.liveData.matchDetails.periodId = 1
        } else if (matchTmp.liveData.matchDetails.matchTime > 45) {
          matchTmp.liveData.matchDetails.periodId = 2
        } else if (matchTmp.liveData.period[1] && matchTmp.liveData.matchDetails.matchTime == matchTmp.liveData.period[1].lengthMin + matchTmp.liveData.period[0].lengthMin ) {
          matchTmp.liveData.matchDetails.periodId = 2
        } else if (matchTmp.liveData.period[2] && matchTmp.liveData.matchDetails.matchTime == matchTmp.liveData.period[1].lengthMin + matchTmp.liveData.period[0].lengthMin + matchTmp.liveData.period[2].lengthMin )
        if (matchTmp.liveData.matchDetails.matchTime == 45 && i < 15) {
            i++;
            delete matchTmp.liveData.matchDetails.matchTime;
            console.log(i)
             this.emit("message", this.topic, JSON.stringify(matchTmp), metadata);
            matchTmp.liveData.matchDetails.matchTime = 45;
        } else {
          var metadata = {
            topic: this.topic,
            url: "TESTLIVE",
            size: matchTmp.length,
            tag: this.tag,
            content_type: "application/json;charset=UTF-8",
            type: "json",
            provider: "opta_puller"
          };
          const sport = "soccerdata";
          metadata.sport_id = sport;
          metadata.ressource = "match";
          matchTmp.liveData.matchDetails.matchTime++;
          if (match.liveData.goal) {
            match.liveData.goal.forEach((element, index, object) => {
              if (matchTmp.liveData.matchTime == element.timeMin) {
                if (!matchTmp.liveData.goal) {
                  matchTmp.liveData.goal = [];
                }
                matchTmp.liveData.goal.push(element);
              }
            });
          }
          if (match.liveData.card) {
            match.liveData.card.forEach(element => {
              if (matchTmp.liveData.matchTime == element.timeMin) {
                if (!matchTmp.liveData.card) {
                  matchTmp.liveData.card = [];
                }
                matchTmp.liveData.card.push(element);
              }
            });
          }
          if (match.liveData.substitute) {
            match.liveData.substitute.forEach(element => {
              if (matchTmp.liveData.matchTime == element.timeMin) {
                if (!matchTmp.liveData.substitute) {
                  matchTmp.liveData.substitute = [];
                }
                matchTmp.liveData.substitute.push(element);
              }
            });
          }
          if (match.liveData.penaltyShot) {
            match.liveData.penaltyShot.forEach(element => {
              if (matchTmp.liveData.matchTime == element.timeMin) {
                if (!matchTmp.liveData.penaltyShot) {
                  matchTmp.liveData.penaltyShot = [];
                }
                matchTmp.liveData.penaltyShot.push(element);
              }
            });
          }

          if (
            matchTmp.liveData.matchDetails.matchTime ==
            match.liveData.matchDetails.matchLengthMin
          ) {
            clearInterval(int);
          }
          // console.log(matchTmp.liveData.matchDetails.matchTime);
          // console.log(match.liveData.matchDetails.matchLengthMin);
          this.logger.info("Read from TEST LIVE", matchTmp.length);
          this.emit("message", this.topic, JSON.stringify(match), metadata);
        }
      },
      60000 * this.interval,
      this
    );
  }

}
