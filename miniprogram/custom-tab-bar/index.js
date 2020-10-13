Component({
	data: {
		active: 0,
		list: [
			{
				icon: 'apps-o',
				text: '首页',
				url: '/pages/hot/hot'
			},
			{
				icon: 'shop-o',
				text: '闲置',
				url: '/pages/buy/buy'
			},
			{
				icon: 'home-o',
				text: '租房',
				url: '/pages/house/house'
			},
			{
				icon: 'user-o',
				text: '我的',
				url: '/pages/mine/mine'
			}
		]
	},

	methods: {
		onChange(event) {
			this.setData({ active: event.detail });
			wx.switchTab({
				url: this.data.list[this.data.active].url
			});
		},

		init() {
			const page = getCurrentPages().pop();
			this.setData({
				active: this.data.list.findIndex(item => item.url === `/${page.route}`)
			});
		}
	},

	options: {
		addGlobalClass: true,
	}
});
