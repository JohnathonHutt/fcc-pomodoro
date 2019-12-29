//jshint esversion:6

import React from 'react';
import './App.css';

class Pom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      currLength: "25:00",
      currType: "session",
      timer: null
    };
    this.handleClick = this.handleClick.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.resetState = this.resetState.bind(this);
    this.updateCurrLength = this.updateCurrLength.bind(this);
    this.setTimer = this.setTimer.bind(this);
    this.switchBetweenBreakAndSession = this.switchBetweenBreakAndSession.bind(this);
  }

  updateCurrLength() {
    if (!this.state.timer) {
      let sL;
      if (this.state.currType === "session") {
        sL = (this.state.sessionLength < 10) ? "0" + this.state.sessionLength + ":00" : this.state.sessionLength + ":00";
      } else { //if currType === "break"
        sL = (this.state.breakLength < 10) ? "0" + this.state.breakLength + ":00" : this.state.breakLength + ":00";
      }
      this.setState({
         currLength: sL
      });
    }
  }

  setTimer() {
    if (!this.state.timer) {
      this.setState({
        timer: setInterval(() => this.updateTime(), 1000)
      });
    }
  }

  updateTime() {
    if (this.state.currLength === "00:00") {
      this.switchBetweenBreakAndSession();
    } else {
      let currTime = this.state.currLength.split(":");
      console.log("currTime = " + currTime);
      if (currTime[1] === "00") {
        currTime[0] = Number(currTime[0]) - 1;
        if (Number(currTime[0]) < 10) {
          currTime[0] = "0" + currTime[0];
        }
        currTime[1] = "59";
      } else {
        currTime[1] = Number(currTime[1]) - 1;
        if (Number(currTime[1]) < 10) {
          currTime[1] = "0" + currTime[1];
        }
      }
      console.log("currTime = " + currTime);
      this.setState({
        currLength: currTime.join(":")
      });
      //check for end of session/break - play audio
      if (this.state.currLength === "00:00") {
        document.getElementById("beep").play(); //play audio
      }
    }
  }

  switchBetweenBreakAndSession() {
    //updateTime helper function - uses updateCurrLength
    let newType = (this.state.currType === "session") ? "break" : "session";
    let sL;
    if (newType === "session") {
      sL = (this.state.sessionLength < 10) ? "0" + this.state.sessionLength + ":00" : this.state.sessionLength + ":00";
    } else { //if currType === "break"
      sL = (this.state.breakLength < 10) ? "0" + this.state.breakLength + ":00" : this.state.breakLength + ":00";
    }
    console.log("sL: " + sL + "newType: " + newType);
    this.setState({
      currType: newType,
      currLength: sL
    });
  }

  resetState() {
    //used on reset click -- if reloading window doesn't pass fCC tests
    clearInterval(this.state.timer);
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      currLength: "25:00",
      currType: "session",
      timer: null
    });
    const beep = document.getElementById("beep"); //stop audio
    beep.pause();
    beep.currentTime = 0;
  }

  handleClick(event) {
    console.log(event.target.id);
    switch (event.target.id) {
      case "break-increment":
        if (!this.state.timer) {
          this.setState({
            breakLength: (this.state.breakLength === 60) ? 60 : this.state.breakLength += 1
          });
          if (this.state.currType === "break") {
            this.updateCurrLength();
          }
        }
        break;
      case "break-decrement":
        if (!this.state.timer) {
          this.setState({
            breakLength: (this.state.breakLength === 1) ? 1 : this.state.breakLength -= 1
          });
          if (this.state.currType === "break") {
            this.updateCurrLength();
          }
        }
        break;
      case "session-increment":
        if (!this.state.timer) {
          this.setState({
            sessionLength: (this.state.sessionLength === 60) ? 60 : this.state.sessionLength += 1
          });
          if (this.state.currType === "session") {
            this.updateCurrLength();
          }
        }
        break;
      case "session-decrement":
        if (!this.state.timer) {
          this.setState({
            sessionLength: (this.state.sessionLength === 1) ? 1 : this.state.sessionLength -= 1
          });
          if (this.state.currType === "session") {
            this.updateCurrLength();
          }
        }
        break;
      case "start_stop":
        if (!this.state.timer) {
          this.setTimer();
        } else {
          clearInterval(this.state.timer);
          this.setState({
            timer: null
          });
        }
        break;
      case "reset":
        this.resetState();
        break;
      default: console.log(event.target.id);
    }
  }

  render() {
    return (
      <div>
        <h1>Farnsworth's <span className="line-through">Death</span> Pomodoro Clock</h1>
        <h2>"It can do other things"</h2>
        <div className="trapezoid"></div>
        <div className="box">
          <div className="clock-border">
            <Break breakLength={this.state.breakLength} handleClick={this.handleClick} />
            <Session sessionLength={this.state.sessionLength} handleClick={this.handleClick} />
            <Timer currType={this.state.currType} timer={this.state.timer} isSessionInitialized={this.state.isSessionInitialized} currLength={this.state.currLength} handleClick={this.handleClick} />
          </div>
        </div>
        <div>
          <div className="pad-wrapper">
            <div className="pad"></div>
            <div className="pad right"></div>
          </div>
        </div>
      </div>
    );
  }
}

function Break(props) {
  return (
    <div className="unit-wrapper">
      <p id="break-label" className="label">Break Length</p>
      <div id="break-length" className="display">{props.breakLength}</div>
      <div>
        <button id="break-increment" onClick={props.handleClick}>+</button>
        <button id="break-decrement" onClick={props.handleClick}>-</button>
      </div>
    </div>
  )
}

function Session(props) {
  return (
    <div className="unit-wrapper">
      <p id="session-label" className="label">Session Length</p>
      <div id="session-length" className="display">{props.sessionLength}</div>
      <div>
        <button id="session-increment" onClick={props.handleClick}>+</button>
        <button id="session-decrement" onClick={props.handleClick}>-</button>
      </div>
    </div>
  )
}

function Timer(props) {
  return (
    <div className="unit-wrapper">
      <p id="timer-label" className="label">{(props.currType === "session") ? "Session" : "Break"}</p>
      <div id="time-left" className="display">{props.currLength}</div>
      <div>
        <button id="start_stop" className="play-button" onClick={props.handleClick}>{(!props.timer) ? "start" : "pause"}</button>
        <button id="reset" onClick={props.handleClick}>reset</button>
        <audio id="beep" src="https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3" type="audio/mp3"></audio>
      </div>
    </div>
  )
}

export default Pom;
