// 2016年9月10日 17:52:46

var game = $('#game');
var level = $('#level').value;
var startGame = $('#startGame');
var end = $('#end');
var sideLength;//显示框总边长
var gameDivWH = (sideLength-level-1)/level;//计算每一个小方格的宽度，默认1像素
var gameArr = [];//初始数据数组，用于draw函数，主要作用就是存储每个格子的数据
var gameArr_n = [];//真实的对应屏幕上显示的数组，里面的值会对应屏幕不断更改
var speed = 5;//移动速度
var img = new Image();

//初始化
function init(){
	level = $('#level').value;
	gameDivWH = (sideLength-level-1)/level;
	arr = [];
	for(var i = 0; i < level; i++){
		gameArr_n[i] = [];
	}
	initArr();
	draw();
}

//初始化gameArr数组
function initArr(){
	var p, t = 0, r;
	for(var i = 0; i < level; i++){
		gameArr[i] = [];
		for(var j = 0; j < level; j++){
			p = getPos(i, j);//图片的显示位置
			if(i === level-1 && j === level-1){//是不是右下角的那个格子
				gameArr_n[level-1][level-1] = {
					item:level*level-1,
					item_n:level*level-1
				};
			}else{
				r = randomPos();
				gameArr_n[r.xx][r.yy] = {
					item:t,
					item_n:r.n
				};
			}
			if((t+1) === level*level){//右下角的方格没有背景图，位置不随机
				r = getPos(level-1, level-1);
				gameArr[i][j] = {
					item:t,//图片的显示标号
					item_n:t,//实际的位置标号，这里因为这是空白移动格子，所以原始标号和位置标号相同
					rx:r.x,//div显示
					ry:r.y
				};
				break;
			}
			gameArr[i][j] = {
				bx:p.x,//图片位置
				by:p.y,
				item:t,//图片的显示标号
				item_n:r.n,//实际的位置标号
				rx:r.x,//随机位置
				ry:r.y
			};
			t++;
		}
	}
}

//根据产生的随机数返回实际显示位置
function randomPos(){
	var t = level*level;
	var n = randomNum();
	var x = parseInt(n/level), y = n%level;
	var p = getPos(x, y);
	return {
		x:p.x,
		y:p.y,
		n:n,
		xx:x,
		yy:y
	};
}

var arr = [];//用于随机数的产生记录
//产生0到level*level-2之间的随机数
function randomNum(){
	var t = level*level;
	var r = parseInt(Math.random()*(t-1));
	if(r === t-1) r = t-2;
	while(true){
		if(arr[r]){
			r = parseInt(Math.random()*(t-1));
			if(r === t-1) r = t-2;
		}else{
			arr[r] = 1;
			return r;
		}
	}
}

//绘制函数
function draw(){
	var html = '', p, g;
	for(var i = 0; i < level; i++){
		for(var j = 0; j < level; j++){
			g = gameArr[i][j];
			if(g.item !== (level*level-1)){
				html += '<div id="dd'+g.item+'" style="width:'+gameDivWH+'px;height:'+gameDivWH+'px;position:absolute;top:'+g.rx+'px;left:'+g.ry+'px;"><img id="d'+g.item+'" item="'+g.item_n+'" src="img.jpeg" style="width:'+sideLength+'px;height:'+sideLength+'px;position:absolute;top:-'+g.bx+'px;left:-'+g.by+'px;"></div>';
			}else{
				html += '<div id="d'+g.item+'" item="'+g.item_n+'" style="width:'+gameDivWH+'px;height:'+gameDivWH+'px;position:absolute;top:'+g.rx+'px;left:'+g.ry+'px;"></div>';
			}
		}
	}
	game.innerHTML = html;
}

//屏幕适配
(function ScreenAdaptation(){
	var w = window.screen.availWidth;
	var h = window.screen.availHeight;
	if(w > h){
		sideLength = h*0.8;
	}else{
		sideLength = w*0.8;
	}
	game.style.width = sideLength+'px';
	game.style.height = sideLength+'px';
})();

//游戏结束
function gameover(){
	mark.style.display = 'block';
	// game.style.display = 'none';
	end.style.display = 'none';
}

// 获取方格的位置
function getPos(x, y){
	return {
		x:gameDivWH*x,
		y:gameDivWH*y
	};
}

//获取单个DOM元素
function $(str){
	return document.querySelector(str);
}
//获取DOM集合
function $all(str){
	return document.querySelectorAll(str);
}

startGame.onclick = function(){
	mark.style.display = 'none';
	game.style.display = 'block';
	end.style.display = 'block';
	init();
};

