import React from 'react';
import './Game.css';


function Key(props) {
    return (
        <div className={"key " + (props.highlighted ? 'activeKey' : '') } >
            {props.showKeys ? props.value : ""}
        </div>
    );
}

class Keyboard extends React.Component {
    renderKey(i) {
        return (
            <Key value={i} highlighted={this.props.activeString.includes(i)} showKeys={this.props.showKeys}></Key>     
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
            config: props.config,
        };
    }

    updateConfig() {
        console.log(this.state.config);
        this.props.updateConfig(this.state.config);
    }

    render() {

        return (
            <div>
                <div>Config options</div>
                <label>Frequency: {this.props.config.frequency}</label><input type="range" min="0.1" max="10" step="0.1" value={this.state.config.frequency} onChange={(e) => this.updateConfig(e)}></input>
                <br/>
                <label>Duration: {this.props.config.duration}</label><input type="range" min="0.1" max="10" step="0.1" value={this.state.config.duration} onChange={(e) => {this.updateConfig(e)}}></input>
                <br/>
                <label>Lives: {this.props.config.lives}</label><input type="range" min="1" max="10" step="1" value={this.state.config.lives} onChange={(e) => {this.updateConfig(e)}}></input>
                <br/>
                <label>Show Keys:</label> <input type="checkbox" value={this.state.config.showKeys} onChange={(e) => {this.updateConfig(e)}}></input>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            keysPressed: 0,
            timeSinceLastSpawn: 0,
            keysMiseed: 0,
            activeKeys: Array(0),
            isStarted: false,
            config: {
                lives: 3,
                frequency: 2,
                duration: 5,
                showKeys: true,
            },
        };

        this.removeKey = this.removeKey.bind(this);
        this.updateConfig = this.updateConfig.bind(this);
    }

    updateConfig(config) {
        console.log(config);
        this.setState({
            config: config,
        });
    }

    tick() {
        if (this.state.isStarted) {
            var tsls = this.state.timeSinceLastSpawn ? this.state.timeSinceLastSpawn : 0;
            var freq = this.state.config.frequency;
    
            //at each freq. add a key
            if (tsls >= freq) {
                tsls = 0;
                this.addActiveKey();
            } else {
                tsls += 0.1;
            }              
            
            //loop through active -- life for each at 0
            var akeys = this.state.activeKeys;
            var config = this.state.config;
            var keysToRemove = [];
    
            akeys.forEach(function(key) {
                key.time -= 0.1;
                if (key.time <= 0) {
                    keysToRemove.push(key.key);
                    config.lives--;
                }
            });
    
            //update state
            this.setState({
                timeSinceLastSpawn: tsls,
                activeKeys: akeys,
                config: config,
            });    
    
            //remove missed active keys
            var self = this;
            keysToRemove.forEach(function(key) {
                self.removeKey(key);
            });
            
            //game over
            if (this.state.config.lives <= 0) {
                this.resetGame();
            }
        }           
    }

    addActiveKey() {
        
        var nextKey = {
            key: this.getNewKey(),
            time: this.state.config.duration,
        };     

        var activeKeys = this.state.activeKeys.concat(nextKey);

        this.setState({
            activeKeys:  activeKeys,
        });

        console.log("Key Added - " + nextKey.key + " - Active - " + this.getActiveString());
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
        this.intervalHandle = setInterval(this.tick.bind(this),100);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyPressed.bind(this));
        clearInterval(this.interval);
    }      

    removeKey(rkey) {
        var activeKeys = this.state.activeKeys.filter(key => rkey.toUpperCase() !== key.key.toUpperCase());

        this.setState({
            activeKeys: activeKeys,
        });
    }

    onKeyPressed(e) {
        if (e) {
            if (this.getActiveString().includes(e.key.toUpperCase()))
            {                
                this.removeKey(e.key)
    
                this.setState({
                    keysPressed: this.state.keysPressed + 1,
                });
            } else {
                //Missed it
                var config = this.state.config;
                config.lives--;

                this.setState({
                    config: config,
                });

                console.log("You missed it~ dummy. " + this.state.config.lives + " lives left...");
            } 
        } else if (e !== undefined) {
            console.log("uh oh");
        }
    }        

    startGame() {
        this.setState({
            isStarted: true,
        });
    }

    resetGame() {
        alert("Game Over, Man. Your score was - " + this.state.keysPressed);
        this.setState({
            isStarted: false,
            activeKeys: [],
            keysPressed: 0,
            timeSinceLastSpawn: 0,
            keysMiseed: 0,
        });
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
                <Config updateConfig={this.updateConfig} config={this.state.config} ></Config>
                <button onClick={() => this.startGame()}>Start Game~</button>
                <div className="game" onKeyDown={this.onKeyPressed()} tabIndex="0">          
                
                <br/>
                <div>
                    <Keyboard activeKeys={this.state.activeKeys} activeString={this.getActiveString()} showKeys={this.state.config.showKeys} />                    
                </div>
            </div>
            
        </div>
        
        );
    }
}

  
  
export default Game;