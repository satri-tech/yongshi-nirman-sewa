import {
  CreditCard,
  Mail,
  Phone,
  Users,
  LocationEdit,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
export const contactInfo = {
  section: {
    title: "Connect with Milan Educare",
    description:
      "Have questions about admissions, courses, or collaborations? Reach out to our team and we'll get back to you shortly.",
    badge: "We're Here to Help",
  },

  form: {
    title: "GET IN TOUCH",
    fields: [
      {
        id: "full-name",
        label: "Full Name",
        type: "text",
        placeholder: "Your full name",
        colSpan: 1,
      },
      {
        id: "phone",
        label: "Phone Number",
        type: "text",
        placeholder: "9800000000",
        colSpan: 1,
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        placeholder: "you@example.com",
        colSpan: 2,
      },
      {
        id: "message",
        label: "Message",
        type: "textarea",
        placeholder: "Write your message here...",
        colSpan: 2,
      },
    ],
    submitText: "Submit Inquiry",
  },

  contactCards: [
    {
      icon: CreditCard,
      title: "CONTACT INFORMATION",
      items: [
        {
          icon: <Phone className="h-5 w-5" />,
          label: "Phone",
          value: "+977 984-6844126",
        },
        {
          icon: <LocationEdit className="h-5 w-5" />,
          label: "Location",
          value: "Pokhara 7, Shantinagar Chowk",
        },
        {
          icon: <Mail className="h-5 w-5" />,
          label: "Email",
          value: "milaan.educarepkr@gmail.com",
        },
      ],
    },
    {
      icon: Users,
      title: "FOLLOW US ONLINE",
      description:
        "Get updates on events, scholarships, and academic life at Milan Educare.",
      socialLinks: [
        {
          name: "Facebook",
          href: "https://www.facebook.com/milaneducare",
          icon: <FaFacebookF className="h-5 w-5" />,
          color: "bg-blue-600",
        },
        {
          name: "Instagram",
          href: "https://www.instagram.com/milaneducare/",
          icon: <FaInstagram className="h-5 w-5" />,
          color: "bg-pink-500",
        },
        {
          name: "LinkedIn",
          href: "https://www.linkedin.com/company/milaneducare",
          icon: <FaLinkedin className="h-5 w-5" />,
          color: "bg-blue-700",
        },
        {
          name: "YouTube",
          href: "https://www.youtube.com/@milaneducare",
          icon: <FaYoutube className="h-5 w-5" />,
          color: "bg-red-600",
        },
      ],
    },
  ],
};
