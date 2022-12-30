var _api = "https://speechio-api.cyclic.app/";
var _voices = {
	karishma: "devika",
	devika: "aanchal",
	aanchal: "diya",
	diya: "divya",
	divya: "harleen",
	harleen: "ashita",
	ashita: "james",
	james: "akash",
	akash: "navneet",
	navneet: "mohan",
	mohan: "akshay",
	akshay: "arvind",
	arvind: "aarush",
	aarush: "vishal",
	vishal: "vivek",
	vivek: "vikash",
	vikash: "abhay",
	abhay: "karishma"
};
async function last_update(t = {
	default_voice: default_voice,
	data: data,
	language: language
}) {
	await $.ajaxQueue({
		type: "POST",
		url: _api + "last?id=mcadk",
		data: JSON.stringify(t),
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
			Accept: "*/*"
		},
		beforeSend: function() {
			console.log("updating last data")
		},
		success: function(t) {
			"success" == t.message && console.log("updated last data!"), "error" == t.message && console.log("error while updating last data!")
		},
		error: function() {
			console.log("failed to update data!")
		},
		timeout: 15e4
	})
}
async function retry(t) {
	$("#download").addClass("disabled");
	let e = {},
		n = $(t).attr("id");
	e.pid = n;
	let a = n.split("play")[1];
	e.did = "content" + a, e.add = "add" + a;
	var s = $("#language-area").val();
	s = s.toLowerCase(), e.language = s;
	let i = $(`#content${a}`).find("textarea").val();
	e.text = i;
	let l = $(t).attr("class").split(/\s+/);
	l = l.filter((t => t.startsWith("id-"))), l = l.toString(), l = l.split("-")[2], e.voice = l;
	const o = [e];
	$(".remove").each((function() {
		$(this).addClass("disabled")
	})), o.forEach((async (t, e) => {
		await $.ajaxQueue({
			type: "POST",
			url: _api + "fetch?id=mcadk",
			data: JSON.stringify(o[e]),
			headers: {
				"Content-Type": "application/json; charset=UTF-8",
				Accept: "*/*"
			},
			beforeSend: function() {
				$("#send").replaceWith('\n\n          <button class="btn btn-outline-primary btn-lg btn-block w-50 btn-block p-3 disabled" onclick="send()" id="send">\n\n            <div class="spinner-border text-info" role="status">\n\n  <span class="sr-only">Loading...</span>\n\n</div>\n\n          </button>'), $(`#${o[e].pid}`).replaceWith(`<button class="btn btn-outline-info  btn-md disabled" id="${o[e].pid}">\n\n            <div class="spinner-border text-info" role="status">\n\n  <span class="sr-only">Loading...</span>\n\n</div></button>`)
			},
			success: async function(t) {
				"success" == t.message ? (await checkAudio(t), $("#send").replaceWith('<button class="btn btn-success disabled btn-lg btn-block w-50 btn-block p-3" id="send">\n\n            <i class="fas fa-check mr-2"></i>\n\n          </button>'), $(".file").css({
					visibility: "visible",
					position: "relative"
				}), $("#download").removeClass("disabled")) : "error" == t.message && ($(`#${t.pid}`).replaceWith(`<button class="btn btn-warning  btn-md retry id-${t.did}-${t.voice}" id="${t.pid}" onclick="retry(this)">\n\n                <i class="fas fa-rotate mr-2"></i>\n\n</div></button>`), setTimeout((() => {
					sub_enbl(`#${t.did}`)
				}), 90), $("#send").replaceWith('<button class="btn btn-warning btn-lg btn-block w-50 btn-block p-3" onclick="retryAll()" id="send">\n\n            <i class="fas fa-retweet mr-2"></i>\n\n          </button>'))
			},
			error: function(t) {
				$(`#${o[e].pid}`).replaceWith(`<button class="btn btn-warning  btn-md retry id-${o[e].did}-${o[e].voice}" id="${o[e].pid}" onclick="retry(this)">\n\n                <i class="fas fa-rotate mr-2"></i>\n\n</div></button>`), setTimeout((() => {
					sub_enbl(`#${o[e].did}`)
				}), 90), $("#send").replaceWith('<button class="btn btn-warning btn-lg btn-block w-50 btn-block p-3" onclick="retryAll()" id="send">\n\n            <i class="fas fa-retweet mr-2"></i>\n\n          </button>')
			},
			timeout: 15e4
		})
	}))
}

