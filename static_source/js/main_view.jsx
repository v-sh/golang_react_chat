var React = require('react');
messages = [{author: "Vovan1", text: "Hi there!"}, {author: "Vovan2", text: "Bite me"}];

var ListMessages = React.createClass({
    render: function() {
	var message_nodes = messages.map(function (message){
	    return <div>
	    <h3>{message.author}</h3>
	    <p>{message.text}</p>
	    </div>
	});
	return <div>
	{message_nodes}
	</div>
    }
});

var MainView = React.createClass({
    render: function() {
	return <div className = "container">
	<ListMessages />
	</div>;
    }
});

module.exports = MainView;
