<script>
	import Vue from 'vue'
	export default {
		onLaunch: function() {
			uni.getSystemInfo({
				success:function(res){
					Vue.prototype.StatusBar=res.statusBarHeight;
					if (res.platform=="android"){
						Vue.prototype.CustomBar=res.statusBarHeight+50;
					}else{
						Vue.prototype.CustomBar=res.statusBarHeight+45;
					}
				}
			})
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "colorui/main.css";
	@import "colorui/icon.css";

</style>
