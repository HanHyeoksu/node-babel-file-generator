// const
const string = "string";

// class
class Test {
  getString() {
    return string;
  }

  getNumber() {
    return 0;
  }
}

// let
let test = new Test();
console.log('string from test instance', test.getString());
console.log('number from test instance', test.getNumber());

// object rest and spread
const print = (a, b, ...c) => console.log(a, b, c)
print('a', 'b', 'c', 'd', 'e');

// async/await
const asyncFunc = async a => {
  return `[async-${a}]`;
};

const testAsyncFunc = async () => {
  const result1 = await asyncFunc(1);
  const result2 = await asyncFunc(2);

  return result1 + result2;
}

testAsyncFunc()
.then(res => console.log(res));