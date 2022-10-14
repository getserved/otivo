export const drawLine = (context, from, to) => {
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.lineWidth= 2;
    context.stroke();
}

export const drawText = (context, text, x, y) => {
    context.beginPath();
    context.fillText(text, x, y);
}