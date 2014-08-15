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

  _init: function() {
    this._createOriginExp();
    this._createPostfixExp();
    this._createExpTree();
    this.value = this.calculate();
  },

  _reader: function(chars) {
    var type;
    if (ExpObject.RE.number.test(chars) == true) {
      type = 'number';
      chars = Number(chars);
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

  calculate: function() {

    traversal = function(treeNode) {
      if (treeNode.element.nodeType == "number") {
        return treeNode.element.nodeValue;
      } else if (treeNode.element.nodeValue == "+") {
        return ((traversal(treeNode.leftChild)) + (traversal(treeNode.rightChild)));
      } else if (treeNode.element.nodeValue == "-") {
        return (traversal(treeNode.leftChild) - traversal(treeNode.rightChild));
      } else if (treeNode.element.nodeValue == "*") {
        return (traversal(treeNode.leftChild) * traversal(treeNode.rightChild));
      } else if (treeNode.element.nodeValue == "/") {
        return (traversal(treeNode.leftChild) / traversal(treeNode.rightChild));
      } else {
        throw new Error('ExpObject: Invalid ExpTree.');
      }
    };

    return traversal(this.expTree);
  },

  /**
     * Draw the expression tree on a canvas
     * w: width of the canvas; h: height per level;
     * fs: font size; r: radius of a node circle;
     *
     * @method draw
     * @param {Number} w
     * @param {Number} h
     * @param {Number} fz
     * @param {Number} r
     * @return {Canvas Element}
     */
  draw: function(w, h, fs, r) {

    var canvas = document.createElement('canvas'); 
    canvas.width = w;
    canvas.height = w;

    var c = canvas.getContext('2d');

    //style config
    c.fillStyle = '#333';
    c.strokeStyle = 'bold #333';
    c.lineWidth = 1;
    c.font = "bold " + fs + "pt Helvetica";
    c.textAlign = "center";
    //

    var currentQueue = new Queue();
    var nextQueue;
    var n = 0;
    if (this.expTree != null) {
      currentQueue.enqueue(this.expTree);
      n++;
    }
    var alpha = Math.PI / 18;
    var k = h / Math.tan(alpha);
    var x0 = w / 2;
    var x = x0;
    var y = r;
    var p;
    var l = 0;

    while (currentQueue.size != 0 && n > 0) {
      nextQueue = new Queue();
      n = 0;
      p = 1;
      while (currentQueue.size != 0) {
        var tempNode = currentQueue.dequeue();
        if (tempNode != null) {
          if (tempNode.leftChild != null) n++;
          nextQueue.enqueue(tempNode.leftChild);
          if (tempNode.rightChild != null) n++;
          nextQueue.enqueue(tempNode.rightChild);

          var word = tempNode.element.toString();
          c.fillText(word, x, y + r / 3);
          c.beginPath();
          c.arc(x, y, r, 0, 2 * Math.PI, true);
          if (l) {
            c.moveTo(x + p * r * Math.cos(alpha), y - r * Math.sin(alpha));
            c.lineTo(x + p * (k - r * Math.cos(alpha)), y - h + r * Math.sin(alpha));
          }
          c.stroke();
        } else {
          nextQueue.enqueue(null);
          nextQueue.enqueue(null);
        }
        x += (2 * k);
        p *= (-1);
      }
      currentQueue = nextQueue;
      k /= 2;
      x0 -= k;
      x = x0;
      y += h;
      l++;
      alpha = Math.atan(2 * Math.tan(alpha));
    }

    return canvas;
  }

};
