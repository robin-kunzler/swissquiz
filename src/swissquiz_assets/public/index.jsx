import swissquiz from 'ic:canisters/swissquiz';
import * as React from 'react';
import { render } from 'react-dom';

import './styles.css';

class SwissQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'Username',     // to be provided by the user
      gameIdRaw: null,          // value received by canister
      gameId: 0,                // returned from IC
      step: 'login',            // 'login' | 'question' | 'score'
      qa: {
        question: '',
        answers: {
          A: '',
          B: '',
          C: '',
          D: ''
        },
        selectedAnswer: '',
        correctAnswer: ''
      },
      error: false,
      errorMessage: ''
    };
  }

  async startGame() {
    const startGame = await swissquiz.start_game(this.state.username);
    console.log('GameId object: ', startGame);
    console.log('toNumber', startGame.id.toNumber());
    console.log('strigified: ', JSON.stringify(startGame));
    this.setState({ ...this.state, gameIdRaw: startGame });
    this.setState({ ...this.state, gameId: startGame.id.toNumber() });
    this.setState({ ...this.state, step: 'question' });
    const currentQuestion = await swissquiz.current_question(startGame);
    console.log('Question object: ', currentQuestion);
  }

  onUsernameChange(ev) {
    this.setState({ ...this.state, username: ev.target.value });
  }

  render() {
    let qa;
    if (this.state.step == "question") {
      qa = <QA />;
    } else {
      qa = "";
    }
    return (
      <div id="main">
        <div id="title">Welcome to SwissQuiz 🇨🇭</div>
        <div id="status" class="content">Provide your name and start playing...</div>
        <div id="login" class="content">
            <input
              id="username" 
              value={this.state.username}
              onChange={ev => this.onUsernameChange(ev)}
            ></input>
            <a class="button" onClick={() => this.startGame()}>Start Game</a>
        </div>
        <div id="qa" class="content">
            <div id="question">Who is "Globi"?</div>
            <a href="#" id="answerA" class="answer">
                <span class="answerid">A</span>
                A Federal Council member
            </a>
            <a href="#" id="answerB" class="answer selected">
                <span class="answerid">B</span>
                A nickname for a global leader
            </a>
            <a href="#" id="answerC" class="answer correct">
                <span class="answerid">C</span>
                A Swiss cartoon character
            </a>
            <a href="#" id="answerD" class="answer wrong">
                <span class="answerid">D</span> 
                The Swiss version of santa
            </a>
            <br/><br/><br/>
            <a href="#" class="button">Check</a>
            <a href="#" class="button">Next Question</a>
        </div>
        <div id="score" class="content">Score comes here</div>
        <div id="error" class="content">Error / Status: gameId={this.state.gameId}</div>
    </div>
    );
  }
}

class QA extends React.Component {
  render() {
    return (
      <div><span style={{ "color": "blue" }}>Here comes the great question.</span></div>
    );
  }
}

document.title = "Play SwissQuiz";

render(<SwissQuiz />, document.getElementById('app'));