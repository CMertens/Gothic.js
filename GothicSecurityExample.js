var model = {
	unlockDoor : function(){
		console.log("the door unlocks!");
	},
	lockDoor : function(){
		console.log("the door locks!");
	},
	unlockPanel : function(){
		console.log("the panel unlocks!");
	},
	lockPanel : function(){
		console.log("the panel locks!");
	}
};

var sm = Gothic.create(model)
	.whenEver("doorOpened", "idle")
	.define("idle")
		.is(Gothic.INITIAL)
		.is(Gothic.SETTABLE)
		.leaving(function(){
			model.unlockDoor();
			model.lockPanel();
			return(true);
		})
		.when("doorClosed", "active")
	.define("active")
		.when("lightOn", "waitingForDrawer")
		.when("drawerOpened", "waitingForLight")
	.define("waitingForLight")
		.when("lightOn", "unlockedPanel")
		.when("drawerOpened", "active")
	.define("waitingForDrawer")
		.when("drawerOpened", "unlockedPanel")
		.when("lightOn", "active")
	.define("unlockedPanel")
		.is(Gothic.SETTABLE)
		.after(function(){
			model.lockDoor();
			model.unlockPanel();
			return(true);
		})
		.when("panelClosed", "idle")
.end();