function retryAll() {
	$(".retry").each((function() {
		$(this).click()
	}))
}

function voice_default_change() {
	let t = $("#language-area").val();
	t = "Hindi", $("#language-area").val(t)
}

function loading_box(t, e) {
	$("#loading-box").delay(e).queue((function(e) {
		$(this).css({
			display: t
		}), e()
	})), $("#main-box").delay(e).queue((function(t) {
		$(this).css({
			visibility: "visible"
		}), t()
	})), $("#sample-box").delay(e).queue((function(g) {
		$(this).css({
			visibility: "visible"
		}), g()
	}))
}

function change_voice(t) {
	let e = $(t).html();
	e = e.split('src="')[1], e = e.split('.png"')[0];
	let n = $(t).html();
	n = n.replace(/src="\w+.\w+"/g, `src="${_voices[e]}.png"`), $(t).html(n)
}

function default_voice() {
	let t = $("#language").val();
	t = "Hindi" == t ? "English" : "Hindi", $("#language").attr({
		value: t
	})
}

function remove(t) {
	let e = $("#content-box").html();
	if (e = e.replace(/\s/g, ""), 1 == e.match(/class="content-div"/g).length) return $(".remove").each((function() {
		$(this).addClass("disabled")
	}));
	$($(t).parent()).parent().remove(), remove_button_disable_enable("remove")
}

function add(t) {
	var e = default_voice();
	$($($(t).parent()).parent()).attr("id"), remove_button_disable_enable("add"), $($($(t).parent()).parent()).after(add_content_str(e, ""))
}

function deleteAll() {
	if ($("#send").removeClass("disabled").addClass("btn-outline-primary").removeClass("btn-success"), $("#language-btn").removeClass("disabled"), $("#download").addClass("disabled"), confirm("Are your really want to delete all your content")) {
		let t = default_voice();
		$("#content-box").html(add_content_str(t, "")), remove_button_disable_enable("remove")
	}
}

function remove_button_disable_enable(t) {
	let e = $("#content-box").html();
	e = e.replace(/\s/g, "");
	var n = e.match(/class="content-div"/g).length;
	"remove" == t && 1 == n && $(".remove").each((function() {
		$(this).addClass("disabled")
	})), "add" == t && 1 == n && $(".remove").each((function() {
		$(this).hasClass("disabled") && $(this).removeClass("disabled")
	}))
}

function add_content_str(t, e) {
	return `<div class="content-div">\n\n<div class="input-group mb-2">\n\n          <button class="btn btn-danger btn-md remove" onclick="remove(this)">\n\n            <i class="fas fa-minus mr-2"></i>\n\n          </button>\n\n          <textarea rows="3" class="form-control content-box" placeholder="Paragraph..">${e}</textarea>\n\n          <button class="btn btn-secondary btn-sm btn-block mdl" type="button" onclick="change_voice(this)">\n\n            <img class="rounded-circle" width="45" src="${t}.png">\n\n          </button>\n\n        </div>\n\n        <div class="border d-flex justify-content-center rounded p-1 mb-3" style="width: 100%">\n\n          <button class="btn btn-lg w-25 btn-block btn-info add" onclick="add(this)">\n\n            <i class="fas fa-plus mr-2"></i>\n\n          </button>\n\n        </div>\n\n      </div>\n\n      </div>`
}

function default_voice() {
	var t = $("#default-voice").html();
	return (t = t.split('src="')[1]).split('.png"')[0]
}

function default_voice_str(t) {
	return `<img class="rounded-circle w-25 border border-4 h-100" src="${t}.png">`
}

