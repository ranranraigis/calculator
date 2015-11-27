function submit_Click(){
    console.clear();
    clearbefore();
    chkData();
    
    var useSkill = $('#use_skill').prop('checked');
    var que, que1;
    
    var whr_class = makeQuery_Class();
    var whr_cc = makeQuery_CC();
    var whr_atktype = makeQuery_atkType(useSkill);
    var whr_melran = makeQuery_MelRan();
    var whr_rare = makeQuery_Rare();
    var whr_event = makeQuery_Event();

    fil_units = Enumerable.From(units)
        .Where(whr_class)
        .Where(whr_cc)
        .Where(whr_atktype)
        .Where(whr_melran)
        .Where(whr_rare)
        .Where(whr_event)
        .ToArray();    

    if(!useSkill){
        fil_units = Enumerable.From(fil_units)
        .Where('$.cc < 3')
        .ToArray();
    }
        
    make_bunits();
    
    bunits = Enumerable.From(bunits)
    .Where('$.reqlv <= $.lvmax')
    .ToArray();

    if(gl_mode === 'atk' || gl_mode === 'def' || gl_mode === 'mix'){
        que = Enumerable.From(bunits)
        .ToArray();
    } else if(gl_mode === 'reha'){
        que1 = Enumerable.From(bunits)
        .Where('$.cc == 2')
        .ToArray();
        
        que = Enumerable.From(bunits)
        .Join(que1, '$.sid + "_" + $.uid', '$.sid + "_" + $.uid')
        .Where('$.cc <= 2')
        .Distinct('$.sid + "_" + $.cc + "_" + $.uid')
        .ToArray();
    }
    
    que = Enumerable.From(que)
    .OrderBy('$.sid')
    .ThenBy('$.rare')
    .ThenBy('$.uid')
    .ThenBy('$.cc')
    .ToArray();
    
    if((gl_enemy.mode === 'dps' && gl_mode === 'atk') || gl_mode === 'mix'){
        que = Enumerable.From(que)
            .OrderByDescending('$.dps')
            .ToArray();
    }

    var take = toNum($('#take_cnt').val());
    if(take !== 0){ que = Enumerable.From(que).Take(take).ToArray(); }
    
    bunits = que;
    
    setQue(bunits, useSkill);
    setLv(bunits);

    gl_enemy.calcend = true;
    
    $('#outputTable').trigger('update');
}

function makeQuery_CC(){
    var checked = $('input[id^="cc_"][type="checkbox"]:checked');
    var len = checked.length;
    var cc = '';
    
    if(len >= 1){
        cc += '$.cc == ' + checked[0].value;

        for(var i=1; i < len; i++){
            cc += ' || $.cc == ' + checked[i].value;
        }
    }
    return cc;    
}
function makeQuery_Rare(){
    var checked = $('input[id^="rare_"][type="checkbox"]:checked');
    var len = checked.length;
    var rare = '';

    if(len >= 1){
        rare += '$.rare == ' + checked[0].value;

        for(var i=1; i < len; i++){
            rare += ' || $.rare == ' + checked[i].value;
        }
    }
    return rare;
}
function makeQuery_atkType(useSkill){
    var atktype = '';
    var all = $('#typeall').prop('checked');
    var mat = $('#atktype_mat').prop('checked');
    var mag = $('#atktype_mag').prop('checked');
    var heal = $('#atktype_heal').prop('checked');
    var neet = $('#atktype_neet').prop('checked');

    if(mat){
        if(useSkill){ atktype = '$.s_atktype == 1 || ($.atktype == 1 && $.s_atktype == 0)';}
        else { atktype = '$.atktype == 1'; }
    }

    if(mag){
        if(atktype.length > 0){ atktype += ' || '; }
        if(useSkill){ atktype += '$.s_atktype == 2 || ($.atktype == 2 && $.s_atktype == 0)'; }
        else { atktype += '$.atktype == 2'; }
    }

    if(heal){
        if(atktype.length > 0){ atktype += ' || '; }
        if(useSkill){ atktype += '$.s_atktype == 3 || ($.atktype == 3 && $.s_atktype == 0)'; }
        else { atktype += '$.atktype == 3'; }
    }
    
    if(neet){
        if(atktype.length > 0){ atktype += ' || '; }
        if(useSkill){ atktype += '$.s_atktype == 4 || ($.atktype == 4 && $.s_atktype == 0)'; }
        else { atktype += '$.atktype == 4'; }
    }
    
    return atktype;
}
function makeQuery_MelRan(){
    var melran = '';
    var melee = $('#atkmelee').prop('checked');
    var ranged = $('#atkranged').prop('checked');
    
    switch(true){
        case (!melee && ranged):
            melran = '$.sid >= 200';
            break;
        case (melee && !ranged):
            melran = '$.sid < 200';
            break;
    }
    return melran;
}
function makeQuery_Class(){
    var checked = $('input[id^="cls_"][type="checkbox"]:checked');
    var len = checked.length;
    var cls = '';
    
    if(len >= 1){
        cls += '$.sid == ' + checked[0].value;
        
        for(var i = 1; i < len; i++){
            cls += ' || $.sid == ' + checked[i].value;
        }
    }
    return cls;
}
function makeQuery_Event(){
    var eve = '';
    if(!$('#eventunit').prop('checked')){
        if($('#eveuni_normal').prop('checked')){
            eve += '$.event == 0';
        }
        if($('#eveuni_event').prop('checked')){
            if(eve.length > 0){ eve += ' || '; }
            eve += '($.event == 1 || $.event == 3)';
        }
        if($('#eveuni_gacha').prop('checked')){
            if(eve.length > 0){ eve += ' || '; }
            eve += '($.event == 2 || $.event == 3)';
        }
    }
    return eve;
}

function clearbefore(){
    bUnits = null;
    clearbClass();
    rowclear();
    $('#outputTable').trigger('update');
    $('#outputTable').trigger('sortReset');
}

function clearbClass(){
    var bcls = bclass;
    bcls.forEach(function(rows){
        rows.bufhp = 0;
        rows.bufatk = 0;
        rows.bufdef = 0;
        rows.bufresi = 0;
        rows.buftime = 0;
    });
}

function rowclear(){
    $('#outputTable').find('tr:gt(0)').remove();
}

function chkData(){
    var enemy = gl_enemy;
    
    //モード
    gl_mode = $('#chkMode').val();
    
    enemy.calcend = false;
    
    //計算用値
    if(gl_mode !== 'mix'){
        enemy.hp = toNum($('#atkHP').val());
        enemy.atk = toNum($('#defAtk').val());
        enemy.def = toNum($('#atkDef').val());
        enemy.resi = toNum($('#atkResi').val());
        enemy.type = toNum($('#defType').val());
        enemy.sp = toNum($('#atksp').val());
        enemy.mix = 0;
        enemy.mode = $('input[type="radio"][name="atkMode"]:checked').val();
        enemy.time = toNum($('#atkTime').val());
        enemy.timemode = $('input[name="timeMode"]:checked').val();
        
        if(gl_mode === 'atk'){
            enemy.cnt = toNum($('#atkCnt').val());
        } else if(gl_mode === 'def'){
            enemy.cnt = toNum($('#defCnt').val());
        }
        
        enemy.reha = $('#rehaMode option:selected').val();
    } else {
        enemy.atk = toNum($('#mixAtk').val());
        enemy.def = toNum($('#mixDef').val());
        enemy.resi = toNum($('#mixResi').val());
        enemy.type = toNum($('#mixType').val());
        enemy.sp = toNum($('#mixsp').val());
        enemy.mix = toNum($('input[type="radio"][name="mixLv"]:checked').val());
        enemy.mode = '';
        enemy.time = '';
        enemy.timemode = '';
        enemy.cnt = toNum($('#mixCnt').val());
    }

    //編成バフ
    chkBuff_team_Base();    //HP、攻撃、防御
    chkBuff_team_Ex();      //特殊強化
    chkBuff_team_Melee();   //近接
    chkBuff_team_Class();   //職別

    //スキルバフ
    chkBuff_skill_Increase();
    chkBuff_skill_EnemyDecrease();
    
    //その他バフ類
    chkBuff_other();
    
    //整理
    chkBuff_arrange();
}

function incBuffHp(sid, val){ var bcls = bclass; bcls[sid].bufhp += val; }
function incBuffAtk(sid, val){ var bcls = bclass; bcls[sid].bufatk += val; }
function incBuffDef(sid, val){ var bcls = bclass; bcls[sid].bufdef += val; }
function incBuffResi(sid, val){ var bcls = bclass; bcls[sid].bufresi += val; }
function incBuffTime(sid, val){ var bcls = bclass; bcls[sid].buftime += val; }

