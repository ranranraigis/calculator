
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
    loadDefault();

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
    Default :otidvve
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
    .Select('{sid:$.sid, sname:$.sname}')
    .ToArray();

    var mel, ran;
    que.forEach(function(rows){
        if(rows.sid < 200){
            mel += '<tr>'
	             + '<td>'
	             + '<label><input type="checkbox" id="cls_mel' + rows.sid + '" class="filclass" value="' + rows.sid + '" group="cls_mel" grouptop="clsmel"/>' + rows.sname + '</label>'
	             + '</td></tr>';
        } else {
            ran += '<tr>'
                 + '<td>'
                 + '<label><input type="checkbox" id="cls_ran' + rows.sid + '" class="filclass" value="' + rows.sid + '" group="cls_ran" grouptop="clsran"/>' + rows.sname + '</label>'
                 + '</td></tr>';
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

    //エキドナ(竜：sid=109,110,111,126,206のHP,DEF)
    /*
    $('#op_ekidona').attr('class', 'link').attr('link', 'ekidona');
    $('#109hp').attr('class', 'link').attr('link', 'ekidona');
    $('#110hp').attr('class', 'link').attr('link', 'ekidona');
    $('#111hp').attr('class', 'link').attr('link', 'ekidona');
    $('#126hp').attr('class', 'link').attr('link', 'ekidona');
    $('#206hp').attr('class', 'link').attr('link', 'ekidona');
    $('#109def').attr('class', 'link').attr('link', 'ekidona');
    $('#110def').attr('class', 'link').attr('link', 'ekidona');
    $('#111def').attr('class', 'link').attr('link', 'ekidona');
    $('#126def').attr('class', 'link').attr('link', 'ekidona');
    $('#206def').attr('class', 'link').attr('link', 'ekidona');
    */
    
    //エステルも入れたいけどシャーリーと被ってるので無しで
    
    //カティナ(ボウライダー127のATKとスキル時間)
    $('#127atk').attr('class', 'link').attr('link', 'catina');
    $('#127time').attr('class', 'link').attr('link', 'catina');
    
    //シズカ(侍112,忍者113のATK)
    $('#112atk').attr('class', 'link').attr('link', 'sizuka');
    $('#113atk').attr('class', 'link').attr('link', 'sizuka');

    //シャーリー(メイジ202のスキル時間、【ビショップ209のATK】、サモナー212のコスト)
    //増分7%なので一応保持
    $('#op_shirley').attr('class', 'link').attr('link', 'shirley');
    $('#202time').attr('class', 'link').attr('link', 'shirley');
    $('#209atk').attr('class', 'link').attr('link', 'shirley');
    
    //ピピン(風水213のATKとスキル時間)
    $('#213atk').attr('class', 'link').attr('link', 'pipin');
    $('#213time').attr('class', 'link').attr('link', 'pipin');
    
    
    //ルビナス(竜：sid=109,110,111,126,206のATK)
    /*
    $('#op_lubinus').attr('class', 'link').attr('link', 'lubinus');
    $('#109atk').attr('class', 'link').attr('link', 'lubinus');
    $('#110atk').attr('class', 'link').attr('link', 'lubinus');
    $('#111atk').attr('class', 'link').attr('link', 'lubinus');
    $('#126atk').attr('class', 'link').attr('link', 'lubinus');
    $('#206atk').attr('class', 'link').attr('link', 'lubinus');
    */
    
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
        var rtime = rows.buftime;

        if ((rhp + ratk + rdef + rresi + rtime) === 0) {

        } else {
            tr = '<tr>';
            tr += '<td class="tdbufclas">' + rows.sname + '：</td>';
            if(rhp === 0){
                tr += '<td class="tdbuf" />';
            } else {
                tr += '<td class="tdbuf tooltip" tooltip="' + rows.balhp + '">'
                    + '<label><input type="checkbox" id="' + rsid + 'hp" value="' + (rhp / 100) + '" />ＨＰ</label>';

                actbuff.push('#' + rsid + 'hp');
            }
            tr += '</td>';

            if(ratk === 0){
                tr += '<td class="tdbuf">';
            } else {
                tr += '<td class="tdbuf tooltip" tooltip="' + rows.balatk + '">'
                    + '<label><input type="checkbox" id="' + rsid + 'atk" value="' + (ratk / 100) + '" />攻撃</label>';

                actbuff.push('#' + rsid + 'atk');
            }
            tr += '</td>';

            if(rdef === 0){
                tr += '<td class="tdbuf">';
            } else {
                tr += '<td class="tdbuf tooltip" tooltip="' + rows.baldef + '">'
                    + '<label><input type="checkbox" id="' + rsid + 'def" value="' + (rdef / 100) + '" />防御</label>';

                actbuff.push('#' + rsid + 'def');
            }
            tr += '</td>';

            if(rresi === 0){
                tr += '<td class="tdbuf">';
            } else {
                tr += '<td class="tdbuf tooltip" tooltip="' + rows.balresi + '">'
                    + '<label><input type="checkbox" id="' + rsid + 'resi" value="' + (rresi / 100) + '" />魔耐</label>';

                actbuff.push('#' + rsid + 'resi');
            }

            if(rtime === 0){
                tr += '<td class="tdbuf">';
            } else {
                tr += '<td class="tdbuf tooltip" tooltip="' + rows.baltime + '">'
                    + '<label><input type="checkbox" id="' + rsid + 'time" value="' + (rtime / 100) + '" />S時間</label>';

                actbuff.push('#' + rsid + 'time');
            }
            
            tr += '</td>'
                + '</tr>';

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
            console.log('loadCC error');
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
            console.log('loadRare error');
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
	    if(rows.ymd.match(/region/)){
	        str += '　　　　 ' + rows.ymd + rows.summary;
	    } else {
	        str += '　　　　　　' + rows.ymd
	             + '　' + rows.summary
	             + '<br>';
	    }
	});

	$('#update').append(str);
}

function loadDefault(){
    $.ajax({
        type: 'GET',
        url: 'https://spreadsheets.google.com/feeds/list/1GO0fzdzow6HXWfqUGDokR_k4993hjN_GJp6qgGc2XZ0/otidvve/public/values?alt=json',
        dataType: 'jsonp',
        cache: false,
        success: function(data){ // 通信が成功した時
            var sheetsEntry = data.feed.entry; // 実データ部分を取得
            tmp = getDefault(sheetsEntry); // データを整形
        },
        error: function(){ // 通信が失敗した時
            load_error();
            console.log('loadRare error');
        }
    });
}
function getDefault(sheetsEntry){
    var dv = defval;
    sheetsEntry.forEach(function(rows){
        var temp = new defaultvalue(rows);
        dv.push(temp);
    });

    load_progress();
}

var prog = 0;
function load_progress(){
    prog += 1;
    
    if(prog === 9){
        setParse();
        setUnits();
        setReadme();
        setPageDefault();
        
        var param = location.search.substring(1);
        if(param){
            $('#buff_all').prop('checked', false);
            $('#buff_all').trigger('change');
            dataLoad(param);
        }
        
        $('input.submit').prop('disabled', false);
        $('input.submit').val('計算してみる');

        skills = null;
        sskills = null;
        skilldata = null;
        classdata = null;
        updates = null;
        defval = null;

        $('.tooltip').each(tooltip);
        $('.hiddenrow').hide();
        $('.region').hide();
    }
}

function setUnits(){
    var joinstr = make_bunitsjoin(); //長すぎてメンテしづらいので隔離
    
    var que1 = Enumerable.From(units)
    .Where('$.cc < 3')
    .Join(skills, '$.skill', '$.name', joinstr)
    .Select(function(x){
        return {
            sort:x.sort
            ,sid:x.sid, id:x.id, uid:x.uid, clas:x.clas, name:x.name
            ,rare:x.rare, cc:x.cc, noncc:x.noncc, event:x.event
            ,lv:x.lv, lvmax:x.lvmax
            ,hp:x.hp, hpmax:x.hpmax, atk:x.atk, atkmax:x.atkmax
            ,def:x.def, defmax:x.defmax, resi:x.resi
            ,block:x.block, range:x.range, costmax:x.costmax, costmin:x.costmin
            ,bonushp:x.bonushp, bonusatk:x.bonusatk, bonusdef:x.bonusdef
            ,bonusresi:x.bonusresi, bonusblock:x.bonusblock
            ,bonusrange:x.bonusrange
            ,specialatk:x.specialatk, specialatk2:x.specialatk2
            ,incatksp:x.incatksp
            ,quadra:x.quadra, atktype:x.atktype, type:x.type
            ,skill:x.skill, dataerr:x.dataerr
            ,motion:x.motion, wait:x.wait
            ,s_motion:x.s_motion, s_wait:x.s_wait
            ,teambuff:x.teambuff

            ,s_lvmax:x.s_lvmax
            ,s_inchp:x.s_inchp, s_inchpmax:x.s_inchpmax
            ,s_incatk:x.s_incatk, s_incatkmax:x.s_incatkmax
            ,s_incdef:x.s_incdef, s_incdefmax:x.s_incdefmax
            ,s_incpro:x.s_incpro, s_incpromax:x.s_incpromax
            ,s_incresi:x.s_incresi, s_incresimax:x.s_incresimax
            ,s_addresi:x.s_addresi, s_addresimax:x.s_addresimax
            ,s_incrange:x.s_incrange, s_incrangemax:x.s_incrangemax
            ,s_incblock:x.s_incblock, s_incblockmax:x.s_incblockmax
            ,s_dmgcut:x.s_dmgcut, s_dmgcutmax:x.s_dmgcutmax
            ,s_dmgcutmat:x.s_dmgcutmat, s_dmgcutmatmax:x.s_dmgcutmatmax
            ,s_dmgcutmag:x.s_dmgcutmag, s_dmgcutmagmax:x.s_dmgcutmagmax
            ,s_enemyatkmax:x.s_enemyatkmax, s_enemyatkmin:x.s_enemyatkmin
            ,s_enemymatmax:x.s_enemymatmax, s_enemymatmin:x.s_enemymatmin
            ,s_enemydefmax:x.s_enemydefmax, s_enemydefmin:x.s_enemydefmin
            ,s_enemyresimax:x.s_enemyresimax, s_enemyresimin:x.s_enemyresimin
            ,s_specialatk:x.s_specialatk, s_incatksp:x.s_incatksp
            ,s_quadra:x.s_quadra, s_atktype:x.s_atktype
            ,s_timemin:x.s_timemin, s_timemax:x.s_timemax
            ,s_ctmin:x.s_ctmin, s_ctmax:x.s_ctmax
            ,s_motioncancel:x.s_motioncancel
        };
    })
    .ToArray();
    
    var que2 = Enumerable.From(units)
    .Where('$.cc == 3')
    .Join(sskills, '$.skill', '$.name', joinstr)
    .Select(function(x){
        return {
            sort:x.sort
            ,sid:x.sid, id:x.id, uid:x.uid, clas:x.clas, name:x.name
            ,rare:x.rare, cc:x.cc, noncc:x.noncc, event:x.event
            ,lv:x.lv, lvmax:x.lvmax
            ,hp:x.hp, hpmax:x.hpmax, atk:x.atk, atkmax:x.atkmax
            ,def:x.def, defmax:x.defmax, resi:x.resi
            ,block:x.block, range:x.range, costmax:x.costmax, costmin:x.costmin
            ,bonushp:x.bonushp, bonusatk:x.bonusatk, bonusdef:x.bonusdef
            ,bonusresi:x.bonusresi, bonusblock:x.bonusblock
            ,bonusrange:x.bonusrange
            ,specialatk:x.specialatk, specialatk2:x.specialatk2
            ,incatksp:x.incatksp
            ,quadra:x.quadra, atktype:x.atktype, type:x.type
            ,skill:x.skill, dataerr:x.dataerr
            ,motion:x.motion, wait:x.wait
            ,s_motion:x.s_motion, s_wait:x.s_wait
            ,teambuff:x.teambuff

            ,s_lvmax:x.s_lvmax
            ,s_inchp:x.s_inchp, s_inchpmax:x.s_inchpmax
            ,s_incatk:x.s_incatk, s_incatkmax:x.s_incatkmax
            ,s_incdef:x.s_incdef, s_incdefmax:x.s_incdefmax
            ,s_incpro:x.s_incpro, s_incpromax:x.s_incpromax
            ,s_incresi:x.s_incresi, s_incresimax:x.s_incresimax
            ,s_addresi:x.s_addresi, s_addresimax:x.s_addresimax
            ,s_incrange:x.s_incrange, s_incrangemax:x.s_incrangemax
            ,s_incblock:x.s_incblock, s_incblockmax:x.s_incblockmax
            ,s_dmgcut:x.s_dmgcut, s_dmgcutmax:x.s_dmgcutmax
            ,s_dmgcutmat:x.s_dmgcutmat, s_dmgcutmatmax:x.s_dmgcutmatmax
            ,s_dmgcutmag:x.s_dmgcutmag, s_dmgcutmagmax:x.s_dmgcutmagmax
            ,s_enemyatkmax:x.s_enemyatkmax, s_enemyatkmin:x.s_enemyatkmin
            ,s_enemymatmax:x.s_enemymatmax, s_enemymatmin:x.s_enemymatmin
            ,s_enemydefmax:x.s_enemydefmax, s_enemydefmin:x.s_enemydefmin
            ,s_enemyresimax:x.s_enemyresimax, s_enemyresimin:x.s_enemyresimin
            ,s_specialatk:x.s_specialatk, s_incatksp:x.s_incatksp
            ,s_quadra:x.s_quadra, s_atktype:x.s_atktype
            ,s_timemin:x.s_timemin, s_timemax:x.s_timemax
            ,s_ctmin:x.s_ctmin, s_ctmax:x.s_ctmax
            ,s_motioncancel:x.s_motioncancel
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
	.Select(function(x){ name[x.name] = x.sort; }).ToArray();
	
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

function setReadme(){
    var str0 = '', str1 = '';
    var que = Enumerable.From(skills)
    .Where('$.name != ""')
    .Select(function(x){
        if(x.motioncancel === 0){
            str0 += '<tr><td>' + x.name + '</td></tr>';
        } else {
            str1 += '<tr><td>' + x.name + '</td></tr>';
        }
    })
    .ToArray();

    str0 += '<tr><td>－－スキル覚醒－－</td></tr>';
    str1 += '<tr><td>－－スキル覚醒－－</td></tr>';
    var que_s = Enumerable.From(sskills)
    .Select(function(x){
        if(x.motioncancel === 0){
            str0 += '<tr><td>' + x.name + '</td></tr>';
        } else {
            str1 += '<tr><td>' + x.name + '</td></tr>';
        }
    })
    .ToArray();


    $('#tbl_mot0').append(str0);
    $('#tbl_mot1').append(str1);
}

function setPageDefault(){
    var dv = Enumerable.From(defval)
    .ToArray();
    
    //攻撃
    $('#atksp').prop('selectedIndex', dv[0].sp);
    $('#atkHP').val(dv[0].req);
    $('#atkDef').val(dv[0].def);
    $('#atkResi').val(dv[0].resi);
    $('input[name="atkMode"]:eq(' + dv[0].type + ')').prop('checked', true);
    $('#atkCnt').val(dv[0].cnt);
    
    //防御
    $('#defAtk').val(dv[1].req);
    $('#defType').prop('selectedIndex', dv[1].matmag);
    $('#defCnt').val(dv[1].cnt);
    
    //リハビリ
    
    //耐+DPS
    $('#mixsp').prop('selectedIndex', dv[2].sp);
    $('#mixAtk').val(dv[2].req);
    $('#mixType').prop('selectedIndex', dv[2].matmag);
    $('#mixDef').val(dv[2].def);
    $('#mixResi').val(dv[2].resi);
    $('#mixCnt').val(dv[2].cnt);
    $('input[name="mixLv"]:eq(' + dv[2].type + ')').prop('checked', true);
       
}

function linkCheckbox(){
	var t = $(this);
	var link = t.attr('link');

	$('input[type="checkbox"][link="' + link + '"]').prop('checked', t.prop('checked'));
}
