//おじさんクラス

const ANIME_STAND = 1;
const ANIME_WALK = 2;
const ANIME_BRAKE = 4;
const ANIME_JUMP = 8;
const GRAVITY = 4;
const MAX_SPEED = 32;
const TYPE_MINI = 1;
const TYPE_BIG = 2;
const TYPE_FIRE = 4;
 

class Ojisan{

  constructor(x,y){
    this.x = x<<4;
    this.y = y<<4;
    this.ay = 16;
    this.w = 16;
    this.h = 16;
    this.vx = 0;
    this.vy = 0;
    this.anime = 0;
    this.sprite =0;
    this.anime_counter = 0;
    this.dir = 0;
    this.jump = 0;

    this.kinoko = 0;
    this.type = TYPE_MINI;
  }

  //床判定
  checkFloor(){
    if(this.vy <= 0)return;

    let lx = ((this.x + this.vx) >> 4);
    let ly = ((this.y + this.vy) >> 4);

    let p = this.type == TYPE_MINI?2:0;

    if(field.isBlock(lx + 1 + p,ly + 31) || field.isBlock(lx + 14 -p,ly + 31)){
      if(this.anime == ANIME_JUMP)this.anime = ANIME_WALK;
      this.jump = 0;
      this.vy = 0;
      this.y = ((ly-1)<<4);

    }
  }

  //天井判定
  checkCeil(){
    if(this.vy >= 0)return;

    let lx = ((this.x + this.vx) >> 4);
    let ly = ((this.y + this.vy) >> 4);

    let ly2 = ly + (this.type == TYPE_MINI?21:5)

    let bl;
    if(bl = field.isBlock(lx + 8,ly2)){
      this.jump = 15;
      this.vy = 0;

      let x = (lx+8)>>4;
      let y = (ly2)>>4;
      if(bl!=371 && bl != 475){
      block.push(new Block(bl,x,y));
      item.push(new Item(218,x,y,0,0))
      }else if(this.type == TYPE_MINI){
        block.push(new Block(bl,x,y));
      }else{
      block.push(new Block(bl,x,y,1,20,-60));
      block.push(new Block(bl,x,y,1,-20,-60));
      block.push(new Block(bl,x,y,1,20,-20));
      block.push(new Block(bl,x,y,1,-20,-20));
      }
    }
  }

  //壁判定
  checkWall(){

    let lx = ((this.x + this.vx) >> 4);
    let ly = ((this.y + this.vy) >> 4);

    let p = this.type == TYPE_MINI?24:9;

    //右側のチェック
    if(field.isBlock(lx + 15,ly + p) 
    || (this.type == TYPE_BIG && (field.isBlock(lx + 15,ly + 15) || field.isBlock(lx + 15,ly + 24)) )){
      this.vx = 0;
      this.x -= 8 ;
    }
    else 
      //左側のチェック
      if(field.isBlock(lx,ly + p)
       || (this.type == TYPE_BIG && (field.isBlock(lx,ly + 15) || field.isBlock(lx,ly + 24)) )){
      this.vx = 0;
      this.x += 8 ;
    }

  }

  //ジャンプ処理
  updateJump(){

    if(keyb.ABOTTON){
      if(this.jump == 0){
      this.anime = ANIME_JUMP;
      this.jump = 1;
      this.vy = -64;
      }
      if(this.jump < 15){
      this.vy = -(64-this.jump);
      }
      if(this.jump)this.jump++;
    }
  }

  //横方向の移動
  updateWalkSub(dir){

    //最高速まで加速
    if(dir == 0 && this.vx < MAX_SPEED) this.vx++;
    if(dir == 1 && this.vx > -MAX_SPEED) this.vx--;

    //ジャンプしてない時
    if(!this.jump){
      //立ちポーズだった時はカウンタリセット
      if(this.anime == ANIME_STAND)this.anime_counter = 0;
      //アニメを歩きアニメーション
      this.anime = ANIME_WALK;
      //方向を設定
      this.dir = dir;
      //逆方向の時はブレーキをかける
      if(dir == 0 && this.vx < 0)this.vx++;
      if(dir == 1 && this.vx > 0)this.vx--;
      //逆に強い加速の時はブレーキアニメ
      if(dir == 1 && this.vx > 8 || dir == 0 && this.vx < -8){
        this.anime = ANIME_BRAKE;
      }
    }
  }

  //歩く処理
  updateWalk(){

      //横移動
  if(keyb.Left) {
    this.updateWalkSub(1);
  }
  else
     if(keyb.Right) {
      this.updateWalkSub(0);
     }
  else {
       if(!this.jump){
       if(this.vx > 0)this.vx -= 1;
       if(this.vx < 0)this.vx += 1;
       if(!this.vx)this.anime = ANIME_STAND;
       }
      }

  }
  //スプライトを変える処理
  updateAnime(){
    //スプライトの決定
    switch(this.anime){
      case ANIME_STAND:
        this.sprite = 0;
        break;
      case ANIME_WALK:
        this.sprite = 2 + ((this.anime_counter/6)%3);
        break;
      case ANIME_JUMP:
        this.sprite = 6;
        break;
      case ANIME_BRAKE:
        this.sprite = 5;
        break;
    }
    //ちっちゃいおじさんの時は＋32を使う
    if(this.type == TYPE_MINI)this.sprite += 32;
    //左向きの時は+48を使う
    if(this.dir)this.sprite += 48;
  
  }

  //毎フレーム毎の更新処理
  update(){

    //キノコを取った時のエフェクト
    if(this.kinoko){
      let anime = [32,14,32,14,32,14,0,32,14,0];

      this.sprite = anime[this.kinoko>>2];
      this.h = this.sprite == 32?16:32;
      if(this.dir)this.sprite += 48;
      if(++this.kinoko == (anime.length*4)){
        this.type = TYPE_BIG;
        this.ay = 0;
        this.kinoko = 0;

      }
      return;
    }

    //アニメ用カウンタ
    this.anime_counter++;
    if(Math.abs(this.vx) == MAX_SPEED)this.anime_counter++;

    this.updateJump();
    this.updateWalk();
    this.updateAnime();

    //重力
    if(this.vy < 64) this.vy += GRAVITY;


    //横壁のチェック
    this.checkWall();



    //床のチェック
    this.checkFloor();

    
    //天井のチェック
    this.checkCeil();


    //実際に座標を変えている
    this.x += this.vx;
    this.y += this.vy;

    /*
    //床にぶつかる(設置判定)
    if(this.y > 160<<4){
    if(this.anime == ANIME_JUMP)this.anime = ANIME_WALK;
    this.jump = 0;
    this.vy = 0;
    this.y = 160<<4;
    }
    */  

  }

  //毎フレーム毎の描画処理
  draw(){
    let px = (this.x >>4) - field.scx;
    let py = (this.y >>4) - field.scy;

    let sx = (this.sprite&15)*16;
    let sy = (this.sprite>>4)*16;

    let w = this.w;
    let h = this.h;

    py += (32-h);

    vcon.drawImage(chImg,sx,sy,w,h, px,py,w,h);
  }

}