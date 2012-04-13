/********
 Vending Machine
 ********/

var vendingModel = {
	coins : 0,
	sodas : {
		regular : 5,
		diet : 3,
		water : 2
	},
	sodaChoice : undefined,
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
			this.parent.model.coins++;
			if(this.parent.model.coins < 4){
				console.log("Need " + (4 - this.parent.model.coins) + " coins");
				this.parent.state("idle");
			} else {
				this.parent.do("sufficientCoinsDetected");
			}
		})
	.define("refundingCoins")
		.after(function(){
			console.log("refunding your money (" + this.parent.model.coins + " coins)");
			this.parent.model.coins = 0;
			this.parent.model.sodaChoice(undefined);
			this.parent.state("idle");
		})
	.define("waitingForChoice")
		.canSet("sodaChoice")
		.when("choose", "attemptingVend")
		.when("refund", "refundingCoins")
		.after(function(){
			console.log("waiting for your selection");
		})
	.define("attemptingVend")
		.before(function(){
			console.log("vending...");
			if(this.parent.model.sodaChoice == undefined){
				console.log("no choice made!");
				return(false);
			}
			if(this.parent.model.coins < 4){
				console.log("not enough money: need " + (4 - coins) + " more!");
				this.parent.model.sodaChoice = undefined;
				return(false);
			}
			if(this.parent.model.sodas[this.parent.model.sodaChoice] == undefined){
				console.log("no such choice " + this.parent.model.sodaChoice);
				this.parent.model.sodaChoice = undefined;
				return(false);
			}
			if(this.parent.model.sodas[this.parent.model.sodaChoice] < 1){
				console.log("out of " + this.parent.model.sodaChoice);
				this.parent.model.sodaChoice = undefined;
				return(false);
			}
			console.log("dispensing " + this.parent.model.sodaChoice);
			this.parent.model.sodas[this.parent.model.sodaChoice]--;
			this.parent.model.sodaChoice = undefined;
			this.parent.model.coins = 0;
			this.parent.state("idle");
		})
.end();