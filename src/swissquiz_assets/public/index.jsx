import swissquiz from 'ic:canisters/swissquiz';
import * as React from 'react';
import { render } from 'react-dom';

import './styles.css';

class SwissQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'Username',     // to be provided by the user
      gameId: null,          // value received by canister
      nrQuestion: 0,            // count of questions
      step: 'login',            // 'login' | 'question' | 'score'
      qa: null,
      error: false,
      errorMessage: ''
    };
  }

  getGameId() {
    if (this.state.gameId == null) {
      return 0;
    } else {
      return this.state.gameId.id.toNumber();
    }
  }

  async startGame(username) {
    const startGame = await swissquiz.start_game(username);
    this.state.gameId = startGame;
    this.state.username = username;
    await this.getQuestion();
  }

  async getQuestion() {
    const qa = await swissquiz.current_question(this.state.gameId);
    this.setState({ ...this.state, qa: qa });
    this.setState({ ...this.state, nrQuestion: (this.state.nrQuestion + 1) });
    this.setState({ ...this.state, step: 'question' });
  }

  render() {
    let status = <Status game={this} />;
    let login = "";
    let qa = "";

    switch(this.state.step) {
      case "login":
        login = <Login game={this} />;
        break;
      case "question":
        qa = <QA qa={this.state.qa} />;
        break;
    }

    return (
      <div id="main">
        <div id="title">Welcome to SwissQuiz 🇨🇭</div>
        {status}
        {login}
        {qa}
        <div id="score" class="content">Score comes here</div>
        <div id="error" class="content">Error / Status: gameId={this.getGameId()}</div>
    </div>
    );
  }
}


class Status extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let msg='';
    switch(this.props.game.state.step) {
      case "login":
        msg = 'Provide your name and start playing...';
        break;
      case "question":
        msg = 'Question ' + this.props.game.state.nrQuestion + ' of 10.';
        break;
      case "score":
        msg = 'The score is...';
        break;    
      }
    return (
      <div id="status" class="content">{msg}</div>
    );
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
  }

  onUsernameChange(ev) {
    this.setState({ ...this.state, username: ev.target.value });
  }

  render() {
    return (
      <div id="login" class="content">
            <input
              id="username" 
              value={this.state.username}
              onChange={ev => this.onUsernameChange(ev)}
            ></input>
            <a class="button" onClick={() => this.props.game.startGame(this.state.username)}>Start Game!</a>
        </div>
    );
  }
}


class QA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'choose',     // 'choose' | 'answered'
      selected: '',       // '' | 'answer_A' | 'answer_B' | 'answer_C' | 'answer_D'
      correctAnswer: '',  // '' | 'answer_A' | 'answer_B' | 'answer_C' | 'answer_D'
    };
  }

  selectAnswer(a) {
    if (this.state.mode == 'choose') {
      this.setState({ ...this.state, selected: a });
    }
  }

  render() {
    const answers = ['answer_A', 'answer_B', 'answer_C', 'answer_D'];
    let answerClasses = [];
    for (var a of answers) {
      answerClasses[a] = 'answer';
      if (this.state.mode == 'choose') {
        if (this.state.selected == a) { 
          answerClasses[a] += ' selected';
        } else {
          answerClasses[a] += ' selectable';
        }
      } else {
        if (this.state.correctAnswer == a) { 
          answerClasses[a] += ' correct';
        } else if (this.state.selected == a) {
          answerClasses[a] += ' wrong';
        }
      }
    }
    return(
        <div id="qa" class="content">
          <div id="question">{this.props.qa.question_text}</div>
          <a href="#" id="answerA" class={answerClasses['answer_A']} onClick={() => this.selectAnswer('answer_A')}>
              <span class="answerid">A</span>
              {this.props.qa.answer_A.answer_text}
          </a>
          <a href="#" id="answerB" class={answerClasses['answer_B']} onClick={() => this.selectAnswer('answer_B')}>
              <span class="answerid">B</span>
              {this.props.qa.answer_B.answer_text}
          </a>
          <a href="#" id="answerC" class={answerClasses['answer_C']} onClick={() => this.selectAnswer('answer_C')}>
              <span class="answerid">C</span>
              {this.props.qa.answer_C.answer_text}
          </a>
          <a href="#" id="answerD" class={answerClasses['answer_D']} onClick={() => this.selectAnswer('answer_D')}>
              <span class="answerid">D</span> 
              {this.props.qa.answer_D.answer_text}
          </a>
          <br/><br/><br/>
          <a href="#" class="button">Check</a>
          <a href="#" class="button">Next Question</a>
      </div>
    );
  }
}

class Answer extends React.Component {

}


document.title = "Play SwissQuiz";

render(<SwissQuiz />, document.getElementById('app'));