function send() {
	$("#send").replaceWith('\n\n          <button class="btn btn-outline-primary btn-lg btn-block w-50 btn-block p-3 disabled" onclick="send()" id="send">\n\n            <div class="spinner-border text-info" role="status">\n\n  <span class="sr-only">Loading...</span>\n\n</div>\n\n          </button>');
	let t = [];
	if ($(".content-box").each((function() {
			let e = $(this).val(),
				n = new RegExp(/^(?:(\d*)(?:(\d*))?|\s*)$/gm);
			test = n.test(e), test ? test = "retry" : test = "go", t.push(test)
		})), !t.includes("go")) return $("#send").replaceWith('<button class="btn btn-warning btn-lg btn-block w-50 btn-block p-3" onclick="send()" id="send">\n\n            <i class="fas fa-retweet mr-2"></i>\n\n          </button>');
	var e = [],
		n = [],
		a = [],
		s = (default_voice(), 1);
	$(".content-box").each((function() {
		let t = $($(this).parent()).parent(),
			e = $(this).val(),
			n = new RegExp(/^(?:(\d*)(?:(\d*))?|\s*)$/gm);
		test = n.test(e), e ? (t.attr({
			id: "content" + s
		}), s++) : t.remove()
	})), $(".content-box").each((function() {
		a.push($(this).val())
	})), $(".mdl").each((function() {
		var t = $(this).html();
		t = (t = t.split('src="')[1]).split('.png"')[0], n.push(t)
	}));
	var i = $("#language-area").val();
	i = i.toLowerCase(), n.forEach(((t, s) => {
		e.push({
			text: a[s],
			pid: "play" + (s + 1),
			voice: n[s],
			language: i,
			did: "content" + (s + 1),
			add: "add" + (s + 1)
		})
	})), $(".remove").each((function() {
		$(this).addClass("disabled")
	})), $(".add").each((function() {
		$(this).addClass("disabled")
	})), $("#language-btn").addClass("disabled"), $("#default-voice").addClass("disabled"), $(".file").css({
		visibility: "hidden",
		position: "absolute"
	}), $(".content-box").each((function() {
		$(this).attr({
			readonly: !0
		})
	})), $(".mdl").each((function(t) {
		$(this).attr({
			id: `play${t+1}`
		}), $(".mdl").addClass("disabled")
	})), $(".add").each((function(t) {
		$(this).attr({
			id: `add${t+1}`
		})
	}));
	var l = e.length,
		o = 0,
		d = 0;
	e.forEach((async (t, n) => {
		await $.ajaxQueue({
			type: "POST",
			url: _api + "fetch?id=mcadk",
			data: JSON.stringify(e[n]),
			headers: {
				"Content-Type": "application/json; charset=UTF-8",
				Accept: "*/*"
			},
			beforeSend: function() {
				$("#delete-all").addClass("disabled"), $(`#${e[n].pid}`).replaceWith(`<button class="btn btn-outline-info  btn-md disabled" id="${e[n].pid}">\n\n            <div class="spinner-border text-info" role="status">\n\n  <span class="sr-only">Loading...</span>\n\n</div></button>`)
			},
			success: async function(t) {
				"success" == t.message ? (o++, ajex_complete(l, o, d), await checkAudio(t)) : "error" == t.message && (d++, o++, $(`#${t.pid}`).replaceWith(`<button class="btn btn-warning  btn-md retry id-${t.did}-${t.voice}" id="${t.pid}" onclick="retry(this)">\n\n                <i class="fas fa-rotate mr-2"></i>\n\n</div></button>`), ajex_complete(l, o, d), setTimeout((() => {
					sub_enbl(`#${t.did}`)
				}), 90))
			},
			error: function(t) {
				d++, o++, $(`#${e[n].pid}`).replaceWith(`<button class="btn btn-warning  btn-md retry id-${e[n].did}-${e[n].voice}" id="${e[n].pid}" onclick="retry(this)">\n\n                <i class="fas fa-rotate mr-2"></i>\n\n</div></button>`), ajex_complete(l, o, d), setTimeout((() => {
					sub_enbl(`#${e[n].did}`)
				}), 90)
			},
			timeout: 15e4
		})
	}))
}

function ajex_complete(t, e, n) {
	t == e && (n > 0 ? $("#send").replaceWith('<button class="btn btn-warning btn-lg btn-block w-50 btn-block p-3" onclick="retryAll()" id="send">\n\n            <i class="fas fa-retweet mr-2"></i>\n\n          </button>') : ($("#send").replaceWith('<button class="btn btn-success disabled btn-lg btn-block w-50 btn-block p-3" id="send" onclick="send()">\n\n            <i class="fas fa-check mr-2"></i>\n\n          </button>'), $(".file").css({
		visibility: "visible",
		position: "relative"
	}), setTimeout((() => {
		$("#download").removeClass("disabled")
	}), 1500), $("#delete-all").removeClass("disabled")))
}

function back_to_voice(t, e) {
	$(t).replaceWith(`<button class="btn btn-secondary btn-sm btn-block disabled mdl" type="button" id="${t}" onclick="change_voice(this)">\n\n            <img class="rounded-circle" width="45" src="${e}.png">\n\n          </button>`)
}

function sub_enbl(t) {
	$(t).find(".remove").removeClass("disabled")
}

