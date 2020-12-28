deepai.setApiKey('3794388d-a2e4-4984-90e2-636aed858286');


(async function() {
	console.log("awaiting...");
    var result = await deepai.callStandardApi("text-generator", {
            text: "Not again, I start a new startup, jesus",
    });
    
    /*var result = await deepai.callStandardApi("sentiment-analysis", {
    	text: "I am very sorry to hear"
	});*/
	console.log(result);
})()