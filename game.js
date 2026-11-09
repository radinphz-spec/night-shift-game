/* NIGHT SHIFT - full playable core. Three.js r128, procedural, mobile+PC */
function $(id){return document.getElementById(id);}
var SAVE_KEY='nightshift_save_v1';
var S={night:1,money:120,difficulty:'NORMAL',lives:3,fuel:100,fuelCust:0,inventory:[],owned:{},settings:{sound:80,music:60,sens:100,graphics:'high',mtime:120}};
function loadSave(){try{var d=JSON.parse(localStorage.getItem(SAVE_KEY));if(d) S=Object.assign(S,d);}catch(e){}}
function saveGame(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({night:S.night,money:S.money,difficulty:S.difficulty,lives:S.lives,inventory:S.inventory,owned:S.owned,settings:S.settings}));toast('💾 ذخیره شد');}catch(e){}}
loadSave();

var SHOP=[
{id:'battery',n:'باتری',p:40,i:'🔋',d:'برای بی‌سیم و وسایل الکترونیکی. چراغ‌قوه باتری نمی‌خواهد.'},
{id:'whistle',n:'سوت',p:60,i:'📯',d:'صدا تولید می‌کند. هیولای حساس به صدا را منحرف می‌کند.'},
{id:'binoc',n:'دوربین دوچشمی',p:120,i:'🔭',d:'دید دوردست. کلیک برای زوم.'},
{id:'coin',n:'سکه حواس‌پرت‌کن',p:50,i:'🪙',d:'پرتاب کن؛ بعضی هیولاها به محل افتادن می‌روند.'},
{id:'trap',n:'تله هیولا',p:200,i:'🪤',d:'روی زمین بگذار. همه هیولاها گیر نمی‌کنند.'},
{id:'mine',n:'مین تخیلی',p:250,i:'💥',d:'وسیله آرکید بازی. انفجار نمایشی، بدون آموزش واقعی.'},
{id:'wire',n:'سیم‌چین',p:90,i:'✂️',d:'برای قفل‌ها و مأموریت‌های برقی.'},
{id:'toolbox',n:'جعبه ابزار',p:110,i:'🧰',d:'تعمیر وسایل خراب مثل فیوز.'},
{id:'exting',n:'کپسول آتش‌نشانی',p:130,i:'🧯',d:'خاموش کردن آتش مأموریتی.'},
{id:'radio2',n:'بی‌سیم',p:150,i:'📻',d:'دریافت پیام داستانی. باتری لازم دارد.'},
{id:'stick',n:'چوب فلزی',p:140,i:'🏏',d:'دفاع ساده. یک‌بار هیولا را دور می‌کند.'},
{id:'mop2',n:'طی بهتر',p:100,i:'🧹',d:'تمیزکاری دو برابر سریع‌تر.'},
{id:'glove',n:'دستکش بهتر',p:80,i:'🧤',d:'کارها ۳۰٪ سریع‌تر.'},
{id:'crowbar',n:'دیلم',p:110,i:'🦯',d:'باز کردن موانع مشخص.'},
{id:'stkey',n:'کلید انباری',p:300,i:'🗝️',d:'باز کردن در قفل انبار. راز اصلی.'},
{id:'medkit',n:'جعبه کمک‌های اولیه',p:70,i:'⛑️',d:'بازیابی جان در درجه آسان.'}];

var NIGHTS=[
{n:1,boss:'سلام! شب اولته. نترس، همه‌چیز عادیه... فقط اگه برق رفت خونسرد باش. جعبه‌ها رو بچین، به مشتری‌ها برس، دفترچه‌ت رو بخون. اون لکه‌های خون روی دفترچه؟ ...چیزی نیست، مال قبلیه.',tasks:['جعبه‌ها را از کامیون تخلیه کن (0/3)','به ۳ مشتری خدمات بده','دفترچه را بررسی کن'],powerCut:true,monsters:[],flicker:false,notes:['یادداشت کارمند قبلی - صفحه آخر:\nاگه اینو می‌خونی من دیگه نیستم. به صدای انبار گوش نده. ساعت ۳ صبح به قفسه‌ها نگاه نکن. اون رادیو خودش روشن می‌شه...']},
{n:2,boss:'دیشب خوب بودی. امشب یه کم عجیبه... اگه مشتری عجیب دیدی به روش نیار. قفسه‌ها رو پر نگه دار.',tasks:['قفسه‌ها را پر کن (0/3)','۴ مشتری را راه بینداز','به پیام بی‌سیم گوش بده'],powerCut:false,monsters:['sound'],flicker:true,notes:['شب دوم: اون مسافر برگشت. چشماش... نمی‌دونم. ازم پرسید صاحب قبلی کجاست.']},
{n:3,boss:'یه مسافر ناشناس اطراف دیده شده. درها رو قفل نکن ولی حواست باشه. اگه صدای قدم اضافه شنیدی بدو.',tasks:['سوخت‌گیری ۳ مشتری','تمیزکاری محوطه','مسافر ناشناس را پیدا کن'],powerCut:false,monsters:['blind'],flicker:true,notes:['شب سوم: مسافر فقط نگاهم کرد. گفت تو هم مثل اون می‌شی.']},
{n:4,boss:'صدای انبار بلندتر شده؟ بهش نزدیک نشو. فقط کارت رو بکن. اگه آتش دیدی کپسول بردار.',tasks:['خاموش کردن آتش انبار','خدمت به ۴ مشتری','نشانه‌های انبار را بررسی کن'],powerCut:false,monsters:['blind','sound'],flicker:true,notes:['شب چهارم: در انبار از داخل خط افتاده: DO NOT ENTER. ولی چیزی از داخل در می‌کوبه...']},
{n:5,boss:'ببین... کارمند قبلی گم نشده. فرار کرده. امشب حقیقت رو می‌فهمی. تله همراهت باشه.',tasks:['۵ مشتری','یک هیولا را با تله گیر بینداز','یادداشت پنهان را بخوان'],powerCut:false,monsters:['light','sound'],flicker:true,notes:['شب پنجم: کلید انبار دست رئیسه ولی می‌فروشنش... پول جمع کن. اون موجود قبلاً انسان بوده.']},
{n:6,boss:'فردا شب آخرته اگه زنده بمونی. اون چیز بوی خون رو حس می‌کنه. چراغ‌قوه‌ت رو خاموش روشن نکن بیخود.',tasks:['تعمیر فیوز با جعبه ابزار','۴ مشتری غیرعادی را مدیریت کن','زنده بمان تا ۶ صبح'],powerCut:false,monsters:['deaf','light'],flicker:true,notes:['شب ششم: سیم‌چین بردار. جعبه فیوز دستکاری شده. اون می‌خواد برق فردا شب بره...']},
{n:7,boss:'شب آخر. برق میره، مثل شب اول. یادته شب اول چی شد؟ دایره کامل می‌شه. راز انبار رو باز کن و تمومش کن.',tasks:['وارد انبار شو','راز اصلی را آشکار کن','تا ۰۶:۰۰ زنده بمان'],powerCut:true,monsters:['deaf','blind','light','sound'],flicker:false,notes:['شب هفتم: من کارمند قبلیم. اگه اینو می‌خونی یعنی من تو انبارم. ببخش...']}
];

