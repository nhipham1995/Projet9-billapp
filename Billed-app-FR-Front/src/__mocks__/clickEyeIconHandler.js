class ClickEyeIconHandler {
	constructor() {
		// Initialize properties and set up the class.
		this.iconEye = []; // Initialize the iconEye property as an empty array.
	}
	handleClickIconEye(icon) {
		const billUrl = icon.getAttribute("data-bill-url");
		const imgWidth = Math.floor($("#modaleFile").width() * 0.5);
		$("#modaleFile").find(".modal-body").html(`
         <div style='text-align: center;' class="bill-proof-container">
           <img width=${imgWidth} src=${billUrl} alt="Bill" />
         </div>
       `);
		//   $("#modaleFile") "show";
	}
}

export default ClickEyeIconHandler;
