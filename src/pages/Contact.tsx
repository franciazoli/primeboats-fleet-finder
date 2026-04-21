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
          Send us a message and we'll get back within one business day. We can also arrange viewings, sea trials and delivery anywhere in the Netherlands.
        </p>

        <div className="mt-8 space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-accent" />
            <div>
              <p className="font-semibold text-primary">Visit us</p>
              <p className="text-muted-foreground">Havenstraat 12, 1075 PR Amsterdam</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 text-accent" />
            <div>
              <p className="font-semibold text-primary">Call</p>
              <p className="text-muted-foreground">+31 20 123 4567</p>
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
  </div>
);

export default Contact;