var MONDEF={
deaf:{fa:'هیولای کر',c:0x5a5a6a,sz:2.3,sp:2.2,hear:false,see:true,light:false,soundSens:false,trap:true,weak:'نمی‌شنود؛ می‌توانی بدوی ولی جلوی چشمش نرو.'},
blind:{fa:'هیولای کور',c:0x1a1a2a,sz:2.0,sp:1.8,hear:true,see:false,light:false,soundSens:true,trap:true,weak:'نمی‌بیند ولی صدا را می‌شنود؛ آرام حرکت کن، سوت نیار.'},
light:{fa:'هیولای حساس به نور',c:0x882222,sz:1.9,sp:2.6,hear:true,see:true,light:true,soundSens:false,trap:false,weak:'از چراغ‌قوه فرار می‌کند؛ چراغ را روشن نگه دار.'},
sound:{fa:'هیولای حساس به صدا',c:0x224488,sz:2.1,sp:2.4,hear:true,see:true,light:false,soundSens:true,trap:true,weak:'سوت و سکه حواسش را پرت می‌کند.'}};

var DLG_Q=['امشب شلوغه، نه؟','چند وقته اینجا کار می‌کنی؟','صاحب قبلی اینجا کجا رفت؟','دستشویی اینجا کجاست؟','می‌تونی یه قهوه بهم بدی؟'];
var DLG_A=['آره... از وقتی تو اومدی شلوغ‌تر شد.','تازه استخدام شدم، هفت شب شیفتم.','نمی‌دونم... می‌گن یهویی غیبش زد.','ته فروشگاه سمت چپ. ولی امشب نرو اونجا.','باشه، یه قهوه مهمون من... مراقب پشت سرت باش.'];

/* AUDIO procedural */
var AC=null,masterGain,musicGain,radioOn=false,radioTimer=0;
function initAudio(){if(AC) return;try{AC=new (window.AudioContext||window.webkitAudioContext)();masterGain=AC.createGain();musicGain=AC.createGain();masterGain.connect(AC.destination);musicGain.connect(AC.destination);var s=S.settings;masterGain.gain.value=s.sound/100;musicGain.gain.value=s.music/100;}catch(e){}}
function beep(f,d,type){if(!AC) return;try{var o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.value=f;d=d||0.15;g.gain.setValueAtTime(0.2,AC.currentTime);g.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+d);o.connect(g);g.connect(masterGain);o.start();o.stop(AC.currentTime+d);}catch(e){}}
function noiseBurst(d){if(!AC) return;try{var b=AC.createBuffer(1,AC.sampleRate*d,AC.sampleRate),ch=b.getChannelData(0);for(var i=0;i<ch.length;i++)ch[i]=(Math.random()*2-1)*0.3;var s=AC.createBufferSource();s.buffer=b;s.connect(masterGain);s.start();}catch(e){}}
function scare(){noiseBurst(0.6);beep(80,0.6,'sawtooth');flashBlood();}
function flashBlood(){var e=$('blood-flash');e.style.opacity=1;setTimeout(function(){e.style.opacity=0;},400);}
function radioMusic(){if(!AC||!radioOn) return;var seq=[220,247,262,196,220,330,262,196];var n=seq[Math.floor(Math.random()*seq.length)];beep(n,0.4,'triangle');if(Math.random()<0.12){beep(60,0.8,'sawtooth');toast('📻 رادیو: ...او هنوز اینجاست... خش خش...');}}

/* THREE */
var scene,camera,renderer,flashLight,ambient,shopLights=[],player={x:0,z:6,yaw:Math.PI,pitch:0,hp:100,run:false,carrying:false,carryingMesh:null};
var colliders=[],interactables=[],customers=[],monsters=[],goos=[],traps=[],mines=[],coins=[];
var gameState='menu',clockMin=23*60,tasks=[],custServed=0,custTotal=0,custSpawnTimes=[],monsterSpawnTimes=[],powerOn=true,nightConfig=null,carryingBox=false,policeTimer=0,thiefActive=null,binocOn=false,activeGadget=null,truck=null,boxesLeft=[],products=[],shelfLevels=[0,0,0],fuelRefillNeeded=false,fireActive=false,fuseBroken=false,obstacleBlocked=false;
var keys={},joy={x:0,y:0},lookSens=0.003;

function toast(t){var e=$('toast');e.textContent=t;e.classList.remove('hidden');clearTimeout(e._t);e._t=setTimeout(function(){e.classList.add('hidden');},2600);}
function updateHUD(){$('h-night').textContent=S.night;$('h-money').textContent=S.money;$('h-cust').textContent=custServed+'/'+custTotal;$('h-fuel').textContent=Math.round(S.fuel)+'%';$('fuel-fill').style.width=S.fuel+'%';var lh='';if(S.difficulty==='EASY'){lh='❤️'.repeat(S.lives)+'🤍'.repeat(Math.max(0,3-S.lives));}else if(S.difficulty==='NORMAL'){lh='😐 عادی';}else{lh='💀 سخت';}$('h-lives').textContent=lh;var done=tasks.filter(function(t){return t.done;}).length;$('h-task-mini').textContent='وظایف: '+done+'/'+tasks.length;var h=Math.floor(clockMin/60)%24,m=Math.floor(clockMin%60);$('h-clock').textContent=(h<10?'0':'')+h+':'+(m<10?'0':'')+m;}

function initThree(){
scene=new THREE.Scene();scene.background=new THREE.Color(0x030507);scene.fog=new THREE.Fog(0x030507,8,55);
camera=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,0.1,200);
renderer=new THREE.WebGLRenderer({antialias:false});renderer.setSize(innerWidth,innerHeight);
if(S.settings.graphics==='low'){renderer.setPixelRatio(0.7);renderer.shadowMap.enabled=false;}else{renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;}
$('game-canvas').appendChild(renderer.domElement);
ambient=new THREE.AmbientLight(0x334455,0.5);scene.add(ambient);
var moon=new THREE.DirectionalLight(0x445566,0.3);moon.position.set(10,20,10);scene.add(moon);
flashLight=new THREE.SpotLight(0xffeecc,0,18,0.5,0.4,1);scene.add(flashLight);scene.add(flashLight.target);
buildWorld();
window.addEventListener('resize',function(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
}

function mat(c){return new THREE.MeshLambertMaterial({color:c});}
function box(w,h,d,c,x,y,z){var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));m.position.set(x,y,z);scene.add(m);return m;}
function addCollider(x1,x2,z1,z2){colliders.push({x1:x1,x2:x2,z1:z1,z2:z2});}

function makeTextSprite(text,bg){
var cv=document.createElement('canvas');cv.width=512;cv.height=128;var g=cv.getContext('2d');g.fillStyle=bg||'#111';g.fillRect(0,0,512,128);g.fillStyle='#ff1111';g.font='bold 60px Arial';g.textAlign='center';g.fillText(text,256,84);var tx=new THREE.CanvasTexture(cv);var m=new THREE.Mesh(new THREE.PlaneGeometry(3,0.75),new THREE.MeshBasicMaterial({map:tx}));return m;}