function chkBuff_team_Base(){
    var oBuf = otherBuff;
    var bcls = bclass;
    var hp, atk, def;
    
    //HP
    oBuf.hp1 = $('#op_hp1').prop('checked');
    oBuf.hp2 = $('#op_hp2').prop('checked');
    oBuf.hp3 = $('#op_hp3').prop('checked');
    hp = oBuf.hp1 * $('#op_hp1').val()
       + oBuf.hp2 * $('#op_hp2').val()
       + oBuf.hp3 * $('#op_hp3').val();

    //攻撃
    oBuf.atk1 = $('#op_atk1').prop('checked');
    oBuf.atk2 = $('#op_atk2').prop('checked');
    oBuf.atk3 = $('#op_atk3').prop('checked');
    atk = oBuf.atk1 * $('#op_atk1').val()
        + oBuf.atk2 * $('#op_atk2').val()
        + oBuf.atk3 * $('#op_atk3').val();

    //防御
    oBuf.def1 = $('#op_def1').prop('checked');
    oBuf.def2 = $('#op_def2').prop('checked');
    oBuf.def3 = $('#op_def3').prop('checked');
    //ルイーズ、全体コスト+2
    oBuf.louise = $('#op_louise').prop('checked');
    def = oBuf.def1 * $('#op_def1').val()
        + oBuf.def2 * $('#op_def2').val()
        + oBuf.def3 * $('#op_def3').val()
        + oBuf.louise * $('#op_louise').val();

    var bcls = bclass;
    bcls.forEach(function(rows){
        rows.bufhp += hp;
        rows.bufatk += atk;
        rows.bufdef += def;
    });
}

function chkBuff_team_Ex(){
    var oBuf = otherBuff;
    var incbuf = {};
    incbuf['hp'] = incBuffHp;
    incbuf['atk'] = incBuffAtk;
    incbuf['def'] = incBuffDef;
    incbuf['resi'] = incBuffResi;
    
    //後衛軍師
    oBuf.ctcut = toNum($('input[name="op_ctcut"][type="radio"]:checked').val());
    
    //アンナ(未実装、ダンサーバフの方へ移動)
    //sid=100
    //oBuf.anna = $('#op_anna_old').prop('checked');
    
    //エキドナ(竜、ドラゴンライダーのHPと防御5%)
    //sid=109,110,111,126,206 or type=1
    //実質職バフ
    oBuf.ekidona = $('#op_ekidona').prop('checked');
    if(oBuf.ekidona){
        incbuf['hp'](109, 0.05); incbuf['def'](109, 0.05);
        incbuf['hp'](110, 0.05); incbuf['def'](110, 0.05);
        incbuf['hp'](111, 0.05); incbuf['def'](111, 0.05);
        incbuf['hp'](126, 0.05); incbuf['def'](126, 0.05);
        incbuf['hp'](206, 0.05); incbuf['def'](206, 0.05);
    }
    
    //エステル(魔法剣士、メイジアーマー、メイジ、ビショップの攻撃力+5%)
    //sid=119,125,202,209
    oBuf.ester = $('#op_ester').prop('checked');
    if(oBuf.ester){
        incbuf['atk'](119, 0.05);
        incbuf['atk'](125, 0.05);
        incbuf['atk'](202, 0.05);
        incbuf['atk'](209, 0.05);
    }
    
    //オリヴィエ(エルフ(ハーフ,ダーク込)、ドワーフのHP15%、コスト-1)
    //type=2,3
    //やりようがないためbUnitsを作るところで再確認
    oBuf.olivie = $('#op_olivie').prop('checked');
    
    //シェリー(金以下のHP、攻撃、防御5%)
    //rare<=4
    //やりようがないためbUnitsを作るところで再確認;
    oBuf.sherry = $('#op_sherry').prop('checked');

    //シャーリー(メイジのスキル時間+30%、ビショップの攻撃+7%、サモナーのコスト-4)
    //メイジ202、ビショップ209、サモナー212
    //メイジ、ビショップは職バフで対応
    oBuf.shirley = $('#op_shirley').prop('checked');
    
    //ヒカゲ(カグヤの攻撃、防御10%)
    //id=105171,105271
    //やりようがないためbUnitsを作るところで再確認
    oBuf.hikage = $('#op_hikage').prop('checked');

    //リーゼロッテ(ソル101、アーマー102の防御+5%、魔耐+5)
    oBuf.liselotte = $('#op_liselotte').prop('checked');
    if(oBuf.liselotte){
        incbuf['def'](101, 0.05); incbuf['resi'](101, 5);
        incbuf['def'](102, 0.05); incbuf['resi'](102, 5);
    }
    
    //ルイーズ、全体コスト+2
    //編成バフでpropは取得済
    //if(oBuf.louise)
    
    //ルビナス(竜、ドラゴンライダーの攻撃7%)
    //実質職バフ
    //sid=109,110,111,126,206 or type=1
    oBuf.lubinus = $('#op_lubinus').prop('checked');
    if(oBuf.lubinus){
        incbuf['atk'](109, 0.07);
        incbuf['atk'](110, 0.07);
        incbuf['atk'](111, 0.07);
        incbuf['atk'](126, 0.07);
        incbuf['atk'](206, 0.07);
    }
}

function chkBuff_team_Melee(){
    var oBuf = otherBuff;
    var hp = 0;
    var atk = 0;
    var def = 0;
    var resi = 0;

    //カグラ(近接の攻撃5%)
    oBuf.kagura = $('#op_kagura').prop('checked'); 
    if(oBuf.kagura){ atk += 0.05; }

    //マツリ(近接のHP,攻撃,防御5%)
    oBuf.matsuri = $('#op_matsuri').prop('checked');
    if(oBuf.matsuri){
        hp += 0.05;
        atk += 0.05;
        def += 0.05;
    }

    //グレース(近接の魔耐+10)
    oBuf.grace = $('#op_grace').prop('checked'); 
    if(oBuf.grace){ resi += 10; }

    var que = Enumerable.From(classes)
    .Distinct('$.sid')
    .Where('$.sid < 200')
    .Select('$.sid')
    .ToArray();
    
    var bcls = bclass;
    que.forEach(function(sid){
        bcls[sid].bufhp += hp;
        bcls[sid].bufatk += atk;
        bcls[sid].bufdef += def;
        bcls[sid].bufresi += resi;
    });
}

function chkBuff_team_Class(){    
    var sid = "";
    var pat = /hp$|atk$|def$|resi$|time$/;
    var typ = "";
    var incbuf = {};
    var val = "";

    incbuf['hp'] = incBuffHp;
    incbuf['atk'] = incBuffAtk;
    incbuf['def'] = incBuffDef;
    incbuf['resi'] = incBuffResi;
    incbuf['time'] = incBuffTime;

    var act = actbuff;
    act.forEach(function(id){
        sid = toNum(id.substr(1,3));
        typ = id.match(pat);
        val = $(id).prop('checked') * $(id).val();

        incbuf[typ](sid,val);
        act[sid + typ] = $(id).prop('checked');
    });
}

function chkBuff_skill_Increase(){
    var oBuf = otherBuff;
    var prince = toNum($('input[name="op_prince"][type="radio"]:checked').val());

    //神器王子(多分スキルバフ扱いだからここ)
    var prince_s = $('input[name="op_prince"]:checked').index('input[name="op_prince"]');
    prince_s = (prince_s === 6)? 1.2: 1;
    
    var inchp = 1;
    var incatk = toNum($('#incatk').html());
    var incdef = toNum($('#incdef').html());
    var incpro = toNum($('#incpro').html());
    var incresi = 1;
    var addresi = 0;

    var dmgcutmat = 1;
    var dmgcutmag = toNum($('#dmgcut_mag').html());

    //ロゼットとメメントはon/offで1とスキル値が行き来するため if val():1をしないでいい
    var incrosette = toNum($('#inc_rosette').val());
    oBuf.rosette = $('#inc_rosette').prop('checked');
    
    var incmemento = toNum($('#inc_memento').val());
    oBuf.memento = $('#inc_memento').prop('checked');

    var sBuf = skillbuffs;
    sBuf.prince = prince;
    sBuf.prince_s = prince_s; 
    sBuf.inchp = inchp;
    sBuf.incatk = incatk;
    sBuf.incdef = incdef;
    sBuf.incpro = incpro;
    sBuf.incresi = incresi;
    sBuf.addresi = addresi;
    sBuf.dmgcutmat = dmgcutmat;
    sBuf.dmgcutmag = dmgcutmag;
    sBuf.incrosette = incrosette;
    sBuf.incmemento = incmemento;
}

function chkBuff_skill_EnemyDecrease(){
    var emydebatk = toNum($('#emy_debatk').html());
    var emydebmat = toNum($('#emy_debmat').html());
    var emydebdef = toNum($('#emy_debdef').html());
    var emydebresi = toNum($('#emy_debresi').html());

    var sBuf = skillbuffs;
    sBuf.emydebatk = emydebatk;
    sBuf.emydebmat = emydebmat;
    sBuf.emydebdef = emydebdef;
    sBuf.emydebresi = emydebresi;
}