function download() {
	var t = [];
	$("#content-box").find("audio").each((function() {
		t.push($(this).attr("id"))
	})), _mergeAll(t)
}
document.addEventListener(["input"], (function(t) {
		var e = $("#language-area").val();
		let n = [];
		$(".mdl").each((function() {
			let t = $(this).html();
			t = t.split('src="')[1], t = t.split(".png")[0], n.push(t)
		}));
		let a = [],
			s = [];
		$(".content-box").each((function() {
			s.push($(this).val())
		}));
		let i = default_voice();
		s.forEach(((t, e) => {
			a.push({
				text: s[e].trim(),
				voice: n[e]
			})
		})), last_update({
			default_voice: i,
			language: e,
			data: a
		})
	})),
	function(t) {
		var e = t({});
		t.ajaxQueue = function(n) {
			var a = n.complete;
			e.queue((function(e) {
				n.complete = function() {
					a && a.apply(this, arguments), e()
				}, t.ajax(n)
			}))
		}
	}(jQuery), document.addEventListener("play", (function(t) {
		for (var e = document.getElementsByTagName("audio"), n = 0, a = e.length; n < a; n++) e[n] != t.target && e[n].pause()
	}), !0), $(window).on("load", (async () => {
		let _auds = Object.keys(_voices);
		_auds.forEach(_i => {
			let _element = document.createElement("div"),
			     _div = $(_element);
			_div.attr({
				id: "audio-box",
				class: "container mt-2 p-2 border bg-light rounded shadow",
				style: "width:95%"
			});
			let _html = `<button class="border d-flex justify-content-center rounded p-2 w-100 h-100 disabled mb-2">
					<img class="rounded-circle w-25 border border-4 h-100" src="${_i}.png">
				</button>
			        <div class="border d-flex justify-content-center rounded p-1 mb-1" style="width: 100%">
          <div class="container-audio"><audio controls="" controlslist="nodownload noplaybackrate novolume">
                   <source src="audio_samples/${_i}.mp3">
                   Your browser dose not Support the audio Tag
               </audio></div>`;
               _div.html(_html);
		       $("#sample-box").append(_div);
		});
		remove_button_disable_enable("remove"), (async () => {
			await $.ajax({
				type: "GET",
				url: _api + "last?id=mcadk",
				headers: {
					"Content-Type": "application/json; charset=UTF-8",
					Accept: "*/*"
				},
				success: function(t) {
					if ("success" == t.message) {
						let e = "";
						t.data.forEach((t => {
							e += add_content_str(t.voice, t.text)
						}));
						let n = default_voice_str(t.default_voice);
						loading_box("none", 35), $("#content-box").html(e), $("#default-voice").html(n), $("#language-area").val(t.language || "Hindi")
					} else loading_box("none", 35)
				},
				error: function(t) {
					loading_box("none", 35)
				}
			})
		})()
	})), $(document.body).ready((() => {})), $(document).delegate("#file", "change", (function(t) {
		$("#send").removeClass("btn-success"), $("#send").addClass("btn-outline-primary");
		var e = default_voice();
		let n = t.target.files[0];
		$("#download").addClass("disabled"), $("#send").removeClass("disabled"), $("#language-btn").removeClass("disabled"), $("#delete-all").removeClass("disabled");
		let a = new FileReader;
		a.onload = function(t) {
			var n;
			n = (n = t.target.result.split(/\n/g)).filter((t => {
				if (t.length > 1) return t
			}));
			let a = "";
			n.forEach(((t, n) => {
				a += add_content_str(e, t, n += 1)
			})), $("#content-box").html(a);
			var s = $("#language-area").val();
			let i = [],
				l = [];
			$(".mdl").each((function() {
				let t = $(this).html();
				t = t.split('src="')[1], t = t.split(".png")[0], i.push(t)
			})), $(".content-box").each((function() {
				l.push($(this).val())
			}));
			let o = [],
				d = default_voice();
			l.forEach(((t, e) => {
				o.push({
					text: l[e].trim(),
					voice: i[e]
				})
			})), last_update({
				default_voice: d,
				language: s,
				data: o
			})
		}, a.readAsText(n), $("#file").val("")
	})), $("textarea").dblclick((function() {
		for (var t = $(this).prop("selectionStart"), e = $(this).val().substr(t, 1);
			"\n" != e && t >= 0;) t--, e = $(this).val().substr(t, 1);
		$(this).val($(this).val().substr(0, t + 1) + "-" + $(this).val().substr(t + 1))
	}));