function buildWorld(){
var ground=new THREE.Mesh(new THREE.PlaneGeometry(80,80),mat(0x0c0f12));ground.rotation.x=-Math.PI/2;scene.add(ground);
var road=new THREE.Mesh(new THREE.PlaneGeometry(80,8),mat(0x15171a));road.rotation.x=-Math.PI/2;road.position.set(0,0.01,22);scene.add(road);
for(var i=-3;i<=3;i++){var line=box(2,0.02,0.2,0x555555,i*6,0.02,22);}
box(14,3,10,0x1b2028,0,1.5,-2); // shop
addCollider(-7,7,-7,3);
box(3,2.2,0.3,0x2a2f38,0,1.1,3.05); // entrance visual
var counter=box(4,1,1,0x3a2a1a,0,0.5,0.5);addCollider(-2,2,0,1);
box(0.4,0.3,0.4,0xaa0000,1.6,1.1,0.5); // hidden police button mesh
for(var s=0;s<3;s++){var sh=box(2.5,2,0.6,0x2c3440,-4+s*4,1,-4);}
// fridges
box(3,2,1,0x223344,5,1,-5);box(3,2,1,0x223344,-5,1,-5);
// toilet door
box(1.2,2.2,0.2,0x3a3a4a,6,1.1,-1);
// pumps
for(var p=0;p<2;p++){box(1,1.8,0.6,0x882200,-6+p*12,0.9,12);box(4,0.1,4,0x222222,-6+p*12,0.05,12);}
addCollider(-7,-5,11,13);addCollider(5,7,11,13);
// parking
for(var k=0;k<4;k++)box(2.2,0.05,4.5,0x1a1d22,-12+k*3,0.03,14);
// power room
box(4,2.5,4,0x232830,9,1.25,-6);addCollider(7,11,-8,-4);
// storage locked
var st=box(4,2.8,4,0x2a1a1a,-9,1.4,-6);addCollider(-11,-7,-8,-4);
var sign=makeTextSprite('DO NOT ENTER');sign.position.set(-9,2.2,-3.95);scene.add(sign);
// radio
box(0.6,0.4,0.4,0x4a3a2a, -1.5,1.2,0.5);
// fuel tank
box(2,1.5,1.5,0x335533,6,0.75,10);
// truck placeholder
truck=new THREE.Group();var tb=new THREE.Mesh(new THREE.BoxGeometry(5,2.5,2.5),mat(0x334455));tb.position.y=1.5;truck.add(tb);var cab=new THREE.Mesh(new THREE.BoxGeometry(1.8,1.8,2.4),mat(0x556677));cab.position.set(3.2,1,0);truck.add(cab);for(var w=0;w<4;w++){var wh=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,0.4,10),mat(0x111111));wh.rotation.x=Math.PI/2;wh.position.set(-1.5+w*1.8,0.5,1.2);truck.add(wh);}truck.position.set(-20,0,18);scene.add(truck);
// lamps
for(var L=0;L<3;L++){var pl=new THREE.PointLight(0xffcc88,1,22);pl.position.set(-6+L*6,4,6);scene.add(pl);shopLights.push(pl);var pole=box(0.2,4,0.2,0x333333,-6+L*6,2,6);}
var shopIn=new THREE.PointLight(0xffeeaa,1.2,18);shopIn.position.set(0,2.8,-2);scene.add(shopIn);shopLights.push(shopIn);
// stars
var sg=new THREE.BufferGeometry(),pts=[];for(var stt=0;stt<200;stt++)pts.push((Math.random()-0.5)*100,15+Math.random()*20,(Math.random()-0.5)*100);sg.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));scene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0x8888aa,size:0.15})));
setupInteractables();
}

function setupInteractables(){
interactables=[
{id:'truckbox',x:-14,z:18,r:3,label:'برداشتن جعبه (E)'},
{id:'shelf0',x:-4,z:-4,r:2.5,label:'چیدن در قفسه ۱ (E)'},
{id:'shelf1',x:0,z:-4,r:2.5,label:'چیدن در قفسه ۲ (E)'},
{id:'shelf2',x:4,z:-4,r:2.5,label:'چیدن در قفسه ۳ (E)'},
{id:'pump0',x:-6,z:12,r:3,label:'سوخت‌گیری (E)'},
{id:'pump1',x:6,z:12,r:3,label:'سوخت‌گیری (E)'},
{id:'counter',x:0,z:0.5,r:2.5,label:'صندوق / تحویل سفارش (E)'},
{id:'police',x:1.6,z:0.5,r:1.6,label:'🔴 دکمه مخفی پلیس (E)'},
{id:'radio',x:-1.5,z:0.5,r:2,label:'رادیو قدیمی (E)'},
{id:'power',x:9,z:-6,r:3,label:'اتاق برق / فیوز (E)'},
{id:'storage',x:-9,z:-4,r:3,label:'در انبار قفل‌شده (E)'},
{id:'toilet',x:6,z:-1,r:2,label:'سرویس بهداشتی (E)'},
{id:'fueltank',x:6,z:10,r:2.5,label:'پر کردن مخزن سوخت (E)'},
{id:'mopstation',x:-6,z:2,r:2,label:'برداشتن طی (E)'}
];
}

/* INPUT */
function bindInput(){
document.addEventListener('keydown',function(e){keys[e.key.toLowerCase()]=true;
if(gameState!=='play') return;
if(e.key.toLowerCase()==='e')doInteract();
if(e.key.toLowerCase()==='n')toggleNotebook();
if(e.key.toLowerCase()==='b')toggleShop();
if(e.key.toLowerCase()==='f')toggleFlash();
if(e.key==='Escape')pauseGame();
});
document.addEventListener('keyup',function(e){keys[e.key.toLowerCase()]=false;});
var cv=renderer.domElement;
cv.addEventListener('click',function(){if(gameState==='play'&&!isMobile())cv.requestPointerLock&&cv.requestPointerLock();});
document.addEventListener('mousemove',function(e){if(document.pointerLockElement===cv&&gameState==='play'){var s=S.settings.sens/100;player.yaw-=e.movementX*0.0025*s;player.pitch-=e.movementY*0.0025*s;player.pitch=Math.max(-1.2,Math.min(1.2,player.pitch));}});
// touch look
var lastTX=0,lastTY=0,looking=false;
document.addEventListener('touchstart',function(e){if(e.target.closest('#joy-base')||e.target.closest('button')||e.target.closest('.overlay'))return;var t=e.changedTouches[0];lastTX=t.clientX;lastTY=t.clientY;looking=true;},{passive:true});
document.addEventListener('touchmove',function(e){if(!looking||gameState!=='play')return;var t=e.changedTouches[0];var dx=t.clientX-lastTX,dy=t.clientY-lastTY;lastTX=t.clientX;lastTY=t.clientY;var s=S.settings.sens/100;player.yaw-=dx*0.005*s;player.pitch-=dy*0.005*s;player.pitch=Math.max(-1.2,Math.min(1.2,player.pitch));},{passive:true});
document.addEventListener('touchend',function(){looking=false;});
// joystick
var base=$('joy-base'),knob=$('joy-knob'),jid=null;
base.addEventListener('touchstart',function(e){var t=e.changedTouches[0];jid=t.identifier;},{passive:true});
document.addEventListener('touchmove',function(e){for(var i=0;i<e.changedTouches.length;i++){var t=e.changedTouches[i];if(t.identifier===jid){var r=base.getBoundingClientRect();var cx=r.left+60,cy=r.top+60;var dx=t.clientX-cx,dy=t.clientY-cy;var m=Math.min(45,Math.hypot(dx,dy));var a=Math.atan2(dy,dx);dx=Math.cos(a)*m;dy=Math.sin(a)*m;knob.style.left=(35+dx)+'px';knob.style.top=(35+dy)+'px';joy.x=dx/45;joy.y=dy/45;}}},{passive:true});
document.addEventListener('touchend',function(e){for(var i=0;i<e.changedTouches.length;i++)if(e.changedTouches[i].identifier===jid){jid=null;joy.x=0;joy.y=0;knob.style.left='35px';knob.style.top='35px';}});
$('t-interact').onclick=function(){doInteract();};$('t-run').onclick=function(){player.run=!player.run;toast(player.run?'🏃 دویدن روشن':'🚶 دویدن خاموش');};
$('t-flash').onclick=toggleFlash;$('t-note').onclick=toggleNotebook;$('t-shop').onclick=toggleShop;
}
function isMobile(){return ('ontouchstart' in window)||navigator.maxTouchPoints>0;}

