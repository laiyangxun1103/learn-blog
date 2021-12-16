---
title: 条件类型
author: xx
date: '2021-12-12'
---



# ceshi

## cc

### 类的写法

ES6新增class，让对象原型的写法更加清晰、更像面向对象编程语法

```
function Point(x, y) {
    this.x = x
    this.y = y
}

Point.prototype.toString = function () {
    return this.x + this.y
}

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    
    toString() {
        return this.x + this.y
    }
}
```

ES6的类完全可以看作是构造函数的另一种写法

```
typeof Point // 'function'
Point === Point.prototype.constructor
```

1. 类的数据类型就是函数  
2. 类中存在和构造函数一样的`prototype`属性，`prototype`对象的`constructor`属性指向类的本身，这意味着类的所有方法都定义在`prototype`属性上面  
3. 但类的内部所有定义的方法都是不可枚举的，这点与ES5的行为不一致

```
class Point{
    constructor() {}
    toString() {}
    toValue() {}
}

//等价于
Point.prototype = {
    constructor() {},
    toString() {},
    toValue() {}
}

// 通过Object.assign 可以一次向类添加多个方法
Object.assign(Point.prototype,{
    toString() {},
    toValue() {}
})

//获取原型上的属性
Object.keys(Point.prototype) // []
Object.getOwnPropertyNames(Point.prototype) // ['constructor', 'toString', 'toValue']
```

### constructor方法

`constructor()`方法是类的默认方法且必须存在，通过`new`生成对象实例时自动调用，如果没有显示定义，一个空的`constructor`方法会被默认添加。  
`constructor()`方法默认返回实例对象(this)，但可以指定返回一个全新的对象。

```
class Foo {
    constructor() {
        return Object.create(null)
    }
}
new Foo() instanceof Foo  // false
```

### 类的实例

与ES5一样，实例的属性除非定义在this对象上，否则都是定义在原型上。  
类的所有实例都共享一个原型对象，你可以通过某个实例的`__proto__`属性访问类的原型，为类添加共享的方法。

```
const p1 = new Point(2, 3)
const p2 = new Point(1, 2)

point.hasOwnProperty('x') //true
point.hasOwnProperty('y') //true
point.hasOwnProperty('toString') //false
point.__proto__.hasOwnProperty('toString') // true

p1.__proto__  === p2.__proto__
p1.__protp__.printName = function() {return 'ops' }
p1.printName() //'ops'
p2.printName() //'ops'

const p3 = new Point(2，3)
p3.printName() //'ops'

也可以通过Object.getprototypeOf()获取实例对象的原型
Object.getprototypeOf(p1) === p1.__proto__ = Point.prototype
```

### get / set 关键字

类的内部可以使用get 和 set 关键字，对某个属性设置存值函数和取值函数，拦截属性存取行为。  
存/取值函数都是设置在属性的Descriptor对象上的。

```
class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }

  get html() {
    return this.element.innerHTML;
  }

  set html(value) {
    this.element.innerHTML = value;
  }
}
```

### 静态方法/属性
在类中定义的方法前加上`static`关键字表示静态方法，该方法不会被实例所继承，而是直接通过类来调用。  

1. 如果静态方法包含`this`关键字，this指向这个类而不是实例。
2. 静态方法可以和非静态方法重名。
3. 父类的静态方法可以被子类继承并且可以从`super`对象上调用。

``` 
class Foo {
    static bar() {
        this.baz()
    }
    static baz() {
        console.log('hello')
    }
    baz() {
        console.log('world')
    }
}

Foo.bar()  //hello
const f = new Foo()
f.bar() // f.bar id not a function 

```
ES6明确规定，Class内部只有静态属性没有静态方法。但目前有提案提供了`static`去标识静态属性。

### 私有方法/属性
私有方法和私有属性是只能在类的内部访问的方法和属性，ES6不提供支持，可以通过以下两种方法变通实现。

1. 将私有方法移出类，因为类内部的所有方法都是对外可见的。

``` 
class Widget {
    foo(baz) {
        bar.call(this, baz)
    }
}

function bar(baz) {
    return this.snaf = baz
}
```
2. 利用Symbol值的唯一性，将私有方法的名字命名为一个Symbol值
```
const bar = Symbol('bar')
const snaf = Symbol('snaf')
class myClass {
    foo(baz) {
        this[bar](baz)
    }
    [bar](baz) {
        return this[snaf] = baz
    }
}
```
目前，有一个提案为`class`加了私有属性。方法是在属性名之前，使用`#`表示。

### new.target 属性

ES6为`new`命令引入了一个`new.target`属性，该属性一般用在构造函数之中，返回`new`命令作用于的那个构造函数。  
1. 如果构造函数不是通过`new`命令调用的，`new.target`会返回`undefined`。
2. Class内部调用`new.target`，返回当前Class。
3. 当子类继承父类时，`new.target`返回子类，利用这一特性可以写出不能独立使用、必须继承使用的类。

```
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三');  // 报错
```

```
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化');
    }
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}

var x = new Shape();  // 报错
var y = new Rectangle(3, 4);  // 正确
```

### 继承

Class可以通过`extends`关键字实现继承。  
子类必须在`constructor`方法中调用`super`方法。因为子类的`this`对象是先通过父类的构造函数完成创建，加工得到父类的属性和方法，再加上自身实例的属性和方法所构成。而ES5的继承，实质上是先创造子类的实例对象`this`，通过`parent.apply(this)`继承父类的方法，所以`this`关键字需在`super`调用后使用。  
子类如果没有定义`constructor`方法也会默认添加带`super`的空函数。

```
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    this.color = color; // ReferenceError
    super(x, y);
    this.color = color; // 正确
  }
}
```

### super关键字

`super`关键字的使用在于理解两种不同的使用场景以及内部的`this`指向

1. `super`当作函数调用，代表父类的构造函数，但是`super()`返回的是子类的实例。

```
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A() // A
new B() // B
```
`super()`在这里相当于`A.prototype.constructor.call(this)`，`super()`内部的`this`指向的是`B`。  

2. `super`当作对象时，在普通方法中指向父类的原型对象，在静态方法中，指向父类。  

ES6规定，在子类普通方法中通过`super`调用父类的方法时，方法内部的`this`指向当前的子类实例。

```
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3
    console.log(super.x) // undefined
    console.log(this.x) // 3
  }
  m() {
    super.print();
  }
}

let b = new B();
b.m() // 2
```

`super.print()`虽然调用的是`A.prototype.print()`，但是内部的`this`指向的是子类`B`的实例，所以输出的是`3`，所以如果通过`super`对某个属性赋值，属性相当于加到子类实例上。而当读取`super.x`时，访问的是`A.prototype.x`，返回`undefined`。

另外，联想到`super()`在静态方法中的使用时，方法内部的`this`指向当前的子类，而不是子类的实例。

```
class A {
  constructor() {
    this.x = 1;
  }
  static print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  static m() {
    super.print();
  }
}

B.x = 3;
B.m() // 3
```

















