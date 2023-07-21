/**
 * @jest-environment jsdom
 */
import { screen, waitFor, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import ClickEyeIconHandler from "../__mocks__/clickEyeIconHandler.js";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";
import { JSDOM } from "jsdom-global";
jest.mock("jquery", () => ({
	width: jest.fn().mockReturnValue(100), // Mock the width of the element.
}));

// Mock the class that uses 'iconEye.forEach'
jest.mock("../__mocks__/clickEyeIconHandler.js", () => {
	const eyeIconHandlerClass = jest.requireActual(
		"../__mocks__/clickEyeIconHandler.js"
	).default;
	return {
		__esModule: true,
		default: eyeIconHandlerClass,
	};
});
describe("Given I am connected as an employee", () => {
	describe("When I am on Bills Page", () => {
		let clickHandler;

		beforeEach(() => {
			// Create a new instance before each test to isolate the test cases.
			clickHandler = new ClickEyeIconHandler();

			// Mock the iconEye property.
			clickHandler.iconEye = [
				{ addEventListener: jest.fn() },
				{ addEventListener: jest.fn() },
				// Add more mocked icons if needed for your test cases.
			];
		});

		afterEach(() => {
			// Reset the mock function's call history after each test.
			jest.clearAllMocks();
		});

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
		test("Then handleClickIconEye opens modal with correct image source", () => {
			// const iconMock = {
			// 	getAttribute: jest
			// 		.fn()
			// 		.mockReturnValue("https://example.com/bill.jpg"),
			// };
			// const modalShowMock = jest.fn();

			// Simulate the click event
			// const clickHandler = jest.fn((icon) => Bills.handleClickIconEye);
			// const eyes = screen.getAllByTestId("icon-eye");
			// const modaleFile = screen.getByTestId("modalFile");
			// Expect that the correct image source is used and the modal is shown
			// const expectedImgWidth = Math.floor(modaleFile.width() * 0.5);
			// expect(modaleFile.find(".modal-body").html()).toContain(
			// 	`width=${expectedImgWidth} src="https://example.com/bill.jpg"`
			// );
			// let item;
			// eyes.forEach((icon) => {
			// 	icon.addEventListener("click", clickHandler(icon));
			// 	item = icon;
			// });
			// userEvent.click(eye);

			// expect(clickHandler).toHaveBeenCalled();
			// console.log(modaleFile.className);
			// const isShown = modaleFile.className.split("' ").includes("show");
			// const isModal = modaleFile.className.split("' ").includes("modal");
			// console.log(isShown);
			// expect(isShown).toEqual(true);
			// expect(isModal).toEqual(true);
			// let clickHandler = new ClickEyeIconHandler();

			// clickHandler.iconEye = [
			// 	{ addEventListener: jest.fn() },
			// 	{ addEventListener: jest.fn() },
			// ];
			// const icon = clickHandler.iconEye[0]; // Choose an icon for your test.
			// const billUrl = "https://example.com/bill.jpg";

			// // Mock the required attribute and methods for the icon element

			// const addEventListenerMock = jest.fn((_, callback) => {
			// 	icon.clickHandler = callback; // Store the event handler on the icon object.
			// });
			// icon.addEventListener = addEventListenerMock;

			// // Trigger the click event by calling the event listener
			// const clickEvent = new Event("click");
			// clickHandler.handleClickIconEye(icon);
			// expect(icon.clickHandler).toBeDefined();
			// icon.clickHandler(clickEvent);

			// // Assert that the handleClickIconEye method was called with the correct arguments
			// expect(clickHandler.handleClickIconEye).toHaveBeenCalledWith(icon);

			// // Add your assertions here based on what you expect the method to do.
			// // For example, you can check if the modal was shown and if the correct bill URL was used.
			// // expect(modaleFile.find(".modal-body").html()).toContain(
			// // 	`<img width=50 src=${billUrl} alt="Bill" />`
			// // );
			// const mockModalBodyHtml = jest.fn();
			// const mockModal = jest.fn().mockReturnValue({
			// 	find: jest.fn().mockReturnValue({
			// 		html: mockModalBodyHtml,
			// 	}),
			// });
			// const $ = jest.fn().mockReturnValue(mockModal);
			// expect(mockModal).toHaveBeenCalledWith("show");
			// expect($("#modaleFile")).toHaveBeenCalledWith(".modal-body");
			// expect(mockModalBodyHtml).toHaveBeenCalledWith(
			// 	expect.stringContaining(
			// 		`<img width=50 src=${billUrl} alt="Bill" />`
			// 	)
			// );
			const icon = {
				getAttribute: jest
					.fn()
					.mockReturnValue("https://example.com/bill.jpg"),
				addEventListener: jest.fn(),
			};
			// Create a new instance of ClickEyeIconHandler
			const clickHandler = new ClickEyeIconHandler();

			// Add the mock icon to the iconEye property
			clickHandler.iconEye = [icon];

			// Manually call the handleClickIconEye method with the mock icon
			clickHandler.handleClickIconEye(icon);

			// Check if the event listener was added to the icon
			expect(icon.addEventListener).toHaveBeenCalledWith(
				"click",
				expect.any(Function)
			);
			// Retrieve the click event handler function from the icon object
			const clickHandlerFunction = icon.addEventListener.mock.calls[0][1];

			// Create a mock for the modal method (you may need to adjust this based on your actual implementation)
			const mockModal = jest.fn();

			// Replace the implementation of the modal method on the global object with the mock
			global.$ = jest.fn(() => ({
				find: jest.fn(() => ({ html: mockModal })),
			}));

			// Trigger the click event using the mocked clickHandlerFunction
			clickHandlerFunction();

			// // const icon = clickHandler.iconEye[0]; // Choose an icon for your test.
			// const billUrl = "https://example.com/bill.jpg";

			// // Manually create a mock for the addEventListener method.
			// const addEventListenerMock = jest.fn((event, callback) => {
			// 	if (event === "click") {
			// 		icon.clickHandler = callback; // Store the event handler on the icon object.
			// 	}
			// });
			// icon.addEventListener = addEventListenerMock;

			// // Trigger the click event by calling the event listener with an event object
			// const clickEvent = new Event("click");
			// clickHandler.handleClickIconEye(icon);

			// // Now we can directly trigger the click event on the specific icon.
			// icon.clickHandler(clickEvent);
			// const iconElement = screen.getAllByTestId("icon-eye")[0];

			// Fire the click event using the testing library's fireEvent.click()
			// fireEvent.click(iconElement);
			// Assert that the modal method was called and the correct bill URL was used.
			expect($("#modaleFile").find).toHaveBeenCalledWith(".modal-body");
			expect($("#modaleFile").find(".modal-body").html()).toContain(
				`<img width=50 src=${billUrl} alt="Bill" />`
			);
		});
		test("handleClickIconEye should update modal content and show modal", () => {
			// Create a mock icon element with a "data-bill-url" attribute
			const icon = document.createElement("div");
			icon.setAttribute("data-bill-url", "https://example.com/bill.jpg");

			// Instantiate the Bills class and call the function
			// const billsInstance = new Bills({});
			// billsInstance.handleClickIconEye(icon);

			// Verify if the modal content was updated with the correct image URL
			const modalBodyContent = document.querySelector(
				"#modaleFile .modal-body"
			).innerHTML;
			expect(modalBodyContent).toContain("https://example.com/bill.jpg");

			// Verify if the modal is shown (visible)
			const modalElement = document.querySelector("#modaleFile");
			expect(modalElement.style.display).not.toBe("none");
		});

		it("should call handleClickIconEye when icon is clicked", () => {
			// Create a mock element to represent the iconEye element
			// const iconEyeElementMock = document.createElement("div");

			// iconEyeElementMock.setAttribute("data-testid", "icon-eye");
			document.body.innerHTML = BillsUI({ data: bills });

			const testIcon = screen.getAllByTestId("icon-eye");
			console.log(testIcon);
			// console.log(iconEyeElementMock);

			// Add the mock element to the document
			// document.body.appendChild(iconEyeElementMock);

			// Create a mock instance of the Bills class
			const billsMock = new Bills({
				document,
				onNavigate: jest.fn(),
				store: null,
				localStorage: null,
			});

			// Mock the handleClickIconEye method
			const handleClickIconEye = jest.fn((icon) =>
				billsMock.handleClickIconEye(icon)
			);

			// Call the addClickListeners method directly to simulate adding the event listener
			billsMock.addClickListeners();

			// fireEvent.click(iconEyeElementMock);
			screen.debug();

			// Expect the handleClickIconEye method to have been called once with the mock element
			// expect(billsMock.handleClickIconEye).toHaveBeenCalledTimes(1);
			// expect(billsMock.handleClickIconEye).toHaveBeenCalledWith(
			// 	iconEyeElementMock
			// );
		});
	});
});
