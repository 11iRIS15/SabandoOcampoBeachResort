const { pool } = require("../config/database");

// Customer sends a contact message
const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields."
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    if (
      String(name).trim().length > 150 ||
      String(email).trim().length > 150 ||
      String(subject).trim().length > 200
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more fields exceed the allowed length."
      });
    }

    const [result] = await pool.query(
      `INSERT INTO contacts (name, email, subject, message)
       VALUES (?, ?, ?, ?)`,
      [
        String(name).trim(),
        String(email).trim(),
        String(subject).trim(),
        String(message).trim()
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Your inquiry has been submitted successfully.",
      contact: {
        id: result.insertId,
        name,
        email,
        subject,
        message,
        status: "New"
      }
    });

  } catch (error) {
    console.error("Create contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your inquiry."
    });
  }
};


// Administrator views all inquiries
const getAllContacts = async (req, res) => {
  try {
    const [contacts] = await pool.query(
      `SELECT *
       FROM contacts
       ORDER BY created_at DESC`
    );

    return res.json({
      success: true,
      count: contacts.length,
      contacts
    });

  } catch (error) {
    console.error("Get contacts error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve customer inquiries."
    });
  }
};


// Administrator updates inquiry status
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["New", "Read", "Replied"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry status."
      });
    }

    const [result] = await pool.query(
      "UPDATE contacts SET status = ? WHERE id = ?",
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found."
      });
    }

    return res.json({
      success: true,
      message: "Inquiry status updated successfully."
    });

  } catch (error) {
    console.error("Update contact status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update inquiry status."
    });
  }
};


module.exports = {
  createContact,
  getAllContacts,
  updateContactStatus
};