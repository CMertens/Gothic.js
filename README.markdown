Gothic.js
=========

A JS FSM API
--------------------------------


Gothic.js is a small and simple library for modeling and managing finite state machines in JavaScript. Similar to the fluent API design from Martin Fowler's *Domain-Specific Languages*, Gothic's syntax is designed to be an unobtrusive addition to your favorite MVC or MVVM library. (See `VendingMachineKOExample.js` and `VendingMachineKO.html` for an example of how to use Gothic with Knockout.)


Usage
-----

`var model = {};

`var fsm = Gothic.create(model)
  .define("isInitializing")
    .is(GOTHIC.INITIAL)
    .when("initialized", "isReady")
  .define("isReady")
    .when("powerOff", "isPoweredDown")
  .define("isPoweredDown")
    .when("powerOn", "isInitializing")
.end();`


To control the FSM:

`fsm.do("initialized");
fsm.do("powerOff");
fsm.do("powerOn");`


FSM CREATION API
----------------

`Gothic.create(model)`: Creates a new `GothicMachine` instance, using `model` as its data source.

`GothicMachine.define(name)`: Define a new state with name `name`.

`GothicMachine.is(propertyType)`: Sets a property on the current state, where `propertyType` is `Gothic.SETTABLE` (allow explicit setting of the FSM to this state via the `state(stateName)` function) or `Gothic.INITIAL` (the FSM will be set to this state when the FSM is initialized).

`GothicMachine.when(triggerName, stateName)`: When in the current state, calling `do(triggerName)` will transition the FSM to `stateName`.

`GothicMachine.whenEver(triggerName, stateName)`: Defines a global override, so that anytime you call `do(triggerName)`, the FSM will transition to `stateName`. This will override any transition defined within a state.

`GothicMachine.before(func)`: Defines a function on the current state that will execute before the FSM transitions into it. If you return anything other than `true` from the `before()` function, the FSM will not complete the transition,

`GothicMachine.after(func)`: Defines a function on the current state that will execute after the FSM has transitioned into it. If this function returns `true`, the FSM's `lastResult` property will be set to `true`; otherwise, `false`. There is no other effect.

`GothicMachine.leaving(func)`: Defines a function on the current state that will execute after the next state's `before()` function. Returning anything other than `true` from this function will cause the transition to abort, and the FSM will stay in this state.

`GothicMachine.left(func)`: Defines a function on the current state that will execute after the FSM has transitioned into another state. The return value from this function is ignored.

`GothicMachine.canSet(valueName)`: Indicates that the model property `valueName` can be set during this state using the `set(valueName, newValue)` function.

`GothicMachine.canCall(funcName)`: Indicates that the model function `funcName` can be called during this state using the `call(funcName, [args])` function.

`GothicMachine.end()`: Initializes the FSM and returns it.


FSM MANAGEMENT API
------------------
`GothicMachine.state()`: Returns the name of the current state.

`GothicMachine.state(stateName)`: Attempts to transition to the state `stateName`. Returns name of the current state.

`GothicMachine.do(triggerName)`: Calls the trigger `triggerName` on the FSM, which may result in a state change.

`GothicMachine.set(valueName, newValue)`: Sets the property `valueName` to `newValue` defined on the model.

`GothicMachine.call(funcName)`: Calls the function `funcName` defined on the model.

`GothicMachine.call(funcName, [args])`: Calls the function `funcName` defined on the model, with argument list `[args]`. Note that `[args]` must be a single-dimensional array. (See the language documentation for `apply()` for more information.)

`GothicMachine.result()`: Returns the boolean result of the last state change operation on the FSM.

