import React from 'react';
import './Game.css';
var queryString = require('querystring');

class Key extends React.Component {
    render() {
        return (
            <div className={"key " + (this.props.highlighted ? 'activeKey' : '') + (this.props.error ? 'errorKey' : '')} >
                {this.props.showKeys ? this.props.value : ""}
            </div>
        );
    }    
}

class Keyboard extends React.Component {
    renderKey(i) {
        return (
            <Key value={i} highlighted={this.props.activeString.includes(i)} showKeys={this.props.showKeys} error={this.props.errorKeys.includes(i)}></Key>     
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

        console.log(this.state.config);
    }

    updateConfig() {        
        this.props.updateConfig(this.state.config);
    }
    updateFrequency(e) {
        var config  = this.state.config;
        config.frequency = Number(e.target.value);
        
        this.setState({
            config: config,
        });
        
        this.updateConfig();
    }
    updateDuration(e) {
        var config  = this.state.config;
        config.duration = Number(e.target.value);
        
        this.setState({
            config: config,
        });
        
        this.updateConfig();
    }
    updateLives(e) {
        var config  = this.state.config;
        config.lives = Number(e.target.value);
        
        this.setState({
            config: config,
        });
        
        this.updateConfig();
    }
    updateShowKeys(e) {
        var config  = this.state.config;
        config.showKeys = !this.state.config.showKeys;
        
        this.setState({
            config: config,
        });
        
        this.updateConfig();
    }

    render() {

        return (
            <div>
                <div>Config options</div>
                <label>Frequency: {this.props.config.frequency}</label><br/><input type="range" min="0.1" max="5" step="0.1" value={this.state.config.frequency} onChange={(e) => {this.updateFrequency(e)}}></input>
                <br/><br/>
                <label>Duration: {this.props.config.duration}</label><br/><input type="range" min="0.1" max="5" step="0.1" value={this.state.config.duration} onChange={(e) => {this.updateDuration(e)}}></input>
                <br/><br/>
                <label>Lives: {this.props.config.lives}</label><br/><input type="range" min="1" max="10" step="1" value={this.state.config.lives} onChange={(e) => {this.updateLives(e)}}></input>
                <br/><br/>
                <label>Show Keys:</label> <input type="checkbox" checked={this.state.config.showKeys} onChange={(e) => {this.updateShowKeys(e)}}></input>
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
            errorKeys: Array(0),
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
            var errorKeys = [];
    
            akeys.forEach(function(key) {
                key.time -= 0.1;
                if (key.time <= 0) {
                    keysToRemove.push(key.key);
                    config.lives--;
                    errorKeys.push(key.key);                    
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

            errorKeys.forEach(function(key) {
                self.addErrorKey(key);
            })
            
            //game over
            if (this.state.config.lives <= 0) {
                this.setState({
                    isStarted: false,
                    activeKeys: [],
                });
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

    removeErrorKey(rkey) {
        var errorKeys = this.state.errorKeys.filter(key => rkey !== key);

        this.setState({
            errorKeys: errorKeys,
        });
    }

    addErrorKey(key) {
        var errorKeys = this.state.errorKeys;
        errorKeys.push(key);

        setTimeout(function() {
            this.removeErrorKey(key);
        }.bind(this),200);
                
        this.setState({
            errorKeys: errorKeys,
        });
    }

    onKeyPressed(e) {      
        if (this.state.isStarted) {  
            if (e) {
                var k = e.key.toUpperCase();
                if (this.getActiveString().includes(k))
                {                
                    this.removeKey(k)
        
                    this.setState({
                        keysPressed: this.state.keysPressed + 1,
                    });
                } else {
                    //Missed it
                    var config = this.state.config;
                    config.lives--;

                    this.addErrorKey(k);

                    this.setState({
                        config: config,
                    });

                    console.log("You missed it~ dummy. " + this.state.config.lives + " lives left...");
                } 
            } else if (e !== undefined) {
                console.log("uh oh");
            }
        }        
    }

    startGame() {
        this.resetGame();
        this.setState({
            isStarted: true,
        });
    }

    resetGame() {
        //alert("Game Over, Man. Your score was - " + this.state.keysPressed);
        this.setState({
            isStarted: false,
            activeKeys: [],
            keysPressed: 0,
            timeSinceLastSpawn: 0,
            keysMiseed: 0,
        });
    }

    componentDidMount() {  
        if (window.location.search.length > 0) {
            const parsed = queryString.parse(window.location.search.substring(1));
        
            var conf = JSON.parse(parsed.config);

            this.setState({
                config:conf,
                scoreToBeat:parsed.score,
            });
        }        
    }

    shareGame() {
        this.setState({
            shareURL: window.location.href.split('?')[0] + '?config=' + JSON.stringify(this.state.config) + '&score=' + this.state.keysPressed,
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
                <label>Score: {this.state.keysPressed}</label>
                <br/>
                <label>Score To Beat: {this.state.scoreToBeat}</label>
                <br/><br/>
                <Config updateConfig={this.updateConfig} config={this.state.config} ></Config>
                <button onClick={() => this.startGame()}>Start Game~</button>
                <div className="game" onKeyDown={this.onKeyPressed()} tabIndex="0">                          
                    <br/>
                    <div>
                        <Keyboard errorKeys={this.state.errorKeys} activeKeys={this.state.activeKeys} activeString={this.getActiveString()} showKeys={this.state.config.showKeys} />                    
                    </div>
                </div> 

                <button onClick={() => this.shareGame()}>Share</button>     
                <br/>
                <a href={this.state.shareURL}>{this.state.shareURL}</a>      
            </div>        
        );
    }
}

  
  
export default Game;