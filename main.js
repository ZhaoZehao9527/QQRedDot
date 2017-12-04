function drawStartCircle(x, y, r) {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.fillStyle = "red";
    context.fill();
    context.closePath();


}

function drawEndCircle(x, y, r) {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    context.beginPath();
    context.arc(x+r, y+r, r, 0, Math.PI * 2);
    context.fillStyle = "red";
    context.fill();
    context.closePath();

    //刷新
    //context.clearRect(0,0,400,500);
}



//求过圆心直线与圆交点，centerX&Y是圆心坐标，radius是半径，lineK是直线斜率
function getIntersectionPoints(centerX, centerY, radius, lineK){
    var radian, xOffset, yOffset;
    // console.log("center"+centerX,centerY);
    if(lineK!=null){
        radian = Math.atan(lineK);
        xOffset = Math.cos(radian) * radius;
        yOffset = Math.sin(radian) * radius;
        // console.log(radian,xOffset);
    }else{
        xOffset = radius;
        yOffset = 0;
    }

    var interP1X = centerX + xOffset;
    var interP1Y = centerY + yOffset;
    var interP2X = centerX - xOffset;
    var interP2Y = centerY - yOffset;

    // console.log(interP1X);
    return {p1x:interP1X,p1y:interP1Y,p2x:interP2X,p2y:interP2Y};

}

function getControlPoint(centerX1,centerY1,centerX2,centerY2){
    var ControlPointX = (centerX1 + centerX2)/2;
    var ControlPointY = (centerY1 + centerY2)/2;
    return {cpx:ControlPointX, cpy:ControlPointY};
}

function drawQuad(centerX1,centerY1,centerX2,centerY2,r1,r2){
     centerX2 = centerX2 + r2;
     centerY2 = centerY2 + r2;
    var lineK = (centerX2-centerX1)/(centerY1-centerY2);
    // console.log("lineK"+lineK);
    var obj1 = getIntersectionPoints(centerX1,centerY1,r1,lineK);
    var interPAX = obj1.p1x;
    var interPAY = obj1.p1y;
    var interPCX = obj1.p2x;
    var interPCY = obj1.p2y;
    // console.log("PAX"+interPAX);
    var interPBX,interPBY,interPDX,interPDY = getIntersectionPoints(centerX2,centerY2,r2,lineK);
    var obj2 = getIntersectionPoints(centerX2,centerY2,r2,lineK);
    interPBX = obj2.p1x;
    interPBY = obj2.p1y;
    interPDX = obj2.p2x;
    interPDY = obj2.p2y;
    var obj3 = getControlPoint(centerX1,centerY1,centerX2,centerY2);
    var ControlPointX=obj3.cpx;
    var ControlPointY=obj3.cpy;
    var canvas=document.getElementById("myCanvas");
    var ctx=canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(interPAX,interPAY);
    ctx.lineTo(interPCX,interPCY);
    ctx.quadraticCurveTo(ControlPointX,ControlPointY,interPDX,interPDY);
    ctx.lineTo(interPBX,interPBY);
    ctx.quadraticCurveTo(ControlPointX,ControlPointY,interPAX,interPAY);

    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();

}

function getDistance(centerX1,centerY1,centerX2,centerY2) {
    return Math.sqrt((Math.abs(centerX1-centerX2-15))*(Math.abs(centerX1-centerX2-15))+(Math.abs(centerY1-centerY2-15))*(Math.abs(centerY1-centerY2-15)));
}


window.onload = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    canvas.height = 400;
    canvas.width = 500;
    // 静态图像
    // drawStartCircle(200, 250, 15);
    // drawEndCircle(300, 200, 15);
    // drawQuad(200,250,300,200,15,15);

    // 动态图像

    var r1 = 15;

    var lengthY = Math.abs(parseInt(document.getElementById("endPoint").style.top)-235);
    var lengthX = Math.abs(parseInt(document.getElementById("endPoint").style.left)-185);
    setInterval(function () {
        ctx.clearRect(0,0,800,800);
        var startx = 200;
        var starty = 250;
        if(document.getElementById("endPoint")){
            var endx = parseInt(document.getElementById("endPoint").style.left);
            var endy = parseInt(document.getElementById("endPoint").style.top);
        }


        // endPoint距离开始位置的相对位移


        // console.log("length:-------",lengthX,lengthY);
        var distance = getDistance(startx,starty,endx,endy);
        // r1 = 280/distance;
        r1 = 15*Math.pow(0.99,distance);
        if(r1>=15){
            r1=15;
        } else if(r1<=5){
            r1=5;
        }
        // console.log("distance-----:",distance);
        // console.log("r1-----:"+r1);
        drawStartCircle(startx, starty, r1);
        drawEndCircle(endx, endy, 15);
        drawQuad(startx,starty,endx,endy,r1,15);


        if(distance>=250){
            ctx.clearRect(0,0,800,800);
            drawEndCircle(endx, endy, 15);
            $("#endPoint").mouseup(function () {
                document.body.removeChild(document.getElementById("endPoint"));
            });

        }else{
            $("#endPoint").mouseup(function () {
                ctx.clearRect(0,0,800,800);
                document.getElementById("endPoint").style.left = "185px";
                document.getElementById("endPoint").style.top = "235px";
                drawStartCircle(startx,starty,15);

                // if(lengthX>=0){
                //     document.getElementById("endPoint").style.left = lengthX-- +"px";
                //     if(lengthY>=0){
                //         document.getElementById("endPoint").style.top = lengthY-- +"px";
                //     }
                // }



                drawEndCircle(endx, endy, 15);
                drawQuad(startx,starty,startx,startx,r1,15);

            });
        }
    }
    ,1
    )
};


$(function () {
    $("#endPoint").draggable();
});