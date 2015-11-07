
function submit_Click(){
    console.clear();
    clearbefore();
    chkData();

    var useSkill = $('#use_skill').prop('checked');
    var que, que1, que2;
    
    var whr_class = makeQuery_Class();
    var whr_cc = makeQuery_CC();
    var whr_matmag = makeQuery_MatMag(useSkill);
    var whr_melran = makeQuery_MelRan();
    var whr_rare = makeQuery_Rare();

    fil_units = Enumerable.From(units)
        .Where(whr_class)
        .Where(whr_cc)
        .Where(whr_matmag)
        .Where(whr_melran)
        .Where(whr_rare)
        .ToArray();    

    if(!useSkill){
        fil_units = Enumerable.From(fil_units)
        .Where('$.cc < 3')
        .ToArray();
    }
        
    make_bunits();
    
    if(mode === 'atk' || mode === 'def' || mode === 'mix'){
        que = Enumerable.From(bunits)
        .Where('$.reqlv <= $.lvmax')
        .ToArray();
    } else if(mode === 'reha'){
        que1 = Enumerable.From(bunits)
        .Where('$.cc == 2')
        .ToArray();
        
        que = Enumerable.From(bunits)
        .Join(que1, '$.sid + "_" + $.uid', '$.sid + "_" + $.uid')
        .Where('$.cc <= 2')
        .Where('$.reqlv <= $.lvmax')
        .Distinct('$.sid + "_" + $.cc + "_" + $.uid')
        .ToArray();
    }
    
    que = Enumerable.From(que)
    .OrderBy('$.sid')
    .ThenBy('$.rare')
    .ThenBy('$.uid')
    .ThenBy('$.cc')
    .ToArray();

    if((gl_enemy.mode === 'dps' && mode === 'atk') || mode === 'mix'){
        que = Enumerable.From(que)
            .OrderByDescending('$.dps')
            .ToArray();
    }
    
    bunits = que;
    
    setQue(bunits, useSkill);
    setLv(bunits);

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
function makeQuery_MatMag(useSkill){
    var matmag = '';
    var mat = $('#atkmat').prop('checked');
    var mag = $('#atkmag').prop('checked');
    var heal = $('#atkheal').prop('checked');
    var neet = $('#atkneet').prop('checked');
    var reha = (mode === reha);
    
    if(!reha){
        if(mat){
            if(useSkill){ matmag = '$.s_atktype == 1 || ($.atktype == 1 && $.s_atktype == 0)';}
            else { matmag = '$.atktype == 1'; }
        }

        if(mag){
            if(matmag.length > 0){ matmag += ' || '; }
            if(useSkill){ matmag += '$.s_atktype == 2 || ($.atktype == 2 && $.s_atktype == 0)'; }
            else { matmag += '$.atktype == 2'; }
        }

        if(heal){
            if(matmag.length > 0){ matmag += ' || '; }
            if(useSkill){ matmag += '$.s_atktype == 3 || ($.atktype == 3 && $.s_atktype == 0)'; }
            else { matmag += '$.atktype == 3'; }
        }
        
        if(neet){
            if(matmag.length > 0){ matmag += ' || '; }
            if(useSkill){ matmag += '$.s_atktype == 4 || ($.atktype == 4 && $.s_atktype == 0)'; }
            else { matmag += '$.atktype == 4'; }
        }
    }
    
    return matmag;
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

function clearbefore(){
    bUnits = null;
    clearbClass();
    
    $('#outputTable').trigger('sortReset');

    rowclear();

}
function clearbClass(){
    bclass.forEach(function(rows){
        rows.bufhp = 0;
        rows.bufatk = 0;
        rows.bufdef = 0;
        rows.bufresi = 0;
    });
}

function rowclear(){
    $('#outputTable').find('tr:gt(0)').remove();
}

function chkData(){
	var enemy = gl_enemy;
	
    //モード
    mode = $('#chkMode').val();

    //計算用値
    if(mode !== 'mix'){
        enemy.hp = toNum($('#atkHP').val());
        enemy.atk = toNum($('#defAtk').val());
        enemy.def = toNum($('#atkDef').val());
        enemy.resi = toNum($('#atkResi').val());
        enemy.type = toNum($('#defType').val());
        enemy.sp = toNum($('#atksp').val());
        enemy.mix = toNum($('input[type="radio"][name="mixLv"]:checked').val());
        enemy.mode = $('input[type="radio"][name="atkMode"]:checked').val();
        enemy.time = toNum($('#atkTime').val());
        
        if(mode === 'atk'){
        	enemy.cnt = toNum($('#atkCnt').val());
        } else if(mode === 'def'){
        	enemy.cnt = toNum($('#defCnt').val());
        }
    } else {
        enemy.atk = toNum($('#mixAtk').val());
        enemy.def = toNum($('#mixDef').val());
        enemy.resi = toNum($('#mixResi').val());
        enemy.type = toNum($('#mixType').val());
        enemy.sp = toNum($('#mixsp').val());
        enemy.mix = toNum($('input[type="radio"][name="mixLv"]:checked').val());
        enemy.cnt = 1;
    }

    //編成バフ
    chkBuff_team_Base();	//HP、攻撃、防御
    chkBuff_team_Ex();		//特殊強化
    chkBuff_team_Melee();	//近接
    chkBuff_team_Class();	//職別

    //スキルバフ
    chkBuff_skill_Increase();
    //chkBuff_skill_Decrease();
    //chkBuff_skill_EnemyIncrease();
    chkBuff_skill_EnemyDecrease();
    
    //その他バフ類
    otherBuff.enchant = $('#op_enchant').prop('checked');
    otherBuff.danceatk = $('#op_dance').prop('checked') * $('#dance_atk').val();
    otherBuff.dancedef = $('#op_dance').prop('checked') * $('#dance_def').val();
    otherBuff.areaatk = $('#op_areaAtk').prop('checked') * $('#areaAtk').val() / 100;
    otherBuff.areadef = $('#op_areaDef').prop('checked') * $('#areaDef').val() / 100;
    
    if(otherBuff.areaatk === 0){ otherBuff.areaatk = 1; }
    if(otherBuff.areadef === 0){ otherBuff.areadef = 1; }
}

function incBuffHp(sid, val){ bclass[sid].bufhp += val; }
function incBuffAtk(sid, val){ bclass[sid].bufatk += val; }
function incBuffDef(sid, val){ bclass[sid].bufdef += val; }
function incBuffResi(sid, val){ bclass[sid].bufresi += val; }

function chkBuff_team_Base(){
    var hp = 0;
    var atk = 0;
    var def = 0;

    //HP
    hp += $('#op_hp1').prop('checked') * $('#op_hp1').val();
    hp += $('#op_hp2').prop('checked') * $('#op_hp2').val();
    hp += $('#op_hp3').prop('checked') * $('#op_hp3').val();

    //攻撃
    atk += $('#op_atk1').prop('checked') * $('#op_atk1').val();
    atk += $('#op_atk2').prop('checked') * $('#op_atk2').val();
    atk += $('#op_atk3').prop('checked') * $('#op_atk3').val();

    //防御
    def += $('#op_def1').prop('checked') * $('#op_def1').val();
    def += $('#op_def2').prop('checked') * $('#op_def2').val();
    def += $('#op_def3').prop('checked') * $('#op_def3').val();
    def += $('#op_louise').prop('checked') * $('#op_louise').val();

    bclass.forEach(function(rows){
        rows.bufhp += hp;
        rows.bufatk += atk;
        rows.bufdef += def;
    });
}

function chkBuff_team_Ex(){
    var incbuf = {};
    incbuf['hp'] = incBuffHp;
    incbuf['atk'] = incBuffAtk;
    incbuf['def'] = incBuffDef;
    incbuf['resi'] = incBuffResi;

    //アンナ(未実装)
    //sid=100

    //エキドナ(竜、ドラゴンライダーのHPと防御5%)
    //sid=109,110,111,126 or type=1
    if($('#op_ekidona').prop('checked')){
        incbuf['hp'](109, 0.05); incbuf['def'](109, 0.05);
        incbuf['hp'](110, 0.05); incbuf['def'](110, 0.05);
        incbuf['hp'](111, 0.05); incbuf['def'](111, 0.05);
        incbuf['hp'](126, 0.05); incbuf['def'](126, 0.05);
    }

    //エステル(魔法剣士、メイジアーマー、メイジ、ビショップの攻撃力+5%)
    //sid=119,125,202,209
    if($('#op_ester').prop('checked')){
        incbuf['atk'](119, 0.05);
        incbuf['atk'](125, 0.05);
        incbuf['atk'](202, 0.05);
        incbuf['atk'](209, 0.05);
    }

    //オリヴィエ(エルフ(ハーフ,ダーク込)、ドワーフのHP15%)
    //type=2,3
    //bUnitsを作るところで再確認

    //シェリー(金以下のHP、攻撃、防御5%)
    //rare<=4
    //bUnitsを作るところで再確認

    //ヒカゲ(カグヤの攻撃、防御10%)
    //id=105171,105271
    //bUnitsを作るところで再確認

    //ルビナス(竜、ドラゴンライダーの攻撃7%)
    //sid=109,110,111,126 or type=1
    if($('#op_lubinus').prop('checked')){
        incbuf['atk'](109, 0.07);
        incbuf['atk'](110, 0.07);
        incbuf['atk'](111, 0.07);
        incbuf['atk'](126, 0.07);
    }
}

function chkBuff_team_Melee(){
    var hp = 0;
    var atk = 0;
    var def = 0;
    var resi = 0;

    //カグラ(近接の攻撃5%)
    if($('#op_kagura').prop('checked')){ atk += 0.05; }

    //マツリ(近接のHP,攻撃,防御5%)
    if($('#op_matsuri').prop('checked')){
        hp += 0.05;
        atk += 0.05;
        def += 0.05;
    }

    //グレース(近接の魔耐+10)
    if($('#op_grace').prop('checked')){ resi += 10; }

    var que = Enumerable.From(classes)
    .Distinct('$.sid')
    .Where('$.sid < 200')
    .Select('$.sid')
    .ToArray();
    
    que.forEach(function(sid){
        bclass[sid].bufhp += hp;
        bclass[sid].bufatk += atk;
        bclass[sid].bufdef += def;
        bclass[sid].bufresi += resi;
    });
}

function chkBuff_team_Class(){    
    var sid = "";
    var pat = /hp$|atk$|def$|resi$/;
    var typ = "";
    var incbuf = [];
    var val = "";

    incbuf['hp'] = incBuffHp;
    incbuf['atk'] = incBuffAtk;
    incbuf['def'] = incBuffDef;
    incbuf['resi'] = incBuffResi;

    actbuff.forEach(function(id){
        sid = toNum(id.substr(1,3));
        typ = id.match(pat);
        val = $(id).prop('checked') * $(id).val();

        incbuf[typ](sid,val);
    });
}

function chkBuff_skill_Increase(){
    var prince = toNum($('input[name="op_prince"][type="radio"]:checked').val());

    var inchp = 1;
    var incatk = toNum($('#incatk').html());
    var incdef = toNum($('#incdef').html());
    var incpro = toNum($('#incpro').html());
    var incresi = 1;
    var addresi = 0;

    //var dmgcutmat = toNum($('#dmgcut_mat').html());
    var dmgcutmat = 1;
    var dmgcutmag = toNum($('#dmgcut_mag').html());

    var incrosette = toNum($('#inc_rosette').val());

    skillbuffs.prince = prince;
    skillbuffs.inchp = inchp;
    skillbuffs.incatk = incatk;
    skillbuffs.incdef = incdef;
    skillbuffs.incpro = incpro;
    skillbuffs.incresi = incresi;
    skillbuffs.addresi = addresi;
    skillbuffs.dmgcutmat = dmgcutmat;
    skillbuffs.dmgcutmag = dmgcutmag;
    skillbuffs.incrosette = incrosette;
}

function chkBuff_skill_EnemyDecrease(){
    var emydebatk = toNum($('#emy_debatk').html());
    var emydebmat = toNum($('#emy_debmat').html());
    var emydebdef = toNum($('#emy_debdef').html());
    var emydebresi = toNum($('#emy_debresi').html());

    skillbuffs.emydebatk = emydebatk;
    skillbuffs.emydebmat = emydebmat;
    skillbuffs.emydebdef = emydebdef;
    skillbuffs.emydebresi = emydebresi;
}

function make_bunits(){
    //要求レベル算出用
    var reqAtk, reqDef, reqLv, dps;
    //確殺
    var enemy = gl_enemy;
    
    //リハビリ
    var rehamode = $('#rehaMode option:selected').val();

    //状態チェック(必要なら値も)
    var bonus = toNum($('input[name="bonus"]:checked').val());
    var useSkill = $('#use_skill').prop('checked');
    var olivie = $('#op_olivie').prop('checked');
    var sherry = $('#op_sherry').prop('checked');
    var hikage = $('#op_hikage').prop('checked');
    var rosette = $('#inc_rosette').prop('checked');

    //編成バフ
    var bufhp, bufatk, bufdef, bufresi;

    //スキルバフ(他->自)
    //一部ユニットの再計算用
    var prince = skillbuffs.prince;
    var inchp = skillbuffs.inchp;
    var incatk = skillbuffs.incatk;
    var incdef = skillbuffs.incdef;
    var incpro = skillbuffs.incpro;
    var incresi = skillbuffs.incresi;
    var cutmat = skillbuffs.dmgcutmat;
    var cutmag = skillbuffs.dmgcutmag;
    var emydebatk = skillbuffs.emydebatk;
    var emydebmat = skillbuffs.emydebmat;
    var emydebdef = skillbuffs.emydebdef;
    var emydebresi = skillbuffs.emydebresi;
    var incrosette = skillbuffs.incrosette;
    var spatk = 0;
    var incatksp = 1;
    
    var inchp_row = inchp;
    var incatk_row = incatk;
    var incdef_row = incdef;
    var incpro_row = incpro;
    var incresi_row = incresi;
    var cutmat_row = cutmat;
    var cutmag_row = cutmag;
    var emydebatk_row = emydebatk;
    var emydebmat_row = emydebmat;
    var emydebdef_row = emydebdef;
    var emydebresi_row = emydebresi;
    var incrosette_row = incrosette;
    var spatk_row = 0, spatk2_row = 0;
    var incatksp_row = 1;

    //スキルバフ(自)
    var s_inchp = 1;
    var s_incatk = 1;
    var s_incdef = 1;
    var s_incpro = 1;
    var s_incresi = 1;
    var s_addresi = 0;
    var s_dmgcut = 1;
    var s_cutmat = 1;
    var s_cutmag = 1;
    var s_emydebatk = 1;
    var s_emydebmat = 1;
    var s_emydebdef = 1;
    var s_emydebresi = 1;
    var s_quadra = 0;
    var s_spatk = 0;
    var s_incatksp = 1;

    var enchant = otherBuff.enchant;
    var danceatk = otherBuff.danceatk;
    var dancedef = otherBuff.dancedef;
    var areaAtk = otherBuff.areaatk;
    var areaDef = otherBuff.areadef;
    
    var divhp, divatk, divdef;
    var motion, wait;
    
    var pat = /猛将の鼓舞|烈火の陣|猛火の陣|鉄壁の陣|金城の陣|プロテクション|聖女の結界|聖なるオーラ|聖霊の護り|マジックバリア|暗黒オーラ|軟化の秘術|レヴァンテイン|ダモクレスの剣/;

    bunits = Enumerable.From(fil_units)
        .Select(function(x){
        //編成バフ
        bufhp = 1 + bclass[x.sid].bufhp;
        bufatk = 1 + bclass[x.sid].bufatk;
        bufdef = 1 + bclass[x.sid].bufdef;
        bufresi =    bclass[x.sid].bufresi; //(既存のバフが固定値上昇のみのためとりあえずこの形式)

        incrosette_row = incrosette;

        //特殊バフ(エキドナ、エステル、ルビナスは実質的に職バフ)
        if(olivie && ((x.type === 2) || (x.type === 3))){ bufhp += 0.15; }
        if(sherry && (x.rare <= 4)){ bufhp += 0.05; bufatk += 0.05; bufdef += 0.05; }
        if(hikage && ((x.id === 105171) || (x.id === 105271))){ bufatk += 0.1; bufdef +=0.1;}
        if(rosette && (x.rare === 3)){} else { incrosette_row = 1; }
        
        var lv = x.lv, lvmax = x.lvmax;
        var hp = x.hp, hpmax = x.hpmax, bonushp = x.bonushp * bonus;
        var atk = x.atk, atkmax = x.atkmax, bonusatk = x.bonusatk * bonus;
        var def = x.def, defmax = x.defmax, bonusdef = x.bonusdef * bonus;
        var resi = x.resi, bonusresi = x.bonusresi * bonus;
        var quadra = x.quadra; var atktype = x.atktype;
        spatk_row = x.specialatk, spatk2_row = x.specialatk2;
        incatksp_row = x.incatksp;
        
        if(useSkill){
            s_inchp = x.s_inchpmax;
            s_incatk = x.s_incatkmax;
            s_incdef = x.s_incdefmax;
            s_incpro = x.s_incpromax;
            s_incresi = x.s_incresimax;
            s_addresi = x.s_addresimax;
            s_dmgcut = x.s_dmgcutmax;
            s_cutmat = x.s_dmgcutmatmax;
            s_cutmag = x.s_dmgcutmagmax;
            s_emydebatk = x.s_enemyatkmin;
            s_emydebmat = x.s_enemymatmin;
            s_emydebdef = x.s_enemydefmin;
            s_emydebresi = x.s_enemyresimin;
            s_quadra = x.s_quadra;
            s_spatk = x.s_specialatk;
            s_incatksp = x.s_incatksp;

            inchp_row = inchp;
            incatk_row = incatk;
            incdef_row = incdef;
            incpro_row = incpro;
            incresi_row = incresi;
            cutmat_row = cutmat;
            cutmag_row = cutmag;
            emydebatk_row = emydebatk;
            emydebdef_row = emydebdef;
            emydebresi_row = emydebresi;
            incrosette_row = incrosette;

            var s_atktype = x.s_atktype;
            if((s_atktype !== 0) && (s_atktype !== atktype)){
                //属性変更有り + スキル前後で属性が違う
                atktype = s_atktype;
            }

            //攻撃回数の変更
            if(s_quadra !== 0){ quadra = s_quadra; }
            
            //特攻の整理
            if(enemy.sp !== s_spatk){ 
                s_incatksp = 1;
            }

            //スキルバフ(他)を持っているユニットの調整
            var mat = x.skill.match(pat);
            if(mat !== null){
                switch(mat[0]){
                    case '猛将の鼓舞':
                    case '烈火の陣':
                    case '猛火の陣':
                        if(incatk_row <= s_incatk){ incatk_row = 1; }
                        else { s_incatk = 1; }
                        break;
                    case '鉄壁の陣':
                    case '金城の陣':
                        if(incdef_row <= s_incdef){ incdef_row = 1; }
                        else { s_incdef = 1; }
                        break;
                    case 'プロテクション':
                    case '聖女の結界':
                        if(incpro_row <= s_incpro){ incpro_row = 1; }
                        else { s_incpro = 1; }
                        break;
                    case 'マジックバリア':
                        if(cutmag_row <= s_cutmag){ s_cutmag = 1; }
                        else { cutmag_row = 1; }
                        break;
                    case 'カースボイス':
                    case '暗黒オーラ':
                        if(emydebatk_row <= s_emydebatk){ s_emydebatk = 1; }
                        else { emydebatk_row = 1; }
                        break;
                    case '聖なるオーラ':
                    case '聖霊の護り':
                        if(emydebmat_row <= s_emydebmat){ s_emydebmat = 1; }
                        else { emydebmat_row = 1; }
                        break;
                    case '軟化の秘術':
                        if(emydebdef_row <= s_emydebdef){ s_emydebdef = 1; }
                        else { emydebdef_row = 1; }
                        break;
                    case 'レヴァンテイン':
                        if(emydebresi_row <= s_emydebresi){ s_emydebresi = 1; }
                        else { emydebresi_row = 1; }
                        break;
                    case 'ダモクレスの剣':
                        if(incrosette_row <= s_incatk){ incrosette_row = s_incatk; }
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

        //暫定。ロゼットは全体バフと重複不可とする。重複可能の場合は後の計算にincrosette_rowを追加する
        if(incatk_row < incrosette_row){ incatk_row = incrosette_row; }
        if(incdef_row < incrosette_row){ incdef_row = incrosette_row; }

        if((spatk_row !== enemy.sp) && (spatk2_row !== enemy.sp)){
            incatksp_row = 1;
        }
        
        //エンチャンター - マジックウェポン
        if(enchant && atktype === 1){ atktype = 2; }
        
        //耐久(耐DPSのために耐久のくくりを先に)
        if(mode === 'def' || mode === 'mix'){
            if(enemy.type === 1){
                //物理
                var row_hp = Math.floor((hpmax + bonushp) * bufhp);
                row_hp = Math.floor(row_hp * inchp_row * s_inchp);

                var row_def = Math.floor((defmax + bonusdef) * bufdef);
                if((prince < incpro_row) || (prince < s_incpro)){
                    row_def = Math.floor(row_def * incpro_row * s_incpro * incdef_row * s_incdef);
                } else {
                    row_def = Math.floor(row_def * prince * incdef_row * s_incdef);
                }
                
                row_def = Math.floor(row_def * areaDef);
                row_def += dancedef;

                var row_defAtk = Math.ceil(enemy.atk * emydebatk_row * s_emydebatk * emydebmat_row * s_emydebmat);
                
                var dmglimit = Math.floor(Math.floor(row_defAtk / 10) * cutmat_row * s_cutmat);
                var dmgmax = Math.floor((row_defAtk - row_def) * cutmat_row * s_cutmat);
                dmgmax = (dmgmax <= dmglimit)? dmglimit : dmgmax;

                if(row_hp <= dmgmax * enemy.cnt){
                    reqLv = 999;
                } else {
                    divhp = (hpmax - hp) / (lvmax - 1);
                    divdef = (defmax - def) / (lvmax - 1);

                    var i = Math.ceil(lvmax / 2);
                    var imax = lvmax;
                    var imin = lv;

                    var cnt = 0;
                    var result = 0;

                    while(imin < imax && cnt < 20){
                        i = Math.floor((imax + imin) / 2);

                        row_hp = hp + bonushp + Math.floor(divhp * (i - 1));
                        row_hp = Math.floor(row_hp * bufhp);
                        row_hp = Math.floor(row_hp * inchp_row * s_inchp);
                        row_def = def + bonusdef + Math.floor(divdef * (i - 1));
                        row_def = Math.floor(row_def * bufdef);
                        
                        if((prince < incpro_row) || (prince < s_incpro)){
                            row_def = Math.floor(row_def * incpro_row * s_incpro * incdef_row * s_incdef);
                        } else {
                            row_def = Math.floor(row_def * prince * incdef_row * s_incdef);
                        }
                        row_def += dancedef;
                        
                        dmgmax = Math.ceil((row_defAtk - row_def) * cutmat * s_cutmat);
                        dmgmax = (dmgmax <= dmglimit)? dmglimit : dmgmax;

                        result = row_hp - dmgmax * enemy.cnt;

                        if(result <= 0)
                        { imin = i + 1; }
                        else { imax = i; }

                        cnt += 1;
                    }

                    if(cnt >= 20){ console.log('何かがおかしいっぽいので抜けました'); }

                    reqLv = imax;
                }
            } else if(enemy.type === 2){
                //魔法
                divhp = (hpmax - hp) / (lvmax - 1);

                var dmgmax = Math.ceil(enemy.atk * enemy.cnt * emydebatk_row * s_emydebatk);
                dmgmax = Math.ceil(dmgmax * cutmag_row * s_cutmag);

                var reqhp = 1 - (resi + bonusresi + bufresi + s_addresi) / 100;
                reqhp = Math.floor(reqhp * incresi_row * s_incresi);
                reqhp = 1 - reqhp;
                reqhp = dmgmax / reqhp;

                reqLv = Math.ceil(reqhp / (inchp_row * s_inchp));
                reqLv = Math.ceil(reqLv / bufhp) - (hp + bonushp);
                reqLv = Math.ceil(reqLv / divhp) + 1;

                if(reqLv <= 0){ reqLv = lv; }
                if(reqLv <= lvmax){
                    //ちょうど0になるパターンが存在するので調整
                    var temp = hp + bonushp + Math.floor(divhp * (reqLv - 1));
                    temp = Math.floor(temp * bufhp);
                    temp = Math.floor(temp * inchp_row * s_inchp);

                    if(reqhp === temp){ reqLv += 1; }
                }
            }
        } 
        
        //攻撃
        if(mode === 'atk' || (mode === 'mix' && reqLv <= lvmax)){
            divatk = ((atkmax - atk) / (lvmax - 1));

            if(enemy.mode === 'cnt' && mode !== 'mix'){
                reqAtk = Math.ceil(enemy.hp / enemy.cnt);
                if(atktype === 1){
                    //物理
                    reqAtk = reqAtk + Math.ceil(enemy.def * emydebdef_row * s_emydebdef);
                } else if(atktype === 2){
                    //魔法
                    reqAtk = Math.ceil(reqAtk / (1 - Math.ceil(enemy.resi * emydebresi_row * s_emydebresi) / 100));
                }
                reqAtk -= danceatk;

                reqLv = Math.ceil(reqAtk / areaAtk);
                reqLv = Math.ceil(reqLv / (prince * incatk_row * s_incatk * incatksp_row * s_incatksp));
                reqLv = Math.ceil(Math.ceil(reqLv / bufatk) / quadra);
                reqLv = Math.ceil(reqLv - (atk + bonusatk));
                reqLv = Math.ceil(reqLv / divatk) + 1;

                if(reqLv <= 0){ reqLv = lv; }

                if((x.lvmax < reqLv) && (atktype === 1)){
                    //餅つき計算
                    reqAtk = Math.ceil(enemy.hp / enemy.cnt) * 10;

                    reqLv = Math.ceil(reqAtk / (prince * incatk_row * s_incatk * incatksp_row * s_incatksp));
                    reqLv = Math.ceil(Math.ceil(reqLv / bufatk) / quadra);
                    reqLv = Math.ceil(reqLv - (atk + bonusatk));
                    reqLv = Math.ceil(reqLv / divatk) + 1;
                }
            //} else {
            } else if(enemy.mode === 'dps' || enemy.mode === 'time' || mode === 'mix'){
                //DPS計算
                if(mode !== 'mix' || enemy.mix !== 0){ reqLv = lvmax; }
                var row_lv = reqLv;
                
                if(useSkill){ 
                    motion = x.s_motion;
                    wait = x.s_wait;
                } else {
                    motion = x.motion;
                    wait = x.wait;
                }

                var row_atk;
                if(reqLv === lvmax){ row_atk = atkmax + bonusatk }
                else { row_atk = Math.floor((atk + bonusatk) + (atkmax - atk) / (lvmax - 1) * (reqLv - 1)); }
                row_atk = Math.floor(row_atk * bufatk);
                row_atk = Math.floor(row_atk * prince * incatk_row * s_incatk * incatksp_row * s_incatksp);
            	row_atk = Math.floor(row_atk * areaAtk);
            	row_atk += danceatk;
                
                if(atktype === 1){
                    var row_def = Math.ceil(enemy.def * emydebdef_row * s_emydebdef);
                    var dmglimit = Math.floor(row_atk / 10);

                    if(dmglimit >= (row_atk - row_def)){
                        row_atk = Math.floor(row_atk / 10);
                    } else {
                        row_atk = row_atk - row_def;
                    }

                } else if(atktype === 2){
                    var row_resi = 1 - Math.ceil(enemy.resi * emydebresi_row * s_emydebresi) / 100;
                    row_atk = Math.floor(row_atk * row_resi);
                    if(row_atk === 0){ row_atk = 1; }
                }

                dps = row_atk * quadra * 30 / (motion + wait);
                
                if(mode === 'atk' && enemy.mode === 'time'){
                	var n_atk, s_atk;
                	var n_dmg, s_dmg, dmg;

                	n_atk = atkmax + bonusatk;
                	n_atk = Math.floor(n_atk * bufatk);
                	s_atk = Math.floor(n_atk * prince * incatk_row * s_incatk * incatksp_row * s_incatksp);
                	s_atk = Math.floor(s_atk * areaAtk);
                	s_atk += danceatk;
                	
                	n_atk = Math.floor(n_atk * prince * incatk_row * incatksp_row);
                	n_atk = Math.floor(n_atk * areaAtk);
                	n_atk += danceatk;

                	if(x.atktype === 1 && !enchant){
                		row_def = Math.ceil(enemy.def * emydebdef_row);
                		dmg = n_atk - row_def;
                		if(dmg < Math.floor(n_atk/10)){ n_dmg = Math.floor(n_atk/10); }
                		else { n_dmg = dmg; }
                	} else if(x.atktype === 2 || enchant){
                		row_resi = 1 - Math.ceil(enemy.resi * emydebresi_row) / 100;
                		n_dmg = Math.floor(n_atk * row_resi);
                	} else if(x.atktype === 4){
                		n_dmg = 0;
                	}
            		n_dmg *= x.quadra;
                	
                	if(x.s_atktype === 1 || ((x.atktype === 1 && x.s_atktype === 0) && !enchant)){
                		row_def = Math.ceil(enemy.def * emydebdef_row * s_emydebdef);
                		dmg = s_atk - row_def;
                		if(dmg < Math.floor(s_atk/10)){ s_dmg = Math.floor(s_atk/10); }
                		else { s_dmg = dmg; }
                	} else if(x.s_atktype === 2 || (x.atktype === 2 && x.s_atktype === 0) || enchant){
                		row_resi = 1 - Math.ceil(enemy.resi * emydebresi_row * s_emydebresi) / 100;
                		s_dmg = Math.floor(s_atk * row_resi);
                	} else if(x.s_atktype === 4){
                		s_dmg = 0;
                	}
            		if(x.s_quadra !== 0){ s_dmg *= x.s_quadra; }
            		else { s_dmg *= x.quadra; }
                	
                    var data = {
                		reqhp: enemy.hp, reqLv: 999,
                		dmg: 0, n_dmg: n_dmg, s_dmg: s_dmg,
                        time: enemy.time * 30, s_time: x.s_timemax * 30, ct: x.s_ctmin * 30,
                        motion: x.motion, wait: x.wait,
                        s_motion: x.s_motion, s_wait: x.s_wait,
                        lvmax: lvmax
                    };
                    
                    dmgcalc(data, useSkill);
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
                    if(rehamode === 'all' || rehamode === 'hp'){
                        divhp = (hpmax - hp) / (lvmax - 1);
                        temp = Math.ceil((que[0].hpmax - hp) / divhp) + 1;
                        if(temp > reqLv){ reqLv = temp; }
                    }
                    if(rehamode === 'all' || rehamode === 'atk'){
                        divatk = (atkmax - atk) / (lvmax - 1);
                        temp = Math.ceil((que[0].atkmax - atk) / divatk) + 1;
                        if(temp > reqLv){ reqLv = temp; }
                    }
                    if(rehamode === 'all' || rehamode === 'def'){
                        divdef = (defmax - def) / (lvmax - 1);
                        temp = Math.ceil((que[0].defmax - def) / divdef) + 1;
                        if(temp > reqLv){ reqLv = temp; }
                    }
                    if(reqLv >= lvmax){ reqLv = lvmax; }
                } else {
                    reqLv = 999;
                }
            } else {
                reqLv = lvmax;
            }
            if(cc === 0 && noncc === 0){ reqLv = 999; }
        }

        return {
            sid:x.sid, id:x.id, uid:x.uid, clas:x.clas, name:x.name,
            rare:x.rare, cc:x.cc, noncc:x.noncc, lv:lv, lvmax:lvmax,
            hp:hp, hpmax:hpmax, atk:atk, atkmax:atkmax,
            def:def, defmax:defmax, resi:resi,
            block:x.block, range:x.range, costmax:x.costmax, costmin:x.costmin,
            bonushp:bonushp, bonusatk:bonusatk, bonusdef:bonusdef,
            bonusresi:bonusresi, bonusblock:x.bonusblock, 
            bonusrange:x.bonusrange,
            specialatk:x.specialatk, specialatk2:x.specialatk2, 
            incatksp:x.incatksp,
            quadra:x.quadra, atktype:x.atktype, type:x.type,
            skill:x.skill, dataerr:x.dataerr,
            motion:x.motion, wait:x.wait,
            s_motion:x.s_motion, s_wait:x.s_wait,
            
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
            s_ctmin:x.s_ctmin, s_ctmax:x.ctmax,
            
            bufhp:bufhp, bufatk:bufatk, bufdef:bufdef, bufresi:bufresi,
            inchp:inchp, incatk:incatk, incdef:incdef, incpro:incpro,  incresi:incresi,
            dmgcutmat:cutmat, dmgcutmag:cutmag, incrosette:incrosette_row,
            emydebatk:emydebatk, emydebdef:emydebdef, emydebresi:emydebresi,
            emydebmat:emydebmat,
            prince:prince,
            reqlv:reqLv, dps:dps
        };
    })
        .ToArray();
}

function dmgcalc(data, useSkill){
    if(useSkill){
        while(data.time > data.s_motion){
            dmgcalc_skill(data);
            dmgcalc_noskill(data);
        }
    } else {
        while(data.time > data.motion){
            dmgcalc_noskill(data);
        }
    }
    
    if(data.dmg >= data.reqhp){
    	data.reqlv = data.lvmax;
    } else {
    	data.reqlv = 999;
    }
}


function dmgcalc_skill(data){
    var dmg = 0;
    var cnt = 0;
    var time = 0;

    if(data.time > data.s_time){
        time = data.s_time;
    } else {
        time = data.time;
    }
    data.time -= time;
    
    cnt = Math.floor(time / (data.s_motion + data.s_wait));
    time -= (cnt * (data.s_motion + data.s_wait));
    if(time >= data.s_motion){
        cnt += 1;
        time -= (data.s_motion + data.wait);
    }
    
    dmg = cnt * data.s_dmg;
    data.dmg += dmg;

    if(data.time < data.motion){
    	data.time = 0;
    } else {
        data.time += time;
    }
}


function dmgcalc_noskill(data, useSkill){
    var dmg = 0;
    var cnt = 0;
    var time = 0;
    
    if(data.time > data.s_ctmin && useSkill){
    	time = data.s_ctmin;
    } else {
    	time = data.time;
    }
    data.time -= time;
    
    cnt = Math.floor(time / (data.motion + data.wait));
    time -= (cnt * (data.motion + data.wait));
    
    if(time >= data.motion){
    	cnt += 1;
    	time -= (data.motion + data.wait);
    }

    dmg = cnt * data.n_dmg;
    data.dmg += dmg;
    
    if((useSkill && data.time < data.s_motion) || (!useSkill && data.time < data.motion)){
    	data.time = 0;
    } else {
    	data.time += time;
    }
}

function make_bunitsjoin(){
    var str = '';
    str += '{ ';
    //unit
    str += 'sid:$.sid, id:$.id, uid:$.uid';
    str += ', clas:$.clas, name:$.name, rare:$.rare, cc:$.cc, noncc:$.noncc';
    str += ', lv:$.lv, lvmax:$.lvmax';
    str += ', hp:$.hp, hpmax:$.hpmax, bonushp:$.bonushp';
    str += ', atk:$.atk, atkmax:$.atkmax, bonusatk:$.bonusatk';
    str += ', def:$.def, defmax:$.defmax, bonusdef:$.bonusdef';
    str += ', resi:$.resi, bonusresi:$.bonusresi';
    str += ', block:$.block, bonusblock:$.bonusblock';
    str += ', range:$.range, bonusrange:$.bonusrange';
    str += ', costmax:$.costmax, costmin:$.costmin';
    str += ', quadra:$.quadra';
    str += ', specialatk:$.specialatk, specialatk2:$.specialatk2';
    str += ', incatksp:$.incatksp';
    str += ', skill:$.skill, atktype:$.atktype, type:$.type, dataerr:$.dataerr';
    str += ', motion:$.motion, wait:$.wait';
    str += ', s_motion:$.s_motion, s_wait:$.s_wait';
    //skill
    str += ', s_lvmax:$$.lvmax';
    str += ', s_inchp:$$.inchp, s_inchpmax:$$.inchpmax';
    str += ', s_incatk:$$.incatk, s_incatkmax:$$.incatkmax';
    str += ', s_incdef:$$.incdef, s_incdefmax:$$.incdefmax';
    str += ', s_incpro:$$.incpro, s_incpromax:$$.incpromax';
    str += ', s_incresi:$$.incresi, s_incresimax:$$.incresimax';
    str += ', s_addresi:$$.addresi, s_addresimax:$$.addresimax';
    str += ', s_incrange:$$.incrange, s_incrangemax:$$.incrangemax';
    str += ', s_incblock:$$.incblock, s_incblockmax:$$.incblockmax';
    str += ', s_dmgcut:$$.dmgcut, s_dmgcutmax:$$.dmgcutmax';
    str += ', s_dmgcutmat:$$.dmgcutmat, s_dmgcutmatmax:$$.dmgcutmatmax';
    str += ', s_dmgcutmag:$$.dmgcutmag, s_dmgcutmagmax:$$.dmgcutmagmax';
    str += ', s_enemyatkmax:$$.enemyatkmax, s_enemyatkmin:$$.enemyatkmin';
    str += ', s_enemymatmax:$$.enemymatmax, s_enemymatmin:$$.enemymatmin';
    str += ', s_enemydefmax:$$.enemydefmax, s_enemydefmin:$$.enemydefmin';
    str += ', s_enemyresimax:$$.enemyresimax, s_enemyresimin:$$.enemyresimin';
    str += ', s_quadra:$$.quadra';
    str += ', s_specialatk:$$.specialatk, s_incatksp:$$.incatksp';
    str += ', s_atktype:$$.atktype';
    str += ', s_timemin:$$.timemin, s_timemax:$$.timemax';
    str += ', s_ctmin:$$.ctmin, s_ctmax:$$.ctmax';

    str += ' }';
    return str;
}