import {Component, OnInit} from '@angular/core';
import {Converter} from "../converter/converter";
import {StringUtils} from "../stringutils";
import {CustomEventTarget, CustomHTMLCanvasElement} from "../customelements";

declare var Tiff: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private tifType = ['tiff', 'tif'];
  private fileLoader: any;
  private layerContainer: HTMLElement;
  private converter: Converter;

  constructor() {
  }

  ngOnInit() {
    this.fileLoader = <HTMLInputElement>document.getElementById('loadFile');
    this.layerContainer = document.getElementById('container');
  }

  openFileLoader() {
    this.fileLoader.click();
  }

  loadFile(e) {
    const files = e.target.files;
    if (files.length <= 0) {
      return;
    }
    const file = files[0];
    const extensionOfImage = file.name.split(StringUtils.DOT).pop().toLowerCase();
    if (this.tifType.indexOf(extensionOfImage) > -1) {
      this.readTiffImage(file);
    } else {
      this.readStandardImage(file);
    }
  }

  readStandardImage(file: File) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      const srcElement = document.createElement('src');
      (<HTMLSourceElement>srcElement).src = fileReader.result.toString();
      this.removeCanvas();
      this.layerContainer.appendChild(srcElement);
    }
  }

  readTiffImage(file: File) {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    Tiff.initialize({
      TOTAL_MEMORY: 100000000
    });
    fileReader.onloadend = (e) => {
      const tiff = new Tiff({
        buffer: (<CustomEventTarget>e.target).result
      });
      let tiffCanvas = tiff.toCanvas();
      Object.defineProperty(tiffCanvas, "pureCanvas", {value: tiff.toCanvas(), writable: false});
      tiffCanvas.id = 'drawing';
      tiffCanvas.style.width = '100%';
      tiffCanvas.style.height = '100%';
      this.removeCanvas();
      this.layerContainer.appendChild(tiffCanvas);
      this.converter = Converter.builder().setContainer(this.layerContainer).setImage(tiffCanvas).isDraggable().isZoomable().addFunctionalityOfPattern().build();
    };
  }

  private removeCanvas() {
    while (this.layerContainer.firstChild) {
      this.layerContainer.removeChild(this.layerContainer.firstChild);
    }
  }

  private clearContainer() {
    let canvas = <CustomHTMLCanvasElement>this.layerContainer.firstChild;
    const pureCanvas = canvas.pureCanvas;
    let ctx = pureCanvas.getContext('2d');
    const pureImg = ctx.getImageData(0, 0, pureCanvas.width, pureCanvas.height);
    canvas.getContext('2d').putImageData(pureImg, 0, 0);
    this.converter.clearPatterns();
  }

  private addNewPattern(event) {
    let target = event.target;
    if (target.addPattern === undefined) {
      Object.defineProperty(target, StringUtils.ADD_PATTERN, {value: true, writable: true});
    } else {
      target.addPattern === true ? target.addPattern = false : target.addPattern = true;
    }
    let removeButton = target.nextElementSibling;
    if (removeButton.removePattern == true) {
      removeButton.removePattern = false;
    }
  }

  private removePattern(event) {
    const target = event.target;
    if (target.removePattern === undefined) {
      Object.defineProperty(target, StringUtils.REMOVE_PATTERN, {value: true, writable: true});
    } else {
      target.removePattern === true ? target.removePattern = false : target.removePattern = true;
    }
    let addButton = target.previousElementSibling;
    if (addButton.addPattern == true) {
      addButton.addPattern = false;
    }
  }
}




