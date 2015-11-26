var S52 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var dig_val = [5, 4, 2, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4];

function sysSave(){
    var data = dataSave();
    var cname = 'ranranAigisCalc' + $('#savedata').prop('selectedIndex');
    $.cookie(cname, data, {expires: 3650});
}

function dataSave(){

    var save = new Array();
    var val = new Array();
    var expr;
    
    ////確認内容
    save[0] = $('#chkMode').prop('selectedIndex');
    
    //攻撃
    save[1] = $('#atksp').prop('selectedIndex');    //特攻
    val[0] = $('#atkHP').val();                     //HP
    val[1] = $('#atkDef').val();                    //防御
    val[2] = $('#atkResi').val();                   //魔耐
    expr = 'input[name="atkMode"]';                 //モード
    save[2] = $(expr+':checked').index(expr);       //モード
    val[3] = $('#atkCnt').val();                    //回数
    val[4] = $('#atkTime').val();                   //時間
    
    //防御
    val[5] = $('#defAtk').val();                    //攻撃

    save[3] = $('#defType').prop('selectedIndex');  //物魔
    val[6] = $('#defCnt').val();                    //回数
    
    //リハビリ
    save[4] = $('#rehaMode').prop('selectedIndex'); //リハ
    
    //耐+DPS
    save[5] = $('#mixsp').prop('selectedIndex');    //特攻
    val[7] = $('#mixAtk').val();                    //攻撃
    save[6] = $('#mixType').prop('selectedIndex');  //物魔
    val[8] = $('#mixDef').val();                    //防御
    val[9] = $('#mixResi').val();                   //魔耐
    val[10] = $('#mixCnt').val();                   //回数
    expr = 'input[name="mixLv"]';                   //Lv
    save[7] = $(expr+':checked').index(expr);       //Lv
    
    ////フィルタ
    //行数制限
    val[11] = $('#take_cnt').val();

    //CC
    save[8] = 1 * $('#ccall').prop('checked');
    save[9] = 1 * $('#cc_0').prop('checked');
    save[10] = 1 * $('#cc_1').prop('checked');
    save[11] = 1 * $('#cc_2').prop('checked');
    save[12] = 1 * $('#cc_3').prop('checked');

    //レア
    save[13] = 1 * $('#rareall').prop('checked');
    save[14] = 1 * $('#rare_1').prop('checked');
    save[15] = 1 * $('#rare_2').prop('checked');
    save[16] = 1 * $('#rare_3').prop('checked');
    save[17] = 1 * $('#rare_4').prop('checked');
    save[18] = 1 * $('#rare_5').prop('checked');
    save[19] = 1 * $('#rare_6').prop('checked');
    save[20] = 1 * $('#rare_7').prop('checked');
    
    //属性
    save[21] = 1 * $('#typeall').prop('checked');
    save[22] = 1 * $('#atktype_mat').prop('checked');
    save[23] = 1 * $('#atktype_mag').prop('checked');
    save[24] = 1 * $('#atktype_heal').prop('checked');
    save[25] = 1 * $('#atktype_neet').prop('checked');
    
    //入手
    save[26] = 1 * $('#eventunit').prop('checked');
    save[27] = 1 * $('#eveuni_normal').prop('checked');
    save[28] = 1 * $('#eveuni_event').prop('checked');
    save[29] = 1 * $('#eveuni_gacha').prop('checked');
    
    //遠近
    save[30] = 1 * $('#atkmelee').prop('checked');
    save[31] = 1 * $('#atkranged').prop('checked');
    
    ////編成バフ
    expr = 'input[name="bonus"]';
    save[32] = $(expr+':checked').index(expr);      //好感度
    expr = 'input[name="op_prince"]';
    save[33] = $(expr+':checked').index(expr);      //士気高揚
    expr = 'input[name="op_ctcut"]';
    save[34] = $(expr+':checked').index(expr);      //後衛軍師
    //HP
    save[35] = 1 * $('#op_hp1').prop('checked');
    save[36] = 1 * $('#op_hp2').prop('checked');
    save[37] = 1 * $('#op_hp3').prop('checked');
    //AT
    save[38] = 1 * $('#op_atk1').prop('checked');
    save[39] = 1 * $('#op_atk2').prop('checked');
    save[40] = 1 * $('#op_atk3').prop('checked');
    //DEF
    save[41] = 1 * $('#op_def1').prop('checked');
    save[42] = 1 * $('#op_def2').prop('checked');
    save[43] = 1 * $('#op_def3').prop('checked');
    save[44] = 1 * $('#op_louise').prop('checked');
    ////特殊強化
    save[45] = 1 * $('#op_anna').prop('checked');
    save[46] = 1 * $('#op_ekidona').prop('checked');
    save[47] = 1 * $('#op_ester').prop('checked');
    save[48] = 1 * $('#op_olivie').prop('checked');
    
    save[49] = 1 * $('#op_sherry').prop('checked');
    save[50] = 1 * $('#op_shirley').prop('checked');
    save[51] = 1 * $('#op_hikage').prop('checked');
    save[52] = 1 * $('#op_liselotte').prop('checked');

    save[53] = 1 * $('#op_lubinus').prop('checked');

    ////近接強化
    save[54] = 1 * $('#op_kagura').prop('checked');
    save[55] = 1 * $('#op_matsuri').prop('checked');
    save[56] = 1 * $('#op_grace').prop('checked');
    
    ////スキルバフ
    //攻撃強化
    expr = 'input[name="incatk"]';
    save[57] = $(expr+':checked').index(expr);
    save[58] = $('#skill_shuka').prop('selectedIndex');     //猛将の鼓舞
    save[59] = $('#skill_uzume').prop('selectedIndex');     //烈火の陣
    save[60] = $('#skill_uzume_s').prop('selectedIndex');   //猛火の陣
    save[61] = 1 * $('#op_lubinus_s').prop('checked');      //鋭牙の火炎
    
    //防御強化
    expr = 'input[name="incdef"]';
    save[62] = $(expr+':checked').index(expr);
    save[63] = $('#skill_ren').prop('selectedIndex');       //鉄壁の陣
    save[64] = $('#skill_ren_s').prop('selectedIndex');     //金城の陣
    save[65] = 1 * $('#op_ekidona_s').prop('checked');      //硬鱗の癒し

    //プロテクション
    expr = 'input[name="incpro"]';
    save[66] = $(expr+':checked').index(expr);
    save[67] = $('#skill_iris_1').prop('selectedIndex');    //プロテクションI
    save[68] = $('#skill_iris_2').prop('selectedIndex');    //プロテクションII
    save[69] = $('#skill_iris_s').prop('selectedIndex');    //聖女の結界
    
    //魔法ダメージ減少
    expr = 'input[name="dmgcut_mag"]';
    save[70] = $(expr+':checked').index(expr);
    save[71] = $('#skill_odette').prop('selectedIndex');    //マジックバリア
    
    //ロゼット
    save[72] = 1 * $('#inc_rosette').prop('checked');
    save[73] = $('#skill_rosette').prop('selectedIndex');    //ダモクレスの剣

    //マジックウェポン
    save[74] = 1 * $('#op_enchant').prop('checked');
    
    //攻撃力減少
    expr = 'input[name="emy_debatk"]';
    save[75] = $(expr+':checked').index(expr);
    save[76] = $('#skill_cursevoice').prop('selectedIndex');//カースボイス
    save[77] = $('#skill_yurina').prop('selectedIndex');    //暗黒オーラ
    save[78] = $('#skill_cornelia').prop('selectedIndex');  //真・暗黒オーラ

    //物理攻撃減少
    expr = 'input[name="emy_debmat"]';
    save[79] = $(expr+':checked').index(expr);
    save[80] = $('#skill_yurina_s').prop('selectedIndex');  //聖なるオーラ
    save[81] = $('#skill_seria').prop('selectedIndex');     //聖霊の護り

    //防御力減少
    expr = 'input[name="emy_debdef"]';
    save[82] = $(expr+':checked').index(expr);

    //魔法耐性減少
    expr = 'input[name="emy_debresi"]';
    save[83] = $(expr+':checked').index(expr);

    //ダンサー
    save[84] = 1 * $('#op_dance').prop('checked');
    val[12] = $('#dance_atk').val();    //ダンサー - 攻撃
    val[13] = $('#dance_def').val();    //ダンサー - 防御
    
    ////マップ効果
    //攻撃
    save[85] = 1 * $('#op_areaAtk').prop('checked');
    val[14] = $('#areaAtk').val();
    //防御
    save[86] = 1 * $('#op_areaDef').prop('checked');
    val[15] = $('#areaDef').val();
    
    //魔法剣士減衰
    expr = 'input[name="op_mahoken"]';
    save[87] = $(expr+':checked').index(expr);

    //ダンサー(単純/計算)
    expr = 'input[name="op_dance_type"]';
    save[88] = $(expr+':checked').index(expr);
    
    //死霊強化
    save[89] = 1 * $('#inc_memento').prop('checked');
    save[90] = $('#skill_memento').prop('selectedIndex');
    
    //スキル使用
    save[91] = 1 * $('#use_skill').prop('checked');
    
    //【時間】モード
    expr = 'input[name="timeMode"]';
    save[92] = $(expr + ':checked').index(expr);
    
    //支援アンナ
    expr = 'input[name="op_anna_type"]';
    save[93] = 1 * $('#op_anna').prop('checked');
    save[94] = $(expr + ':checked').index(expr);
    val[16] = $('#anna_atk').val();
    val[17] = $('#anna_def').val();
    
    
    ////職フィルタ
    var filmel = new Array();
    var filran = new Array();
    GroupChk('input[group="cls_mel"]', filmel, 0);
    GroupChk('input[group="cls_ran"]', filran, 0);
    
    ////職バフ
    var str_mel = bufClsChk('mel');
    var str_ran = bufClsChk('ran');
    
    //文字列化
    var str_save = encodeSave(save, null);
    var str_val = encodeSave(val, dig_val);
    var str_filmel = encodeSave(filmel, null);
    var str_filran = encodeSave(filran, null);
    var uri = str_save + '&' + str_val + '&' + str_filmel + '&' + str_filran + '&' + str_mel + '&' + str_ran;
    
    return uri;
}

