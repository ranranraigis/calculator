$(document).ready(initialize);
var gl_mode, gl_enemy = [], otherBuff = [];
var tableclone;

function toNum(val){
    return (val - 0);
}

function rounds(val, digit){
    digit = Math.pow(10, digit);
    val = Math.round(val * digit);
    val = val / digit;

    return val;
}

var bunits = [];
var fil_units = [];
var units = [];
var unitdata = function unitdata(rows){
    this.sid = toNum(rows.gsx$sid.$t);
    this.id = toNum(rows.gsx$id.$t);
    this.clas = rows.gsx$class.$t;
    this.name = rows.gsx$name.$t;
    this.uid = toNum(rows.gsx$uid.$t);
    this.rare = toNum(rows.gsx$rare.$t);
    this.cc = toNum(rows.gsx$cc.$t);
    this.noncc = toNum(rows.gsx$noncc.$t);
    this.lv = toNum(rows.gsx$lv.$t);
    this.lvmax = toNum(rows.gsx$lvmax.$t);
    this.hp = toNum(rows.gsx$hp.$t);
    this.hpmax = toNum(rows.gsx$hpmax.$t);
    this.bonushp = toNum(rows.gsx$bonushp.$t);
    this.atk = toNum(rows.gsx$atk.$t);
    this.atkmax = toNum(rows.gsx$atkmax.$t);
    this.bonusatk = toNum(rows.gsx$bonusatk.$t);
    this.def = toNum(rows.gsx$def.$t);
    this.defmax = toNum(rows.gsx$defmax.$t);
    this.bonusdef = toNum(rows.gsx$bonusdef.$t);
    this.resi = toNum(rows.gsx$resi.$t);
    this.bonusresi = toNum(rows.gsx$bonusresi.$t);
    this.block = toNum(rows.gsx$block.$t);
    this.bonusblock = toNum(rows.gsx$bonusblock.$t);
    this.range = toNum(rows.gsx$range.$t);
    this.bonusrange = toNum(rows.gsx$bonusrange.$t);
    this.costmax = toNum(rows.gsx$costmax.$t);
    this.costmin = toNum(rows.gsx$costmin.$t);
    this.quadra = toNum(rows.gsx$quadra.$t);
    this.specialatk = toNum(rows.gsx$specialatk.$t);
    this.specialatk2 = toNum(rows.gsx$specialatk2.$t);
    this.incatksp = toNum(rows.gsx$incatksp.$t);
    this.skill = rows.gsx$skill.$t;
    this.atktype = toNum(rows.gsx$atktype.$t);
    this.type = toNum(rows.gsx$type.$t);
    this.dataerr = rows.gsx$dataerr.$t;
    this.motion = toNum(rows.gsx$motion.$t);
    this.s_motion = toNum(rows.gsx$smotion.$t);
    this.wait = toNum(rows.gsx$wait.$t);
    this.s_wait = toNum(rows.gsx$swait.$t);
    this.teambuff = toNum(rows.gsx$teambuff.$t);
};

var rar = {1:'鉄', 2:'銅', 3:'銀', 4:'金', 5:'白', 6:'黒', 7:'青'};

