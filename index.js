//
// DIRTY CODE. REWRITING IS RECOMMENDED.
//
let quiz_data = {};
let quiz_category = [];
let quiz_mode = "";
let current_no = 0;
let current_category_no = 0
let quiz_count = 0;
let quiz_cumul_sum = [0];
let correct_count = 0;

main();

async function main() {
	var current_url = window.location.href;
	var search_params = new URLSearchParams(new URL(current_url).search);

	if (search_params.get("m") == null) {
		get_quiz_data();
		gen_top_content();
		reg_start_event();
	} else {
		current_category_no = Number(search_params.get("c"));
		current_no = Number(search_params.get("n"));
		quiz_mode = search_params.get("m");

		if (quiz_mode == "ALL" || quiz_mode == "RANDOM") {
			quiz_category = ["古代オリエント世界", "ギリシア世界", "ローマ世界", "インドの古典文明", "東南アジアの諸文明", "中国の古典文明", "南北アメリカ文明", "魏晋南北朝から元", "中国総合問題", "東アジア諸国", "内陸アジア世界", "イスラーム世界の形成発展", "イスラーム文化"];
		} else {
			quiz_category = [quiz_mode];
		}

		get_quiz_data();
		await new Promise(resolve => setTimeout(resolve, 500));

		// 累積和
		quiz_cumul_sum = [0];
		for (var i = 0; i < quiz_category.length; i++) {
			quiz_cumul_sum.push(quiz_cumul_sum[i] + quiz_data[quiz_category[i]].length);
		}
		if (quiz_mode != "RANDOM") {
			quiz_count = quiz_cumul_sum[current_category_no] + current_no;
		}

		gen_quiz_content(quiz_category[current_category_no]);
		reg_choice_event(quiz_category[current_category_no]);
	}
	reg_popstate_event();
}

// Page Generations
function gen_top_content() {
	var ins = '<h3 class="p-quiz-subtitle">─センター過去問1110題とその解説</h3>';
	ins += '<p>工事中。1110題ですが、設問数はもう少しあります。感想、訂正は<a href="mailto:contact@wh1110.org">contact@wh1110.org</a>まで。</p>';
	ins += '<div class="p-quiz-next">';
	ins += '	<h4>全範囲</h4>';
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="ALL">・はじめから</button>';
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="RANDOM">・ランダム・エンドレス</button>';
	ins += '	<h4>範囲別</h4>';
	ins += '	<u><p>- オリエントと地中海世界</p></u>'
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="古代オリエント世界">・古代オリエント世界</button>';
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="ギリシア世界">・ギリシア世界</button>';
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="ローマ世界">・ローマ世界</button>';
	ins += '	<u><p>- アジア・アメリカの古代文明</p></u>'
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="インドの古典文明">・インドの古典文明</button>';
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="東南アジアの諸文明">・東南アジアの諸文明</button>';
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="中国の古典文明">・中国の古典文明</button>';
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="南北アメリカ文明">・南北アメリカ文明</button>';
	ins += '	<u><p>- 内陸アジア世界・東アジア世界</p></u>'
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="魏晋南北朝から元">・魏晋南北朝から元</button>';
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="中国総合問題">・中国総合問題</button>';
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="東アジア諸国">・東アジア諸国</button>';
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="内陸アジア世界">・内陸アジア世界</button>';
	ins += '	<u><p>- イスラーム世界の形成発展(アフリカの歴史を含む)</p></u>'
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="イスラーム世界の形成発展">・イスラーム世界の形成発展</button>';
	ins += '	<button class="c-btn js-quiz-start" data-quiz_mode="イスラーム文化">・イスラーム文化</button>';
	ins += '</div>';

	document.querySelector('.js-quiz-content').innerHTML = ins;
}

function gen_quiz_content(category) {
	var ins = '<h3 class="p-quiz-title">' + quiz_data[category][current_no]["q"] + '</h3>';
	ins += '<p class="p-quiz-source">' + quiz_data[category][current_no]["source"] + '</p>';
	ins += '<ol class="p-quiz-choices">';
	for (var i = 0; i < quiz_data[category][current_no]["a"].length; i++) {
		ins += '<li class="p-quiz-choices_item">';
		ins += '	<button class="c-btn js-quiz-choice" data-quiz_choice="' + (i + 1) + '">' + quiz_data[category][current_no]["a"][i] + '</button>';
		ins += '</li>';
	}
	ins += '</ol>';
	if (quiz_mode == "RANDOM") {
		ins += '<h3 class="p-quiz-subtitle">' + correct_count + '\/' + quiz_count + '問正解 (' + Math.round(correct_count * 1000 / quiz_count) / 10 + '%)</h3>';
	} else {
		ins += '<h3 class="p-quiz-subtitle">' + correct_count + '\/' + quiz_count + '問正解 (' + Math.round(correct_count * 1000 / quiz_count) / 10 + '%)' + '・全' + quiz_cumul_sum[quiz_cumul_sum.length - 1] + '問</h3>';
	}

	scrollTo(0, 0);
	document.querySelector(".js-quiz-content").innerHTML = ins;
}

function gen_answer_content(category, choice) {
	quiz_count++;
	var ins = '<h3 class="p-quiz-title">' + quiz_data[category][current_no]["q"] + '</h3>';
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
	if (quiz_mode == "RANDOM") {
		ins += '<h3 class="p-quiz-subtitle">' + correct_count + '\/' + quiz_count + '問正解 (' + Math.round(correct_count * 1000 / quiz_count) / 10 + '%)</h3>';
	} else {
		ins += '<h3 class="p-quiz-subtitle">' + correct_count + '\/' + quiz_count + '問正解 (' + Math.round(correct_count * 1000 / quiz_count) / 10 + '%)' + '・全' + quiz_cumul_sum[quiz_cumul_sum.length - 1] + '問</h3>';
	}

	document.querySelector(".js-quiz-content").innerHTML = ins;
}


// Get Quiz Data
async function get_quiz_data() {
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
				quiz_category = ["古代オリエント世界", "ギリシア世界", "ローマ世界", "インドの古典文明", "東南アジアの諸文明", "中国の古典文明", "南北アメリカ文明", "魏晋南北朝から元", "中国総合問題", "東アジア諸国", "内陸アジア世界", "イスラーム世界の形成発展", "イスラーム文化"];
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

			query = "?m=" + quiz_mode + "&c=" + current_category_no + "&n=" + current_no;
			history.pushState(null, null, query);
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

		query = "?m=" + quiz_mode + "&c=" + current_category_no + "&n=" + current_no;
		history.pushState(null, null, query);

		gen_quiz_content(quiz_category[current_category_no]);
		reg_choice_event(quiz_category[current_category_no]);
	}, false);
}

function reg_top_event() {
	document.querySelector(".js-quiz-top").addEventListener("click", function () {
		quiz_count = 0;
		correct_count = 0;
		history.pushState(null, null, "/");
		gen_top_content();
		reg_start_event();
	}, false);
}

function reg_popstate_event() {
	window.addEventListener("popstate", (e) => {
		var current_url = window.location.href;
		var search_params = new URLSearchParams(new URL(current_url).search);

		if (search_params.get("m") == null) {
			quiz_count = 0;
			correct_count = 0;
			gen_top_content();
			reg_start_event();
		} else {
			current_category_no = Number(search_params.get("c"));
			current_no = Number(search_params.get("n"))

			if (quiz_mode != "RANDOM") {
				quiz_count = quiz_cumul_sum[current_category_no] + current_no;
			}

			gen_quiz_content(quiz_category[current_category_no]);
			reg_choice_event(quiz_category[current_category_no]);
		}
	}, false);
}