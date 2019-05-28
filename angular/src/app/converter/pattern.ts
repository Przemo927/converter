export class Pattern {
  private _id: number;
  private _xMin: number;
  private _yMin: number;
  private _xMax: number;
  private _yMax: number;
  private _width: number;
  private _height: number;
  private _sectionOfImage: ImageData;
  private _colorOfPattern: string;

  constructor(id, xMin, yMin, xMax, yMax, width, height, sectionOfImage, colorOfPattern) {
    this._id = id;
    this._xMin = xMin;
    this._yMin = yMin;
    this._xMax = xMax;
    this._yMax = yMax;
    this._width = width;
    this._height = height;
    this._sectionOfImage = sectionOfImage;
    this._colorOfPattern = colorOfPattern;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
  }

  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
  }

  get xMin(): number {
    return this._xMin;
  }

  set xMin(value: number) {
    this._xMin = value;
  }

  get yMin(): number {
    return this._yMin;
  }

  set yMin(value: number) {
    this._yMin = value;
  }

  get xMax(): number {
    return this._xMax;
  }

  set xMax(value: number) {
    this._xMax = value;
  }

  get yMax(): number {
    return this._yMax;
  }

  set yMax(value: number) {
    this._yMax = value;
  }

  get sectionOfImage(): ImageData {
    return this._sectionOfImage;
  }

  set sectionOfImage(value: ImageData) {
    this._sectionOfImage = value;
  }

  get colorOfPattern(): string {
    return this._colorOfPattern;
  }

  set colorOfPattern(value: string) {
    this._colorOfPattern = value;
  }
}
