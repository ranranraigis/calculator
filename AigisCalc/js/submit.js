
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
    
    if(gl_mode === 'atk' || gl_mode === 'def' || gl_mode === 'mix'){
        que = Enumerable.From(bunits)
        .Where('$.reqlv <= $.lvmax')
        .ToArray();
    } else if(gl_mode === 'reha'){
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
    var reha = (gl_mode === 'reha');
    
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
    
    //$('#outputTable').trigger('sortReset');

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
	gl_mode = $('#chkMode').val();
	
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
        enemy.cnt = toNum($('#mixCnt').val());
    }

    //編成バフ
    chkBuff_team_Base();	//HP、攻撃、防御
    chkBuff_team_Ex();		//特殊強化
    chkBuff_team_Melee();	//近接
    chkBuff_team_Class();	//職別

    //スキルバフ
    chkBuff_skill_Increase();
    chkBuff_skill_EnemyDecrease();
    
    //その他バフ類
    chkBuff_other();
}

function incBuffHp(sid, val){ bclass[sid].bufhp += val; }
function incBuffAtk(sid, val){ bclass[sid].bufatk += val; }
function incBuffDef(sid, val){ bclass[sid].bufdef += val; }
function incBuffResi(sid, val){ bclass[sid].bufresi += val; }

function chkBuff_other(){
	var oBuf = otherBuff;

	//チェックon/offで表現できるものとかダンサー等のカテゴリ分けしにくいもの
    oBuf.bonus = toNum($('input[name="bonus"]:checked').val()); 
    oBuf.enchant = $('#op_enchant').prop('checked');
    oBuf.danceatk = $('#op_dance').prop('checked') * $('#dance_atk').val();
    oBuf.dancedef = $('#op_dance').prop('checked') * $('#dance_def').val();
    oBuf.areaatk = $('#op_areaAtk').prop('checked') * $('#areaAtk').val() / 100;
    oBuf.areadef = $('#op_areaDef').prop('checked') * $('#areaDef').val() / 100;
    oBuf.mahoken = toNum($('input[name="op_mahoken"][type="radio"]:checked').val());

    if(oBuf.areaatk === 0){ oBuf.areaatk = 1; }
    if(oBuf.areadef === 0){ oBuf.areadef = 1; }

    oBuf.olivie = $('#op_olivie').prop('checked');
    oBuf.sherry = $('#op_sherry').prop('checked');
    oBuf.hikage = $('#op_hikage').prop('checked');
    oBuf.rosette = $('#inc_rosette').prop('checked');
}

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
    //bUnitsを作るところで再確認);

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
	var sBuf = skillbuffs;
	
    var prince = toNum($('input[name="op_prince"][type="radio"]:checked').val());

    var inchp = 1;
    var incatk = toNum($('#incatk').html());
    var incdef = toNum($('#incdef').html());
    var incpro = toNum($('#incpro').html());
    var incresi = 1;
    var addresi = 0;

    var dmgcutmat = 1;
    var dmgcutmag = toNum($('#dmgcut_mag').html());

    var incrosette = toNum($('#inc_rosette').val());

    sBuf.prince = prince;
    sBuf.inchp = inchp;
    sBuf.incatk = incatk;
    sBuf.incdef = incdef;
    sBuf.incpro = incpro;
    sBuf.incresi = incresi;
    sBuf.addresi = addresi;
    sBuf.dmgcutmat = dmgcutmat;
    sBuf.dmgcutmag = dmgcutmag;
    sBuf.incrosette = incrosette;
}

function chkBuff_skill_EnemyDecrease(){
	var sBuf = skillbuffs;
	
    var emydebatk = toNum($('#emy_debatk').html());
    var emydebmat = toNum($('#emy_debmat').html());
    var emydebdef = toNum($('#emy_debdef').html());
    var emydebresi = toNum($('#emy_debresi').html());

    sBuf.emydebatk = emydebatk;
    sBuf.emydebmat = emydebmat;
    sBuf.emydebdef = emydebdef;
    sBuf.emydebresi = emydebresi;
}