function chkBuff_other(){
    var oBuf = otherBuff;

    //チェックon/offで表現できるものとかダンサー等のカテゴリ分けしにくいもの
    oBuf.bonus = toNum($('input[name="bonus"]:checked').val()); 
    oBuf.enchant = $('#op_enchant').prop('checked');
    oBuf.danceatk = $('#op_dance').prop('checked') * $('#dance_atk').val();
    oBuf.dancedef = $('#op_dance').prop('checked') * $('#dance_def').val();
    oBuf.annaatk = $('#op_anna').prop('checked') * $('#anna_atk').val();
    oBuf.annadef = $('#op_anna').prop('checked') * $('#anna_def').val();
    oBuf.areaatk = $('#op_areaAtk').prop('checked')? $('#areaAtk').val() / 100: 1;
    oBuf.areadef = $('#op_areaDef').prop('checked')? $('#areaDef').val() / 100: 1;
    
    oBuf.mahoken = toNum($('input[name="op_mahoken"][type="radio"]:checked').val());
    
    oBuf.ekidona_s = $('#op_ekidona_s').prop('checked');
    oBuf.ekidona_sv = (oBuf.ekidona_s)? 1.3: 1;
    oBuf.lubinus_s = $('#op_lubinus_s').prop('checked');
    oBuf.lubinus_sv = (oBuf.lubinus_s)? 1.3: 1;
    
    //ダンサーの整理
    var dancetype = $('input[name="op_dance_type"][type="radio"]:checked').val();
    if(dancetype !== 'add100'){
        if(dancetype === 'add10'){
            oBuf.danceatk = Math.floor(oBuf.danceatk / 10);
            oBuf.dancedef = Math.floor(oBuf.dancedef / 10);
        } else {
            var sBuf = skillbuffs;
            var bcls = bclass;
            var atk = oBuf.danceatk;
            var def = oBuf.dancedef;
            var pripro = Math.max(sBuf.prince, sBuf.incpro);
            atk = Math.floor(atk * (1 + bcls[215].bufatk));
            atk = Math.floor(atk * sBuf.prince * sBuf.incatk * sBuf.prince_s);
            atk = Math.floor(atk * oBuf.areaatk);
            def = Math.floor(def * (1 + bcls[215].bufdef));
            def = Math.floor(def * pripro * sBuf.incdef * sBuf.prince_s);
            def = Math.floor(def * oBuf.areadef);
            if(dancetype === 'calc10'){
                oBuf.danceatk = Math.floor(atk / 10);
                oBuf.dancedef = Math.floor(def / 10);
            } else {
                oBuf.danceatk = atk;
                oBuf.dancedef = def;
            }
        }
    }
    //アンナの整理
    var annatype = $('input[name="op_anna_type"][type="radio"]:checked').val();
    if(annatype !== 'add100'){
        if(annatype === 'add10'){
            oBuf.annaatk = Math.floor(oBuf.annaatk / 10);
            oBuf.annadef = Math.floor(oBuf.annadef / 10);
        } else {
            var sBuf = skillbuffs;
            var bcls = bclass;
            var atk = oBuf.annaatk;
            var def = oBuf.annadef;
            var pripro = Math.max(sBuf.prince, sBuf.incpro);
            atk = Math.floor(atk * (1 + bcls[216].bufatk));
            atk = Math.floor(atk * sBuf.prince * sBuf.incatk * sBuf.prince_s);
            atk = Math.floor(atk * oBuf.areaatk);
            atk += oBuf.danceatk;
            def = Math.floor(def * (1 + bcls[216].bufdef));
            def = Math.floor(def * pripro * sBuf.incdef * sBuf.prince_s);
            def = Math.floor(def * oBuf.areadef);
            def += oBuf.dancedef;
            if(annatype === 'calc10'){
                oBuf.annaatk = Math.floor(atk / 10);
                oBuf.annadef = Math.floor(def / 10);
            } else {
                oBuf.annaatk = atk;
                oBuf.annadef = def;
            }
        }
    }
}

function chkBuff_arrange(){
    var bcls = bclass; 
    
    //トークン連中は編成バフの影響を受けない
    bcls[199].bufhp = 0;    bcls[299].bufhp = 0;
    bcls[199].bufatk = 0;   bcls[299].bufatk = 0;
    bcls[199].bufdef = 0;   bcls[299].bufdef = 0;
    bcls[199].bufresi = 0;  bcls[299].bufresi = 0;
    bcls[199].buftime = 0;  bcls[299].buftime = 0;
}

function make_bunits(){
    //グローバル変数の参照(速度向上)
    var mode = gl_mode;
    var enemy = gl_enemy;
    var oBuf = otherBuff;

    var useSkill = $('#use_skill').prop('checked');
    
    //要求レベル算出用
    var reqHp, reqAtk, reqDef, reqLv, dps;
    
    //各行毎の補正値等
    var row = []; 
    var skill = []; //スキルバフ(自)

    var row_hp, row_atk, row_def, row_resi;
    var row_defAtk;
    var divhp, divatk, divdef;
    var motion, wait;
    var temp, temphp, tempdef;
    
    var debmat, debmag;
    var dmglimit, dmgmax;

    var bunit = bunits;
    bunit = Enumerable.From(fil_units)
    .Select(function(x){
        setRowBuffs(x, row, skill, useSkill, x.s_lvmax);
        
        divhp = (x.hpmax - x.hp) / (x.lvmax - 1);
        divatk = (x.atkmax - x.atk) / (x.lvmax - 1);
        divdef = (x.defmax - x.def) / (x.lvmax - 1);
        
        //耐久(耐DPSのために耐久のくくりを先に)
        if(mode === 'def' || mode === 'mix'){
            if(enemy.type === 1){
                //物理
                
                //プロテクションと王子の比較
                var pripro = Math.max(row.prince, row.incpro, skill.incpro);
                
                //自身の最大耐久の算出
                row_hp = Math.floor((x.hpmax + row.bonushp) * row.bufhp);
                row_hp = Math.floor(row_hp * row.inchp * skill.inchp);

                row_def = Math.floor((x.defmax + row.bonusdef) * row.bufdef);
                row_def = Math.floor(row_def * pripro * row.incdef * skill.incdef * row.prince_s);
                tempdef = row_def * 2;
                row_def = Math.floor(row_def * oBuf.areadef);
                row_def += oBuf.dancedef;
                
                //王子(アンナ)の計算
                if(x.sid === 100){ row_def += oBuf.annadef; }

                //聖霊の護りと暗黒オーラは重複しない
                debmat = Math.min(row.debatk, skill.debatk, row.debmat, skill.debmat);
                row_defAtk = Math.ceil(enemy.atk * debmat);
                
                //被ダメ(下限)
                dmglimit = Math.ceil(Math.floor(row_defAtk / 10) * row.cutmat * skill.cutmat);
                //被ダメ(通常)
                dmgmax = Math.ceil((row_defAtk - row_def) * row.cutmat * skill.cutmat);
                //被ダメの決定
                dmgmax = (dmgmax <= dmglimit)? dmglimit : dmgmax;

                if(row_hp <= dmgmax * enemy.cnt){
                    //耐え切れない場合は除外する
                    reqLv = 999;
                } else {
                    reqLv = x.lvmax;
                }
                
                if(x.sid === 115 && x.cc >= 2){
                    //パラディン
                    temp = Math.floor(row_hp / 2);
                    temphp = row_hp - dmgmax;
                    tempdef = Math.floor(tempdef * oBuf.areadef);
                    tempdef += oBuf.dancedef;

                    var i = enemy.cnt;
                    while(i > 0){
                        if(temphp <= temp){
                            dmgmax = Math.ceil((row_defAtk - tempdef) * row.cutmat * skill.cutmat);
                            dmgmax = (dmgmax <= dmglimit)? dmglimit : dmgmax;
                            
                            temphp -= dmgmax;
                        } else {
                            dmgmax = Math.ceil((row_defAtk - row_def) * row.cutmat * skill.cutmat);
                            dmgmax = (dmgmax <= dmglimit)? dmglimit : dmgmax;
                            
                            temphp -= dmgmax;
                        }
                        i -= 1;
                    }
                    if(temphp > 0){
                        reqLv = x.lvmax;
                    }
                }
                
                if(reqLv === x.lvmax){
                    //二分探索っぽいもので最低レベルを探す
                    var i = Math.ceil(x.lvmax / 2);
                    var imax = x.lvmax;
                    var imin = x.lv;

                    var cnt = 0;
                    var result = 0;

                    while(imin < imax && cnt < 20){
                        //最高ラインと最低ラインの中間値を取得(切捨て)
                        i = Math.floor((imax + imin) / 2);

                        //このレベルでの耐久力を算出
                        row_hp = x.hp + row.bonushp + Math.floor(divhp * (i - 1));
                        row_hp = Math.floor(row_hp * row.bufhp);
                        row_hp = Math.floor(row_hp * row.inchp * skill.inchp);
                        row_def = x.def + row.bonusdef + Math.floor(divdef * (i - 1));
                        row_def = Math.floor(row_def * row.bufdef);
                        row_def = Math.floor(row_def * pripro * row.incdef * skill.incdef * row.prince_s);
                        tempdef = row_def * 1.5;
                        row_def = Math.floor(row_def * oBuf.areadef);
                        row_def += oBuf.dancedef;
                        //王子(アンナ)の計算
                        if(x.sid === 100){ row_def += oBuf.annadef; }
                        
                        //被ダメ(通常)の計算と被ダメ決定
                        dmgmax = Math.ceil((row_defAtk - row_def) * row.cutmat * skill.cutmat);
                        dmgmax = (dmgmax <= dmglimit)? dmglimit : dmgmax;

                        //耐久チェック
                        if(x.sid === 115 && x.cc >= 2){
                            //パラディン
                            temp = Math.floor(row_hp / 2);
                            temphp = row_hp - dmgmax;
                            tempdef = Math.floor(row_def * oBuf.areadef);
                            tempdef += oBuf.dancedef;
                            
                            var j = enemy.cnt;
                            while(j > 0){
                                j -= 1;
                                if(temphp <= temp){
                                    dmgmax = Math.ceil((row_defAtk - tempdef) * row.cutmat * skill.cutmat);
                                    dmgmax = (dmgmax <= dmglimit)? dmglimit : dmgmax;
                                    
                                    temphp -= dmgmax * j;
                                    j -= j;
                                } else {
                                    dmgmax = Math.ceil((row_defAtk - row_def) * row.cutmat * skill.cutmat);
                                    dmgmax = (dmgmax <= dmglimit)? dmglimit : dmgmax;
                                    
                                    temphp -= dmgmax;
                                }
                            }
                            result = temphp;
                        } else {
                            result = row_hp - dmgmax * enemy.cnt;
                        }

                        //負なら最低ラインに+1、正なら最高ラインに設定
                        if(result <= 0)
                        { imin = i + 1; }
                        else { imax = i; }

                        //無限ループ回避用
                        cnt += 1;
                    }

                    if(cnt >= 20){
                        console.log('何かがおかしいっぽいので抜けました');
                    }

                    reqLv = imax;
                }
            } else if(enemy.type === 2){
                //魔法
                //自身の魔耐の算出
                row_resi = x.resi + row.bonusresi;
                row_resi = row_resi + row.addresi + skill.addresi;
                row_resi = Math.floor(row_resi * row.incresi * skill.incresi);
                row_resi = 1 - (row_resi / 100);
                
                //暗黒と○○(未実装)は重複しない
                debmag = Math.min(row.debatk, skill.debatk, row.debmag, skill.debmag);
                row_defAtk = Math.ceil(enemy.atk * debmag);
                
                //被ダメ(下限)
                dmglimit = Math.ceil(Math.ceil(row_defAtk / 10) * row.cutmag * skill.cutmag);
                //被ダメ(通常)
                dmgmax = Math.ceil(Math.ceil(row_defAtk * row_resi) * row.cutmag * skill.cutmag);
                //被ダメの決定(魔法にそもそも下限ダメがあるのか不明)
                dmgmax = (dmgmax <= dmglimit)? dmglimit : dmgmax;
                
                reqHp = dmgmax * enemy.cnt;

                reqLv = Math.ceil(reqHp / (row.inchp * skill.inchp));
                reqLv = Math.ceil(reqLv / row.bufhp) - (x.hp + row.bonushp);
                reqLv = Math.ceil(reqLv / divhp) + 1;

                if(reqLv <= 0){ reqLv = x.lv; }
                if(reqLv <= x.lvmax){
                    //ちょうど0になるパターンが存在するので調整
                    temp = x.hp + row.bonushp + Math.floor(divhp * (reqLv - 1));
                    temp = Math.floor(temp * row.bufhp);
                    temp = Math.floor(temp * row.inchp * skill.inchp);

                    if(reqHp === temp){ reqLv += 1; }
                }
            }
        } 
        
        //攻撃
        if(mode === 'atk' || (mode === 'mix' && reqLv <= x.lvmax)){
            if(enemy.mode === 'cnt' && mode !== 'mix'){
                reqAtk = Math.ceil(enemy.hp / enemy.cnt);
                if(row.atktype === 1){
                    //物理
                    reqAtk = reqAtk + Math.ceil(enemy.def * row.debdef * skill.debdef);
                } else if(row.atktype === 2){
                    //魔法
                    reqAtk = Math.ceil(reqAtk / (1 - Math.ceil(enemy.resi * row.debresi * skill.debresi) / 100));
                }
                //ダンサー＋特攻周りをちゃんと計算
                if(row.incatksp > 1){
                    reqLv = Math.ceil(reqAtk / oBuf.areaatk);
                    reqLv = reqLv / row.incatksp;
                    reqLv -= oBuf.danceatk;
                    reqLv = Math.ceil(reqLv / (row.prince * row.incatk * skill.incatk * row.prince_s));
                    reqLv = Math.ceil(Math.ceil(reqLv / row.bufatk) / row.quadra);
                    reqLv = Math.ceil(reqLv - (x.atk + row.bonusatk));
                    reqLv = Math.ceil(reqLv / divatk) + 1;
                } else {
                    //王子(アンナ)の計算
                    if(x.sid === 100){ row_atk -= oBuf.annaatk; }
                    reqAtk -= oBuf.danceatk;
                    
                    reqLv = Math.ceil(reqAtk / oBuf.areaatk);
                    reqLv = Math.ceil(reqLv / (row.prince * row.incatk * skill.incatk * row.incatksp * row.prince_s));
                    reqLv = Math.ceil(Math.ceil(reqLv / row.bufatk) / row.quadra);
                    reqLv = Math.ceil(reqLv - (x.atk + row.bonusatk));
                    reqLv = Math.ceil(reqLv / divatk) + 1;
                }
                
                //トークン(トラップ)専用
                if(x.name.match(/トラップ/)){
                    reqAtk = Math.ceil(enemy.hp / enemy.cnt);
                    reqAtk -= oBuf.danceatk;
                    
                    reqLv = Math.ceil(reqAtk / oBuf.areaatk);
                    reqLv = Math.ceil(reqLv / (row.prince * row.incatk * row.incatksp * row.prince_s));
                    reqLv = Math.ceil(reqLv - x.atk);
                    reqLv = Math.ceil(reqLv / divatk) + 1;
                }

                if(reqLv <= 0){ reqLv = x.lv; }

                if((x.lvmax < reqLv) && (row.atktype === 1)){
                    //餅つき計算
                    reqAtk = Math.ceil(enemy.hp / enemy.cnt) * 10;

                    if(row.incatksp > 1){
                        reqLv = reqAtk / row.incatksp;
                        //王子(アンナ)の計算
                        if(x.sid === 100){ reqLv -= oBuf.annaatk; }
                        reqLv -= oBuf.danceatk;
                        reqLv = Math.ceil(reqAtk / (row.prince * row.incatk * skill.incatk * row.prince_s));
                        reqLv = Math.ceil(Math.ceil(reqLv / row.bufatk) / row.quadra);
                        reqLv = Math.ceil(reqLv - (x.atk + row.bonusatk));
                        reqLv = Math.ceil(reqLv / divatk) + 1;
                    } else {
                        reqAtk -= oBuf.danceatk;
                        reqLv = Math.ceil(reqAtk / (row.prince * row.incatk * skill.incatk * row.incatksp * row.prince_s));
                        reqLv = Math.ceil(Math.ceil(reqLv / row.bufatk) / row.quadra);
                        reqLv = Math.ceil(reqLv - (x.atk + row.bonusatk));
                        reqLv = Math.ceil(reqLv / divatk) + 1;
                    }
                    if(x.name.match(/トラップ/)){ reqLv = x.lvmax + 1; }
                }
            } else if(enemy.mode === 'dps' || enemy.mode === 'time' || mode === 'mix'){
                //DPS計算
                if(mode !== 'mix' || enemy.mix !== 0){ reqLv = x.lvmax; }
                
                if(useSkill){ 
                    motion = x.s_motion;
                    wait = x.s_wait;
                } else {
                    motion = x.motion;
                    wait = x.wait;
                }

                if(reqLv === x.lvmax){ row_atk = x.atkmax + row.bonusatk; }
                else { row_atk = Math.floor((x.atk + row.bonusatk) + (x.atkmax - x.atk) / (x.lvmax - 1) * (reqLv - 1)); }
                row_atk = Math.floor(row_atk * row.bufatk);
                if(row.incatksp > 1){
                    row_atk = row_atk * row.prince * row.incatk * skill.incatk * row.prince_s;
                    row_atk += oBuf.danceatk;
                    row_atk = Math.floor(row_atk * row.incatksp);
                    row_atk = Math.floor(row_atk * oBuf.areaatk);
                } else {
                    row_atk = Math.floor(row_atk * row.prince * row.incatk * skill.incatk * row.incatksp * row.prince_s);
                    row_atk = Math.floor(row_atk * oBuf.areaatk);
                    row_atk += oBuf.danceatk;
                }
                //王子(アンナ)の計算
                if(x.sid === 100){ row_atk += oBuf.annaatk; }
                
                if(row.atktype === 1){
                    var row_def = Math.ceil(enemy.def * row.debdef * skill.debdef);
                    var dmglimit = Math.floor(row_atk / 10);

                    if(dmglimit >= (row_atk - row_def)){
                        row_atk = Math.floor(row_atk / 10);
                    } else {
                        row_atk = row_atk - row_def;
                    }

                } else if(row.atktype === 2){
                    row_resi = 1 - Math.ceil(enemy.resi * row.debresi * skill.debresi) / 100;
                    row_atk = Math.floor(row_atk * row_resi);
                    if(row_atk === 0){ row_atk = 1; }
                }

                dps = row_atk * row.quadra * 30 / (motion + wait);
                
                if(x.name.match(/トラップ/)){

                    if(reqLv === x.lvmax){ row_atk = x.atkmax; }
                    else { row_atk = Math.floor((x.atk) + (x.atkmax - x.atk) / (x.lvmax - 1) * (reqLv - 1)); }
                    
                    row_atk = row_atk * row.prince * row.incatk * row.prince_s;
                    row_atk += oBuf.danceatk;
                    row_atk = Math.floor(row_atk * oBuf.areaatk);
                    dps = row_atk * 30 / (motion + wait);
                }
                
                if(mode === 'atk' && enemy.mode === 'time'){
                    data = dmgcalc(x, row, skill, x.lvmax, (useSkill)? x.s_lvmax: 0);
                    reqLv = data.reqlv;
                }
            }
        }
        
        //リハビリ
        if(mode === 'reha'){
            var cc = x.cc, noncc = x.noncc;
            var que;
            if(cc === 2){
                if(noncc === 0){
                    que = Enumerable.From(units)
                    .Where('$.sid == ' + x.sid + ' && $.uid == ' + x.uid + ' && $.cc == 1')
                    .ToArray();
                } else {
                    que = Enumerable.From(units)
                    .Where('$.sid == ' + x.sid + ' && $.uid == ' + x.uid + ' && $.cc == 0')
                    .ToArray();
                }
                
                if(que.length > 0){
                    var temp = 0;
                    reqLv = 0;
                    if(enemy.reha === 'all' || enemy.reha === 'hp'){
                        temp = Math.ceil((que[0].hpmax - x.hp) / divhp) + 1;
                        if(temp > reqLv){ reqLv = temp; }
                    }
                    if(enemy.reha === 'all' || enemy.reha === 'atk'){
                        temp = Math.ceil((que[0].atkmax - x.atk) / divatk) + 1;
                        if(temp > reqLv){ reqLv = temp; }
                    }
                    if(enemy.reha === 'all' || enemy.reha === 'def'){
                        temp = Math.ceil((que[0].defmax - x.def) / divdef) + 1;
                        if(temp > reqLv){ reqLv = temp; }
                    }
                    if(reqLv >= x.lvmax){ reqLv = x.lvmax; }
                } else {
                    reqLv = 999;
                }
            } else {
                reqLv = x.lvmax;
            }
            if(cc === 0 && noncc === 0){ reqLv = 999; }
        }

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
               ,reqlv:reqLv, dps:dps
           };
    })
    .ToArray();
    
    bunits = bunit;
}

