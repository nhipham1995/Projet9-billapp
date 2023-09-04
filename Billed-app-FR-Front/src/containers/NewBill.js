import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export default class NewBill {
	constructor({ document, onNavigate, store, localStorage }) {
		this.document = document;
		this.onNavigate = onNavigate;
		this.store = store;
		const formNewBill = this.document.querySelector(
			`form[data-testid="form-new-bill"]`
		);
		formNewBill.addEventListener("submit", this.handleSubmit);

		const fileInput = this.document.querySelector(
			`input[data-testid="file-input"]`
		);
		fileInput.addEventListener("change", this.handleChangeInput);
		this.fileUrl = null;
		this.fileName = null;
		this.billId = null;
		new Logout({ document, localStorage, onNavigate });
	}

	handleChangeInput = (e) => {
		e.preventDefault();
		const file = this.document.querySelector(
			`input[data-testid="file-input"]`
		).files[0];
		const fileExtension = e.target.files[0].type;
		if (!["image/jpg", "image/jpeg", "image/png"].includes(fileExtension))
			return alert("Only accept file jpg, jpeg or png");
		const filePath = e.target.value.split(/\\/g);
		const fileName = filePath[filePath.length - 1];
		const formData = new FormData();
		formData.append("file", file);
		formData.append(
			"email",
			JSON.parse(localStorage.getItem("user")).email
		);

		/* istanbul ignore next */

		this.store
			.bills()
			.create({
				data: formData,
				headers: {
					noContentType: true,
				},
			})
			.then(({ fileUrl, key }) => {
				this.billId = key;
				this.fileUrl = fileUrl;
				this.fileName = fileName;
			})
			.catch((error) => console.error(error));
		// .catch((error) => {
		// 	throw error;
		// });
	};
	handleSubmit = (e) => {
		e.preventDefault();

		const email = JSON.parse(localStorage.getItem("user")).email;
		const bill = {
			email,
			type: e.target.querySelector(`select[data-testid="expense-type"]`)
				.value,
			name: e.target.querySelector(`input[data-testid="expense-name"]`)
				.value,
			amount: parseInt(
				e.target.querySelector(`input[data-testid="amount"]`).value
			),
			date: e.target.querySelector(`input[data-testid="datepicker"]`)
				.value,
			vat: e.target.querySelector(`input[data-testid="vat"]`).value,
			pct:
				parseInt(
					e.target.querySelector(`input[data-testid="pct"]`).value
				) || 20,
			commentary: e.target.querySelector(
				`textarea[data-testid="commentary"]`
			).value,
			fileUrl: this.fileUrl,
			fileName: this.fileName,
			status: "pending",
		};
		this.updateBill(bill);
		this.onNavigate(ROUTES_PATH["Bills"]);
	};

	// not need to cover this function by tests
	/* istanbul ignore next */
	updateBill = (bill) => {
		if (this.store) {
			return this.store
				.bills()
				.update({ data: JSON.stringify(bill), selector: this.billId })
				.then(() => {
					this.onNavigate(ROUTES_PATH["Bills"]);
				})
				.catch((error) => console.error(error));
		}
	};
}