/* UI wiring */
function bindUI(){
$('m-start').onclick=function(){initAudio();if(S.night>1||S.money!==120){showBoss();}else{showBoss();}};
$('m-options').onclick=function(){$('main-menu').classList.add('hidden');$('options-menu').classList.remove('hidden');};
$('opt-back').onclick=function(){$('options-menu').classList.add('hidden');$('main-menu').classList.remove('hidden');applySettings();};
$('m-diff').onclick=function(){$('main-menu').classList.add('hidden');$('difficulty-menu').classList.remove('hidden');refreshDiff();};
$('diff-back').onclick=function(){$('difficulty-menu').classList.add('hidden');$('main-menu').classList.remove('hidden');};
document.querySelectorAll('.diff-card').forEach(function(b){b.onclick=function(){S.difficulty=b.dataset.d;if(S.difficulty==='EASY')S.lives=3;saveGame();refreshDiff();toast('سختی: '+S.difficulty);beep(440,0.2);};});
$('boss-start').onclick=function(){$('boss-modal').classList.add('hidden');startPlay();};
$('btn-notebook').onclick=toggleNotebook;$('btn-shop').onclick=toggleShop;$('btn-flash').onclick=toggleFlash;$('btn-pause').onclick=pauseGame;
$('nb-close').onclick=toggleNotebook;$('nb-prev').onclick=function(){nbPage=Math.max(0,nbPage-1);renderNotebook();};$('nb-next').onclick=function(){nbPage++;renderNotebook();};
$('shop-close').onclick=toggleShop;
$('p-resume').onclick=pauseGame;$('p-save').onclick=saveGame;$('p-exit').onclick=function(){$('pause-menu').classList.add('hidden');toMenu();};
$('end-btn').onclick=function(){$('end-screen').classList.add('hidden');if(S.night>7){toMenu();}else{showBoss();}};
['opt-sound','opt-music','opt-sens','opt-graph','opt-mtime'].forEach(function(id){$(id).addEventListener('change',applySettings);});
}
function refreshDiff(){$('diff-current').textContent='فعلی: '+S.difficulty;document.querySelectorAll('.diff-card').forEach(function(b){b.classList.toggle('active',b.dataset.d===S.difficulty);});var si='';try{var d=JSON.parse(localStorage.getItem(SAVE_KEY));if(d)si='💾 ذخیره: شب '+d.night+' | پول '+d.money+' | سختی '+d.difficulty;}catch(e){}$('menu-save-info').textContent=si+' — START ادامه می‌دهد.';}
function applySettings(){S.settings.sound=+$('opt-sound').value;S.settings.music=+$('opt-music').value;S.settings.sens=+$('opt-sens').value;S.settings.graphics=$('opt-graph').value;S.settings.mtime=+$('opt-mtime').value;if(masterGain)masterGain.gain.value=S.settings.sound/100;if(musicGain)musicGain.gain.value=S.settings.music/100;lookSens=0.003*(S.settings.sens/100);saveGame();toast('⚙️ تنظیمات اعمال شد');}

/* NOTEBOOK */
var nbPage=0;
function toggleNotebook(){if(gameState!=='play'&&!$('notebook').classList.contains('hidden')){$('notebook').classList.add('hidden');gameState='play';return;}if(gameState!=='play')return;var nb=$('notebook');if(nb.classList.contains('hidden')){nb.classList.remove('hidden');nbPage=0;renderNotebook();gameState='notebook';beep(300,0.1);}else{nb.classList.add('hidden');gameState='play';}}
function renderNotebook(){var paper=$('notebook-paper');paper.classList.toggle('bloody',S.night===1);var cfg=NIGHTS[S.night-1];var totalPages=2+cfg.notes.length+1;nbPage=Math.max(0,Math.min(totalPages-1,nbPage));$('nb-title').textContent='دفترچه شیفت — شب '+S.night+' — صفحه '+(nbPage+1)+' از '+totalPages;var c=$('nb-content');if(nbPage===0){var h='<b>وظایف امشب:</b><br>';tasks.forEach(function(t){h+='<div class="'+(t.done?'task-done':'')+'">'+(t.done?'✅ ':'⬜ ')+t.title+' ('+t.progress+'/'+t.need+')</div>';});c.innerHTML=h;}else if(nbPage<=cfg.notes.length){c.innerHTML='<i>✍️ دست‌خط کارمند قبلی:</i><br>'+cfg.notes[nbPage-1].replace(/\n/g,'<br>');}else if(nbPage===totalPages-1){c.innerHTML='<b>📄 صفحه آخر - وظایف کارمند قبلی:</b><br>۱. هرگز بعد از ساعت ۳ به انبار نزدیک نشو.<br>۲. اگه رادیو خودش روشن شد جواب نده.<br>۳. کلید انبار رو از فروشگاه نخر... اون می‌خواد تو بازش کنی.<br><br><span style="color:#900">خون؟ نه... این فقط قهوه‌ست. قهوه... قهوه...</span>';}else{c.innerHTML='یادداشت روزانه: امروز باد عجیبی می‌وزید. مشتری‌ها از دستشویی می‌ترسند.';}}

/* SHOP */
var shopOpen=false;
function toggleShop(){if(gameState!=='play'&&shopOpen){$('shop-modal').classList.add('hidden');shopOpen=false;gameState='play';return;}if(gameState!=='play')return;var m=$('shop-modal');if(m.classList.contains('hidden')){m.classList.remove('hidden');shopOpen=true;gameState='shop';renderShop();}else{m.classList.add('hidden');shopOpen=false;gameState='play';}}
function renderShop(){$('shop-money').textContent=S.money;var g=$('shop-grid');g.innerHTML='';SHOP.forEach(function(it){var d=document.createElement('div');d.className='shop-item';var owned=S.owned[it.id]?'(خریده شد)':'';d.innerHTML='<div class="ico">'+it.i+'</div><b>'+it.n+'</b> '+owned+'<br>'+it.d+'<br>💰 '+it.p+'<br>';var b=document.createElement('button');b.textContent=S.owned[it.id]?'در موجودی':'خرید';b.disabled=S.owned[it.id]||S.money<it.p;b.onclick=function(){if(S.money>=it.p&&!S.owned[it.id]){S.money-=it.p;S.owned[it.id]=true;S.inventory.push(it.id);beep(660,0.2);saveGame();renderShop();updateHUD();toast(it.n+' خریداری شد و در موجودی است');}};d.appendChild(b);g.appendChild(d);});
var inv=$('inv-grid');inv.innerHTML=S.inventory.length?'':'هنوز چیزی نخریده‌ای.';S.inventory.forEach(function(id){var it=SHOP.find(function(x){return x.id===id;});var s=document.createElement('div');s.className='inv-item';s.textContent=it.i+' '+it.n+' — استفاده';s.onclick=function(){useItem(id);};inv.appendChild(s);});}
function useItem(id){
if(id==='medkit'&&S.owned.medkit){if(S.difficulty==='EASY'&&S.lives<3){S.lives++;delete S.owned.medkit;S.inventory=S.inventory.filter(function(x){return x!==id|| (delete S.owned[id],false);});S.inventory=S.inventory.filter(function(x){return x!=='medkit';});toast('⛑️ یک جان برگشت');}else toast('الان نیازی نیست');renderShop();updateHUD();return;}
if(id==='coin'){throwCoin();return;}
if(id==='whistle'){blowWhistle();return;}
if(id==='trap'){placeTrap();return;}
if(id==='mine'){placeMine();return;}
if(id==='binoc'){binocOn=!binocOn;camera.fov=binocOn?25:70;camera.updateProjectionMatrix();toast(binocOn?'🔭 زوم روشن':'🔭 زوم خاموش');return;}
if(id==='stick'){activeGadget='stick';toast('🏏 چوب فلزی آماده: نزدیک هیولا E بزن');toggleShop();return;}
if(id==='exting'){activeGadget='exting';toast('🧯 کپسول آماده: نزدیک آتش E بزن');toggleShop();return;}
if(id==='toolbox'){activeGadget='toolbox';toast('🧰 جعبه ابزار آماده: نزدیک فیوز E بزن');toggleShop();return;}
if(id==='wire'){activeGadget='wire';toast('✂️ سیم‌چین آماده');toggleShop();return;}
if(id==='crowbar'){activeGadget='crowbar';toast('🦯 دیلم آماده: نزدیک مانع E بزن');toggleShop();return;}
if(id==='mop2'||id==='toolbox'){toast('خودکار فعال است');return;}
toast('✅ '+id+' در موجودی است و اثرش خودکار اعمال می‌شود');
}

