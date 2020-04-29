console.log('这是content script!');
let spocUrl = 'https://cquv3.xuetangx.com/';
let courseID = 30000;
let classID = '52464';
let courseData = {};
let currentCourseIndex = 0;
let currentVideoIndex = 0;

// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function () {
	// 注入自定义JS
	// injectCustomJs();
	// // 给谷歌搜索结果的超链接增加 _target="blank"
	// if (location.host == 'www.google.com.tw') {
	// 	var objs = document.querySelectorAll('h3.r a');
	// 	for (var i = 0; i < objs.length; i++) {
	// 		objs[i].setAttribute('_target', 'blank');
	// 	}
	// 	console.log('已处理谷歌超链接！');
	// }
	// else if (location.host == 'www.baidu.com') {
	// 	function fuckBaiduAD() {
	// 		if (document.getElementById('my_custom_css')) return;
	// 		var temp = document.createElement('style');
	// 		temp.id = 'my_custom_css';
	// 		(document.head || document.body).appendChild(temp);
	// 		var css = `
	// 		/* 移除百度右侧广告 */
	// 		#content_right{display:none;}
	// 		/* 覆盖整个屏幕的相关推荐 */
	// 		.rrecom-btn-parent{display:none;}'
	// 		/* 难看的按钮 */
	// 		.result-op.xpath-log{display:none !important;}`;
	// 		temp.innerHTML = css;
	// 		console.log('已注入自定义CSS！');
	// 		// 屏蔽百度推广信息
	// 		removeAdByJs();
	// 		// 这种必须用JS移除的广告一般会有延迟，干脆每隔一段时间清楚一次
	// 		interval = setInterval(removeAdByJs, 2000);

	// 		// 重新搜索时页面不会刷新，但是被注入的style会被移除，所以需要重新执行
	// 		temp.addEventListener('DOMNodeRemoved', function (e) {
	// 			console.log('自定义CSS被移除，重新注入！');
	// 			if (interval) clearInterval(interval);
	// 			fuckBaiduAD();
	// 		});
	// 	}
	// 	let interval = 0;
	// 	function removeAdByJs() {
	// 		$('[data-tuiguang]').parents('[data-click]').remove();
	// 	}
	// 	fuckBaiduAD();
	// 	// initCustomPanel();
	// 	// initCustomEventListen();
	// }

	if (location.host == 'cquv3.xuetangx.com') {
		// alert("load")
		dispatch = (el, type) => {
			try {
				var evt = document.createEvent('Event');
				evt.initEvent(type, true, true);
				el.dispatchEvent(evt);
			} catch (e) { alert(e) };
		}

		resumePlay = () => {
			var playBtn = document.getElementsByClassName("xt_video_player_play_btn fl")[0];
			setTimeout(() => {
				if (playBtn.className.indexOf('xt_video_player_play_btn_pause') === -1) {
					dispatch(playBtn, "click");
				}
			}, 100);
		}

		removeInterrpt = () => {
			console.log("xxx")
			window.onblur = null;
			document.addEventListener("visibilitychange", resumePlay, true);
		}

		checkLoginStatus = () => {
			var userDiv = $('.nav-user')[0];
			if (userDiv === undefined) return false;
			return true;
		}

		gotoLogin = () => {
			window.location.href = `${spocUrl}?redirect=%2Fmanager%23%2Fstudentcourselist#/home`;
			main();
		}

		// clear = () => {
		// 	clearInterval(timer);
		// }

		getCourseList = (callback) => {
			$.ajax({
				type: "POST",
				url: `${spocUrl}lms/api/v1/course/${courseID}/courseware/`,
				data: { class_id: `${classID}` },
				dataType: "json",
				success: function (data) {
					console.log(data)
					courseData = data.data;
					callback();
				}
			});
		}


		gotoVideo = () => {
			const course = courseData[currentCourseIndex].videosRecord;
			if (courseData[currentCourseIndex].videosRecord.done.indexOf(course.all[currentVideoIndex]) === -1) {
				window.location.href = `${spocUrl}lms#/video/${courseID}/${classID}/${courseData[currentCourseIndex].unit_id}/${course.all[currentVideoIndex]}/0/videoDiscussion`;
				flushCourse();
				gotoNext();
			} else {
				if (currentVideoIndex === course.all.length - 1) {
					currentCourseIndex++;
					currentVideoIndex = 0;
				} else {
					currentVideoIndex++;
				}
				gotoVideo();
			}
		}
		// gotoPlay = () => {
		// 	// window.location.href = 'https://cquv3.xuetangx.com/lms#/30000/52464/schedule';
		// 	//获取进度
		// 	// var continueStudy = $('#continueStudy');
		// 	// if (continueStudy !== undefined) {
		// 	// 	$('.content-list').children()[2].click()
		// 	// }
		// 	timer = setInterval(() => {
		// 		try {
		// 			if (checkPage()) {
		// 				console.log(timer)
		// 				flushCourse();
		// 				clearInterval(timer);
		// 				// clear();
		// 				// clear();
		// 			} else {
		// 				$('.content-list').children()[2].click();
		// 			}
		// 		} catch{
		// 			console.log("等待页面加载")
		// 		}
		// 	}, 2000)
		// }

		isFinished = () => {
			var progress = $('.xt_video_player_seek_handle')[0].style.left;
			return progress === "100%";
		}

		flushCourse = () => {
			try {
				//标清
				$('.xt_video_player_common_list')[1].children[1].click();

				//移除暂停
				// continueStudy.children[0].children[2].click();
				// setTimeout(removeInterrpt, 5000);
				injectCustomJs();


				//2x
				$('.xt_video_player_common_list')[0].children[0].click();

				//muted
				if ($('.xt_video_player_volume .fl').attr('class').split(" ").length === 2) {
					$('.xt_video_player_volume .fl')[0].click();
				}
				console.log("flush")
			} catch{
				setTimeout(() => {
					flushCourse();
				}, 2000);
				setTimeout(() => {
					flushCourse();
				}, 2000);
			}

		}

		gotoNext = () => {
			setInterval(() => {
				try {
					if (isFinished()) {
						getCourseList(gotoVideo);
					}
				} catch{
					getCourseList(gotoVideo);
				}
			}, 5000);
		}

		checkPage = () => {
			url = window.location.href.split('/');
			if (url.indexOf("video") !== -1) {
				return 'video';
			} else if (url.indexOf("schedule") !== -1) {
				return 'schedule';
			} else if (url.indexOf("home") !== -1) {
				return 'home';
			} else if (url.indexOf("studentcourselist") !== -1) {
				return 'studentcourselist';
			} else {
				return 'unknow';
			}
		}

		initCourseInfo = () => {
			url = window.location.href.split('/');
			// spocUrl = url[0] + url[2];
			courseID = url[4];
			classID = url[5];
		}

		gotoCourseSelect = () => {
			window.location.href = `${spocUrl}manager#/studentcourselist`;
		}

		renderSelectTip = () => {
			var panel = document.createElement('div');
			panel.className = 'chrome-plugin-demo-panel';
			panel.innerHTML = `
				<h2>选择课程</h2>
				请进入你要操作的课程
			`;
			document.body.appendChild(panel);
		}


		main = () => {
			// removeInterrpt();
			if (checkLoginStatus()) {
				if (checkPage() === 'video') {
					flushCourse();
					gotoNext();
				} else if (checkPage() === 'schedule') {
					initCourseInfo();
					getCourseList(gotoVideo);
				} else if (checkPage() === 'studentcourselist') {
					renderSelectTip();
				} else {
					gotoCourseSelect();
				}
			} else {
				gotoLogin();
			}
		}

		window.onload = () => {
			main();
		}

		// gotoNext = () => {
		// 	//最外围包裹
		// 	var itemParent = $('.section-video-name').parents('.tree-section-item').next()[0]
		// 	//获取基本item
		// 	var section = itemParent.children[0].children[0];
		// }
	}

	// if (location.host == 'cquv3.xuetangx.com') {
	// 	injectCustomJs();
	// }
});

