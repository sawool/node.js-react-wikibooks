import React from "react";
import ReactDOM from "react-dom";
import request from "superagent";

class BBSForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      body: ""
    };
  }
  // 텍스트박스의 값이 변경됐을 때
  nameChanged(e) {
    this.setState({
      name: e.target.value
    });
  }
  bodyChanged(e) {
    this.setState({
      body: e.target.value
    });
  }
  // 웹 서버에 글 작성하기
  post(e) {
    request
      .get("/api/write")
      .query({
        name: this.state.name,
        body: this.state.body
      })
      .end((err, data) => {
        if (err) {
          console.err(err);
        }
        this.setState({ body: "" });
        if (this.props.onPost) {
          this.props.onPost();
        }
      });
  }
  render() {
    const { name, body } = this.state;
    return (
      <div style={styles.form}>
        이름: <br />
        <input
          type="text"
          value={name}
          onChange={e => this.nameChanged(e)}
        />{" "}
        <br />
        본문: <br />
        <input
          type="text"
          value={body}
          onChange={e => this.bodyChanged(e)}
          onKeyDown={e => {
            e.key == "Enter" ? this.post() : "";
          }}
        />{" "}
        <br />
        <button onClick={e => this.post()}>전송</button>
      </div>
    );
  }
}

// 메인 컴포넌트를 정의
class BBSApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }
  // 컴포넌트가 마운트되기 전 로그를 읽음
  componentWillMount() {
    this.loadLogs();
  }
  // API 접근해서 게시글 목록을 가져옴
  loadLogs() {
    request.get("/api/getItems").end((err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      this.setState({ items: data.body.logs });
    });
  }
  render() {
    const { items } = this.state;
    // 게시판 글을 작성
    const itemsHtml = items.map(item => {
      return (
        <li key={item._id}>
          {item.name} - {item.body}
        </li>
      );
    });
    return (
      <div>
        <h1 style={styles.h1}>게시판</h1>
        <BBSForm onPost={e => this.loadLogs()} />
        <p style={styles.right}>
          <button onClick={e => this.loadLogs()}>다시 불러오기</button>
        </p>
        <ul>{itemsHtml}</ul>
      </div>
    );
  }
}

// 스타일 정의
const styles = {
  h1: {
    backgroundColor: "blue",
    color: "white",
    fontSize: 24,
    padding: 12
  },
  form: {
    padding: 12,
    border: "1px solid silver",
    backgroundColor: "#F0F0F0"
  },
  right: {
    textAlign: "right"
  }
};

ReactDOM.render(<BBSApp />, document.getElementById("root"));