/* NIGHT FLOW */
function showBoss(){var cfg=NIGHTS[Math.min(S.night,7)-1];$('main-menu').classList.add('hidden');$('difficulty-menu').classList.add('hidden');$('options-menu').classList.add('hidden');$('boss-modal').classList.remove('hidden');$('boss-title').textContent='📞 تماس رئیس — شب '+S.night;var diffInfo=S.difficulty==='EASY'?'جان‌ها: '+S.lives+' | ':'';$('boss-text').textContent='رئیس: '+cfg.boss+' ('+diffInfo+'شیفت ۰۰ تا ۰۶، کامیون ۲۳:۰۰)';var ul=$('boss-tasks');ul.innerHTML='';cfg.tasks.forEach(function(t){var li=document.createElement('li');li.textContent=t;ul.appendChild(li);});gameState='boss';}
function startPlay(){
$('boss-modal').classList.add('hidden');$('hud').classList.remove('hidden');if(isMobile())$('touch-ui').classList.remove('hidden');
nightConfig=NIGHTS[S.night-1];clockMin=23*60;custServed=0;powerOn=true;setPower(true);shelfLevels=[0,0,0];products.forEach(function(p){scene.remove(p);});products=[];monsters.forEach(function(m){scene.remove(m.mesh);});monsters=[];customers.forEach(function(c){scene.remove(c.mesh);});customers=[];goos.forEach(function(g){scene.remove(g.mesh);});goos=[];traps.forEach(function(t){scene.remove(t.mesh);});traps=[];mines.forEach(function(m){scene.remove(m.mesh);});mines=[];thiefActive=null;fireActive=false;fuseBroken=(S.night===6);obstacleBlocked=(S.night>=4);S.fuel=Math.max(40,S.fuel);S.fuelCust=0;
tasks=[];custTotal=3+Math.floor(Math.random()*4);
if(S.night===1)tasks.push({id:'boxes',title:'تخلیه جعبه‌ها',need:3,progress:0,done:false});
else tasks.push({id:'boxes',title:'پر کردن قفسه‌ها',need:3,progress:0,done:false});
tasks.push({id:'serve',title:'خدمت به مشتری‌ها',need:custTotal,progress:0,done:false});
tasks.push({id:'note',title:'خواندن دفترچه',need:1,progress:0,done:false});
if(S.night===4)tasks.push({id:'fire',title:'خاموش کردن آتش',need:1,progress:0,done:false});
if(S.night===6)tasks.push({id:'fuse',title:'تعمیر فیوز',need:1,progress:0,done:false});
if(S.difficulty==='EASY'&&S.lives<=0)S.lives=3;
custSpawnTimes=[];for(var i=0;i<custTotal;i++){var tm=0*60+10+i*(300/custTotal)+Math.random()*30;custSpawnTimes.push(tm);}
monsterSpawnTimes=nightConfig.monsters.map(function(m,idx){return 60+idx*90+Math.random()*40;});
truck.position.set(-20,0,18);truck.visible=true;boxesLeft=[1,1,1];if(S.night>2)boxesLeft.push(1);
player.x=0;player.z=6;player.yaw=Math.PI;
radioOn=true;
gameState='play';updateHUD();toast('🚚 کامیون ساعت ۲۳ رسید! جعبه‌ها را تخلیه کن');beep(330,0.3);
if(fuseBroken)toast('⚡ فیوز خراب است! با جعبه ابزار تعمیر کن');
}

function completeTask(id,amt){var t=tasks.find(function(x){return x.id===id;});if(!t||t.done)return;t.progress+=amt||1;if(t.progress>=t.need){t.progress=t.need;t.done=true;toast('✅ وظیفه انجام شد: '+t.title);beep(880,0.25);}updateHUD();}

function setPower(on){powerOn=on;shopLights.forEach(function(l){l.intensity=on?1:0;});ambient.intensity=on?0.5:0.08;if(!on){toast('💡 برق قطع شد! فقط چراغ‌قوه...');scare();}else toast(on?'💡 برق وصل شد':'');}
var flickT=0;
function toggleFlash(){var on=flashLight.intensity>0;flashLight.intensity=on?0:1.6;$('btn-flash').textContent=on?'🔦 چراغ (F)':'🔦 روشن (F)';beep(on?200:500,0.1);checkLightMonster();}
function checkLightMonster(){monsters.forEach(function(m){if(m.def.light&&flashLight.intensity>0){var d=Math.hypot(m.mesh.position.x-player.x,m.mesh.position.z-player.z);if(d<8){m.flee=6;toast('👹 '+m.def.fa+' از نور فرار کرد!');}}});}

