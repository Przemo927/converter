import {Component, OnInit} from '@angular/core';
import {Converter} from "../converter/converter";
import {StringUtils} from "../stringutils";

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
    const extensionOfImage = file.name.split('.').pop().toLowerCase();
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
      this.clearContainer();
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
      this.clearContainer();
      this.layerContainer.appendChild(tiffCanvas);
      Converter.builder().setContainer(this.layerContainer).setImage(tiffCanvas).isDraggable().isZoomable().addFunctionalityOfPattern().build();
    };
  }

  public clearContainer() {
    while (this.layerContainer.firstChild) {
      this.layerContainer.removeChild(this.layerContainer.firstChild);
    }
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

interface CustomEventTarget extends EventTarget {
  result: any;
}



