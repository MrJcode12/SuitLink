import { Mail, Phone, MapPin } from "lucide-react";

const ContactInfo = ({ companyProfile }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg text-gray-900 mb-4">Contact</h2>
      <div className="space-y-3">
        {companyProfile?.contactEmail && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Mail className="size-4" />
            <span>{companyProfile.contactEmail}</span>
          </div>
        )}
        {companyProfile?.contactPhone && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone className="size-4" />
            <span>{companyProfile.contactPhone}</span>
          </div>
        )}
        {companyProfile?.location && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="size-4" />
            <span>{companyProfile.location}</span>
          </div>
        )}
        {!companyProfile?.contactEmail &&
          !companyProfile?.contactPhone &&
          !companyProfile?.location && (
            <p className="text-sm text-gray-500">
              No contact information available.
            </p>
          )}
      </div>
    </div>
  );
};

export default ContactInfo;
