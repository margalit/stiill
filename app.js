/** @jsx React.DOM */

var APP = React.createClass({displayName: 'APP',
  getInitialState: function() {
    return {
      offline: this._isOffline(),
      timerIsRunning: false,
      timerDuration: null,
      timeElapsed: null
    };
  },

  componentWillMount: function() {
    window.addEventListener("online", this._checkOfflineStatus);
    window.addEventListener("offline", this._checkOfflineStatus);
  },

  componentWillUnmount: function() {
    window.removeEventListener("online", this._checkOfflineStatus);
    window.removeEventListener("offline", this._checkOfflineStatus);
  },

  render: function() {
    var nav = this._renderNav();
    var timer = this._renderTimer();
    var alarm = this._soundAlarm();
    return (
      React.DOM.div(null, 
        nav, 
        timer, 
        alarm, 
        React.DOM.audio({ref: "alarm"}, 
          React.DOM.source({src: "/sounds/hapi.mp3", type: "audio/mpeg"})
        )
      )
    )
  },

  // Custom methods
  _isOffline: function() {
    return window.navigator.onLine;
  },

  _checkOfflineStatus: function() {
    this.setState({
      offline: this._isOffline()
    })
  },

  _setTimerDuration: function(durationInMinutes, e) {
    this.setState({
      timerDuration: durationInMinutes*60,
      timerIsRunning: true
    });
    this._startTimer();
  },

  _startTimer: function() {
    this.interval = setInterval(this._tick, 1000);
  },

  _tick: function() {
    this.setState({
      timeElapsed: this.state.timeElapsed + 1
    });
  },

  _renderNav: function() {
    if(this.state.offline && !this.state.timerIsRunning) {
      return (
        React.DOM.ul({className: "nav"}, 
          React.DOM.li({className: "nav-item nav-item--30", onClick: this._setTimerDuration.bind(this, 30)}, React.DOM.i({className: "nav-item__value"}, "30")), 
          React.DOM.li({className: "nav-item nav-item--25", onClick: this._setTimerDuration.bind(this, 25)}, React.DOM.i({className: "nav-item__value"}, "25")), 
          React.DOM.li({className: "nav-item nav-item--20", onClick: this._setTimerDuration.bind(this, 20)}, React.DOM.i({className: "nav-item__value"}, "20")), 
          React.DOM.li({className: "nav-item nav-item--15", onClick: this._setTimerDuration.bind(this, 15)}, React.DOM.i({className: "nav-item__value"}, "15")), 
          React.DOM.li({className: "nav-item nav-item--10", onClick: this._setTimerDuration.bind(this, .1)}, React.DOM.i({className: "nav-item__value"}, "10"))
        )
      )
    } else {
      return React.DOM.p(null, "Turn your phone to airplane mode");
    }
  },

  _renderTimer: function() {
    if(this.state.timerIsRunning) {
      return (
        React.DOM.p({className: "timer"}, "Timer: ", this.state.timeElapsed)
      )
    }
  },

  _soundAlarm: function() {
    if(this.state.timerIsRunning && this.state.timerDuration === this.state.timeElapsed) {
      return this.refs.alarm.getDOMNode().play()
    }
  }

});

React.renderComponent(
  APP(null),
  document.getElementById('content')
);