// function initCustomPanel()
// {
// 	var panel = document.createElement('div');
// 	panel.className = 'chrome-plugin-demo-panel';
// 	panel.innerHTML = `
// 		<h2>injected-script操作content-script演示区：</h2>
// 		<div class="btn-area">
// 			<a href="javascript:sendMessageToContentScriptByPostMessage('你好，我是普通页面！')">通过postMessage发送消息给content-script</a><br>
// 			<a href="javascript:sendMessageToContentScriptByEvent('你好啊！我是通过DOM事件发送的消息！')">通过DOM事件发送消息给content-script</a><br>
// 			<a href="javascript:invokeContentScript('sendMessageToBackground()')">发送消息到后台或者popup</a><br>
// 		</div>
// 		<div id="my_custom_log">
// 		</div>
// 	`;
// 	document.body.appendChild(panel);
// }

// // 向页面注入JS
function injectCustomJs(jsPath) {
	jsPath = jsPath || 'js/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function () {
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.body.appendChild(temp);
}

// // 接收来自后台的消息
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
// {
// 	console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);
// 	if(request.cmd == 'update_font_size') {
// 		var ele = document.createElement('style');
// 		ele.innerHTML = `* {font-size: ${request.size}px !important;}`;
// 		document.head.appendChild(ele);
// 	}
// 	else {
// 		tip(JSON.stringify(request));
// 		sendResponse('我收到你的消息了：'+JSON.stringify(request));
// 	}
// });

