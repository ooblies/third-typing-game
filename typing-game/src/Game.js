import React from 'react';
import './Game.css';


class TimerInput extends React.Component {
    render() {
        return (
            <div>
                <h3>Input your time</h3>
                <input type="number"  minutes={this.props.minutes} handleChange={this.props.handleChange} required />
            </div>
        );
    }
}

class Timer extends React.Component {
    render() {
        return (
            <div>
                <h1>{this.props.minutes}:{this.props.seconds}</h1>
            </div>
        );
    }
}

class StartButton extends React.Component {
    render() { 
        return (
            <div>
                <button onClick={this.props.startCountDown}>Start</button>
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
        this.startCountDown = this.startCountDown.bind(this);
        this.tick = this.tick.bind(this);        
        this.handleChange = this.handleChange.bind(this);
        
    }

    handleChange(event) {
        this.setState({
            minutes: event.target.value
        })
    }

    tick() {
        var min = Math.floor(this.secondsRemaining / 60);
        var sec = this.secondsRemaining - (min * 60);

        this.setState({
            minutes: min,
            seconds: sec
        });

        if (sec < 10) {
            this.setState({ 
                seconds: "0" + this.state.seconds,
            })
        }

        this.secondsRemaining--;
    }

    startCountDown() {
        this.intervalHandle = setInterval(this.tick,1000);
        let time = this.state.minutes;
        this.secondsRemaining = time* 60;
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
            time: 3,
            currentKey: 'Q',
            keyHistory: Array(0),
        };
    }

    getNewKey() {
        let k = Math.random().toString(36).slice(2,3).toUpperCase();

        var ktp = {
            key:k,
            time: this.state.time,
        };        

        console.log(this.state.keyHistory);

        this.setState({
            keyHistory:  this.state.keyHistory.concat(ktp),
        });

        console.log(this.state.keyHistory);
  
    }

    componentWillMount() {
        document.addEventListener("keydown", this.onKeyPressed.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyPressed.bind(this));
    }      

    onKeyPressed(e) {
        if (e) {
            if (e.key.toUpperCase() === this.state.currentKey.toUpperCase()) {
                this.getNewKey();
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
            <div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.newKey()}>Next button~</button>                    
                </div> 
                <br/>
            <div className="game" onKeyDown={this.onKeyPressed()} tabIndex="0">          
                
                <br/>
                <div>
                    <Keyboard currentKey={this.state.currentKey} />                    
                </div>
            </div>
            
        </div>
        
        );
    }
}

  
  
export default Game;