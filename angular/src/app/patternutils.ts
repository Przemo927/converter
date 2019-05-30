import {Pattern} from "./converter/pattern";

export class PatternUtils {

  public static renumberPatterns(idRemovedPattern: number, patterns: Pattern[]) {
    for (let i = idRemovedPattern; i < patterns.length; i++) {
      const pattern = patterns[i];
      pattern.id = i;
      patterns[i] = pattern;
    }
  }

  public static returnPatternWhichIsCoveredByDraggingPattern(patterns: Pattern[], draggingPattern: Pattern): Pattern[] {
    let coveredPatterns = [];
    if (draggingPattern !== null) {
      for (let pattern of patterns) {
        if ((pattern.xMin > draggingPattern.xMin && pattern.yMin > draggingPattern.yMin
          && pattern.xMin < draggingPattern.xMax && pattern.yMin < draggingPattern.yMax) ||
          (pattern.xMax > draggingPattern.xMin && pattern.yMax > draggingPattern.yMin
            && pattern.xMax < draggingPattern.xMax && pattern.yMax < draggingPattern.yMax) ||
          (pattern.xMin > draggingPattern.xMin && pattern.yMax > draggingPattern.yMin
            && pattern.xMin < draggingPattern.xMax && pattern.yMax < draggingPattern.yMax) ||
          (pattern.xMax > draggingPattern.xMin && pattern.yMin > draggingPattern.yMin
            && pattern.xMax < draggingPattern.xMax && pattern.yMin < draggingPattern.yMax) ||
          (pattern.xMin > draggingPattern.xMin && pattern.yMin > draggingPattern.yMin
            && pattern.xMax < draggingPattern.xMax && pattern.yMax < draggingPattern.yMax) ||
          (pattern.xMin < draggingPattern.xMin && pattern.yMin < draggingPattern.yMin
            && pattern.xMax > draggingPattern.xMax && pattern.yMax > draggingPattern.yMax)
          && pattern.id !== draggingPattern.id) {
          coveredPatterns[coveredPatterns.length] = pattern;
        }
      }
    }
    return coveredPatterns;
  }

  public static refreshPatterns(patterns: Pattern[], ctx: CanvasRenderingContext2D) {
    for (let pattern of patterns) {
      ctx.fillStyle = pattern.colorOfPattern;
      ctx.fillRect(pattern.xMin, pattern.yMin, pattern.width, pattern.height);
    }
  }

  public static refreshSectionOfImage(pattern: Pattern, pureCanvas: HTMLCanvasElement) {
    const ctx = pureCanvas.getContext('2d');
    pattern.sectionOfImage = ctx.getImageData(pattern.xMin, pattern.yMin, pattern.width + 10, pattern.height + 10);
  }
}
