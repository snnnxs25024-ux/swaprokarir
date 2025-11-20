
import React, { useState, useEffect } from 'react';
import { Briefcase, DollarSign, MapPin, PlusCircle, Building, Users, Clock, Star, Save, Edit3, GraduationCap, CheckSquare } from 'lucide-react';
import { Job, JobType } from '../types';

interface PostJobProps {
  onPostJob: (job: Job) => void;
  companyName: string;
  initialData?: Job | null; // Optional prop for Editing
}

const PostJob: React.FC<PostJobProps> = ({ onPostJob, companyName, initialData }) => {
  // Initial State for Advanced Form
  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    location: '',
    salaryRange: '',
    type: JobType.FULL_TIME,
    description: '',
    requirements: [],
    category: 'IT & Software',
    minExperience: 'Fresh Graduate',
    ageMin: 18,
    ageMax: 35,
    gender: 'Bebas',
    domicile: '',
    educationLevel: 'S1',
    major: '',
    minGpa: 0,
    workArrangement: 'WFO',
    workingHours: 'Normal (9-5)',
    benefits: [],
    quota: 1,
    deadline: ''
  });

  const [experienceMode, setExperienceMode] = useState<'fresh' | 'experienced'>('fresh');
  const [expYears, setExpYears] = useState<number>(1);
  const [reqInput, setReqInput] = useState('');

  // Effect to populate form when Editing
  useEffect(() => {
      if (initialData) {
          setFormData({ ...initialData });
          setReqInput(initialData.requirements.join(', '));
          
          // Determine Experience Mode based on string content
          if (initialData.minExperience?.toLowerCase().includes('fresh') || initialData.minExperience?.includes('kurang')) {
              setExperienceMode('fresh');
          } else {
              setExperienceMode('experienced');
              const match = initialData.minExperience?.match(/\d+/);
              if (match) setExpYears(parseInt(match[0]));
          }
      }
  }, [initialData]);

  const availableBenefits = [
      "BPJS Ketenagakerjaan & Kesehatan",
      "Uang Makan",
      "Uang Transport",
      "Bonus Tahunan",
      "THR",
      "Laptop / Device Kantor",
      "Asuransi Kesehatan Swasta",
      "Parkir Gratis",
      "Gym Membership",
      "Cuti Berbayar Extra",
      "Waktu Kerja Fleksibel"
  ];

  const handleBenefitToggle = (benefit: string) => {
      setFormData(prev => {
          const currentBenefits = prev.benefits || [];
          if (currentBenefits.includes(benefit)) {
              return { ...prev, benefits: currentBenefits.filter(b => b !== benefit) };
          } else {
              return { ...prev, benefits: [...currentBenefits, benefit] };
          }
      });
  };

  const handleSaveDraft = () => {
      // Logic simpan draft (dummy)
      alert(`Draft "${formData.title || 'Lowongan Tanpa Judul'}" berhasil disimpan! Anda bisa melanjutkannya nanti.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalRequirements = reqInput 
        ? reqInput.split(',').map(r => r.trim()).filter(r => r !== '') 
        : (formData.requirements || []);

    const finalExperienceString = experienceMode === 'fresh' 
        ? 'Fresh Graduate / Kurang dari 1 Tahun' 
        : `Minimal ${expYears} Tahun Pengalaman`;

    const newJob: Job = {
      id: initialData ? initialData.id : Math.random().toString(36).substr(2, 9), // Keep ID if editing
      title: formData.title!,
      company: companyName,
      location: formData.location!,
      type: formData.type!,
      salaryRange: formData.salaryRange!,
      description: formData.description!,
      requirements: finalRequirements,
      postedAt: initialData ? initialData.postedAt : 'Baru saja', // Keep posted date if editing
      logoUrl: initialData ? initialData.logoUrl : `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=random`,
      
      category: formData.category,
      minExperience: finalExperienceString,
      ageMin: Number(formData.ageMin),
      ageMax: Number(formData.ageMax),
      gender: formData.gender as any,
      domicile: formData.domicile,
      educationLevel: formData.educationLevel as any,
      major: formData.major,
      minGpa: Number(formData.minGpa),
      workArrangement: formData.workArrangement as any,
      workingHours: formData.workingHours as any,
      benefits: formData.benefits,
      quota: Number(formData.quota),
      deadline: formData.deadline
    };

    onPostJob(newJob);
    alert(initialData ? 'Perubahan lowongan berhasil disimpan!' : 'Lowongan berhasil diterbitkan! Iklan Anda kini aktif.');
    
    if (!initialData) {
        setFormData({
            title: '', location: '', salaryRange: '', description: '', requirements: [], category: 'IT & Software'
        });
        setReqInput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                {initialData ? <Edit3 className="w-8 h-8" /> : <PlusCircle className="w-8 h-8" />}
                {initialData ? 'Edit Iklan Lowongan' : 'Buat Iklan Lowongan Baru'}
            </h2>
            <p className="text-indigo-100 text-sm mt-2 ml-11 opacity-90">
                {initialData ? 'Perbarui informasi lowongan Anda.' : 'Lengkapi detail di bawah ini untuk mendapatkan kandidat yang paling sesuai.'}
            </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-10">
            
            {/* SECTION 1: DETAIL PEKERJAAN */}
            <section>
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    Detail Pekerjaan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Posisi <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 border"
                            placeholder="Contoh: Senior Frontend Engineer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Pekerjaan</label>
                        <select
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 border bg-white"
                        >
                            <option>IT & Software</option>
                            <option>Marketing & Sales</option>
                            <option>Finance & Accounting</option>
                            <option>HR & General Affair</option>
                            <option>Design & Creative</option>
                            <option>Operations</option>
                            <option>Lainnya</option>
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Kontrak</label>
                         <select
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value as JobType})}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 border bg-white"
                        >
                            {Object.values(JobType).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sistem Kerja</label>
                         <select
                            value={formData.workArrangement}
                            onChange={e => setFormData({...formData, workArrangement: e.target.value as any})}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 border bg-white"
                        >
                            <option value="WFO">WFO (Work From Office)</option>
                            <option value="WFH">WFH (Work From Home)</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jam Kerja</label>
                         <select
                            value={formData.workingHours}
                            onChange={e => setFormData({...formData, workingHours: e.target.value as any})}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 border bg-white"
                        >
                            <option value="Normal (9-5)">Normal (09:00 - 17:00)</option>
                            <option value="Shift">Shift</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* SECTION 2: KUALIFIKASI KANDIDAT */}
            <section>
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Kualifikasi Kandidat
                </h3>
                
                {/* EXPERIENCE MODE TOGGLE */}
                <div className="bg-gray-50 p-5 rounded-xl border border-indigo-100 mb-6">
                    <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4 text-orange-500" />
                        Tingkat Pengalaman yang Dibutuhkan
                    </label>
                    <div className="flex flex-col md:flex-row gap-4">
                        <label className={`flex-1 flex items-center p-4 border rounded-xl cursor-pointer transition-all ${experienceMode === 'fresh' ? 'bg-white border-indigo-600 ring-2 ring-indigo-100' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                            <input 
                                type="radio" 
                                name="expMode" 
                                className="w-5 h-5 text-indigo-600"
                                checked={experienceMode === 'fresh'}
                                onChange={() => setExperienceMode('fresh')}
                            />
                            <div className="ml-3">
                                <span className="block font-bold text-gray-900">Fresh Graduate / Entry Level</span>
                                <span className="block text-xs text-gray-500 mt-1">Cocok untuk lulusan baru, magang, atau pengalaman &lt; 1 tahun.</span>
                            </div>
                        </label>

                        <label className={`flex-1 flex items-center p-4 border rounded-xl cursor-pointer transition-all ${experienceMode === 'experienced' ? 'bg-white border-indigo-600 ring-2 ring-indigo-100' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                            <input 
                                type="radio" 
                                name="expMode" 
                                className="w-5 h-5 text-indigo-600"
                                checked={experienceMode === 'experienced'}
                                onChange={() => setExperienceMode('experienced')}
                            />
                            <div className="ml-3">
                                <span className="block font-bold text-gray-900">Berpengalaman (Pro)</span>
                                <span className="block text-xs text-gray-500 mt-1">Membutuhkan keahlian spesifik dan jam terbang.</span>
                            </div>
                        </label>
                    </div>

                    {experienceMode === 'experienced' && (
                        <div className="mt-4 animate-fade-in">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Minimal Lama Pengalaman (Tahun)</label>
                            <div className="flex items-center">
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="20"
                                    value={expYears}
                                    onChange={(e) => setExpYears(parseInt(e.target.value))}
                                    className="w-24 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2 border text-center font-bold"
                                />
                                <span className="ml-3 text-gray-600 font-medium">Tahun di bidang terkait</span>
                            </div>
                        </div>
                    )}
                     {experienceMode === 'fresh' && (
                        <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-start animate-fade-in">
                            <GraduationCap className="w-5 h-5 mr-2 flex-shrink-0" />
                            Lowongan ini akan ditandai sebagai "Ramah Pemula". Pelamar Fresh Graduate akan diprioritaskan.
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* ... (Rest of the inputs remain same, just showing structure for brevity) ... */}
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                         <select
                            value={formData.gender}
                            onChange={e => setFormData({...formData, gender: e.target.value as any})}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 border bg-white"
                        >
                            <option value="Bebas">Laki-laki / Perempuan (Bebas)</option>
                            <option value="Laki-laki">Khusus Laki-laki</option>
                            <option value="Perempuan">Khusus Perempuan</option>
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Usia Minimal (Thn)</label>
                         <input
                            type="number"
                            value={formData.ageMin}
                            onChange={e => setFormData({...formData, ageMin: parseInt(e.target.value)})}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 border"
                        />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Usia Maksimal (Thn)</label>
                         <input
                            type="number"
                            value={formData.ageMax}
                            onChange={e => setFormData({...formData, ageMax: parseInt(e.target.value)})}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 border"
                        />
                    </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Pendidikan Min.</label>
                         <select
                            value={formData.educationLevel}
                            onChange={e => setFormData({...formData, educationLevel: e.target.value as any})}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 border bg-white"
                        >
                            <option value="SMA/SMK">SMA / SMK</option>
                            <option value="D3">D3 (Diploma)</option>
                            <option value="S1">S1 (Sarjana)</option>
                            <option value="S2">S2 (Magister)</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan (Opsional)</label>
                         <input
                            type="text"
                            value={formData.major}
                            onChange={e => setFormData({...formData, major: e.target.value})}
                            placeholder="Semua Jurusan"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 border"
                        />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">IPK Minimal</label>
                         <input
                            type="number"
                            step="0.01"
                            value={formData.minGpa}
                            onChange={e => setFormData({...formData, minGpa: parseFloat(e.target.value)})}
                            placeholder="3.00"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 border"
                        />
                    </div>
                    <div className="md:col-span-2">
                         <label className="block text-sm font-medium text-gray-700 mb-1">Wajib Domisili Di</label>
                         <div className="relative">
                             <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                             <input
                                type="text"
                                value={formData.domicile}
                                onChange={e => setFormData({...formData, domicile: e.target.value})}
                                placeholder="Kosongkan jika boleh dari luar kota"
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 pl-10 border"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: OFFERING & BENEFIT */}
            <section>
                 <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-indigo-600" />
                    Penawaran & Benefit
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Range Gaji <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={formData.salaryRange}
                            onChange={e => setFormData({...formData, salaryRange: e.target.value})}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 border"
                            placeholder="Contoh: Rp 5.000.000 - Rp 8.000.000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Kantor <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 border"
                            placeholder="Contoh: Jakarta Selatan"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Fasilitas & Tunjangan (Pilih yang tersedia)</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableBenefits.map((benefit, idx) => (
                            <label key={idx} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                formData.benefits?.includes(benefit) 
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                            }`}>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                                    formData.benefits?.includes(benefit) ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-400'
                                }`}>
                                    {formData.benefits?.includes(benefit) && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <span className="text-sm font-medium select-none">{benefit}</span>
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={formData.benefits?.includes(benefit)}
                                    onChange={() => handleBenefitToggle(benefit)}
                                />
                            </label>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 4: DESKRIPSI & REQUIREMENT */}
            <section>
                 <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6 flex items-center gap-2">
                    <Building className="w-5 h-5 text-indigo-600" />
                    Deskripsi & Persyaratan
                </h3>
                <div className="space-y-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Pekerjaan <span className="text-red-500">*</span></label>
                        <textarea
                            rows={5}
                            required
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 border"
                            placeholder="Jelaskan tanggung jawab sehari-hari, tim, dan tujuan posisi ini..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Skill & Persyaratan Khusus (Pisahkan dengan Koma) <span className="text-red-500">*</span></label>
                        <textarea
                            rows={3}
                            required
                            value={reqInput}
                            onChange={e => setReqInput(e.target.value)}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 border"
                            placeholder="Contoh: React JS, Adobe Photoshop, Komunikasi Baik, Bersedia Lembur..."
                        />
                    </div>
                </div>
            </section>

            {/* SECTION 5: ADMINISTRASI */}
             <section>
                 <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Administrasi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Kuota Penerimaan (Orang)</label>
                         <input
                            type="number"
                            min="1"
                            value={formData.quota}
                            onChange={e => setFormData({...formData, quota: parseInt(e.target.value)})}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 border"
                        />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Batas Akhir Lamaran</label>
                         <input
                            type="date"
                            value={formData.deadline}
                            onChange={e => setFormData({...formData, deadline: e.target.value})}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 border"
                        />
                    </div>
                </div>
            </section>

            <div className="pt-8 border-t border-gray-100 flex justify-end items-center gap-4">
                <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    Simpan Draft
                </button>
                <button
                    type="submit"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5"
                >
                    {initialData ? 'Simpan Perubahan' : 'Terbitkan Lowongan'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
