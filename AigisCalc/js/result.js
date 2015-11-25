$('body').on('change', 'select[id*=lv_]', true, lv_Change);

function setLv(que){
    que.forEach(function(rows){
        changeLv(rows.id);
    });
}

function lv_Change(){
    var id = $(this).attr('id');
    id = id.substr(-7);
    changeLv(id);
    this.focus();
}

function makeNumSelect(min, max, id, reqlv){
    var sel = '<select id="' + id + '" class="lvsel" >';
    for(var i=min; i<=max; i++){
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
    for(var i=0; i<=max; i++){
        if(i === max && useSkill){
            sel += '<option value="' + i + '" selected >' + i + '</option>';
        } else {
            sel += '<option value="' + i + '" >' + i + '</option>';
        }
    }
    sel += '</select>';
    return sel;
}

function setQue(que, useSkill){
	var enemy = gl_enemy;
    var trs, tr;
    
    que.forEach(function(rows){
        var id = rows.id;
        tr = '<tr id="row_' + rows.id + '" align="center">';
        
        if(rows.dataerr.trim() !== ''){
            tr += '<td style="color: red;">' + rows.name + '</td>'
                + '<td style="color: red;">' + rows.clas + '</td>';
        } else {
            tr += '<td>' + rows.name + '</td>'
                + '<td>' + rows.clas + '</td>';
        }
        tr += '<td>' + rar[rows.rare] + '</td>'
	        + '<td>' + scc[rows.cc] + '</td>'
	        + '<td>' + makeNumSelect(rows.lv, rows.lvmax, 'lv_' + id, rows.reqlv) + '</td>';
        
        if(rows.dataerr.match(/hp/)){
    	    tr += '<td id="hp_' + id + '" style="color: red;"/>' + '</td>';
        } else {
    	    tr += '<td id="hp_' + id + '"/>' + '</td>';
        }
        if(rows.dataerr.match(/atk/)){
	        tr += '<td id="atk_' + id + '" style="color: red;"/>' + '</td>';
        } else {
	        tr += '<td id="atk_' + id + '"/>' + '</td>';
        }
        if(rows.dataerr.match(/def/)){
	        tr += '<td id="def_' + id + '" style="color: red;"/>' + '</td>';
        } else {
	        tr += '<td id="def_' + id + '"/>' + '</td>';
        }

        tr += '<td id="resi_' + id + '"/>' + '</td>'
            + '<td id="dmg_' + id + '"/>' + '</td>';
        
        if(rows.dataerr.match(/dps/)){
            tr += '<td id="dps_' + id + '" style="color: red;"/>' + '</td>';
        } else {
            tr += '<td id="dps_' + id + '"/>' + '</td>';
        }
        
        tr += '<td id="s_dmg_' + id + '"/>' + '</td>'
        	+ '<td>' + rows.skill + '</td>';
        
        if(rows.skill.trim() !== ''){ 
            tr += '<td>' + makeSkillSel(rows.s_lvmax, 'slv_' + id, useSkill) + '</td>';   
        } else {
            tr += '<td><input type="hidden" id="slv_' + id + '" value="0" /></td>';
        }
        tr += '</tr>';
        trs += tr;
    });

    var result = que.length + 'ユニットが見つかりました 確認内容:' + $('#chkMode option:selected').text().trim();
    if(gl_mode === 'atk'){
    	result += '(' + atkmode[enemy.mode] + ')';
        result += '　特攻:' + sptype[enemy.sp] + '　ＨＰ:' + enemy.hp + '　防御:' + enemy.def + '　魔耐:' + enemy.resi;
        if(otherBuff.enchant){
            result += '　マジックウェポン:ON';
        } else {
            result += '　マジックウェポン:OFF';
        }
    } else if(gl_mode === 'def'){
        result += '　攻撃:' + enemy.atk + '　属性:' + $('#defType option:selected').text();
    } else if(gl_mode === 'mix'){
        result += '　特攻:' + sptype[enemy.sp] + '　攻撃:' + enemy.atk + '　属性:' + $('#mixType option:selected').text() + '　防御:' + enemy.def + '　魔耐:' + enemy.resi;
    } else if(gl_mode === 'reha'){
    	result += '(' + $('#rehaMode option:selected').text().trim() + ')';
    }
    if(enemy.mode === 'time' && gl_mode === 'atk'){
    	$('#head_sdmg').text('時間計');
    	$('#head_dps').text('時間');
    } else {
    	$('#head_sdmg').text('ｽｷﾙ計');
    	$('#head_dps').text('DPS');
    }
    
    $('#result').html(result);
    $('#outputTable').append(trs);
    tableclone = trs;
}

function changeLv(id){
    var emyatk_row, emydef_row, emyresi_row;
    var hp, atk, def, resi, dmg, dps, s_dmg;
    
    var enemy = gl_enemy;
    var oBuf = otherBuff;
    var row = [];
    var skill = [];
    
    var temp, dkhp, dkdef, dkdmg, dmglimit;
    
    var lv = toNum($('#lv_' + id).val());
    var slv = toNum($('#slv_' + id).val());
    if(isNaN(slv)){ slv = 0; }

    var que = Enumerable.From(bunits)
    .Where('$.id == ' + id)
    .Select(function(x){
    	setRowBuffs(x, row, skill, (slv > 0), slv);

        if(lv === x.lvmax){
            hp = x.hpmax + row.bonushp;
            atk = x.atkmax + row.bonusatk;
            def = x.defmax + row.bonusdef;
        } else {
            hp = x.hp + row.bonushp + Math.floor((x.hpmax - x.hp) / (x.lvmax - 1) * (lv - 1));
            atk = x.atk + row.bonusatk + Math.floor((x.atkmax - x.atk) / (x.lvmax - 1) * (lv - 1));
            def = x.def + row.bonusdef + Math.floor((x.defmax - x.def) / (x.lvmax - 1) * (lv - 1));
        }
        
        hp = Math.floor(hp * row.bufhp);
        hp = Math.floor(hp * row.inchp * skill.inchp);

        atk = Math.floor(atk * row.bufatk);
        if(row.incatksp > 1){
            atk = atk * row.prince * row.incatk * skill.incatk;
            atk += oBuf.danceatk;
            atk = Math.floor(atk * row.incatksp);
            atk = Math.floor(atk * oBuf.areaatk);
        } else {
            atk = Math.floor(atk * row.prince * row.incatk * skill.incatk * row.incatksp);
            atk = Math.floor(atk * oBuf.areaatk);
            atk += oBuf.danceatk;
        }
        
        var pripro = Math.max(row.prince, row.incpro, skill.incpro);
        def = Math.floor(def * row.bufdef);
        def = Math.floor(def * row.incdef * skill.incdef * pripro);
        dkdef = def * 1.5;
        def = Math.floor(def * oBuf.areadef);
        def += oBuf.dancedef;

        resi = x.resi + row.bonusresi + row.bufresi;
        resi = Math.floor(resi + row.addresi + skill.addresi);
        resi = Math.floor(resi * row.incresi * skill.incresi);

        if(gl_mode === 'atk' || gl_mode === 'mix' || enemy.mode === 'time'){
            emydef_row = Math.ceil(enemy.def * row.debdef * skill.debdef);
            emyresi_row = 1 - Math.ceil(enemy.resi * row.debresi * skill.debresi) / 100;
            
            if(row.atktype === 1){
                dmg = atk - emydef_row;
                if(dmg <= atk/10){ dmg = Math.floor(atk/10); }
            } else if(row.atktype === 2){
                dmg = Math.floor(atk * emyresi_row);
                if(dmg === 0){ dmg = 1; }
            } else if(row.atktype === 3){
                dmg = atk;
            } else if(row.atktype === 4){
                dmg = 0;
            }
            dmg *= row.quadra;

            if(row.atktype < 4){
                dps = dmg * 30 / (row.motion + row.wait);
                dps = rounds(dps, 2);
            } else {
                dps = 0;
            }

            //トークン(トラップ)の調整
            if(x.name.match(/トラップ/)){
                dmg = atk;
                dps = '*' + dmg;
            }

            if(enemy.mode === 'time'){
            	var data = dmgcalc(x, row, skill, lv, slv);
                
                if(data.time === Number.POSITIVE_INFINITY){
                    dps = '∞';
                } else {
                    dps = data.time + '秒';
                }

                s_dmg = data.dmg;
            } else {
	            if(slv > 0){
	                skill.time *= 30;
	                if((row.motion + row.wait) !== 0){
	                    var s_cnt = Math.floor(skill.time / (row.motion + row.wait));
	                    if((skill.time - (row.motion + row.wait) * s_cnt) >= row.motion){
	                        s_cnt += 1;
	                    }
	                } else {
	                    s_cnt = 1;
	                }
	                if(skill.time === 0){ s_cnt = 1; }
	                
	                s_dmg = dmg * s_cnt;
	            } else {
	                s_dmg = '';
	            }
            }
            
            //フルガード,スパイクシールドの調整
            if(slv > 0 && (enemy.timemode === 'timeatk' && enemy.time > 0)){
                var pat = /フルガード|スパイクシールド/;
                var mat = x.skill.match(pat);
                if(mat){
                    if(mat[0] === 'スパイクシールド'){
                        var debmat = Math.min(row.debatk, skill.debatk, row.debmat, skill.debmat);
                        emyatk_row = Math.ceil(enemy.atk * debmat);
                        atk = Math.floor(emyatk_row / 2);
                        dmg = atk;
                        
                        atk = '*' + atk;
                        dmg = '*' + dmg;
                        dps = '(*反射)';
                        s_dmg = '(*反射)';
                    } else {
                        atk = 0;
                        dmg = 0;
                    }
                }
            }

        } else if(gl_mode === 'def') {
            if(enemy.type === 1){
            	var debmat = Math.min(row.debatk, skill.debatk, row.debmat, skill.debmat);
            	emyatk_row = Math.ceil(enemy.atk * debmat);
                dmg = emyatk_row - def;
                dmglimit = Math.ceil(Math.ceil(emyatk_row / 10) * row.cutmat * skill.cutmat);
            	dmg = (dmg <= dmglimit)? dmglimit: dmg;
                
                //フルガード,スパイクシールドの調整
                if(slv > 0){
                    var pat = /フルガード|スパイクシールド/;
                    var mat = x.skill.match(pat);
                    if(mat){
                        switch(mat[0]){
                            case 'スパイクシールド':
                                atk = '*' + Math.floor(emyatk_row / 2);
                                break;
                            default:
                                atk = 0;
                                break;
                        }
                    }
                }
            	
            	if(x.sid === 115 && x.cc >= 2){
                	temp = Math.floor(hp / 2);
            		dkhp = hp - dmg;
                    dkdef = Math.floor(dkdef * oBuf.areadef);
                    dkdef += oBuf.dancedef;
                    dkdmg = Math.ceil((emyatk_row - dkdef) * row.cutmat * skill.cutmat);
            		dkdmg = (dkdmg <= dmglimit)? dmglimit: dkdmg;
                    
                    var i = enemy.cnt;
                    while(i > 0){
                    	i -= 1;
                    	if(dkhp <= temp){
                    		dkhp = dkhp - dkdmg * i;
                    		i -= i;
                    	} else {
                    		dkhp = dkhp - dmg;
                    	}
                    }
                    dmg = hp - dkhp;
            	} else{
                    dmg *= enemy.cnt;
            	}
            } else {
            	emyatk_row = Math.ceil(enemy.atk * row.debatk * skill.debatk);
                dmg = Math.ceil(emyatk_row * (1 - resi/100));
                if(dmg === 0){ dmg = 1; }
                dmg = Math.ceil(dmg * row.cutmag * skill.cutmag);
                dmg *= enemy.cnt;
            }
        }
    })
    .ToArray();
    
    if(gl_mode === 'reha'){
    	dmg = '';
    	dps = '';
    	s_dmg = '';
    }

    var dom = {};
    dom.hp = $('#hp_' + id);
    dom.atk = $('#atk_' + id);
    dom.def = $('#def_' + id);
    dom.resi = $('#resi_' + id);
    dom.dmg = $('#dmg_' + id);
    dom.dps = $('#dps_' + id);
    dom.s_dmg = $('#s_dmg_' + id);
    
    dom.hp.html(hp);
    dom.atk.html(atk);
    dom.def.html(def);
    dom.resi.html(resi);
    dom.dmg.html(dmg);
    dom.dps.html(dps);
    dom.s_dmg.html(s_dmg);
}