function sysLoad(){
    var cname = 'ranranAigisCalc' + $('#savedata').prop('selectedIndex');
    var str = $.cookie(cname);
    if(str){
        $('#buff_all').prop('checked', false);
        $('#buff_all').trigger('change');
        dataLoad(str);
    }
}

function dataLoad(str){
    var data = str.split('&');
    var save = new Array();
    var val = new Array();
    var filmel = new Array();
    var filran = new Array();
    var bufmel = new Array();
    var bufran = new Array();

    data[0] = unzip52(data[0]);
    data[1] = unzip52(data[1]);
    data[2] = unzip52(data[2]);
    data[3] = unzip52(data[3]);
    data[4] = unzip52(data[4]);
    data[5] = unzip52(data[5]);

    getData(data[0], save, null);
    getData(data[1], val, dig_val);
    getData(data[2], filmel, null);
    getData(data[3], filran, null);
    getData(data[4], bufmel, null);
    getData(data[5], bufran, null);
    
    ////データの設定
    ////確認内容
    $('#chkMode').prop('selectedIndex', save[0]);
    
    //攻撃
    $('#atksp').prop('selectedIndex', save[1]);
    $('#atkHP').val(val[0]);
    $('#atkDef').val(val[1]);
    $('#atkResi').val(val[2]);
    $('input[name="atkMode"]:eq(' + save[2] + ')').prop('checked', true);
    $('#atkCnt').val(val[3]);
    $('#atkTime').val(val[4]);
    
    //防御
    $('#defAtk').val(val[5]);

    $('#defType').prop('selectedIndex', save[3]);
    $('#defCnt').val(val[6]);
    
    //リハビリ
    $('#rehaMode').prop('selectedIndex', save[4]);
    
    //耐+DPS
    $('#mixsp').prop('selectedIndex', save[5]);
    $('#mixAtk').val(val[7]);
    $('#mixType').prop('selectedIndex', save[6]);
    $('#mixDef').val(val[8]);
    $('#mixResi').val(val[9]);
    $('#mixCnt').val(val[10]);
    $('input[name="mixLv"]:eq(' + save[7] + ')').prop('checked', true);
    
    ////フィルタ
    //行数制限
    $('#take_cnt').val(val[11]);

    //CC
    $('#ccall').prop('checked', save[8]);
    $('#cc_0').prop('checked', save[9]);
    $('#cc_1').prop('checked', save[10]);
    $('#cc_2').prop('checked', save[11]);
    $('#cc_3').prop('checked', save[12]);

    //レア
    $('#rareall').prop('checked', save[13]);
    $('#rare_1').prop('checked', save[14]);
    $('#rare_2').prop('checked', save[15]);
    $('#rare_3').prop('checked', save[16]);
    $('#rare_4').prop('checked', save[17]);
    $('#rare_5').prop('checked', save[18]);
    $('#rare_6').prop('checked', save[19]);
    $('#rare_7').prop('checked', save[20]);

    //属性
    $('#typeall').prop('checked', save[21]);
    $('#atktype_mat').prop('checked', save[22]);
    $('#atktype_mag').prop('checked', save[23]);
    $('#atktype_heal').prop('checked', save[24]);
    $('#atktype_neet').prop('checked', save[25]);

    //入手
    $('#eventunit').prop('checked', save[26]);
    $('#eveuni_normal').prop('checked', save[27]);
    $('#eveuni_event').prop('checked', save[28]);
    $('#eveuni_gacha').prop('checked', save[29]);

    //遠近
    $('#atkmelee').prop('checked', save[30]);
    $('#atkranged').prop('checked', save[31]);
    
    ////編成バフ
    $('input[name="bonus"]:eq(' + save[32] + ')').prop('checked', true);
    $('input[name="op_prince"]:eq(' + save[33] + ')').prop('checked', true);
    $('input[name="op_ctcut"]:eq(' + save[34] + ')').prop('checked', true);
    //HP
    $('#op_hp1').prop('checked', save[35]);
    $('#op_hp2').prop('checked', save[36]);
    $('#op_hp3').prop('checked', save[37]);
    //ATK
    $('#op_atk1').prop('checked', save[38]);
    $('#op_atk2').prop('checked', save[39]);
    $('#op_atk3').prop('checked', save[40]);
    //DEF
     $('#op_def1').prop('checked', save[41]);
     $('#op_def2').prop('checked', save[42]);
     $('#op_def3').prop('checked', save[43]);
     $('#op_louise').prop('checked', save[44]);

    ////特殊強化
     $('#op_anna').prop('checked', save[45]);
     $('#op_ekidona').prop('checked', save[46]);
     $('#op_ester').prop('checked', save[47]);
     $('#op_olivie').prop('checked', save[48]);
    
     $('#op_sherry').prop('checked', save[49]);
     $('#op_shirley').prop('checked', save[50]);
     $('#op_hikage').prop('checked', save[51]);
     $('#op_liselotte').prop('checked', save[52]);

     $('#op_lubinus').prop('checked', save[53]);

    ////近接強化
     $('#op_kagura').prop('checked', save[54]);
     $('#op_matsuri').prop('checked', save[55]);
     $('#op_grace').prop('checked', save[56]);

     ////スキルバフ
     //攻撃強化
     $('input[name="incatk"]:eq(' + save[57] + ')').prop('checked', true);
     $('#skill_shuka').prop('selectedIndex', save[58]);
     $('#skill_uzume').prop('selectedIndex', save[59]);
     $('#skill_uzume_s').prop('selectedIndex', save[60]);
     $('#op_lubinus_s').prop('checked', save[61]);
     
     //防御強化
     $('input[name="incdef"]:eq(' + save[62] + ')').prop('checked', true);
     $('#skill_ren').prop('selectedIndex', save[63]);
     $('#skill_ren_s').prop('selectedIndex', save[64]);
     $('#op_ekidona_s').prop('checked', save[65]);

     //プロテクション
     $('input[name="incpro"]:eq(' + save[66] + ')').prop('checked', true);
     $('#skill_iris_1').prop('selectedIndex', save[67]);
     $('#skill_iris_2').prop('selectedIndex', save[68]);
     $('#skill_iris_s').prop('selectedIndex', save[69]);
     
     //魔法ダメージ減少
     $('input[name="dmgcut_mag"]:eq(' + save[70] + ')').prop('checked', true);
     $('#skill_odette').prop('selectedIndex', save[71]);
     
     //ロゼット
     $('#inc_rosette').prop('checked', save[72]);
     $('#skill_rosette').prop('selectedIndex', save[73]);

     //マジックウェポン
     $('#op_enchant').prop('checked', save[74]);
     
     //攻撃力減少
     $('input[name="emy_debatk"]:eq(' + save[75] + ')').prop('checked', true);
     $('#skill_cursevoice').prop('selectedIndex', save[76]);
     $('#skill_yurina').prop('selectedIndex', save[77]);
     $('#skill_cornelia').prop('selectedIndex', save[78]);

     //物理攻撃減少
     $('input[name="emy_debmat"]:eq(' + save[79] + ')').prop('checked', true);
     $('#skill_yurina_s').prop('selectedIndex', save[80]);
     $('#skill_seria').prop('selectedIndex', save[81]);

     //防御力減少
     $('input[name="emy_debdef"]:eq(' + save[82] + ')').prop('checked', true);

     //魔法耐性減少
     $('input[name="emy_debresi"]:eq(' + save[83] + ')').prop('checked', true);

     //ダンサー
     $('#op_dance').prop('checked', save[84]);
     $('#dance_atk').val(val[12]);
     $('#dance_def').val(val[13]);
     
     ////マップ効果
     //攻撃
     $('#op_areaAtk').prop('checked', save[85]);
     $('#areaAtk').val(val[14]);
     //防御
     $('#op_areaDef').prop('checked', save[86]);
     $('#areaDef').val(val[15]);
     
     //魔法剣士減衰
     $('input[name="op_mahoken"]:eq(' + save[87] + ')').prop('checked', true);

     //ダンサー(単純/計算)
     $('input[name="op_dance_type"]:eq(' + save[88]  +')').prop('checked', true);
     
     //死霊強化
     $('#inc_memento').prop('checked', save[89]);
     $('#skill_memento').prop('selectedIndex', save[90]);
     
     //スキル使用
     $('#use_skill').prop('checked', save[91]);
     
     //【時間】モード
     $('input[name="timeMode"]:eq(' + save[92] + ')').prop('checked', true);
     
     //支援アンナ
     $('#op_anna').prop('checked', save[93]);
     $('input[name="op_anna_type"]:eq(' + save[94] + ')').prop('checked', true);
     $('#anna_atk').val(val[16]);
     $('#anna_def').val(val[17]);
     
     //職フィルタ
     var selmel = $('input[group="cls_mel"]');
     var selran = $('input[group="cls_ran"]');
     var i = 0, j = 0;
     selmel.each(function(index, elem){
         $(elem).prop('checked', filmel[i++]);
      });
     selran.each(function(index, elem){
         $(elem).prop('checked', filran[j++]);
      });

     //職バフ
     var que = Enumerable.From(classes)
     .Where('$.sid > 100')
     .Distinct('$.sid')
     .Select('{sid:$.sid}')
     .ToArray();
     var i = 0, j = 0;
     que.forEach(function(x){
         if(x.sid < 200){
             $('#' + x.sid + 'hp').prop('checked', bufmel[i++]);
             $('#' + x.sid + 'atk').prop('checked', bufmel[i++]);
             $('#' + x.sid + 'def').prop('checked', bufmel[i++]);
             $('#' + x.sid + 'resi').prop('checked', bufmel[i++]);
             $('#' + x.sid + 'time').prop('checked', bufmel[i++]);
         } else {
             $('#' + x.sid + 'hp').prop('checked', bufran[j++]);
             $('#' + x.sid + 'atk').prop('checked', bufran[j++]);
             $('#' + x.sid + 'def').prop('checked', bufran[j++]);
             $('#' + x.sid + 'resi').prop('checked', bufran[j++]);
             $('#' + x.sid + 'time').prop('checked', bufran[j++]);
         }
     });
     
    var chk = $('#buff').find('input[type="checkbox"]:not(.hage)');
    chk.each(function(index, elem){
        $(elem).trigger('change');
    });

    var radio = $('input[type="radio"]:checked');
    radio.each(function(index, elem){
        $(elem).trigger('change');
    });
    
    var select = $('select');
    select.each(function(index, elem){
        var sel = $(elem);
        var len = sel.children().length - 1;
        
        if(!sel.prop('disabled') && len > 0){
            sel.trigger('change');
        }
    });
}

