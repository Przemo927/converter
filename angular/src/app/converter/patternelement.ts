import {TransformUtils} from "../transformutils";
import {Pattern} from "./pattern";
import {StringUtils} from "../stringutils";
import {PatternUtils} from "../patternutils";
import {CustomHTMLCanvasElement, CustomHTMLElement} from "../customelements";

export class PatternElement {

  private container: HTMLElement;
  private canvas: CustomHTMLCanvasElement;
  private addPatternButton: CustomHTMLElement;
  private removePatternButton: CustomHTMLElement;
  private previousX;
  private previousY;
  private img;
  private patterns: Pattern[] = [];
  private actualPattern: Pattern;
  private coveredPatterns: Pattern[] = [];
  private ctx: CanvasRenderingContext2D;

  constructor(container: HTMLElement, canvas: HTMLCanvasElement, addPatternButton: HTMLElement, removePatternButton: HTMLElement) {
    this.container = container;
    this.canvas = canvas;
    this.removePatternButton = removePatternButton;
    this.addPatternButton = addPatternButton;
    this.ctx = canvas.getContext('2d');
    this.preparePatternElement(container);
  }

  drawPattern(x: number, y: number, width: number, height: number) {
    let color = RGBAGenerator.generateRandomRGBAColor();
    this.ctx.fillStyle = color;
    let xMin;
    let xMax;
    let yMin;
    let yMax;
    if (width < 0) {
      xMin = x + width;
      xMax = x;
      width *= -1;
    } else {
      xMax = x + width;
      xMin = x;
    }
    if (height < 0) {
      yMin = y + height;
      yMax = y;
      height *= -1;
    } else {
      yMax = y + height;
      yMin = y;
    }
    this.patterns[this.patterns.length] = new Pattern(this.patterns.length, xMin, yMin, xMax, yMax, width, height, this.ctx.getImageData(xMin, yMin, width + 10, height + 10), color);
    this.ctx.fillRect(xMin, yMin, width, height);
  }

  private movePattern(x: number, y: number, width: number, height: number) {
    this.ctx.fillStyle = this.actualPattern.colorOfPattern;
    if (this.img === undefined || this.img === null) {
      this.ctx.putImageData(this.actualPattern.sectionOfImage, this.actualPattern.xMin, this.actualPattern.yMin);
      this.img = this.actualPattern.sectionOfImage;
    } else {
      this.ctx.putImageData(this.img, this.actualPattern.xMin, this.actualPattern.yMin);
    }
    this.actualPattern.xMin += x - this.previousX;
    this.actualPattern.yMin += y - this.previousY;
    this.actualPattern.xMax += x - this.previousX;
    this.actualPattern.yMax += y - this.previousY;
    this.img = this.ctx.getImageData(this.actualPattern.xMin, this.actualPattern.yMin, width + 10, height + 10);
    this.actualPattern.sectionOfImage = this.img;
    this.previousX = x;
    this.previousY = y;
    this.ctx.fillRect(this.actualPattern.xMin, this.actualPattern.yMin, width, height);
  }

  public preparePatternElement(element: HTMLElement) {
    let actualX;
    let actualY;
    let beginningX;
    let beginningY;
    let isAddPatternAvailable;
    let coefficients;
    const rectCanvas = this.canvas.getBoundingClientRect();
    const mouseMoveEventBinded = this.mouseMoveEvent.bind(this);
    element.addEventListener('mousedown', function (e: MouseEvent) {
      coefficients = this.measureCoeffcients();
      isAddPatternAvailable = this.addPatternButton.addPattern;
      beginningX = e.clientX;
      beginningY = e.clientY;
      actualX = (e.clientX - rectCanvas.left) * coefficients[0];
      actualY = (e.clientY - rectCanvas.top) * coefficients[1];
      if (e.ctrlKey) {
        if (this.removePatternButton.removePattern) {
          this.setEditingPattern(actualX, actualY);
          this.removePattern();
        }
        else if (!isAddPatternAvailable) {
          this.previousX = actualX;
          this.previousY = actualY;
          this.setEditingPattern(actualX, actualY);
          this.addCoveredPatterns();
          const indexOfCoveredPattern = this.coveredPatterns.indexOf(this.actualPattern);
          this.refreshSectionOfImageCoveredPattern(indexOfCoveredPattern);
          element.addEventListener('mousemove', mouseMoveEventBinded);
        }
      }
    }.bind(this));
    element.addEventListener('mouseup', function (e) {
        if (e.ctrlKey) {
          let width = (e.clientX - beginningX) * coefficients[0];
          let height = (e.clientY - beginningY) * coefficients[1];
          if (isAddPatternAvailable) {
            this.drawPattern(actualX, actualY, width, height);
          }
        }
        element.removeEventListener('mousemove', mouseMoveEventBinded);
      }.bind(this)
    );
  }

