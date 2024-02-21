
class entity_t {
	constructor(x, y, z, friction, sprite, init_param) {
		var t = this;
		t.x = x; t.y = y; t.z = z;
		t.vx = t.vy = t.vz = t.ax = t.ay = t.az = 0;
		t.f = friction;
		t.s = sprite;
		t.h = 5;

		t._init(init_param);
		entities.push(t);
	}

	// separate _init() method, because "constructor" cannot be uglyfied
	_init(init_param) {}

	_update() {
		var t = this,
			last_x = t.x, last_z = t.z;

		// velocity
		t.vx += t.ax * time_elapsed - t.vx * _math.min(t.f * time_elapsed, 1);
		t.vy += t.ay * time_elapsed - t.vy * _math.min(t.f * time_elapsed, 1);
		t.vz += t.az * time_elapsed - t.vz * _math.min(t.f * time_elapsed, 1);
		
		// position
		t.x += t.vx * time_elapsed;
		t.y += t.vy * time_elapsed;
		t.z += t.vz * time_elapsed;

		// check wall collissions, horizontal
		if (t._collides(t.x, last_z)) {
			t._did_collide(t.x, t.y);
			t.x = last_x;
			t.vx = 0;
		}

		// check wall collissions, vertical
		if (t._collides(t.x, t.z)) {
			t._did_collide(t.x, t.y);
			t.z = last_z;
			t.vz = 0;
		}
	}

	_collides(x, z) {
		return level_data[(x >> 3) + (z >> 3) * level_width] > 7 || // top left
			level_data[((x + 6) >> 3) + (z >> 3) * level_width] > 7 || // top right
			level_data[((x + 6) >> 3) + ((z+4) >> 3) * level_width] > 7 || // bottom right
			level_data[(x >> 3) + ((z+4) >> 3) * level_width] > 7; // bottom left
	}

	_spawn_particles(amount) {
		for (var i = 0; i < amount; i++) {
			var particle = new entity_particle_t(this.x, 0, this.z, 1, 30);
			particle.vx = (_math.random() - 0.5) * 128;
			particle.vy = _math.random() * 96;
			particle.vz = (_math.random() - 0.5) * 128;
		}
	}

	// 处理当前对象与静态墙壁之间的碰撞
	_did_collide() {
		// 此处通常会实现碰撞处理的逻辑
		// 但在当前代码中，该方法为空，没有实际的实现
		// 可能是因为碰撞处理的逻辑被实现在其他地方，或者暂时没有实现碰撞处理的需求
	}

	// 检查当前对象与其他实体之间的碰撞
	_check(other) {
		// 此处通常会实现碰撞检测的逻辑
		// 但在当前代码中，该方法为空，没有实际的实现
		// 可能是因为碰撞检测的逻辑被实现在其他地方，或者暂时没有实现碰撞检测的需求
	}

	// 接收伤害并更新生命值
	_receive_damage(from, amount) {
		// 减去受到的伤害值
		this.h -= amount;
		// 如果生命值小于等于0
		if (this.h <= 0) {
			// 调用 _kill 方法销毁对象
			this._kill();
		}
	}

	// 标记对象为已死亡状态，并将其添加到待销毁实体列表中
	_kill() {
		if (!this._dead) { // 检查对象是否已经死亡
			this._dead = true; // 将对象标记为已死亡状态
			entities_to_kill.push(this); // 将对象添加到待销毁实体列表中
		}
	}

	// 渲染方法
	_render() {
		var t = this; // 将当前对象保存到变量 t 中
		// 调用 push_sprite 方法渲染精灵
		// 参数为 t 对象的 x-1 坐标、y 坐标、z 坐标和 s 属性
		push_sprite(t.x - 1, t.y, t.z, t.s);
	}
}

// 总的来说，这个类提供了一个框架来定义和管理游戏实体，包括它们的移动、
// 碰撞检测、生命值管理和渲染。可以扩展和定制它以创建具有独特行为和特性的不同类型的实体。