let canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d"), scale = 20;

// Agrupamos funciones de dibujo básicas
const drawP = (x, y, sz, c = "black") => { ctx.fillStyle = c; ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz); };

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i <= canvas.width; i += scale) {
        ctx.strokeStyle = "#ddd";
        ctx.strokeRect(i, 0, 0.1, canvas.height); // Líneas verticales
        ctx.strokeRect(0, i, canvas.width, 0.1); // Líneas horizontales
        ctx.fillStyle = "black";
        ctx.fillText(i / scale, i, canvas.height - 2);
        ctx.fillText(i / scale, 2, canvas.height - i);
    }
}

function drawLine(x1, y1, x2, y2, size, method) {
    // Conversión de coordenadas en una sola línea
    let X1 = x1 * scale, Y1 = canvas.height - y1 * scale;
    let X2 = x2 * scale, Y2 = canvas.height - y2 * scale;

    if (method === "dda") {
        let dx = X2 - X1, dy = Y2 - Y1, steps = Math.max(Math.abs(dx), Math.abs(dy));
        for (let i = 0, x = X1, y = Y1; i <= steps; i++, x += dx / steps, y += dy / steps) drawP(x, y, size);
    } else {
        let dx = Math.abs(X2 - X1), dy = Math.abs(Y2 - Y1), sx = X1 < X2 ? 1 : -1, sy = Y1 < Y2 ? 1 : -1, err = dx - dy;
        while (true) {
            drawP(X1, Y1, size);
            if (X1 === X2 && Y1 === Y2) break;
            let e2 = 2 * err;
            if (e2 > -dy) { err -= dy; X1 += sx; }
            if (e2 < dx) { err += dx; Y1 += sy; }
        }
    }
}

function procesar() {
    const getV = id => Number(document.getElementById(id).value);
    let pts = [getV("x1"), getV("y1"), getV("x2"), getV("y2"), getV("x3"), getV("y3")];
    let sz = getV("size"), meth = document.getElementById("method").value;

    drawGrid();
    // Verificación de triángulo (pendiente simple)
    if ((pts[3] - pts[1]) * (pts[4] - pts[2]) !== (pts[5] - pts[3]) * (pts[2] - pts[0])) {
        document.getElementById("mensaje").innerText = "SI se forma un triángulo";
        [[0, 1, 2, 3], [2, 3, 4, 5], [4, 5, 0, 1]].forEach(p => drawLine(pts[p[0]], pts[p[1]], pts[p[2]], pts[p[3]], sz, meth));
        for (let i = 0; i < 3; i++) {
            let cx = pts[i * 2] * scale, cy = canvas.height - pts[i * 2 + 1] * scale;
            drawP(cx, cy, sz + 3, "red");
            ctx.fillText(`${String.fromCharCode(65 + i)} (${pts[i * 2]},${pts[i * 2 + 1]})`, cx + 5, cy - 5);
        }
    } else document.getElementById("mensaje").innerText = "NO se forma un triángulo";
}

const clearCanvas = () => { document.getElementById("mensaje").innerText = ""; drawGrid(); };
drawGrid();