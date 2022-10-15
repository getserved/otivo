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
    const startSegment = segments[0];
    context.moveTo(0, canvasHeight);
    context.lineTo(startSegment.from.x, startSegment.from.y);
    console.log('segments', segments)
    segments.forEach( segment => {
        console.log('seg', segment);
        context.lineTo(segment.to.x, segment.to.y);
    });
    context.closePath();
    context.fill();
}