function make_bunits(){
    //グローバル変数の参照(速度向上)
    var mode = gl_mode;
    var enemy = gl_enemy;
    var oBuf = otherBuff;
    var sBuf = skillbuffs;

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

    bunits = Enumerable.From(fil_units).Select(function(x){
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
                row_def = Math.floor(row_def * pripro * row.incdef * skill.incdef);
                tempdef = row_def * 2;
                row_def = Math.floor(row_def * oBuf.areadef);
                row_def += oBuf.dancedef;

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
                        row_def = Math.floor(row_def * pripro * row.incdef * skill.incdef);
                        tempdef = row_def * 1.5;
                        row_def = Math.floor(row_def * oBuf.areadef);
                        row_def += oBuf.dancedef;
                        
                        //被ダメ(通常)の計算と被ダメ決定
                        dmgmax = Math.ceil((row_defAtk - row_def) * row.cutmat * skill.cutmat);
                        dmgmax = (dmgmax <= dmglimit)? dmglimit : dmgmax;

                        //耐久チェック
                        if(x.sid === 115 && x.cc === 2){
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
                reqAtk -= oBuf.danceatk;
                
                reqLv = Math.ceil(reqAtk / oBuf.areaatk);
                reqLv = Math.ceil(reqLv / (row.prince * row.incatk * skill.incatk * row.incatksp));
                reqLv = Math.ceil(Math.ceil(reqLv / row.bufatk) / row.quadra);
                reqLv = Math.ceil(reqLv - (x.atk + row.bonusatk));
                reqLv = Math.ceil(reqLv / divatk) + 1;

                if(reqLv <= 0){ reqLv = x.lv; }

                if((x.lvmax < reqLv) && (row.atktype === 1)){
                    //餅つき計算
                    reqAtk = Math.ceil(enemy.hp / enemy.cnt) * 10;

                    reqLv = Math.ceil(reqAtk / (row.prince * row.incatk * skill.incatk * row.incatksp));
                    reqLv = Math.ceil(Math.ceil(reqLv / row.bufatk) / row.quadra);
                    reqLv = Math.ceil(reqLv - (x.atk + row.bonusatk));
                    reqLv = Math.ceil(reqLv / divatk) + 1;
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
                row_atk = Math.floor(row_atk * row.prince * row.incatk * skill.incatk * row.incatksp);
            	row_atk = Math.floor(row_atk * oBuf.areaatk);
            	row_atk += oBuf.danceatk;
                
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
                
                if(mode === 'atk' && enemy.mode === 'time'){
                    data = dmgcalc(x, row, x.lvmax, (useSkill)? x.s_lvmax: 0);
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
             sid:x.sid, id:x.id, uid:x.uid, clas:x.clas, name:x.name
            ,rare:x.rare, cc:x.cc, noncc:x.noncc, lv:x.lv, lvmax:x.lvmax
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
            ,s_ctmin:x.s_ctmin, s_ctmax:x.ctmax

            /*
            ,prince:sBuf.prince
            ,bufhp:row.bufhp, bufatk:row.bufatk, bufdef:row.bufdef, bufresi:row.bufresi
            ,inchp:sBuf.inchp, incatk:sBuf.incatk, incdef:sBuf.incdef, incpro:sBuf.incpro,  incresi:sBuf.incresi
            ,dmgcutmat:sBuf.cutmat, dmgcutmag:sBuf.cutmag, incrosette:sBuf.incrosette
            ,emydebatk:sBuf.emydebatk, emydebdef:sBuf.emydebdef, emydebresi:sBuf.emydebresi
            ,emydebmat:sBuf.emydebmat
            */
            ,reqlv:reqLv, dps:dps
        };
    })
        .ToArray();
}

function dmgcalc(unit, row, lv, slv){
	var enemy = gl_enemy;
	var oBuf = otherBuff;
	var sBuf = skillbuffs;
	var skill = [];

	var incatksp, s_incatksp;
	
	if(isNaN(slv)){ slv = 0; }
	var slvmax = unit.s_lvmax;
	
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
    } else {
    	skill.inchp = unit.s_inchp + (unit.s_inchpmax - unit.s_inchp) / (slvmax - 1) * (slv - 1);
        skill.incatk = unit.s_incatk + (unit.s_incatkmax - unit.s_incatk) / (slvmax - 1) * (slv - 1);
        skill.incdef = unit.s_incdef + (unit.s_incdefmax - unit.s_incdef) / (slvmax - 1) * (slv - 1);
        skill.incpro = unit.s_incpro + (unit.s_incpromax - unit.s_incpro) / (slvmax - 1) * (slv - 1);
        skill.incresi = unit.s_incresi + (unit.s_incresimax - unit.s_incresi) / (slvmax - 1) * (slv - 1);
        skill.addresi = unit.s_addresi + (unit.s_addresimax - unit.s_addresi) / (slvmax - 1) * (slv - 1);
        skill.dmgcut = unit.s_dmgcutmax - (unit.s_dmgcut - unit.s_dmgcutmax) / (slvmax - 1) * (slv - 1);
        skill.cutmat = unit.s_dmgcutmat - (unit.s_dmgcutmat - unit.s_dmgcutmatmax) / (slvmax - 1) * (slv - 1);
        skill.cutmag = unit.s_dmgcutmag - (unit.s_dmgcutmag - unit.s_dmgcutmagmax) / (slvmax - 1) * (slv - 1);
        skill.debatk = unit.s_enemyatkmax - (unit.s_enemyatkmax - unit.s_enemyatkmin) / (slvmax - 1) * (slv - 1);
        skill.debmat = unit.s_enemymatmax - (unit.s_enemymatmax - unit.s_enemymatmin) / (slvmax - 1) * (slv - 1);
        skill.debdef = unit.s_enemydefmax - (unit.s_enemydefmax - unit.s_enemydefmin) / (slvmax - 1) * (slv - 1);
        skill.debresi = unit.s_enemyresimax - (unit.s_enemyresimax - unit.s_enemyresimin) / (slvmax - 1) * (slv - 1);
    }
    skill.quadra = unit.s_quadra;
    skill.spatk = unit.s_specialatk;
    skill.incatksp = unit.s_incatksp;
    skill.atktype = unit.s_atktype;
    
    //特攻の整理
    incatksp = $.inArray(enemy.sp, [unit.specialatk, unit.specialatk2]);
    if(incatksp !== -1){ incatksp = unit.incatksp; }
    else {incatksp = 1; }
    s_incatksp = (enemy.sp === unit.s_specialatk)? unit.s_incatksp: 1;
    
	var pat = /猛将の鼓舞|烈火の陣|猛火の陣|鉄壁の陣|金城の陣|プロテクション|聖女の結界|聖なるオーラ|聖霊の護り|マジックバリア|暗黒オーラ|軟化の秘術|レヴァンテイン|ダモクレスの剣/;
    var mat = unit.skill.match(pat);
    if(mat !== null){
        switch(mat[0]){
            case '猛将の鼓舞':
            case '烈火の陣':
            case '猛火の陣':
            	//通常の計算とは違い、自身の方が弱ければ上書きする
            	//※スキルon/offで計算式を変えるため
                if(sBuf.incatk >= skill.incatk){ skill.incatk = 1; }
                break;
            case 'レヴァンテイン':
                if(sBuf.debresi >= skill.debresi){ skill.debresi = 1; }
                break;
            case 'ダモクレスの剣':
                if(sBuf.incrosette >= skill.incatk){ skill.incatk = 1; skill.incdef = 1; }
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
	s_atk = Math.floor(n_atk * sBuf.prince * sBuf.incatk * skill.incatk * s_incatksp);
	s_atk = Math.floor(s_atk * oBuf.areaatk);
	s_atk += oBuf.danceatk;
	
	n_atk = Math.floor(n_atk * sBuf.prince * sBuf.incatk * incatksp);
	n_atk = Math.floor(n_atk * oBuf.areaatk);
	n_atk += oBuf.danceatk;

	if(unit.atktype === 1 && !oBuf.enchant){
		row_def = Math.ceil(enemy.def * sBuf.emydebdef);
		dmg = n_atk - row_def;
		if(dmg < Math.floor(n_atk/10)){ n_dmg = Math.floor(n_atk/10); }
		else { n_dmg = dmg; }
	} else if(unit.atktype === 2 || oBuf.enchant){
		row_resi = 1 - Math.ceil(enemy.resi * sBuf.emydebresi) / 100;
		n_dmg = Math.floor(n_atk * row_resi);
	} else if(unit.atktype === 4){
		n_dmg = 0;
	}
	n_dmg *= unit.quadra;
	
	if(unit.s_atktype === 1 || ((unit.atktype === 1 && unit.s_atktype === 0) && !oBuf.enchant)){
		row_def = Math.ceil(enemy.def * sBuf.emydebdef * skill.debdef);
		dmg = s_atk - row_def;
		if(dmg < Math.floor(s_atk/10)){ s_dmg = Math.floor(s_atk/10); }
		else { s_dmg = dmg; }
	} else if(unit.s_atktype === 2 || (unit.atktype === 2 && unit.s_atktype === 0) || oBuf.enchant){
		row_resi = 1 - Math.ceil(enemy.resi * sBuf.emydebresi * skill.debresi) / 100;
		s_dmg = Math.floor(s_atk * row_resi);
	} else if(unit.s_atktype === 4){
		s_dmg = 0;
	}
	if(unit.s_quadra !== 0){ s_dmg *= unit.s_quadra; }
	else { s_dmg *= unit.quadra; }
	
    var data = {
		reqhp:enemy.hp, reqlv: 999,
		dmg:0, n_dmg:n_dmg, s_dmg:s_dmg,
        time:enemy.time * 30, s_time:unit.s_timemax * 30, ct:unit.s_ctmin * 30,
        motion:unit.motion, wait:unit.wait,
        s_motion:unit.s_motion, s_wait:unit.s_wait
        ,s_atk:s_atk,n_atk:n_atk
    };
    
    if(slv > 0){
        while(data.time > data.s_motion){
            dmgcalc_skill(data);
            dmgcalc_noskill(data, true);
        }
    } else {
        while(data.time > data.motion){
            dmgcalc_noskill(data, false);
        }
    }
    
    if(data.dmg >= data.reqhp){
    	data.reqlv = unit.lvmax;
    } else {
    	data.reqlv = 999;
    }
    
    return data;
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
    str += ', teambuff:$.teambuff';
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


function setRowBuffs(unit, row, skill, useSkill, slv){
	//グローバル変数の参照(速度向上)
    var enemy = gl_enemy;
    var sBuf = skillbuffs;
    var oBuf = otherBuff;
    var mat;
    
    //各行毎の補正値等
    row.prince = sBuf.prince;
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

    if(useSkill){
    	//スキル分類ごとに分けるため、正規表現でパターン化
        var pat = /猛将の鼓舞|烈火の陣|猛火の陣|鉄壁の陣|金城の陣|プロテクション|聖女の結界|聖なるオーラ|聖霊の護り|マジックバリア|暗黒オーラ|軟化の秘術|レヴァンテイン|ダモクレスの剣/;
        
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
        } else {
        	skill.inchp = unit.s_inchp + (unit.s_inchpmax - unit.s_inchp) / (unit.s_lvmax - 1) * (slv - 1);
            skill.incatk = unit.s_incatk + (unit.s_incatkmax - unit.s_incatk) / (unit.s_lvmax - 1) * (slv - 1);
            skill.incdef = unit.s_incdef + (unit.s_incdefmax - unit.s_incdef) / (unit.s_lvmax - 1) * (slv - 1);;
            skill.incpro = unit.s_incpro + (unit.s_incpromax - unit.s_incpro) / (unit.s_lvmax - 1) * (slv - 1);;
            skill.incresi = unit.s_incresi + (unit.s_incresimax - unit.s_incresi) / (unit.s_lvmax - 1) * (slv - 1);;
            skill.addresi = unit.s_addresi + (unit.s_addresimax - unit.s_addresi) / (unit.s_lvmax - 1) * (slv - 1);;
            skill.dmgcut = unit.s_dmgcutmax - (unit.s_dmgcut - unit.s_dmgcutmax) / (unit.s_lvmax - 1) * (slv - 1);;
            skill.cutmat = unit.s_dmgcutmat - (unit.s_dmgcutmat - unit.s_dmgcutmatmax) / (unit.s_lvmax - 1) * (slv - 1);;
            skill.cutmag = unit.s_dmgcutmag - (unit.s_dmgcutmag - unit.s_dmgcutmagmax) / (unit.s_lvmax - 1) * (slv - 1);;
            skill.debatk = unit.s_enemyatkmax - (unit.s_enemyatkmax - unit.s_enemyatkmin) / (unit.s_lvmax - 1) * (slv - 1);;
            skill.debmat = unit.s_enemymatmax - (unit.s_enemymatmax - unit.s_enemymatmin) / (unit.s_lvmax - 1) * (slv - 1);;
            skill.debdef = unit.s_enemydefmax - (unit.s_enemydefmax - unit.s_enemydefmin) / (unit.s_lvmax - 1) * (slv - 1);;
            skill.debresi = unit.s_enemyresimax - (unit.s_enemyresimax - unit.s_enemyresimin) / (unit.s_lvmax - 1) * (slv - 1);;
            skill.time = unit.s_timemin + (unit.s_timemax - unit.s_timemin) / (unit.s_lvmax - 1) * (slv - 1);
        }
        skill.quadra = unit.s_quadra;
        skill.spatk = unit.s_specialatk;
        skill.incatksp = unit.s_incatksp;
        skill.atktype = unit.s_atktype;
        row.motion = unit.s_motion;
        row.wait = unit.s_wait;
        
        mat = unit.skill.match(pat);
        if(mat !== null){
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
                case '軟化の秘術':
                    if(row.debdef <= skill.debdef){ skill.debdef = 1; }
                    else { row.debdef = 1; }
                    break;
                case 'レヴァンテイン':
                    if(row.debresi <= skill.debresi){ skill.debresi = 1; }
                    else { row.debresi = 1; }
                    break;
                case 'ダモクレスの剣':
                    if(row.incrosette <= skill.incatk){ row.incrosette = skill.incatk; }
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
    row.bufhp += bclass[unit.sid].bufhp;
    row.bufatk += bclass[unit.sid].bufatk;
    row.bufdef += bclass[unit.sid].bufdef;
    row.bufresi += bclass[unit.sid].bufresi;
    
    //特殊バフ(エキドナ、エステル、ルビナスは実質的に職バフ)
    if(oBuf.olivie && ((unit.type === 2) || (unit.type === 3))){ row.bufhp += 0.15; }
    if(oBuf.sherry && (unit.rare <= 4)){ row.bufhp += 0.05; bufatk += 0.05; row.bufdef += 0.05; }
    if(oBuf.hikage && ((unit.id === 105171) || (unit.id === 105271))){ row.bufatk += 0.1; row.bufdef +=0.1;}

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
    
    //編成バフ持ち自身に対する適用
    var name = /アイシャ|アデル|アネリア|アリア|アルティア|イザベル|イメリア|イリス|ウズメ|エキドナ|エステル|オリヴィエ|カティナ|ガラニア|キキョウ|グレース|ケイティ|コジュウロウ|コンラッド|サビーネ|シズカ|スピカ|ダリア|ピピン|ベリンダ|ベルニス|マツリ|ミランダ|ユーノ|リン|ルイーズ|ルビナス|レン/;

    if(unit.teambuff === 1){
        mat = unit.name.match(name);
    	switch(mat[0]){
	    	case 'アイシャ':
	    		temp = $('#op_hp3');
	    		if(!temp.prop('checked')){ row.bufhp += toNum(temp.val()); }
	    		break;
	    	case 'アデル':
	    		temp = $('#op_hp2');
	    		if(!temp.prop('checked')){ row.bufhp += toNum(temp.val()); }
	    		break;
	    	case 'アネリア':
	    		temp = $('#205atk');
	    		if(!temp.prop('checked')){ row.bufatk += toNum(temp.val()); }
	    		break;
	    	case 'アリア':
	    		temp = $('#op_atk1');
	    		if(!temp.prop('checked')){ row.bufatk += toNum(temp.val()); }
	    		break;
	    	case 'アルティア':
	    		temp = $('#101hp');
	    		if(!temp.prop('checked')){ row.bufhp += toNum(temp.val()); }
	    		break;
	    	case 'イザベル':
	    		temp = $('#114atk');
	    		if(!temp.prop('checked')){ row.bufatk += toNum(temp.val()); }
	    		break;
	    	case 'イメリア':
	    		temp = $('#108hp');
	    		if(!temp.prop('checked')){ row.bufhp += toNum(temp.val()); }
	    		break;
	    	case 'イリス':
	    		temp = $('#op_def3');
	    		if(!temp.prop('checked')){ row.bufdef += toNum(temp.val()); }
	    		break;
	    	case 'ウズメ':
	    		temp = $('#op_atk2');
	    		if(!temp.prop('checked')){ row.bufatk += toNum(temp.val()); }
	    		break;
	    	case 'エキドナ':
	    		temp = $('#op_ekidona');
	    		if(!temp.prop('checked')){
	    			row.bufhp += 0.05;
	    			row.bufdef += 0.05;
    			}
	    		break;
	    	case 'エステル':
	    		temp = $('#op_ester');
	    		if(!temp.prop('checked')){ row.bufatk += 0.05; }
	    		break;
	    	case 'オリヴィエ':
	    		temp = $('#op_olivie');
	    		if(!temp.prop('checked')){ row.bufhp += 0.15; }
	    		break;
	    	case 'カティナ':
	    		temp = $('#127atk');
	    		if(!temp.prop('checked')){ row.bufatk += toNum(temp.val()); }
	    		break;
	    	case 'ガラニア':
	    		temp = $('#202atk');
	    		if(!temp.prop('checked')){ row.bufatk += toNum(temp.val()); }
	    		break;
	    	case 'キキョウ':
	    		temp = $('#op_atk3');
	    		if(!temp.prop('checked')){ row.bufatk += toNum(temp.val()); }
	    		break;
	    	case 'グレース':
	    		temp = $('#op_grace');
	    		if(!temp.prop('checked')){ row.bufresi += 10; }
	    		break;
	    	case 'ケイティ':
	    		temp = $('#op_def1');
	    		if(!temp.prop('checked')){ row.bufdef += toNum(temp.val()); }
	    		break;
	    	case 'コジュウロウ':
	    		temp = $('#112def');
	    		if(!temp.prop('checked')){ row.bufdef += toNum(temp.val()); }
	    		break;
	    	case 'コンラッド':
	    		temp = $('#108atk');
	    		if(!temp.prop('checked')){ row.bufatk += toNum(temp.val()); }
	    		break;
	    	case 'サビーネ':
	    		temp = $('#119atk');
	    		if(!temp.prop('checked')){ row.bufatk += toNum(temp.val()); }
	    		break;
	    	case 'シズカ':
	    		temp = $('#112atk');
	    		if(!temp.prop('checked')){ row.bufatk += toNum(temp.val()); }
	    		break;
	    	case 'スピカ':
	    		temp = $('#201atk');
	    		if(!temp.prop('checked')){ row.bufatk += toNum(temp.val()); }
	    		break;
	    	case 'ダリア':
	    		temp = $('#103atk');
	    		if(!temp.prop('checked')){ row.bufatk += toNum(temp.val()); }
	    		break;
	    	case 'ピピン':
	    		temp = $('#213atk');
	    		if(!temp.prop('checked')){ row.bufatk += toNum(temp.val()); }
	    		break;
	    	case 'ベリンダ':
	    		temp = $('#204atk');
	    		if(!temp.prop('checked')){ row.bufatk += toNum(temp.val()); }
	    		break;
	    	case 'ベルニス':
	    		temp = $('#102def');
	    		if(!temp.prop('checked')){ row.bufdef += toNum(temp.val()); }
	    		break;
	    	case 'マツリ':
	    		temp = $('#op_matsuri');
	    		if(!temp.prop('checked')){
	    			row.bufhp += 0.05;
	    			row.bufatk += 0.05;
	    			row.bufdef += 0.05;
    			}
	    		break;
	    	case 'ミランダ':
	    		temp = $('#102atk');
	    		if(!temp.prop('checked')){ row.bufatk += toNum(temp.val()); }
	    		break;
	    	case 'ユーノ':
	    		temp = $('#203atk');
	    		if(!temp.prop('checked')){ row.bufatk += toNum(temp.val()); }
	    		break;
	    	case 'リン':
	    		temp = $('#117atk');
	    		if(!temp.prop('checked')){ row.bufatk += toNum(temp.val()); }
	    		break;
	    	case 'ルイーズ':
	    		temp = $('#op_louise');
	    		if(!temp.prop('checked')){ row.bufdef += toNum(temp.val()); }
	    		break;
	    	case 'ルビナス':
	    		temp = $('#op_lubinus');
	    		if(!temp.prop('checked')){ row.bufatk += 0.07; }
	    		break;
	    	case 'レン':
	    		temp = $('#op_def2');
	    		if(!temp.prop('checked')){ row.bufdef += toNum(temp.val()); }
	    		break;
    	}
    }
}