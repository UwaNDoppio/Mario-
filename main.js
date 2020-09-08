

let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");

let can = document.getElementById("can");
let con = can.getContext("2d");


vcan.width = SCREEN_SIZE_W;
vcan.height = SCREEN_SIZE_H;

can.width = SCREEN_SIZE_W*3;
can.height = SCREEN_SIZE_H*3;

//描写を綺麗にする
con.mozimageSmoothingEnabled = false;
con.msimageSmoothingEnabled = false;
con.webkitimageSmoothingEnabled = false;
con.imageSmoothingEnabled = false;

//フレームレート維持
let frameCount = 0;
let startTime;

con.fillStyle = "#66AAFF"
con.fillRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H)

let chImg = new Image();
chImg.src = "./sprite.png";
//chImg.onload = draw;


//おじさんを作る
let ojisan = new Ojisan(100,100);

//フィールドを作る
let field = new Field();

//ブロックのオブジェクト
let block =[];
let item = [];

function updateObj(obj){

  for(let i=obj.length-1;i>=0;i--){
    obj[i].update();
    if(obj[i].kill)obj.splice(i,1);
  }
}

//更新処理
function update(){
  //マップの更新
  field.update();

  //スプライトのブロックの更新
  updateObj(block);
  updateObj(item);

  //マリオの更新
  ojisan.update();

}

//スプライトの描写
function drawSprite(snum,x,y){
  let sx = (snum&15)*16;
  let sy = (snum>>4)*16;

  vcon.drawImage(chImg,sx,sy,16,32, x,y,16,32);
}

function drawObj(obj){
  for(let i=0;i<obj.length;i++)
  obj[i].draw();
}

//描画処理
function draw(){
  
  //画面を水色でクリア
  vcon.fillStyle="#66AAFF";
  vcon.fillRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H);


  //フィールドを表示
  field.draw();

  //スプライトのブロック表示
  drawObj(block);
  drawObj(item);

  //マリオを表示
  ojisan.draw();

  


  //デバッグ情報(フレームレート)
  vcon.font="24px 'Impact'";
  vcon.fillStyle="white";
  vcon.fillText("FRAME:" +frameCount,10,20);

  //仮想画面から実画面へ拡大転送
  con.drawImage(vcan,0,0,SCREEN_SIZE_W,SCREEN_SIZE_H, 0,0,SCREEN_SIZE_W*3,SCREEN_SIZE_H*3);
}

//setInterval(mainLoop,1000/60);

//ループ開始
window.onload = function(){
  startTime = performance.now();
  mainLoop();
}

//メインループ
function mainLoop(){
  
  let nowTime = performance.now();
  let nowFrame = (nowTime - startTime) / GAME_FPS;
  
  if (nowFrame > frameCount){

    let c = 0;
    while (nowFrame > frameCount){
      frameCount++;
      //更新処理
      update();
      if (++c>4)break;
    }
    //描画処理
    draw();
  }
  requestAnimationFrame(mainLoop);
}
//キーボード
let keyb = {};

//キーボードが押された時に呼ばれる
document.onkeydown = function(e){
  if(e.keyCode == 65)keyb.Left = true;
  if(e.keyCode == 68)keyb.Right = true;
  if(e.keyCode == 87)keyb.ABOTTON = true;
  if(e.keyCode == 32)keyb.ABOTTON = true;
  if(e.keyCode == 16)keyb.BBOTTON = true;

  if(e.keyCode == 65)field.scx--;
  if(e.keyCode == 68)field.scx++;
}
//キーボードが離された時に呼ばれる
document.onkeyup = function(e){
  if(e.keyCode == 65)keyb.Left = false;
  if(e.keyCode == 68)keyb.Right = false;
  if(e.keyCode == 87)keyb.ABOTTON = false;
  if(e.keyCode == 32)keyb.ABOTTON = false;
  if(e.keyCode == 16)keyb.BBOTTON = false;
}