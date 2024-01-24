const express = require("express");
const { DocumentModel } = require("./models");

const router = express.Router();
router.use(express.json());

router.get("/:id", async (req, res) => {
	try {
		const docId = req.params.id;
		const updatedDocument = await DocumentModel.findOneAndUpdate(
			{ documentId: docId },
			{ $setOnInsert: { documentId: docId, content: "" } },
			{ upsert: true, new: true,},
		);
		if (!updatedDocument) {
			return res
				.status(404)
				.json({ error: true, message: "Document not found" });
		}
		console.log(updatedDocument);
		res.status(200).json({ error: false, content: updatedDocument.content });
	} catch (error) {
		console.error("Error updating document:", error);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});
router.post("/update-document", async (req, res) => {
	try {
		const { documentId, content } = req.body;
		const updatedDocument = await DocumentModel.findOneAndUpdate(
			{ documentId },
			{ content },
			{ upsert: true, new: true },
		);
		if (!updatedDocument) {
			return res
				.status(404)
				.json({ error: true, message: "Document not found" });
		}

		console.log(updatedDocument);
		res.status(200).json({ error: false, content: updatedDocument.content });
	} catch (error) {
		console.error("Error updating document:", error);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

module.exports = router;
