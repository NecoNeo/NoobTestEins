//****************************************************

/*
  node = {
    nodeType: type,
    nodeValue: value,
    leftChild: node,
    rightChild: node
  };
*/

var TreeNode = function (element) {
  this.element = element;
  this.leftChild = null;
  this.rightChild = null;
};

TreeNode.prototype = {
  //constructor: TreeNode,
  makeEmpty: function () {},

  setLeftChild: function (treeNode) {
    this.leftChild = treeNode;
  },

  setRightChild: function (treeNode) {
    this.rightChild = treeNode;
  },

  draw: function(){}
};

//***************************************************

var Stack = function () {
  this.size = 0;
  this.top = null;
};

Stack._Element = function (element, next) {
  this.element = element;
  this.next = next;
};

Stack.prototype = {

  makeEmpty: function () {},

  push: function (element) {
    var temp = this.top;
    this.top = new Stack._Element(element, temp);
    this.size++;
  },

  pop: function () {
    if (this.size == 0) {
      return null;
    }
    var temp = this.top;
    this.top = temp.next;
    this.size--;
    return temp.element;
  },

  display: function () {
    if (this.size == 0) 
      return "Empty Stack!"
    var temp = this.top;
    var output = " ";
    for (var i = 0; i < this.size; i++) {
      output = '<div style="border: solid 1px #000000; float: left">' + temp.element + '</div>' + output;
      console.log(temp.element);
      temp = temp.next;
    }
    return output;
  }
};

//***************************************************

var Queue = function () {
  this.size = 0;
  this.front = null;
  this.rear = null;
};

Queue._Element = function (element, next) {
  this.element = element;
  this.next = next;
};

Queue.prototype = {

  makeEmpty: function() {},

  enqueue: function(element) {
    if (this.size == 0) {
      this.front = new Queue._Element(element, null);
      this.rear = this.front;
      this.size++;
    } else {
      var temp = this.rear;
      this.rear = new Queue._Element(element, null);
      temp.next = this.rear;
      this.size++;
    }
  },

  dequeue: function() {
    if (this.size == 0) {
      return null;
    } else if (this.size == 1) {
      var temp = this.front;
      this.front = null;
      this.rear = null;
      this.size--;
      return temp.element;
    } else {
      var temp = this.front;
      this.front = temp.next;
      this.size--;
      return temp.element;
    }
  },

  display: function() {
    if (this.size == 0) 
      return "Empty Queue!"
    var temp = this.front;
    var output = " ";
    for (var i = 0; i < this.size; i++) {
      output = output + '<div style="border: solid 1px #000000; float: left">' + temp.element + '</div>';
      console.log(temp.element);
      temp = temp.next;
    }
    return output;
  }

};

//***************************************************

var ExpQueue = function() {
  Queue.call(this);
  this.index = null;
}

ExpQueue.prototype = new Queue();

ExpQueue.prototype.reset = function() {
  this.index = this.front;
  console.log('ExpQueue: Reset.');
};

ExpQueue.prototype.exec = function() {
  var temp = this.index;
  if (temp == null) {
    this.reset();
    return null;
  } else {
    this.index = temp.next;
    //console.log(temp.element);
    return temp.element;
  }
};

//***************************************************

var ExpObject = function(input) {
  this.input = input;
  this.originExp = null;
  this.postfixExp = null;
  this.expTree = null;
  this.value = null;

  this.status = {
    isCalculated: false,
    initialized: false,
  };

  this._init();
};

ExpObject._ExpNodeElement = function(type, value) {
  this.nodeType = type;
  this.nodeValue = value;
}

ExpObject._ExpNodeElement.prototype.toString = function() {
  return this.nodeValue;
}

ExpObject.RE = {
  validate: /^(?:\s*((?:\d+(?:\.\d*)?)|(?:[\+\-\*\/\(\)])))*\s*$/g,
  pattern: /(?=\s*)((\d+(\.\d*)?)|([\+\-\*\/\(\)]))(?=\s*)/g,
  number: /\d+(?:\.\d*)?/g
};

ExpObject.prototype = {

  _init: function() {},

  _reader: function(chars) {
    var type;
    if (ExpObject.RE.number.test(chars) == true) {
      type = 'number';
    } else if (chars == '+' || chars == '-') {
      type = 'plus';
    } else if (chars == '*' || chars == '/') {
      type = 'mult';
    } else if (chars == '(') {
      type = 'leftBracket';
    } else if (chars == ')') {
      type = 'rightBracket';
    } else {
      type = chars;     // this one leads to error;
    }
    ExpObject.RE.number.lastIndex = 0;
    return new ExpObject._ExpNodeElement(type, chars);
  },

  _dispExp: function(exp, div) {
    div.innerHTML = exp.display();
  },

  _createOriginExp: function() {
    this.originExp = new ExpQueue();
    var validate = ExpObject.RE.validate.test(this.input);
    ExpObject.RE.validate.lastIndex = 0;

    if (validate == false) {
      throw new Error('ExpObject: Invalid input.');
    }
    
    while ((scan = ExpObject.RE.pattern.exec(this.input)) != null) {
      var expNode = this._reader(scan[0]);
      this.originExp.enqueue(expNode);
    }

    if (this.originExp.size == 0) {
      console.log("ExpObject: Empty input.");
    } else {
      console.log("ExpObject: OriginExp parsed.");
    }

    this.originExp.reset();
  },

  _createPostfixExp: function() {
    this.postfixExp = new ExpQueue();
    var tempStack = new Stack();
    var temp;

    while ((temp = this.originExp.exec()) != null) {
      switch (temp.nodeType) {
        case "number":
          this.postfixExp.enqueue(temp);
          break;
        case "plus":
          if (tempStack.top == null) {
            tempStack.push(temp);
          } else if (tempStack.top.element.nodeType == "leftBracket") {
            tempStack.push(temp);
          } else if (tempStack.top.element.nodeType == "plus" || tempStack.top.element.nodeType == "mult") {
            do {
              var popped = tempStack.pop();
              this.postfixExp.enqueue(popped);
            } while (tempStack.top != null && (tempStack.top.element.nodeType == "plus" || tempStack.top.element.nodeType == "mult"));
            tempStack.push(temp);
          }
          break;
        case "mult":
          if (tempStack.top == null) {
            tempStack.push(temp);
          } else if (tempStack.top.element.nodeType == "leftBracket") {
            tempStack.push(temp);
          } else if (tempStack.top.element.nodeType == "plus") {
            tempStack.push(temp);
          } else if (tempStack.top.element.nodeType == "mult") {
            do {
              var popped = tempStack.pop();
              this.postfixExp.enqueue(popped);
            } while (tempStack.top != null && tempStack.top.element.nodeType == "mult");
            tempStack.push(temp);
          }
          break;
        case "leftBracket":
          tempStack.push(temp);
          break;
        case "rightBracket":
          while (tempStack.top != null && tempStack.top.element.nodeType != "leftBracket") {
            var popped = tempStack.pop();
            this.postfixExp.enqueue(popped);
          }
          if (tempStack.top == null) {
            throw new Error('ExpObject: Illegal right bracket.');
          }
          if (tempStack.top.element.nodeType == "leftBracket") {
            tempStack.pop();
          }
          break;
        default:
          throw new Error('ExpObject: Unknown Error!');
      }
    }

    while (tempStack.top != null) {
      if (tempStack.top.element.nodeType == "leftBracket") {
        throw new Error('ExpObject: Bracket not correctly closed!');
      }
      var popped = tempStack.pop();
      this.postfixExp.enqueue(popped);
    }

    console.log("ExpObject: postfixExp parsed.");
    this.postfixExp.reset();
  },

  _createExpTree: function() {
    this.expTree = null;
    var tempStack = new Stack();
    var temp;

    while ((temp = this.postfixExp.exec()) != null) {
      var tempNode = new TreeNode(temp);
      if (temp.nodeType == "number") {
        tempStack.push(tempNode);
      } else {
        if (tempStack.size < 2) {
          throw new Error('Invalid Exp cannot be parsed.');
        }
        tempNode.setRightChild(tempStack.pop());
        tempNode.setLeftChild(tempStack.pop());
        tempStack.push(tempNode);
      }
    }
    if (tempStack.size != 1) {
      throw new Error('Invalid Exp cannot be parsed.');
    }
    this.expTree = tempStack.pop();
    console.log('ExpObject: ExpTree parsed successfully.');
  },

  calculate: function() {}

};
