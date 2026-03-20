let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let scale = 20;

/* FUNCION OBLIGATORIA */

function drawPoint(ctx, x, y, size) {
    ctx.fillRect(x - size/2, y - size/2, size, size);
}

/* REJILLA POSITIVA */

function drawGrid(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle="#ddd";

    for(let i=0;i<=canvas.width;i+=scale){

        ctx.beginPath();
        ctx.moveTo(i,0);
        ctx.lineTo(i,canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0,i);
        ctx.lineTo(canvas.width,i);
        ctx.stroke();
    }

    ctx.strokeStyle="black";

    ctx.beginPath();
    ctx.moveTo(0,canvas.height);
    ctx.lineTo(canvas.width,canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,canvas.height);
    ctx.stroke();

    /* NUMEROS EN EXTREMOS */

    for(let i=0;i<=canvas.width;i+=scale){

        let num = i/scale;

        ctx.fillText(num,i,canvas.height-2);
        ctx.fillText(num,2,canvas.height-i);
    }
}
// coordenadas en el vertice 
function drawVertex(x,y,size,label){

    let cx = x * scale;
    let cy = canvas.height - y * scale;

    // dibujar punto
    drawPoint(ctx,cx,cy,size+3);

    // escribir coordenada
    ctx.fillStyle="red";
    ctx.fillText(label + " ("+x+","+y+")", cx+5 , cy-5);

    ctx.fillStyle="black";
}

/* DDA */

function drawDDA(x1,y1,x2,y2,size){

    let dx = x2-x1;
    let dy = y2-y1;

    let steps = Math.max(Math.abs(dx),Math.abs(dy));

    let xinc = dx/steps;
    let yinc = dy/steps;

    let x=x1;
    let y=y1;

    for(let i=0;i<=steps;i++){

        drawPoint(ctx,x,y,size);

        x+=xinc;
        y+=yinc;
    }
}

/* BRESENHAM */

function drawBresenham(x1,y1,x2,y2,size){

    let dx=Math.abs(x2-x1);
    let dy=Math.abs(y2-y1);

    let sx=(x1<x2)?1:-1;
    let sy=(y1<y2)?1:-1;

    let err=dx-dy;

    while(true){

        drawPoint(ctx,x1,y1,size);

        if(x1===x2 && y1===y2) break;

        let e2=2*err;

        if(e2>-dy){
            err-=dy;
            x1+=sx;
        }

        if(e2<dx){
            err+=dx;
            y1+=sy;
        }
    }
}

/* FUNCION PEDIDA EN EL ENUNCIADO */

function drawLine(x1, y1, x2, y2, size, method) {

    /* operaciones comunes */

    x1 = x1*scale;
    y1 = canvas.height - y1*scale;

    x2 = x2*scale;
    y2 = canvas.height - y2*scale;

    /* decision del algoritmo */

    if(method==="dda"){
        drawDDA(x1,y1,x2,y2,size);
    }else{
        drawBresenham(x1,y1,x2,y2,size);
    }
}

/* VERIFICAR TRIANGULO */

function esTriangulo(x1,y1,x2,y2,x3,y3){

    let m1=(y2-y1)/(x2-x1);
    let m2=(y3-y2)/(x3-x2);

    return m1!==m2;
}

function procesar(){

    let x1=Number(document.getElementById("x1").value);
    let y1=Number(document.getElementById("y1").value);

    let x2=Number(document.getElementById("x2").value);
    let y2=Number(document.getElementById("y2").value);

    let x3=Number(document.getElementById("x3").value);
    let y3=Number(document.getElementById("y3").value);

    let size=Number(document.getElementById("size").value);
    let method=document.getElementById("method").value;

    drawGrid();

    if(esTriangulo(x1,y1,x2,y2,x3,y3)){

        document.getElementById("mensaje").innerText="SI se forma un triángulo";

        drawLine(x1,y1,x2,y2,size,method);
        drawLine(x2,y2,x3,y3,size,method);
        drawLine(x3,y3,x1,y1,size,method);

        drawVertex(x1,y1,size,"A");
        drawVertex(x2,y2,size,"B");
        drawVertex(x3,y3,size,"C");

    }else{

        document.getElementById("mensaje").innerText="NO se forma un triángulo";
    }
}

function clearCanvas(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    document.getElementById("mensaje").innerText="";

    drawGrid();
}

drawGrid();