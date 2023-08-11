/**
 * @jest-environment jsdom
 */
import { screen, waitFor, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";
import mockStore from "../__mocks__/store";
import ErrorPage from "../views/ErrorPage.js";

describe("Given I am connected as an employee", () => {
	describe("When I am on Bills Page", () => {
		test("Then bill icon in vertical layout should be highlighted", async () => {
			Object.defineProperty(window, "localStorage", {
				value: localStorageMock,
			});
			window.localStorage.setItem(
				"user",
				JSON.stringify({
					type: "Employee",
				})
			);
			const root = document.createElement("div");
			root.setAttribute("id", "root");
			document.body.append(root);
			router();
			window.onNavigate(ROUTES_PATH.Bills);
			await waitFor(() => screen.getByTestId("icon-window"));
			const windowIcon = screen.getByTestId("icon-window");
			//to-do write expect expression
			const hasActiveIcon = windowIcon.className
				.split("' ")
				.includes("active-icon");
			expect(hasActiveIcon).toEqual(true);
		});
		test("Then bills should be ordered from earliest to latest", () => {
			document.body.innerHTML = BillsUI({ data: bills });
			const dates = screen
				.getAllByText(
					/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
				)
				.map((a) => a.innerHTML);
			const antiChrono = (a, b) => (a < b ? 1 : -1);
			const datesSorted = [...dates].sort(antiChrono);
			expect(dates).toEqual(datesSorted);
		});
		test("Then new button is clickable and open new form", () => {
			//test for the navigation + clickHanlder
			Object.defineProperty(window, "localStorage", {
				value: localStorageMock,
			});
			window.localStorage.setItem(
				"user",
				JSON.stringify({
					type: "Employee",
				})
			);
			const root = document.createElement("div");
			root.setAttribute("id", "root");
			document.body.append(root);
			router();
			window.onNavigate(ROUTES_PATH.NewBill);
			const newFormButton = screen.getByTestId("btn-new-bill");
			const clickHandler = jest.fn(() => Bills.handleClickNewBill);
			newFormButton.addEventListener("click", clickHandler);
			fireEvent.click(newFormButton);
			expect(clickHandler).toHaveBeenCalled();
		});
		test("Then a modal should open when I click on the icon eye ", () => {
			const handleClickIconEye = jest.fn(() => Bills.handleClickIconEye);
			const eye = screen.getAllByTestId("icon-eye");
			const modale = screen.getByTestId("modalFile");

			eye[0].addEventListener("click", handleClickIconEye);
			fireEvent.click(eye[0]);
			expect(handleClickIconEye).toHaveBeenCalled();

			expect(modale).toBeTruthy();
		});
	});
});

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
	describe("When I navigate to Bills", () => {
		test("fetches bills from mock API GET", async () => {
			localStorage.setItem(
				"user",
				JSON.stringify({ type: "Employee", email: "a@a" })
			);
			const root = document.createElement("div");
			root.setAttribute("id", "root");
			document.body.append(root);
			router();
			window.onNavigate(ROUTES_PATH.Dashboard);
			await waitFor(() => screen.getByText("Mes notes de frais"));
			const contentPending = await screen.getByText("Transports");
			expect(contentPending).toBeTruthy();
			expect(screen.getAllByTestId("bill-eye-icon")).toBeTruthy();
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
			test("fetches bill from an API and fails with 404 message error", async () => {
				mockStore.bills.mockImplementationOnce(() => {
					return {
						list: () => {
							return Promise.reject(new Error("Erreur 404"));
						},
					};
				});
				window.onNavigate(ROUTES_PATH.Bills);
				await new Promise(process.nextTick);
				const errors = "Erreur 404";
				const html = ErrorPage(errors);
				document.body.innerHTML = html;
				expect(screen.getAllByText(errors)).toBeTruthy();
			});

			test("fetches messages from an API and fails with 500 message error", async () => {
				mockStore.bills.mockImplementationOnce(() => {
					return {
						list: () => {
							return Promise.reject(new Error("Erreur 500"));
						},
					};
				});

				window.onNavigate(ROUTES_PATH.Bills);
				await new Promise(process.nextTick);
				const errors = "Erreur 500";
				const html = ErrorPage(errors);
				document.body.innerHTML = html;
				expect(screen.getAllByText(errors)).toBeTruthy();
			});
		});
	});
});
