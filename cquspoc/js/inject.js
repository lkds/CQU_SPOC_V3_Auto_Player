// 通过postMessage调用content-script
// function invokeContentScript(code)
// {
// 	window.postMessage({cmd: 'invoke', code: code}, '*');
// }
// // 发送普通消息到content-script
// function sendMessageToContentScriptByPostMessage(data)
// {
// 	window.postMessage({cmd: 'message', data: data}, '*');
// }

// 通过DOM事件发送消息给content-script
// (function() {
// 	var customEvent = document.createEvent('Event');
// 	customEvent.initEvent('myCustomEvent', true, true);
// 	// 通过事件发送消息给content-script
// 	function sendMessageToContentScriptByEvent(data) {
// 		data = data || '你好，我是injected-script!';
// 		var hiddenDiv = document.getElementById('myCustomEventDiv');
// 		hiddenDiv.innerText = data
// 		hiddenDiv.dispatchEvent(customEvent);
// 	}
// 	window.sendMessageToContentScriptByEvent = sendMessageToContentScriptByEvent;
// })();
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
// window.onload = () => {
// 	removeInterrpt();
// }
removeInterrpt();
// let spocUrl = 'https://cquv3.xuetangx.com/';
// let courseID = '52464';
// let courseData = {};
// let currentCourseIndex = 0;
// let currentVideoIndex = 0;


// // alert("load")
// dispatch = (el, type) => {
// 	try {
// 		var evt = document.createEvent('Event');
// 		evt.initEvent(type, true, true);
// 		el.dispatchEvent(evt);
// 	} catch (e) { alert(e) };
// }

// resumePlay = () => {
// 	var playBtn = document.getElementsByClassName("xt_video_player_play_btn fl")[0];
// 	setTimeout(() => {
// 		if (playBtn.className.indexOf('xt_video_player_play_btn_pause') === -1) {
// 			dispatch(playBtn, "click");
// 		}
// 	}, 100);
// }

// removeInterrpt = () => {
// 	console.log("xxx")
// 	window.onblur = null;
// 	document.addEventListener("visibilitychange", resumePlay, true);
// }

// checkLoginStatus = () => {
// 	var userDiv = $('.nav-user')[0];
// 	if (userDiv === undefined) return false;
// 	return true;
// }

// gotoLogin = () => {
// 	window.location.href = `${spocUrl}?redirect=%2Fmanager%23%2Fstudentcourselist#/home`;
// 	main();
// }

// // clear = () => {
// // 	clearInterval(timer);
// // }

// getCourseList = (callback) => {
// 	$.ajax({
// 		type: "POST",
// 		url: `${spocUrl}lms/api/v1/course/30000/courseware/`,
// 		data: { class_id: `${courseID}` },
// 		dataType: "json",
// 		success: function (data) {
// 			console.log(data)
// 			courseData = data.data;
// 			callback();
// 		}
// 	});
// }


// gotoVideo = () => {
// 	const course = courseData[currentCourseIndex].videosRecord;
// 	if (courseData[currentCourseIndex].videosRecord.done.indexOf(course.all[currentVideoIndex]) === -1) {
// 		window.location.href = `${spocUrl}lms#/video/30000/${courseID}/${courseData[currentCourseIndex].unit_id}/${course.all[currentVideoIndex]}/0/videoDiscussion`;
// 	} else {
// 		if (currentVideoIndex === course.all.length - 1) {
// 			currentCourseIndex++;
// 			currentVideoIndex = 0;
// 		} else {
// 			currentVideoIndex++;
// 		}
// 		gotoVideo();
// 	}
// }
// // gotoPlay = () => {
// // 	// window.location.href = 'https://cquv3.xuetangx.com/lms#/30000/52464/schedule';
// // 	//获取进度
// // 	// var continueStudy = $('#continueStudy');
// // 	// if (continueStudy !== undefined) {
// // 	// 	$('.content-list').children()[2].click()
// // 	// }
// // 	timer = setInterval(() => {
// // 		try {
// // 			if (checkPage()) {
// // 				console.log(timer)
// // 				flushCourse();
// // 				clearInterval(timer);
// // 				// clear();
// // 				// clear();
// // 			} else {
// // 				$('.content-list').children()[2].click();
// // 			}
// // 		} catch{
// // 			console.log("等待页面加载")
// // 		}
// // 	}, 2000)
// // }

// isFinished = () => {
// 	var progress = $('.xt_video_player_seek_handle')[0].style.left;
// 	return progress === "100%";
// }

// flushCourse = () => {
// 	//标清
// 	$('.xt_video_player_common_list')[1].children[1].click();

// 	//移除暂停
// 	// continueStudy.children[0].children[2].click();
// 	// setTimeout(removeInterrpt, 5000);
// 	// injectCustomJs();


// 	//2x
// 	$('.xt_video_player_common_list')[0].children[0].click();

// 	//muted
// 	if ($('.xt_video_player_volume .fl').attr('class').split(" ").length === 2) {
// 		$('.xt_video_player_volume .fl')[0].click();
// 	}
// 	console.log("flush")
// }

// gotoNext = () => {
// 	setInterval(() => {
// 		try {
// 			if (isFinished()) {
// 				getCourseList(gotoVideo);
// 			}
// 		} catch{
// 			getCourseList(gotoVideo);
// 		}
// 	}, 5000);
// }

// checkPage = () => {
// 	return window.location.href.split('/')[4] === 'video';
// }

// main = () => {
// 	// removeInterrpt();
// 	if (checkPage()) {
// 		flushCourse();
// 		gotoNext();
// 	} else if (checkLoginStatus()) {
// 		gotoNext();
// 	} else {
// 		gotoLogin();
// 	}
// }

// window.onload = () => {
// 	main();
// }

	// gotoNext = () => {
	// 	//最外围包裹
	// 	var itemParent = $('.section-video-name').parents('.tree-section-item').next()[0]
	// 	//获取基本item
	// 	var section = itemParent.children[0].children[0];
	// }