
//キノコ等アイテムのクラス

class Item extends Sprite{


  //壁判定
  checkWall(){

    let lx = ((this.x + this.vx) >> 4);
    let ly = ((this.y + this.vy) >> 4);

    //右側のチェック
    if(field.isBlock(lx + 15,ly + 3) || field.isBlock(lx + 15,ly + 12)){
      this.vx *= -1;
    }
    else 
      //左側のチェック
      if(field.isBlock(lx,ly + 3) || field.isBlock(lx,ly + 12)){
      this.vx *= -1;
    }

  }

  //床判定
  checkFloor(){
    if(this.vy <= 0)return;

    let lx = ((this.x + this.vx) >> 4);
    let ly = ((this.y + this.vy) >> 4);

    if(field.isBlock(lx + 1,ly + 15) || field.isBlock(lx + 14,ly + 15)){
      this.vy = 0;
      this.y = ((ly-1)<<4);

    }
  }

  //更新処理
  update(){

    if(this.kill)return;
    if(ojisan.kinoko)return;

    if(this.checkHit (ojisan)){
      ojisan.kinoko = 1;
      this.kill = true;
      return;
    }

    if( ++this.count <= 32){
      this.sz = 1+this.count>>1;
      this.y -= 1<<3;
      if(this.count==32)this.vx = 24;
      return;
    }

    this.checkWall();
    this.checkFloor();
    super.update();

  }
}