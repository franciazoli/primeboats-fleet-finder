import { InquiryForm } from "@/components/InquiryForm";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => (
  <div className="container py-12 md:py-20">
    <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Contact</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-primary md:text-5xl">
          Let's find your boat
        </h1>
        <p className="mt-4 text-muted-foreground">
          Send us a message and we'll get back within one business day. We can arrange viewings,
          demo rides and full custom fit-outs — motor, canopy, rod holders, whatever you need.
        </p>

        <div className="mt-8 space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-accent" />
            <div>
              <p className="font-semibold text-primary">Visit us</p>
              <p className="text-muted-foreground">Sittard Doctor Noleslaan 145</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 text-accent" />
            <div>
              <p className="font-semibold text-primary">Call</p>
              <p className="text-muted-foreground">+36 70 944 7924</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-accent" />
            <div>
              <p className="font-semibold text-primary">Email</p>
              <p className="text-muted-foreground">info@primeboats.nl</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-card md:p-8">
        <InquiryForm />
      </div>
    </div>

    <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-lg border border-border">
      <iframe
        title="PrimeBoats location"
        src="https://maps.google.com/maps?q=Doctor+Noleslaan+145,+Sittard&output=embed"
        width="100%"
        height="300"
        style={{ border: 0, display: "block" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  </div>
);

export default Contact;