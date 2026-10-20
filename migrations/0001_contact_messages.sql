-- Messages submitted through the contact form.
CREATE TABLE contact_messages (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	message TEXT NOT NULL,
	ip TEXT,
	user_agent TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_contact_messages_created_at ON contact_messages (created_at);
