import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	const [code, setCode] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		if (code === "123456") {
			console.log("Code is correct");
			navigate({ from: "/", to: "/why" }).catch(() =>
				alert("An error occurred."),
			);
		}
	});

	return (
		<div>
			<label htmlFor="code" style={{ display: "block" }}>
				Please enter the 6 digit code provided in my resume:
			</label>
			<input
				type="text"
				id="code"
				name="code"
				minLength={6}
				maxLength={6}
				value={code}
				onChange={(e) => {
					setCode(e.target.value);
				}}
			/>
		</div>
	);
}
