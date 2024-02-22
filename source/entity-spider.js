
class entity_spider_t extends entity_t {
	_init() {
		// 初始化动画时间为0
		this._animation_time = 0;
		// 初始化选择目标的计数器为0
		this._select_target_counter = 0;
		// 将目标 x 坐标初始化为当前蜘蛛的 x 坐标
		this._target_x = this.x;
		// 将目标 z 坐标初始化为当前蜘蛛的 z 坐标
		this._target_z = this.z;
	}	
	
	_update() {
		var t = this,
			// 计算蜘蛛与目标 x 坐标之间的距离
			txd = t.x - t._target_x,
			// 计算蜘蛛与目标 z 坐标之间的距离
			tzd = t.z - t._target_z,
			// 计算蜘蛛与玩家实体之间的 x 距离
			xd = t.x - entity_player.x,
			// 计算蜘蛛与玩家实体之间的 z 距离
			zd = t.z - entity_player.z,
			// 计算蜘蛛与玩家实体之间的总距离
			dist = _math.sqrt(xd * xd + zd * zd);
	
		// 减少选择目标的计数器
		t._select_target_counter -= time_elapsed;
	
		// 在一段时间后选择新的目标
		if (t._select_target_counter < 0 && dist < 64) {
			// 重新设定选择目标的计数器为随机值
			t._select_target_counter = _math.random() * 0.5 + 0.3;
			// 将目标 x 坐标设定为玩家的 x 坐标
			t._target_x = entity_player.x;
			// 将目标 z 坐标设定为玩家的 z 坐标
			t._target_z = entity_player.z;
		}
		
		// 根据与目标的距离设置速度
		t.ax = _math.abs(txd) > 2 ? (txd > 0 ? -160 : 160) : 0;
		t.az = _math.abs(tzd) > 2 ? (tzd > 0 ? -160 : 160) : 0;
	
		super._update();
		// 更新动画时间
		this._animation_time += time_elapsed;
		// 根据动画时间更新蜘蛛大小
		this.s = 27 + ((this._animation_time * 15) | 0) % 3;
	}	

	_receive_damage(from, amount) {
		// 调用父类的 _receive_damage 方法来处理伤害
		super._receive_damage(from, amount);
		// 将受到伤害的实体的速度赋值给受伤的蜘蛛
		this.vx = from.vx;
		this.vz = from.vz;
		// 生成粒子效果
		this._spawn_particles(5);
	}	

	_check(other) {
		// 如果碰撞的实体是其他蜘蛛
		if (other instanceof entity_spider_t) {
			// 判断要在哪个轴上进行反弹，选择距离更远的轴
			var axis = (_math.abs(other.x - this.x) > _math.abs(other.z - this.z)
				? 'x' 
				: 'z');
			// 确定反弹的量
			var amount = this[axis] > other[axis] ? 0.6 : -0.6;
	
			// 调整当前蜘蛛和其他蜘蛛的速度以进行反弹
			this['v'+axis] += amount;
			other['v'+axis] -= amount;
		}
		// 如果碰撞的实体是玩家
		else if (other instanceof entity_player_t) {
			// 反弹玩家并造成伤害
			this.vx *= -1.5;
			this.vz *= -1.5;
			other._receive_damage(this, 1);
		}
	}	

	_kill() {
		// 调用父类的 _kill 方法
		super._kill();
		// 创建爆炸实体
		new entity_explosion_t(this.x, 0, this.z, 0, 26);
		// 触发相机震动效果
		camera_shake = 1;
		// 播放爆炸音效
		audio_play(audio_sfx_explode);
	}	
}
