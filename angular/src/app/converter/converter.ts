import {ZoomableElement} from "./zoomableelement";
import {DraggableElement} from "./draggableelement";
import {PatternElement} from "./patternelement";
import {StringUtils} from "../stringutils";

export class Converter {

  private element;
  private container;
  private zoom = false;
  private dragg = false;
  private pattern = false;

  public static builder() {
    return new Converter();
  }

  public setContainer(element: HTMLElement): Converter {
    this.container = element;
    return this;
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

  public addFunctionalityOfPattern(): Converter {
    this.pattern = true;
    return this;
  }

  public build() {
    if (this.zoom) {
      new ZoomableElement(this.element);
    }
    if (this.dragg) {
      new DraggableElement(this.element);
    }
    if(this.pattern){
      new PatternElement(this.container, this.element, document.getElementById(StringUtils.ADD_PATTERN), document.getElementById(StringUtils.REMOVE_PATTERN));
    }
  }
}
