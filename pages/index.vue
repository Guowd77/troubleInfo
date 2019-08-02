<template>
	<view class="content">
		<view class="username flex  justify-between align-center ">
			<view class="">
				您好,{{username}}
			</view>
			<view  class="logout" @click="logout">退出</view>
		</view>
		<view class="header">
			<view class="calendar">
				<image class="cal-img" src="../static/calendar.png" @click="open"></image>
			</view>
			<view class="title">{{focusDate}}</view>
			<view class="user" @click="chooseSpace">区域</view>
		</view>
		
		    <view class="body">
			<view class="" v-for="(item,index) in showList" v-key="item.id">
				<view class="" @click="showModal(index)" >
					<view class="item">
						<view class="name">{{item.safeRiskName}}</view>
						<view class="address">
							<image src="../static/address.png"></image>
							{{item.departname}}</view>
						<view class="time">
							<image src="../static/time.png"></image>
							{{item.newtime}}</view>
					</view>
				</view>
				<view class="liner"></view>
			</view>
			<view v-if="modalShow" class="cu-modal" :class="modalName=='Image'?'show':''">
				<view class="cu-dialog">
					<!-- <view class="bg-img" v-bind:style="{backgroundImage: 'url(http://122.112.219.13:8080/oil/upload/'+showList[modalNumber].filename+')',height:300+'upx'}">
						<view class="cu-bar justify-end text-red text-bold">
							<view class="action" @tap="hideModal">
								<text class="cuIcon-close "></text>
							</view>
						</view>
					</view> -->
					<video id="myVideo" style="margin-top: 20upx;" src="https://dcloud-img.oss-cn-hangzhou.aliyuncs.com/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126.mp4"
                    ></video>
					<view class="modal">
						<view class="mname">{{showList[modalNumber].safeRiskName}}</view>
						<view class="maddres">
							<text class="cuIcon-location text-red "></text>
							{{showList[modalNumber].departname}}</view>
						<view class="mtime">
							<text class="cuIcon-time text-red"></text>
							{{showList[modalNumber].newtime}}</view>
					</view>
					<view class="mliner"></view>
					<view class="mtext">
						{{showList[modalNumber].saferiskdetails}}
					</view>
					
					<view class="cu-bar bg-red text-white radius">
						<view class="action margin-0 flex-sub  solid-left" @tap="hideModal">我知道了</view>
					</view>
				</view>
			</view>
			<view class="loadText">
				{{loadText}}
			</view>
		</view>
		<uni-calendar 
		ref="calendar"
		:insert="false"
		@confirm="confirm"
		 />
		 
	</view>
</template>

