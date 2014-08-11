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
  }
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
      temp = temp.next;
    }
    return output;
  }

};

//***************************************************

var ExpObject = function(input) {
  this.input = input;
  this.originExp = null;
  this.postfixExp = null;
  this.expTree = null;
  this._init();
};

ExpObject._ExpNodeElement = function(type, value) {
  this.nodeType = type;
  this.nodeValue = value;
}

ExpObject._ExpNodeElement.prototype.toString = function() {
  return this.nodeValue;
}

ExpObject.prototype = {

  value: null,
  isCalculated: false,
  initialized: false,

  _init: function() {},

  _reader: function(chars) {
    var type;
    if (typeof chars == 'number') {
      type = 'number';
    } else {
      type = chars;
    }
    return new ExpObject._ExpNodeElement(type, chars);
  },

  _dispExp: function(exp) {
    var disp1 = document.getElementById('disp1');
    disp1.innerHTML = exp.display();
  },

  createOriginExp: function() {
    this.originExp = new Queue();
    var pattern = /(?=\s*)((\d+(\.\d*)?)|([\+\-\*\/\(\)]))(?=\s*)/g
    while ((scan = pattern.exec(this.input)) != null) {
      var expNode = this._reader(scan[0]);
      this.originExp.enqueue(expNode);
    }

    if (this.originExp.size == 0) {
      console.log("ExpObject: Empty input.");
    } else {
      console.log("ExpObject: OriginExp parsed.");
    }
  },

  createPostfixExp: function() {},

  createExpTree: function() {},

  calculate: function() {}

};
