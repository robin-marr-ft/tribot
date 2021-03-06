module.exports.meta = {
	commands: {
		"join (me/us in) [room]": "Join a room (in private chat)",
		"leave [room]": "Leave a room (in private chat)",
		"leave": "Leave current room",
		"list rooms": "List the rooms in which the bot is currently a member",
		"you there?": "Declare presence if in room"
	}
};

module.exports.load = function(bot, options) {
	bot.onMessage(/^(go away|get lost|be quiet|leave( us|the room)?)( please| now)?$/, function(msg) {
		bot.messageRoom(msg.room, 'Farewell.  When you are ready for me to return, you may say \'join #'+msg.room+'\' to me in private chat');
		bot.leave(msg.room);
	});
	bot.onMessage({type:'chat', body:/^join (?:(?:us|me) in )?\#?([\w\-]+)$/}, function(msg, matches) {
		bot.messageUser(msg.fromNick, "I will join you there");
		bot.join(matches.body[1]);
	});
	bot.onMessage({type:'chat', body:/^leave \#?([\w\-]+)$/}, function(msg, matches) {
		bot.messageUser(msg.fromNick, "Leaving "+matches.body[1]);
		bot.messageRoom(matches.body[1], "Leaving the room, on orders from "+msg.fromNick+'. When you are ready for me to return, you may say \'join #'+matches.body[1]+'\' to me in private chat');
		bot.leave(matches.body[1]);
	});
	bot.onMessage(/^(((are )?you there)|yt)\??/, function(msg) {
		bot.message(msg.fromJid, msg.type, 'I am here');
	});
	bot.onMessage(/(which (rooms|channels) are you in\/?|list (rooms|channels))/, function(msg) {
		var chans = Object.keys(bot.rooms).filter(function(room) {
			return bot.rooms[room].selfmember;
		});
		bot.message(msg.fromJid, msg.type, (chans.length === 0) ?
			"I am nowhere.  To invite me into a room, say 'join #<room name>' to me in private chat" :
			"I am currently active in: "+chans.join(', ')
		);
	});
	bot.on('join', function(room) {
		bot.messageRoom(room, 'I am '+bot.name+' and I am now listening in this room. To make me leave say `@'+bot.name+' leave`.');
	});
};
