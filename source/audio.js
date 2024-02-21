// 创建一个新的 Web Audio 上下文对象，如果浏览器支持 webkitAudioContext，则使用它，否则使用标准的 AudioContext
var audio_ctx = new (window.webkitAudioContext || window.AudioContext)();

// 定义用于存储不同音效的变量
var audio_sfx_shoot; // 射击音效
var audio_sfx_hit; // 击中音效
var audio_sfx_hurt; // 受伤音效
var audio_sfx_beep; // 响铃音效
var audio_sfx_pickup; // 捡起物品音效
var audio_sfx_terminal; // 终端音效
var audio_sfx_explode; // 爆炸音效

function audio_init(callback) {
    // 使用 sonantxr_generate_song 函数生成音乐的音频缓冲区，并在生成完毕后播放音乐并调用回调函数
    sonantxr_generate_song(audio_ctx, music_dark_meat_beat, function(buffer){
        audio_play(buffer, true); // 播放音乐
        callback(); // 调用回调函数
    });
    
    // 使用 sonantxr_generate_sound 函数生成射击音效的音频缓冲区，并将其存储到对应的变量中
    sonantxr_generate_sound(audio_ctx, sound_shoot, 140, function(buffer){
        audio_sfx_shoot = buffer; // 存储射击音效
    });

    // 使用 sonantxr_generate_sound 函数生成击中音效的音频缓冲区，并将其存储到对应的变量中
    sonantxr_generate_sound(audio_ctx, sound_hit, 134, function(buffer){
        audio_sfx_hit = buffer; // 存储击中音效
    });

    // 使用 sonantxr_generate_sound 函数生成响铃音效的音频缓冲区，并将其存储到对应的变量中
    sonantxr_generate_sound(audio_ctx, sound_beep, 173, function(buffer){
        audio_sfx_beep = buffer; // 存储响铃音效
    });

    // 使用 sonantxr_generate_sound 函数生成受伤音效的音频缓冲区，并将其存储到对应的变量中
    sonantxr_generate_sound(audio_ctx, sound_hurt, 144, function(buffer){
        audio_sfx_hurt = buffer; // 存储受伤音效
    });

    // 使用 sonantxr_generate_sound 函数生成捡起物品音效的音频缓冲区，并将其存储到对应的变量中
    sonantxr_generate_sound(audio_ctx, sound_pickup, 156, function(buffer){
        audio_sfx_pickup = buffer; // 存储捡起物品音效
    });

    // 使用 sonantxr_generate_sound 函数生成终端音效的音频缓冲区，并将其存储到对应的变量中
    sonantxr_generate_sound(audio_ctx, sound_terminal, 156, function(buffer){
        audio_sfx_terminal = buffer; // 存储终端音效
    });

    // 使用 sonantxr_generate_sound 函数生成爆炸音效的音频缓冲区，并将其存储到对应的变量中
    sonantxr_generate_sound(audio_ctx, sound_explode, 114, function(buffer){
        audio_sfx_explode = buffer; // 存储爆炸音效
    });
};

function audio_play(buffer, loop) {
    // 创建一个新的音频源节点
    var source = audio_ctx.createBufferSource();
    // 设置音频源节点的缓冲区为传入的 buffer
    source.buffer = buffer;
    // 设置音频源节点是否循环播放
    source.loop = loop;
    // 将音频源节点连接到音频上下文的目标（通常是扬声器）
    source.connect(audio_ctx.destination);
    // 开始播放音频
    source.start();
};