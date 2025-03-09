const parser = new DOMParser();
const number_gpu_max = 8;

const resources = ["gtx1080ti", "rtx3090", "teslav100"];
for (const resource of resources) {
	fetch(`https://bitahub.ustc.edu.cn/resources/${resource}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network failure");
			}
			return response.text();
		})
		.then((html) => {
			const doc = parser.parseFromString(html, "text/html");
			const numbers = [];
			for (const [i, td] of doc.querySelectorAll("td").entries()) {
				if (i % 7 === 1) {
					numbers.push(Number(td.textContent));
				}
			}
			const tr = document.querySelector(`#${resource}`);
			for (let i = 1, len = number_gpu_max + 1; i < len; i++) {
				for (const td of tr.querySelectorAll(`.n${i}`)) {
					td.textContent = numbers.filter((x) => x === i).length;
				}
			}
			for (const element of tr.querySelectorAll(
				Array.from(
					{ length: number_gpu_max },
					(_, index) => `.n${index + 1}`,
				).join(),
			)) {
				const number = Number(element.textContent);
				if (number === 0) {
					element.classList.add("zero");
				} else if (
					number >=
					numbers.reduce(
						(accumulator, currentValue) => accumulator + currentValue,
						0,
					) /
						(number_gpu_max + 1)
				) {
					element.classList.add("full");
				}
			}
		})
		.catch((error) => {
			for (const element of document.querySelectorAll(".hidden")) {
				element.classList.remove("hidden");
				for (const p of element.querySelectorAll("p")) {
					p.textContent = error;
				}
			}
		});
}