<script>
	import {uniCalendar} from "@/components/uni-calendar/uni-calendar"
	import {getInfo} from '../api.js'
	import {sortArray} from '../request.js'
	export default{
		components: {
			uniCalendar
		},
		data(){
			return{
				modalNumber:0,
				username:'',
				modalStyle:{},
				focusDate:'',
				code:'',
				list:'',
				modalName: null,
				modalShow:0,
				seaList:'',
				showList:[],
				page:0,
				loadText:''
			}
		},
		methods:{
			logout(){
				try {
						uni.setStorageSync('logout', 1);
                    } catch (e) {
                        // error
                    }
				uni.redirectTo({
					url:'login',
				})
			},
			showModal(index) {
				this.modalName = "Image";
				this.modalShow=1;
				this.modalNumber=index;
			},
			hideModal() {
				this.modalName = null;
				this.modalShow=0;
			},
			open(){
				this.$refs.calendar.open();
			},
			confirm(e) {
				this.page=0;
				console.log(e);
				console.log(e.fulldate);
				this.focusDate=e.fulldate;
				this.seaList=[];
				this.seaList=this.search(e.fulldate);
				this.seaList=sortArray(this.seaList);
				console.log(this.seaList);
				this.showList=[];
				if(this.seaList.length!=0){
					for (let i=0+this.page*15,j=i;i<j+15&&i<this.seaList.length;i++){
						this.seaList[i].newtime=this.seaList[i].time.substring(11,16);
						this.showList.push(this.seaList[i]);
					}
					if(this.showList.length<this.seaList.length){
							this.loadText="上拉加载更多";
						} 
						else if(this.showList.length==this.seaList.length){
							this.loadText="加载完毕";
						}
				}
				else if(this.seaList.length==0){
					this.loadText="本日没有数据";
				}
				console.log(this.showList)
			},
			search(keywords){
				var newList = []
				this.list.forEach(item => {
				if (item.time.indexOf(keywords) != -1) {
					newList.push(item)
					}
					})
				return newList
			},
			chooseSpace(){
				
			}
			
		},
		onLoad(option) {
			this.code=option.code;
			this.username=option.name;
			var dt=new Date();
			var y = dt.getFullYear();
            var m = (dt.getMonth() + 1).toString().padStart(2, '0')
            var d = dt.getDate().toString().padStart(2, '0')
			this.focusDate=`${y}-${m}-${d}`;
		},
		mounted() {
			const data={
				departid:this.code
			}
			var that=this;
			console.log(data);
			getInfo(data).then(res=>{
				that.list=res.data;
				console.log(that.list);
				console.log(that.list[0]);
				console.log(that.list[0].time);
				that.seaList=that.search(that.focusDate);
				that.seaList=sortArray(that.seaList);
				console.log(that.seaList);
				if(that.seaList.length!=0){
					for (let i=0,j=i;i<j+15&&i<that.seaList.length;i++){
						that.seaList[i].newtime=that.seaList[i].time.substring(11,16);
						that.showList.push(that.seaList[i]);
					}
					if(that.showList.length<that.seaList.length){
						that.loadText="上拉加载更多";
					} 
					else if(that.showList.length==that.seaList.length){
						that.loadText="加载完毕";
					}
				}
				else if(that.seaList.length==0){
					that.loadText="本日没有数据"
				}
			})
		},
		onReachBottom(){
			console.log('触发');
			this.page=this.page+1;
			if(this.seaList.length!=0){
				for (let i=0+this.page*15,j=i;i<j+15&&i<this.seaList.length;i++){
					this.seaList[i].newtime=this.seaList[i].time.substring(11,16);
					this.showList.push(this.seaList[i])
				}
				if(this.showList.length<this.seaList.length){
						this.loadText="上拉加载更多";
					} 
					else if(this.showList.length==this.seaList.length){
						this.loadText="--加载完毕--";
					}
			}
				else if(this.seaList.length==0){
					this.loadText="本日没有数据"
				}
				uni.showLoading({
					title: '加载中'});
					
				setTimeout(function () {
					uni.hideLoading();
				}, 300);
		}
	}
</script>

<style>
	.username{
		
		height: 72upx;
		width: 94%;
		position: fixed;
		background-color: #FFFFFF;
		z-index: 0;
		margin-left: 3%;
		
	}
	.logout{
		color: #CE3C39;
	}
	.address{
		z-index: -1;
	}
	.time{
		z-index: -1;
	}
	.name{
		width: 40%;
		font-size: auto;
	}
	.header{
		background: #CE3C39;
		width: 100%;
		height: 72upx;
		display: flex;
		flex-direction: row;
		position: fixed;
		align-items: center;
		justify-content:space-between ;
		margin-top: 72upx;
		z-index: 0;
	}
	.calendar{
		width: 60upx;
		height: 60upx;
	}
	.cal-img{
		width: 60upx;
		height: 60upx;
		padding: 0 24upx;
	}
	.title{
		
	}
	.user{

		padding-right: 3%;
		color: #F3F3F3;
	}
	.body{
		display: flex;
		flex-direction: column;
		padding-top: 158upx;
	}
	.loadText{
		padding-top: 10upx;
		padding-bottom:10upx ;
		height: 40upx;
		margin-left: 38%;
		color: #8799A3;
		z-index: -1;
	}
	.item{
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		height: 72upx;
		font-size: 30upx;
		margin-top: 16upx;
	}
	.item image{
		width: 44upx;
		height: 44upx;
		vertical-align: middle;
	}
	.liner{
		width: 100%;
		height: 1upx;
		background-color: #CCCCCC;
		position: relative;
		top:-10upx;
		z-index: -1;
	}
	.modal{
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		margin-top: 50upx;
		height: 72upx;
		font-size: 36upx;
	}
	.mname{
		font-size: 36upx;
	}
	.maddres{
		font-size: 30upx;
		margin-top: 5upx;
	}
	.mtime{
		font-size: 30upx;
		margin-top: 5upx;
	}
	.mliner{
		width: 95%;
		margin-top:-20upx;
		margin-left: 2.5%;
		height: 1upx;
		background-color: #CCCCCC;
		position: relative;
	}
	.mtext{
		height: 200upx;
		font-size: 30upx;
		text-align: left;
		padding: 30upx 4% 0 4%;
	}
</style>
