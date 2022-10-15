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
    context.fill();
    context.stroke();
    context.closePath();
}