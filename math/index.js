let quiz_data = {};
let quiz_category = [];
let quiz_mode = "";
let current_no = 0;
let current_category_no = 0
let quiz_count = 0;
let quiz_cumul_sum = [0];
let correct_count = 0;

gen_top_content();
get_quiz_data();
reg_start_event();

// Page Generations
function gen_top_content() {
	var ins = '<h1 class="p-quiz-title">数学</h1>';
	ins += '<div class="p-quiz-next">';
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="方程式と不等式">・方程式と不等式</button>';
	ins += '</div>';

	document.querySelector('.js-quiz-content').innerHTML = ins;
}

function gen_quiz_content(category) {
	var ins = '<h2 class="p-quiz-title">' + quiz_data[category][current_no]["q"] + '</h2>';
	ins += '<div class="p-quiz-next">';
	ins += '	<button class="c-btn-next js-quiz-next">解答を見る</button>';
	ins += '</div>';

	document.querySelector(".js-quiz-content").innerHTML = ins;
}

function gen_answer_content(category) {
	quiz_count++;
	var ins = '<h2 class="p-quiz-title">' + quiz_data[category][current_no]["q"] + '</h2>';
	ins += quiz_data[category][current_no]["a"]


	if (current_category_no + 1 < quiz_category.length || current_no + 1 < quiz_data[category].length || quiz_mode == "RANDOM") {
		ins += '<div class="p-quiz-next">';
		ins += '	<button class="c-btn-next js-quiz-next">次の問題</button>';
		ins += '</div>';
	} else {
		ins += '<div class="p-quiz-next">';
		ins += '	<button class="c-btn-next js-quiz-top">完了!トップへ戻る</button>';
		ins += '</div>';
	}

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
				quiz_category = ["方程式と不等式"];
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

			// 累積和
			quiz_cumul_sum = [0];
			for (var i = 0; i < quiz_category.length; i++) {
				quiz_cumul_sum.push(quiz_cumul_sum[i] + quiz_data[quiz_category[i]].length);
			}
			gen_quiz_content(quiz_category[current_category_no]);
			reg_choice_event(quiz_category[current_category_no]);
		}, false);
	}
}

function reg_choice_event(category) {
	for (var i = 0; i < document.querySelectorAll(".js-quiz-next").length; i++) {
		document.querySelectorAll(".js-quiz-next")[i].addEventListener("click", function (e) {
			gen_answer_content(category);
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
			var no = Math.floor(Math.random() * quiz_cumul_sum[quiz_cumul_sum.length - 1]);
			// 気になるなら二分探索を。
			for (var i = quiz_category.length - 1; i >= 0; i--) {
				if (no >= quiz_cumul_sum[i]) {
					current_category_no = i;
					current_no = no - quiz_cumul_sum[i];
					break;
				}
			}
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
