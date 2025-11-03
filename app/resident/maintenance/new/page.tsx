'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wrench,
  Save,
  AlertCircle,
  Upload,
  X,
  User,
  Mail,
  Phone,
  Home,
} from 'lucide-react';
import { PageLayout, ResidentHeader, PageHeader } from '@/components/resident';
import { useData } from '@/contexts/DataContext';
import { 
  type MaintenancePriority,
  type MaintenanceCategory 
} from '@/lib/types';

export default function NewMaintenanceTicket() {
  const router = useRouter();
  const { createTicket, residentData, isLoading } = useData();
  const [isSaving, setIsSaving] = useState(false);
  
  // Resident contact info (autopopulated from context)
  const [residentInfo] = useState({
    name: residentData?.name || '',
    email: residentData?.email || '',
    phone: residentData?.phone || '',
    unit: residentData?.unit || '',
  });
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Plumbing' as MaintenanceCategory,
    priority: 'Medium' as MaintenancePriority,
    description: '',
    location: residentData?.unit || '',
    photos: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    if (formData.description.length < 20) {
      alert('Description must be at least 20 characters');
      return;
    }

    setIsSaving(true);
    
    try {
      // Create the ticket using context (browser memory)
      const newTicket = createTicket({
        title: formData.title,
        category: formData.category,
        priority: formData.priority,
        description: formData.description,
        location: formData.location,
        photos: formData.photos,
      });
      
      // Show success message
      alert(`Ticket created successfully!\n\nTicket ID: ${newTicket.id}\nStatus: ${newTicket.status}`);
      
      // Navigate back to maintenance list (data already updated in context)
      router.push('/resident/maintenance');
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Error creating ticket. Please try again.');
      setIsSaving(false);
    }
  };

  const updateFormData = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <PageLayout>
        <ResidentHeader currentPage="New Maintenance Ticket" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <ResidentHeader currentPage="New Maintenance Ticket" />
      
      <PageHeader 
        title="New Maintenance Ticket" 
        subtitle="Report a maintenance issue"
        icon={Wrench}
        color="blue"
        showBackButton
        backUrl="/resident/maintenance"
      />

      {/* Form Content */}
      <div className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 pb-12">
        <div className="bg-gray-800 rounded-xl border-2 border-gray-700 p-6 sm:p-8 md:p-12 shadow-xl">
            
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Contact Information Section (Read-Only) */}
              <div className="bg-gray-900 border-2 border-blue-500 rounded-2xl p-8 shadow-xl">
                <h3 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl mb-8 flex items-center gap-4">
                  <User className="w-10 h-10 text-blue-400" />
                  Your Contact Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  
                  {/* Name */}
                  <div>
                    <label className="block text-blue-400 font-bold mb-4 text-xl sm:text-2xl flex items-center gap-3">
                      <User className="w-7 h-7" />
                      Full Name
                    </label>
                    <div className="px-8 py-6 bg-gray-800 text-white rounded-xl border-2 border-gray-600 text-xl sm:text-2xl md:text-3xl font-medium">
                      {residentInfo.name || 'Loading...'}
                    </div>
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block text-teal-400 font-bold mb-4 text-xl sm:text-2xl flex items-center gap-3">
                      <Home className="w-7 h-7" />
                      Unit Number
                    </label>
                    <div className="px-8 py-6 bg-gray-800/80 text-white rounded-xl border-2 border-gray-600 text-xl sm:text-2xl md:text-3xl font-medium">
                      {residentInfo.unit || 'Loading...'}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-teal-400 font-bold mb-4 text-xl sm:text-2xl flex items-center gap-3">
                      <Mail className="w-7 h-7" />
                      Email Address
                    </label>
                    <div className="px-8 py-6 bg-gray-800/80 text-white rounded-xl border-2 border-gray-600 text-xl sm:text-2xl md:text-3xl font-medium break-all">
                      {residentInfo.email || 'Loading...'}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-teal-400 font-bold mb-4 text-xl sm:text-2xl flex items-center gap-3">
                      <Phone className="w-7 h-7" />
                      Phone Number
                    </label>
                    <div className="px-8 py-6 bg-gray-800/80 text-white rounded-xl border-2 border-gray-600 text-xl sm:text-2xl md:text-3xl font-medium">
                      {residentInfo.phone || 'Loading...'}
                    </div>
                  </div>

                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-white font-bold mb-4 text-xl sm:text-2xl md:text-3xl">
                  Issue Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="e.g., Kitchen sink is leaking"
                  className="w-full px-6 py-6 bg-gray-900 text-white rounded-xl border-2 border-gray-600 focus:border-blue-500 focus:outline-none text-xl sm:text-2xl md:text-3xl placeholder:text-gray-500"
                  required
                />
              </div>

              {/* Category and Priority Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Category */}
                <div>
                  <label className="block text-white font-bold mb-4 text-xl sm:text-2xl md:text-3xl">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateFormData('category', e.target.value as MaintenanceCategory)}
                    className="w-full px-6 py-6 bg-gray-900 text-white rounded-xl border-2 border-gray-600 focus:border-blue-500 focus:outline-none text-xl sm:text-2xl md:text-3xl"
                    required
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Appliances">Appliances</option>
                    <option value="Structural">Structural</option>
                    <option value="Doors/Windows">Doors/Windows</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-white font-bold mb-4 text-xl sm:text-2xl md:text-3xl">
                    Priority <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => updateFormData('priority', e.target.value as MaintenancePriority)}
                    className="w-full px-6 py-6 bg-gray-900 text-white rounded-xl border-2 border-gray-600 focus:border-teal-500 focus:outline-none text-xl sm:text-2xl md:text-3xl"
                    required
                  >
                    <option value="Low">Low - Can wait</option>
                    <option value="Medium">Medium - Normal</option>
                    <option value="High">High - Soon as possible</option>
                    <option value="Emergency">Emergency - Immediate</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-white font-bold mb-4 text-xl sm:text-2xl md:text-3xl">
                  Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  placeholder="e.g., Kitchen, Master Bathroom"
                  className="w-full px-6 py-6 bg-gray-900 text-white rounded-xl border-2 border-gray-600 focus:border-teal-500 focus:outline-none text-xl sm:text-2xl md:text-3xl placeholder:text-gray-500"
                  required
                />
                <p className="text-gray-400 text-base sm:text-lg mt-2">
                  Defaults to your unit. Specify room or area if needed (e.g., "Unit 111 - Kitchen")
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-bold mb-4 text-xl sm:text-2xl md:text-3xl">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Please provide detailed information about the issue..."
                  rows={6}
                  className="w-full px-6 py-6 bg-gray-900 text-white rounded-xl border-2 border-gray-600 focus:border-teal-500 focus:outline-none text-xl sm:text-2xl md:text-3xl placeholder:text-gray-500 resize-none"
                  required
                />
                <p className="text-gray-400 text-base sm:text-lg md:text-xl mt-3">
                  Minimum 20 characters (Current: {formData.description.length})
                </p>
              </div>

              {/* Photo Upload (Placeholder) */}
              <div>
                <label className="block text-white font-bold mb-4 text-xl sm:text-2xl md:text-3xl">
                  Photos (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center hover:border-blue-500 transition-all cursor-pointer">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 text-lg sm:text-xl md:text-2xl mb-2">
                    Click to upload photos
                  </p>
                  <p className="text-gray-500 text-base sm:text-lg md:text-xl">
                    PNG, JPG up to 10MB each
                  </p>
                </div>
              </div>

              {/* Info Alert */}
              <div className="bg-blue-600/20 border-l-4 border-blue-500 rounded-xl p-8">
                <div className="flex items-start gap-6">
                  <AlertCircle className="w-12 h-12 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-blue-300 font-bold text-xl sm:text-2xl md:text-3xl mb-3">Response Times</h3>
                    <p className="text-blue-100 text-lg sm:text-xl md:text-2xl leading-relaxed">
                      • Emergency: Within 2 hours<br />
                      • High Priority: Within 24 hours<br />
                      • Medium/Low: Within 3-5 business days
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.push('/resident/maintenance')}
                  className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-6 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-all text-xl sm:text-2xl md:text-3xl"
                >
                  <X className="w-8 h-8" />
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-500 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl sm:text-2xl md:text-3xl"
                >
                  <Save className="w-8 h-8" />
                  {isSaving ? 'Creating...' : 'Create Ticket'}
                </button>
              </div>

            </form>
        </div>
      </div>
    </PageLayout>
  );
}
