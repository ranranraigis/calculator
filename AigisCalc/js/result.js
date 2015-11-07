
$('body').on('change', 'select[id*=lv_]', lv_Change);

function setLv(que){
    que.forEach(function(rows){
        changeLv(rows.id);
    });
}

function lv_Change(){
    var id = $(this).attr('id');
    id = id.substr(-6);
    changeLv(id);
}

function changeLv(id){
    var emyatk_row, emydef_row, emyresi_row;
    var hp, atk, def, resi, dmg, dps;
    
    var enemy = gl_enemy;
    
    var lvmax;
    var spatk, spatk2, incatksp;
    var atktype, quadra;
    var motion, wait;
    
    var slvmax;
    var s_spatk, s_incatksp;
    var s_atktype, s_quadra;
    
    var prince, incrosette;
    var inchp, incatk, incdef, incpro, incresi, addresi;
    var cutmat, cutmag, emydebatk, emydebdef, emydebresi;
    var emydebmat;
    
    var s_inchp, s_incatk, s_incdef, s_incpro, s_incresi, s_addresi;
    var s_cutmat, s_cutmag, s_emydebatk, s_emydebdef, s_emydebresi;
    var s_emydebmat;
    var s_time, s_timemin, s_timemax, s_dmg, s_cnt;
    var s_ct, s_ctmin, s_ctmax;
    var n_dmg;
    
    var lv = toNum($('#lv_' + id).val());
    var slv = toNum($('#slv_' + id).val());

    var pat = /猛将の鼓舞|烈火の陣|猛火の陣|鉄壁の陣|金城の陣|プロテクション|聖女の結界|聖なるオーラ|聖霊の護り|マジックバリア|暗黒オーラ|軟化の秘術|レヴァンテイン|ダモクレスの剣/;

    var que = Enumerable.From(bunits)
    .Where('$.id == ' + id)
    .Select(function(x){
        slvmax = toNum(x.s_lvmax);
        if(slvmax === 1 && slv === 1){
            //0div用の緊急回避
            slvmax = 2; slv = 2;
        }

        prince = x.prince;
        inchp = x.inchp, incatk = x.incatk, incdef = x.incdef, incpro = x.incpro;
        incresi = x.incresi, incrosette = x.incrosette;
        cutmat = x.dmgcutmat, cutmag = x.dmgcutmag;
        emydebatk = x.emydebatk, emydebdef = x.emydebdef, emydebresi = x.emydebresi;
        emydebmat = x.emydebmat;
        atktype = x.atktype, quadra = x.quadra;
        spatk = x.specialatk, spatk2 = x.specialatk2;
        incatksp = x.incatksp;
        motion = x.motion, wait = x.wait;
        
        if(slv > 0){
            if(slvmax === 1){ slvmax = 2; slv = 2; }
            
            s_inchp = x.s_inchp + (x.s_inchpmax - x.s_inchp) / (slvmax - 1) * (slv - 1);
            s_incatk = x.s_incatk + (x.s_incatkmax - x.s_incatk) / (slvmax - 1) * (slv - 1);
            s_incdef = x.s_incdef + (x.s_incdefmax - x.s_incdef) / (slvmax - 1) * (slv - 1);
            s_incpro = x.s_incpro + (x.s_incpromax - x.s_incpro) / (slvmax - 1) * (slv - 1);
            s_addresi = x.s_addresi + (x.s_addresimax - x.s_addresi) / (slvmax - 1) * (slv - 1);
            s_incresi = x.s_incresi + (x.s_incresimax - x.s_incresi) / (slvmax - 1) * (slv - 1);
            s_cutmat = x.s_dmgcutmat + (x.s_dmgcutmatmax - x.s_dmgcutmat) / (slvmax - 1) * (slv - 1);
            s_cutmag = x.s_dmgcutmag + (x.s_dmgcutmagmax - x.s_dmgcutmag) / (slvmax - 1) * (slv - 1);
            s_emydebatk = x.s_enemyatkmax - (x.s_enemyatkmax - x.s_enemyatkmin) / (slvmax - 1) * (slv - 1);
            s_emydebmat = x.s_enemymatmax - (x.s_enemymatmax - x.s_enemymatmin) / (slvmax - 1) * (slv - 1);
            s_emydebdef = x.s_enemydefmax - (x.s_enemydefmax - x.s_enemydefmin) / (slvmax - 1) * (slv - 1);
            s_emydebresi = x.s_enemyresimax - (x.s_enemyresimax - x.s_enemyresimin) / (slvmax - 1) * (slv - 1);
            s_atktype = x.s_atktype, s_quadra = x.s_quadra;
            s_spatk = x.s_specialatk, s_incatksp = x.s_incatksp;
            motion = x.s_motion, wait = x.s_wait;
            s_timemin = x.s_timemin, s_timemax = x.s_timemax;
            s_ctmin = x.s_ctmin, s_ctmax = x.s_ctmax;
            
            if(s_timemin === s_timemax){
                s_time = s_timemin;
            } else {
                s_time = s_timemin + (s_timemax - s_timemin) / (slvmax - 1) * (slv - 1);
            }
            
            if(s_ctmin === s_ctmax){
            	s_ct = s_ctmin;
            } else {
            	s_ct = s_ctmin + (s_ctmax - s_ctmin) / (slvmax - 1) * (slv - 1);
            }
            
            if(s_spatk !== enemy.sp){
                s_incatksp = 1;
            }

            var mat = x.skill.match(pat);
            if(mat !== null){
                switch(mat[0]){
                    case '猛将の鼓舞':
                    case '烈火の陣':
                    case '猛火の陣':
                        if(incatk < s_incatk){ incatk = 1; } else { s_incatk = 1; }
                        break;
                    case '鉄壁の陣':
                    case '金城の陣':
                        if(incdef <= s_incdef){ incdef = 1; } else { s_incdef = 1; }
                        break;
                    case 'プロテクション':
                    case '聖女の結界':
                        if(incpro <= s_incpro){ incpro = 1; } else { s_incpro = 1; }
                        break;
                    case '聖なるオーラ':
                    case '聖霊の護り':
                    	if(emydebmat <= s_emydebmat){ s_emydebmat = 1; } else { emydebmat = 1; }
                        //if(cutmat <= s_cutmat){ s_cutmat = 1; } else { cutmat = 1; }
                        break;
                    case 'マジックバリア':
                        if(cutmag <= s_cutmag){ s_cutmag = 1; } else { cutmag = 1; }
                        break;
                    case 'カースボイス':
                    case '暗黒オーラ':
                    case '聖霊の護り':
                        if(emydebatk <= s_emydebatk){ s_emydebatk = 1; } else { emydebatk = 1; }
                        break;
                    case '軟化の秘術':
                        if(emydebdef <= s_emydebdef){ s_emydebdef = 1; } else { emydebdef = 1; }
                        break;
                    case 'レヴァンテイン':
                        if(emydebresi <= s_emydebresi){ s_emydebresi = 1; } else { emydebresi = 1; }
                        break;
                    case 'ダモクレスの剣':
                        if(incrosette < s_incatk){ incrosette = s_incatk; }
                        break;
                    default:
                        //if(inchp <= s_inchp){ inchp = s_inchp;} else { s_inchp = 1; }
                        //if(incresi <= s_incresi){ incresi = s_incresi; } else { s_incresi = 1; }
                        break;
                }
            }

        } else {
            s_inchp = 1;
            s_incatk = 1;
            s_incdef = 1;
            s_incpro = 1;
            s_addresi = 0;
            s_incresi = 1;            
            s_emydebatk = 1;
            s_emydebmat = 1;
            s_emydebdef = 1;
            s_emydebresi = 1;
            s_cutmat = 1;
            s_cutmag = 1;
            s_quadra = 0;
            s_atktype = 0;
            s_spatk = 0;
            s_incatksp = 1;
            s_time = 999;
        }
        //暫定。bunits計算と同様、ロゼットは全体バフと重複不可。
        //重複可能の場合は後の計算にincrosetteを追加する
        //銀の時以外はincrosette_row = 1にしてあるのでレアチェックはしない
        if(incatk <= incrosette){ incatk = incrosette; }
        if(incdef <= incrosette){ incdef = incrosette; }
        //特攻
        if((spatk !== enemy.sp) && (spatk2 !== enemy.sp)){
            incatksp = 1;
        }
        
        //エンチャンター - マジックウェポン
        if(otherBuff.enchant && atktype === 1){ atktype = 2; }
        
        lvmax = x.lvmax;
        if(lv === lvmax){
            hp = x.hpmax + x.bonushp;
            atk = x.atkmax + x.bonusatk;
            def = x.defmax + x.bonusdef;
        } else {
            hp = x.hp + x.bonushp + Math.floor((x.hpmax - x.hp) / (lvmax - 1) * (lv - 1));
            atk = x.atk + x.bonusatk + Math.floor((x.atkmax - x.atk) / (lvmax - 1) * (lv - 1));
            def = x.def + x.bonusdef + Math.floor((x.defmax - x.def) / (lvmax - 1) * (lv - 1));
        }
        
        hp = Math.floor(hp * x.bufhp);
        hp = Math.floor(hp * inchp * s_inchp);

        atk = Math.floor(atk * x.bufatk);
        n_atk = atk;
        atk = Math.floor(atk * incatk * prince * s_incatk * incatksp * s_incatksp);
        atk = Math.floor(atk * otherBuff.areaatk);
        atk += otherBuff.danceatk;
        
        def = Math.floor(def * x.bufdef);
        if((prince < incpro) || (prince < s_incpro)){
            def = Math.floor(def * incdef * incpro * s_incpro * s_incdef);
        } else {
            def = Math.floor(def * incdef * prince * s_incdef);
        }
       
        def = Math.floor(def * otherBuff.areadef);
        def += otherBuff.dancedef;

        resi = x.resi + x.bonusresi + x.bufresi;
        resi = Math.floor(resi + s_addresi);
        resi = Math.floor(resi * incresi * s_incresi);

        if(mode === 'atk' || mode === 'mix' || enemy.mode === 'time'){
            if(s_quadra !== 0){ quadra = s_quadra; }
            if(s_atktype !== 0){ atktype = s_atktype; }
            
            emydef_row = Math.ceil(enemy.def * emydebdef * s_emydebdef);
            emyresi_row = 1 - Math.ceil(enemy.resi * emydebresi * s_emydebresi) / 100;
            
            if(atktype === 1){
                dmg = atk - emydef_row;
                if(dmg <= atk/10){ dmg = Math.floor(atk/10); }
            } else if(atktype === 2){
                dmg = Math.floor(atk * emyresi_row);
                if(dmg === 0){ dmg = 1; }
            } else if(atktype === 3){
                dmg = atk;
            } else if(atktype === 4){
                dmg = 0;
            }
            dmg *= quadra;

            if(atktype < 4){
                dps = dmg * 30 / (motion + wait);
                dps = rounds(dps, 2);
            } else {
                dps = 0;
            }
            
            if(enemy.mode === 'time'){
            	var n_atk, s_atk;
            	var row_def, row_resi;
            	
            	s_atk = Math.floor(n_atk * incatk * prince * s_incatk * incatksp * s_incatksp);
                s_atk = Math.floor(s_atk * otherBuff.areaatk);
                s_atk += otherBuff.danceatk;
                
                n_atk = Math.floor(n_atk * incatk * prince * incatksp);
                n_atk = Math.floor(n_atk * otherBuff.areaatk);
                n_atk += otherBuff.danceatk;
                
                if(x.atktype === 1 && !otherBuff.enchant){
                	emydef_row = Math.ceil(enemy.def * emydebdef);
                	n_dmg = n_atk - emydef_row;
                	if(n_dmg < Math.floor(n_atk/10)){ n_dmg = Math.floor(n_atk/10); }
                } else if(x.atktype === 2 || otherBuff.enchant){
                	emyresi_row = 1 - Math.ceil(enemy.resi * emydebresi) / 100;
                	n_dmg = n_atk * emyresi_row;
                } else if(x.atktype === 4){
                	n_dmg = 0;
                }
            	n_dmg *= x.quadra;

            	if(x.s_atktype === 1 || ((x.atktype === 1 && x.s_atktype === 0) && !otherBuff.enchant)){
            		row_def = Math.ceil(enemy.def * emydebdef * s_emydebdef);
            		s_dmg = s_atk - row_def;
            		if(s_dmg < Math.floor(s_atk/10)){ s_dmg = Math.floor(s_atk/10); }
            	} else if(x.s_atktype === 2 || (x.atktype === 2 && x.s_atktype === 0) || otherBuff.enchant){
            		row_resi = 1 - Math.ceil(enemy.resi * emydebresi * s_emydebresi) / 100;
            		s_dmg = Math.floor(s_atk * row_resi);
            	} else if(x.s_atktype === 4){
            		s_dmg = 0;
            	}
        		if(x.s_quadra !== 0){ s_dmg *= x.s_quadra; }
        		else { s_dmg *= x.quadra; }
        		
                var data = {
            		reqhp: enemy.hp, reqLv: 999,
            		dmg: 0, n_dmg: n_dmg, s_dmg: s_dmg,
                    time: enemy.time * 30, s_time: s_time * 30, ct: s_ct * 30,
                    motion: x.motion, wait: x.wait,
                    s_motion: x.s_motion, s_wait: x.s_wait,
                    lvmax: lvmax
                };
                dmgcalc(data, (slv > 0));
                
                s_dmg = data.dmg;
            } else {
	            if(slv > 0){
	                s_time *= 30;
	                if((motion + wait) !== 0){
	                    s_cnt = Math.floor(s_time / (motion + wait));
	                    if((s_time - (motion + wait) * s_cnt) >= motion){
	                        s_cnt += 1;
	                    }
	                } else {
	                    s_cnt = 1;
	                }
	                if(s_time === 0){ s_cnt = 1; }
	                
	                s_dmg = dmg * s_cnt;
	            } else {
	                s_dmg = '';
	            }
            }
        } else if(mode === 'def') {
            if(enemy.type === 1){
            	emyatk_row = Math.ceil(enemy.atk * emydebatk * s_emydebatk * emydebmat * s_emydebmat);
                dmg = emyatk_row - def;
                if(dmg <= (emyatk_row/10)){ dmg = Math.floor(emyatk_row/10); }
                dmg = Math.ceil(dmg * cutmat * s_cutmat);
            } else {
            	emyatk_row = Math.ceil(enemy.atk * emydebatk * s_emydebatk);
                dmg = Math.floor(emyatk_row * (1 - resi/100));
                if(dmg === 0){ dmg = 1; }
                dmg = Math.ceil(dmg * cutmag * s_cutmag);
            }
        }
    })
    .ToArray();
    
    if(mode === 'reha'){
    	dmg = '';
    	dps = '';
    	s_dmg = '';
    }
    
    $('#hp_' + id).html(hp);
    $('#atk_' + id).html(atk);
    $('#def_' + id).html(def);
    $('#resi_' + id).html(resi);
    $('#dmg_' + id).html(dmg);
    $('#dps_' + id).html(dps);
    $('#s_dmg_' + id).html(s_dmg);
}

