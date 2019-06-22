import React from 'react';
import './Game.css';


function Key(props) {
    return (
        <div className={"key " + (props.highlighted ? 'activeKey' : '') } >
            {props.value}
        </div>
    );
}

class Keyboard extends React.Component {
    renderKey(i) {
        return (
            <Key value={i} highlighted={this.props.activeString.includes(i)}></Key> //this.props.currentKey === i            
        )
    }

    render() {
        return (
            <div className="keyboard">
                <div className="row-1">
                    {this.renderKey('1')}{this.renderKey('2')}{this.renderKey('3')}{this.renderKey('4')}{this.renderKey('5')}{this.renderKey('6')}{this.renderKey('7')}{this.renderKey('8')}{this.renderKey('9')}
                    {this.renderKey('0')}{this.renderKey('-')}{this.renderKey('=')}   
                </div>
                <div className="row-2">
                    {this.renderKey('Q')}{this.renderKey('W')}{this.renderKey('E')}{this.renderKey('R')}{this.renderKey('T')}{this.renderKey('Y')}{this.renderKey('U')}{this.renderKey('I')}{this.renderKey('O')}{this.renderKey('P')}
                    {this.renderKey('[')}{this.renderKey(']')}
                </div>
                <div className="row-3">
                    {this.renderKey('A')}{this.renderKey('S')}{this.renderKey('D')}{this.renderKey('F')}{this.renderKey('G')}{this.renderKey('H')}{this.renderKey('J')}{this.renderKey('K')}{this.renderKey('L')}
                    {this.renderKey(';')}{this.renderKey("'")}                    
                </div>
                <div className="row-4">
                    {this.renderKey('Z')}{this.renderKey('X')}{this.renderKey('C')}{this.renderKey('V')}{this.renderKey('B')}{this.renderKey('N')}{this.renderKey('M')}
                    {this.renderKey(',')}{this.renderKey('.')}{this.renderKey('/')}
                </div>
            </div>
        );
    }
}

class Config extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {

        return (
            <div>Config options</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {            
            time: 3,
            keysPressed: 0,
            activeKeys: Array(0),
            frequency: 2,
            duration: 5,
            timeSinceLastSpawn: 0,
        };
    }



    tick() {
        var tsls = this.state.timeSinceLastSpawn;
        var freq = this.state.frequency;

        if (tsls >= freq) {
            tsls = 0;
            this.addActiveKey();
        } else {
            tsls += 0.1;
        }        

        this.setState({
            timeSinceLastSpawn: tsls,
        });

        //console.log('tick');
    }

    addActiveKey() {
        
        var nextKey = {
            key: this.getNewKey(),
            time: this.state.time,
        };     

        var activeKeys = this.state.activeKeys.concat(nextKey);

        this.setState({
            activeKeys:  activeKeys,
        });

        console.log("Key Added - " + nextKey.key + " - Active - " + this.getActiveString() + nextKey.key);
    }

    getNewKey(oldKey) {
        let k = Math.random().toString(36).slice(2,3).toUpperCase();

        return k;
    }

    getActiveString() {
        var str = "";

        this.state.activeKeys.forEach(function(element) { 
            str = str + element.key;
        });

        return str;
    }

    componentWillMount() {
        document.addEventListener("keydown", this.onKeyPressed.bind(this));
        this.intervalHandle = setInterval(this.tick,100);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyPressed.bind(this));
        clearInterval(this.interval);
    }      

    onKeyPressed(e) {
    if (e) {
        if (this.getActiveString().includes(e.key.toUpperCase()))  //e.key.toUpperCase() === this.state.currentKey.toUpperCase()) {
            
            console.log("Correct Press! - " + e.key.toUpperCase());


            var nextKey = {
                key: this.getNewKey(),
                time: this.state.time,
            };        

            console.log("Next Key ~ " + nextKey.key);

            var activeKeys = this.state.activeKeys.filter(key => e.key.toUpperCase() !== key.key.toUpperCase());
            activeKeys = activeKeys.concat(nextKey);

            var keysPressed = this.state.keysPressed + 1;

            this.setState({
                activeKeys:  activeKeys,
                keysPressed: keysPressed,
            });
    
            console.log(this.state);
        } else if (e !== undefined) {
            console.log("You missed it~ dummy");
        }
    }        


    render() {    
        let status;
        status = 'Current Key String is : ' + this.getActiveString();

        return (
            <div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.addActiveKey()}>Add Key</button>                    
                </div> 
                <br/>
                <Config frequency={this.state.frequency} duration={this.state.duration}></Config>
            <div className="game" onKeyDown={this.onKeyPressed()} tabIndex="0">          
                
                <br/>
                <div>
                    <Keyboard activeKeys={this.state.activeKeys} activeString={this.getActiveString()} />                    
                </div>
            </div>
            
        </div>
        
        );
    }
}

  
  
export default Game;