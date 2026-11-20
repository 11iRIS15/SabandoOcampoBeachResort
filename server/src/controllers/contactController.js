const Contact = require("../models/Contact");

// CUSTOMER SENDS A CONTACT MESSAGE
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

    const contact = await Contact.create({
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject).trim(),
      message: String(message).trim(),
      status: "New"
    });

    return res.status(201).json({
      success: true,
      message: "Your inquiry has been submitted successfully.",
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        status: contact.status
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


// ADMINISTRATOR VIEWS ALL INQUIRIES
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 });

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


// ADMINISTRATOR UPDATES INQUIRY STATUS
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

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
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