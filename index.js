let quiz_data = {};
let quiz_category = [];
let quiz_mode = "";
let current_no = 0;
let current_category_no = 0
let quiz_count = 0;
let correct_count = 0;

gen_top_content();
get_quiz_data();
reg_start_event();

// Page Generations
function gen_top_content() {
	var ins = '<h1 class="p-quiz-title">世界史1110</h1>';
	ins += '<h3 class="p-quiz-subtitle">──センター過去問1110題とその解説</h3>';
	ins += '<div class="p-quiz-next">';
	ins += '	<h4>全範囲</h4>';
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="ALL">はじめから</button>';
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="RANDOM">ランダム・エンドレス</button>';
	ins += '	<h4>範囲別</h4>';
	ins += '	<p>- 諸地域世界の形成</p>'
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="古代オリエント">古代オリエント</button>';
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="地中海世界とオリエント">地中海世界とオリエント</button>';
	ins += '</div>';

	document.querySelector('.js-quiz-content').innerHTML = ins;
}

function gen_quiz_content(category) {
	var ins = '<h1 class="p-quiz-title">' + quiz_data[category][current_no]["q"] + '</h1>';
	ins += '<p class="p-quiz-source">' + quiz_data[category][current_no]["source"] + '</p>';
	ins += '<ol class="p-quiz-choices">';
	for (var i = 0; i < quiz_data[category][current_no]["a"].length; i++) {
		ins += '<li class="p-quiz-choices_item">';
		ins += '	<button class="c-btn js-quiz-choice" data-quiz_choice="' + (i + 1) + '">' + quiz_data[category][current_no]["a"][i] + '</button>';
		ins += '</li>';
	}
	ins += '</ol>';
	ins += '<h3 class="p-quiz-subtitle">' + correct_count + '\/' + quiz_count + '問正解 (' + Math.round(correct_count * 1000 / quiz_count) / 10 + '%)</h3>';

	document.querySelector(".js-quiz-content").innerHTML = ins;
}

function gen_answer_content(category, choice) {
	quiz_count++;
	var ins = '<h1 class="p-quiz-title">' + quiz_data[category][current_no]["q"] + '</h1>';
	ins += '<p class="p-quiz-source">' + quiz_data[category][current_no]["source"] + '</p>';
	ins += '<ol class="p-quiz-choices">';
	for (var i = 0; i < quiz_data[category][current_no]["a"].length; i++) {
		ins += '<li class="p-quiz-choices_item">';
		if (quiz_data[category][current_no]["correct"] != choice) {
			if (i + 1 == choice) {
				ins += '	<button class="c-btn-incorrect js-quiz-choice" data-quiz_choice="' + (i + 1) + '">' + quiz_data[category][current_no]["a"][i] + '</button>';
				continue;
			}
		}
		if (quiz_data[category][current_no]["correct"] == i + 1) {
			ins += '	<button class="c-btn-correct js-quiz-choice" data-quiz_choice="' + (i + 1) + '">' + quiz_data[category][current_no]["a"][i] + '</button>';
			continue;
		}
		ins += '	<button class="c-btn js-quiz-choice" data-quiz_choice="' + (i + 1) + '">' + quiz_data[category][current_no]["a"][i] + '</button>';
		ins += '</li>';
	}
	ins += '</ol>';

	if (quiz_data[category][current_no]["correct"] === choice) {
		ins += '<p class="p-quiz-result">正解</p>';
		correct_count++;
	} else {
		ins += '<p class="p-quiz-result">不正解</p>';
	}
	ins += '<p class="p-quiz-commentary">' + quiz_data[category][current_no]["commentary"] + '</p>';

	if (current_category_no + 1 < quiz_category.length || current_no + 1 < quiz_data[category].length || quiz_mode == "RANDOM") {
		ins += '<div class="p-quiz-next">';
		ins += '	<button class="c-btn-next js-quiz-next">次の問題</button>';
		ins += '</div>';
	} else {
		ins += '<div class="p-quiz-next">';
		ins += '	<button class="c-btn-next js-quiz-top">完了!トップへ戻る</button>';
		ins += '</div>';
	}
	ins += '<h3 class="p-quiz-subtitle">' + correct_count + '\/' + quiz_count + '問正解 (' + Math.round(correct_count * 1000 / quiz_count) / 10 + '%)</h3>';

	document.querySelector(".js-quiz-content").innerHTML = ins;
}


// Get Quiz Data
function get_quiz_data() {
	let xhr = new XMLHttpRequest();
	xhr.onload = function () {
		quiz_data = xhr.response;
	}
	xhr.open("GET", "quiz.json");
	xhr.responseType = "json";
	xhr.send();
}


// Event Registrations
function reg_start_event() {
	for (var i = 0; i < document.querySelectorAll(".js-quiz-start").length; i++) {
		document.querySelectorAll(".js-quiz-start")[i].addEventListener("click", function (e) {
			quiz_mode = this.getAttribute("data-quiz_mode")
			if (quiz_mode == "ALL" || quiz_mode == "RANDOM") {
				quiz_category = ["古代オリエント", "地中海世界とオリエント"]
				if (quiz_mode == "ALL") {
					current_category_no = 0;
					current_no = 0;
				} else {
					current_category_no = Math.floor(Math.random() * quiz_category.length)
					current_no = Math.floor(Math.random() * quiz_data[quiz_category[current_category_no]].length)
				}
			} else {
				quiz_category = [quiz_mode];
				current_category_no = 0;
				current_no = 0;
			}
			gen_quiz_content(quiz_category[current_category_no]);
			reg_choice_event(quiz_category[current_category_no]);
		}, false);
	}
}

function reg_choice_event(category) {
	for (var i = 0; i < document.querySelectorAll(".js-quiz-choice").length; i++) {
		document.querySelectorAll(".js-quiz-choice")[i].addEventListener("click", function (e) {
			gen_answer_content(category, parseFloat(this.getAttribute("data-quiz_choice")));
			if (current_category_no + 1 < quiz_category.length || current_no + 1 < quiz_data[category].length || quiz_mode == "RANDOM") {
				reg_nextquiz_event(quiz_category[current_category_no]);
			} else {
				reg_top_event();
			}
		}, false);
	}
}

function reg_nextquiz_event(category) {
	document.querySelector(".js-quiz-next").addEventListener("click", function () {
		if (quiz_mode == "RANDOM") {
			current_category_no = Math.floor(Math.random() * quiz_category.length)
			current_no = Math.floor(Math.random() * quiz_data[quiz_category[current_category_no]].length)
		} else {
			if (current_no + 1 >= quiz_data[category].length) {
				current_category_no++;
				current_no = 0;
			} else {
				current_no++;
			}
		}
		gen_quiz_content(quiz_category[current_category_no]);
		reg_choice_event(quiz_category[current_category_no]);
	}, false);
}

function reg_top_event() {
	document.querySelector(".js-quiz-top").addEventListener("click", function () {
		quiz_count = 0;
		correct_count = 0
		gen_top_content();
		reg_start_event();
	}, false);
}