  private addCoveredPatterns() {
    const newConveredPatterns:Pattern[] = PatternUtils.returnPatternWhichIsCoveredByDraggingPattern(this.patterns, this.actualPattern);
    newConveredPatterns.forEach(pattern=>{
      if(!this.coveredPatterns.includes(pattern)){
        this.coveredPatterns.push(pattern);
      }
    });
  }

  private refreshSectionOfImageCoveredPattern(indexOfCoveredPattern: number) {
    if (indexOfCoveredPattern !== -1) {
      PatternUtils.refreshSectionOfImage(this.actualPattern, this.canvas.pureCanvas);
      this.coveredPatterns.splice(indexOfCoveredPattern, 1);
    }
  }

  private measureCoeffcients(): number[] {
    const currentZoom = TransformUtils.getCurrentZoomOfElement(this.canvas);
    const rectContainer = this.container.getBoundingClientRect();
    const coefficientWidth = this.canvas.width / rectContainer.width / currentZoom;
    const coefficientHeight = this.canvas.height / rectContainer.height / currentZoom;
    return [coefficientWidth, coefficientHeight];
  }

  private removePattern() {
    if (this.actualPattern !== null && this.actualPattern !== undefined) {
      this.ctx.putImageData(this.actualPattern.sectionOfImage, this.actualPattern.xMin, this.actualPattern.yMin);
      const idRemovingPattern = this.actualPattern.id;
      this.patterns.splice(idRemovingPattern, 1);
      PatternUtils.renumberPatterns(idRemovingPattern, this.patterns);
    }
  }

  private mouseMoveEvent(e: any) {
    let rectCanvas = this.canvas.getBoundingClientRect();
    let currentZoom = TransformUtils.getCurrentZoomOfElement(this.canvas);
    let rectContainer = this.container.getBoundingClientRect();
    let x = (e.clientX - rectCanvas.left) * this.canvas.width / rectContainer.width / currentZoom;
    let y = (e.clientY - rectCanvas.top) * this.canvas.height / rectContainer.height / currentZoom;
    if (this.actualPattern !== null && this.actualPattern !== undefined) {
      this.movePattern(x, y, this.actualPattern.width, this.actualPattern.height);
    }
    PatternUtils.refreshPatterns(this.coveredPatterns, this.ctx);
  }

  private setEditingPattern(x: number, y: number): boolean {
    if (this.patterns.length == 0 || (this.actualPattern !== null && this.actualPattern !== undefined && x >= this.actualPattern.xMin &&
      x <= this.actualPattern.xMax && y >= this.actualPattern.yMin && y <= this.actualPattern.yMax)) {
      return;
    } else {
      for (let pattern of this.patterns) {
        if (pattern == undefined) {
          continue;
        }
        if (x >= pattern.xMin && x <= pattern.xMax && y >= pattern.yMin && y <= pattern.yMax) {
          this.actualPattern = pattern;
          this.img = null;
          return;
        }
      }
    }
    this.actualPattern = null;
  }
}

export class RGBAGenerator {

  public static generateRandomRGBAColor(): string {
    let rgba = 'rgba(';
    rgba += Math.floor(Math.random() * 256) + StringUtils.COMMA + Math.floor(Math.random() * 256) + StringUtils.COMMA + Math.floor(Math.random() * 256) + ",1)";
    return rgba;
  }
}
