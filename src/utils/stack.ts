export class Stack<T> {
  _array: Array<T>;
  _index: number;

  constructor () {
    this._array = [];
    this._index = 0;
  }

  get () {
    return this._array[this._index];
  }

  pop () {
    this._array.pop();
    this._index--;
  }

  push (model: any) {
    this._array.push(model);
    this._index++;
  }
}