/* INTERACT */
var currentTarget=null;
function nearestInteract(){var best=null,bd=99;interactables.forEach(function(it){var d=Math.hypot(it.x-player.x,it.z-player.z);if(d<it.r&&d<bd){bd=d;best=it;}});return best;}
function doInteract(){
if(gameState!=='play')return;
if(activeGadget==='stick'){hitWithStick();return;}
var t=nearestInteract();if(!t){tryPickupGoo();return;}
beep(500,0.08);noiseBurst(0.05);
if(t.id==='truckbox'){if(player.carrying){toast('جعبه دست داری! به قفسه ببر');}else if(boxesLeft.length){boxesLeft.pop();player.carrying=true;$('carry-label').classList.remove('hidden');toast('📦 جعبه برداشتی');}else toast('جعبه‌ای نمانده');}
else if(t.id.indexOf('shelf')===0){var idx=+t.id.slice(5);if(player.carrying){player.carrying=false;$('carry-label').classList.add('hidden');if(shelfLevels[idx]<5){shelfLevels[idx]++;spawnProduct(idx);completeTask('boxes',1);S.money+=10;toast('📦 چیده شد! +۱۰ تومان');}else toast('قفسه پر است');}else toast('اول از کامیون جعبه بیاور');}
else if(t.id.indexOf('pump')===0){serveFuel();}
else if(t.id==='counter'){serveCounter();}
else if(t.id==='police'){callPolice();}
else if(t.id==='radio'){radioOn=!radioOn;toast(radioOn?'📻 رادیو روشن شد... صدای عجیب':'📻 رادیو خاموش شد');if(S.owned.radio2&&S.owned.battery)toast('📻 بی‌سیم: ...صدای کارمند قبلی... کمک... انبار...');}
else if(t.id==='power'){fixPower();}
else if(t.id==='storage'){openStorage();}
else if(t.id==='toilet'){toast('🚻 دستشویی... بوی عجیب... بهتره برگردی');if(S.night>=3&&Math.random()<0.4){scare();toast('👁 چیزی در آینه بود!');}}
else if(t.id==='fueltank'){if(S.fuelCust>=10||S.fuel<30){S.fuel=100;S.fuelCust=0;S.money=Math.max(0,S.money-20);toast('⛽ مخزن پر شد! -۲۰ تومان');}else toast('⛽ مخزن هنوز کافی است ('+S.fuelCust+'/10)');}
else if(t.id==='mopstation'){cleanGoo();}
updateHUD();
}
function spawnProduct(idx){var c=[0xff4444,0x44ff44,0x4444ff][idx];var m=box(0.4,0.4,0.4,c,-4+idx*4+(Math.random()-0.5),0.6+shelfLevels[idx]*0.35,-4);products.push(m);}
function serveFuel(){var c=customers.find(function(x){return x.type==='fuel'&&!x.served&&Math.hypot(x.mesh.position.x-player.x,x.mesh.position.z-player.z)<5;});if(!c){toast('مشتری سوختی نزدیک نیست');return;}var speed=S.owned.glove?1.3:1;S.money+=30;S.fuel=Math.max(0,S.fuel-8);S.fuelCust++;c.served=true;custServed++;completeTask('serve',1);scene.remove(c.mesh);customers=customers.filter(function(x){return x!==c;});toast('⛽ سوخت‌گیری انجام شد +۳۰ تومان');beep(700,0.2);if(S.fuelCust>=10)toast('⚠️ مخزن بعد از ۱۰ مشتری خالی است! به تانک برو');updateHUD();}
function serveCounter(){var c=customers.find(function(x){return (x.type==='shop'||x.type==='talk'||x.type==='thief')&&Math.hypot(x.mesh.position.x-0,x.mesh.position.z-0.5)<6;});if(fireActive&&activeGadget==='exting'){fireActive=false;completeTask('fire',1);toast('🧯 آتش خاموش شد!');return;}if(!c){toast('مشتری‌ای پشت پیشخوان نیست');return;}
if(c.type==='thief'){toast('🦹 او دزد است! پول نمی‌دهد! دکمه مخفی قرمز را بزن!');return;}
if(c.type==='talk'){openDialogue(c);return;}
c.served=true;custServed++;completeTask('serve',1);S.money+=25;toast('🛒 سفارش تحویل شد +۲۵ تومان');scene.remove(c.mesh);customers=customers.filter(function(x){return x!==c;});updateHUD();}
function callPolice(){if(!thiefActive){toast('🔴 دکمه مخفی... فعلاً خبری نیست');return;}toast('🚔 پلیس خبر شد! تا رسیدن طاقت بیاور...');policeTimer=30;beep(900,0.4);}
function fixPower(){if(fuseBroken){if(activeGadget==='toolbox'||S.owned.toolbox){fuseBroken=false;activeGadget=null;completeTask('fuse',1);if(!powerOn)setPower(true);toast('🔧 فیوز تعمیر شد!');}else toast('⚡ فیوز خراب است! جعبه ابزار لازم است');return;}
if(!powerOn){if(S.owned.toolbox||activeGadget==='wire'){setPower(true);toast('🔧 برق وصل شد');}else toast('🔧 برای وصل برق جعبه ابزار/سیم‌چین لازم است');}else toast('⚡ برق مشکلی ندارد'+(obstacleBlocked?' ولی مانعی سر راه انبار است (دیلم لازم است)':''));}
function openStorage(){if(obstacleBlocked){if(activeGadget==='crowbar'||S.owned.crowbar){obstacleBlocked=false;activeGadget=null;toast('🦯 مانع برداشته شد!');}else{toast('🚧 مانع چوبی! دیلم لازم است');return;}}
if(!S.owned.stkey){toast('🔒 قفل است! نوشته: DO NOT ENTER — کلید انبار را از فروشگاه بخر (۳۰۰)');noiseBurst(0.4);return;}
// ending
if(S.night===7){winGame();}else{toast('🚪 انبار... صدای نفس... هنوز زود است. شب هفتم برگرد.');scare();S.money+=50;toast('📄 سرنخ پیدا کردی +۵۰');}}
function tryPickupGoo(){cleanGoo();}
function cleanGoo(){var g=goos.find(function(x){return Math.hypot(x.mesh.position.x-player.x,x.mesh.position.z-player.z)<3;});if(!g){return;}var fast=S.owned.mop2?2:1;g.hp-=fast;if(g.hp<=0){scene.remove(g.mesh);goos=goos.filter(function(x){return x!==g;});S.money+=20;toast('🧹 تمیز شد +۲۰');}else toast('🧹 تمیزکاری...');}

/* DIALOGUE */
var dlgCustomer=null;
function openDialogue(c){dlgCustomer=c;gameState='dialog';$('dialogue').classList.remove('hidden');$('dlg-name').textContent=c.name;var q=DLG_Q[Math.floor(Math.random()*DLG_Q.length)];$('dlg-text').textContent='مشتری: «'+q+'»';var ch=$('dlg-choices');ch.innerHTML='';var opts=[DLG_A[DLG_Q.indexOf(q)],'باشه...','نمی‌دونم، عجله دارم'];opts.forEach(function(o){var b=document.createElement('button');b.textContent=o;b.onclick=function(){closeDialogue(o);};ch.appendChild(b);});}
function closeDialogue(ans){$('dialogue').classList.add('hidden');gameState='play';if(dlgCustomer){if(Math.random()<0.25){toast('🔎 سرنخ: «صاحب قبلی... صدای انبار...» +۳۰');S.money+=30;}else{S.money+=15;toast('☕ قهوه دادی +۱۵');}dlgCustomer.served=true;custServed++;completeTask('serve',1);scene.remove(dlgCustomer.mesh);customers=customers.filter(function(x){return x!==dlgCustomer;});dlgCustomer=null;updateHUD();}}

/* CUSTOMERS */
function spawnCustomer(forceType){
var isAbnormal=S.night>=2&&Math.random()<0.18;
var type=forceType||'shop';var r=Math.random();
if(!forceType){if(r<0.4)type='fuel';else if(r<0.65)type='shop';else if(r<0.8)type='talk';else if(r<0.9)type='thief';else type='shop';}
if(isAbnormal&&!forceType)type='abnormal';
var colors=[0xffcc99,0x99ccff,0xcc99ff,0x99ff99,0xff9999];var col=colors[Math.floor(Math.random()*colors.length)];
if(type==='abnormal')col=0x000000;
var mesh=new THREE.Group();var body=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.35,1.4,8),mat(col));body.position.y=0.9;mesh.add(body);var head=new THREE.Mesh(new THREE.SphereGeometry(0.25,8,8),mat(type==='abnormal'?0x111111:0xffdbac));head.position.y=1.9;mesh.add(head);
if(type==='abnormal'){var e1=new THREE.Mesh(new THREE.SphereGeometry(0.05,6,6),new THREE.MeshBasicMaterial({color:0xff0000}));e1.position.set(-0.1,1.95,0.22);mesh.add(e1);var e2=e1.clone();e2.position.x=0.1;mesh.add(e2);}
mesh.position.set(8+Math.random()*4,0,20);scene.add(mesh);
var c={mesh:mesh,type:type==='abnormal'?'talk':type,realType:type,name:type==='fuel'?'راننده':type==='thief'?'مشتری مشکوک':type==='abnormal'?'مسافر ناشناس':'مشتری',served:false,t:0};
if(type==='thief'){thiefActive=c;setTimeout(function(){if(thiefActive===c&&!c.served){toast('🦹 دزد دارد جنس برمی‌دارد! دکمه مخفی زیر پیشخوان!');beep(200,0.5,'sawtooth');}},4000);}
customers.push(mesh);customers[customers.length-1]=c;
if(type==='abnormal')toast('🌫 یک مشتری عجیب وارد شد... او را به هیولا تبدیل نکن، فقط زیر نظر بگیر');
else toast('🧍 مشتری جدید: '+c.name);
return c;}
function updateCustomers(dt){
customers.forEach(function(c){
var target=c.type==='fuel'?{x:c.mesh.position.x>0?6:-6,z:12}:{x:(Math.random()<0.5?-1:1),z:0.5};
if(!c.target){c.target=c.type==='fuel'?{x:c.mesh.position.x>0?6:-6,z:13}:{x:0,z:2};}
var dx=c.target.x-c.mesh.position.x,dz=c.target.z-c.mesh.position.z;var d=Math.hypot(dx,dz);
if(d>0.5){c.mesh.position.x+=dx/d*1.5*dt;c.mesh.position.z+=dz/d*1.5*dt;}
c.t+=dt;
if(c.realType==='abnormal'&&c.t>25&&!c.transformed){c.transformed=true;scare();toast('👹 او تبدیل شد... ولی فقط نگاهت می‌کند و می‌رود!');setTimeout(function(){scene.remove(c.mesh);var i=customers.indexOf(c);if(i>=0)customers.splice(i,1);if(!c.served){custServed++;completeTask('serve',1);}},3000);}
});
if(thiefActive&&thiefActive.served)thiefActive=null;
if(policeTimer>0){policeTimer-=dt;if(policeTimer<=0&&thiefActive){toast('🚔 پلیس رسید! دزد دستگیر شد +۱۰۰');S.money+=100;scene.remove(thiefActive.mesh);customers=customers.filter(function(x){return x!==thiefActive;});thiefActive=null;custServed++;completeTask('serve',1);updateHUD();}}
}

