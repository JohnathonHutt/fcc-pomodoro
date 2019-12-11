//jshint esversion:6

import React from 'react';
import './App.css';

class Pom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      currSession: 25,
      isSessionInitialized: false
    };
    this.handleClick = this.handleClick.bind(this);
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
      case "start-pause":
        this.setState({
          isSessionInitialized: !this.state.isSessionInitialized
        });
        break;
      case "reset":
        this.setState({
          currSession: this.state.sessionLength,
          isSessionInitialized: false
        });
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
          <Timer isSessionInitialized={this.state.isSessionInitialized} currSession={this.state.currSession} handleClick={this.handleClick} />
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
      <div id="time-left" className="display">{props.currSession}</div>
      <div>
        <button id="start-pause" onClick={props.handleClick}>{(props.isSessionInitialized) ? "pause" : "start"}</button>
        <button id="reset" onClick={props.handleClick}>reset</button>
      </div>
    </div>
  )
}

export default Pom;
