import store from './store'

var requestURL='http://122.112.219.13:8080/oil/'//api地址
function Request(data, url, method) {
	//console.log(data)
	var Reurl='';
	if(url =='getUser.do'){
		Reurl=requestURL + url+'?username='+data.username+'&password='+data.password;
	}
	else{
		Reurl=requestURL + url
	};
	return new Promise((resolve, reject) => {
		uni.showLoading()
		uni.request({
			url:Reurl,
			method:method,
			data:data,
			success: (res) => {
				uni.hideLoading()
				console.log(res)
				var data = res.data
				resolve(res,data)
				if(data.status==0){
					uni.showToast({
						title: '登陆成功',
						icon:'none',
						mask: false,
						duration: 1500
					});
				}
				if(data.status==1){
					uni.showToast({
						title: '账号或密码错误',
						icon:'none',
						mask: false,
						duration: 1500
					});
				}

			},
			fail: err => {
				uni.showToast({
					title: '服务器异常',
					icon:'none',
					mask: false,
					duration: 1500
				});
				uni.hideLoading()
				console.log('err')
				reject(err)
			}
		})
	}).catch(err => console.log(err))
}

function sortNumber(a,b)
{
	var value1=a.sort;
	var value2=b.sort;
return value1 - value2;
}
export default function(data, url, method) {
	return Request(data, url, method)
}
export function sortArray(array){
	if(array.length!=0){
		for(let i=0;i<array.length;i++){
			array[i].sort=array[i].time.substring(11,16);
			array[i].sort=array[i].sort.split(":").join("");
			array[i].sort=parseInt(array[i].sort);
		}
		array=array.sort(sortNumber);
		return array
	}
	else{
		return array
	}
}