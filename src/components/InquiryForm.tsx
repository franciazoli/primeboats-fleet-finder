import { useState } from "react";
import { z } from "zod";
import { Boat } from "@/data/boats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { submitInquiry } from "@/lib/api";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  email: z.string().trim().email("Invalid email").max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please add a few details (min 10 chars)").max(1500),
});

type FormData = z.infer<typeof schema>;

interface Props {
  boat?: Boat;
  onSubmitted?: () => void;
}

export const InquiryForm = ({ boat, onSubmitted }: Props) => {
  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: boat ? `Hi PrimeBoats team,\n\nI'm interested in the ${boat.name}. Could you share more information?\n\nThanks!` : "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Partial<Record<keyof FormData, string>> = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as keyof FormData;
        errs[k] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await submitInquiry({
        ...parsed.data,
        boatId: boat?.id,
      });
      toast({
        title: "Inquiry sent",
        description: "Thanks! We'll get back to you within one business day.",
      });
      setData({ name: "", email: "", phone: "", message: "" });
      onSubmitted?.();
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const update = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData({ ...data, [k]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {boat && (
        <div className="rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm">
          <span className="text-muted-foreground">Inquiring about:</span>{" "}
          <span className="font-semibold text-primary">{boat.name}</span>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={data.name} onChange={update("name")} maxLength={80} />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={data.email} onChange={update("email")} maxLength={160} />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" value={data.phone} onChange={update("phone")} maxLength={40} />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={5} value={data.message} onChange={update("message")} maxLength={1500} />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
      </div>
      <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary/90 sm:w-auto">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Sending..." : "Send inquiry"}
      </Button>
    </form>
  );
};
