import React, { Component } from "react";
import Alert from "react-bootstrap/Alert";
import Config from "../scripts/config";
class Connection extends Component {
  state = { connected: false, ros: null };

  constructor() {
    super();
    this.init_connection();
  }

  init_connection() {
    this.state.ros = new window.ROSLIB.Ros();
    const EventEmitter2 = require('eventemitter2').EventEmitter2;
    const events = new EventEmitter2();
    console.log(this.state.ros);

    this.state.ros.on("connection", () => {
      console.log("connection established in Teleoperation Component!");
      console.log(this.state.ros);
      this.setState({ connected: true });
    });

    events.on('error', (error) => { console.log('got error event', error); });

    this.state.ros.on("close", () => {
      console.log("connection is closed!");
      this.setState({ connected: false });
      //try to reconnect every 3 seconds
      setTimeout(() => {
        events.on('error', (error) => { console.log('got error event', error); });
        try {
          this.state.ros.connect(
            "ws://" +
              Config.SERVER_IP +
              ":" +
              Config.SERVER_PORT +
              ""
          );
          events.emit('error', 'The error data');
        } catch (e) {
          console.log("connection problem ", e);
        }
      }, Config.RECONNECTION_TIMER);
    });

    events.on('error', (error) => { console.log('got error event', error); });
    try {
      this.state.ros.connect(
        "ws://" +
          Config.SERVER_IP +
          ":" +
          Config.SERVER_PORT +
          ""
      );
      events.emit('error', 'The error data');
    } catch (e) {
      console.log(
        "ws://" +
          Config.SERVER_IP +
          ":" +
          Config.SERVER_PORT +
          ""
      );
      console.log("connection problem ", e);
    }
  }

  render() {
    return (
      <div>
        <Alert
          className="text-center m-3"
          variant={this.state.connected ? "success" : "danger"}
        >
          {this.state.connected ? "Robot Connected" : "Robot Disconnected"}
        </Alert>
      </div>
    );
  }
}

export default Connection;