/* MONSTERS */
function spawnMonster(key){
var def=MONDEF[key];var nightBoost=1+(S.night-1)*0.12;var diffBoost=S.difficulty==='HARD'?1.3:S.difficulty==='EASY'?0.8:1;
var geo=key==='deaf'?new THREE.BoxGeometry(1,def.sz,0.8):key==='blind'?new THREE.SphereGeometry(0.7,8,8):new THREE.ConeGeometry(0.6,def.sz,7);
var m=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:def.c}));m.position.set((Math.random()-0.5)*20,def.sz/2,18);scene.add(m);
var mo={mesh:m,def:def,key:key,hp:(2+S.night)*nightBoost,t:0,leaveT:S.settings.mtime,flee:0,speed:def.sp*diffBoost*nightBoost};
monsters.push(mo);scare();toast('👹 '+def.fa+' ظاهر شد! ضعف: '+def.weak);noiseBurst(0.5);
return mo;}
function updateMonsters(dt){
monsters.forEach(function(mo){
mo.t+=dt;
if(mo.flee>0){mo.flee-=dt;var dx=mo.mesh.position.x-player.x,dz=mo.mesh.position.z-player.z;var d=Math.hypot(dx,dz)||1;mo.mesh.position.x+=dx/d*mo.speed*dt;mo.mesh.position.z+=dz/d*mo.speed*dt;if(mo.flee<=0){removeMonster(mo);toast('👹 هیولا فرار کرد');}return;}
var px=player.x,pz=player.z,mx=mo.mesh.position.x,mz=mo.mesh.position.z;var dist=Math.hypot(px-mx,pz-mz);
var canHear=mo.def.hear;var canSee=mo.def.see;
var playerRunning=(keys['shift']||player.run);
var playerNoisy=playerRunning||flashLight.intensity>0&&mo.def.soundSens;
if(mo.key==='deaf'){canHear=false;}
if(mo.key==='blind'){canSee=false;canHear=true;if(!playerRunning&&flashLight.intensity===0)canHear=false;}
if(mo.key==='light'&&flashLight.intensity>0&&dist<9){mo.flee=5;return;}
if(mo.key==='sound'&&dist<12){
// check coin/whistle distraction
var coin=coins.find(function(cc){return Math.hypot(cc.x-mx,cc.z-mz)<6;});
if(coin){var cdx=coin.x-mx,cdz=coin.z-mz;var cd=Math.hypot(cdx,cdz)||1;mo.mesh.position.x+=cdx/cd*mo.speed*dt;mo.mesh.position.z+=cdz/cd*mo.speed*dt;return;}
}
var chasing=false;
if(canSee&&dist<14)chasing=true;
if(canHear&&playerNoisy&&dist<18)chasing=true;
if(mo.key==='blind'&&playerRunning)chasing=true;
if(chasing){var vx=(px-mx)/ (dist||1),vz=(pz-mz)/(dist||1);mo.mesh.position.x+=vx*mo.speed*dt;mo.mesh.position.z+=vz*mo.speed*dt;}
else{mo.mesh.position.x+=Math.sin(mo.t)*0.5*dt;}
// trap check
traps.forEach(function(tr){if(!tr.used&&Math.hypot(tr.x-mx,tr.z-mz)<1.2){if(mo.def.trap){tr.used=true;scene.remove(tr.mesh);killMonster(mo);}else toast('🪤 این هیولا در تله نمی‌افتد!');}});
// mine check
mines.forEach(function(mn){if(!mn.used&&Math.hypot(mn.x-mx,mn.z-mz)<1.2){mn.used=true;scene.remove(mn.mesh);boom(mn.x,mn.z);if(Math.hypot(player.x-mn.x,player.z-mn.z)<3){onCaught(true);}else killMonster(mo);}});
// catch
if(dist<1.4){onCaught(false);}
if(mo.t>mo.leaveT){removeMonster(mo);toast('👹 هیولا نتوانستت بگیرد و رفت...');}
});
coins=coins.filter(function(c){c.life-=dt;if(c.life<0){if(c.mesh)scene.remove(c.mesh);return false;}return true;});
}
function removeMonster(mo){scene.remove(mo.mesh);monsters=monsters.filter(function(x){return x!==mo;});}
function killMonster(mo){removeMonster(mo);S.money+=80;toast('💀 هیولا شکست خورد +۸۰! حالا با طی تمیز کن');beep(150,0.5,'sawtooth');var g=new THREE.Mesh(new THREE.CircleGeometry(0.8,10),new THREE.MeshBasicMaterial({color:Math.random()<0.5?0x00ff66:0x3399ff}));g.rotation.x=-Math.PI/2;g.position.set(mo.mesh.position.x,0.02,mo.mesh.position.z);scene.add(g);goos.push({mesh:g,hp:S.owned.mop2?2:4});tasks.push({id:'clean'+Date.now(),title:'تمیز کردن ماده هیولا',need:1,progress:0,done:false});}
function boom(x,z){var l=new THREE.PointLight(0xff5500,3,10);l.position.set(x,1,z);scene.add(l);noiseBurst(0.4);setTimeout(function(){scene.remove(l);},500);toast('💥 انفجار نمایشی!');}
function throwCoin(){if(!S.owned.coin){toast('سکه نداری! از فروشگاه بخر');return;}var a=player.yaw;var cx=player.x-Math.sin(a)*4,cz=player.z-Math.cos(a)*4;var m=box(0.2,0.05,0.2,0xffd700,cx,0.1,cz);coins.push({x:cx,z:cz,mesh:m,life:15});beep(1200,0.15);toast('🪙 سکه پرتاب شد!');}
function blowWhistle(){if(!S.owned.whistle){toast('سوت نداری!');return;}beep(2000,0.5);noiseBurst(0.2);monsters.forEach(function(mo){if(mo.def.soundSens){mo.flee=2;var cx=player.x+(Math.random()-0.5)*8,cz=player.z+(Math.random()-0.5)*8;mo.mesh.position.x=cx;mo.mesh.position.z=cz;}});toast('📯 سوت کشیدی!');}
function placeTrap(){if(!S.owned.trap){toast('تله نداری!');return;}var m=box(0.8,0.2,0.8,0x666666,player.x,0.1,player.z-1);traps.push({x:player.x,z:player.z-1,mesh:m,used:false});toast('🪤 تله گذاشته شد');}
function placeMine(){if(!S.owned.mine){toast('مین نداری!');return;}var m=box(0.5,0.15,0.5,0xff0000,player.x,0.08,player.z-1);mines.push({x:player.x,z:player.z-1,mesh:m,used:false});toast('💥 مین تخیلی گذاشته شد (آرکید)');}
function hitWithStick(){var hit=false;monsters.forEach(function(mo){if(Math.hypot(mo.mesh.position.x-player.x,mo.mesh.position.z-player.z)<2.5){mo.flee=8;hit=true;}});activeGadget=null;if(hit){toast('🏏 ضربه! هیولا دور شد');beep(300,0.3,'square');}else toast('به چیزی نخورد');}

