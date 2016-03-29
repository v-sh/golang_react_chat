var React = require('react');
var ReactDOM = require('react-dom');
var Panel = require('./panel.jsx').Panel;
var MainView = require('./main_view.jsx');
ReactDOM.render(
    <div>
    <Panel />
    <MainView />
    </div>,
    document.getElementById('main_div')
);
