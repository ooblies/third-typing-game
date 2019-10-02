import React from 'react';
import './Game.css';
var queryString = require('querystring');


//Upper
var _upperLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var _upperSymbols = '!@#$%^&*()_+{}:"<>?';
var _allUpper = _upperLetters + _upperSymbols;

//Lower
var _numbers = "1234567890";
var _lowerSymbols = "-=[];',./";
var _lowerLetters = "abcdefghijklmnopqrstuvwxyz";
var _allLower = _numbers + _lowerSymbols + _lowerLetters;

class Key extends React.Component {
    render() {
        return (
            <div className={"key " + (this.props.highlighted ? ' activeKey' : '') 
                                   + (this.props.error ? ' errorKey' : '') 
                                   + (this.props.value === "SHIFT" ? ' shift':'') 
                                   + (this.props.disabled ? ' disabled' : '')
                                   + (this.props.highlightShift ? " shifted" : '') 
                                   + (this.props.pressed ? ' pressed' : '')} >
                {this.props.showKeys ? this.props.value : ""}
            </div>
        );
    }    
}

class Keyboard extends React.Component {
    renderKey(key,shift) {
        var config = this.props.config;

        var display = key;
        var shifted = false;    
        var disabled = false;                

        if (this.props.shift) {            
            display = shift;
            if (this.props.activeString.includes(key)) {
                shifted = true;
                display = key;
            }        
            if (this.props.activeString.includes(shift)) {
                shifted = false;
                display = shift;
            } 
        } else {    
            display = key;        
            if (this.props.activeString.includes(shift)) {
                display = shift;
                shifted = true;
            }    
            if (this.props.activeString.includes(key)) {
                display = key;
                shifted = false;
            }
        }

        if (!config.allowNumbers && _numbers.includes(key)) {            
            disabled = true;
            display =  this.props.activeString.includes(key) || this.props.activeString.includes(shift) ? display : "";
            if (this.props.shift && _upperSymbols.includes(shift)) {
                disabled = false;
                display = shift;
            }
        }

        if (!config.allowSymbols && (_lowerSymbols.includes(key) || (this.props.shift && _upperSymbols.includes(shift)))) {
            disabled = true;
            display = this.props.activeString.includes(key) || this.props.activeString.includes(shift) ? display : "";
        }

        if (!config.allowLowercase && !this.props.shift && _lowerLetters.includes(key)) {
            disabled = true;
            display = this.props.activeString.includes(key) || this.props.activeString.includes(shift) ? display : "";
        }
        if (!config.allowUppercase && this.props.shift && _upperLetters.includes(shift)) {
            disabled = true;
            display = this.props.activeString.includes(key) || this.props.activeString.includes(shift) ? display : "";
        }

        
        return (
            <Key value={display} shiftKey={shift} highlighted={this.props.activeString.includes(display)} showKeys={config.showKeys} error={this.props.errorKeys.includes(display)} highlightShift={shifted} disabled={disabled}></Key>     
        )
    }

