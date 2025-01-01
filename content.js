function cleanPosts() {
	chrome.storage.local.get(["links", "hidePosts"], (data) => {
		if (!data.hidePosts || !data.links) return;

		const anchors = document.querySelectorAll("a[href]");
		anchors.forEach((anchor) => {
			const href = anchor.href;
			if (data.links.some((link) => href.includes(link))) {
				let article = anchor.closest("article");
				if (article) {
					article.remove();
				}
			}
		});
	});
}

cleanPosts();

chrome.runtime.onMessage.addListener((message) => {
	if (message.action === "update") {
		cleanPosts();
	}
});