// // 主动发送消息给后台
// // 要演示此功能，请打开控制台主动执行sendMessageToBackground()
// function sendMessageToBackground(message) {
// 	chrome.runtime.sendMessage({greeting: message || '你好，我是content-script呀，我主动发消息给后台！'}, function(response) {
// 		tip('收到来自后台的回复：' + response);
// 	});
// }

// // 监听长连接
// chrome.runtime.onConnect.addListener(function(port) {
// 	console.log(port);
// 	if(port.name == 'test-connect') {
// 		port.onMessage.addListener(function(msg) {
// 			console.log('收到长连接消息：', msg);
// 			tip('收到长连接消息：' + JSON.stringify(msg));
// 			if(msg.question == '你是谁啊？') port.postMessage({answer: '我是你爸！'});
// 		});
// 	}
// });

// window.addEventListener("message", function(e)
// {
// 	console.log('收到消息：', e.data);
// 	if(e.data && e.data.cmd == 'invoke') {
// 		eval('('+e.data.code+')');
// 	}
// 	else if(e.data && e.data.cmd == 'message') {
// 		tip(e.data.data);
// 	}
// }, false);


// function initCustomEventListen() {
// 	var hiddenDiv = document.getElementById('myCustomEventDiv');
// 	if(!hiddenDiv) {
// 		hiddenDiv = document.createElement('div');
// 		hiddenDiv.style.display = 'none';
// 		hiddenDiv.id = 'myCustomEventDiv';
// 		document.body.appendChild(hiddenDiv);
// 	}
// 	hiddenDiv.addEventListener('myCustomEvent', function() {
// 		var eventData = document.getElementById('myCustomEventDiv').innerText;
// 		tip('收到自定义事件：' + eventData);
// 	});
// }

// var tipCount = 0;
// // 简单的消息通知
// function tip(info) {
// 	info = info || '';
// 	var ele = document.createElement('div');
// 	ele.className = 'chrome-plugin-simple-tip slideInLeft';
// 	ele.style.top = tipCount * 70 + 20 + 'px';
// 	ele.innerHTML = `<div>${info}</div>`;
// 	document.body.appendChild(ele);
// 	ele.classList.add('animated');
// 	tipCount++;
// 	setTimeout(() => {
// 		ele.style.top = '-100px';
// 		setTimeout(() => {
// 			ele.remove();
// 			tipCount--;
// 		}, 400);
// 	}, 3000);
// }