function dmgcalc(unit, row, skill, lv, slv){
    var enemy = gl_enemy;
    var oBuf = otherBuff;
    var sBuf = skillbuffs;
    var useSkill = (slv > 0);

    var incatksp, s_incatksp;
    
    //特攻の整理
    incatksp = $.inArray(enemy.sp, [unit.specialatk, unit.specialatk2]);
    if(incatksp !== -1){ incatksp = unit.incatksp; }
    else {incatksp = 1; }
    s_incatksp = (enemy.sp === unit.s_specialatk)? unit.s_incatksp: 1;
    if(incatksp > 1 && s_incatksp === 1){ s_incatksp = incatksp; }

    var pat = '猛将の鼓舞|烈火の陣|猛火の陣' +
              '|レヴァンテイン' + 
              '|ダモクレスの剣' +
              "|鋭牙の火炎";
    pat = new RegExp(pat);
    var mat = unit.skill.match(pat);
    if(mat){
        switch(mat[0]){
            case '猛将の鼓舞':
            case '烈火の陣':
            case '猛火の陣':
                //通常の計算とは違い、自身の方が弱ければ上書きする
                //※スキルlv次第で適用値が変わるため
                if(sBuf.incatk >= skill.incatk){ skill.incatk = 1; }
                break;
            case 'レヴァンテイン':
                if(sBuf.debresi >= skill.debresi){ skill.debresi = 1; }
                break;
            case 'ダモクレスの剣':
                if(sBuf.incrosette >= skill.incatk){ skill.incatk = 1; skill.incdef = 1; }
                break;
            case '鋭牙の火炎':
                if(oBuf.lubinus_s){ skill.incatk = 1; }
                break;
        }
    }
    
    var n_atk, s_atk;
    var n_dmg, s_dmg, dmg;
    var row_def, row_resi;
    
    if(lv === unit.lvmax){
        n_atk = unit.atkmax + row.bonusatk;
    } else {
        n_atk = unit.atk + row.bonusatk;
        n_atk = n_atk + Math.floor((unit.atkmax - unit.atk) / (unit.lvmax - 1) * (lv - 1));
    }
    n_atk = Math.floor(n_atk * row.bufatk);
    s_atk = Math.floor(n_atk * row.prince * sBuf.incatk * skill.incatk * s_incatksp * sBuf.prince_s);
    s_atk = Math.floor(s_atk * oBuf.areaatk);
    s_atk += oBuf.danceatk;
    
    n_atk = Math.floor(n_atk * row.prince * sBuf.incatk * incatksp * sBuf.prince_s);
    n_atk = Math.floor(n_atk * oBuf.areaatk);
    n_atk += oBuf.danceatk;
    //王子(アンナ)の計算
    if(unit.sid === 100){
        s_atk += oBuf.annaatk;
        n_atk += oBuf.annaatk;
    }

    if(unit.atktype === 1 && !oBuf.enchant){
        row_def = Math.ceil(enemy.def * sBuf.emydebdef);
        dmg = n_atk - row_def;
        if(dmg < Math.floor(n_atk/10)){ n_dmg = Math.floor(n_atk/10); }
        else { n_dmg = dmg; }
    } else if(unit.atktype === 2 || oBuf.enchant){
        row_resi = 1 - Math.ceil(enemy.resi * sBuf.emydebresi) / 100;
        n_dmg = Math.floor(n_atk * row_resi);
    } else if(unit.atktype >= 3){
        n_dmg = 0;
    }
    n_dmg *= unit.quadra;
    
    if(unit.s_atktype === 1 || ((unit.atktype === 1 && unit.s_atktype === 0) && !oBuf.enchant)){
        row_def = Math.ceil(enemy.def * sBuf.emydebdef * skill.debdef);
        dmg = s_atk - row_def;
        if(dmg < Math.floor(s_atk/10)){ s_dmg = Math.floor(s_atk/10); }
        else { s_dmg = dmg; }
    } else if(unit.s_atktype === 2 || (unit.atktype === 2 && unit.s_atktype === 0) || oBuf.enchant){
        row_resi = 1 - (enemy.resi * sBuf.emydebresi * skill.debresi) / 100;
        s_dmg = Math.floor(s_atk * row_resi);
    } else if(unit.s_atktype >= 3){
        s_dmg = 0;
    }
    
    if(unit.s_quadra !== 0){ s_dmg *= unit.s_quadra; }
    else { s_dmg *= unit.quadra; }

    if(unit.name.match(/トラップ/)){
        n_dmg = n_atk;
        s_dmg = s_atk;
    }
    
    var data = {
        reqhp:enemy.hp, reqlv: unit.lvmax
        ,dmg:0, n_dmg:n_dmg, s_dmg:s_dmg
        ,time:0, reqtime:enemy.time * 30, remtime:enemy.time * 30
        ,s_time:skill.time * 30, ct:skill.ct * 30
        ,motion:unit.motion, wait:unit.wait
        ,s_motion:unit.s_motion, s_wait:unit.s_wait
        ,s_atk:s_atk,n_atk:n_atk
        ,next:'', nextact:'', over_frm: 0
        ,motioncancel: useSkill * unit.s_motioncancel
    };
    
    var reqtime = (data.reqtime > 0);
    var shortcut = unit.s_motioncancel;
    var sccnt = 0;
    if(reqtime){
        if(useSkill){
            while(data.remtime >= data.s_motion){
                dmgcalc_skill(data, reqtime);
                if(data.remtime >= data.motion){
                    dmgcalc_noskill(data, useSkill, reqtime);
                }

                if(shortcut){
                    shortcut = false;
                    sccnt = Math.floor((data.remtime - data.time) / data.time);
                    if(sccnt > 1){
                        data.time *= sccnt;
                        data.remtime -= data.time;
                        data.dmg *= sccnt;
                    }
                }
            }
        } else {
            while(data.remtime >= data.motion){
                dmgcalc_noskill(data, useSkill, reqtime);
            }
        }
        if(data.time > data.reqtime && enemy.timemode === 'timeatk'){
            //data.dmg = 0;
        }
    } else {
        if(enemy.timemode === 'timeatk'){
            if(useSkill){
                while(data.dmg < data.reqhp){
                    dmgcalc_skill(data, reqtime);
                    if(data.dmg < data.reqhp){
                        dmgcalc_noskill(data, useSkill, reqtime);
                    }
                    if(shortcut){
                        shortcut = false;
                        sccnt = Math.floor((data.reqhp - data.dmg) / data.dmg);
                        if(sccnt > 1){
                            data.time *= sccnt;
                            data.dmg *= sccnt;
                        }
                    }
                }
            } else {
                while(data.dmg < data.reqhp){
                    dmgcalc_noskill(data, useSkill, reqtime);
                }
            }
        } else {
            data.reqlv = 999;
        }
    }
    
    if(enemy.timemode === 'timeatk'){
        if(data.dmg >= data.reqhp && data.time <= data.reqtime){
            data.reqlv = unit.lvmax;
        } else {
            data.reqlv = 999;
        }
    }

    data.time = rounds(data.time / 30, 2);
    return data;
}

function dmgcalc_skill(data, timeatk){
    var enemy = gl_enemy;
    var time = 0;
    var frm = data.s_motion + data.s_wait;
    var sub = {};

    if(timeatk){
        //時間制限あり
        if(data.remtime > data.s_time){
            time = data.s_time;
        } else {
            time = data.remtime;
        }
    } else {
        //時間制限なし
        time = data.s_time;
    }

    sub.time = time;
    sub.dmg = data.s_dmg;
    sub.motion = data.s_motion;
    sub.wait = data.s_wait;
    sub.frm = frm;
    data.next = 'normal';
    dmgcalc_common(sub, data);
    
    data.dmg += sub.dmg;
    data.time += sub.time;
    if(data.dmg >= data.reqhp && enemy.timemode === 'timeatk'){
        data.remtime = 0;
    } else {
        data.remtime -= time;
    }
}

