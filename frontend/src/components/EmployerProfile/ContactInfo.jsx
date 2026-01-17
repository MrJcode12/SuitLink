import { Mail, Phone, MapPin } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg text-gray-900 mb-4">Contact</h2>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Mail className="size-4" />
          <span>careers@techcorp.com</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Phone className="size-4" />
          <span>+1 (555) 123-4567</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="size-4" />
          <span>123 Tech Street, SF, CA 94102</span>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