/* CATCH / GAMEOVER */
function onCaught(byMine){
scare();
if(S.difficulty==='EASY'){S.lives--;updateHUD();if(S.lives>0){toast('💔 گرفته شدی! '+S.lives+' جان مانده. همان شب از ۰۰:۰۰');resetNightClock();}else{toast('💔 هر ۳ جان تمام شد! همان شب از ۰۰:۰۰');S.lives=3;resetNightClock();}}
else if(S.difficulty==='NORMAL'){toast('💔 گرفته شدی! همان شب از ۰۰:۰۰ (پیشرفت شب‌های قبل حفظ است)');resetNightClock();}
else{S.money=120;S.inventory=[];S.owned={};S.night=1;S.lives=1;saveGame();showEnd('در درجه HARD گرفته شدی! کل بازی از شب اول...','باشه');return;}
}
function resetNightClock(){monsters.forEach(function(m){scene.remove(m.mesh);});monsters=[];clockMin=0;custServed=0;custSpawnTimes=[];for(var i=0;i<custTotal;i++)custSpawnTimes.push(10+i*40);powerOn=true;setPower(true);player.x=0;player.z=6;}
function showEnd(title,text){gameState='end';$('end-title').textContent=title;$('end-text').textContent=text;$('end-screen').classList.remove('hidden');}
function winGame(){gameState='end';saveGame();localStorage.removeItem(SAVE_KEY);showEnd('🌅 پایان — ساعت ۰۶:۰۰ شب هفتم','راز فاش شد: موجود انبار همان کارمند قبلی بود... تو. دایره شب اول کامل شد. تو حالا نگهبان جدیدی. NIGHT SHIFT تمام شد. مرسی که بازی کردی!');monsters.forEach(function(m){scene.remove(m.mesh);});monsters=[];}
function pauseGame(){if(gameState==='play'){gameState='pause';$('pause-menu').classList.remove('hidden');if(document.pointerLockElement)document.exitPointerLock();}else if(gameState==='pause'){gameState='play';$('pause-menu').classList.add('hidden');}}
function toMenu(){gameState='menu';$('hud').classList.add('hidden');$('touch-ui').classList.add('hidden');$('main-menu').classList.remove('hidden');refreshDiff();}

/* LOOP */
var lastT=0,spawnedCust=0,spawnedMon=0,radioAcc=0;
function animate(t){
requestAnimationFrame(animate);
var dt=Math.min(0.05,(t-lastT)/1000||0.016);lastT=t;
if(gameState==='play'){
clockMin+=dt*1.0;
if(clockMin>=30*60)clockMin=0;
var h=Math.floor(clockMin/60)%24;
// power events
if(S.night===1&&h===2&&powerOn&&clockMin<2*60+2){setPower(false);}
if(S.night===7&&h===3&&powerOn){setPower(false);}
if(nightConfig.flicker&&powerOn){flickT+=dt;if(flickT>4){flickT=0;if(Math.random()<0.5){shopLights.forEach(function(l){l.intensity=0.2;});setTimeout(function(){if(powerOn)shopLights.forEach(function(l){l.intensity=1;});},200);if(Math.random()<0.2)noiseBurst(0.2);}}}
// truck drive in
if(truck.visible&&truck.position.x<-12)truck.position.x+=dt*3;
// customers spawn after 00
if(h>=0&&h<6){
custSpawnTimes.forEach(function(st,idx){var cur=(h*60+Math.floor(clockMin%60));if(!st._d&&cur>=st){st._d=true;spawnCustomer();}});
}
// monsters spawn
monsterSpawnTimes.forEach(function(st,idx){var curMin=(h>=23?(h-23)*60:(h+1)*60);if(!st._d&&clockMin>=60+idx*60){st._d=true;spawnMonster(nightConfig.monsters[idx]);}});
monsterSpawnTimes._d=true;
// fire event night4
if(S.night===4&&!fireActive&&h===2&&Math.random()<0.01){fireActive=true;toast('🔥 آتش در انبار! با کپسول خاموش کن!');}
// radio
radioAcc+=dt;if(radioAcc>3){radioAcc=0;if(radioOn)radioMusic();if(Math.random()<0.05&&!radioOn){radioOn=true;toast('📻 رادیو خودش روشن شد...');}}
updateCustomers(dt);updateMonsters(dt);
// movement
var sp=(keys['shift']||player.run)?5:2.8;if(S.owned.glove)sp*=1.1;
var f=0,s=0;if(keys['w'])f+=1;if(keys['s'])f-=1;if(keys['a'])s-=1;if(keys['d'])s+=1;f+=-joy.y;s+=joy.x;
var sin=Math.sin(player.yaw),cos=Math.cos(player.yaw);
var vx=(-sin*f+cos*s)*sp*dt,vz=(-cos*f-sin*s)*sp*dt;
var nx=player.x+vx,nz=player.z+vz;
var blocked=false;colliders.forEach(function(c){if(nx>c.x1-0.4&&nx<c.x2+0.4&&nz>c.z1-0.4&&nz<c.z2+0.4)blocked=true;});
if(!blocked){player.x=Math.max(-30,Math.min(30,nx));player.z=Math.max(-15,Math.min(28,nz));}
else{noiseBurst(0.02);}
// camera
camera.position.set(player.x,1.6,player.z);
camera.rotation.order='YXZ';camera.rotation.y=player.yaw;camera.rotation.x=player.pitch;
flashLight.position.set(player.x,1.6,player.z);
var dir=new THREE.Vector3(0,0,-1);dir.applyEuler(camera.rotation);flashLight.target.position.set(player.x+dir.x*5,1.2+dir.y*5,player.z+dir.z*5);
// interact prompt
var nt=nearestInteract();currentTarget=nt;
if(nt){$('interact-prompt').classList.remove('hidden');$('interact-text').textContent=(isMobile()?'👆 ':'E - ')+nt.label;}else $('interact-prompt').classList.add('hidden');
// end night at 06
if(h===6){endNight();}
updateHUD();
}
renderer.render(scene,camera);
}
function endNight(){
if(S.night>=7){winGame();return;}
S.night++;S.money+=100;saveGame();
showEnd('🌅 شیفت تمام شد — ۰۶:۰۰','شب '+(S.night-1)+' تمام شد! +۱۰۰ تومان پاداش. آماده شب '+S.night+' شو.');
}

// boot
window.addEventListener('load',function(){
initThree();bindInput();bindUI();refreshDiff();
$('opt-sound').value=S.settings.sound;$('opt-music').value=S.settings.music;$('opt-sens').value=S.settings.sens;$('opt-graph').value=S.settings.graphics;$('opt-mtime').value=S.settings.mtime;
player.x=0;player.z=6;camera.position.set(0,3,10);camera.lookAt(0,1,-2);
requestAnimationFrame(animate);
setInterval(function(){if(gameState==='menu'){var a=Date.now()/800;ambient.intensity=0.4+Math.sin(a)*0.1;renderer.render(scene,camera);}},50);
});