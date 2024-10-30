let quiz_data = {};
let current_no = 0;
let correct_count = 0;

gen_top_content();
get_quiz_data();
reg_start_event();

// Page Generations
function gen_top_content() {
	var ins = '<h1 class="p-quiz-title">世界史1110本ノック</h1>';
	ins += '<h3 class="p-quiz-subtitle">センター過去問とその解説</h3>';
	ins += '<div class="p-quiz-next">';
	ins += '	<button class="c-btn js-quiz-start">開始</button>';
	ins += '</div>';

	document.querySelector('.js-quiz-content').innerHTML = ins;
}

function gen_quiz_content() {
	var ins = '<h1 class="p-quiz-title">' + quiz_data["quiz"][current_no]["q"] + '</h1>';
	ins += '<ol class="p-quiz-choices">';
	for (var i = 0; i < quiz_data["quiz"][current_no]["a"].length; i++) {
		ins += '<li class="p-quiz-choices_item">';
		ins += '	<button class="c-btn js-quiz-choice" data-quiz_choice="' + (i + 1) + '">' + quiz_data["quiz"][current_no]["a"][i] + '</button>';
		ins += '</li>';
	}
	ins += '</ol>';

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

function gen_answer_content(choice) {
	var ins = '<h1 class="p-quiz-title">' + quiz_data["quiz"][current_no]["q"] + '</h1>';
	if (quiz_data["quiz"][current_no]["correct"] === choice) {
		ins += '<p class="p-quiz-result">正解</p>';
		correct_count++;
	} else {
		ins += '<p class="p-quiz-result">不正解</p>';
	}
	ins += '<p class="p-quiz-commentary">' + quiz_data["quiz"][current_no]["commentary"] + '</p>';

	if (current_no + 1 < quiz_data["quiz"].length) {
		ins += '<div class="p-quiz-next">';
		ins += '	<button class="c-btn js-quiz-next">次の問題</button';
		ins += '</div>';
	} else {
		ins += '<div class="p-quiz-next">';
		ins += '	<button class="c-btn js-quiz-next">完了!もう一度やる</button>';
		ins += '</div>';
	}

	document.querySelector(".js-quiz-content").innerHTML = ins;
}


// Event Registrations
function reg_start_event() {
	document.querySelector(".js-quiz-start").addEventListener("click", function () {
		gen_quiz_content();
	}, false);
}

function reg_choice_event() {
	for (var i = 0; i < document.querySelectorAll(".js-quiz-choice").length; i++) {

	}
}
