import { CompositionFunction, VirtualFunction } from "./types/secondary-types";
import { utils } from "./utils/main-utils";
import { Composer } from "./composer/composer";
import { privado } from "./types/primary-types";
import { PrivateComposerAPI } from "./composer/private-api";

let cq = (function(){
    class Cquence {
    
        composeFunction (compositionFn: CompositionFunction, promiseConstructor?: PromiseConstructorLike): VirtualFunction {
            if (!utils.isFunction(compositionFn)) {
                throw new TypeError("First argument provided to composeFunction(compositionFunction, [PromiseConstructor]) must be a function");
            }
    
            var composer = new Composer();
            compositionFn(composer);
    
            let pvt = <PrivateComposerAPI>composer[privado];
            return pvt.compile(promiseConstructor);
        }
    }

    return new Cquence();
})();

export {cq};