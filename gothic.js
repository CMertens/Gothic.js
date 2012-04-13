// Gothic.js
// A very small fluent DSL for constructing FSMs

var Gothic = {
	INITIAL : 1,
	SETTABLE : 2,
	create : function(model){
		return(new GothicMachine(model));
	}
};


GothicMachine = function(modelSrc){
	var self = this;
	this.model = modelSrc;
	this.states = {
	
	};
	this.currentState = undefined;
	this.lastResult = undefined;
	this.arcs = {};

	this.currentEditingState = undefined;
	
	
	// Defines a new state within a GothicMachine
	this.define = function(name){		
		var s = {};
		s.name = name;
		s.parent = self;
		s.properties = {};
		s.settables = {};
		s.callables = {};
		s.before = function(){return(true);};
		s.after = function(){return(true);};		
		s.leaving = function(){return(true);};
		s.left = function(){};	// doesn't matter what this one returns
		s.arcs = {};
		self.states[name] = s;
		self.currentEditingState = name;
		return(self);
	};
	
	// Sets flags on a GothicMachine state
	this.is = function(smType){
		self.states[self.currentEditingState].properties[smType] = true;
		if(smType == Gothic.INITIAL){
			self.currentState = self.currentEditingState;
		}
		return(self);
	};
	
	// Sets a trigger->state mapping on a GothicMachine state
	this.when = function(tgrName, stName){
		self.states[self.currentEditingState].arcs[tgrName] = stName;
		return(self);
	};
	
	// Sets a global override trigger->state mapping in ALL states
	this.whenEver = function(tgrName, stName){
		self.arcs[tgrName] = stName;
		return(self);
	};
	
	// Defines a function to be executed after a transition is completed
	// to a state
	this.after = function(func){
		self.states[self.currentEditingState].after = func;
		return(self);
	};
	
	// Defines a function to be executed before a transition to a state
	// is completed; returning false from a "before" function will abort
	// the transition (useful when signposting to other states)
	this.before = function(func){
		self.states[self.currentEditingState].before = func;
		return(self);
	};
	
	// Defines a function to be executed before a transition from this
	// state has been executed; returning false will abort the transition
	this.leaving = function(func){
		self.states[self.currentEditingState].leaving = func;
		return(self);
	}
	
	// Defines a function to be executed after a transition is completed
	// from a state
	this.left = function(func){
		self.states[self.currentEditingState].left = func;
		return(self);
	};
	
	// indicates that you can set(valName) on the model from this state
	this.canSet = function(valName){
		self.states[self.currentEditingState].settables[valName] = true;
		return(self);
	};
	
	// indicates that you can call(funcName) on the model from this state
	this.canCall = function(funcName){
		self.states[self.currentEditingState].callables[funcName] = true;
		return(self);
	};
	
	// Call to finalize the GothicMachine
	this.end = function(){
		self.currentEditingState = undefined;
		return(self);
	};
	
	/*********************************************************************/
	/* GothicMachine Runtime Functions                                   */
	/*********************************************************************/
	
	// Either returns the name of the current state or, if newState is
	// provided, attempts to transition to newState (Gothic.SETTABLE
	// must be set on newState)
	this.state = function(newState){
		if(newState == undefined){
			return(self.currentState);
		}
		if(self.states[newState] == undefined){
			return(false);
		}
		if(self.states[newState].properties[Gothic.SETTABLE] == true){
			if(self.states[newState].before()){
				if(self.states[self.currentState].leaving()){
					var oldState = self.currentState;
					self.currentState = newState;
					self.states[oldState].left();
					self.lastResult = true;
					if(self.states[newState].after()){
						self.lastResult = true;
					} else {
						self.lastResult = false;
					}
				} else {
					self.lastResult = false;
				}
			} else {
				self.lastResult = false;
			}
		} else {
			self.lastResult = false;
		}
		return(self.currentState);
	};
	
	
	
	// Set (valName) to (newVal) on the model, if allowed
	this.set = function(valName, newVal){		
		if(self.states[self.currentState].settables[valName] == true){
			self.model[valName] = newVal;
			return(self.model[valName]);
		}
		return(undefined);
	};
	
	
	// Call (funcName) on the model, if allowed. Array argument "arg" will 
	// trigger the use of apply(), allowing arguments to be passed to the
	// function. Should be useful for knockout observables
	this.call = function(funcName, arg){
		if(self.states[self.currentState].callables[funcName] == true){
			var fn = self.model[funcName];
			if(arg == undefined){
				var ret = fn.call(self.model);
			} else {
				var ret = fn.apply(self.model, arg);
			}
			return(ret);
		}
		return(undefined);
	};
	
	// Call trigger tgrName
	this.do = function(tgrName){
		var newState = undefined;
		// global triggers override everything
		if(self.arcs[tgrName] != undefined){
			newState = self.arcs[tgrName];
		} else {
			newState = self.states[self.currentState].arcs[tgrName];
		}
		if(newState == undefined){
			self.lastResult = false;
			return(self.currentState);
		}
		if(self.states[newState] == undefined){
			self.lastResult = false;
			return(self.currentState);
		}	
		
		if(self.states[newState].before()){
			if(self.states[self.currentState].leaving()){
				var oldState = self.currentState;
				self.currentState = newState;
				self.lastResult = true;
				self.states[oldState].left();				
				if(self.states[newState].after()){				
					self.lastResult = true;
				} else {
					self.lastResult = false;
				}
			} else {
				self.lastResult = false;				
			}
		} else {
			self.lastResult = false;
		}
		return(self.currentState);
	};
	
	// get last result
	this.result = function(){
		return(self.lastResult);
	};	
};