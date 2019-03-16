export class ZoomRenderer {

  private zooming;
  private element;
  private currentTransformation;
  private widthElement;
  private heightElement;

  constructor(element: HTMLElement) {
    this.zooming = undefined;
    this.element = element;
    this.currentTransformation = new Transformations(0, 0, 0, 0, 1);
    this.initializeEventHandlers();
    this.widthElement = element.clientWidth;
    this.heightElement = element.clientHeight;
  }

  static getTransform(transformation) {
    let matrixTransformation = "matrix(";
    matrixTransformation += transformation.getScale().toFixed(1) + ",0,0," + transformation.getScale().toFixed(1)
      + "," + transformation.getTranslateX().toFixed(1) + "," + transformation.getTranslateY().toFixed(1) + ")";
    return matrixTransformation;
  };

  applyTransformations(transformation) {

    const origin = transformation.getOriginX().toFixed(10) + "px " + transformation.getOriginY().toFixed(10) + "px";
    this.element.style.setProperty("transform-origin", origin);
    this.element.style.setProperty("-ms-transform-origin", origin);
    this.element.style.setProperty("-o-transform-origin", origin);
    this.element.style.setProperty("-moz-transform-origin", origin);
    this.element.style.setProperty("-webkit-transform-origin", origin);

    const transform = ZoomRenderer.getTransform(transformation);
    this.element.style.setProperty("transform", transform);
    this.element.style.setProperty("-ms-transform", transform);
    this.element.style.setProperty("-o-transform", transform);
    this.element.style.setProperty("-moz-transform", transform);
    this.element.style.setProperty("-webkit-transform", transform);
  };

  private initializeEventHandlers() {

    window.addEventListener('resize', function (e) {
      this.widthElement = this.element.clientWidth;
      this.heightElement = this.element.clientHeight;
    }.bind(this));

    document.addEventListener('touchmove', function (e) {
      e.preventDefault();
    }, false);

    this.element.addEventListener('dragstart', function (e) {
      e.preventDefault();
    });

    this.element.addEventListener("wheel", function (e) {
      e.preventDefault();
      if (this.zooming == undefined) {
        const rect = this.element.getBoundingClientRect();
        const offsetLeft = rect.left + document.body.scrollLeft;
        const offsetTop = rect.top + document.body.scrollTop;
        const zooming = new MouseZoom(this.currentTransformation, e.pageX, e.pageY, offsetLeft, offsetTop, e.deltaY, this.widthElement, this.heightElement);
        this.zooming = zooming;

        const newTransformation = zooming.zoom();
        this.applyTransformations(newTransformation);
        this.currentTransformation = newTransformation;
        this.zooming = undefined;

        const maxY = this.element.clientHeight;
        const maxX = this.element.clientWidth;
      }
      return false;
    }.bind(this));
  }
}

export class MouseZoom {

  private currentTransformation;
  private offsetLeft;
  private offsetTop;
  private mouseX;
  private mouseY;
  private delta;
  private width;
  private height;

  constructor(currentTransformation, mouseX, mouseY, offsetLeft, offsetTop, delta, width, height) {
    this.currentTransformation = currentTransformation;
    this.offsetLeft = offsetLeft;
    this.offsetTop = offsetTop;
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.delta = delta;
    this.width = width;
    this.height = height;
  }

  zoom(): Transformations {
    const previousScale = this.currentTransformation.getScale();
    let newScale = previousScale + this.delta / 10;
    const maxscale = 20;
    if (newScale < 1) {
      newScale = 1;
    } else if (newScale > maxscale) {
      newScale = maxscale;
    }
    const imageX: any = (this.mouseX - this.offsetLeft).toFixed(2);
    const imageY: any = (this.mouseY - this.offsetTop).toFixed(2);

    const prevOrigX: any = (this.currentTransformation.getOriginX() * previousScale).toFixed(2);
    const prevOrigY: any = (this.currentTransformation.getOriginY() * previousScale).toFixed(2);

    let translateX: any = this.currentTransformation.getTranslateX();
    let translateY: any = this.currentTransformation.getTranslateY();

    let newOrigX: any = imageX / previousScale;
    let newOrigY: any = imageY / previousScale;

    if ((Math.abs(imageX - prevOrigX) > 1 || Math.abs(imageY - prevOrigY) > 1) && previousScale < maxscale) {
      translateX = translateX + (imageX - prevOrigX) * (1 - 1 / previousScale);
      translateY = translateY + (imageY - prevOrigY) * (1 - 1 / previousScale);
    }
    else if (previousScale != 1 || imageX != prevOrigX && imageY != prevOrigY) {
      newOrigX = prevOrigX / previousScale;
      newOrigY = prevOrigY / previousScale;
    }
    if (this.delta <= 0) {
      if (translateX + newOrigX + (this.width - newOrigX) * newScale <= this.width) {
        translateX = 0;
        newOrigX = this.width;
      } else if (translateX + newOrigX * (1 - newScale) >= 0) {
        translateX = 0;
        newOrigX = 0;
      }
      if (translateY + newOrigY + (this.height - newOrigY) * newScale <= this.height) {
        translateY = 0;
        newOrigY = this.height;
      } else if (translateY + newOrigY * (1 - newScale) >= 0) {
        translateY = 0;
        newOrigY = 0;
      }
    }
    return new Transformations(newOrigX, newOrigY, translateX, translateY, newScale);
  };
}

export class Transformations {

  private originX;
  private originY;
  private translateX;
  private translateY;
  private scale;

  constructor(originX, originY, translateX, translateY, scale) {
    this.originX = originX;
    this.originY = originY;
    this.translateX = translateX;
    this.translateY = translateY;
    this.scale = scale;
  }

  getScale() {
    return this.scale;
  };

  getOriginX() {
    return this.originX;
  };

  getOriginY() {
    return this.originY;
  };

  getTranslateX() {
    return this.translateX;
  };

  getTranslateY() {
    return this.translateY;
  };
}