function getData(data, ary, digit){
    var len = data.length;
    if(digit === null){
        digit = new Array();
        for(var i=0; i<=len; i++){
            digit[i] = 1;
        }
    }
    for(var i=0; i<=len; i++){
        ary[i] = DECby52(data.substr(0, digit[i]));
        data = data.slice(digit[i]);
    }
}

function GroupChk(selector, ary, idx){
    var dom = $(selector);
    dom.each(function(index, elem){
        ary[idx++] = 1 * $(elem).prop('checked');
    });
}

function bufClsChk(melran){
    var que, val;
    var str = '';
    
    if(melran === 'mel'){
        que = Enumerable.From(classes)
        .Where('100 < $.sid && $.sid < 200')
        .Distinct('$.sid')
        .Select('{sid:$.sid}')
        .ToArray();
    } else {
        que = Enumerable.From(classes)
        .Where('200 <= $.sid')
        .Distinct('$.sid')
        .Select('{sid:$.sid}')
        .ToArray();
    }
    
    que.forEach(function(x){
        val = ($('#' + x.sid + 'hp').prop('checked'))? 1: 0;
        str += DECto52(val, 1);
        val = ($('#' + x.sid + 'atk').prop('checked'))? 1: 0;
        str += DECto52(val, 1);
        val = ($('#' + x.sid + 'def').prop('checked'))? 1: 0;
        str += DECto52(val, 1);
        val = ($('#' + x.sid + 'resi').prop('checked'))? 1: 0;
        str += DECto52(val, 1);
        val = ($('#' + x.sid + 'time').prop('checked'))? 1: 0;
        str += DECto52(val, 1);
    });
    
    str = zip52(str);
    
    return str;
}

