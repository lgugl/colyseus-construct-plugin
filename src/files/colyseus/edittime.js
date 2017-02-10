function GetPluginSettings()
{
	return {
		"name":			"Colyseus",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"Colyseus",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Client API of Colyseus, the minimalist Multiplayer Game Server for Node.js.",
		"author":		"Loïc Guglielmino",
		"help url":		"https://github.com/polpoy/colyseus-construct-plugin",
		"category":		"Web",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"dependency":	"colyseus.js",
		"flags":		0						// uncomment lines to enable flags...
						| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name

AddCondition(0, cf_trigger, "On opened", "Connection", "On connection opened", "Triggered when the connection to the Colyseus websocket server is successfully established.", "OnOpened");

AddCondition(1, cf_trigger, "On closed", "Connection", "On connection closed", "Triggered when an active connection is closed.", "OnClosed");

AddCondition(2, cf_trigger, "On error", "Connection", "On connection error", "Triggered when there is a connection error.", "OnError");

AddCondition(3, cf_trigger, "On message", "Data", "On message", "Triggered when a message is received from the server.", "OnMessage");

AddCondition(4, cf_none, "Is open", "Connection", "Is connection open", "True if the connection is currently open.", "IsOpen");

AddCondition(5, cf_none, "Is connecting", "Connection", "Is connecting", "True if the connection is currently being established.", "IsConnecting");

AddCondition(6, cf_none, "Is supported", "Connection", "Is WebSocket supported", "True if the user's client supports WebSocket connections.", "IsSupported");

AddCondition(7, cf_trigger, "On joined", "Room", "On room joined", "Triggered when the client successfully joins a room.", "OnRoomJoined");

AddCondition(8, cf_trigger, "On error", "Room", "On room error", "Triggered when.", "OnRoomError");

AddCondition(9, cf_trigger, "On leave", "Room", "On room left", "Triggered when.", "OnRoomLeft");

AddCondition(10, cf_trigger, "On data", "Room", "On room data", "Triggered when.", "OnRoomData");

AddCondition(11, cf_trigger, "On update", "Room", "On room update", "Triggered when.", "OnRoomUpdate");


////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// example
AddStringParam("URL", "Enter the WebSocket server to connect to.", "\"ws://\"");
AddStringParam("Protocol (optional)", "Enter a required sub-protocol the server must support in order to establish a connection. Leave empty for no protocol requirement.");
AddAction(0, af_none, "Connect", "Connection", "Connect to <i>{0}</i> (require protocol {1})", "Connect to a Colyseus websocket server.", "Connect");

AddAction(1, af_none, "Close", "Connection", "Close connection", "Close the connection to the Colyseus server.", "Close");

AddStringParam("Data", "A text string to send to the server.");
AddAction(2, af_none, "Send text", "Data", "Send text <i>{0}</i>", "Send a text string to the server.", "Send");

AddStringParam("roomName", "The room's name to join", "");
AddStringParam("options", "Optional JSON format options will be send to the room to join");
AddAction(3, af_none, "Join", "Room", "Join room <i>{0}</i> (with options {1}).", "Join a room on the server.", "JoinRoom");

AddAction(4, af_none, "Leave", "Room", "Leave room", "Leave the room.", "LeaveRoom");

AddStringParam("Data", "A text string to send to the room.");
AddAction(5, af_none, "Send", "Room", "Send text <i>{0}</i> to a room", "Send text to the room.", "SendToRoom");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// example
AddExpression(0, ef_return_string, "", "Data", "MessageText", "The text content of the message in 'On message'.");
AddExpression(1, ef_return_string, "", "Data", "ClientID", "The client ID returned by the Colyseus server.");
AddExpression(2, ef_return_string, "", "Connection", "ErrorMsg", "The error message in 'On error'.");
AddExpression(3, ef_return_number, "", "Connection", "CloseCode", "The close code in 'On closed'.");
AddExpression(4, ef_return_string, "", "Connection", "CloseReason", "The reason for closing in 'On closed'.");
AddExpression(5, ef_return_string, "", "Data", "RoomData", "Received message from On data.");
AddExpression(6, ef_return_string, "", "Data", "RoomPatches", "Received message from On patch and On update.");
AddExpression(7, ef_return_string, "", "Data", "RoomState", "Received message from On update.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
	// new cr.Property(ept_integer, 	"My property",		77,		"An example property.")
	];

// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");

	// Save the constructor parameters
	this.instance = instance;
	this.type = type;

	// Set the default property values from the property table
	this.properties = {};

	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;

	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}
