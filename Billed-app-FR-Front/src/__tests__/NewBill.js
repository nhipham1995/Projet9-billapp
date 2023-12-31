/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from "@testing-library/dom";

import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js";
import { bills } from "../fixtures/bills";
import router from "../app/Router";
import NewBill from "../containers/NewBill.js";
import NewBillUI from "../views/NewBillUI.js";

jest.mock("../app/Store", () => mockStore);

describe("Given I am connected as an employee", () => {
	describe("When I am on NewBill Page", () => {
		let container;
		beforeEach(() => {
			container = document.createElement("div");

			Object.defineProperty(window, "localStorage", {
				value: localStorageMock,
			});
			window.localStorage.setItem(
				"user",
				JSON.stringify({
					type: "Employee",
				})
			);
			window.alert = jest.fn();
		});
		afterEach(() => {
			// restore the spy created with spyOn
			jest.restoreAllMocks();
		});
		test("Invalid file returns alert after change event", async () => {
			const spyOnBills = mockStore.bills();
			jest.spyOn(spyOnBills, "create");

			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};
			container.innerHTML = NewBillUI();
			const newBill = new NewBill({
				document: container,
				onNavigate,
				store: mockStore,
				localStorage: window.localStorage,
			});

			const fileInput = container.querySelector(
				`input[data-testid="file-input"]`
			);
			const file = new File([""], "mockFile.pdf", {
				type: "application/pdf",
			});

			fireEvent.change(fileInput, {
				target: { files: [file] },
			});

			expect(fileInput).toBeTruthy();
			expect(window.alert).toHaveBeenCalledWith(
				"Only accept file jpg, jpeg or png"
			);
		});
		test("Valid upload file shold be render after change event", async () => {
			jest.spyOn(mockStore, "bills");

			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};
			container.innerHTML = NewBillUI();
			const newBill = new NewBill({
				document: container,
				onNavigate,
				store: mockStore,
				localStorage: window.localStorage,
			});

			const fileInput = container.querySelector(
				`input[data-testid="file-input"]`
			);
			const file = new File([""], "mockFile.jpeg", {
				type: "image/jpeg",
			});

			fireEvent.change(fileInput, {
				target: { files: [file] },
			});

			expect(fileInput).toBeTruthy();
		});

		test("Then I submit uploaded file, handleSubmit run correctly", async () => {
			const html = NewBillUI();
			document.body.innerHTML = html;
			Object.defineProperty(window, "localStorage", {
				value: localStorageMock,
			});
			window.localStorage.setItem(
				"user",
				JSON.stringify({
					type: "Employee",
				})
			);
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};
			const store = null;
			const bill = new NewBill({
				document,
				onNavigate,
				store,
				localStorage: window.localStorage,
			});

			const form = screen.getByTestId("form-new-bill");
			const handleSubmit = jest.fn(() => NewBill.handleSubmit);
			const handlePreventSubmit = jest.fn((e) => e.preventDefault());

			form.addEventListener("click", handleSubmit);
			form.addEventListener("submit", handleSubmit);
			form.addEventListener("submit", handlePreventSubmit);

			fireEvent.click(form);
			fireEvent.submit(form);

			expect(handlePreventSubmit).toHaveBeenCalled();
			expect(handleSubmit).toHaveBeenCalled();
		});
	});
});

// test d'intégration POST
describe("Given I am a user connected as an employee ", function () {
	test("POST  /Bills  ", async () => {
		const spyOnBills = mockStore.bills();
		const spy = jest.spyOn(spyOnBills, "update");

		let container;
		container = document.createElement("div");
		container.innerHTML = NewBillUI();

		localStorage.setItem(
			"user",
			JSON.stringify({ type: "Employee", email: "a@a" })
		);
		const root = document.createElement("div");
		root.setAttribute("id", "root");
		document.body.append(root);
		router();
		window.onNavigate(ROUTES_PATH.Bills);

		const newBill = new NewBill({
			document: container,
			onNavigate,
			store: mockStore,
			localStorage: window.localStorage,
		});
		spyOnBills.update(newBill);
		// console.log(newBill.store.bills().update.mockReturnThis());
		expect(spy).toHaveBeenCalledWith(newBill);

		await waitFor(() => screen.getByText("Mes notes de frais"));

		expect(screen.getByText("Mes notes de frais")).toBeTruthy();

		spy.mockRestore();
	});
	describe("When an error occurs on API", () => {
		beforeEach(() => {
			jest.spyOn(mockStore, "bills");
			Object.defineProperty(window, "localStorage", {
				value: localStorageMock,
			});
			window.localStorage.setItem(
				"user",
				JSON.stringify({
					type: "Employee",
					email: "a@a",
				})
			);
			const root = document.createElement("div");
			root.setAttribute("id", "root");
			document.body.appendChild(root);
			router();
		});
		test("fetches bills from an API and fails with 404 message error", async () => {
			console.error = jest.fn();
			window.onNavigate(ROUTES_PATH.NewBill);

			const form = screen.getByTestId("form-new-bill");
			const handleSubmit = jest.fn(() => NewBill.handleSubmit);

			mockStore.bills.mockImplementationOnce(() => {
				return {
					update: () => {
						return Promise.reject(new Error("Erreur 404"));
					},
				};
			});
			form.addEventListener("submit", handleSubmit);
			fireEvent.submit(form);
			expect(handleSubmit).toHaveBeenCalled();
			window.onNavigate(ROUTES_PATH.Bills);
			await new Promise(process.nextTick);
			expect(console.error).toHaveBeenCalledWith(new Error("Erreur 404"));
		});
		test("fetches messages from an API and fails with 500 message error", async () => {
			console.error = jest.fn();
			window.onNavigate(ROUTES_PATH.NewBill);
			const form = screen.getByTestId("form-new-bill");
			const handleSubmit = jest.fn(() => NewBill.handleSubmit);

			mockStore.bills.mockImplementationOnce(() => {
				return {
					update: () => {
						return Promise.reject(new Error("Erreur 500"));
					},
				};
			});
			form.addEventListener("submit", handleSubmit);
			fireEvent.submit(form);
			expect(handleSubmit).toHaveBeenCalled();
			window.onNavigate(ROUTES_PATH.Bills);
			await new Promise(process.nextTick);
			expect(console.error).toHaveBeenCalledWith(new Error("Erreur 500"));
		});
	});
});
