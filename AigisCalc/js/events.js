
$('.region_toggle').click(regionToggle);

$('#chkMode').change(chkMode_Change);
$('input[type="number"]').change(number_Change);
$('input[name="atkMode"]').change(atkMode_Change);

$('input[isGrouptop="true"]').change(filterGroupTop_Change);
$('input[grouptop!=""]').change(filterGroup_Change);

$('.filter_melran').change(filterMelRan_Change);
$('#clsmel, #clsran').change(filterClassTop_Change);
$('body').on('change', 'input[id^="cls_"][type="checkbox"]', filterClass_Change);

$('input.submit').click(submit_Click);

$('#buff_all').change(buff_all_Change);

$('select.skillsel').change(buffSel_Change);
$('input.skillradio[type="radio"]').change(buffRad_Change);

$('#inc_rosette').change(inc_rosette_Change);
$('body').on('change', 'select[id="skill_rosette"]', skill_rosette_Change);

$('.actchk').change(activateFromCheckbox);

$('#sortReset').click(sortReset_Click);
$('#outputHead').click(function(){$('#outputTable').trigger('update');});

$('body').on('change', 'input[class="link"][type="checkbox"]', linkCheckbox);

function sortReset_Click(){
	if(tableclone !== undefined){
		rowclear();
	    $('#outputTable').trigger('update');
	    $('#outputTable').trigger('sortReset');
		
		var t = $('#outputTable');
		t.append(tableclone);

	    setLv(bunits);
	    $('#outputTable').trigger('update');
	} else {
		$('#result').html('(´・ω・｀)だめよ');
	}
}

function regionToggle(){
    var t = $(this);
    var tgt = $('#' + t.attr('region'));

    tgt.toggle();
    if(tgt.css('display') === 'none'){
        t.children('label').html('田');
    }else{
        t.children('label').html('口');
    }
}

function chkMode_Change(){
    var val = $('#chkMode').val();

    $('.admField').hide();
    
    $('#' + val + 'Field').show();
}

function number_Change(){
    var t = $(this);
    var val = t.val();
    
    if(isFinite(val)){
        val = Math.floor(val);
    } else {
        val = t.attr('min');
    }
    if(val < t.attr('min')){
        val = t.attr('min');
    }
    t.val(val);
}

function atkMode_Change(){
    $('#atkCnt').prop('disabled', true);
    $('#atkTime').prop('disabled', true);
    
    $(this).next().prop('disabled', false);
}

function filterGroupTop_Change(){
    var t = $(this);
    
    if(t.prop('checked')){
        $('input[id^="' + t.attr('group') + '"][type="checkbox"]').prop('checked', false);
    } else {
        if(t.attr('id') === 'typeall'){
        	$('#atktype_mat').prop('checked', true);
        	$('#atktype_mag').prop('checked', true);
        } else {
            $('input[id^="' + t.attr('group') + '"][type="checkbox"]').prop('checked', true);
        }
    }
}

function filterGroup_Change(){
    var t = $(this);
    
    if(t.prop('checked')){
        $('#' + t.attr('grouptop')).prop('checked', false); 
    }
    else {
        var stat = false;
        $('input[id^="' + t.attr('group') + '"][type="checkbox"]').each(function(){
            stat = stat || $(this).prop('checked');
        });

        if(!stat){ $('#' + t.attr('grouptop')).prop('checked', true); }
    }
}

function filterMelRan_Change(){
    var t = $(this);
    var chk = t.prop('checked');
    
    if(t.attr('id').substr(3,3) === 'mel'){
        $('input[group="cls_mel"]').prop('checked', false);
        $('#clsmel').prop('checked', chk);
    } else {
        $('input[group="cls_ran"]').prop('checked', false);
        $('#clsran').prop('checked', chk);
    }
}

function filterClassTop_Change(){
    var t = $(this);
    var chk = t.prop('checked');
    
    if(t.attr('id').substr(-3) === 'mel'){
        $('#atkmelee').prop('checked', chk);
        $('input[id^="cls_mel"][type="checkbox"]').prop('checked', false);
    } else {
        $('#atkranged').prop('checked', chk);
        $('input[id^="cls_ran"][type="checkbox"]').prop('checked', false);
    }
}

function filterClass_Change(){
    var t = $(this);
    var melran = t.attr('id').substr(4,3);
	var mr = '';
    var stat = false;
    
    if(t.prop('checked')){
        $('#' + t.attr('grouptop')).prop('checked', false); 
        stat = true;
    } else {
    	var dom = $('input[id^="' + t.attr('group') + '"][type="checkbox"]');
        dom.each(function(){
            stat = stat || $(this).prop('checked');
        });
    }

    (melran === 'mel')? mr = 'atkmelee': mr = 'atkranged';
    $('#' + mr).prop('checked', stat);
}

