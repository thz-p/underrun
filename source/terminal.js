
// 定义一个字符串，用于表示终端文本的标识符，这里是 '>' 符号的 HTML 实体编码 '&gt;'
var terminal_text_ident = '&gt; ';

// 定义一个多行字符串，表示终端的标题和信息
var terminal_text_title = '' +
    'UNDERRUN\n' + // 游戏标题
    '__ \n' + // 下划线
    'CONCEPT, GRAPHICS &AMP; PROGRAMMING:\n' + // 游戏开发者信息
    'DOMINIC SZABLEWSKI // PHOBOSLAB.ORG\n' + // 开发者名字和网站
    '__ \n' + // 下划线
    'MUSIC:\n' + // 音乐信息
    'ANDREAS LÖSCH // NO-FATE.NET\n' + // 音乐作者名字和网站
    '___ \n' + // 下划线
    'SYSTEM VERSION: 13.20.18\n' + // 系统版本信息
    'CPU: PL(R) Q-COATL 7240 @ 12.6 THZ\n' + // CPU 信息
    'MEMORY: 108086391056891900 BYTES\n' + // 内存信息
    ' \n' + // 空行
    'CONNECTING...'; // 连接状态信息

// 定义一个字符串，表示终端文本中的垃圾信息
var terminal_text_garbage = 
    '´A1e{∏éI9·NQ≥ÀΩ¸94CîyîR›kÈ¡˙ßT-;ûÅf^˛,¬›A∫Sã€«ÕÕ' +
    '1f@çX8ÎRjßf•ò√ã0êÃcÄ]Î≤moDÇ’ñ‰\\ˇ≠n=(s7É;';

// 定义一个字符串，表示终端文本中的故事信息
var terminal_text_story = 
    'DATE: SEP. 13, 2718 - 13:32\n' + // 日期时间信息
    'CRITICAL SOFTWARE FAILURE DETECTED\n' + // 软件故障信息
    'ANALYZING...\n' + // 分析信息
    '____\n \n' + // 下划线和空行
    'ERROR CODE: JS13K2018\n' + // 错误代码信息
    'STATUS: SYSTEMS OFFLINE\n' + // 状态信息
    'DESCRIPTION: BUFFER UNDERRUN DUE TO SATCOM R.U.D.\n' + // 描述信息
    'AFFECTED SYSTEM: FACILITY AUTOMATION\n' + // 受影响的系统信息
    'AFFECTED SUBSYSTEMS: AI, RADIATION SHIELDS, POWER MANAGEMENT\n' + // 受影响的子系统信息
    ' \n' + // 空行
    'INITIATING RESCUE SYSTEM...\n' + // 启动救援系统信息
    '___' + // 下划线
    'FAILED\n \n' + // 失败信息和空行
    'ATTEMPTING AUTOMATED REBOOT...\n' + // 尝试自动重启信息
    '___' + // 下划线
    'FAILED\n' + // 失败信息
    '_ \n \n' + // 下划线和空行
    'MANUAL REBOOT OF ALL SYSTEMS REQUIRED\n' + // 需要手动重启所有系统信息
    '_ \n' + // 下划线和空行
    'USE WASD OR CURSOR KEYS TO MOVE, MOUSE TO SHOOT\n' + // 使用说明信息
    'CLICK TO INITIATE YOUR DEPLOYMENT\n '; // 点击信息

