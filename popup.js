document.addEventListener("DOMContentLoaded", () => {
	const textarea = document.getElementById("links");
	const toggle = document.getElementById("toggle");

	chrome.storage.local.get(["links", "hidePosts"], (data) => {
		if (data.links) {
			textarea.value = data.links.join("\n");
			adjustTextareaHeight(textarea);
		}
		if (data.hidePosts !== undefined) {
			toggle.checked = data.hidePosts;
		}
	});

	textarea.addEventListener("input", () => {
		const links = textarea.value
			.split("\n")
			.map((link) => normalizeLink(link.trim()))
			.filter((link) => link);

		const hidePosts = toggle.checked;

		chrome.storage.local.set({ links, hidePosts }, () => {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				chrome.tabs.sendMessage(tabs[0].id, { action: "update" });
			});
		});

		adjustTextareaHeight(textarea);
	});

	toggle.addEventListener("change", () => {
		const links = textarea.value
			.split("\n")
			.map((link) => normalizeLink(link.trim()))
			.filter((link) => link);

		const hidePosts = toggle.checked;

		chrome.storage.local.set({ links, hidePosts }, () => {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				chrome.tabs.sendMessage(tabs[0].id, { action: "update" });
			});
		});
	});
});

function normalizeLink(link) {
	const regex = /(https?:\/\/x\.com\/)?i\/communities\/(\d+)/;
	const match = link.match(regex);
	if (match) {
		return `i/communities/${match[2]}`;
	}
	return null;
}
function adjustTextareaHeight(textarea) {
	textarea.style.height = "auto";
	textarea.style.height = `${textarea.scrollHeight}px`;
}