function encodeSave(save, digit){
    var str = '';
    var temp = 0;
    var len = save.length - 1;

    if(digit === null){
        digit = new Array();
        for(var i = 0; i <= len; i++){ digit[i] = 1; }
    }
    
    for(var i = 0; i <= len; i++){
        str += DECto52(save[i], digit[i]);
    }
    str = zip52(str);
    return str;
}
function decodeSave(param){
    var ary = new Array();
    var save = new Array();
    var val = new Array();
    var filmel = new Array();
    var filran = new Array();
    var bufmel = new Array();
    var bufran = new Array();
    
    ary = param.split('&');
    save = (ary[0])? ary[0]: null;
    val =  (ary[1])? ary[1]: null;
    
    
}

function DECto52(val, digit){
    var result = '', ret = '';
    var mod = [];
    var pad = '';
    var len = 0;
    
    var i = 0;
    if(val > 0){
        while(val > 0){
            result += S52[val % 52];
            val = Math.floor(val / 52);
        }
    } else {
        result += S52[0];
    }

    len = result.length;
    for(i=1; i<=len; i++){
        ret += result.substr(-i, 1);
    }
    result = ret;
    
    if(len < digit){
        for(i = 0; i < digit; i++){
            pad += 'a';
        }
    }
    result = (pad + result).slice(digit*-1);
    
    return result;
}

