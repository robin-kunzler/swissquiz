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
      ar: null,
      score: null
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
    this.state.ar = null;
    this.state.nrQuestion++;
    console.log('qa object: ', qa);
    this.setState({ ...this.state, qa: qa });
    this.setState({ ...this.state, step: 'question' });
  }

  async checkAnswer(a) {
    const ar = await swissquiz.answer_question(this.state.gameId, this.state.qa[a].answer_id);
    console.log('ar object: ', ar);
    console.log('ar stringify: ', JSON.stringify(ar));
    this.setState({ ...this.state, ar: ar });
  }

  async getScore() {
    const score = await swissquiz.get_result(this.state.gameId);
    console.log('score object: ', score);
    console.log('score stringify: ', JSON.stringify(score));
    this.state.score = score;
    this.setState({ ...this.state, step: 'score' });
  }

  async restart() {
    this.state.username = '';
    this.state.gameId = null;
    this.state.nrQuestion = 0;
    this.state.qa = null;
    this.state.ar = null;
    this.state.score = null;
    this.setState({ ...this.state, step: 'login' });
  }

  render() {
    let status = <Status game={this} />;
    let login = "";
    let qa = "";
    let score = "";

    switch(this.state.step) {
      case "login":
        login = <Login game={this} />;
        break;
      case "question":
        qa = <QA qa={this.state.qa} ar={this.state.ar} game={this} />;
        break;
      case "score":
        score = <Score score={this.state.score} game={this} />
    }

    return (
      <div id="main">
        <div id="title">Welcome to SwissQuiz 🇨🇭</div>
        {status}
        {login}
        {qa}
        {score}
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
        msg = 'See how you compare to others...';
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
            <a href="#" class="button" onClick={() => this.props.game.startGame(this.state.username)}>Start Game!</a>
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

  callCheck() {
    if (this.state.selected != '') {
      console.log('selected in QA: ', this.state.selected);
      this.props.game.checkAnswer(this.state.selected); 
    } else {
      alert('You did not select an answer.');
    }
  }

  callNextQuestion() {
    this.state.selected = '';
    this.state.correctAnswer = '';
    this.props.game.getQuestion();
  }

  render() {
    const answers = ['answer_A', 'answer_B', 'answer_C', 'answer_D'];
    let haveNextQuestion = true;

    if (this.props.ar == null) {
      this.state.mode = 'choose';
    } else {
      this.state.mode = 'answered';
      this.state.correctAnswer = this.props.ar.correct_answer_text;
      haveNextQuestion = !this.props.ar.game_ended;
    }
    const inChooseMode = (this.state.mode == 'choose');

    let answerClasses = [];
    for (var a of answers) {
      answerClasses[a] = 'answer';
      if (inChooseMode) {
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

    const renderButton = () => {
      if (inChooseMode) {
        return <a href="#" class="button" onClick={() => this.callCheck()}>Check</a>
      } else if(haveNextQuestion) {
        return <a href="#" class="button" onClick={() => this.callNextQuestion()}>Next Question</a>
      } else {
        return <a href="#" class="button" onClick={() => this.props.game.getScore()}>See Score</a>
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
          {renderButton()}
      </div>
    );
  }
}

class Score extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var score = this.props.score.high_score
      .sort(function(a,b) {return b.num_correct_answers - a.num_correct_answers})
      .map(function(p) {return p.num_correct_answers + ' of 10: ' + p.player_name})
      .map(function(s){ return <p>{s}</p>; });
    return(
      <div id="score" class="content">
        {score}
        <br/><br/><br/>
        <a href="#" class="button" onClick={() => this.props.game.restart()}>Restart Game</a>
      </div>
    );
  }
}


document.title = "Play SwissQuiz";

render(<SwissQuiz />, document.getElementById('app'));