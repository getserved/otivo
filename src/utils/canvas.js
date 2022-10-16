export const drawLine = (context, from, to) => {
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.lineWidth= 2;
    context.stroke();
    context.closePath();
}

export const drawText = (context, text, x, y) => {
    context.beginPath();
    context.fillText(text, x, y);
    context.closePath();
}

export const drawCircle = (context, x, y, r) => {
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.closePath();
    context.fill();
    context.stroke();
}

export const drawPolygon = (context, segments, canvasHeight) => {
    context.beginPath();
    const startSegment = segments ? segments[0]: null;
    context.moveTo(0, canvasHeight);
    if (startSegment) {
        context.lineTo(startSegment.from.x,  startSegment.from.y);
    }
    segments?.forEach( segment => {
        context.lineTo(segment.to.x, segment.to.y);
    });
    context.closePath();
    context.fill();
}