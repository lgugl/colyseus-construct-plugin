// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Colyseus = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Colyseus.prototype;

	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};

	var instanceProto = pluginProto.Instance.prototype;

	var isSupported = (typeof WebSocket !== "undefined");

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		this.client = null;
		this.clientId = "";
		this.messageText = "";
		this.errorMsg = "";
		this.closeCode = 0;
		this.closeReason = "";
		this.room = null;// allow to connect to only one room (we don't use an array for more rooms)
		this.roomData = "";
		this.roomPatches = null;
		this.roomState = null;
	};

	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};

	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};

	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};

	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};

	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};

	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": "My debugger section",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property

				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});
	};

	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	Cnds.prototype.OnOpened = function ()
	{
		return true;
	};

	Cnds.prototype.OnClosed = function ()
	{
		return true;
	};

	Cnds.prototype.OnError = function ()
	{
		return true;
	};

	Cnds.prototype.OnMessage = function ()
	{
		return true;
	};

	Cnds.prototype.IsOpen = function ()
	{
		return this.client && this.client.readyState === 1;
	};

	Cnds.prototype.IsConnecting = function ()
	{
		return this.client && this.client.readyState === 0;
	};

	Cnds.prototype.IsSupported = function ()
	{
		return isSupported;
	};

	Cnds.prototype.OnRoomJoined = function ()
	{
		return true;
	};

	Cnds.prototype.OnRoomError = function ()
	{
		return true;
	};

	Cnds.prototype.OnRoomLeft = function ()
	{
		return true;
	};

	Cnds.prototype.OnRoomData = function ()
	{
		return true;
	};

	Cnds.prototype.OnRoomPatch = function ()
	{
		return true;
	};

	Cnds.prototype.OnRoomUpdate = function ()
	{
		return true;
	};

	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	// Connect to a Colyseus server
	Acts.prototype.Connect = function (url_, requireProtocol_)
	{
		if (!isSupported)
			return;

		// Close existing connection if any
		if (this.client)
			this.client.close();

		var self = this;

		try {
			if (requireProtocol_ === "")
				this.client = new Colyseus.Client(url_);
			else
				this.client = new Colyseus.Client(url_, requireProtocol_);
		}
		catch (e) {
			this.client = null;
			self.errorMsg = "Unable to create a Colyseus client.";
			self.runtime.trigger(pluginProto.cnds.OnError, self);
			return;
		}

		// Events
		this.client.onOpen.add(function () {
			if (requireProtocol_.length && self.client.protocol.indexOf(requireProtocol_) === -1) {
				self.errorMsg = "WebSocket required protocol '" + requireProtocol_ + "' not supported by server";
				self.runtime.trigger(pluginProto.cnds.OnError, self);
			}
			else {
				self.clientId = self.client.id;//save client ID
				self.runtime.trigger(pluginProto.cnds.OnOpened, self);
			}
		});
		this.client.onClose.add(function (e) {
			self.closeCode = e && e["code"] || 0;
			self.closeReason = e && e["reason"] || "";
			self.client.close();
			self.runtime.trigger(pluginProto.cnds.OnClosed, self);
		});
		this.client.onMessage.add(function (msg) {
			self.messageText = msg;
			self.runtime.trigger(pluginProto.cnds.OnMessage, self);
		});
		this.client.onError.add(function (err) {
			if (cr.is_string(err))
				self.errorMsg = err;

			self.runtime.trigger(pluginProto.cnds.OnError, self);
		});
	};

	Acts.prototype.Close = function ()
	{
		if (this.client)
			this.client.close();
	};

	Acts.prototype.Send = function (msg_)
	{
		if (this.client)
			this.client.send(msg_);
	};

	// Join a room on the server
	// options is optional and must be a string json
	Acts.prototype.JoinRoom = function (roomName_, options_)
	{
		if (!this.client)
			return;

		var self = this;

		try {
			if (options_) {
				this.room = this.client.join(roomName_, JSON.parse(options_));
			}
			else {
				this.room = this.client.join(roomName_);
			}

		}
		catch (e) {
			this.room = null;
			self.errorMsg = "Unable to join a room.";
			self.runtime.trigger(pluginProto.cnds.OnError, self);
			return;
		}

		// Events
		this.room.onJoin.add(function () {
			self.runtime.trigger(pluginProto.cnds.OnRoomJoined, self);
		});
		this.room.onError.add(function (err) {
			if (cr.is_string(err))
				self.errorMsg = err;
			self.runtime.trigger(pluginProto.cnds.OnRoomError, self);//or OnError
		});
		this.room.onLeave.add(function () {
			self.runtime.trigger(pluginProto.cnds.OnRoomLeft, self);
		});
		this.room.onData.add(function (data) {
			self.roomData = data;
			self.runtime.trigger(pluginProto.cnds.OnRoomData, self);
		});
		this.room.onUpdate.add(function (state, patches) {
			self.roomState = state;
			self.roomPatches = patches || null;
			self.runtime.trigger(pluginProto.cnds.OnRoomUpdate, self);
		});

	}

	Acts.prototype.LeaveRoom = function ()
	{
		if (this.room)
			this.room.leave();
	};

	Acts.prototype.SendToRoom = function (msg_)
	{
		if (this.room)
			this.room.send(msg_);
	};

	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.MessageText = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.messageText);
	};

	Exps.prototype.ClientID = function (ret)
	{
		ret.set_string(this.clientId);
	};

	Exps.prototype.ErrorMsg = function (ret)
	{
		ret.set_string(this.errorMsg);
	};

	Exps.prototype.CloseCode = function (ret)
	{
		ret.set_int(this.closeCode);
	};

	Exps.prototype.CloseReason = function (ret)
	{
		ret.set_string(this.closeReason);
	};

	Exps.prototype.RoomData = function (ret)
	{
        ret.set_string(this.roomData);
	};

	Exps.prototype.RoomPatches = function (ret)
	{
        // stringify the object
        try {
            ret.set_string(JSON.stringify(this.roomPatches));
        } catch(e) {
            ret.set_string("");
        }
	};

	Exps.prototype.RoomState = function (ret)
	{
        // stringify the object
        try {
            ret.set_string(JSON.stringify(this.roomState));
        } catch(e) {
            ret.set_string("");
        }
	};

	pluginProto.exps = new Exps();

}());