function dmgcalc_noskill(data, useSkill, timeatk){
    var enemy = gl_enemy;
    var dmg = 0;
    var cnt = 0;
    var time = 0;
    var frm = data.motion + data.wait;
    var sub = {};
    sub.dmg = data.n_dmg;
    sub.motion = data.motion;
    sub.wait = data.wait;
    sub.frm = frm;
    
    if(timeatk){
        //時間制限あり
        if(!useSkill || data.ct >= 99999){
            //スキル未使用もしくは使い切り
            if(!enemy.calcend){
                //本計算
                if(enemy.timemode === 'timeatk'){
                    cnt = Math.ceil((data.reqhp - data.dmg) / data.n_dmg);
                    dmg = cnt * data.n_dmg;
                    time = (cnt - 1) * frm + data.motion;
                } else {
                    sub.time = data.remtime;
                    dmgcalc_common(sub, data);
                    time = sub.time;
                    dmg = sub.dmg;
                }
            } else {
                //出力後のスキルon/offでここに来た場合
                cnt = Math.floor(data.remtime / sub.frm);
                time = data.remtime - cnt * sub.frm;
                if(time >= data.motion){
                    cnt += 1;
                    time -= data.motion;
                }
                time = data.remtime - time;
                dmg = cnt * data.n_dmg;
            }
            data.dmg += dmg;
            data.time += time;
            data.remtime = 0;
        } else {
            //CTがある
            if(useSkill && (data.remtime > data.ct)){
                time = data.ct;
            } else {
                time = data.remtime;
            }
            
            sub.time = time;
            data.next = 'skill';
            dmgcalc_common(sub, data);
            
            data.dmg += sub.dmg;
            data.time += sub.time;
        }
    } else {
        //時間制限なし
        if(!useSkill || data.ct >= 99999){
            //スキル未使用もしくは使い切り
            cnt = Math.ceil((data.reqhp - data.dmg) / data.n_dmg);
            time = (cnt - 1) * frm + data.motion;
            
            data.dmg += cnt * data.n_dmg;
            data.time += time;
        } else {
            //CTがある
            sub.time = data.ct;
            data.next = 'skill';
            dmgcalc_common(sub, data);
            
            data.dmg += sub.dmg;
            data.time += sub.time;
        }
    }

    if(data.dmg >= data.reqhp && enemy.timemode === 'timeatk'){
        data.remtime = 0;
    } else {
        data.remtime -= time;
    }
}

function dmgcalc_common(sub, data){
    var enemy = gl_enemy;
    var time = sub.time;
    var cnt = 0, addcnt = 0;
    var dmg = 0;
    var prev_over = data.over_frm;
    
    if(data.nextact.match(/motion/)){
        //スキル<->通常の切り替えタイミングが攻撃モーションだった場合
        addcnt += 1;
        time -= sub.wait;
    }
    //超過時間処理
    time -= data.over_frm;
    sub.time = time;

    cnt += Math.floor(time / sub.frm);
    time -= (cnt * sub.frm);
    if(time >= sub.motion){
        //追加で1回攻撃できる
        cnt += 1;
        time -= sub.motion;
        data.nextact = 'wait';
        
        if(data.next === 'skill'){
            //次の動作がスキル
            data.over_frm = data.s_wait - Math.ceil(time / data.wait * data.s_wait);
        } else {
            //次の動作が通常
            data.over_frm = data.wait - Math.ceil(time / data.s_wait * data.wait);
        }
    } else {
        //追加で1回攻撃できない
        data.nextact = 'motion';

        if(data.next === 'skill'){
            //次の動作がスキル
            data.over_frm = data.s_motion - Math.ceil(time / data.motion * data.s_motion);
            if(data.over_frm === data.s_motion){ data.nextact = ''; data.over_frm = 0; }
        } else {
            //次の動作が通常
            data.over_frm = data.motion - Math.ceil(time / data.s_motion * data.motion);
            if(data.over_frm === data.motion){ data.nextact = ''; data.over_frm = 0; }
        }
    }

    if(data.motioncancel === 1){
        //モーションキャンセル持ち
        //モーションキャンセルするため次の動作設定、超過分をぶった切る
        data.nextact = '';
        data.over_frm = 0;
    }
    
    time = sub.time + data.over_frm;
    if(addcnt > 0){
        time += sub.wait;
    }
    
    dmg = (cnt + addcnt) * sub.dmg;
    if(dmg > (data.reqhp - data.dmg) && enemy.timemode === 'timeatk'){
        //オーバーキルしていた場合、n+1の形になるよう計算しなおす
        cnt = Math.ceil((data.reqhp - data.dmg) / sub.dmg) - addcnt;
        time = (cnt - 1) * sub.frm + sub.motion;
        if(addcnt > 0){
            //time += 13
            time += sub.wait;
        }   
        dmg = (cnt + addcnt) * sub.dmg;
    }
    
    if(enemy.timemode === 'totaldmg'){
        if(((data.time + time + data.motion) >= data.reqtime) || 
           ((data.time + time + data.s_motion) >= data.reqtime)){
            time = (cnt - 1) * sub.frm;
            if(sub.time - time >= sub.motion){
                time += sub.motion;
            }
            if(addcnt > 0){
                time += sub.wait;
            }
        }
    }

    sub.time = time;
    sub.dmg = dmg;
}

function make_bunitsjoin(){
    var str;
    str = '{'
    //unit
        + 'sort:$.sort'
        + ', sid:$.sid, id:$.id, uid:$.uid'
        + ', clas:$.clas, name:$.name, rare:$.rare, cc:$.cc, noncc:$.noncc'
        + ', event:$.event'
        + ', lv:$.lv, lvmax:$.lvmax'
        + ', hp:$.hp, hpmax:$.hpmax, bonushp:$.bonushp'
        + ', atk:$.atk, atkmax:$.atkmax, bonusatk:$.bonusatk'
        + ', def:$.def, defmax:$.defmax, bonusdef:$.bonusdef'
        + ', resi:$.resi, bonusresi:$.bonusresi'
        + ', block:$.block, bonusblock:$.bonusblock'
        + ', range:$.range, bonusrange:$.bonusrange'
        + ', costmax:$.costmax, costmin:$.costmin'
        + ', quadra:$.quadra'
        + ', specialatk:$.specialatk, specialatk2:$.specialatk2'
        + ', incatksp:$.incatksp'
        + ', skill:$.skill, atktype:$.atktype, type:$.type, dataerr:$.dataerr'
        + ', motion:$.motion, wait:$.wait'
        + ', s_motion:$.s_motion, s_wait:$.s_wait'
        + ', teambuff:$.teambuff'
    //skill
        + ', s_lvmax:$$.lvmax'
        + ', s_inchp:$$.inchp, s_inchpmax:$$.inchpmax'
        + ', s_incatk:$$.incatk, s_incatkmax:$$.incatkmax'
        + ', s_incdef:$$.incdef, s_incdefmax:$$.incdefmax'
        + ', s_incpro:$$.incpro, s_incpromax:$$.incpromax'
        + ', s_incresi:$$.incresi, s_incresimax:$$.incresimax'
        + ', s_addresi:$$.addresi, s_addresimax:$$.addresimax'
        + ', s_incrange:$$.incrange, s_incrangemax:$$.incrangemax'
        + ', s_incblock:$$.incblock, s_incblockmax:$$.incblockmax'
        + ', s_dmgcut:$$.dmgcut, s_dmgcutmax:$$.dmgcutmax'
        + ', s_dmgcutmat:$$.dmgcutmat, s_dmgcutmatmax:$$.dmgcutmatmax'
        + ', s_dmgcutmag:$$.dmgcutmag, s_dmgcutmagmax:$$.dmgcutmagmax'
        + ', s_enemyatkmax:$$.enemyatkmax, s_enemyatkmin:$$.enemyatkmin'
        + ', s_enemymatmax:$$.enemymatmax, s_enemymatmin:$$.enemymatmin'
        + ', s_enemydefmax:$$.enemydefmax, s_enemydefmin:$$.enemydefmin'
        + ', s_enemyresimax:$$.enemyresimax, s_enemyresimin:$$.enemyresimin'
        + ', s_quadra:$$.quadra'
        + ', s_specialatk:$$.specialatk, s_incatksp:$$.incatksp'
        + ', s_atktype:$$.atktype'
        + ', s_timemin:$$.timemin, s_timemax:$$.timemax'
        + ', s_ctmin:$$.ctmin, s_ctmax:$$.ctmax'
        + ', s_motioncancel:$$.motioncancel'
    
        + ' }';
    return str;
}


