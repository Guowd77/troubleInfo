import request from 'request.js'

export function userlogin(data) { 
	return request(data, "getUser.do",'POST')
}
export function getInfo(data){
	return request(data,"getAll.do",'GET')
}