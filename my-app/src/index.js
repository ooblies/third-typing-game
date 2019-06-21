import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class TimerInput extends React.Component {
    render() {
        return (
            <div>
                <h3>Input your time</h3>
                <input type="number" required />
            </div>
        );
    }
}

class Timer extends React.Component {
    render() {
        return (
            <div>
                <h1> </h1>
            </div>
        );
    }
}

class StartButton extends React.Component {
    render() { 
        return (
            <div>
                <button>Start</button>
            </div>
        );
    }
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds:'00',
            minutes: '',
        }
    }
    

    render() { 
        return (
            <div>
                <TimerInput minutes={this.state.minutes}/>
                <Timer minutes={this.state.minutes} seconds={this.state.seconds}/>
                <StartButton/>
            </div>
        );
    }
}

function Key(props) {
    return (
        <div className={"key " + (props.highlighted ? 'currentKey' : '') } >
            {props.value}
        </div>
    );
}

class Keyboard extends React.Component {
    constructor(props) {
        super(props);
    }

    renderKey(i) {
        return (
            <Key value={i} highlighted={this.props.currentKey === i}></Key>
            
        )
    }

    render() {
        return (
            <div className="keyboard">
                <div className="row-1">
                    {this.renderKey('1')}
                    {this.renderKey('2')}
                    {this.renderKey('3')}
                    {this.renderKey('4')}
                    {this.renderKey('5')}
                    {this.renderKey('6')}
                    {this.renderKey('7')}
                    {this.renderKey('8')}
                    {this.renderKey('9')}
                    {this.renderKey('0')}  
                    {this.renderKey('-')}
                    {this.renderKey('=')}   
                </div>
                <div className="row-2">
                    {this.renderKey('Q')}
                    {this.renderKey('W')}
                    {this.renderKey('E')}
                    {this.renderKey('R')}
                    {this.renderKey('T')}
                    {this.renderKey('Y')}
                    {this.renderKey('U')}
                    {this.renderKey('I')}
                    {this.renderKey('O')}
                    {this.renderKey('P')}   
                    {this.renderKey('[')}
                    {this.renderKey(']')}                    
                </div>
                <div className="row-3">
                    {this.renderKey('A')}
                    {this.renderKey('S')}
                    {this.renderKey('D')}
                    {this.renderKey('F')}
                    {this.renderKey('G')}
                    {this.renderKey('H')}
                    {this.renderKey('J')}
                    {this.renderKey('K')}
                    {this.renderKey('L')}
                    {this.renderKey(';')}
                    {this.renderKey("'")}                    
                </div>
                <div className="row-4">
                    {this.renderKey('Z')}
                    {this.renderKey('X')}
                    {this.renderKey('C')}
                    {this.renderKey('V')}
                    {this.renderKey('B')}
                    {this.renderKey('N')}
                    {this.renderKey('M')}
                    {this.renderKey(',')}
                    {this.renderKey('.')}
                    {this.renderKey('/')}
                </div>
            </div>
        );
    }
}



  
  class Game extends React.Component {
      constructor(props) {
          super(props);
          this.state = {            
              config: {
                time:2,
              },
              currentKey:'Q',
          };
      }

    newKey() {
        let r = Math.random().toString(36).slice(2,3).toUpperCase();

        this.setState({
            currentKey: r,
        });        
    }

    componentWillMount() {
        document.addEventListener("keydown", this.onKeyPressed.bind(this));
    }
  
    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyPressed.bind(this));
    }      
  
    onKeyPressed(e) {
        if (e) {
            if (e.key.toUpperCase() == this.state.currentKey.toUpperCase()) {
                this.newKey();
                console.log("Correct Press! - " + e.key.toUpperCase());
            } else {
                console.log("Incorrect Press! " + e.key.toUpperCase() + " vs. " + this.state.currentKey.toUpperCase());
            }
        }        
    }

    render() {    
        let status;
        status = 'Current Key is : ' + this.state.currentKey;

      return (
        <div className="game" onKeyDown={this.onKeyPressed()} tabIndex="0">
          <div className="game-board">
            <Keyboard currentKey={this.state.currentKey} />
            <br/>
            <button onClick={() => this.newKey()}>Next button~</button>
          </div>
          <div className="game-info">
            <div>{status}</div>
          </div> 
        </div>
        
      );
    }
  }


  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );