
$('.hage').prop('disabled', true);
$('select.skillsel').prop('disabled', true);

function initialize(){
    loadUnit();
    loadSkill();
    loadsSkill();
    loadClass();
    loadBuff();
    loadCC();
    loadRare();
    loadUpdate();

    $('#outputTable').trigger('sortReset');

}

function load_error(){
    $('#contents').html('データの読み込みに失敗しました。<br/>再読み込みしても直らない、時間を空けても直らない場合は<br/>Google Appsが死んでいないか確認してみてください<br/>参考URL:<a href="https://downdetector.jp/shougai/google">https://downdetector.jp/shougai/google</a>');
}

/*
    Unit	:od6
    Class	:ot3jy8k
    Rarity	:ofp6zpp
    CC		:ova6i1y
    Skill	:opo02ju
    sSkill	:omg5gm7
    Buff	:ook351m
    UPDATE	:ot7d01q
*/

function loadUnit(){
    $.ajax({
        type: 'GET',
        url: 'https://spreadsheets.google.com/feeds/list/1GO0fzdzow6HXWfqUGDokR_k4993hjN_GJp6qgGc2XZ0/od6/public/values?alt=json',
        dataType: 'jsonp',
        cache: false,
        success: function(data){ // 通信が成功した時
            var sheetsEntry = data.feed.entry; // 実データ部分を取得
            tmp = getUnit(sheetsEntry); // データを整形
        },
        error: function(){ // 通信が失敗した時
            load_error();
            console.log('loadUnit error');
        }
    });
}
function getUnit(sheetsEntry){
	var u = units;
    sheetsEntry.forEach(function(rows){
        var temp = new unitdata(rows);
        u.push(temp);
    });
    load_progress();
}

function loadSkill(){
    $.ajax({
        type: 'GET',
        url: 'https://spreadsheets.google.com/feeds/list/1GO0fzdzow6HXWfqUGDokR_k4993hjN_GJp6qgGc2XZ0/opo02ju/public/values?alt=json',
        dataType: 'jsonp',
        cache: false,
        success: function(data){ // 通信が成功した時
            var sheetsEntry = data.feed.entry; // 実データ部分を取得
            tmp = getSkill(sheetsEntry); // データを整形
        },
        error: function(){ // 通信が失敗した時
            load_error();
            console.log('loadSkill error');
        }
    });
}
function getSkill(sheetsEntry){
	var s = skills;
    sheetsEntry.forEach(function(rows){
        var temp = new skilldata(rows);
        s.push(temp);
    });
    
    load_progress();
}

function loadsSkill(){
    $.ajax({
        type: 'GET',
        url: 'https://spreadsheets.google.com/feeds/list/1GO0fzdzow6HXWfqUGDokR_k4993hjN_GJp6qgGc2XZ0/omg5gm7/public/values?alt=json',
        dataType: 'jsonp',
        cache: false,
        success: function(data){ // 通信が成功した時
            var sheetsEntry = data.feed.entry; // 実データ部分を取得
            tmp = getsSkill(sheetsEntry); // データを整形
        },
        error: function(){ // 通信が失敗した時
            load_error();
            console.log('loadsSkill error');
        }
    });
}
function getsSkill(sheetsEntry){
	var ss = sskills;
    sheetsEntry.forEach(function(rows){
        var temp = new skilldata(rows);
        ss.push(temp);
    });
    
    load_progress();
}

function loadClass(){
    $.ajax({
        type: 'GET',
        url: 'https://spreadsheets.google.com/feeds/list/1GO0fzdzow6HXWfqUGDokR_k4993hjN_GJp6qgGc2XZ0/ot3jy8k/public/values?alt=json',
        dataType: 'jsonp',
        cache: false,
        success: function(data){ // 通信が成功した時
            var sheetsEntry = data.feed.entry; // 実データ部分を取得
            tmp = getClass(sheetsEntry); // データを整形
        },
        error: function(){ // 通信が失敗した時
            load_error();
            console.log('loadClass error');
        }
    });
}
function getClass(sheetsEntry){
	var cls = classes;
    sheetsEntry.forEach(function(rows){
        var temp = new classdata(rows);
        cls.push(temp);
    });

    setbClass();
    setFilterClass();
    
    load_progress();
}
function setbClass(){
    var que = Enumerable.From(classes)
    .Distinct('$.sid')
    .ToArray();

    var bcls = bclass;
    que.forEach(function(rows){
        var temp = new classdata(null);
        temp.sid = rows.sid;
        bcls[rows.sid] = temp;
    });
}
function setFilterClass(){
    var que = Enumerable.From(classes)
    .Distinct('$.sid')
    .ToArray();

    var mel, ran;
    que.forEach(function(rows){
        if(rows.sid < 200){
            mel += '<tr>';
            mel += '<td>';
            mel += '<label><input type="checkbox" id="cls_mel' + rows.sid + '" class="filclass" value="' + rows.sid + '" group="cls_mel" grouptop="clsmel"/>' + rows.sname + '</label>';
            mel += '</td></tr>';
        } else {
            ran += '<tr>';
            ran += '<td>';
            ran += '<label><input type="checkbox" id="cls_ran' + rows.sid + '" class="filclass" value="' + rows.sid + '" group="cls_ran" grouptop="clsran"/>' + rows.sname + '</label>';
            ran += '</td></tr>';
        }
    });
    
    $('#fil_class_melee').append(mel);
    $('#fil_class_ranged').append(ran);
}

function loadBuff(){
    $.ajax({
        type: 'GET',
        url: 'https://spreadsheets.google.com/feeds/list/1GO0fzdzow6HXWfqUGDokR_k4993hjN_GJp6qgGc2XZ0/ook351m/public/values?alt=json',
        dataType: 'jsonp',
        cache: false,
        success: function(data){ // 通信が成功した時
            var sheetsEntry = data.feed.entry; // 実データ部分を取得
            tmp = getBuff(sheetsEntry); // データを整形
        },
        error: function(){ // 通信が失敗した時
            load_error();
            console.log('loadBuff error');
        }
    });
}
function getBuff(sheetsEntry){
	var b = buffs;
    sheetsEntry.forEach(function(rows){
        var temp = new buffdata(rows);
        b.push(temp);
    });

    setBuff('melee');
    setBuff('ranged');

    //シズカ(侍112,忍者113のATK)のみ調整。エキドナとかもここに入れるべき？
    $('#112atk').change(function(){linkCheckbox('#113atk', $(this).prop('checked'));});
    $('#113atk').change(function(){linkCheckbox('#112atk', $(this).prop('checked'));});

    $('.tooltip').each(tooltip);
    $('.hiddenrow').hide();
    $('.region').hide();
    
    load_progress();
}
function setBuff(type){
    var sid, tbl;
    var tr, trs;

    if(type === 'melee'){
        sid = ' < 200';
        tbl = $('#op_melee');
    }else if(type === 'ranged'){
        sid = ' >= 200';
        tbl = $('#op_ranged');
    }

    var buf = Enumerable.From(buffs)
    .Where('$.sid' + sid)
    .ToArray();

    buf.forEach(function(rows){
        var rsid = rows.sid;
        var rhp = rows.bufhp;
        var ratk = rows.bufatk;
        var rdef = rows.bufdef;
        var rresi = rows.bufresi;

        if ((rhp + ratk + rdef + rresi) === 0) {

        } else {
            tr = '<tr>';
            tr += '<td class="tdbufclas">' + rows.sname + '：</td>';
            if(rhp === 0){
                tr += '<td class="tdbuf" />';
            } else {
                tr += '<td class="tdbuf tooltip" tooltip="' + rows.balhp + '">';
                tr += '<label><input type="checkbox" id="' + rsid + 'hp" value="' + (rhp / 100) + '" />ＨＰ</label>';

                actbuff.push('#' + rsid + 'hp');
            }
            tr += '</td>';

            if(ratk === 0){
                tr += '<td class="tdbuf">';
            } else {
                tr += '<td class="tdbuf tooltip" tooltip="' + rows.balatk + '">';
                tr += '<label><input type="checkbox" id="' + rsid + 'atk" value="' + (ratk / 100) + '" />攻撃</label>';

                actbuff.push('#' + rsid + 'atk');
            }
            tr += '</td>';

            if(rdef === 0){
                tr += '<td class="tdbuf">';
            } else {
                tr += '<td class="tdbuf tooltip" tooltip="' + rows.baldef + '">';
                tr += '<label><input type="checkbox" id="' + rsid + 'def" value="' + (rdef / 100) + '" />防御</label>';

                actbuff.push('#' + rsid + 'def');
            }
            tr += '</td>';

            if(rresi === 0){
                tr += '<td class="tdbuf">';
            } else {
                tr += '<td class="tdbuf tooltip" tooltip="' + rows.balresi + '">';
                tr += '<label><input type="checkbox" id="' + rsid + 'resi" value="' + (rresi / 100) + '" />魔耐</label>';

                actbuff.push('#' + rsid + 'resi');
            }
            tr += '</td>';
            tr += '</tr>';

            trs += tr;
        }
    });

    tbl.append(trs);
}

