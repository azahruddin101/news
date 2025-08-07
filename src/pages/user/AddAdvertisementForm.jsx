
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  BadgePercent, Image as ImageIcon, IndianRupee, User, Phone, Mail,
  Globe, Building2, Home, MapPin, Landmark, CalendarRange, Timer,
  Tag, Folder, SortAsc, Flag
} from 'lucide-react';

const BASE_API_URL = import.meta.env.VITE_BASE_URL;
const BASE_IMAGE_URL = import.meta.env.VITE_IMG_URL;

// --- CATEGORIES & CURRENCIES ---
const categories = [
  'business', 'real_estate', 'automotive', 'electronics', 'fashion',
  'food_restaurant', 'healthcare', 'education', 'services', 'entertainment',
  'travel', 'sports', 'technology', 'jobs', 'matrimonial', 'other'
];
const currencies = ['INR', 'USD'];

// --- UTIL COMPONENTS ---
const Label = ({ children, htmlFor, hint, Icon }) => (
  <label
    htmlFor={htmlFor}
    className="block text-[15px] font-semibold text-gray-800 mb-1"
  >
    <span className="flex items-center gap-1.5">
      {Icon && <Icon size={17} className="text-red-600 inline" />}
      {children}
    </span>
    {hint && (
      <span className="block text-xs text-gray-500 font-normal mt-0.5">{hint}</span>
    )}
  </label>
);

const Input = ({ className = '', hasError = false, ...props }) => (
  <input
    {...props}
    className={`w-full px-4 py-3 border ${hasError ? 'border-red-400' : 'border-gray-300'} rounded-xl
      focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:outline-none
      bg-white text-gray-800 text-[15px] placeholder-gray-400 transition ${className}`}
  />
);

// Custom select component for consistent styling
const SelectInput = ({ id, name, value, onChange, hasError, children }) => (
  <select
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    className={`w-full px-4 py-3 border ${hasError ? 'border-red-400' : 'border-gray-300'} rounded-xl
      focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:outline-none
      bg-white text-gray-800 text-[15px] placeholder-gray-400 transition`}
  >
    {children}
  </select>
);

const TextArea = ({ className = '', hasError = false, ...props }) => (
  <textarea
    {...props}
    className={`w-full px-4 py-3 border ${hasError ? 'border-red-400' : 'border-gray-300'} rounded-xl
      focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:outline-none
      bg-white text-gray-800 text-[15px] placeholder-gray-400 transition ${className}`}
    rows={4}
  />
);

const ErrorMessage = ({ message }) => (
  message ? <div className="text-red-600 text-sm mt-1.5">{message}</div> : null
);

const Section = ({ title, children, Icon }) => (
  <section className="mb-8">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
      {Icon && <Icon size={22} className="text-red-600" />}
      {title}
    </h3>
    <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-5 shadow-sm">
      {children}
    </div>
  </section>
);

