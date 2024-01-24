import { useState, useEffect } from "react";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket;
function App() {
	const [documentContent, setDocumentContent] = useState("");
	const [documentId, setDocumentId] = useState("");

	useEffect(() => {
		socket = io(ENDPOINT);

		socket.on("document", (content) => {
			setDocumentContent(content);
		});

		socket.on("update-code", (context) => {
			setDocumentContent(context);
		});

		socket.on("userLeft", (leftUserId) => {
			console.log(`User left: ${leftUserId}`);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const handleEdit = async (e) => {
		const content = e.target.value;
		try {
			const response = await fetch(`${ENDPOINT}/update-document`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					documentId,
					content,
				}),
			});

			if (response.ok) {
				const updatedContent = await response.json();
				socket.emit("edit", updatedContent.content);
			} else {
				console.error("Failed to update document");
			}
		} catch (error) {
			console.error("Error updating document:", error);
		}
	};

	const handleJoin = async (e) => {
		e.preventDefault();
		const trimmedDocumentId = documentId.trim();

		if (trimmedDocumentId) {
			socket.emit("join", trimmedDocumentId);
			const response = await fetch(`${ENDPOINT}/${trimmedDocumentId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				setDocumentContent(await response.json().content);
			} else {
				console.error("Failed to update document");
			}
		}
	};

	return (
		<div className="app-container">
			<h1>Collaborative Document Editor</h1>
			<textarea
				className="editor-textarea"
				value={documentContent}
				onChange={(e) => handleEdit(e)}
				rows={10}
				cols={50}
				placeholder="Start typing..."
			/>
			<br />
			<form onSubmit={(e) => handleJoin(e)}>
				<div className="input-group">
					<input
						className="user-input"
						placeholder="Enter your Document id"
						onChange={(e) => setDocumentId(e.target.value)}
						required
					/>
					<button className="submit-button" type="submit">
						Join
					</button>
				</div>
			</form>
		</div>
	);
}

export default App;