function DECby52(str){
    var len = str.length - 1;
    var dec = 0;
    var num = 0;

    for(var i=0; i<=len; i++){
        dec += $.inArray(str.substr(i, 1), S52) * Math.pow(52, len - i);
    }
    
    return dec;
}

function zip52(str){
    var len = str.length - 1;
    var ary = [];
    var chr = '';
    
    for(var i = 0; i <= len; i++){
        chr = str.charAt(i);
        if((i < len) && chr === str.charAt(i+1)){
            var j = 1;
            while(chr === str.charAt(i+j)){
                j++;
            }
            j--;
            ary[i] = chr + j;
            i += j;
        } else {
            ary[i] = chr;
        }
    }
    
    var zip = '';
    ary.forEach(function(x){
        zip += x;
    });
    
    return zip;
}

function unzip52(str){
    var ary = new Array();
    var unz = '';
    var len = str.length - 1;
    var sub = '';
    
    for(var i = 0; i <= len; i++){
        ary[i] = str.charAt(i);
    }
    
    
    for(var i = 0; i <= len; i++){
        if(isFinite(ary[i])){
            var j = toNum(ary[i]);
            var jsub = i + 1;
            sub = ary[i - 1];
            
            while(jsub <= len && isFinite(str.charAt(jsub))){
                j += ary[jsub];
                ary[jsub] = '';
                jsub++;
            }
            jsub--;
            
            j = toNum(j);
            while(j>0){
                unz += sub;
                j--;
            }
        } else {
            unz += ary[i];
        }
    }
    
    return unz;
}