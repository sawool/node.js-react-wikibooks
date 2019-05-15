import React, { Component } from "react";
import ReactDOM from "react-dom";
import styles from "./styles.js";

// Socket.IO로 웹 소켓 서버에 접속하기
import socketio from "socket.io-client";
const socket = socketio.connect("http://localhost:3001");

// 입력 양식 컴포넌트
class ChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "", message: "" };
  }
  nameChanged = e => {
    this.setState({
      name: e.target.value
    });
  };
  messageChanged = e => {
    this.setState({
      message: e.target.value
    });
  };
  // 서버에 이름과 메시지 전송
  send = () => {
    socket.emit("chat-msg", {
      name: this.state.name,
      message: this.state.message
    });
    this.setState({ message: "" });
  };
  render() {
    const { name, message } = this.state;
    return (
      <div style={styles.form}>
        이름:
        <br />
        <input value={name} onChange={this.nameChanged} />
        <br />
        메시지:
        <br />
        <input value={message} onChange={this.messageChanged} />
        <br />
        <button onClick={this.send}>전송</button>
      </div>
    );
  }
}

// 채팅 애플리케이션의 메인 컴포넌트를 정의
class ChatApp extends Component {
  constructor(props) {
    super(props);
    this.state = { logs: [] };
  }
  // 컴포넌트가 마운트됐을때
  componentDidMount() {
    // 실시간으로 로그를 받게 수정
    socket.on("chat-msg", obj => {
      const logs2 = this.state.logs;      
      obj.key = "key_" + (this.state.logs.length + 1);      
      logs2.unshift(obj);      
      this.setState({ logs: logs2 });
    });
  }
  render() {
    // 로그를 사용해 HTML 요소 생성
    const { logs } = this.state;
    const messages = logs.map(log => {
      return (
        <div key={log.key} style={styles.log}>
          <span style={styles.name}>{log.name}</span>
          <span style={styles.msg}>: {log.message}</span>
          <p style={{ clear: "both" }} />
        </div>
      );
    });
    return (
      <div>
        <h1 style={styles.h1}>실시간 채팅</h1>
        <ChatForm />
        <div>{messages}</div>
      </div>
    );
  }
}

ReactDOM.render(<ChatApp />, document.getElementById("root"));