var skills = [];
var sskills = [];
var skilldata = function skilldata(rows){
    this.id = toNum(rows.gsx$id.$t);
    this.name = rows.gsx$name.$t;
    this.lvmax = toNum(rows.gsx$lvmax.$t);
    this.inchp = toNum(rows.gsx$inchp.$t);
    this.inchpmax = toNum(rows.gsx$inchpmax.$t);
    this.incatk = toNum(rows.gsx$incatk.$t);
    this.incatkmax = toNum(rows.gsx$incatkmax.$t);
    this.incdef = toNum(rows.gsx$incdef.$t);
    this.incdefmax = toNum(rows.gsx$incdefmax.$t);
    this.incpro = toNum(rows.gsx$incpro.$t);
    this.incpromax = toNum(rows.gsx$incpromax.$t);
    this.incresi = toNum(rows.gsx$incresi.$t);
    this.incresimax = toNum(rows.gsx$incresimax.$t);
    this.addresi = toNum(rows.gsx$addresi.$t);
    this.addresimax = toNum(rows.gsx$addresimax.$t);
    this.incrange = toNum(rows.gsx$incrange.$t);
    this.incrangemax = toNum(rows.gsx$incrangemax.$t);
    this.incblock = toNum(rows.gsx$incblock.$t);
    this.incblockmax = toNum(rows.gsx$incblockmax.$t);
    this.dmgcut = toNum(rows.gsx$dmgcut.$t);
    this.dmgcutmax = toNum(rows.gsx$dmgcutmax.$t);
    this.dmgcutmat = toNum(rows.gsx$dmgcutmat.$t);
    this.dmgcutmatmax = toNum(rows.gsx$dmgcutmatmax.$t);
    this.dmgcutmag = toNum(rows.gsx$dmgcutmag.$t);
    this.dmgcutmagmax = toNum(rows.gsx$dmgcutmagmax.$t);
    this.enemyatkmax = toNum(rows.gsx$enemyatkmax.$t);
    this.enemyatkmin = toNum(rows.gsx$enemyatkmin.$t);
    this.enemymatmax = toNum(rows.gsx$enemyatkmatmax.$t);
    this.enemymatmin = toNum(rows.gsx$enemyatkmatmin.$t);
    this.enemydefmax = toNum(rows.gsx$enemydefmax.$t);
    this.enemydefmin = toNum(rows.gsx$enemydefmin.$t);
    this.enemyresimax = toNum(rows.gsx$enemyresimax.$t);
    this.enemyresimin = toNum(rows.gsx$enemyresimin.$t);
    this.quadra = toNum(rows.gsx$quadra.$t);
    this.specialatk = toNum(rows.gsx$specialatk.$t);
    this.incatksp = toNum(rows.gsx$incatksp.$t);
    this.atktype = toNum(rows.gsx$atktype.$t);
    this.timemin = toNum(rows.gsx$timemin.$t);
    this.timemax = toNum(rows.gsx$timemax.$t);
    this.ctmax = toNum(rows.gsx$ctmax.$t);
    this.ctmin = toNum(rows.gsx$ctmin.$t);
    this.wtsilmax = toNum(rows.gsx$wtsilmax.$t);
    this.wtsilmin = toNum(rows.gsx$wtsilmin.$t);
    this.wtgolmax = toNum(rows.gsx$wtgolmax.$t);
    this.wtgolmin = toNum(rows.gsx$wtgolmin.$t);
    this.wtplamax = toNum(rows.gsx$wtplamax.$t);
    this.wtplamin = toNum(rows.gsx$wtplamin.$t);
    this.wtblamax = toNum(rows.gsx$wtblamax.$t);
    this.wtblamin = toNum(rows.gsx$wtblamin.$t);
    this.wtsapmax = toNum(rows.gsx$wtsapmax.$t);
    this.wtsapmin = toNum(rows.gsx$wtsapmin.$t);

};

var bclass = [];
var classes = [];
var classdata = function classdata(rows){
    if(rows === null){
        this.name = '';
        this.id = '';
        this.cc = '';
        this.sid = '';
        this.sname = '';
    } else {
        this.name = rows.gsx$name.$t;
        this.id = toNum(rows.gsx$id.$t);
        this.cc = toNum(rows.gsx$cc.$t);
        this.sid = toNum(rows.gsx$sid.$t);
        this.sname = rows.gsx$sname.$t;
    }
    this.bufhp = 0;
    this.bufatk = 0;
    this.bufdef = 0;
    this.bufresi = 0;
};

var actbuff = [];
var buffs = [];
var buffdata = function buffdata(rows){
    this.sid = toNum(rows.gsx$sid.$t);
    this.sname = rows.gsx$sname.$t;
    this.bufhp = toNum(rows.gsx$bufhp.$t);
    this.bufatk = toNum(rows.gsx$bufatk.$t);
    this.bufdef = toNum(rows.gsx$bufdef.$t);
    this.bufresi = toNum(rows.gsx$bufresi.$t);
    this.balhp = rows.gsx$balhp.$t;
    this.balatk = rows.gsx$balatk.$t;
    this.baldef = rows.gsx$baldef.$t;
    this.balresi = rows.gsx$balresi.$t;
};

//var scc = {0:'未', 1:'CC', 2:'覚', 3:'Ｓ'};
var scc = [];
var ccs = [];
var cc = function cc(rows){
	this.id = toNum(rows.gsx$id.$t);
	this.sname = rows.gsx$sname.$t;
};

var rar = [];
var rars = [];
var rarity = function rarity(rows){
	this.id = toNum(rows.gsx$id.$t);
	this.sname = rows.gsx$sname.$t;
};

var skillbuffs = new skillbuff();
function skillbuff(){
    this.prince = 1;
    this.inchp = 1;
    this.incatk = 1;
    this.incdef = 1;
    this.incpro = 1;
    this.incresi = 1;
    this.addresi = 0;
    this.dmgcutmat = 1;
    this.dmgcutmag = 1;

    this.emydebatk = 1;
    this.emydebdef = 1;
    this.emydebresi = 1;
}

var updates = [];
function update(rows){
	this.ymd = rows.gsx$ymd.$t;
	this.summary = rows.gsx$summary.$t;
}

var sptype = {999:'なし', 1:'地上', 2:'飛行', 3:'アーマー', 4:'アンデッド', 5:'ドラゴン', 6:'妖怪', 7:'デーモン'};
var atkmode = {cnt: '回数', dps:'DPS', time:'時間'};

var parse = [];