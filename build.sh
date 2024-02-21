cat \  # 使用cat命令将多个文件连接在一起
	source/game.js \  # 这是游戏逻辑的主要代码文件
	source/random.js \  # 这是生成随机数的辅助函数文件
	source/renderer.js \  # 这是处理渲染的文件
	source/entity.js \  # 这是处理游戏实体的文件
	source/entity-player.js \  # 这是处理玩家实体的文件
	source/entity-cpu.js \  # 这是处理CPU实体的文件
	source/entity-plasma.js \  # 这是处理等离子实体的文件
	source/entity-spider.js \  # 这是处理蜘蛛实体的文件
	source/entity-sentry.js \  # 这是处理哨兵实体的文件
	source/entity-particle.js \  # 这是处理粒子实体的文件
	source/entity-health.js \  # 这是处理生命值实体的文件
	source/entity-explosion.js \  # 这是处理爆炸效果实体的文件
	source/sonantx-reduced.js \  # 这是一个音频库的文件
	source/music-dark-meat-beat.js \  # 这是处理音乐的文件
	source/sound-effects.js \  # 这是处理音效的文件
	source/audio.js \  # 这是处理音频的文件
	source/terminal.js \  # 这是处理终端的文件
	source/main.js \  # 这是游戏的主要逻辑文件
	> build/underrun.js  # 将上述所有文件合并并输出到 build/underrun.js 文件中

# 执行 shrinkit.js 脚本，将输入文件 build/underrun.js 压缩，然后输出到 build/underrun.compact.js
node shrinkit.js build/underrun.js > build/underrun.compact.js

# 使用 uglifyjs 进一步压缩 build/underrun.compact.js，并生成一个更易读的版本到 build/underrun.min.beauty.js
./node_modules/uglify-es/bin/uglifyjs build/underrun.compact.js \
	--compress --screw-ie8 --mangle toplevel -c --beautify --mangle-props regex='/^_/;' \
	-o build/underrun.min.beauty.js
	
# 使用 uglifyjs 压缩 build/underrun.compact.js，生成一个压缩后的版本到 build/underrun.min.js
./node_modules/uglify-es/bin/uglifyjs build/underrun.compact.js \
	--compress --screw-ie8 --mangle toplevel --mangle-props regex='/^_/;' \
	-o build/underrun.min.js

# 删除 build/underrun.zip 文件
rm build/underrun.zip

# 使用 sed 命令，从 source/html-template.html 文件中找到包含 'GAME_SOURCE' 的行，
# 并将 build/underrun.min.js 文件的内容插入到这行之后，然后删除原来的 'GAME_SOURCE' 行，
# 最终输出到 underrun.html 文件中
sed -e '/GAME_SOURCE/{r build/underrun.min.js' -e 'd}' source/html-template.html > underrun.html

# 创建一个 zip 文件 build/underrun.zip，并向其中添加以下文件：
# m/q2.png、m/l1.png、m/l2.png、m/l3.png、以及上一步生成的 underrun.html 文件
# 使用 -9 参数表示使用最高的压缩级别
zip -9 build/underrun.zip m/q2.png m/l1.png m/l2.png m/l3.png underrun.html

# 列出 build/ 目录下的所有文件，包括隐藏文件，以及每个文件的详细信息
ls -la build/

# 将 underrun.html 文件移动到 build/ 目录下，并重命名为 underrun.html
mv underrun.html build/underrun.html