function loadCC(){
    $.ajax({
        type: 'GET',
        url: 'https://spreadsheets.google.com/feeds/list/1GO0fzdzow6HXWfqUGDokR_k4993hjN_GJp6qgGc2XZ0/ova6i1y/public/values?alt=json',
        dataType: 'jsonp',
        cache: false,
        success: function(data){ // 通信が成功した時
            var sheetsEntry = data.feed.entry; // 実データ部分を取得
            tmp = getCC(sheetsEntry); // データを整形
        },
        error: function(){ // 通信が失敗した時
            load_error();
            console.log('loadBuff error');
        }
    });
	
}
function getCC(sheetsEntry){
	var sc = scc;
	var cs = ccs;
	sheetsEntry.forEach(function(rows){
		var temp = new cc(rows);
		cs.push(temp);

		sc[temp.id] = temp.sname;
	});

	load_progress();
}

function loadRare(){
    $.ajax({
        type: 'GET',
        url: 'https://spreadsheets.google.com/feeds/list/1GO0fzdzow6HXWfqUGDokR_k4993hjN_GJp6qgGc2XZ0/ofp6zpp/public/values?alt=json',
        dataType: 'jsonp',
        cache: false,
        success: function(data){ // 通信が成功した時
            var sheetsEntry = data.feed.entry; // 実データ部分を取得
            tmp = getRare(sheetsEntry); // データを整形
        },
        error: function(){ // 通信が失敗した時
            load_error();
            console.log('loadBuff error');
        }
    });
}
function getRare(sheetsEntry){
	var r = rar;
	var rs = rars;
	sheetsEntry.forEach(function(rows){
		var temp = new rarity(rows);
		rs.push(temp);
		
		r[temp.id] = temp.sname;
	});

	load_progress();
}

function loadUpdate(){
    $.ajax({
        type: 'GET',
        url: 'https://spreadsheets.google.com/feeds/list/1GO0fzdzow6HXWfqUGDokR_k4993hjN_GJp6qgGc2XZ0/ot7d01q/public/values?alt=json',
        dataType: 'jsonp',
        cache: false,
        success: function(data){ // 通信が成功した時
            var sheetsEntry = data.feed.entry; // 実データ部分を取得
            tmp = getUpdate(sheetsEntry); // データを整形
        },
        error: function(){ // 通信が失敗した時
            load_error();
            console.log('loadUpdate error');
        }
    });
}
function getUpdate(sheetsEntry){
	var u = updates;
    sheetsEntry.forEach(function(rows){
        var temp = new update(rows);
        u.push(temp);
    });

    setUpdate();
    load_progress();
}
function setUpdate(){
	var que = Enumerable.From(updates).ToArray();
	
	var str = '';
	que.forEach(function(rows){
		str += '　　　　　　' + rows.ymd;
		str += '　' + rows.summary;
		str += '<br>';
	});

	$('#update').append(str);
}

var prog = 0;
function load_progress(){
    prog += 1;
    
    if(prog === 8){
        setParse();
        setUnits();
        
        $('input.submit').prop('disabled', false);
        $('input.submit').val('計算してみる');

        skills = null;
        sskills = null;
        skilldata = null;
        classes = null;
        classdata = null;
        updates = null;
    }
}

function setUnits(){
    var joinstr = make_bunitsjoin(); //長すぎてメンテしづらいので隔離
    
    var que1 = Enumerable.From(units)
    .Where('$.cc < 3')
    .Join(skills, '$.skill', '$.name', joinstr)
    .Select(function(x){
        return {
            sid:x.sid, id:x.id, uid:x.uid, clas:x.clas, name:x.name,
            rare:x.rare, cc:x.cc, noncc:x.noncc, lv:x.lv, lvmax:x.lvmax,
            hp:x.hp, hpmax:x.hpmax, atk:x.atk, atkmax:x.atkmax,
            def:x.def, defmax:x.defmax, resi:x.resi,
            block:x.block, range:x.range, costmax:x.costmax, costmin:x.costmin,
            bonushp:x.bonushp, bonusatk:x.bonusatk, bonusdef:x.bonusdef,
            bonusresi:x.bonusresi, bonusblock:x.bonusblock, 
            bonusrange:x.bonusrange,
            specialatk:x.specialatk, specialatk2:x.specialatk2, 
            incatksp:x.incatksp,
            quadra:x.quadra, atktype:x.atktype, type:x.type,
            skill:x.skill, dataerr:x.dataerr,
            motion:x.motion, wait:x.wait,
            s_motion:x.s_motion, s_wait:x.s_wait,
            teambuff:x.teambuff,

            s_lvmax:x.s_lvmax,
            s_inchp:x.s_inchp, s_inchpmax:x.s_inchpmax,
            s_incatk:x.s_incatk, s_incatkmax:x.s_incatkmax,
            s_incdef:x.s_incdef, s_incdefmax:x.s_incdefmax, 
            s_incpro:x.s_incpro, s_incpromax:x.s_incpromax,
            s_incresi:x.s_incresi, s_incresimax:x.s_incresimax, 
            s_addresi:x.s_addresi, s_addresimax:x.s_addresimax,
            s_incrange:x.s_incrange, s_incrangemax:x.s_incrangemax, 
            s_incblock:x.s_incblock, s_incblockmax:x.s_incblockmax, 
            s_dmgcut:x.s_dmgcut, s_dmgcutmax:x.s_dmgcutmax, 
            s_dmgcutmat:x.s_dmgcutmat, s_dmgcutmatmax:x.s_dmgcutmatmax, 
            s_dmgcutmag:x.s_dmgcutmag, s_dmgcutmagmax:x.s_dmgcutmagmax, 
            s_enemyatkmax:x.s_enemyatkmax, s_enemyatkmin:x.s_enemyatkmin, 
            s_enemymatmax:x.s_enemymatmax, s_enemymatmin:x.s_enemymatmin, 
            s_enemydefmax:x.s_enemydefmax, s_enemydefmin:x.s_enemydefmin, 
            s_enemyresimax:x.s_enemyresimax, s_enemyresimin:x.s_enemyresimin, 
            s_specialatk:x.s_specialatk, s_incatksp:x.s_incatksp, 
            s_quadra:x.s_quadra, s_atktype:x.s_atktype,
            s_timemin:x.s_timemin, s_timemax:x.s_timemax,
            s_ctmin:x.s_ctmin, s_ctmax:x.s_ctmax
        };
    })
    .ToArray();
    
    var que2 = Enumerable.From(units)
    .Where('$.cc == 3')
    .Join(sskills, '$.skill', '$.name', joinstr)
    .Select(function(x){
        return {
            sid:x.sid, id:x.id, uid:x.uid, clas:x.clas, name:x.name,
            rare:x.rare, cc:x.cc, noncc:x.noncc, lv:x.lv, lvmax:x.lvmax,
            hp:x.hp, hpmax:x.hpmax, atk:x.atk, atkmax:x.atkmax,
            def:x.def, defmax:x.defmax, resi:x.resi,
            block:x.block, range:x.range, costmax:x.costmax, costmin:x.costmin,
            bonushp:x.bonushp, bonusatk:x.bonusatk, bonusdef:x.bonusdef,
            bonusresi:x.bonusresi, bonusblock:x.bonusblock, 
            bonusrange:x.bonusrange,
            specialatk:x.specialatk, specialatk2:x.specialatk2, 
            incatksp:x.incatksp,
            quadra:x.quadra, atktype:x.atktype, type:x.type,
            skill:x.skill, dataerr:x.dataerr,
            motion:x.motion, wait:x.wait,
            s_motion:x.s_motion, s_wait:x.s_wait,
            teambuff:x.teambuff,

            s_lvmax:x.s_lvmax,
            s_inchp:x.s_inchp, s_inchpmax:x.s_inchpmax,
            s_incatk:x.s_incatk, s_incatkmax:x.s_incatkmax,
            s_incdef:x.s_incdef, s_incdefmax:x.s_incdefmax, 
            s_incpro:x.s_incpro, s_incpromax:x.s_incpromax,
            s_incresi:x.s_incresi, s_incresimax:x.s_incresimax, 
            s_addresi:x.s_addresi, s_addresimax:x.s_addresimax,
            s_incrange:x.s_incrange, s_incrangemax:x.s_incrangemax, 
            s_incblock:x.s_incblock, s_incblockmax:x.s_incblockmax, 
            s_dmgcut:x.s_dmgcut, s_dmgcutmax:x.s_dmgcutmax, 
            s_dmgcutmat:x.s_dmgcutmat, s_dmgcutmatmax:x.s_dmgcutmatmax, 
            s_dmgcutmag:x.s_dmgcutmag, s_dmgcutmagmax:x.s_dmgcutmagmax, 
            s_enemyatkmax:x.s_enemyatkmax, s_enemyatkmin:x.s_enemyatkmin, 
            s_enemymatmax:x.s_enemymatmax, s_enemymatmin:x.s_enemymatmin, 
            s_enemydefmax:x.s_enemydefmax, s_enemydefmin:x.s_enemydefmin, 
            s_enemyresimax:x.s_enemyresimax, s_enemyresimin:x.s_enemyresimin, 
            s_specialatk:x.s_specialatk, s_incatksp:x.s_incatksp, 
            s_quadra:x.s_quadra, s_atktype:x.s_atktype,
            s_timemin:x.s_timemin, s_timemax:x.s_timemax,
            s_ctmin:x.s_ctmin, s_ctmax:x.s_ctmax
        };
    })
    .ToArray();
    
    units = Enumerable.From(que1)
    .Union(que2)
    .OrderBy('$.id')
    .ToArray();
}


