import { useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import api from "../services/api";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setNotice("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/contact", form);
      setNotice(response.data.message || "Your message has been sent.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to send your message. Please contact the resort directly."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section-padding">
      <div className="container">
        <div className="text-center section-heading">
          <span className="section-label">GET IN TOUCH</span>
          <h1 className="section-title">Contact Us</h1>
          <p>Send an inquiry about accommodations and reservations.</p>
        </div>

        <div className="row g-5">
          <div className="col-lg-5">
            <div className="contact-information">
              <h4>Resort Information</h4>

              <p>
                <MapPin />
                <span>
                  <strong>Location</strong>
                  Maramba, Oas, Albay, Philippines
                </span>
              </p>

              <p>
                <Phone />
                <span>
                  <strong>Telephone</strong>
                  09936890815
                </span>
              </p>

              <p>
                <Mail />
                <span>
                  <strong>Email</strong>
                  sobeachresort@gmail.com
                </span>
              </p>

              <img
                src="/images/ocean-view.jpg"
                alt="Resort ocean view"
                className="contact-image"
              />
            </div>
          </div>

          <div className="col-lg-7">
            <div className="contact-form-card">
              {notice && <div className="alert alert-success">{notice}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Your Name</label>
                  <input
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Subject</label>
                  <input
                    className="form-control"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button className="btn btn-primary" disabled={loading}>
                  <Send size={17} />
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;