import { get as getHttps, RequestOptions as RequestOptionsHttps } from 'https';
import { get as getHttp, RequestOptions as RequestOptionsHttp } from 'http';
import { stringify } from 'querystring'; // used for debugging

export class WebUtils {

	public async get(url: string | URL,
		options: RequestOptionsHttps | RequestOptionsHttp = {}): Promise<string> {

		if (url instanceof URL) {
			let u: URL = (url as URL);
			if (u.protocol == "https:")
				return this.getContentHttps(u, options);
			else
				return this.getContentHttp(u, options);
		}
		else {
			if (url.startsWith("https:"))
				return this.getContentHttps(url, options);
			else
				return this.getContentHttp(url, options);
		}


	}

	private async getContentHttps(url: string | URL,
		options: RequestOptionsHttps): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			let content = "";
			const req = getHttps(url, options, (res) => {
				// console.log(`STATUS: ${res.statusCode}`);
				// console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
				res.setEncoding('utf8');
				res.on('data', (chunk) => {
					// console.log(`BODY: ${chunk}`);
					content += chunk;
				});
				res.on('end', () => {
					resolve(content);
				});
				req.on('error', (e) => {
					console.error(`problem with request: ${e.message}`);
					reject("Error dowloading from " + url.toString());
				});
				req.end();
			});
		});
	}


	private async getContentHttp(url: string | URL,
		options: RequestOptionsHttp): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			let content = "";
			const req = getHttp(url, options, (res) => {
				// console.log(`STATUS: ${res.statusCode}`);
				// console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
				res.setEncoding('utf8');
				res.on('data', (chunk) => {
					// console.log(`BODY: ${chunk}`);
					content += chunk;
				});
				res.on('end', () => {
					resolve(content);
				});
				req.on('error', (e) => {
					console.error(`problem with request: ${e.message}`);
					reject("Error dowloading from " + url.toString());
				});
				req.end();
			});
		});
	}
}