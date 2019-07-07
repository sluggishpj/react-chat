// 根据用户信息 返回跳转地址
export function getRedirectPath({type, avatar}) {
    let targetURL = type === 'boss'? '/boss':'/genius';
    if(!avatar) {
        targetURL += 'info';
    }
    console.log('targetURL', targetURL);
    return targetURL;
}