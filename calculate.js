//****************************************************

/*
  node = {
    nodeType: type,
    nodeValue: value,
    leftChild: node,
    rightChild: node
  };
*/

var ExpTreeNode = function (element) {
  this.element = element;
  this.leftChild = null;
  this.rightChild = null;
};

ExpTreeNode.prototype = {
  //constructor: ExpTreeNode,
  makeEmpty: function () {},

  setLeftChild: function (expTreeNode) {
    this.leftChild = expTreeNode;
  },

  setRightChild: function (expTreeNode) {
    this.rightChild = expTreeNode;
  }
};

//***************************************************

var Stack = function () {
  this.length = 0;
  this.top = null;
};

Stack.prototype = {
  makeEmpty: function () {},

  push: function (element) {
    var temp = this.top;
    this.top = new StackNode(element, temp);
    this.length++;
  },

  pop: function () {
    if (this.length == 0) {
      return null;
    }
    var temp = this.top;
    this.top = temp.next;
    this.length--;
    return temp.element;
  },

  _display: function () {
    if (this.length == 0) 
      return "Empty Stack!"
    var temp = this.top;
    var output = " ";
    for (var i = 0; i < this.length; i++) {
      output = '<div style="border: solid 1px #000000; float: left">' + temp.element + '</div>' + output;
      temp = temp.next;
    }
    return output;
  }
};

var StackNode = function (element, next) {
  this.element = element;
  this.next = next;
};

//***************************************************

var ExpNodeElement = function(type, value){
  this.nodeType = type;
  this.nodeValue = value;
}


