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
      isSessionInitialized: false,
      paused: false,
      timer: null
    };
    this.handleClick = this.handleClick.bind(this);
    this.initializeTimer = this.initializeTimer.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.pauseAndUnpause = this.pauseAndUnpause.bind(this);
    this.resetState = this.resetState.bind(this);
    this.updateCurrLength = this.updateCurrLength.bind(this);
  }

  updateCurrLength() {
    if (!this.state.isSessionInitialized || this.state.paused) {
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

  initializeTimer() {
    //set based on currType
    console.log("Timer has been initialized");
    let intervalTime;
    if (!this.state.paused) {
      //for first play or session-break change - set time based on session/break length
      intervalTime = (this.state.currType === "session") ? this.state.sessionLength : this.state.breakLength;
    } else {
      //if paused
      this.setState({
        paused: false
      });
      //Set intervalTime to currLength in minutes
      let time = this.state.currLength.split(":");
      intervalTime = Number(time[0]) + Number(time[1] / 60);
    }

    let date = new Date();
    let startTime = new Date(date.getTime() + intervalTime*60000).getTime();
    //set interval
    this.setState({
      timer: setInterval(() => this.updateTime(startTime), 500)
    });
  }

  updateTime(startTime) {
    let currTime = new Date().getTime();
    let diff = (startTime - currTime) / 1000;
    this.setState({
      currLength: `${(Math.floor(diff/60) < 10) ? "0" + Math.floor(diff/60) : Math.floor(diff/60)}:${(Math.floor(diff%60) < 10) ? "0" + Math.floor(diff%60) : Math.floor(diff%60)}`
    });
    if (this.state.currLength === "00:00") {
      document.getElementById("beep").play(); //play audio element
      clearInterval(this.state.timer);
      this.setState({
        currType: (this.state.currType === "break") ? "session" : "break"
      });
      this.initializeTimer();
    }
  }

  pauseAndUnpause() {
    console.log("pauseAndUnpause has been activated");
    if (!this.state.paused) {
      //pause
      clearInterval(this.state.timer);
      this.setState({
        paused: true
      });
    } else {
      this.initializeTimer();
    }
  }

  resetState() {
    //used on reset click -- if reloading window doesn't pass fCC tests
    clearInterval(this.state.timer);
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      currLength: "25:00",
      currType: "session",
      isSessionInitialized: false,
      paused: false,
      timer: null
    });
  }

  handleClick(event) {
    console.log(event.target.id);
    switch (event.target.id) {
      case "break-increment":
        if (!this.state.isSessionInitialized || this.state.paused) {
          this.setState({
            breakLength: (this.state.breakLength === 60) ? 60 : this.state.breakLength += 1
          });
          this.updateCurrLength();
        }
        break;
      case "break-decrement":
        if (!this.state.isSessionInitialized || this.state.paused) {
          this.setState({
            breakLength: (this.state.breakLength === 0) ? 0 : this.state.breakLength -= 1
          });
          this.updateCurrLength();
        }
        break;
      case "session-increment":
        if (!this.state.isSessionInitialized || this.state.paused) {
          this.setState({
            sessionLength: (this.state.sessionLength === 60) ? 60 : this.state.sessionLength += 1
          });
          this.updateCurrLength();
        }
        break;
      case "session-decrement":
        if (!this.state.isSessionInitialized || this.state.paused) {
          this.setState({
            sessionLength: (this.state.sessionLength === 0) ? 0 : this.state.sessionLength -= 1
          });
          this.updateCurrLength();
        }
        break;
      case "start_stop":
        if (!this.state.isSessionInitialized) {
          this.setState({
            isSessionInitialized: true
          });
          this.initializeTimer();
        } else {
          this.pauseAndUnpause();
        }
        break;
      case "reset":
        // this.resetState();
        window.location.reload();
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
            <Timer currType={this.state.currType} paused={this.state.paused} isSessionInitialized={this.state.isSessionInitialized} currLength={this.state.currLength} handleClick={this.handleClick} />
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
        <button id="start_stop" className="play-button" onClick={props.handleClick}>{(!props.isSessionInitialized || props.paused) ? "start" : "pause"}</button>
        <button id="reset" onClick={props.handleClick}>reset</button>
        <audio id="beep" src="https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3" type="audio/mp3"></audio>
      </div>
    </div>
  )
}

export default Pom;
