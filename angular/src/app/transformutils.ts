import {StringUtils} from "./stringutils";

export class TransformUtils {

  private static MATRIX = "matrix";
  private static currentOriginX;
  private static currentOriginY;
  public static ORIGINX = 'originX';
  public static ORIGINY = 'originY';

  public static moveOrigin(element: HTMLElement, offsetX: number, offsetY: number) {
    const scale = this.getCurrentZoomOfElement(element);

    const originValues = this.getOriginCoordinatesOfElement(element);

    if (this.currentOriginX === undefined && this.currentOriginY === undefined) {
      this.currentOriginX = originValues.get(this.ORIGINX);
      this.currentOriginY = originValues.get(this.ORIGINY);
    }

    if (originValues.size > 1) {
      let originX = (Number(originValues.get('originX')) - (2 * offsetX) / scale);
      let originY = (Number(originValues.get('originY')) - (2 * offsetY) / scale);
      this.changeCoordinatesOfOrigin(originX, originY, element);
    }
  }

  public static changeCoordinatesOfOrigin(newOriginX, newOriginY, element) {
    newOriginX = newOriginX + StringUtils.PX;
    newOriginY = newOriginY + StringUtils.PX;

    element.style.transformOrigin = newOriginX + StringUtils.SPACE + newOriginY + StringUtils.SPACE + '0px';
  }

  public static getCurrentZoomOfElement(element: HTMLElement): number {
    const transformStyle = element.style.transform;
    if (transformStyle.startsWith(this.MATRIX)) {
      let scale = transformStyle.split(",")[0];
      scale = scale.replace(this.MATRIX + StringUtils.LEFT_BRACKET, StringUtils.EMPTY);
      return Number(scale);
    }
    return 1;
  }

  public static getOriginCoordinatesOfElement(element: HTMLElement): Map<string, number> {
    let origin = element.style.transformOrigin;
    const originValues = origin.split(StringUtils.SPACE);
    if (originValues.length > 1) {
      originValues[0] = originValues[0].replace(StringUtils.SPACE, StringUtils.EMPTY).replace(StringUtils.PX, StringUtils.EMPTY);
      originValues[1] = originValues[1].replace(StringUtils.SPACE, StringUtils.EMPTY).replace(StringUtils.PX, StringUtils.EMPTY);
      return new Map([['originX', +originValues[0]], ['originY', +originValues[1]]]);
    }
    return new Map([['originX', 0], ['originY', 0]]);
  }
}
