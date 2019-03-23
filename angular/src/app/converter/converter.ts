import {ZoomableElement} from "./zoomableelement";
import {DraggableElement} from "./draggableelement";

export class Converter {

  private element;
  private zoom = false;
  private dragg = false;

  public static builder() {
    return new Converter();
  }

  public setImage(element: HTMLElement): Converter {
    this.element = element;
    return this;
  }

  public isZoomable(): Converter {
    this.zoom = true;
    return this;
  }

  public isDraggable(): Converter {
    this.dragg = true;
    return this;
  }

  public build() {
    if (this.zoom) {
      new ZoomableElement(this.element);
    }
    if (this.dragg) {
      new DraggableElement(this.element);
    }
  }
}