// 定义一个字符串，表示终端文本中的结尾信息
var terminal_text_outro = 
    'ALL SATELLITE LINKS ONLINE\n' + // 所有卫星链接在线信息
    'CONNECTING...___' + // 连接信息和下划线
    'CONNECTION ESTABLISHED\n' + // 连接建立信息
    'RECEIVING TRANSMISSION...___ \n' + // 接收传输信息和下划线以及空行
    
    'SENT: SEP. 13, 2018\n' + // 发送日期信息
    'RCVD: SEP. 13, 2718\n \n' + // 接收日期信息和空行
    
    'THANKS FOR PLAYING ❤_ \n' + // 感谢信息和心形符号
    'I HAVE PREVIOUSLY BEEN A PROUD SPONSOR OF THE JS13K\n' + // 赞助信息
    'COMPETITION SINCE THE VERY FIRST ONE BACK IN 2012.\n' + // 竞赛历史信息
    'HOWEVER, THIS YEAR\'S COMPETITION WAS MY FIRST ONE\n' + // 竞赛历史信息
    'AS A PARTICIPANT AND IT HAS BEEN TREMENDOUS FUN!\n \n' + // 竞赛历史信息和空行
    
    'I WANT TO THANK MY DEAR FRIEND ANDREAS LÖSCH OF\n' + // 感谢朋友信息
    'NO-FATE.NET FOR COMPOSING SOME AWESOME MUSIC ON\n' + // 感谢音乐作者信息
    'SUCH SHORT NOTICE.\n \n' + // 感谢信息和空行
    
    'FURTHER THANKS GO OUT TO THE JS13K STAFF, THE\n' + // 进一步感谢信息
    'SONANT-X DEVELOPERS AND ALL OTHER PARTICIPANTS\n' + // 进一步感谢信息
    'IN THIS YEAR\'S JS13K. SEE YOU NEXT YEAR!\n \n' + // 进一步感谢信息和空行
    
    'DOMINIC__' + // 创建者信息
    'END OF TRANSMISSION'; // 传输结束信息

var terminal_text_buffer = [],
	terminal_state = 0,
	terminal_current_line,
	terminal_line_wait = 100,
	terminal_print_ident = true,
	terminal_timeout_id = 0,
	terminal_hide_timeout = 0;

terminal_text_garbage += terminal_text_garbage + terminal_text_garbage;

function terminal_show() {
	clearTimeout(terminal_hide_timeout);
	a.style.opacity = 1;
	a.style.display = 'block';
}

function terminal_hide() {
	a.style.opacity = 0;
	terminal_hide_timeout = setTimeout(function(){a.style.display = 'none'}, 1000);
}

function terminal_cancel() {
	clearTimeout(terminal_timeout_id);
}

function terminal_prepare_text(text) {
	return text.replace(/_/g, '\n'.repeat(10)).split('\n');
}

function terminal_write_text(lines, callback) {
	if (lines.length) {
		terminal_write_line(lines.shift(), terminal_write_text.bind(this, lines, callback));
	}
	else {
		callback && callback();
	}
}

function terminal_write_line(line, callback) {
	if (terminal_text_buffer.length > 20) {
		terminal_text_buffer.shift();
	}
	if (line) {
		audio_play(audio_sfx_terminal);
		terminal_text_buffer.push((terminal_print_ident ? terminal_text_ident : '') + line);
		a.innerHTML = '<div>'+terminal_text_buffer.join('&nbsp;</div><div>')+'<b>█</b></div>';
	}
	terminal_timeout_id = setTimeout(callback, terminal_line_wait);
}

function terminal_show_notice(notice, callback) {
	a.innerHTML = '';
	terminal_text_buffer = [];

	terminal_cancel();
	terminal_show();
	terminal_write_text(terminal_prepare_text(notice), function(){
		terminal_timeout_id = setTimeout(function(){
			terminal_hide();
			callback && callback();
		}, 2000);
	});
}

function terminal_run_intro(callback) {
	terminal_text_buffer = [];
	terminal_write_text(terminal_prepare_text(terminal_text_title), function(){
		terminal_timeout_id = setTimeout(function(){
			terminal_run_garbage(callback);
		}, 4000);
	});
}

function terminal_run_garbage(callback) {
	terminal_print_ident = false;
	terminal_line_wait = 16;

	var t = terminal_text_garbage,
		length = terminal_text_garbage.length;

	for (var i = 0; i < 64; i++) {
		var s = (_math.random()*length)|0;
		var e = (_math.random()*(length - s))|0;
		t += terminal_text_garbage.substr(s, e) + '\n';
	}
	t += ' \n \n';
	terminal_write_text(terminal_prepare_text(t), function(){
		terminal_timeout_id = setTimeout(function(){
			terminal_run_story(callback);
		}, 1500);
	});
}

function terminal_run_story(callback) {
	terminal_print_ident = true;
	terminal_line_wait = 100;
	terminal_write_text(terminal_prepare_text(terminal_text_story), callback);
}

function terminal_run_outro(callback) {
	c.style.opacity = 0.3;
	a.innerHTML = '';
	terminal_text_buffer = [];

	terminal_cancel();
	terminal_show();
	terminal_write_text(terminal_prepare_text(terminal_text_outro));
}
