// Types with no dependency or types or interfaces defined in this project
/// <reference path="types/primary-types.ts" />

/// <reference path="interfaces/index.ts" />

/// <reference path="types/secondary-types.ts" />

/// <reference path="enums/index.ts" />

/// <reference path="utils/index.ts" />

//Sequence conductors manage the flow of the virtual function. It contains an array (sequence) of execution targets,
//  coordinating which execution target to call,
//  and when to yield control of the virtual function flow to a parent sequence conductor
/// <reference path="conductors/index.ts" />

// Sequence conductor builders are are a type of 'execution target', so like a unit function, they are
//   included in the array (sequence) of execution targets that a sequence conductor iterates through at runtime.
// They are effectively factories that produce sequence conductors when called upon to do so by a parent conductor. 
//   This allows the newly created sequence conductor to run in context, and, as in the case of conductor builders
//   for conditional sequences, allows cquence to decide at runtime whether or not a conductor's sequence should run at all.
//   This architecture also allows cquence to safely run the same virtual function multiple times concurrently.
/// <reference path="conductor-builders/index.ts" />

// Conductor interfaces are passed into unit functions, providing an API that temporarily exposes the methods
//  on a sequence conductor, and provides access to the lets object - scoped variables local to the virtual function.
// The conductor interface ensures that unit functions can only cause the sequence conductor to move on to the
//  next unit once -- after the unit function abdicates control, subsequent calls to the conductor interface's API
//  will throw an error
/// <reference path="conductor-interfaces/index.ts" />

/// <reference path="composer/index.ts" />

/// <reference path="cquence.ts" />

export default new Cquence();