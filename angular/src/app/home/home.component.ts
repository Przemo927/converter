import {Component, OnInit} from '@angular/core';
import {ZoomRenderer} from "../converter/zoomrenderer";

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
  private scale = 1;
  private renderer;

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
    fileReader.onloadend = (e) => {
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
    let positionX;
    let positionY;
    fileReader.onloadend = (e) => {
      const tiff = new Tiff({
        buffer: (<CustomEventTarget>e.target).result
      });
      let tiffCanvas = tiff.toCanvas();
      tiffCanvas.id = 'drawing';
      tiffCanvas.style.width = '100%';
      tiffCanvas.style.height = '100%';
      this.clearContainer();
      this.layerContainer.appendChild(tiffCanvas);
      this.renderer = new ZoomRenderer(tiffCanvas);
    };
  }

  private clearContainer() {
    while (this.layerContainer.firstChild) {
      this.layerContainer.removeChild(this.layerContainer.firstChild);
    }
  }
}

interface CustomEventTarget extends EventTarget {
  result: any;
}