function setRowBuffs(unit, row, skill, useSkill, slv){
    //グローバル変数の参照(速度向上)
    var enemy = gl_enemy;
    var sBuf = skillbuffs;
    var oBuf = otherBuff;
    var act = actbuff;
    var bcls = bclass;
    var mat;
    
    //各行毎の補正値等
    row.prince = sBuf.prince;
    row.prince_s = sBuf.prince_s;
    row.inchp = sBuf.inchp;
    row.incatk = sBuf.incatk;
    row.incdef = sBuf.incdef;
    row.incpro = sBuf.incpro;
    row.incresi = sBuf.incresi;
    row.addresi = sBuf.addresi;
    row.cutmat = sBuf.dmgcutmat;
    row.cutmag = sBuf.dmgcutmag;
    row.debatk = sBuf.emydebatk;
    row.debmat = sBuf.emydebmat;
    row.debmag = 1;
    row.debdef = sBuf.emydebdef;
    row.debresi = sBuf.emydebresi;
    row.incrosette = sBuf.incrosette;
    
    row.quadra = 1;
    row.bufhp = 1;
    row.bufatk = 1;
    row.bufdef = 1;
    row.bufresi = 0;
    row.buftime = 1;
    row.incatksp = 1;
    row.atktype = 1;
    row.motion = unit.motion;
    row.wait = unit.wait;
    
    skill.inchp = 1;
    skill.incatk = 1;
    skill.incdef = 1;
    skill.incpro = 1;
    skill.incresi = 1;
    skill.addresi = 0;
    skill.dmgcut = 1;
    skill.cutmat = 1;
    skill.cutmag = 1;
    skill.debatk = 1;
    skill.debmat = 1;
    skill.debmag = 1;
    skill.debdef = 1;
    skill.debresi = 1;
    skill.quadra = 0;
    skill.spatk = 0;
    skill.incatksp = 1;
    skill.atktype = 0;
    skill.time = 0;
    skill.ct = 99999;

    if(useSkill){
        //スキル分類ごとに分けるため、正規表現でパターン化
        var pat = "猛将の鼓舞|烈火の陣|猛火の陣" +
                "|鉄壁の陣|金城の陣" +
                "|プロテクション|聖女の結界" +
                "|聖なるオーラ|聖霊の護り" +
                "|マジックバリア" +
                "|暗黒オーラ" +
                "|レヴァンテイン" +
                "|ダモクレスの剣" +
                "|堅鱗の癒し" +
                "|鋭牙の火炎";
        pat = new RegExp(pat);
        
        //スキルの内容を取得
        if(slv === unit.s_lvmax || unit.s_lvmax === 1){
            skill.inchp = unit.s_inchpmax;
            skill.incatk = unit.s_incatkmax;
            skill.incdef = unit.s_incdefmax;
            skill.incpro = unit.s_incpromax;
            skill.incresi = unit.s_incresimax;
            skill.addresi = unit.s_addresimax;
            skill.dmgcut = unit.s_dmgcutmax;
            skill.cutmat = unit.s_dmgcutmatmax;
            skill.cutmag = unit.s_dmgcutmagmax;
            skill.debatk = unit.s_enemyatkmin;
            skill.debmat = unit.s_enemymatmin;
            skill.debdef = unit.s_enemydefmin;
            skill.debresi = unit.s_enemyresimin;
            skill.time = unit.s_timemax;
            skill.ct = unit.s_ctmin;
        } else {
            skill.inchp = unit.s_inchp + (unit.s_inchpmax - unit.s_inchp) / (unit.s_lvmax - 1) * (slv - 1);
            skill.incatk = unit.s_incatk + (unit.s_incatkmax - unit.s_incatk) / (unit.s_lvmax - 1) * (slv - 1);
            skill.incdef = unit.s_incdef + (unit.s_incdefmax - unit.s_incdef) / (unit.s_lvmax - 1) * (slv - 1);
            skill.incpro = unit.s_incpro + (unit.s_incpromax - unit.s_incpro) / (unit.s_lvmax - 1) * (slv - 1);
            skill.incresi = unit.s_incresi + (unit.s_incresimax - unit.s_incresi) / (unit.s_lvmax - 1) * (slv - 1);
            skill.addresi = unit.s_addresi + (unit.s_addresimax - unit.s_addresi) / (unit.s_lvmax - 1) * (slv - 1);
            skill.dmgcut = unit.s_dmgcutmax - (unit.s_dmgcut - unit.s_dmgcutmax) / (unit.s_lvmax - 1) * (slv - 1);
            skill.cutmat = unit.s_dmgcutmat - (unit.s_dmgcutmat - unit.s_dmgcutmatmax) / (unit.s_lvmax - 1) * (slv - 1);
            skill.cutmag = unit.s_dmgcutmag - (unit.s_dmgcutmag - unit.s_dmgcutmagmax) / (unit.s_lvmax - 1) * (slv - 1);
            skill.debatk = unit.s_enemyatkmax - (unit.s_enemyatkmax - unit.s_enemyatkmin) / (unit.s_lvmax - 1) * (slv - 1);
            skill.debmat = unit.s_enemymatmax - (unit.s_enemymatmax - unit.s_enemymatmin) / (unit.s_lvmax - 1) * (slv - 1);
            skill.debdef = unit.s_enemydefmax - (unit.s_enemydefmax - unit.s_enemydefmin) / (unit.s_lvmax - 1) * (slv - 1);
            skill.debresi = unit.s_enemyresimax - (unit.s_enemyresimax - unit.s_enemyresimin) / (unit.s_lvmax - 1) * (slv - 1);
            skill.time = unit.s_timemin + (unit.s_timemax - unit.s_timemin) / (unit.s_lvmax - 1) * (slv - 1);
            skill.ct = unit.s_ctmax - (unit.s_ctmax - unit.s_ctmin) / (unit.s_lvmax - 1) * (slv - 1);
        }
        skill.quadra = unit.s_quadra;
        skill.spatk = unit.s_specialatk;
        skill.incatksp = unit.s_incatksp;
        skill.atktype = unit.s_atktype;
        row.motion = unit.s_motion;
        row.wait = unit.s_wait;
        
        mat = unit.skill.match(pat);
        if(mat){
            switch(mat[0]){
                case '猛将の鼓舞':
                case '烈火の陣':
                case '猛火の陣':
                    //冗長気味だけど時間計算でスキルon/offの計算をするために両方保持
                    if(row.incatk <= skill.incatk){ row.incatk = 1; }
                    else { skill.incatk = 1; }
                    break;
                case '鉄壁の陣':
                case '金城の陣':
                    if(row.incdef <= skill.incdef){ row.incdef = 1; }
                    else { skill.incdef = 1; }
                    break;
                case 'プロテクション':
                case '聖女の結界':
                    if(row.incpro <= skill.incpro){ row.incpro = 1; }
                    else { skill.incpro = 1; }
                    break;
                case 'マジックバリア':
                    if(row.cutmag <= skill.cutmag){ skill.cutmag = 1; }
                    else { row.cutmag = 1; }
                    break;
                case 'カースボイス':
                case '暗黒オーラ':
                    if(row.debatk <= skill.debatk ){ skill.debatk = 1; }
                    else { row.debatk = 1; }
                    break;
                case '聖なるオーラ':
                case '聖霊の護り':
                    if(row.debmat <= skill.debmat){ skill.debmat = 1; }
                    else { row.debmat = 1; }
                    break;
                case 'レヴァンテイン':
                    if(row.debresi <= skill.debresi){ skill.debresi = 1; }
                    else { row.debresi = 1; }
                    break;
                case 'ダモクレスの剣':
                    //if(row.incrosette <= skill.incatk){ row.incrosette = skill.incatk; }
                    if(row.incrosette <= skill.incatk){ row.incrosette = 1; }
                    else { skill.incatk = 1; skill.incdef = 1; }
                    break;
                case '堅鱗の癒し':
                    //if(row.incdef <= skill.incdef){ row.incdef = skill.incdef; }
                    if(oBuf.ekidona_s){ skill.incdef = 1; }
                    break;
                case '鋭牙の火炎':
                    //if(row.incatk <= skill.incatk){ row.incatk = skill.incatk; }
                    if(oBuf.lubinus_s){ skill.incatk = 1; }
                    break;
                default:
                    //if(inchp_row < s_inchp){ inchp_row = s_inchp;}
                    //if(incresi_row < s_incresi){ incresi_row = s_incresi; }
                    //if(cutmat_row <= s_cutmat){ s_cutmat = 1; }
                    //else { cutmat_row = 1; }
                    break;
            }
        }
    }

    //好感度
    if(!oBuf.bonus){
        row.bonushp = 0;
        row.bonusatk = 0;
        row.bonusdef = 0;
        row.bonusresi = 0;
    } else {
        row.bonushp = unit.bonushp;
        row.bonusatk = unit.bonusatk;
        row.bonusdef = unit.bonusdef;
        row.bonusresi = unit.bonusresi;
    }

    //CTカット
    var ctcut = oBuf.ctcut;
    if(unit.sid === 211){ //後衛軍師
        if(unit.cc === 0){
            if(ctcut > 0.9){ ctcut = 0.9; }
        } else if(unit.cc === 1){
            if(ctcut > 0.8){ ctcut = 0.8; }
        } else if(unit.cc >= 2){
            if(ctcut > 0.7){ ctcut = 0.7; }
        }
    }
    if(skill.ct !== 99999){
        skill.ct = skill.ct * ctcut;
    }
    
    //攻撃回数
    if(skill.quadra !== 0){ row.quadra = skill.quadra; }
    else { row.quadra = unit.quadra; }
    
    //特攻
    row.incatksp = $.inArray(enemy.sp, [unit.specialatk, unit.specialatk2, skill.spatk]); 
    if(row.incatksp === -1){ row.incatksp = 1; }
    else { row.incatksp = Math.max(unit.incatksp, skill.incatksp); }
    
    //攻撃属性
    if(skill.atktype === 0){ row.atktype = unit.atktype; }
    else { row.atktype = skill.atktype; }
    
    //エンチャンター - マジックウェポン
    if(row.atktype === 1 && oBuf.enchant){ row.atktype = 2; }
    
    //魔法剣士減衰計算
    if(unit.sid === 119 && oBuf.mahoken){
        if(unit.cc === 0){ row.incatk *= 0.5; }
        else if(unit.cc === 1){ row.incatk *= 0.6; }
        else if(unit.cc >= 2){ row.incatk *= 0.7; }
    }
    
    //編成バフの整理
    row.bufhp += bcls[unit.sid].bufhp;
    row.bufatk += bcls[unit.sid].bufatk;
    row.bufdef += bcls[unit.sid].bufdef;
    row.bufresi += bcls[unit.sid].bufresi;
    row.buftime += bcls[unit.sid].buftime;
    
    //特殊バフ(エキドナ、エステル、ルビナスは実質的に職バフ)
    if(oBuf.olivie && ((unit.type === 2) || (unit.type === 3))){ row.bufhp += 0.15; }
    if(oBuf.sherry && unit.rare <= 4){ row.bufhp += 0.05; row.bufatk += 0.05; row.bufdef += 0.05; }
    if(oBuf.hikage && unit.name === '月姫カグヤ'){ row.bufatk += 0.1; row.bufdef +=0.1;}
    if(oBuf.memento && unit.name.match(/スケルトン/)){ row.prince = Math.max(row.prince, sBuf.incmemento); }
    
    /*
    //暫定。ロゼットは全体バフと重複不可とする。重複可能の場合は後の計算にincrosetteを追加する
    if(unit.rare === 3){
        if(oBuf.rosette){
            if(row.incatk <= row.incrosette){ row.incatk = row.incrosette; }
            if(row.incdef <= row.incrosette){ row.incdef = row.incrosette; }
        }
        if(mat && mat[0] === 'ダモクレスの剣'){
            if(row.incatk <= skill.incatk){
                row.incatk = skill.incatk;
            }
            if(row.incdef <= skill.incdef){
                row.incdef = skill.incdef;
            }
            skill.incatk = 1;
            skill.incdef = 1;
        }
    }
    
    //暫定。ｓエキドナとルビナスは全体バフと重複不可とする。重複可能の場合は後の計算にoBuf.eki/lub_svを追加
    //sidで列挙するのが面倒なのでtype=1で
    //実際のところ1.3倍以上のバフは来ていないので、値比較の部分は冗長といえば冗長
    if(unit.type === 1){
        if(oBuf.ekidona_s && (row.incdef < oBuf.ekidona_sv)){
            row.incdef = oBuf.ekidona_sv;
        }
        if(oBuf.lubinus_s && (row.incatk < oBuf.lubinus_sv)){
            row.incatk = oBuf.lubinus_sv;
        }
    }
    */
    
    //ロゼット、ｓエキドナ、ｓルビナスをスキルバフと重複させる
    if(unit.rare === 3){
        if(oBuf.rosette){
            row.incatk = rounds(row.incatk * row.incrosette, 3);
            row.incdef = rounds(row.incdef * row.incrosette, 3);
        }
    }
    if(unit.type === 1){
        if(oBuf.ekidona_s){ row.incdef = rounds(row.incdef * oBuf.ekidona_sv, 3); }
        if(oBuf.lubinus_s){ row.incatk = rounds(row.incatk * oBuf.lubinus_sv, 3); }
    }
    
    
    //編成バフ持ち自身に対する適用
    var name = "伏龍の軍師アイシャ|魔女アデル|姫海賊アネリア|副官アリア" +
            "|光の守護者アルティア|帝国天馬騎士イザベル|姫山賊イメリア" +
            "|聖女イリス|地の軍師ウズメ|竜巫女エキドナ|天馬騎士団長エスタ" +
            "|魔法皇女エステル|オリヴィエ|弓騎兵カティナ|神秘の探求者ガラニア" +
            "|黒紫の巫女キキョウ|魔導鎧姫グレース|戦術教官ケイティ|侍剣士コジュウロウ" +
            "|山賊王コンラッド|宮廷剣士サビーネ|姫侍シズカ" +
            "|妖精郷の射手スピカ|黒槍騎士ダリア|風水士ピピン|白き魔女ベリンダ" +
            "|大盾の乙女ベルニス|朱鎧の智将マツリ|聖鎚闘士ミランダ|背反の癒し手ユーノ" +
            "|帝国兵長リーゼロッテ|提督リーンベル|武闘家リン|ルイーズ" +
            "|竜巫女ルビナス|天の軍師レン" +
            "|暗黒騎士";
    name = new RegExp(name);
    mat = unit.name.match(name);
    
    if(unit.teambuff === 1 && mat){
        
        //編成バフ
        switch(mat[0]){
            case '伏龍の軍師アイシャ':
                if(!oBuf.hp3){ row.bufhp += toNum($('#op_hp3').val()); }
                break;
            case '魔女アデル':
                if(!oBuf.hp2){ row.bufhp += toNum($('#op_hp2').val()); }
                break;
            case '姫海賊アネリア':
                if(!act['205atk']){ row.bufatk += toNum($('#205atk').val()); }
                break;
            case '副官アリア':
                if(!oBuf.atk1){ row.bufatk += toNum($('#op_atk1').val()); }
                break;
            case '光の守護者アルティア':
                if(!act['101hp']){
                    if(unit.cc < 2){ row.bufhp += 0.1; }
                    else { row.bufhp += toNum($('#101hp').val()); }
                }
                break;
            case '帝国天馬騎士イザベル':
                if(!act['114atk']){ row.bufatk += toNum($('#114atk').val()); }
                break;
            case '姫山賊イメリア':
                if(!act['108hp']){ row.bufhp += toNum($('#108hp').val()); }
                break;
            case '聖女イリス':
                if(!oBuf.def3){ row.bufdef += toNum($('#op_def3').val()); }
                break;
            case '地の軍師ウズメ':
                if(!oBuf.atk2){ row.bufatk += toNum($('#op_atk2').val()); }
                break;
            case '竜巫女エキドナ':
                if(!oBuf.ekidona){
                    row.bufhp += 0.05;
                    row.bufdef += 0.05;
                }
                break;
            case '天馬騎士団長エスタ':
                if(!act['114time']){
                    if(unit.cc < 2){
                        row.buftime += 0.3;
                    } else {
                        row.buftime += toNum($('#114time').val());
                    }
                }
                break;
            case '魔法皇女エステル':
                if(!oBuf.ester){ row.bufatk += 0.05; }
                break;
            case 'オリヴィエ':
                if(!oBuf.olivie){ row.bufhp += 0.15; }
                break;
            case '弓騎兵カティナ':
                if(!act['127atk']){ row.bufatk += toNum($('#127atk').val()); }
                break;
            case '神秘の探求者ガラニア':
                if(!act['202atk']){ row.bufatk += toNum($('#202atk').val()); }
                break;
            case '黒紫の巫女キキョウ':
                if(!oBuf.atk3){ row.bufatk += toNum($('#op_atk3').val()); }
                break;
            case '魔導鎧姫グレース':
                if(!oBuf.grace){ row.bufresi += 10; }
                break;
            case '戦術教官ケイティ':
                if(!oBuf.def1){ row.bufdef += toNum($('#op_def1').val()); }
                break;
            case '侍剣士コジュウロウ':
                if(!act['112def']){ row.bufdef += toNum($('#112def').val()); }
                break;
            case '山賊王コンラッド':
                if(!act['108atk']){ row.bufatk += toNum($('#108atk').val()); }
                break;
            case '宮廷剣士サビーネ':
                if(!act['119atk']){ row.bufatk += toNum($('#119atk').val()); }
                break;
            case '姫侍シズカ':
                if(!act['112atk']){ row.bufatk += toNum($('#112atk').val()); }
                break;
            case '妖精郷の射手スピカ':
                if(!act['201atk']){ row.bufatk += toNum($('#201atk').val()); }
                break;
            case '黒槍騎士ダリア':
                if(!act['103atk']){ row.bufatk += toNum($('#103atk').val()); }
                break;
            case '風水士ピピン':
                if(!act['213atk']){ row.bufatk += toNum($('#213atk').val()); }
                break;
            case '白き魔女ベリンダ':
                if(!act['204atk']){ row.bufatk += toNum($('#204atk').val()); }
                break;
            case '大盾の乙女ベルニス':
                if(!act['102def']){ row.bufdef += toNum($('#102def').val()); }
                break;
            case '朱鎧の智将マツリ':
                if(!oBuf.matsuri){
                    row.bufhp += 0.05;
                    row.bufatk += 0.05;
                    row.bufdef += 0.05;
                }
                break;
            case '聖鎚闘士ミランダ':
                if(!act['102atk']){ row.bufatk += toNum($('#102atk').val()); }
                break;
            case '背反の癒し手ユーノ':
                if(!act['203atk']){ row.bufatk += toNum($('#203atk').val()); }
                break;
            case '帝国兵長リーゼロッテ':
                if(!oBuf.liselotte){ 
                    row.bufdef += 0.05;
                    row.bufresi += 5;
                }
            case '提督リーンベル':
                if(!act['122time']){ row.buftime += toNum($('#122time').val()); }
                break;
            case '武闘家リン':
                if(!act['117atk']){ row.bufatk += toNum($('#117atk').val()); }
                break;
            case 'ルイーズ':
                if(!oBuf.louise){ row.bufdef += toNum($('#op_louise').val()); }
                break;
            case '竜巫女ルビナス':
                if(!oBuf.lubinus){ row.bufatk += 0.07; }
                break;
            case '天の軍師レン':
                if(!oBuf.def2){ row.bufdef += toNum($('#op_def2').val()); }
                break;
            case '暗黒騎士':
                if(!act['115time']){ row.buftime += toNum($('#115time').val()); }
        }
    }
    
    //スキル効果時間の設定
    skill.time *= row.buftime;
    if(skill.time === 0){
        //援軍要請や単発ものは0設定
        skill.time = unit.s_motion + unit.s_wait;
    }
}