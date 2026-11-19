import { MapPin, Waves, House, Umbrella } from "lucide-react";

function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label">GET TO KNOW US</span>
          <h1>About Sabando Ocampo Beach Resort</h1>
          <p>Discover our resort in Maramba, Oas, Albay.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <img
                src="/images/resort-front.jpg"
                alt="Sabando Ocampo Beach Resort building"
                className="img-fluid rounded-4 shadow"
              />
            </div>

            <div className="col-lg-6">
              <span className="section-label">OUR RESORT</span>
              <h2 className="section-title">Welcome to Our Beach Resort</h2>

              <p>
                Sabando Ocampo Beach Resort is situated in Maramba,
                Oas, Albay. The resort features accommodation buildings,
                cottages near the beach, and seaside attractions.
              </p>

              <p>
                Whether visiting with family or friends, guests can
                explore the available accommodations and make a
                reservation inquiry through this website.
              </p>

              <p className="mb-0">
                <MapPin size={18} /> Maramba, Oas, Albay, Philippines
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-soft">
        <div className="container">
          <div className="text-center section-heading">
            <span className="section-label">WHAT YOU CAN ENJOY</span>
            <h2 className="section-title">Resort Features</h2>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="info-card">
                <House />
                <h5>Accommodations</h5>
                <p>
                  Different room and cottage options are shown in the
                  resort's provided rate information.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="info-card">
                <Waves />
                <h5>Beach Activities</h5>
                <p>
                  The resort information includes a floating playground
                  and views of the sea.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="info-card">
                <Umbrella />
                <h5>Beachfront Cottages</h5>
                <p>
                  Small and medium beachfront cottages are featured
                  in the resort pictures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;