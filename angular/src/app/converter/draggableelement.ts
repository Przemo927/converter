import {TransformUtils} from "../transformutils";

export class DraggableElement {

  private element;
  private container;
  private currentX;
  private currentY;
  private initialX;
  private initialY;
  private maxOriginX;
  private maxOriginY;

  constructor(element: HTMLElement) {
    this.element = element;
    this.prepareDraggableElement(element);
    this.container = document.getElementById('container');
  }

  public prepareDraggableElement(element: HTMLElement) {
    const dragBind = this.drag.bind(this);
    element.addEventListener('mousedown', function (e: MouseEvent) {
      this.initialX = this.currentX = e.clientX;
      this.initialY = this.currentY = e.clientY;
      element.addEventListener("mousemove", dragBind);
    }.bind(this));

    element.addEventListener("mouseup", function (e) {
      e.preventDefault();
      element.removeEventListener('mousemove', dragBind);
    });

    element.addEventListener('mouseout', function (e) {
      e.preventDefault();
      element.removeEventListener('mousemove', dragBind);
    })
  }

  private correctOriginIfWrongValue(originValue, axisType): number {
    if (originValue < 0) {
      return 0;
    } else if (axisType === 'X' && originValue > this.maxOriginX) {
      return this.maxOriginX;
    } else if (axisType === 'Y' && originValue > this.maxOriginY) {
      return this.maxOriginY;
    } else {
      return originValue;
    }
  }

  private drag(e: MouseEvent) {
    e.preventDefault();

    const offsetX = e.clientX - this.initialX;
    const offsetY = e.clientY - this.initialY;
    this.currentX += offsetX;
    this.currentY += offsetY;
    this.initialX = this.currentX;
    this.initialY = this.currentY;
    TransformUtils.moveOrigin(this.element, offsetX, offsetY, this.container);
  };
}
