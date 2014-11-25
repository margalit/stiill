/** @jsx React.DOM */

var APP = React.createClass({
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
      <div>
        {nav}
        {timer}
        {alarm}
        <audio ref="alarm">
          <source src="/sounds/hapi.mp3" type="audio/mpeg" />
        </audio>
      </div>
    )
  },

  // Custom methods
  _isOffline: function() {
    return !window.navigator.onLine;
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
        <ul className='nav'>
          <li className='nav-item nav-item--30' onClick={this._setTimerDuration.bind(this, 30)}><i className='nav-item__value'>30</i></li>
          <li className='nav-item nav-item--25' onClick={this._setTimerDuration.bind(this, 25)}><i className='nav-item__value'>25</i></li>
          <li className='nav-item nav-item--20' onClick={this._setTimerDuration.bind(this, 20)}><i className='nav-item__value'>20</i></li>
          <li className='nav-item nav-item--15' onClick={this._setTimerDuration.bind(this, 15)}><i className='nav-item__value'>15</i></li>
          <li className='nav-item nav-item--10' onClick={this._setTimerDuration.bind(this, .1)}><i className='nav-item__value'>10</i></li>
        </ul>
      )
    } else {
      return <p>Turn your phone to airplane mode</p>;
    }
  },

  _renderTimer: function() {
    if(this.state.timerIsRunning) {
      return (
        <p className='timer'>Timer: {this.state.timeElapsed}</p>
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
  <APP />,
  document.getElementById('content')
);
