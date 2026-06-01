# JavaScript Interview Questions - JTG E Business Software Pvt Ltd
## Placement Drive Preparation Guide

---

## TABLE OF CONTENTS
1. [Hoisting](#hoisting)
2. [Scope & Scope Chain](#scope--scope-chain)
3. [let/const/var & Temporal Dead Zone (TDZ)](#letconstvar--temporal-dead-zone-tdz)
4. [Lexical Environment](#lexical-environment)
5. [Closures](#closures)
6. [this Keyword](#this-keyword)
7. [Event Loop & Call Stack](#event-loop--call-stack)
8. [setTimeout](#settimeout)
9. [Execution Context](#execution-context)
10. [First-Class Functions & Callbacks](#first-class-functions--callbacks)

---

## HOISTING

### Question 1.1: Basic Variable Hoisting
```javascript
console.log(a);
var a = 5;
console.log(a);
```

**Expected Output:**
```
undefined
5
```

**Explanation:**
- JavaScript hoisting moves variable declarations to the top of their scope before code execution
- `var a` is hoisted but not initialized, so it becomes `undefined`
- This is equivalent to: `var a; console.log(a); a = 5; console.log(a);`

**Key Concepts:**
- Hoisting moves declarations, not assignments
- `var` is hoisted with initial value `undefined`
- Function declarations are completely hoisted (both declaration and definition)

---

### Question 1.2: Function Hoisting
```javascript
console.log(add(2, 3));

function add(a, b) {
    return a + b;
}
```

**Expected Output:**
```
5
```

**Explanation:**
- Function declarations are completely hoisted (both the declaration and the body)
- The entire function is moved to the top of its scope
- You can call the function before declaring it

**Key Concepts:**
- Function declarations are fully hoisted
- Function expressions are NOT hoisted
- This is why `var functionName = function() {}` would give error if called before declaration

---

### Question 1.3: Hoisting with Function Expression
```javascript
console.log(greet());

var greet = function() {
    return "Hello";
};
```

**Expected Output:**
```
TypeError: greet is not a function
```

**Explanation:**
- `var greet` is hoisted but initialized as `undefined`
- When we try to call `greet()`, it's trying to invoke `undefined` as a function
- Function expressions are treated as variable assignments, not function declarations

---

### Question 1.4: Hoisting in IIFE
```javascript
var x = 10;
(function() {
    console.log(x);
    var x = 20;
})();
```

**Expected Output:**
```
undefined
```

**Explanation:**
- Even though `var x = 20` is inside the IIFE, the variable declaration is hoisted to the top of the function
- The outer `x = 10` is not accessible due to the inner `var x` declaration
- When `console.log(x)` executes, `x` is declared but not yet initialized (TDZ concept)

---

## SCOPE & SCOPE CHAIN

### Question 2.1: Global and Local Scope
```javascript
var global = "I'm global";

function outer() {
    var local = "I'm local";
    console.log(global);
    console.log(local);
}

outer();
console.log(local); // Error?
```

**Expected Output:**
```
I'm global
I'm local
ReferenceError: local is not defined
```

**Explanation:**
- Global variables are accessible everywhere
- Local variables are only accessible within their function scope
- Trying to access a local variable outside its scope throws a ReferenceError

---

### Question 2.2: Scope Chain
```javascript
var a = 1;

function outer() {
    var b = 2;
    
    function inner() {
        var c = 3;
        console.log(a, b, c);
    }
    
    inner();
}

outer();
```

**Expected Output:**
```
1 2 3
```

**Explanation:**
- Scope chain allows inner functions to access variables from outer scopes
- When a variable is not found in the current scope, JavaScript looks in the parent scope
- The chain continues until the global scope is reached
- Order: local scope → outer function scope → global scope

**Key Concepts:**
- Scope chain is one-directional (inner can access outer, but not vice versa)
- This forms the basis of closures

---

### Question 2.3: Scope Shadowing
```javascript
var x = 5;

function test() {
    var x = 10;
    console.log(x);
    
    function inner() {
        var x = 15;
        console.log(x);
    }
    
    inner();
    console.log(x);
}

test();
console.log(x);
```

**Expected Output:**
```
10
15
10
5
```

**Explanation:**
- When an inner scope declares a variable with the same name as an outer scope, it shadows the outer variable
- Each `console.log(x)` refers to the `x` in its respective scope

---

## let/const/var & TEMPORAL DEAD ZONE (TDZ)

### Question 3.1: var vs let vs const - Block Scope
```javascript
for (var i = 0; i < 3; i++) {
    console.log(i);
}
console.log(i); // Can we access i?

for (let j = 0; j < 3; j++) {
    console.log(j);
}
console.log(j); // Can we access j?
```

**Expected Output:**
```
0
1
2
3
ReferenceError: j is not defined
```

**Explanation:**
- `var` is function-scoped, so it's accessible outside the loop
- `let` and `const` are block-scoped (limited to the `{}` block)
- The loop variable `i` leaks to the outer scope with `var`, but `j` doesn't with `let`

---

### Question 3.2: Temporal Dead Zone (TDZ)
```javascript
console.log(x); // ReferenceError or undefined?
let x = 5;
```

**Expected Output:**
```
ReferenceError: Cannot access 'x' before initialization
```

**Explanation:**
- `let` and `const` are hoisted but NOT initialized
- There's a "Temporal Dead Zone" from the start of the block until the declaration is processed
- Accessing a variable in the TDZ throws a ReferenceError
- This is different from `var`, which is initialized as `undefined`

**Key Concepts:**
- TDZ = Time between entering scope and variable declaration
- Prevents common bugs and enforces better practices

---

### Question 3.3: const and Reassignment
```javascript
const PI = 3.14;
PI = 3.14159; // Error?

const obj = { name: "John" };
obj.name = "Jane"; // Allowed?
obj = {}; // Error?
```

**Expected Output:**
```
TypeError: Assignment to constant variable (1st attempt)
// obj.name = "Jane" works fine, logs: { name: "Jane" }
// obj = {} throws TypeError
```

**Explanation:**
- `const` prevents reassignment, not mutation
- You cannot reassign a `const` variable to a new value
- You CAN modify properties of objects/arrays declared with `const`
- `const` must be initialized at declaration

---

### Question 3.4: TDZ with Conditional
```javascript
var x = 5;

if (true) {
    console.log(x); // What happens?
    let x = 10;
}
```

**Expected Output:**
```
ReferenceError: Cannot access 'x' before initialization
```

**Explanation:**
- Even though there's a global `x = 5`, the local `let x = 10` creates a TDZ
- The entire block `{}` is the TDZ for the local `x`
- The outer `x` is shadowed and inaccessible in the block

---

## LEXICAL ENVIRONMENT

### Question 4.1: Lexical Environment Basics
```javascript
var x = 10;

function outer() {
    var y = 20;
    
    function inner() {
        var z = 30;
        console.log(x, y, z);
    }
    
    return inner;
}

const fn = outer();
fn();
```

**Expected Output:**
```
10 20 30
```

**Explanation:**
- Lexical Environment = current scope + reference to parent scope
- `inner()` has access to:
  - Its own scope (z = 30)
  - outer's scope (y = 20)
  - Global scope (x = 10)
- This is determined by WHERE the function is defined, not WHERE it's called
- This is why it's called "Lexical" scoping

---

### Question 4.2: Lexical vs Dynamic Scoping
```javascript
var a = "global";

function first() {
    var a = "in first";
    second();
}

function second() {
    console.log(a);
}

first();
```

**Expected Output:**
```
global
```

**Explanation:**
- JavaScript uses Lexical Scoping (also called Static Scoping)
- `second()` looks for `a` in its lexical (definition) environment, not its call environment
- Even though `second()` is called from `first()`, it doesn't have access to `first`'s `a`
- It only accesses the global `a`

**Key Concepts:**
- Lexical scope is determined at write-time, not runtime
- This is opposite to dynamic scoping (where you'd look at the call stack)

---

## CLOSURES

### Question 5.1: Basic Closure
```javascript
function makeFunc() {
    var name = "John";
    
    return function displayName() {
        console.log(name);
    };
}

const myFunc = makeFunc();
myFunc();
```

**Expected Output:**
```
John
```

**Explanation:**
- A closure is a function that has access to variables from its outer function's scope
- Even after `makeFunc()` has finished executing, `displayName()` still has access to `name`
- The inner function "remembers" or "closes over" the outer variables

---

### Question 5.2: Closure with Loop Problem
```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}
```

**Expected Output:**
```
3
3
3
(printed after 1 second, all three)
```

**Explanation:**
- All three callbacks close over the SAME `i` variable
- By the time the callbacks execute, the loop has finished and `i = 3`
- This is a classic closure + setTimeout gotcha

**How to Fix:**
```javascript
// Solution 1: Use let (block scope)
for (let i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i); // Prints: 0, 1, 2
    }, 1000);
}

// Solution 2: IIFE to create new scope
for (var i = 0; i < 3; i++) {
    (function(j) {
        setTimeout(function() {
            console.log(j); // Prints: 0, 1, 2
        }, 1000);
    })(i);
}
```

---

### Question 5.3: Counter using Closure
```javascript
function counter() {
    let count = 0;
    
    return {
        increment: function() {
            count++;
            return count;
        },
        decrement: function() {
            count--;
            return count;
        },
        getCount: function() {
            return count;
        }
    };
}

const c = counter();
console.log(c.increment()); // 1
console.log(c.increment()); // 2
console.log(c.decrement()); // 1
console.log(c.getCount());  // 1
```

**Expected Output:**
```
1
2
1
1
```

**Explanation:**
- The `count` variable is private and only accessible through the returned methods
- Each method maintains a reference to the same `count` variable
- This demonstrates data privacy using closures

---

### Question 5.4: Multiple Closures
```javascript
function outer(x) {
    return function(y) {
        return x + y;
    };
}

const add5 = outer(5);
const add10 = outer(10);

console.log(add5(3));  // 8
console.log(add10(3)); // 13
```

**Expected Output:**
```
8
13
```

**Explanation:**
- Each closure maintains its own independent lexical environment
- `add5` and `add10` have different values of `x` (5 and 10 respectively)
- Even though they're created by the same function, they don't share state

---

## THIS KEYWORD

### Question 6.1: this in Regular Function
```javascript
function greet() {
    console.log(this.name);
}

const person = {
    name: "Alice",
    greet: greet
};

person.greet(); // What is 'this'?
greet(); // What is 'this'?
```

**Expected Output:**
```
Alice
undefined (or error in strict mode)
```

**Explanation:**
- When called as `person.greet()`, `this` refers to the `person` object
- When called as `greet()`, `this` refers to the global object (or `undefined` in strict mode)
- The value of `this` depends on HOW the function is called, not WHERE it's defined

---

### Question 6.2: this in Arrow Function
```javascript
const person = {
    name: "Bob",
    greet: function() {
        console.log(this.name);
        
        const arrow = () => {
            console.log(this.name);
        };
        
        arrow();
    }
};

person.greet();
```

**Expected Output:**
```
Bob
Bob
```

**Explanation:**
- Arrow functions don't have their own `this`
- They inherit `this` from their enclosing lexical context
- The arrow function's `this` refers to the same `this` as the outer function

---

### Question 6.3: Implicit Binding
```javascript
const obj = {
    x: 42,
    getX: function() {
        return this.x;
    }
};

console.log(obj.getX()); // ?

const getX = obj.getX;
console.log(getX()); // ?
```

**Expected Output:**
```
42
undefined
```

**Explanation:**
- `obj.getX()` - `this` is bound to `obj` (implicit binding, because method is called on object)
- `getX()` - `this` is bound to global object (or undefined in strict mode)
- When you assign a method to a variable and call it, you lose the context

---

### Question 6.4: Explicit Binding with call, apply, bind
```javascript
function introduce(city, country) {
    console.log(this.name + " is from " + city + ", " + country);
}

const person = { name: "Charlie" };

// Using call
introduce.call(person, "NYC", "USA");

// Using apply
introduce.apply(person, ["NYC", "USA"]);

// Using bind
const boundIntroduce = introduce.bind(person, "NYC", "USA");
boundIntroduce();
```

**Expected Output:**
```
Charlie is from NYC, USA
Charlie is from NYC, USA
Charlie is from NYC, USA
```

**Explanation:**
- `call()` - invokes immediately, arguments as comma-separated values
- `apply()` - invokes immediately, arguments as array
- `bind()` - returns a new function, doesn't invoke immediately

---

### Question 6.5: this in Callbacks
```javascript
var length = 4;

function callback() {
    console.log(this.length);
}

const object = {
    length: 5,
    method: function(callback) {
        callback();
    }
};

object.method(callback);
```

**Expected Output:**
```
4
```

**Explanation:**
- Even though `callback` is passed to an object's method, it's still called as a regular function
- Regular function invocation means `this` refers to global object
- `this.length` evaluates to `window.length` (which is 4, set by `var length = 4`)

---

## EVENT LOOP & CALL STACK

### Question 7.1: Basic Event Loop
```javascript
console.log("Start");

setTimeout(function() {
    console.log("setTimeout");
}, 0);

console.log("End");
```

**Expected Output:**
```
Start
End
setTimeout
```

**Explanation:**
- JavaScript is single-threaded and uses an event loop
- The Call Stack executes synchronous code first
- Even with 0ms delay, `setTimeout` callback goes to the macrotask queue
- Event loop only processes the callback after the Call Stack is empty

**Key Concepts:**
- Call Stack: Executes synchronous code
- Web APIs: Handle async operations (setTimeout, promises, etc.)
- Event Queue: Holds callbacks ready to execute
- Event Loop: Checks if Call Stack is empty, then moves callbacks from queue to stack

---

### Question 7.2: Microtask vs Macrotask
```javascript
console.log("Script start");

setTimeout(() => {
    console.log("setTimeout");
}, 0);

Promise.resolve()
    .then(() => {
        console.log("Promise 1");
    })
    .then(() => {
        console.log("Promise 2");
    });

console.log("Script end");
```

**Expected Output:**
```
Script start
Script end
Promise 1
Promise 2
setTimeout
```

**Explanation:**
- Synchronous code executes first (Script start, Script end)
- Microtasks (Promises) execute before macrotasks (setTimeout)
- All microtasks are processed before moving to the next macrotask

**Event Loop Order:**
1. Execute all synchronous code
2. Execute all microtasks (Promises, async/await, MutationObserver)
3. Execute ONE macrotask
4. Go back to step 2

---

### Question 7.3: Complex Event Loop
```javascript
console.log("1");

setTimeout(() => {
    console.log("2");
}, 0);

Promise.resolve()
    .then(() => {
        console.log("3");
        setTimeout(() => {
            console.log("4");
        }, 0);
    })
    .then(() => {
        console.log("5");
    });

console.log("6");
```

**Expected Output:**
```
1
6
3
5
2
4
```

**Explanation:**
1. Synchronous: 1, 6
2. Microtasks: Promise executes console.log(3) and registers setTimeout
3. Microtasks: Second .then() executes console.log(5)
4. Macrotask: First setTimeout console.log(2)
5. Macrotask: Second setTimeout console.log(4)

---

### Question 7.4: Call Stack and Recursion
```javascript
function recursive(n) {
    if (n === 0) return;
    console.log(n);
    recursive(n - 1);
}

recursive(3);
```

**Expected Output:**
```
3
2
1
```

**Explanation:**
- Call Stack grows as functions are called
- Each recursive call pushes a new frame onto the stack
- When base case is reached, functions pop off the stack in reverse order
- If recursion is too deep, you get "Maximum call stack size exceeded"

---

## SETTIMEOUT

### Question 8.1: setTimeout Basic Behavior
```javascript
console.log("Before");

setTimeout(() => {
    console.log("Inside setTimeout");
}, 1000);

console.log("After");
```

**Expected Output:**
```
Before
After
Inside setTimeout
(1 second later)
```

**Explanation:**
- `setTimeout` is asynchronous
- The callback is not executed immediately
- The delay is the minimum wait time (not exact)

---

### Question 8.2: setTimeout with 0 Delay
```javascript
console.log("Start");

setTimeout(() => {
    console.log("setTimeout with 0 delay");
}, 0);

for (let i = 0; i < 1000000; i++) {}

console.log("End");
```

**Expected Output:**
```
Start
End
setTimeout with 0 delay
```

**Explanation:**
- Even 0ms delay means the callback goes to the event queue
- The loop blocks the event loop, delaying the setTimeout callback
- The minimum guaranteed delay is often 4-5ms in browsers

---

### Question 8.3: setTimeout Order with Multiple Timers
```javascript
setTimeout(() => console.log("A"), 300);
setTimeout(() => console.log("B"), 100);
setTimeout(() => console.log("C"), 200);
setTimeout(() => console.log("D"), 100);
```

**Expected Output:**
```
B
D
C
A
```

**Explanation:**
- setTimeout callbacks are processed in order of their delay time
- When two timers have the same delay (B and D - both 100ms), they execute in the order they were registered

---

### Question 8.4: setTimeout in Async Function
```javascript
async function test() {
    console.log("1");
    
    setTimeout(() => {
        console.log("2");
    }, 0);
    
    await Promise.resolve();
    
    console.log("3");
}

test();
console.log("4");
```

**Expected Output:**
```
1
4
3
2
```

**Explanation:**
1. `test()` calls, logs "1"
2. setTimeout callback registered (macrotask queue)
3. Function pauses at await
4. Synchronous code continues, logs "4"
5. Async function resumes, microtask (Promise) completes
6. Logs "3"
7. Event loop processes macrotask, logs "2"

---

## EXECUTION CONTEXT

### Question 9.1: Execution Context Phases
```javascript
console.log(x); // What is x here?
console.log(add(2, 3)); // What happens?

var x = 5;

function add(a, b) {
    return a + b;
}
```

**Expected Output:**
```
undefined
5
```

**Explanation:**
- JavaScript execution happens in 3 phases:
  1. **Creation Phase**: Variables/functions hoisted, `this` bound, scope chain set
  2. **Execution Phase**: Code executed line by line
  3. **Deletion Phase**: Variables/functions garbage collected (for function execution contexts)

**Creation Phase for this code:**
- `var x` declared and set to `undefined`
- Function `add` fully hoisted
- `this` bound

**Execution Phase:**
- `console.log(x)` → `undefined`
- `console.log(add(2, 3))` → creates new execution context, returns `5`

---

### Question 9.2: Nested Execution Contexts
```javascript
var global = "global";

function outer() {
    var outerVar = "outer";
    
    function inner() {
        var innerVar = "inner";
        console.log(global, outerVar, innerVar);
    }
    
    inner();
}

outer();
```

**Expected Output:**
```
global outer inner
```

**Explanation:**
- Global Execution Context created first
- `outer()` call creates a new execution context
- `inner()` call creates another new execution context
- Each context has its own scope chain to access variables

**Call Stack:**
```
[innerContext]
[outerContext]
[globalContext]
```

---

### Question 9.3: this in Different Contexts
```javascript
var name = "Global";

const obj = {
    name: "Object",
    method() {
        console.log(this.name);
        
        function regularFunc() {
            console.log(this.name);
        }
        
        const arrowFunc = () => {
            console.log(this.name);
        };
        
        regularFunc();
        arrowFunc();
    }
};

obj.method();
```

**Expected Output:**
```
Object
Global
Object
```

**Explanation:**
- `this` in `method()` = `obj` (implicit binding)
- `this` in `regularFunc()` = global object (new execution context)
- `this` in `arrowFunc()` = `obj` (inherits from method's context)

---

## FIRST-CLASS FUNCTIONS & CALLBACKS

### Question 10.1: Functions as Values
```javascript
const greet = function(name) {
    return "Hello, " + name;
};

function executeFunction(fn) {
    return fn("World");
}

console.log(executeFunction(greet));
```

**Expected Output:**
```
Hello, World
```

**Explanation:**
- Functions are first-class objects in JavaScript
- They can be assigned to variables
- They can be passed as arguments to other functions
- They can be returned from functions

---

### Question 10.2: Higher-Order Functions
```javascript
function multiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

**Expected Output:**
```
10
15
```

**Explanation:**
- A higher-order function is a function that takes or returns another function
- `multiplier()` returns a function that closes over `factor`
- Each returned function maintains its own closure

---

### Question 10.3: Callback Function
```javascript
function fetchData(callback) {
    setTimeout(() => {
        const data = { id: 1, name: "John" };
        callback(data);
    }, 1000);
}

fetchData(function(data) {
    console.log("Data received:", data);
});

console.log("Fetching data...");
```

**Expected Output:**
```
Fetching data...
Data received: { id: 1, name: 'John' }
(after 1 second)
```

**Explanation:**
- A callback is a function passed as an argument to be executed later
- Used commonly for asynchronous operations
- The callback executes when the operation completes

---

### Question 10.4: Array Methods with Callbacks
```javascript
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(function(num) {
    return num * 2;
});

const evens = numbers.filter(function(num) {
    return num % 2 === 0;
});

console.log(doubled); // [2, 4, 6, 8, 10]
console.log(evens);   // [2, 4]
```

**Expected Output:**
```
[2, 4, 6, 8, 10]
[2, 4]
```

**Explanation:**
- `map()` transforms each element using the callback
- `filter()` selects elements where callback returns truthy
- Both are examples of higher-order functions

---

### Question 10.5: Callback Hell / Pyramid of Doom
```javascript
// ❌ Callback Hell (Avoid this)
function processData(callback) {
    setTimeout(() => {
        callback("Data 1");
    }, 1000);
}

processData(function(data1) {
    console.log(data1);
    processData(function(data2) {
        console.log(data2);
        processData(function(data3) {
            console.log(data3);
        }, 1000);
    }, 1000);
}, 1000);

// ✅ Better with Promises
function processDataPromise() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("Data");
        }, 1000);
    });
}

processDataPromise()
    .then(data1 => {
        console.log(data1);
        return processDataPromise();
    })
    .then(data2 => {
        console.log(data2);
        return processDataPromise();
    })
    .then(data3 => {
        console.log(data3);
    });
```

**Explanation:**
- Deeply nested callbacks are hard to read and maintain (callback hell)
- Promises and async/await provide cleaner alternatives

---

## MIXED COMPLEX QUESTIONS

### Question 11.1: Combining All Concepts
```javascript
var x = 10;

function outer() {
    var x = 20;
    
    function inner() {
        var x = 30;
        console.log(x);
    }
    
    setTimeout(() => {
        console.log(x);
    }, 0);
    
    inner();
}

outer();
console.log(x);
```

**Expected Output:**
```
30
10
20
```

**Explanation:**
- `inner()` logs `x` from its scope = 30
- `setTimeout` callback logged first (but executes after), accesses outer's `x` = 20 (due to closure)
- After `outer()` completes, global `x` = 10 is logged
- Order: 30 (synchronous), then 10 (synchronous from global), then 20 (async from setTimeout)

**Wait, let me reconsider the order:**
Actually, the output should be:
```
30
20
10
```

Because:
1. Line 1: `inner()` executes synchronously, logs 30
2. Line 2: `setTimeout` is registered but doesn't execute yet
3. Line 3: Global `x` is logged from line after `outer()` call... wait, that executes AFTER `outer()` returns
4. Actually the order is: Synchronous code in outer (30), then synchronous code after outer (10), THEN setTimeout (20)

Actually:
```
30
10
20
```

---

### Question 11.2: Closure + setTimeout + Scope
```javascript
for (var i = 1; i <= 3; i++) {
    setTimeout(function() {
        console.log("i =", i);
    }, i * 1000);
}
```

**Expected Output:**
```
i = 4
i = 4
i = 4
(printed at 1s, 2s, 3s respectively)
```

**Explanation:**
- All callbacks close over the same `i`
- Loop completes, `i` becomes 4
- Callbacks execute but `i` is already 4
- Even though delays are different, by execution time `i = 4` for all

**Fix:**
```javascript
// Use let
for (let i = 1; i <= 3; i++) {
    setTimeout(function() {
        console.log("i =", i); // Prints: 1, 2, 3
    }, i * 1000);
}

// Or use IIFE
for (var i = 1; i <= 3; i++) {
    (function(j) {
        setTimeout(function() {
            console.log("i =", j); // Prints: 1, 2, 3
        }, j * 1000);
    })(i);
}
```

---

### Question 11.3: Event Loop + Promises + setTimeout
```javascript
console.log("A");

Promise.resolve()
    .then(() => {
        console.log("B");
        setTimeout(() => {
            console.log("C");
        }, 0);
    })
    .then(() => {
        console.log("D");
    });

setTimeout(() => {
    console.log("E");
}, 0);

console.log("F");
```

**Expected Output:**
```
A
F
B
D
E
C
```

**Explanation:**
1. Synchronous: A, F
2. Microtasks: Promise.then() → B, registers setTimeout for "C"
3. Microtasks: Next .then() → D
4. Macrotask: First setTimeout → E
5. Macrotask: Second setTimeout (registered in Promise.then) → C

---

### Question 11.4: this + Closure + Arrow Function
```javascript
const obj = {
    value: 42,
    
    regularMethod: function() {
        console.log(this.value); // 42
        
        const inner = () => {
            console.log(this.value); // 42
        };
        
        setTimeout(inner, 100);
    },
    
    arrowMethod: () => {
        console.log(this.value); // undefined
    }
};

obj.regularMethod();
obj.arrowMethod();
```

**Expected Output:**
```
42
42
undefined
```

**Explanation:**
- `regularMethod`'s `this` = `obj` → logs 42
- Arrow function in `regularMethod` inherits `this` from method → logs 42
- `arrowMethod`'s `this` = global (arrow functions don't get own `this`) → undefined

---

## QUICK REFERENCE SHEET

### Hoisting Rules
| Type | Hoisted? | Initialized? | Value |
|------|----------|--------------|-------|
| `var` | Yes | Yes | `undefined` |
| `let` | Yes | No (TDZ) | - |
| `const` | Yes | No (TDZ) | - |
| Function Declaration | Yes | Yes | Full Function |
| Function Expression | Yes | No (as var) | `undefined` |

### Scope Rules
| Type | Scope |
|------|-------|
| `var` | Function Scope |
| `let` | Block Scope |
| `const` | Block Scope |
| Function parameter | Function Scope |

### Event Loop Phases
1. Execute synchronous code (Call Stack)
2. Execute all microtasks (Promises, MutationObserver)
3. Execute ONE macrotask (setTimeout, setInterval, I/O)
4. Repeat from step 2

### this Binding Rules (in order of precedence)
1. **new keyword** → new instance
2. **call/apply/bind** → specified object
3. **Method invocation** → object before dot
4. **Function invocation** → global object (undefined in strict mode)
5. **Arrow function** → lexical `this`

---

## TIPS FOR JTG INTERVIEW

### What JTG Looks For:
1. **Understanding over memorization** - Explain WHY, not just WHAT
2. **Output prediction** - Practice predicting console output
3. **Code quality** - Write clean, readable, well-commented code
4. **Problem-solving** - Show your thinking process
5. **Real-world applications** - Connect concepts to practical examples

### Interview Tips:
1. **Read the code carefully** - Don't rush through output questions
2. **Trace the execution** - Use call stack visualization mentally
3. **Ask clarifying questions** - "Are we in strict mode?"
4. **Explain your reasoning** - "I think this will log X because..."
5. **Test edge cases** - What if the input is different?

### Common Traps:
- Confusing closure with scope
- Not understanding microtask vs macrotask
- Forgetting `this` is determined at call-time
- Missing the TDZ with `let/const`
- Hoisting with var inside functions

---

## PRACTICE SCHEDULE (2 Weeks)

**Week 1:**
- Day 1-2: Hoisting + Scope
- Day 3-4: let/const/var + TDZ
- Day 5-6: Closures
- Day 7: this keyword

**Week 2:**
- Day 1-2: Event Loop + setTimeout
- Day 3-4: Execution Context + First-Class Functions
- Day 5-6: Mixed Complex Questions
- Day 7: Mock Interview (solve questions without reference)

---

## RESOURCES FOR FURTHER PRACTICE

1. **Output Prediction**: JSPrep Pro (https://jsprep.pro/)
2. **Event Loop**: ExplainThis (https://www.explainthis.io/)
3. **MCQ Practice**: GeeksforGeeks JavaScript Interview Questions
4. **Real Scenarios**: LeetCode Front-End Section

---

**Last Updated**: 2026
**Difficulty Level**: Intermediate (College Placement - JTG Level)
**Total Questions**: 40+

Good luck with your placement! Remember, understanding the "why" is more important than memorizing answers. 🚀