// --- MAIN FORM ---
const AddAdvertisementForm = ({
  advertisement = null,
  isEdit = false,
  onSuccess,
  onClose,
}) => {
  const emptyForm = {
    title: '', description: '', category: '', subcategory: '', media: null, priority: '',
    pricing: { paymentModel: '', budget: { total: '', daily: '', currency: '' }, },
    businessInfo: { businessName: '', businessType: '' },
    contactInfo: {
      name: '', phone: '', email: '', website: '',
      address: { street: '', gstNumber: '', city: '', state: '', pincode: '' },
    },
    targeting: { radius: '' },
    scheduling: { startDate: '', endDate: '', timezone: '' },
  };

  function createInitialForm(ad) {
    if (!ad) return emptyForm;
    return {
      ...emptyForm,
      ...ad,
      pricing: {
        ...emptyForm.pricing,
        ...ad.pricing,
        budget: { ...emptyForm.pricing.budget, ...(ad.pricing?.budget || {}) },
      },
      businessInfo: { ...emptyForm.businessInfo, ...(ad.businessInfo || {}) },
      contactInfo: {
        ...emptyForm.contactInfo,
        ...(ad.contactInfo || {}),
        address: { ...emptyForm.contactInfo.address, ...(ad.contactInfo?.address || {}) },
      },
      targeting: { ...emptyForm.targeting, ...(ad.targeting || {}) },
      scheduling: { ...emptyForm.scheduling, ...(ad.scheduling || {}) },
      media: null, // always reset file input for edit
    };
  }

  const [formData, setFormData] = useState(createInitialForm(advertisement));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // When we get a new ad for edit, re-populate form
  useEffect(() => {
    setFormData(createInitialForm(advertisement));
  }, [advertisement]);

  // Validation Functions
  const validatePhone = (phone) => /^\d{10}$/.test(phone);
  const validateGST = (gst) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{3}$/.test(gst);
  const validateDates = (start, end) => {
    if (!start || !end) return true;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (startDate < today || endDate < today) return false;
    return endDate > startDate;
  };

  // On any field change, re-validate affected fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    const updatedData = { ...formData };
    let nested = updatedData;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!nested[keys[i]]) nested[keys[i]] = {};
      nested = nested[keys[i]];
    }
    nested[keys[keys.length - 1]] = value;
    setFormData(updatedData);

    // Sync validation
    const newErrors = { ...errors };
    const field = name.split('.').pop();

    // Phone validation
    if (name === 'contactInfo.phone') {
      if (!validatePhone(value)) {
        newErrors['contactInfo.phone'] = 'Phone must be 10 digits (numbers only)';
      } else {
        delete newErrors['contactInfo.phone'];
      }
    }

    // GST validation
    if (name === 'contactInfo.address.gstNumber') {
      if (!validateGST(value)) {
        newErrors['contactInfo.address.gstNumber'] = 'GSTIN must be in the format 22AAAAA0000A1Z5';
      } else {
        delete newErrors['contactInfo.address.gstNumber'];
      }
    }

    // Date validation
    if (name === 'scheduling.startDate' || name === 'scheduling.endDate') {
      if (!validateDates(formData.scheduling.startDate, formData.scheduling.endDate)) {
        newErrors['scheduling.dates'] = 'End date must be after start date and both must be in the future';
      } else {
        delete newErrors['scheduling.dates'];
      }
    }

    setErrors(newErrors);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    setFormData({ ...formData, media: file });
  };

  // On submit, block if validation fails
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation (in case user clicks submit without changing fields)
    let newErrors = { ...errors };
    if (!validatePhone(formData.contactInfo.phone)) {
      newErrors['contactInfo.phone'] = 'Phone must be 10 digits (numbers only)';
    }
    if (!validateGST(formData.contactInfo.address.gstNumber)) {
      newErrors['contactInfo.address.gstNumber'] = 'GSTIN must be in the format 22AAAAA0000A1Z5';
    }
    if (!validateDates(formData.scheduling.startDate, formData.scheduling.endDate)) {
      newErrors['scheduling.dates'] = 'End date must be after start date and both must be in the future';
    }
    setErrors(newErrors);

    // Block submission if errors exist
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the highlighted errors before submitting.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token not found');
      return;
    }
    setIsSubmitting(true);

    const form = new FormData();
    // Always append required fields, nested dot syntax for server
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('category', formData.category);
    form.append('subcategory', formData.subcategory);
    form.append('priority', formData.priority);

    // Only include media if it is set (for edit: only if user changes image)
    if (formData.media instanceof File) {
      form.append('media', formData.media);
    }

    // Nested fields
    form.append('pricing.paymentModel', formData.pricing.paymentModel);
    form.append('pricing.budget.total', formData.pricing.budget.total);
    form.append('pricing.budget.daily', formData.pricing.budget.daily);
    form.append('pricing.budget.currency', formData.pricing.budget.currency);

    form.append('businessInfo.businessName', formData.businessInfo.businessName);
    form.append('businessInfo.businessType', formData.businessInfo.businessType);

    form.append('contactInfo.name', formData.contactInfo.name);
    form.append('contactInfo.phone', formData.contactInfo.phone);
    form.append('contactInfo.email', formData.contactInfo.email);
    form.append('contactInfo.website', formData.contactInfo.website);

    form.append('contactInfo.address.street', formData.contactInfo.address.street);
    form.append('contactInfo.address.city', formData.contactInfo.address.city);
    form.append('contactInfo.address.district', formData.contactInfo.address.district || "Lucknow");
    form.append('contactInfo.address.state', formData.contactInfo.address.state);
    form.append('contactInfo.address.pincode', formData.contactInfo.address.pincode);
    form.append('contactInfo.address.gstNumber', formData.contactInfo.address.gstNumber);

    form.append('targeting.radius', formData.targeting.radius);
    form.append('scheduling.startDate', formData.scheduling.startDate);
    form.append('scheduling.endDate', formData.scheduling.endDate);
    form.append('scheduling.timezone', formData.scheduling.timezone);

    try {
      let response;
      if (isEdit && advertisement && advertisement.id) {
        // Update (PUT)
        response = await axios.put(
          `${BASE_API_URL}advertisements/${advertisement.id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        // Create (POST)
        response = await axios.post(
          `${BASE_API_URL}advertisements`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }
      toast.success((response.data && response.data.message) || 'Advertisement saved successfully go to My Ads to submit!');
      onSuccess && onSuccess();
      if (!isEdit) setFormData(createInitialForm(null));
      if (onClose) onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Submission failed!'
      );
    }
    setIsSubmitting(false);
  };

  // Show current image in edit mode if exists and not replaced
  const adImgUrl =
    isEdit &&
      advertisement?.primaryImage?.url &&
      !formData.media
      ? `${BASE_IMAGE_URL}${advertisement.primaryImage.url}`
      : null;

  // --- JSX ---
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-6xl mx-auto px-7 py-9 bg-white border border-gray-100 rounded-3xl shadow-md space-y-9 mt-10"
      autoComplete="off"
    >
      <h2 className="text-2xl font-extrabold text-red-700 mb-5 flex gap-2 items-center">
        <BadgePercent size={24} className="text-red-600" />
        {isEdit ? 'Edit Advertisement' : 'Add New Advertisement'}
      </h2>

      {/* General Info */}
      <Section title="General Details" Icon={Folder}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="title" hint="Short, catchy name for your ad" Icon={Tag}>
              Advertisement Title <span className="text-red-600">*</span>
            </Label>
            <Input
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              autoFocus
              maxLength={60}
              placeholder="Monsoon Mega Sale – Up to 70% Off!"
              required
            />
          </div>
          <div>
            <Label htmlFor="category" hint="Main product/service type" Icon={Folder}>
              Category <span className="text-red-600">*</span>
            </Label>
            <SelectInput
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              hasError={false}
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </SelectInput>
          </div>
          <div>
            <Label htmlFor="subcategory" hint="Sub-type of category" Icon={Folder}>
              Subcategory <span className="text-red-600">*</span>
            </Label>
            <Input
              name="subcategory"
              id="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              placeholder="Smartphones"
              required
            />
          </div>
          <div>
            <Label htmlFor="priority" hint="1 (low) – 10 (high)" Icon={SortAsc}>
              Priority
            </Label>
            <Input
              name="priority"
              id="priority"
              value={formData.priority}
              onChange={handleChange}
              type="number"
              min={1}
              max={10}
              placeholder="7"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description" hint="What makes this ad appealing?" Icon={BadgePercent}>
            Ad Description <span className="text-red-600">*</span>
          </Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Discover exclusive rainy season deals on top smartphones. Best prices, fast delivery. Limited period offer!"
            required
          />
        </div>
      </Section>

      {/* Media */}
      <Section title="Media & Banner" Icon={ImageIcon}>
        <Label htmlFor="media" hint="Upload a 16:9 ratio image. JPG/PNG preferred." Icon={ImageIcon}>
          Advertisement Image {isEdit ? null : <span className="text-red-600">*</span>}
        </Label>
        {/* Preview current (edit) OR uploaded image */}
        {adImgUrl && (
          <div className="mb-4">
            <img src={adImgUrl} alt="Current" className="h-32 object-cover rounded-xl border border-gray-200 max-w-lg" />
            <div className="text-xs text-gray-500 mt-1">Current Image</div>
          </div>
        )}
        {formData.media && (
          <img
            src={URL.createObjectURL(formData.media)}
            alt="Preview"
            className="mt-3 rounded-xl border border-gray-200 w-1/2 object-cover"
          />
        )}
        <input
          id="media"
          name="media"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm file:mr-3 file:py-2.5 file:px-4 file:border file:border-gray-300 file:rounded-lg file:bg-gray-50 file:text-gray-700 file:font-medium"
          required={!isEdit}
        />
        <div className="text-xs text-gray-500 mt-1.5">
          Allowed: JPG, PNG. Optimal: 16:9. Min. size: 600x338px.
        </div>
      </Section>

      {/* Budget Pricing */}
      <Section title="Budget & Pricing" Icon={IndianRupee}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <Label htmlFor="pricing.budget.total" hint="Entire campaign value" Icon={IndianRupee}>
              Total Budget <span className="text-red-600">*</span>
            </Label>
            <Input
              type="number"
              name="pricing.budget.total"
              id="pricing.budget.total"
              value={formData.pricing.budget.total}
              onChange={handleChange}
              placeholder="10,000"
              min={0}
              required
            />
          </div>
          <div>
            <Label htmlFor="pricing.budget.daily" hint="Spend per day" Icon={IndianRupee}>
              Daily Budget <span className="text-red-600">*</span>
            </Label>
            <Input
              type="number"
              name="pricing.budget.daily"
              id="pricing.budget.daily"
              value={formData.pricing.budget.daily}
              onChange={handleChange}
              placeholder="500"
              min={0}
              required
            />
          </div>
          <div>
            <Label htmlFor="pricing.budget.currency" hint="Select currency" Icon={IndianRupee}>
              Currency <span className="text-red-600">*</span>
            </Label>
            <SelectInput
              id="pricing.budget.currency"
              name="pricing.budget.currency"
              value={formData.pricing.budget.currency}
              onChange={handleChange}
              hasError={false}
            >
              <option value="" disabled>Select currency</option>
              {currencies.map((curr) => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </SelectInput>
          </div>
          <div className="mt-4">
  <Label htmlFor="targeting.radius" hint="How far from the target location (in kilometers)" Icon={MapPin}>
    Targeting Radius (km) <span className="text-red-600">*</span>
  </Label>
  <Input
    type="number"
    name="targeting.radius"
    id="targeting.radius"
    value={formData.targeting.radius}
    onChange={handleChange}
    placeholder="50"
    min={1}
    max={500}
    required
  />
</div>
        </div>
      </Section>

      {/* Business/Contact */}
      <Section title="Business Details & Contact Info" Icon={Building2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="contactInfo.name" hint="Contact person" Icon={User}>
              Contact Name <span className="text-red-600">*</span>
            </Label>
            <Input
              name="contactInfo.name"
              id="contactInfo.name"
              value={formData.contactInfo.name}
              onChange={handleChange}
              placeholder="Ankit Sharma"
              required
            />
          </div>
          <div>
            <Label htmlFor="contactInfo.phone" hint="Mobile or landline" Icon={Phone}>
              Contact Phone <span className="text-red-600">*</span>
            </Label>
            <Input
              name="contactInfo.phone"
              id="contactInfo.phone"
              value={formData.contactInfo.phone}
              onChange={handleChange}
              placeholder="9876543210"
              required
              hasError={!!errors['contactInfo.phone']}
            />
            <ErrorMessage message={errors['contactInfo.phone']} />
          </div>
          <div>
            <Label htmlFor="contactInfo.email" hint="Official email" Icon={Mail}>
              Email Address <span className="text-red-600">*</span>
            </Label>
            <Input
              name="contactInfo.email"
              id="contactInfo.email"
              type="email"
              value={formData.contactInfo.email}
              onChange={handleChange}
              placeholder="business@brand.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="contactInfo.website" hint="(Optional)" Icon={Globe}>
              Company Website
            </Label>
            <Input
              name="contactInfo.website"
              id="contactInfo.website"
              value={formData.contactInfo.website}
              onChange={handleChange}
              placeholder="https://brand.com"
            />
          </div>
          <div>
  <Label htmlFor="businessInfo.businessName" hint="(Optional)" Icon={Building2}>
    Business/Company Name
  </Label>
  <Input
    name="businessInfo.businessName"
    id="businessInfo.businessName"
    value={formData.businessInfo.businessName}
    onChange={handleChange}
    placeholder="Your Business Ltd."
  />
</div>
<div className="mt-2">
  <Label htmlFor="businessInfo.businessType" Icon={Building2}>
    Business Type
  </Label>
  <SelectInput
    id="businessInfo.businessType"
    name="businessInfo.businessType"
    value={formData.businessInfo.businessType}
    onChange={handleChange}
    hasError={false}
  >
    <option value="" disabled>Select business type</option>
    <option key="individual" value="individual">Individual</option>
    <option key="small_business" value="small_business">Small Business</option>
    <option key="corporation" value="corporation">Corporation</option>
    <option key="ngo" value="ngo">NGO</option>
    <option key="government" value="government">Government</option>
    <option key="other" value="other">Other</option>
  </SelectInput>
</div>
        </div>
        {/* Address */}
        <div className="flex flex-col gap-4 pt-2">
          <div className='flex gap-4'>
            <div className='w-[49%]'>
              <Label htmlFor="contactInfo.address.street" Icon={Home}>
                Street Address <span className="text-red-600">*</span>
              </Label>
              <Input
                name="contactInfo.address.street"
                id="contactInfo.address.street"
                value={formData.contactInfo.address.street}
                onChange={handleChange}
                placeholder="Shop #3, Main Road"
                required
              />
            </div>
            <div className='w-[49%]'>
              <Label htmlFor="contactInfo.address.gstNumber" Icon={MapPin}>
                GST Number <span className="text-red-600">*</span>
              </Label>
              <Input
                name="contactInfo.address.gstNumber"
                id="contactInfo.address.gstNumber"
                value={formData.contactInfo.address.gstNumber}
                onChange={handleChange}
                placeholder="27AAECS1234F1Z5"
                required
                hasError={!!errors['contactInfo.address.gstNumber']}
              />
              <ErrorMessage message={errors['contactInfo.address.gstNumber']} />
            </div>
          </div>
          <div className='flex gap-4'>
            <div className='w-[49%]'>
              <Label htmlFor="contactInfo.address.city" Icon={Landmark}>
                city <span className="text-red-600">*</span>
              </Label>
              <Input
                name="contactInfo.address.city"
                id="contactInfo.address.city"
                value={formData.contactInfo.address.city}
                onChange={handleChange}
                placeholder="Pune"
                required
              />
            </div>
            <div className='w-[49%]'>
              <Label htmlFor="contactInfo.address.state" Icon={Flag}>
                State <span className="text-red-600">*</span>
              </Label>
              <Input
                name="contactInfo.address.state"
                id="contactInfo.address.state"
                value={formData.contactInfo.address.state}
                onChange={handleChange}
                placeholder="Maharashtra"
                required
              />
            </div>
          </div>
          <div className='w-full'>
            <Label htmlFor="contactInfo.address.pincode" Icon={MapPin}>
              Pincode <span className="text-red-600">*</span>
            </Label>
            <Input
              name="contactInfo.address.pincode"
              id="contactInfo.address.pincode"
              value={formData.contactInfo.address.pincode}
              onChange={handleChange}
              placeholder="411001"
              required
            />
          </div>
        </div>
      </Section>

      {/* Scheduling */}
      <Section title="Scheduling & Timings" Icon={CalendarRange}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <Label htmlFor="scheduling.startDate" hint="When does the ad start?" Icon={CalendarRange}>
              Start Date <span className="text-red-600">*</span>
            </Label>
            <Input
              name="scheduling.startDate"
              id="scheduling.startDate"
              value={formData.scheduling.startDate}
              onChange={handleChange}
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              hasError={!!errors['scheduling.dates']}
            />
          </div>
          <div>
            <Label htmlFor="scheduling.endDate" hint="When does the ad end?" Icon={CalendarRange}>
              End Date <span className="text-red-600">*</span>
            </Label>
            <Input
              name="scheduling.endDate"
              id="scheduling.endDate"
              value={formData.scheduling.endDate}
              onChange={handleChange}
              type="date"
              required
              min={formData.scheduling.startDate || new Date().toISOString().split('T')[0]}
              hasError={!!errors['scheduling.dates']}
            />
          </div>
          <div>
            <Label htmlFor="scheduling.timezone" hint="Asia/Kolkata" Icon={Timer}>
              Timezone <span className="text-red-600">*</span>
            </Label>
            <Input
              name="scheduling.timezone"
              id="scheduling.timezone"
              value={formData.scheduling.timezone}
              onChange={handleChange}
              placeholder="Asia/Kolkata"
              required
            />
          </div>
        </div>
        <ErrorMessage message={errors['scheduling.dates']} />
      </Section>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting || Object.keys(errors).length > 0}
          className="px-7 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed
                   text-white rounded-xl text-base font-semibold transition shadow min-w-[180px]"
        >
          {isSubmitting
            ? (isEdit ? 'Saving...' : 'Submitting...')
            : (isEdit ? 'Save Changes' : 'Draft Advertisement')}
        </button>
      </div>
    </form>
  );
};

export default AddAdvertisementForm;
