function submit_hhc(){
    //ハイパー必死計算
    var str = '';
    var reqtime = $('#hhc_time').val() * 30;
    
    var hhc = {};
    hhc.reqtime = reqtime;
    hhc.time = 0;
    hhc.cnt = 1;
    hhc.atkcnt = 0;
    
    var mode = $('input[name="hhcmode"]:checked').val();
    
    var hp_e = toNum($('#hhc_emyHp').val());
    var atk_e = toNum($('#hhc_emyAtk').val());
    var def_e = toNum($('#hhc_emyDef').val());
    var resi_e = toNum($('#hhc_emyResi').val());
    var mot_e = toNum($('#hhc_emyMotion').val());
    var frm_e = toNum($('#hhc_emyFrm').val());
    var type_e = toNum($('#hhc_emyType option:selected').val());

    var sBuf = skillbuffs;
    var prince = sBuf.prince;
    
    var hp = toNum($('#hhcHp').val());
    var def = toNum($('#hhcDef').val());
    var resi = toNum($('#hhcResi').val());
    
    var atk = toNum($('#hhcAtk').val());
    var motion = toNum($('#hhcMotion').val());
    var frm = toNum($('#hhcFrm').val());
    var skill = toNum($('#hhcSkill').val());
    var sp = toNum($('#hhcSP').val());
    var type = toNum($('#hhcType').val());

    var atk1 = toNum($('#hhc_Atk1').val());
    var mot_a1 = toNum($('#hhc_Atk1_Motion').val());
    var frm_a1 = toNum($('#hhc_Atk1_Frm').val());
    var skill_a1 = toNum($('#hhc_Atk1_Skill').val());
    var sp_a1 = toNum($('#hhc_Atk1_SP').val());
    var type_a1 = toNum($('#hhc_Atk1_Type').val());

    var atk2 = toNum($('#hhc_Atk2').val());
    var mot_a2 = toNum($('#hhc_Atk2_Motion').val());
    var frm_a2 = toNum($('#hhc_Atk2_Frm').val());
    var skill_a2 = toNum($('#hhc_Atk2_Skill').val());
    var sp_a2 = toNum($('#hhc_Atk2_SP').val());
    var type_a2 = toNum($('#hhc_Atk2_Type').val());

    var atk3 = toNum($('#hhc_Atk3').val());
    var mot_a3 = toNum($('#hhc_Atk3_Motion').val());
    var frm_a3 = toNum($('#hhc_Atk3_Frm').val());
    var skill_a3 = toNum($('#hhc_Atk3_Skill').val());
    var sp_a3 = toNum($('#hhc_Atk3_SP').val());
    var type_a3 = toNum($('#hhc_Atk3_Type').val());
    
    var mot_h1 = toNum($('#hhc_Heal1_Motion').val());
    var mot_h2 = toNum($('#hhc_Heal2_Motion').val());
    var mot_h3 = toNum($('#hhc_Heal3_Motion').val());
    var frm_h1 = toNum($('#hhc_Heal1_Frm').val());
    var frm_h2 = toNum($('#hhc_Heal2_Frm').val());
    var frm_h3 = toNum($('#hhc_Heal3_Frm').val());
    var shift_h1 = toNum($('#hhc_Heal1_Shift').val());
    var shift_h2 = toNum($('#hhc_Heal2_Shift').val());
    var shift_h3 = toNum($('#hhc_Heal3_Shift').val());
    
    //計算に使う情報の整理
    //HP,MHP設定
    hhc.mhp = toNum($('#hhcHp').val());
    hhc.hp = hhc.mhp;
    hhc.prev = hhc.hp;
    hhc.hp_e = hp_e;
    hhc.prev_e = hhc.hp_e;
    //空白パディングの生成
    var atklen = $('#hhc_emyAtk').val().length;
    var hplen = $('#hhcHp').val().length;
    (atklen >= hplen)? hhc.hplen = atklen+1:hplen+1;
    hhc.pad = '';
    for(var i=0; i<hhc.hplen; i++){ hhc.pad += ' '; }
    var hplen_e = $('#hhc_emyHp').val().length;
    hhc.hplen_e = hplen_e+1;
    for(var i=0; i<hplen_e; i++){ hhc.pad_e += ' '; }
    
    //攻撃周りの設定
    var atks = [atk, atk1, atk2, atk3];
    var skills = [skill, skill_a1, skill_a2, skill_a3];
    var sps = [sp, sp_a1, sp_a2, sp_a3];
    var types = [type, type_a1, type_a2, type_a3];
    var motions = [motion, mot_a1, mot_a2, mot_a3];
    var frms = [frm, frm_a1, frm_a2, frm_a3];
    hhc.atks = new Array();
    hhc.next_atks = new Array();
    hhc.frm_atks = new Array();
    for(var i=0; i<=3; i++){
        var dmg = Math.floor(atks[i] * skills[i] * sps[i] * prince);
        
        if(types[i] === 1){
            //物理
            dmg = dmg - def_e;
        } else if(types[i] === 2){
            //魔法
            dmg = Math.floor(dmg * (100 - resi_e) / 100);
        } else if(types[i] === 3){
            //貫通
            dmg = dmg;
        }
        
        var limit = Math.floor(atks[i]/10); 
        if(dmg < limit){ dmg = limit; }
        if(dmg === 0){ dmg = 1; }
        
        hhc.atks[i] = dmg;
        hhc.next_atks[i] = (atks[i] === 0)? reqtime+1:motions[i];
        hhc.frm_atks[i] = frms[i];
    }
    
    //ヒーラー周りの設定
    hhc.heals = [Math.floor(toNum($('#hhc_Heal1').val()) * prince)
                 ,Math.floor(toNum($('#hhc_Heal2').val()) * prince)
                 ,Math.floor(toNum($('#hhc_Heal3').val()) * prince)];
    hhc.frm_heals = [frm_h1, frm_h2, frm_h3];
    hhc.mot_heals = [mot_h1, mot_h2, mot_h3];
    hhc.shift_heals = [shift_h1, shift_h2, shift_h3];
    hhc.squat = [false, false, false];
    hhc.next_heals = [mot_e + mot_h1 + shift_h1
                      ,mot_e + mot_h2 + shift_h2
                      ,mot_e + mot_h3 + shift_h3];
    for(var i=0; i<3; i++){
        if(hhc.heals[i] === 0){ 
            hhc.next_heals[i] = reqtime + 1;
        }
    }
    
    //被弾周りの設定
    hhc.frm_dmg = frm_e;
    hhc.next_dmg = mot_e;
    //ダメージ設定
    if(type_e === 1){
        //物理
        hhc.dmg = atk_e - def;
    } else if(type_e === 2){
        //魔法
        hhc.dmg = Math.floor(atk_e * ((100-resi)/100));
    } else if(type_e === 3){
        hhc.dmg = atk_e;
    }
    //下限
    if(hhc.dmg < Math.floor(atk_e/10)){
        hhc.dmg = Math.floor(atk_e/10);
    }
    if(hhc.dmg === 0){ hhc.dmg = 1; }
    
    //初動の決定
    var first = [mot_e];
    for(var i=0; i<=3; i++){
        first[i+1] = hhc.next_atks[i];
    }
    var idx = Math.min.apply(null, first);
    idx = first.indexOf(idx);
    if(idx === 0){
        hhc.next = 'dmg';
    } else {
        hhc.next = 'atk';
        hhc.next_atk = first[idx];
        hhc.idx = hhc.next_atks.indexOf(hhc.next_atk);
    }

    //実計算
    hhc.calc = true;
    if(mode === 'simple'){
        while(hhc.calc){ hhc_main(hhc); }
    } else { 
        while(hhc.calc){ str += hhc_main(hhc); }
    }
    
    if(mode === 'simple'){
        str = '<tr>'
            + '<td></td>'
            + '<td>' + hhc.time + 'frm</td>'
            + '<td>' + rounds(hhc.time/30, 2, true) + '秒</td>'
            + '<td>'
            + ((hhc.hp > 0)? '生':'死')
            + ' / '
            + ((hhc.hp_e > 0)? '生':'討')
            + '</td>'
            + '<td>最終ＨＰ：' + hhc.hp + '</td>'
            + '<td>最終ＨＰ：' + hhc.hp_e + '</td>'
            + '<td>' + hhc.atkcnt + '回</td>'
            + '<td></td>'
            + '<td></td>'
            + '<td></td>'
            + '</tr>';
    }
    
    $('#outputTable_hhc').append(str);
    var row = $('#outputTable_hhc tbody').children().length;
    if(row > 10){
        $('#outputTable_hhc tbody').css('height', '220px');
    } else {
        $('#outputTable_hhc tbody').css('height', row * 22 + (row - 1) + 'px');
    }
}

var atkchar = ['壁', 1, 2, 3];

function hhc_main(hhc){
    var str = '';
    var act = '';
    var atkchr = atkchar;
    
    var prevtime = hhc.time;
    if(hhc.next === 'dmg'){
        act = '被弾';
        hhc.time = hhc.next_dmg;
        hhc.prev = hhc.hp;
        hhc.hp -= hhc.dmg;
        if(hhc.hp < 0){ hhc.hp = 0; }
        hhc.next_dmg += hhc.frm_dmg;
        hhc.atkcnt++;
    } else if(hhc.next === 'atk'){
        act = '攻撃(' + atkchr[hhc.idx] + ')';
        hhc.time = hhc.next_atk;
        hhc.prev_e = hhc.hp_e;
        hhc.hp_e -= hhc.atks[hhc.idx];
        if(hhc.hp_e < 0){ hhc.hp_e = 0; }
        hhc.next_atks[hhc.idx] += hhc.frm_atks[hhc.idx];
    } else if(hhc.next === 'heal'){
        act = '回復(' + (hhc.idx + 1) + ')';
        hhc.time = hhc.next_heal;
        hhc.prev = hhc.hp;
        hhc.hp += hhc.heals[hhc.idx];
        hhc.next_heals[hhc.idx] += hhc.frm_heals[hhc.idx];
        
        if(hhc.hp >= hhc.mhp){
            hhc.hp = hhc.mhp;
            
            //スクワット計算
            for(var i=0; i<3; i++){
                var nextheal = hhc.next_heals[i] - hhc.time;
                if(hhc.next_heals[i] > hhc.shift_heals[i]
                && nextheal > 0 && nextheal < hhc.mot_heals[i]){
                    hhc.next_heals[i] = hhc.next_dmg + hhc.mot_heals[i];
                    hhc.squat[i] = true;
                }
            }
        }
    }

    if(hhc.time > hhc.reqtime){
        hhc.hp = hhc.prev;
        hhc.time = prevtime;
        hhc.hp_e = hhc.prev_e;
        hhc.calc = false;
    } else {
        var prev = hhc.pad + hhc.prev;
        prev = prev.substr(-1 * hhc.hplen);
        prev = prev.replace(/ /g, '&nbsp;');
        var hp = hhc.pad + hhc.hp;
        hp = hp.substr(-1 * hhc.hplen);
        hp = hp.replace(/ /g, '&nbsp;');
        var prev_e = hhc.pad_e + hhc.prev_e;
        prev_e = prev_e.substr(-1 * hhc.hplen_e);
        prev_e = prev_e.replace(/ /g, '&nbsp;');
        var hp_e = hhc.pad_e + hhc.hp_e;
        hp_e = hp_e.substr(-1 * hhc.hplen_e);
        hp_e = hp_e.replace(/ /g, '&nbsp;');
        
        var min_a = Math.min.apply(null, hhc.next_atks);
        var min_h = Math.min.apply(null, hhc.next_heals);
        var min = [hhc.next_dmg, min_a, min_h];
        var idx = Math.min.apply(null, min);
        idx = min.indexOf(idx);
        if(idx === 0){
            hhc.next = 'dmg';
        } else if(idx === 1){
            hhc.next = 'atk';
            hhc.idx = Math.min.apply(null, hhc.next_atks);
            hhc.idx = hhc.next_atks.indexOf(hhc.idx);
            hhc.next_atk = hhc.next_atks[hhc.idx];
            hhc.atk = hhc.atks[hhc.idx];
        } else if(idx === 2){
            hhc.next = 'heal';
            hhc.idx = Math.min.apply(null, hhc.next_heals);
            hhc.idx = hhc.next_heals.indexOf(hhc.idx);
            hhc.next_heal = hhc.next_heals[hhc.idx];
            hhc.heal = hhc.heals[hhc.idx];
        }
        
        str += '<tr>'
            + '<td>' + hhc.cnt++ + '</td>'
            + '<td>' + hhc.time + 'frm' + '</td>'
            + '<td>' + rounds(hhc.time/30, 2, true) + '秒' + '</td>'
            + '<td>' + act + '</td>'
            + '<td>' + ((hhc.prev === hhc.hp)? '':(prev + ' → ' + hp)) + '</td>'
            + '<td>' + ((hhc.prev_e === hhc.hp_e)? '':(prev_e + ' → ' + hp_e)) + '</td>'
            + '<td>' + ((act === '被弾')? hhc.atkcnt + '回目':'') + '</td>'
            + '<td>' + ((hhc.squat[0])? 'ｽｸﾜｯﾄ!':'') + '</td>'
            + '<td>' + ((hhc.squat[1])? 'ｽｸﾜｯﾄ!':'') + '</td>'
            + '<td>' + ((hhc.squat[2])? 'ｽｸﾜｯﾄ!':'') + '</td>'
            + '</tr>';
        
        if(hhc.hp <= 0){
            str += '<tr>'
                + '<td></td>'
                + '<td></td>'
                + '<td></td>'
                + '<td></td>'
                + '<td>&nbsp;ｷｬｰ</td>'
                + '<td></td>'
                + '<td></td>'
                + '<td></td>'
                + '<td></td>'
                + '</tr>';
            hhc.calc = false;
        }
        if(hhc.hp_e <= 0){ hhc.calc = false; }
        
        for(var i=0; i<3; i++){
            hhc.squat[i] = false;
        }
    }

    if(!hhc.calc){
        str += '<tr>'
            + '<td></td>'
            + '<td></td>'
            + '<td></td>'
            + '<td></td>'
            + '<td>&nbsp;終了</td>'
            + '<td></td>'
            + '<td></td>'
            + '<td></td>'
            + '<td></td>'
            + '<td></td>'
            + '</tr>';
    }
    
    hhc.prev = hhc.hp;
    hhc.prev_e = hhc.hp_e;
    
    return str;
}