end.onclick = function(){
	gameover();
};

game.onclick = function(event){
	change(event.target.getAttribute('item'), event.target.getAttribute('id'));
};

game.addEventListener('touchstart', function(event){
	change(event.target.getAttribute('item'), event.target.getAttribute('id'));
});

//判断移动方向，参数分别是显示的到的位置和id，即应该在的位置
function change(item_n, id){
	// console.log(item);
	// console.log(id);
	// console.log(gameArr);
	// console.log(gameArr_n);
	var x = 0, y = 0;
	t = level*level-1;
	//找到事件目标的显示标号在gameArr_n中的位置
	for(var i = 0; i < level; i++){
		for(var j = 0; j < level; j++){
			if(gameArr_n[i][j].item_n == item_n){
				x = i;
				y = j;
				break;
			}
		}
	}
	//移动方向判断
	if(x-1 > -1){//上
		if(gameArr_n[x-1][y].item == t){
			console.log('上');
			moveDate(x, y, x-1, y, item_n, id);
			return;
		}
	}
	if(y+1 < level){//右
		if(gameArr_n[x][y+1].item == t){
			console.log('右');
			moveDate(x, y, x, y+1, item_n, id);
			return;
		}
	}
	if(x+1 < level){//下
		if(gameArr_n[x+1][y].item == t){
			console.log('下');
			moveDate(x, y, x+1, y, item_n, id);
			return;
		}
	}
	if(y-1 > -1){//左
		if(gameArr_n[x][y-1].item == t){
			console.log('左');
			moveDate(x, y, x, y-1, item_n, id);
			return;
		}
	}
}

var s = false;//节流
//移动数据函数
function moveDate(x1, y1, x2, y2, item_n, id){
	if(s){
		return;
	}
	s = true;
	//交换数组数据
	var t = gameArr_n[x1][y1].item;
	gameArr_n[x1][y1].item = gameArr_n[x2][y2].item;
	gameArr_n[x2][y2].item = t;
	//进行显示上的位置交换
	var p1 = getPos(x1, y1);
	var p2 = getPos(x2, y2);
	var e1 = $('#d'+id);//获得当前要移动的元素
	var e2 = $('#d'+(level*level-1));//获得空白元素

	var e1img = $('#'+id);
	e1img.setAttribute('item', gameArr_n[x2][y2].item_n);
	e2.setAttribute('item', gameArr_n[x1][y1].item_n);

	var e1top = parseInt(e1.style.top);
	var e1left = parseInt(e1.style.left);
	var e2top = parseInt(e2.style.top);
	var e2left = parseInt(e2.style.left);
	moveElement('d'+id, e2left, e2top, speed);
	moveElement('d'+(level*level-1), e1left, e1top, speed);
}

//判断用户是否拼合完成
function judge(){
	var t = level*level-1, k = 0;
	for(var i = 0; i < level; i++){
		for(var j = 0; j < level; j++){
			if(gameArr_n[i][j].item == gameArr_n[i][j].item_n){
				k++;
				if(k == t){
					alert('恭喜成功！');
					gameover();
					return;
				}
			}else{
				return;
			}
		}
	}
}

//将元素移动到指定的位置
function moveElement(elementID, final_x, final_y, interval){
	if (!document.getElementById) return false;
	if (!document.getElementById(elementID)) return false;
	var elem = document.getElementById(elementID);
	if (elem.movement){
		clearTimeout(elem.movement);
	}
	if (!elem.style.left){
		elem.style.left = "0px";
	}
	if (!elem.style.top){
		elem.style.top = "0px";
	}
	var xpos = parseInt(elem.style.left);
	var ypos = parseInt(elem.style.top);
	var dist = 0;
	if (xpos == final_x && ypos == final_y){
		if(s){
			judge();
		}
		s = false;
		return true;
	}
	if (xpos < final_x){
		dist = Math.ceil((final_x - xpos)/10);
		xpos = xpos + dist;
	}
	if (xpos > final_x){
		dist = Math.ceil((xpos - final_x)/10);
		xpos = xpos - dist;
	}
	if (ypos < final_y){
		dist = Math.ceil((final_y - ypos)/10);
		ypos = ypos + dist;
	}
	if (ypos > final_y){
		dist = Math.ceil((ypos - final_y)/10);
		ypos = ypos - dist;
	}
	elem.style.left = xpos + "px";
	elem.style.top = ypos + "px";
	var repeat = "moveElement('"+elementID+"', "+final_x+", "+final_y+", "+interval+")";
	elem.movement = setTimeout(repeat, interval);
}