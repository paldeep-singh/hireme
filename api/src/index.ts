import api from "./api.js";

const port = process.env.PORT ?? 3000;

api.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
