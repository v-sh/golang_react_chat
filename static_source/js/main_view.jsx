var React = require('react');
var $ = require('jquery');

var Message = React.createClass({
    render: function() {
	return (
	    <div className = "row form-horizontal">
		<div>
		    <label className = "col-xs-12 col-sm-2">
			{this.props.author}:
		    </label>
		    <div className = "col-xs-12 col-sm-10">
			{this.props.children}
		    </div>
		</div>
	    </div>
	);
    }
});

var ListMessages = React.createClass({
    render: function() {
	var message_nodes = this.props.messages.map(function (message){
	    return <div className = "row">
		<div className = "col-xs-12">
		    <Message author = {message.author}>
			{message.text}
		    </Message>
		</div>
	    </div>
	});
	return <div className = "row">
		<div className = "col-xs-12" >{message_nodes}</div>
	</div>
    }
});

var NewMessageForm = React.createClass({
    getInitialState: function() {
	return {author: '', text: ''};
    },
    handleAuthorChange: function(e) {
	this.setState({author: e.target.value});
    },
    handleTextChange: function(e) {
	this.setState({text: e.target.value});
    },

    handleSubmit: function(e) {
	e.preventDefault();
	var author = this.state.author.trim();
	var text = this.state.text.trim();
	if (!text || !author) {
	    return;
	}
	this.props.onMessageSubmit({author: author, text: text});
	this.setState({author: author, text: ''});
    },
    render: function() {
	return <form onSubmit = {this.handleSubmit}>
	    <div className = "form-group row">
		<div className = "col-xs-12 col-sm-2">
		    <input type = "text"
			   className = "form-control"
			   id = "nickname"
			   placeholder = "nickname"
			   value = {this.state.author}
			   onChange={this.handleAuthorChange}
		    />
		</div>
		<div className = "col-xs-12 col-sm-9">
		    <input type = "text"
			   className = "form-control"
			   id = "message"
			   placeholder = "message"
			   value = {this.state.text}
			   onChange = {this.handleTextChange}
			   autoComplete = "off"
		    />
		</div>
		<div className = "col-xs-12 col-sm-1">
		    <button className = "btn btn-success">Send</button>
		</div>
	    </div>
	</form>
    }
});

socket = null;

var MainView = React.createClass({
    getInitialState: function () {
	return {messages: []};
    },
    establishConnection: function () {
	socket = new WebSocket('ws://' + window.location.host + '/messages/join');
	socket.onmessage = function (event) {
            var data = JSON.parse(event.data);
	    this.setState({messages: this.state.messages.concat([{author: data.Author, text: data.text}])})
	}.bind(this);
	socket.onclose = function(){
            setTimeout(function(){
		this.establishConnection();
	    }.bind(this), 5000);
	}.bind(this);
    },
    componentDidMount: function () {
	this.establishConnection();
    },
    handleMessageSubmit: function (message) {
	socket.send(JSON.stringify(message))
    },
    render: function() {
	return <div className = "container">
	    <ListMessages messages={this.state.messages}/>
	    <NewMessageForm onMessageSubmit = {this.handleMessageSubmit} />
	</div>;
    }
});

module.exports = MainView;
