"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var fs = require("fs");

var _ = require("lodash");

var EventEmitter = require('events');

module.exports = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Live, _EventEmitter);

  var _super = _createSuper(Live);

  function Live(path, logger) {
    var _this;

    var intervall = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    _classCallCheck(this, Live);

    _this.logger = logger;
    _this.topic = "RAW_FILE_rmc_opta_soccer_api_performfeeds_com_soccerdata_testlive_7vzjbeh98kgm12i8frsfl25x1";
    _this.logger = logger;
    _this.interval = intervall;
    _this.tag = "_rmc_opta_soccer_";

    if (fs.lstatSync(path).isDirectory()) {
      var files = fs.readdirSync(path);
      files.forEach(function (file) {
        console.log(file);
        this.Start(JSON.parse(fs.readFileSync(path + "/" + file)));
      }, _assertThisInitialized(_this));
    } else if (fs.lstatSync(path).isFile()) {
      _this.Start(JSON.parse(fs.readFileSync(path)));
    }

    return _possibleConstructorReturn(_this);
  }

  _createClass(Live, [{
    key: "Start",
    value: function Start(match) {
      var _this2 = this;

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
          i++;
          delete matchTmp.liveData.matchDetails.matchTime;
          
          _this2.emit("message", _this2.topic, JSON.stringify(matchTmp), metadata);

          matchTmp.liveData.matchDetails.matchTime = 45;
        } else {
          var metadata = {
            topic: _this2.topic,
            url: "TESTLIVE",
            size: 90000,
            tag: _this2.tag,
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

          _this2.logger.info("Read from TEST LIVE", metadata);

          _this2.emit("message", _this2.topic, JSON.stringify(match), metadata);
        }
      }, 600 * this.interval, this);
    }
  }]);

  return Live;
}(EventEmitter);