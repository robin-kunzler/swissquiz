import swissquiz from 'ic:canisters/swissquiz';
import * as React from 'react';
import { render } from 'react-dom';

class SwissQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Name',
      message: '',
      username: 'Username',
      gameId: 0,
    };
  }

  async doGreet() {
    const greeting = await swissquiz.greet(this.state.name);
    this.setState({ ...this.state, message: greeting });
  }

  async doStartGame() {
    const startGame = await swissquiz.start_game(this.state.username);
    console.log('object: ', startGame);
    console.log('toNumber', startGame.id.toNumber());
    console.log('strigified: ', JSON.stringify(startGame));
    this.setState({ ...this.state, gameId: startGame.id.toNumber() });
  }

  onNameChange(ev) {
    this.setState({ ...this.state, name: ev.target.value });
  }

  onUsernameChange(ev) {
    this.setState({ ...this.state, username: ev.target.value });
  }

  render() {
    return (
      <div style={{ "font-size": "30px" }}>
        <div style={{ "background-color": "yellow" }}>
          <p>SwissQuiz</p>
        </div>
        <div style={{ "margin": "30px" }}>
          <input id="name" value={this.state.name} onChange={ev => this.onNameChange(ev)}></input>
          <button onClick={() => this.doGreet()}>Say Hello</button>
        </div>
        <div>Greeting is: "<span style={{ "color": "blue" }}>{this.state.message}</span>"</div>
        <div style={{ "margin": "30px" }}>
          <input id="username" value={this.state.username} onChange={ev => this.onUsernameChange(ev)}></input>
          <button onClick={() => this.doStartGame()}>Start Game</button>
        </div>
        <div>GameId is "<span style={{ "color": "blue" }}>{this.state.gameId}</span>"</div>
      </div>
    );
  }
}

render(<SwissQuiz />, document.getElementById('app'));