function setQue(que, useSkill){
	var enemy = gl_enemy;
    var rowMax = que.length;
    var trs, tr;
    
    que.forEach(function(rows){
        var id = rows.id;
        tr = '<tr id="row_' + rows.id + '" align="center">';
        
        if(rows.dataerr.trim() !== ''){
            tr += '<td style="color: red;">' + rows.name + '</td>';
            tr += '<td style="color: red;">' + rows.clas + '</td>';
        } else {
            tr += '<td>' + rows.name + '</td>';
            tr += '<td>' + rows.clas + '</td>';
        }
        tr += '<td>' + rar[rows.rare] + '</td>';
        tr += '<td>' + scc[rows.cc] + '</td>';
        tr += '<td>' + makeNumSelect(rows.lv, rows.lvmax, 'lv_' + id, rows.reqlv) + '</td>';
        tr += '<td id="hp_' + id + '"/>' + '</td>';
        tr += '<td id="atk_' + id + '"/>' + '</td>';
        tr += '<td id="def_' + id + '"/>' + '</td>';
        tr += '<td id="resi_' + id + '"/>' + '</td>';
        tr += '<td id="dmg_' + id + '"/>' + '</td>';
        tr += '<td id="dps_' + id + '"/>' + '</td>';
        tr += '<td id="s_dmg_' + id + '"/>' + '</td>';
        tr += '<td>' + rows.skill + '</td>';
        if(rows.skill.trim() !== ''){ 
            tr += '<td>' + makeSkillSel(rows.s_lvmax, 'slv_' + id, useSkill) + '</td>';   
        } else {
            tr += '<td><input type="hidden" value="0" /></td>';
        }
        tr += '</tr>';

        trs += tr;
    });

    var result = que.length + 'ユニットが見つかりました 確認内容:' + $('#chkMode option:selected').text().trim();
    if(mode === 'atk'){
    	result += '(' + atkmode[enemy.mode] + ')';
        result += '　特攻:' + sptype[enemy.sp] + '　ＨＰ:' + enemy.hp + '　防御:' + enemy.def + '　魔耐:' + enemy.resi;
        if(otherBuff.enchant){
            result += '　マジックウェポン:ON';
        } else {
            result += '　マジックウェポン:OFF';
        }
    } else if(mode === 'def'){
        result += '　攻撃:' + enemy.atk + '　属性:' + $('#defType option:selected').text();
    } else if(mode === 'mix'){
        result += '　特攻:' + sptype[enemy.sp] + '　攻撃:' + enemy.atk + '　属性:' + $('#mixType option:selected').text() + '　防御:' + enemy.def + '　魔耐:' + enemy.resi;
    } else if(mode === 'reha'){
    	result += '(' + $('#rehaMode option:selected').text().trim() + ')';
    }
    if(enemy.mode === 'time' && mode === 'atk'){
    	$('#head_sdmg').text('時間計');
    } else {
    	$('#head_sdmg').text('ｽｷﾙ計');
    }
    
    $('#result').html(result);
    $('#outputTable').append(trs);
}

function makeNumSelect(min, max, id, reqlv){
    var sel = '<select id="' + id + '" class="lvsel" >';
    for(i=min; i<=max; i++){
        if(i !== reqlv){
            sel += '<option value="' + i + '">' + i + '</option>';
        } else {
            sel += '<option value="' + i + '" selected >' + i + '</option>';
        }
    }
    sel += '</select>';
    return sel;
}

function makeSkillSel(max, id, useSkill){
    var sel = '<select id="' + id + '" class="slvsel">';
    for(i=0; i<=max; i++){
        if(i === max && useSkill){
            sel += '<option value="' + i + '" selected >' + i + '</option>';
        } else {
            sel += '<option value="' + i + '" >' + i + '</option>';
        }
    }
    sel += '</select>';
    return sel;
}