function buff_all_Change(){
	var t = $(this);
	var chk = $('#buff').find('input[type="checkbox"]:not(.hage, [id^="op_area"])');
	if(t.prop('checked')){
		chk.prop('checked', true);
	} else {
		chk.prop('checked', false);
	}

	chk.each(function(index, elem){
		$(elem).trigger('change');
	});
	
	var radsel;

	if(t.prop('checked')){
		radsel = 'input[name="op_prince"][value="1.21"]'
			   + ',input[name="op_ctcut"][value="0.7"]'
			   + ',input[name="incatk"]:eq(3)'
			   + ',input[name="incdef"]:eq(2)'
			   + ',input[name="incpro"]:eq(3)'
			   + ',input[name="dmgcut_mag"]:eq(1)'
			   + ',input[name="emy_debatk"]:eq(4)'
			   + ',input[name="emy_debmat"]:eq(2)'
			   + ',input[name="emy_debdef"]:eq(1)'
			   + ',input[name="emy_debresi"]:eq(2)';
	} else {
		radsel = 'input[name="op_prince"]:eq(0)'
			   + ',input[name="op_ctcut"]:eq(0)'
			   + ',input[name="incatk"]:eq(0)'
			   + ',input[name="incdef"]:eq(0)'
			   + ',input[name="incpro"]:eq(0)'
			   + ',input[name="dmgcut_mag"]:eq(0)'
			   + ',input[name="emy_debatk"]:eq(0)'
			   + ',input[name="emy_debmat"]:eq(0)'
			   + ',input[name="emy_debdef"]:eq(0)'
			   + ',input[name="emy_debresi"]:eq(0)';
	}
	var radio = $(radsel);
	radio.each(function(index, elem){
		$(elem).prop('checked', true);
		$(elem).trigger('change');
	});
	
	var select = $('#buff select');
	select.each(function(index, elem){
		var sel = $(elem);
		var len = sel.children().length - 1;
		
		if(!sel.prop('disabled') && len > 0){
			sel.children('option:eq(' + len + ')').prop('selected', true);
			sel.trigger('change');
		}
	});
	
}

function buffRad_Change(){
    var t = $(this);
    var name = t.attr('name');

    $('select[btgt="' + name + '"]').prop('disabled', true);
    t.next('select.skillsel').prop('disabled', false);

    $('#' + name).html(t.val());
}

function buffSel_Change(){
    var t = $(this);
    var name = t.attr('btgt');
    var val = (toNum(t.attr('bmax')) - toNum(t.attr('bmin'))) / (toNum(t.attr('bslv')) - 1);
    val = toNum(t.attr('bmin')) + val * toNum(t.val());
    val = rounds(val, 2);

    $('input[name="' + name + '"][type="radio"]:checked').val(val);
    $('#' + name).html(val);
}

function inc_rosette_Change(){
	var dis = !$(this).prop('checked');
    $('#skill_rosette').prop('disabled', dis);
    
    if(dis){ $(this).val(1); } else { skill_rosette_Change(); }
}

function skill_rosette_Change(){
    var t = $('#skill_rosette');
    var base = (toNum(t.attr('bmax')) - toNum(t.attr('bmin'))) / (toNum(t.attr('bslv')) - 1);
    var val = $('#skill_rosette option:selected').val();
    val = toNum(t.attr('bmin')) + base * val;
    val = rounds(val, 3);

    $('#inc_rosette').val(val);
}

function activateFromCheckbox(){
    var t = $(this);
    var tgt = t.attr('ctgt');
    var chk = !t.prop('checked');
    
    $(tgt).prop('disabled', chk);
}

function tooltip(index, elem){
    //ツールチップの出る場所
    var dom = $(elem);
    var pos = dom.position();

    //var xOffset = -10;
    var yOffset = 20;

    var top = 0;
    var left = 0;

    //マウスホバーイベント
    dom.unbind().hover(
        function(e) {
            top = e.pageY + yOffset;
            left = pos.left;

            //要素のtitle属性を取得してspanの中に含める
            $('body').append( '<span id="tip_body">' + dom.attr('tooltip') + '</span>' );
            $('#tip_body').css('top', top+'px').css('left', left+'px').fadeIn('fast');
        },
        function() {
            $('#tip_body').remove();
        }
    ).mousemove(
        function(e){
            //マウスの動きに合わせる
            top = e.pageY + yOffset;
            $('#tip_body').css("top", top+"px");
        }
    );
    return true;
}

