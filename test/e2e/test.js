///<reference path="../../dist/es3/cquence.js" />
///<reference path="../../dist/typings/index.d.ts" />
///<reference path="../../node_modules/mocha/mocha.js" />
///<reference path="../../node_modules/chai/chai.js" />
///<reference path="../../node_modules/q/q.js" />

var cqTest = (function(){
    var cmpFn = function(cmp){
        cmp.next(function(ci){
            // we should have the Mocha expect object passed in
            var expect = ci.lets.expect;
            if(!expect) {
                return ci.error('Required parameter `expect` not provided');
            }

            ci.update(expect);

            // set up for if statement to follow...
            var child = {};
            child['some.weirdly named%property'] = true;
            ci.lets.testIf = {
                child: child
            };
            ci.lets.result = '';

            ci.next();
        })
        .if('testIf.child.some%.weirdly named%%property', function(cmp){
            cmp.next(function(ci){
                ci.lets.result = 'if tested | ';
                console.log(ci.lets.result);
                ci.lets.loopCount = 0;

                ci.next();
            })
            .while (function(lets){ return lets.loopCount < 10; },
            function(cmp){
                cmp.next(function(ci){
                    ci.lets.loopCount++;
                    ci.lets.result += ci.lets.loopCount;
                    console.log(ci.lets.result);

                    ci.next();
                })
                .next(function(ci){
                    ci.lets.expect(ci.lets.loopCount > 0).to.be.true;
                    ci.lets.expect(ci.lets.loopCount < 4).to.be.true;

                    if(ci.lets.loopCount === 3) {
                        return ci.break();
                    }

                    ci.next();
                })
            })
            .next(function(ci){
                ci.lets.result += '... while tested ';
                console.log(ci.lets.result);

                ci.next();
            });
        })
        .next(function(ci){
            ci.lets.testElse = true;

            ci.next();
        })
        .if(function(){ return '!testElse'; }, function(cmp){
            cmp.next(function(ci){
                var msg = 'Expected if condition to be false on else test';
                ci.lets.expect.fail(msg);
            });
        })
        .else(function(cmp){
            cmp.next(function(ci){
                ci.lets.result += '| else tested ';
                console.log(ci.lets.result);

                ci.next();
            })
            .doWhile(false, function(cmp){
                cmp.next(function(ci){
                    ci.lets.result += '| do while tested ';
                    console.log(ci.lets.result);

                    ci.next();
                });
            });
        })
        .next(function(ci){
            ci.lets.testElseIf = 2;

            ci.next();
        })
        .if(function(lets){ return lets.testElseIf === 1; }, function(cmp){
            cmp.next(function(ci){
                var msg = 'Expected if condition to be false on elseIf test';
                ci.lets.expect.fail(msg);
            });
        })
        .elseIf(function(lets){ return lets.testElseIf === 2; }, function(cmp){
            cmp.next(function(ci){
                ci.lets.result += '| else if tested |';
                console.log(ci.lets.result);

                ci.next();
            })
            .forEach({a: 'fe', b: 'fi', c: 'fo'}, function(cmp){
                cmp.next(function(ci){
                    ci.lets.result += ' ' + ci.$item;
                    console.log(ci.lets.result);

                    if(ci.$key !== 'b') {
                        return ci.continue();
                    }

                    ci.next();
                })
                .next(function(ci){
                    ci.lets.result += ' ' + ci.$item;
                    console.log(ci.lets.result);

                    ci.next();
                });
            })
            .next(function(ci) {
                ci.lets.result += '... foreach tested';
                console.log(ci.lets.result);

                ci.next();
            });
        })
        .else(function(cmp){
            cmp.next(function(ci){
                var msg = 'Should not enter else unit on elseIf test';
                ci.lets.expect.fail(msg);
            });
        })
        .next(function(ci){
            ci.return(ci.lets.result);
        });
    }

    // use native Promise constructor if possible
    var promiseCtor = window.Promise || Q.Promise;

    return {
        cbFunction: cq.composeFunction(cmpFn),
        prmFunction: cq.composeFunction(cmpFn, promiseCtor)
    };
})();

describe('End-to-End Test', function () {
    describe('Composed function using callbacks', function() {
        it('should make proper use of input arguments and the success, update, and completed callbacks', function(done) {
            var updateCalled = false,
            successCalled = false;

            cqTest.cbFunction({
                args: {expect: chai.expect},
                success: function(result) {
                    chai.expect(result).to.equal('if tested | 123... while tested | else tested | do while tested | else if tested | fe fi fi fo... foreach tested');
                    successCalled = true;
                },
                error: function(err) {
                    chai.expect.fail('Error callback invoked unexpectedly: ' + err);
                },
                update: function(update){
                    chai.expect(update).to.equal(chai.expect);
                    updateCalled = true;
                },
                completed: function(){
                    chai.expect(updateCalled).to.equal(true, 'Update callback was not invoked');
                    chai.expect(successCalled).to.equal(true, 'Success callback was not invoked');

                    done();
                }
            });
        });
        it('should make proper use of the error callback', function(done) {
            var errorCalled = false;

            cqTest.cbFunction({
                args: {}, // no expect parameter will cause composed function to fail
                success: function(result) {
                    chai.expect.fail('Success callback invoked unexpectedly');
                },
                error: function(err) {
                    chai.expect(err).to.equal('Required parameter `expect` not provided');
                    errorCalled = true;
                },
                update: function(update){
                    chai.expect.fail('Update callback invoked unexpectedly');
                },
                completed: function(){
                    chai.expect(errorCalled).to.equal(true, 'Error callback was not invoked');

                    done();
                }
            });
        });
    });
    describe('Composed function returning Promise', function() {
        it('should make proper use of input arguments and the update callback', function(done) {
            var updateCalled = false;

            cqTest.prmFunction({expect: chai.expect}, function onUpdate(update){
                chai.expect(update).to.equal(chai.expect);
                updateCalled = true;
            })
            .then(function onfulfilled(result){
                chai.expect(updateCalled).to.equal(true, 'Update callback was not invoked');
                chai.expect(result).to.equal('if tested | 123... while tested | else tested | do while tested | else if tested | fe fi fi fo... foreach tested');
                
                done();
            },
            function onRejected(err){
                chai.expect.fail('Promise rejected unexpectedly: ' + err);
            });
        });
        it('should reject the returned Promise when appropriate', function(done) {
            cqTest.prmFunction({} /*no expect parameter will cause composed function to fail*/, 
            function onUpdate(update){
                chai.expect.fail('Update callback invoked unexpectedly');
            })
            .then(function onfulfilled(result){
                chai.expect.fail('Promise fulfilled unexpectedly');
            },
            function onRejected(err){
                chai.expect(err).to.equal('Required parameter `expect` not provided');

                done();
            });
        });
    });
});
