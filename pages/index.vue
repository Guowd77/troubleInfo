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
			<!-- <picker class="user" @change="chooseFocusHour" :value="ndex" :range="array" range-key="name">
				<view class="uni-input">时间</view>
			</picker> -->
			<picker class="user" mode="multiSelector" @change="chooseFocusPlace" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
				<view class="uni-input">区域</view>
			</picker>
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
			<view v-if="modalShow" class="cu-modal" :class="modalName=='Image'?'show':''"  @touchmove.stop.prevent="moveHandle">
				<view class="cu-dialog">
					<view v-show="!showVideo" class="bg-img"  v-bind:style="{backgroundImage:'url(http://118.121.27.25:18080/oil/upload/'+showList[modalNumber].filename+')',height:500+'upx'}">
						<!-- 'url(http://118.121.27.25:18080/oil/upload/'+showList[modalNumber].filename+')' -->
						<!-- <view class="cu-bar justify-end text-red text-bold">
							<view class="action" @tap="hideModal">
								<text class="cuIcon-close "></text>
							</view>
						</view> -->
					</view>
					<video v-if="showVideo" id="myVideo" style="margin-top: 20upx;"  @error="videoErrorCallback" v-bind:src="videoUrl"
                    ></video>  <!-- src="http://118.121.27.25:18080/oil/upload/0057_20190717083341_02.MP4" -->
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
					<view class="flex flex-wrap">
						<view class="basis-df cu-bar bg-grey text-white">
							<view class="action flex-sub  solid-left" @tap="switchVideo">播放/关闭视频</view>
						</view>
						<view class="basis-df cu-bar bg-red text-white">
							<view class="action flex-sub  solid-left" @tap="hideModal">我知道了</view>
						</view>
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
	import {getInfo,getDepart,getVideo} from '../api.js'
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
				seaListDepart:'',
				showList:[],
				showVideo:0,
				haveVideo:0,
				videoUrl:'',
				page:0,
				loadText:'',
				/* array:[
					{time:'00:00'},
					{time:'01:00'},
					{time:'02:00'},
					{time:'03:00'},
					{time:'04:00'},
					{time:'05:00'},
					{time:'06:00'},
					{time:'07:00'},
					{time:'08:00'},
					{time:'09:00'},
					{time:'10:00'},
					{time:'11:00'},
					{time:'12:00'},
					{time:'13:00'},
					{time:'14:00'},
					{time:'15:00'},
					{time:'16:00'},
					{time:'17:00'},
					{time:'18:00'},
					{time:'19:00'},
					{time:'20:00'},
					{time:'21:00'},
					{time:'22:00'},
					{time:'23:00'}
				], */
				multiArray: [
					['成都市'],
					[],
					[]
				],
				multiIndex: [0, 0, 0],
				allList:[{
					name:'成都市',
					child1:[]
				}],
				focusPlace:''
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
				this.showVideo=0;
				this.modalName = "Image";
				this.modalShow=1;
				this.haveVideo=0;
				this.modalNumber=index;
				let data={
					filename:this.showList[index].filename.substring(0,this.showList[index].filename.length-4)
				}
				console.log(data)
				getVideo(data).then(res=>{
					if(res.data.msg=="success"){
						if(res.data.data.type=='jpg'){
							this.haveVideo=1
							//this.videoUrl=res.data.data.path
							this.videoUrl="http://118.121.27.25:18080/oil/upload/abc.mp4"
						}
					}
					else{
						this.haveVideo=0
					}
				})
			},
			switchVideo(){
				if(this.haveVideo==1){
					this.showVideo=!this.showVideo
					console.log(this.videoUrl)
				}
				else{
					uni.showToast({
						title: '本条无视频',
						icon:'none',
						duration: 1500,
						});
				}
			},
			videoErrorCallback: function(e) {
            uni.showModal({
                content: e.target.errMsg,
                showCancel: false
            })
            },
			hideModal() {
				this.modalName = null;
				this.modalShow=0;
			},
			open(){
				this.$refs.calendar.open();
			},
			chooseFocusPlace(e){
				this.focusPlace=this.allList[e.detail.value[0]].child1[e.detail.value[1]].child2[e.detail.value[2]];
				console.log(this.focusPlace);
				this.showList=[];
				this.page=0;
				console.log(this.seaList)
				this.seaListDepart=this.searchDepart(this.focusPlace);
				if(this.seaListDepart.length!=0){
					for (let i=0+this.page*15,j=i;i<j+15&&i<this.seaListDepart.length;i++){
						this.showList.push(this.seaListDepart[i]);
					}
					if(this.showList.length<this.seaListDepart.length){
							this.loadText="上拉加载更多";
						} 
						else if(this.showList.length==this.seaListDepart.length){
							this.loadText="加载完毕";
						}
				}
				else if(this.seaListDepart.length==0){
					this.loadText="本日此加油站没有数据";
				}
			},
			confirm(e) { //选择日期
				this.page=0;
				console.log(e.fulldate);
				this.focusDate=e.fulldate;
				this.seaList=[];
				this.seaList=this.search(e.fulldate);
				this.seaList=sortArray(this.seaList);
				this.showList=[];
				if(this.seaList.length!=0){
					for (let i=0;i<this.seaList.length;i++){
						this.seaList[i].newtime=this.seaList[i].time.substring(11,16)
					}
					for (let i=0+this.page*15,j=i;i<j+15&&i<this.seaList.length;i++){
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
					this.loadText="本日没有数据"
				}
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
			searchDepart(keywords){
				var newList = []
				console.log(this.seaList)
				this.seaList.forEach(item => {
				if (item.departname.indexOf(keywords) != -1) {
					newList.push(item)
					}
					})
				return newList
			},
			bindMultiPickerColumnChange: function(e) {
				this.multiIndex[e.detail.column] = e.detail.value
				/* for(var i = 0;i<this.allList[0].length;i++){
					if(e.detail.column==i){
						for(var j=0;j<this.allList[0].child1[i].length;j++){
							if(this.multiIndex[i])
						}
					}
				} */
				switch (e.detail.column) {
					case 0: //拖动第1列
						this.multiIndex.splice(1, 1, 0)
						this.multiIndex.splice(2, 1, 0)
						break
					case 1: //拖动第2列
						for(var i=0;i<this.allList[0].child1.length;i++){
							if(this.multiIndex[1]==i){
								this.multiArray[2]=this.allList[0].child1[i].child2
								break
							}
						}
						this.multiIndex.splice(2, 1, 0)
						break
				}
				this.$forceUpdate()
			},
		},
		onLoad(option) {
			this.code=option.code;
			this.username=option.name;
			var dt=new Date();
			var y = dt.getFullYear();
            var m = (dt.getMonth() + 1).toString().padStart(2, '0')
            var d = dt.getDate().toString().padStart(2, '0')
			this.focusDate=`${y}-${m}-${d}`;
			const data={
				departid:this.code
			}
			var that=this;
			getDepart(data).then(res=>{//根据返回的地区数据创建树形结构，成都市-xx区-xx加油站
				if(res.data[0].orgcode.length==3){
					for(var i=0;i<res.data.length;i++){
						if(res.data[i].orgcode.length==3){
							that.allList[0].child1.push({name:res.data[i].childname,child2:[]})
							that.multiArray[1].push(res.data[i].childname)
						}
						else if(res.data[i].orgcode.length>3){
							for(var j=0;j<that.allList[0].child1.length;j++){
								if(res.data[i].departname==that.allList[0].child1[j].name){
									that.allList[0].child1[j].child2.push(res.data[i].childname)
									if(j==0){
										that.multiArray[2].push(res.data[i].childname)//初始的第三列 (前两列分别为第一个选项)
									}
								}
							}
						}
					}
				}
				else if(res.data[0].orgcode.length==6){
					that.allList[0].child1.push({name:res.data[0].departname,child2:[]})
					that.multiArray[1].push(res.data[0].departname)
					for(var i=0;i<res.data.length;i++){
						if(res.data[i].departname==that.allList[0].child1[0].name){
							that.allList[0].child1[0].child2.push(res.data[i].childname)
							that.multiArray[2].push(res.data[i].childname)//初始的第三列 (前两列分别为第一个选项)
						}
					}
				}
				else{
					that.multiArray= [
						[],
						['服务器出错'],
						[]
					]
				}
				console.log(that.allList)
			})
		},
		mounted() {
			const data={
				departid:this.code
			}
			var that=this;
			getInfo(data).then(res=>{
				that.list=res.data;
				that.seaList=that.search(that.focusDate);
				that.seaList=sortArray(that.seaList);
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
				if(that.seaList.length==0){
					that.loadText="本日没有数据"
				}
				console.log(that.list)
				uni.hideLoading()
			})
		},
		onReachBottom(){
			this.page=this.page+1;
			if(this.seaList.length!=0){
				for (let i=0+this.page*15,j=i;i<j+15&&i<this.seaList.length;i++){
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
		text-align: center;
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
