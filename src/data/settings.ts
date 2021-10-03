export const devSettings = {
	data: {
		baseurl: "http://localhost:4200/",
		chatUrl: "http://localhost:5001/",
		serverUrl: "http://127.0.0.1:8000",
		template: "base",
		title: "Remote Nepal",
		titlePrefix: " | ",
		production: false,
		adminEmail: "admin@remotenepal.com",
		khaltiPublicKey: "test_public_key_b4703e75f856498eb9378d103029af5a",
		eSewaPayEndpoint: "https://uat.esewa.com.np/epay/main",
		googleAnalyticsTrackingId: "UA-174245279-1",
	}
}


export const prodSettings = {
	data: {
		baseurl: "https://remotenepal.com/",
		chatUrl: "https://remotenepal.com/",
		serverUrl: "https://remotenepal.com", 
		template: "base",
		title: "Remote Nepal",
		titlePrefix: " | ",
		production: true,
		adminEmail: "admin@remotenepal.com",
		khaltiPublicKey: "test_public_key_b4703e75f856498eb9378d103029af5a",
		eSewaPayEndpoint: "https://uat.esewa.com.np/epay/main",
		googleAnalyticsTrackingId: "UA-174659270-1",
	}
}