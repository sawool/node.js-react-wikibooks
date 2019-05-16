import React, { Component } from "react";
import request from "superagent";
import WikiParser from "./wiki_parser";
import styles from "./styles";

// 위키 메인 화면 컴포넌트
export default class WikiShow extends Component {
  constructor(props) {
    super(props);
    const { params } = this.props.match;
    this.state = {
      name: params.name,
      body: "",
      loaded: false
    };
  }
  // 위키 내용을 읽어 들임
  componentWillMount() {
    const wikiname = this.state.name;
    request.get(`/api/get/${wikiname}`).end((err, res) => {
      if (err) return;
      this.setState({
        body: res.body.data.body,
        loaded: true
      });
    });
  }
  // 화면 출력 처리
  render() {
    const { loaded, name, body } = this.state;
    if (!loaded) return <p>Loading</p>;
    const html = this.convertText(body);
    return (
      <div>
        <h1>{name}</h1>
        <div style={styles.show}>{html}</div>
        <p style={styles.right}>
          <a href={`/edit/${name}`}>->페이지 수정하기</a>
        </p>
      </div>
    );
  }
  // 위키 문법을 리액트 객체로 변환
  convertText = src => {
    // 위키 문법을 리액트 객체로 변환
    const nodes = WikiParser.parse(src);
    // 각 요소를 React 객체로 변환
    const lines = nodes.map((node, i) => {
      if (node.tag === "ul") {
        const lis = node.items.map((s, j) => {
          return <li key={`node${i}_${j}`}>{s}</li>;
        });
        return <ul key={`node${i}`}>{lis}</ul>;
      }
      if (node.tag === "a") {
        return (
          <div key={`node${i}`}>
            <a href={`/wiki/${node.label}`}>->{node.label}</a>
          </div>
        );
      }
      return React.createElement(node.tag, { key: "node" + i }, node.label);
    });
    return lines;
  };
}
