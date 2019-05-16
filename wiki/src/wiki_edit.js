import React, { Component } from "react";
import request from "superagent";
import { Redirect } from "react-router-dom";
import styles from "./styles";

// 편집화면 컴포넌트
export default class WikiEdit extends Component {
  // 컴포넌트 초기화
  constructor(props) {
    super(props);
    const { params } = this.props.match;
    const name = params.name;
    this.state = {
      name,
      body: "",
      loaded: false,
      jump: ""
    };
  }
  // 위키 내용 읽어 들이기
  componentWillMount() {
    const { name } = this.state;
    request.get(`/api/get/${name}`).end((err, res) => {
      if (err) return;
      this.setState({
        body: res.body.data.body,
        loaded: true
      });
    });
  }
  // 본문을 서버에 전송
  save = () => {
    const wikiname = this.state.name;
    request
      .post("/api/put/" + wikiname)
      .type("form")
      .send({
        name: wikiname,
        body: this.state.body
      })
      .end((err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        this.setState({ jump: "/wiki/" + wikiname });
      });
  };
  bodyChanged = e => {
    this.setState({ body: e.target.value });
  };
  // 편집 화면 출력
  render() {
    const { loaded, jump, name, body } = this.state;
    if (!loaded) {
      return <p>Loading</p>;
    }
    if (jump !== "") {
      // 메인화면으로 리다이렉트
      return <Redirect to={jump} />;
    }
    return (
      <div style={styles.edit}>
        <h1>
          <a href={`/wiki/${name}`}>{name}</a>
        </h1>
        <textarea
          rows={12}
          cols={60}
          onChange={this.bodyChanged}
          value={body}
        />
        <br />
        <button onClick={this.save}>저장</button>
      </div>
    );
  }
}
