export interface CustomHTMLElement extends HTMLElement {
  addPattern?: boolean;
  removePattern?: boolean;
}

export interface CustomHTMLCanvasElement extends HTMLCanvasElement {
  pureCanvas?: HTMLCanvasElement;
}

export interface CustomEventTarget extends EventTarget {
  result: any;
}
