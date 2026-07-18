import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

type ServiceCategory = {
  name: string;
  services: string[];
};

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    name: 'Employment & Training',
    services: [
      'Job Training / Certifications',
      'Paid Work & Job Placement',
      'Reentry Employment Help',
      'Youth Job Readiness',
      'Skilled Trades Training',
    ],
  },
  {
    name: 'Reentry & Case Support',
    services: [
      'Reentry Support Services',
      'Care Management Support',
      'Help Getting ID / Documents',
      'Mental Health / Recovery Help',
    ],
  },
  {
    name: 'Housing & Stability',
    services: [
      'Eviction Help / Tenant Rights',
      'Emergency Financial Help',
      'Transportation Assistance',
    ],
  },
  {
    name: 'Basic Needs',
    services: ['Food Assistance', 'Clothing Assistance', 'General Community Help'],
  },
  {
    name: 'Intake / Routing',
    services: ['Not Sure — Need Guidance', 'Referred by Another Agency'],
  },
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
    honeypot: '',
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setValidationError('');

    if (selectedInterests.length === 0) {
      setValidationError('Please select at least one service');
      setIsSubmitting(false);
      return;
    }

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`;
      const emailResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone || undefined,
          interests: selectedInterests,
          message: formData.message || undefined,
          honeypot: formData.honeypot || undefined,
        }),
      });

      if (!emailResponse.ok) {
        let emailResult;
        try {
          emailResult = await emailResponse.json();
        } catch {
          emailResult = { error: 'Unknown error' };
        }

        if (emailResponse.status === 429) {
          setValidationError('Too many submissions. Please try again in a moment.');
          setSubmitStatus('error');
          setIsSubmitting(false);
          return;
        } else if (emailResponse.status === 400) {
          setValidationError(emailResult.error || 'Invalid submission');
          setSubmitStatus('error');
          setIsSubmitting(false);
          return;
        }
        console.error('Failed to send email notification:', emailResult);
      }

      setSubmitStatus('success');
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        message: '',
        honeypot: '',
      });
      setSelectedInterests([]);
      setExpandedCategories([]);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      if (error instanceof Error) {
        setValidationError(error.message);
      } else {
        setValidationError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const toggleService = (service: string) => {
    setSelectedInterests((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
    setValidationError('');
  };

  const toggleCategoryAll = (category: ServiceCategory) => {
    const allSelected = category.services.every((service) =>
      selectedInterests.includes(service)
    );

    if (allSelected) {
      setSelectedInterests((prev) =>
        prev.filter((service) => !category.services.includes(service))
      );
    } else {
      setSelectedInterests((prev) => {
        const newInterests = [...prev];
        category.services.forEach((service) => {
          if (!newInterests.includes(service)) {
            newInterests.push(service);
          }
        });
        return newInterests;
      });
    }
    setValidationError('');
  };

  const isCategoryFullySelected = (category: ServiceCategory) => {
    return category.services.every((service) => selectedInterests.includes(service));
  };

  const isCategoryPartiallySelected = (category: ServiceCategory) => {
    return (
      category.services.some((service) => selectedInterests.includes(service)) &&
      !isCategoryFullySelected(category)
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <img
          src="/ptw_logo.png"
          alt="Paving the Way Foundation"
          className="w-32 h-32 mx-auto mb-4"
        />
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-green-600 bg-clip-text text-transparent">
          Contact US
        </h2>
        <p className="text-gray-700 text-lg">
          We're here to help pave your way forward
        </p>
      </div>

      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 via-orange-50 to-green-50 border-2 border-orange-300 rounded-lg">
          <p className="text-orange-800 font-medium">
            Thank you for reaching out! We'll get back to you soon.
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">
            Something went wrong. Please try again or contact us directly.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              required
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors"
              placeholder="John"
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              required
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors"
              placeholder="Smith"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="john.smith@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            What Services Are You Looking For? *
          </label>

          {validationError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{validationError}</p>
            </div>
          )}

          <div className="space-y-3 border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-auto">
            {selectedInterests.length > 0 && (
              <div className="pb-3 mb-1 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Selected ({selectedInterests.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedInterests([]);
                      setValidationError('');
                    }}
                    className="text-xs text-gray-500 hover:text-red-600 font-medium underline underline-offset-2 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedInterests.map((service) => (
                    <span
                      key={service}
                      className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 text-xs font-medium rounded-full border border-orange-200"
                    >
                      {service}
                      <button
                        type="button"
                        onClick={() => toggleService(service)}
                        className="text-orange-500 hover:text-red-600 transition-colors flex items-center"
                        aria-label={`Remove ${service}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {SERVICE_CATEGORIES.map((category) => {
              const isExpanded = expandedCategories.includes(category.name);
              const isFullySelected = isCategoryFullySelected(category);
              const isPartiallySelected = isCategoryPartiallySelected(category);
              const availableServices = category.services.filter(
                (s) => !selectedInterests.includes(s)
              );

              return (
                <div key={category.name} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-3">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.name)}
                        className="flex items-center gap-2 flex-1 text-left"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="font-semibold text-gray-900">{category.name}</span>
                        {!isExpanded && isPartiallySelected && (
                          <span className="text-xs text-orange-600">
                            ({category.services.filter((s) => selectedInterests.includes(s)).length}/
                            {category.services.length})
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCategoryAll(category)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                          isFullySelected
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                            : isPartiallySelected
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {isFullySelected ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-3 space-y-2 bg-white">
                      {availableServices.length === 0 ? (
                        <p className="text-sm text-gray-400 italic p-2">
                          All services in this category have been selected
                        </p>
                      ) : (
                        availableServices.map((service) => (
                          <label
                            key={service}
                            className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={() => toggleService(service)}
                              className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-400"
                            />
                            <span className="text-sm text-gray-700">{service}</span>
                          </label>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
            placeholder="Tell us more about how we can help..."
          />
        </div>

        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute -left-[9999px] w-0 h-0 opacity-0"
        />

        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p>
            By submitting this form, you agree to our collection and use of your personal information as described in our privacy policy. We will only use your information to respond to your inquiry and provide the services you requested.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-600 hover:from-yellow-600 hover:via-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          {isSubmitting ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