    render() {
        if (!this.props.config.showKeyboard) {
            return null;
        }
        return (
            <div className="keyboard">
                <div className="row-1">
                    {this.renderKey('1','!')}{this.renderKey('2','@')}{this.renderKey('3','#')}{this.renderKey('4','$')}{this.renderKey('5','%')}{this.renderKey('6','^')}{this.renderKey('7','&')}{this.renderKey('8','*')}{this.renderKey('9','(')}
                    {this.renderKey('0',')')}{this.renderKey('-','_')}{this.renderKey('=','+')}   
                </div>
                <div className="row-2">
                    {this.renderKey('q','Q')}{this.renderKey('w','W')}{this.renderKey('e','E')}{this.renderKey('r','R')}{this.renderKey('t','T')}{this.renderKey('y','Y')}{this.renderKey('u','U')}{this.renderKey('i','I')}{this.renderKey('o','O')}{this.renderKey('p','P')}
                    {this.renderKey('[','{')}{this.renderKey(']','}')}
                </div>
                <div className="row-3">
                    {this.renderKey('a','A')}{this.renderKey('s','S')}{this.renderKey('d','D')}{this.renderKey('f','F')}{this.renderKey('g','G')}{this.renderKey('h','H')}{this.renderKey('j','J')}{this.renderKey('k','K')}{this.renderKey('l','L')}
                    {this.renderKey(';',':')}{this.renderKey("'",'"')}                    
                </div>
                <div className="row-4">
                    {this.renderKey('SHIFT','SHIFT')}
                    {this.renderKey('z','Z')}{this.renderKey('x','X')}{this.renderKey('c','C')}{this.renderKey('v','V')}{this.renderKey('b','B')}{this.renderKey('n','N')}{this.renderKey('m','M')}
                    {this.renderKey(',','<')}{this.renderKey('.','>')}{this.renderKey('/','?')}
                    {this.renderKey('SHIFT','SHIFT')}
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
    updateAllowLowercase(e) {
        var config  = this.state.config;
        config.allowLowercase = !this.state.config.allowLowercase;
        
        this.setState({
            config: config,
        });
        
        this.updateConfig();
    }
    updateAllowUppercase(e) {
        var config  = this.state.config;
        config.allowUppercase = !this.state.config.allowUppercase;
        
        this.setState({
            config: config,
        });
        
        this.updateConfig();
    }
    updateAllowNumbers(e) {
        var config  = this.state.config;
        config.allowNumbers = !this.state.config.allowNumbers;
        
        this.setState({
            config: config,
        });
        
        this.updateConfig();
    }
    updateAllowSymbols(e) {
        var config  = this.state.config;
        config.allowSymbols = !this.state.config.allowSymbols;
        
        this.setState({
            config: config,
        });
        
        this.updateConfig();
    }
    updateShowKeyboard(e) {
        var config  = this.state.config;
        config.showKeyboard = !this.state.config.showKeyboard;
        
        this.setState({
            config: config,
        });
        
        this.updateConfig();
    }

    render() {

        return (
            <div>
                <div>Config options</div>
                <label>Key Per Minute: {60 / this.props.config.frequency} KPM</label><br/><input type="range" min="0.1" max="5" step="0.1" value={this.state.config.frequency} onChange={(e) => {this.updateFrequency(e)}}></input>
                <br/><br/>
                <label>Key Duration: {this.props.config.duration}s</label><br/><input type="range" min="0.1" max="5" step="0.1" value={this.state.config.duration} onChange={(e) => {this.updateDuration(e)}}></input>
                <br/><br/>
                <label>Lives: {this.props.config.lives}</label><br/><input type="range" min="1" max="10" step="1" value={this.state.config.lives} onChange={(e) => {this.updateLives(e)}}></input>
                <br/><br/>
                <label>Show Labels:</label> <input type="checkbox" checked={this.state.config.showKeys} onChange={(e) => {this.updateShowKeys(e)}}></input>
                <br/><br/>
                <label>Show Keyboard:</label> <input type="checkbox" checked={this.state.config.showKeyboard} onChange={(e) => {this.updateShowKeyboard(e)}}></input>
                <br/><br/>
                <label>Allow Uppercase:</label> <input type="checkbox" checked={this.state.config.allowUppercase} onChange={(e) => {this.updateAllowUppercase(e)}}></input>                
                <br/><br/>
                <label>Allow Lowercase:</label> <input type="checkbox" checked={this.state.config.allowLowercase} onChange={(e) => {this.updateAllowLowercase(e)}}></input>
                <br/><br/>
                <label>Allow Numbers:</label> <input type="checkbox" checked={this.state.config.allowNumbers} onChange={(e) => {this.updateAllowNumbers(e)}}></input>
                <br/><br/>
                <label>Allow Symbols:</label> <input type="checkbox" checked={this.state.config.allowSymbols} onChange={(e) => {this.updateAllowSymbols(e)}}></input>
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
            shift: false,
            config: {
                lives: 3,
                frequency: 2,
                duration: 5,
                showKeys: true,
                showKeyboard: true,
                allowUppercase: true,
                allowLowercase: true,
                allowNumbers: true,
                allowSymbols: true,
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

    getNewKey() {
        var allowedKeys = "";
        if (this.state.config.allowLowercase) {
            allowedKeys += _lowerLetters;
        }
        if (this.state.config.allowUppercase) {
            allowedKeys += _upperLetters;
        }
        if (this.state.config.allowNumbers) {
            allowedKeys += _numbers;
        }
        if (this.state.config.allowSymbols) {
            allowedKeys += _upperSymbols + _lowerSymbols;
        }

        var rand = Math.floor(Math.random() * (allowedKeys.length + 1));
        var k = allowedKeys.substr(rand,1);

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
        document.addEventListener('keyup', this.onKeyUp.bind(this));
        this.intervalHandle = setInterval(this.tick.bind(this),100);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyPressed.bind(this));
        document.removeEventListener('keyup', this.onKeyUp.bind(this));
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

    onKeyUp (e) {     
        if (e) {
            if (e.key === 'Shift') {
                this.setState({
                    shift: false,
                })
            }            
        }
    }
    onKeyPressed(e) { 
          
        if (e) {
            if (e.key === 'Shift') {
                this.setState({
                    shift: true,
                })
                return;
            }            
        }
        if (this.state.isStarted) {  
            if (e) {
                var k = e.key;
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
        var activeString = this.getActiveString();

        return (
            <div>
                <div className="game-info">
                    <button onClick={() => this.addActiveKey()}>Add Key</button>                    
                </div> 
                <label>Score: {this.state.keysPressed}</label>
                <br/>
                <label>Score To Beat: {this.state.scoreToBeat}</label>
                <br/><br/>
                <Config updateConfig={this.updateConfig} config={this.state.config} ></Config>
                <button onClick={() => this.startGame()}>Start Game~</button>   
                    <div>Current Key String is : {activeString}</div>
                <div className="game" onKeyDown={this.onKeyPressed()} tabIndex="0">                          
                    <br/>                 
                    <br/>
                    <div>
                        <Keyboard errorKeys={this.state.errorKeys} activeKeys={this.state.activeKeys} activeString={this.getActiveString()} config={this.state.config} shift={this.state.shift} />                    
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