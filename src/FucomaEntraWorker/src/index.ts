import jsonwebtoken from 'jsonwebtoken';
import {
	OnAttributeCollectionSubmitEvent,
	OnAttributeCollectionSubmitEventResponse
} from "types/entra.types";
import { isEmptyString } from "utils/stringUtils";

export default {
	async fetch(request, env, ctx): Promise<Response> {

		if (request.method !== "POST") {
			return new Response("Incorrect HTTP Method", { status: 405 });
		}

		// Validate Header
		const authorization = request.headers.get("Authorization");

		if (!authorization) {
			return new Response("No Auth header", {
				status: 401
			});
		}

		// Config Values validation
		if (isEmptyString(env.ACCESS_CODE) ||
			isEmptyString(env.APPLICATION_WORKER_ID) ||
			isEmptyString(env.APPLICATION_B2CEXTENSIONS_ID) ||
			isEmptyString(env.TENANT_ID)) {
			return new Response("Invalid Config Value", { status: 403 });
		}

		const hashToken = authorization.split(' ');

		if (!hashToken[1]) {
			return new Response("Invalid token lenght", { status: 403 });
		}

		const decodedToken = jsonwebtoken.decode(hashToken[1]);

		if (
			decodedToken["azp"] !== "99045fe1-7639-4a75-9d4a-577b6ca3810f" ||
			decodedToken["aud"] !== env.APPLICATION_WORKER_ID ||
			decodedToken["iss"] !== `https://${env.TENANT_ID}.ciamlogin.com/${env.TENANT_ID}/v2.0`
		) {
			return new Response("No valid token", { status: 403 });
		}

		const entraRequest = await request.json<OnAttributeCollectionSubmitEvent>();

		if (entraRequest.data.userSignUpInfo.attributes[`extension_${env.APPLICATION_B2CEXTENSIONS_ID}_AccessCode`].value !== env.ACCESS_CODE) {
			const response: OnAttributeCollectionSubmitEventResponse = {
				data: {
					"@odata.type": "microsoft.graph.onAttributeCollectionSubmitResponseData",
					actions: [
						{
							"@odata.type": "microsoft.graph.attributeCollectionSubmit.showBlockPage",
							message: "Incorrect submit. Contact FuCoMa Administrator"
						}
					]
				}
			}

			return new Response(JSON.stringify(response), {
				status: 200, headers: {
					'Content-Type': 'application/json'
				}
			});
		} else {
			const response: OnAttributeCollectionSubmitEventResponse = {
				data: {
					"@odata.type": "microsoft.graph.onAttributeCollectionSubmitResponseData",
					actions: [
						{
							"@odata.type": "microsoft.graph.attributeCollectionSubmit.continueWithDefaultBehavior"
						}
					]
				}
			}

			return new Response(JSON.stringify(response), {
				status: 200, headers: {
					'Content-Type': 'application/json'
				}
			});
		}

	},

} satisfies ExportedHandler<Env>;