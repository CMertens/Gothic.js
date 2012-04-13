/***************
	Vending Machine (knockoutified)
 ***************/

var vendingModel = {
	coins : ko.observable(0),
	sodas : ko.observable({
		regular : ko.observable(5),
		diet : ko.observable(3),
		water : ko.observable(2)
	}),
	sodaChoice : ko.observable(undefined),
	dispense : function(){		
	}
};

var vm = Gothic.create(vendingModel)
	.define("idle")
		.is(Gothic.SETTABLE)
		.is(Gothic.INITIAL)
		.when("addCoin", "addingCoin")
		.when("refund", "refundingCoins")
	.define("addingCoin")
		.when("sufficientCoinsDetected", "waitingForChoice")
		.after(function(){
			console.log("coin accepted");
			this.parent.model.coins(this.parent.model.coins()+1);
			if(this.parent.model.coins() < 4){
				console.log("Need " + (4 - this.parent.model.coins()) + " coins");
				this.parent.state("idle");
			} else {
				this.parent.do("sufficientCoinsDetected");
			}
		})
	.define("refundingCoins")
		.after(function(){
			console.log("refunding your money (" + this.parent.model.coins() + " coins)");
			this.parent.model.coins(0);
			this.parent.model.sodaChoice(undefined);
			this.parent.state("idle");
		})
	.define("waitingForChoice")
		.canCall("sodaChoice")
		.when("choose", "attemptingVend")
		.when("refund", "refundingCoins")
		.after(function(){
			console.log("waiting for your selection");
		})
	.define("attemptingVend")
		.before(function(){
			console.log("vending...");
			if(this.parent.model.sodaChoice() == undefined){
				console.log("no choice made!");
				return(false);
			}
			if(this.parent.model.coins() < 4){
				console.log("not enough money: need " + (4 - coins()) + " more!");
				this.parent.model.sodaChoice(undefined);
				return(false);
			}
			console.log("checking for choice");
			if(this.parent.model.sodas()[this.parent.model.sodaChoice()] == undefined){
				console.log("no such choice " + this.parent.model.sodaChoice());
				this.parent.model.sodaChoice(undefined);
				return(false);
			}
			console.log("checking for inventory");
			if(this.parent.model.sodas()[this.parent.model.sodaChoice()]() < 1){
				console.log("out of " + this.parent.model.sodaChoice());
				alert("Sorry, we're out of " + this.parent.model.sodaChoice());
				this.parent.model.sodaChoice(undefined);
				return(false);
			}
			console.log("dispensing " + this.parent.model.sodaChoice());
			var amt = this.parent.model.sodas()[this.parent.model.sodaChoice()]();
			this.parent.model.sodas()[this.parent.model.sodaChoice()](amt-1);
			this.parent.model.sodaChoice(undefined);
			this.parent.model.coins(0);
			this.parent.state("idle");
		})
.end();

$(function(){
	ko.applyBindings(vendingModel);
});

/*
	vm.do("addCoin");vm.do("addCoin");vm.do("addCoin");vm.do("addCoin");vm.call("sodaChoice", ["diet"]);vm.do("choose");
*/