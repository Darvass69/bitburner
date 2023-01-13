// give a type to a var using ":"
// types: number, string, boolean,
let x: number = 20;


// type for an array using []
let array: number[] = [1, 2, 3];


// tuples (array but each place has a specified type)
let tupple: [number, string] = [1, "Hello world"];
// this doesn't work
    // let tupple: [number, string] = [1, "Hello world", 1]
// tupple.push(1) works even if it shouldn't


// enums
// put enums as constants to help with .js files (see difference)
const enum Size {Small = 1, Medium, Large};
enum Size2 {Small = "s", Medium = "m", Large = "l"};
let mySize: Size = Size.Medium;
    // mySize == 2

// functions
// y = 44 --> optionnal with a default value
// z?: number --> optionnal
function Test_function(x: number, y = 44, z?: number): number{
    if (z == 2){
        return x * 8;
    }
    if (y > 42){
        return x - 42;
    }
    return x;
}

// objects
let obj1 = {id: 1}
// obj1.name = "obj1"; doesn't work, property doesn't exist

// we need to have the "name" property
let obj2: {
    id: number
    name: string
} = {id: 1, name: ""} 

// name is now optionnal
let obj3: {
    id: number
    name?: string
} = {id: 1} 

// read only, id is now read only
let obj4: {
    readonly id: number
    name?: string
} = {id: 1} 

// functions inside obj
let obj5: {
    readonly id: number
    name?: string
    do_something: (date:Date) => void
} = {
    id: 1,
    name : "obj5",
    do_something: (date) => {
        console.log(date)
    }
}


// type alias
type obj_type_1 = {
    readonly id: number
    name?: string
    do_something: (date:Date) => void
}

let obj6: obj_type_1 = {
    id: 1,
    name : "obj5",
    do_something: (date) => {
        console.log(date)
    }
}


// type union "|"
function union_type(thing: number | string): number {
    if (typeof thing === 'number') {
        return thing * 2;
    }
    else {
        return parseInt(thing);
    }
}


// type intersection "&"
type Draggable = {
    drag: () => void;
};

type Resizable = {
    resize: () => void;
}

type UIWidget = Draggable & Resizable;

let textBox: UIWidget = {
    drag: () => {},
    resize: () => {}
}


// literal type
type Quantity = 50 | 100 | "yes";
let quantity: Quantity = "yes";


// nullable
function greet(name: string | null | undefined) {}



    // optionnal chaining
type obj_type_2 = {prop: number}

function can_have_null_property(x: number): obj_type_2 | null {
    if (x == 0){
        return null
    }
    return {prop: x};
}
let g = can_have_null_property(1)
// optionnal property access operator "?."
// console.log(g.prop)
console.log(g?.prop)

// optional element access
array?.[0] // only access if array[0] exist

// optionnal call
let log: any = null;
log?.('a'); // executed only if log is an actual function