function setParse(){
	var prs = parse;
	var name = [];
	var cls = [];
	var rare = [];
	var cc = [];
	
	var que;
	que = Enumerable.From(units)
	.Distinct('$.name')
	.Select(function(x){ name[x.name] = x.id; }).ToArray();
	
	que = Enumerable.From(classes)
	.Select(function(x){ cls.push(x.name); }).ToArray();

	que = Enumerable.From(rars)
	.Select(function(x){ rare.push(x.sname); }).ToArray();
	
	que = Enumerable.From(ccs)
	.Select(function(x){ cc.push(x.sname); }).ToArray();
	
	prs.name = name;
	prs.cls = cls;
	prs.rare = rare;
	prs.cc = cc;

	$.tablesorter.addParser({
		id: 'name',
		is: function(s){ return false; },
		format: function(s){ var prs = parse; return prs.name[s]; },
		type: 'numeric'
	});
	$.tablesorter.addParser({
		id: 'cls',
		is: function(s){ return false; },
		format: function(s){ var prs = parse; return $.inArray(s, prs.cls); },
		type: 'numeric'
	});
	$.tablesorter.addParser({
		id: 'rare',
		is: function(s){ return false; },
		format: function(s){ var prs = parse; return $.inArray(s, prs.rare); },
		type: 'numeric'
	});
	$.tablesorter.addParser({
		id: 'cc',
		is: function(s){ return false; },
		format: function(s){ var prs = parse; return $.inArray(s, prs.cc); },
		type: 'numeric'
	});
	
	$('#outputTable').tablesorter({
		headers: {
			0: { sorter: 'name'},
			1: { sorter: 'cls'},
			2: { sorter: 'rare'},
			3: { sorter: 'cc'},
			4: { sorter: 'select'}
		}
	});
}


function linkCheckbox(target,status){
    $(target).prop('checked',status);
}
