// @tslink:startOmit
var foo = (function(){
// @tslink:endOmit
// @tslink:emit var cq = (function(){

    // @tslink:inject types/primary-types.ts
    // @tslink:inject enums/_index.tslink.ts
    // @tslink:inject interfaces/_index.tslink.ts
    // @tslink:inject types/secondary-types.ts
    // @tslink:inject utils/_index.tslink.ts
    // @tslink:inject conductors/_index.tslink.ts
    // @tslink:inject conductor-interfaces/_index.tslink.ts
    // @tslink:inject conductor-builders/_index.tslink.ts
    // @tslink:inject composer/_index.tslink.ts
    // @tslink:inject cquence.ts

    // @tslink:emit     return lib;
})();