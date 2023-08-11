/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import { ROUTES_PATH } from "../constants/routes.js";

describe("Given I am connected as an employee", () => {
	describe("When I am on NewBill Page", () => {
		test("Then I click upload file, handleChangeFile execute", () => {
			const html = NewBillUI();
			document.body.innerHTML = html;
			// const input = screen.getByTestId("file");

			// const handleChangeFile = jest.fn(() => NewBill.handleChangeFile);

			// input.addEventListener("click", handleChangeFile);
			// fireEvent.click(input);
			// expect(handleChangeFile).toHaveBeenCalled();
			// const preventDefault = jest.fn((e) => e.preventDefault());
			// input.addEventListener("click", preventDefault);
			// fireEvent.click(input);
			// expect(preventDefault).toHaveBeenCalled();
			// const root = document.createElement("div");
			// root.setAttribute("id", "root");
			// document.body.append(root);
			// router();
			// window.onNavigate(ROUTES_PATH.NewBill);
			const input = screen.getByTestId("file");
			const clickHandler = jest.fn(() => NewBill.handleClickNewBill);
			input.addEventListener("change", clickHandler);
			fireEvent.change(input);
			expect(clickHandler).toHaveBeenCalled();
		});
		// 		test("Then I can upload an image of type PNG", async () => {
		// 			const html = NewBillUI();
		// 			document.body.innerHTML = html;
		// 			let file;
		// 			file = new File(["chucknorris.png"], "chucknorris.png", {
		// 				type: "image/png",
		// 			});
		// 			//to-do write assertion
		// 			const input = screen.getByTestId("file");

		// 			await waitFor(() => {
		// 				fireEvent.change(input, {
		// 					target: {
		// 						files: [file],
		// 					},
		// 				});
		// 			});
		// 			let image = document.getElementById("file");
		// 			expect(image.files[0].name).toBe("chucknorris.png");
		// 			expect(image.files.length).toBe(1);
		// 		});

		test("Then handle file change correctly", async () => {
			const root = document.createElement("div");
			root.setAttribute("id", "root");
			const input = screen.getByTestId("file");

			const handleChangeFile = jest.fn(() => NewBill.handleChangeFile);

			input.addEventListener("change", handleChangeFile);

			await userEvent.upload(input, {
				target: {
					files: [
						new File(["chucknorris.pdf"], "chucknorris.pdf", {
							type: "application/pdf",
						}),
					],
				},
			});

			// 			expect(input.files.length).toBe(0);

			// 			// expect(handleChangeFile).toHaveBeenCalled();
			// 			// const preventDefault = jest.fn((e) => e.preventDefault());
			// 			// input.addEventListener("change", preventDefault);
			// 			// fireEvent.change(input);
			// 			// expect(preventDefault).toHaveBeenCalled();

			// 			// console.log(input.files[0].name);
			// 			// expect(input.type).toBe("file");

			// 			// userEvent.upload(fileInput, file);

			// 			// expect(fileInput.files[0]).toStrictEqual(file);
		});
		// 		test("Then JPEG file ", async () => {
		// 			const input = screen.getByTestId("file");
		// 			console.log(input);
		// 			const handleChangeFile = jest.fn(() => NewBill.handleChangeFile);

		// 			input.addEventListener("change", handleChangeFile);
		// 			await userEvent.upload(input, {
		// 				target: {
		// 					files: [
		// 						new File(["chucknorris.jpeg"], "chucknorris.jpeg", {
		// 							type: "image/jpeg",
		// 						}),
		// 					],
		// 				},
		// 			});
		// 			expect(input.files.length).toBe(0);
		// 		});

		// 		test("Then show  an error alert for invalid file types", () => {
		// 			// const file = new File(["(⌐□_□)"], "chucknorris.pdf", {
		// 			// 	type: "text/pdf",
		// 			// });
		// 			// const fileInput = screen.getByTestId("file");

		// 			// userEvent.upload(fileInput, file);
		// 			const input = screen.getByTestId("file");
		// 			fireEvent.change(input, {
		// 				target: {
		// 					files: [
		// 						new File(["chucknorris.pdf"], "chucknorris.pdf", {
		// 							type: "image/pdf",
		// 						}),
		// 					],
		// 				},
		// 			});

		// 			// Prevent actual alerts from showing up
		// 			const originalAlert = window.alert;
		// 			window.alert = jest.fn();

		// 			fireEvent.submit(screen.getByTestId("form-new-bill"));

		// 			// Check if window.alert was called with the expected message
		// 			// expect(window.alert).toHaveBeenCalledWith(
		// 			// 	"Only accept file jpg, jpeg or png"
		// 			// );

		// 			// Restore the original alert
		// 			window.alert = originalAlert;
		// 		});
		// 		test("Then I submit uploaded file, preventDefault will run", async () => {
		// 			const html = NewBillUI();
		// 			document.body.innerHTML = html;

		// 			Object.defineProperty(window, "localStorage", {
		// 				value: localStorageMock,
		// 			});
		// 			const email = window.localStorage.getItem("email");
		// 			// console.log(email);
		// 			window.localStorage.setItem(
		// 				"user",
		// 				JSON.stringify({
		// 					type: "Employee",
		// 				})
		// 			);
		// 			const root = document.createElement("div");
		// 			root.setAttribute("id", "root");
		// 			document.body.append(root);
		// 			router();
		// 			const form = screen.getByTestId("form-new-bill");
		// 			const handleSubmit = jest.fn((e) => e.preventDefault());
		// 			form.addEventListener("submit", handleSubmit);
		// 			fireEvent.submit(form);
		// 			await window.onNavigate(ROUTES_PATH.Bills);

		// 			expect(handleSubmit).toHaveBeenCalled();
		// 			// expect(screen.getByText("Mes notes de frais")).toBeTruthy();
		// 		});
	});
});
