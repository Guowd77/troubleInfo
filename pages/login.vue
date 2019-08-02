<template>
	<view class="content">
		<view class="header">
			<image class="head-img" src="../static/head.png"></image>
		</view>
		
		<view class="list">
			<view class="list-cell">
				<image class="list-img" src="../static/1.png"></image>
				<input class="title" v-model="account" type="text" confirm-type="done"   placeholder="请输入账号" />
			</view>
		</view>
		
		<view class="list">
			<view class="list-cell">
				<image class="list-img" src="../static/2.png"></image>
				<input class="title" v-model="password" password="true" type="text" confirm-type="done"  placeholder="请输入密码"/>
			</view>
		</view>
		
		<view class="login-btn" hover-class="login-btn-hover" @tap="bindLogin()">
			<text>登录</text>
		</view>
		
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {userlogin} from '../api.js'
	export default {
		data() {
			return {
				title: '',
				account:'',
				password:'',
				oldAccount:'',
				oldPassword:''
			}
		},
		onLoad() {
			try {
                const account = uni.getStorageSync('account');
				const password = uni.getStorageSync('password');
				const logout = uni.getStorageSync('logout');
				this.account=account;
				this.password=password;
                if (!logout&&password) {
					const data={
						username:account,
						password:password
					};
					userlogin(data).then(res=>{
						console.log(res.data)
						try {
								uni.setStorageSync('logout', 0);
						    } catch (e) {
						        // error
						    }
						if(res.data.status==0){
							uni.showToast({
								title: '登录成功',
								icon:'none'
							});
							uni.redirectTo({
								url:'index?code='+res.data.org_code+'&name='+res.data.userkey,
								
							})
						}
					})
                }
            } catch (e) {
                // error
            }
			

		},
		methods: {
			bindLogin(){
				
				const data={
					username:this.account,
					password:this.password
				};
				console.log(data);
				if(this.account.length==0){
					uni.showToast({
						title:'请输入账号',
						icon:'none'
					});
					return;
				}
				if(this.password.length==0){
					uni.showToast({
						title: '请输入密码',
						icon:'none'
					});
					return;
				}
				var that=this;
				userlogin(data).then(res=>{
					console.log(res.data)
					if(res.data.status==0){
						try{
							uni.setStorageSync('account', that.account);
							uni.setStorageSync('password',that.password);
							uni.setStorageSync('logout',0);
						}catch(e){
							
						}
						uni.redirectTo({
							url:'index?code='+res.data.org_code+'&name='+res.data.userkey,
							
						})
					}
				})
				
			}
		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-top: 60upx;
	}
	
	.header{
		width: 426upx;
		height: 320upx;
		margin-top: 72upx;
		margin-bottom: 12upx;
		margin-left: auto;
		margin-right: auto;
	}
	
	.head-img{
		width: 426upx;
		height: 320upx;
	}
	
	.list{
		display: flex;
		flex-direction: column;
		padding: 48upx 70upx 32upx 70upx;
	}
	
	.list-cell{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 100upx;
		color:#333333;
		border-bottom: 1upx solid rgba(230,230,230,1);
	}
	
	.list-cell .list-img{
		width: 40upx;
		height: 40upx;
	}
	.list-cell .title{
		flex: 1;
		text-align: left;
		font-size: 32upx;
		line-height: 100upx;
		margin-left: 160upx;
	}
	
	.login-btn{
		color: #FFFFFF;
		font-size: 34upx;
		width: 470upx;
		height: 100upx;
		background:#c43a30;
		border-radius:50upx;
		line-height: 100upx;
		text-align: center;
		margin-left: auto;
		margin-right: auto;
		margin-top: 100upx;	
	}
	
	.login-btn-hover {
		background:#d09693;
	}
</style>