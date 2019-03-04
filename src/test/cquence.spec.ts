import { describe } from 'mocha';
import { expect } from "chai";
import { cq } from '../lib/cquence';
import { Composer } from '../lib/composer/composer';
import { IConductorInterface } from '../lib/interfaces/conductor-ui';
import { PromiseVirtualFunction, CallbackVirtualFunction } from '../lib/types/secondary-types';
import { ICallbackVirtualFunctionParameters } from '../lib/interfaces/callback-virtual-fn-params';

describe('Cquence API', () => {
    describe('composeFunction', () => {
        it('should return a Virtual Function that returns a Promise, when a Promise constructor is provided', (done) => {
            let fn = cq.composeFunction(function(composer: Composer){
                composer.next(function(ci: IConductorInterface){
                    ci.lets.out = 'foo';
                    ci.next();
                })
                .next(function(ci: IConductorInterface){
                    ci.lets.out += ' bar';
                    ci.next();
                })
                .next(function(ci: IConductorInterface){
                    ci.lets.out += ' baz';
                    ci.return(ci.lets.out);
                });
            }, Promise) as PromiseVirtualFunction;
            
            fn().then(function success(value: string){
                expect(value).to.equal('foo bar baz');
                done();
            },function error(error: any){
                expect.fail('Promise was rejected unexpectedly');
            });
            
        });
        it('should return a Virtual Function that uses callbacks for feedback, when no Promise constructor is provided', (done) => {
            let fn = cq.composeFunction(function(composer: Composer){
                composer.next(function(ci: IConductorInterface){
                    ci.lets.out = 'foo';
                    ci.next();
                })
                .next(function(ci: IConductorInterface){
                    ci.lets.out += ' bar';
                    ci.next();
                })
                .next(function(ci: IConductorInterface){
                    ci.lets.out += ' baz';
                    ci.return(ci.lets.out);
                });
            }) as CallbackVirtualFunction;

            let options: ICallbackVirtualFunctionParameters = {
                success: function (value: string){
                    expect(value).to.equal('foo bar baz');
                    done();
                },
                error: function (error: any){
                    expect.fail('Error callback was invoked unexpectedly');
                }
            };
            
            fn(options);
        });
    });
});

let CquenceSpec = {};
export { CquenceSpec };