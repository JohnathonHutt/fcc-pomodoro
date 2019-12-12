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
      accurateTime: null
    };
    this.handleClick = this.handleClick.bind(this);
    this.initializeTimer = this.initializeTimer.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.pauseAndUnpause = this.pauseAndUnpause.bind(this);
  }

  initializeTimer() {
    //set based on currType
    console.log("Timer has been initialized");
    let intervalTime;
    intervalTime = (this.state.currType === "session") ? this.state.sessionLength : this.state.breakLength;
    let date = new Date();
    let startTime = new Date(date.getTime() + intervalTime*60000).getTime();
    //set interval
    this.setState({
      accurateTime: setInterval(() => this.updateTime(startTime), 1000)
    });
  }

  updateTime(startTime) {
    let currTime = new Date().getTime();
    let diff = (startTime - currTime) / 1000;
    this.setState({
      currLength: `${Math.floor(diff/60)}:${(Math.floor(diff%60) < 10) ? "0" + Math.floor(diff%60) : Math.floor(diff%60)}`
    });
    if (this.state.currLength <= "0:00") {
      //make the beep happen
      this.setState({
        currType: "break"
      });
      this.initializeTimer();
    }
  }

  pauseAndUnpause() {
    console.log("pauseAndUnpause has been activated");
    if (!this.state.paused) {
      this.setState({
        paused: true
      });
      clearInterval(this.state.accurateTime);
    } else {
      //restart from remaining time
    }
  }

  handleClick(event) {
    console.log(event.target.id);
    switch (event.target.id) {
      case "break-increment":
        this.setState({
          breakLength: (this.state.breakLength === 60) ? 60 : this.state.breakLength += 1
        });
        break;
      case "break-decrement":
        this.setState({
          breakLength: (this.state.breakLength === 0) ? 0 : this.state.breakLength -= 1
        });
        break;
      case "session-increment":
        this.setState({
          sessionLength: (this.state.sessionLength === 60) ? 60 : this.state.sessionLength += 1
        });
        break;
      case "session-decrement":
        this.setState({
          sessionLength: (this.state.sessionLength === 0) ? 0 : this.state.sessionLength -= 1
        });
        break;
      case "session-decrement":
        this.setState({
          sessionLength: this.state.breakLength += 1
        });
        break;
      case "start_stop":
        //initialize on first play
        if (!this.state.isSessionInitialized) {
          this.setState({
            isSessionInitialized: true
          });
          this.initializeTimer();
        } else {
          //pause or unpause
          this.pauseAndUnpause();
        }
        break;
      case "reset":
        window.location.reload();
        // this.setState({
        //   currLength: this.state.sessionLength,
        //   isSessionInitialized: false
        // });
        break;
      default: console.log(event.target.id);
    }
  }

  render() {
    return (
      <div>
        <div>
          <Break breakLength={this.state.breakLength} handleClick={this.handleClick} />
          <Session sessionLength={this.state.sessionLength} handleClick={this.handleClick} />
          <Timer isSessionInitialized={this.state.isSessionInitialized} currLength={this.state.currLength} handleClick={this.handleClick} />
        </div>
      </div>
    );
  }
}

function Break(props) {
  return (
    <div className="unit-wrapper">
      <p id="break-label">Break Length</p>
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
      <p id="session-label">Session Length</p>
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
      <p id="timer-label">{(props.isSessionInitialized) ? "Session" : "Paused"}</p>
      <div id="time-left" className="display">{props.currLength}</div>
      <div>
        <button id="start_stop" onClick={props.handleClick}>{(props.isSessionInitialized) ? "pause" : "start"}</button>
        <button id="reset" onClick={props.handleClick}>reset</button>
      </div>
    </div>
  )
}

export default Pom;
