// "use client";
// import React, { useState } from 'react';
// import { 
//   X, 
//   Save, 
//   AlertCircle,
//   CheckCircle,
//   Upload,
//   File,
//   Loader2
// } from 'lucide-react';

// interface AddProjectModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   isPending: boolean;
//   onAddProject: (formData: FormData) => Promise<any>;
// }

// const AddProjectModal: React.FC<AddProjectModalProps> = ({
//   isOpen,
//   onClose,
//   onSuccess,
//   isPending,
//   onAddProject
// }) => {
//   const [formData, setFormData] = useState({
//     nameProject: '',
//     packPrice: '',
//     duration: '',
//     monthlyPayment: '',
//     description: '',
//     gainProject: ''
//   });
  
//   const [file, setFile] = useState<File | null>(null);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};
    
//     if (!formData.nameProject.trim()) {
//       newErrors.nameProject = 'Le nom du projet est requis';
//     }
//     if (!formData.packPrice || Number(formData.packPrice) <= 0) {
//       newErrors.packPrice = 'Le prix du pack doit être supérieur à 0';
//     }
//     if (!formData.duration || Number(formData.duration) <= 0) {
//       newErrors.duration = 'La durée doit être supérieure à 0';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     setIsSubmitting(true);
    
//     try {
//       const submitData = new FormData();
//       submitData.append('nameProject', formData.nameProject);
//       submitData.append('packPrice', formData.packPrice);
//       submitData.append('duration', formData.duration);
//       submitData.append('monthlyPayment', formData.monthlyPayment);
//       submitData.append('description', formData.description);
//       submitData.append('gainProject', formData.gainProject);
      
//       if (file) {
//         submitData.append('rapport', file);
//       }

//       const result = await onAddProject(submitData);
      
//       if (result && result.type === 'success') {
//         setMessage({ type: 'success', text: 'Projet créé avec succès !' });
//         setTimeout(() => {
//           onSuccess();
//           onClose();
//           resetForm();
//         }, 2000);
//       } else {
//         setMessage({ 
//           type: 'error', 
//           text: result?.message || 'Erreur lors de la création du projet' 
//         });
//         setIsSubmitting(false);
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Erreur lors de la création du projet' });
//       setIsSubmitting(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       nameProject: '',
//       packPrice: '',
//       duration: '',
//       monthlyPayment: '',
//       description: '',
//       gainProject: ''
//     });
//     setFile(null);
//     setErrors({});
//     setMessage(null);
//     setIsSubmitting(false);
//   };

//   const handleClose = () => {
//     if (!isPending && !isSubmitting) {
//       resetForm();
//       onClose();
//     }
//   };

//   if (!isOpen) return null;

//   const isLoading = isPending || isSubmitting;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-bold text-gray-900">Nouveau Projet</h2>
//             <button onClick={handleClose} disabled={isLoading} className="text-gray-400 hover:text-gray-600">
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           {/* Message */}
//           {message && (
//             <div className={`mb-6 p-4 rounded-lg ${
//               message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//             }`}>
//               <div className="flex items-center">
//                 {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
//                 {message.text}
//               </div>
//             </div>
//           )}

//           <div className="space-y-4">
//             {/* Nom du projet */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Nom du projet <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="nameProject"
//                 value={formData.nameProject}
//                 onChange={handleInputChange}
//                 disabled={isLoading}
//                 className={`w-full px-3 py-2 border rounded-lg ${errors.nameProject ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.nameProject && <p className="text-red-500 text-xs mt-1">{errors.nameProject}</p>}
//             </div>

//             {/* Prix du pack */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Prix du pack (FCFA) <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 name="packPrice"
//                 value={formData.packPrice}
//                 onChange={handleInputChange}
//                 disabled={isLoading}
//                 min="1"
//                 className={`w-full px-3 py-2 border rounded-lg ${errors.packPrice ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.packPrice && <p className="text-red-500 text-xs mt-1">{errors.packPrice}</p>}
//             </div>

//             {/* Durée */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Durée (mois) <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 name="duration"
//                 value={formData.duration}
//                 onChange={handleInputChange}
//                 disabled={isLoading}
//                 min="1"
//                 className={`w-full px-3 py-2 border rounded-lg ${errors.duration ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
//             </div>

//             {/* Paiement mensuel */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Paiement mensuel (FCFA)</label>
//               <input
//                 type="number"
//                 name="monthlyPayment"
//                 value={formData.monthlyPayment}
//                 onChange={handleInputChange}
//                 disabled={isLoading}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               />
//             </div>

//             {/* Gain */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Gain du projet (FCFA)</label>
//               <input
//                 type="number"
//                 name="gainProject"
//                 value={formData.gainProject}
//                 onChange={handleInputChange}
//                 disabled={isLoading}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 disabled={isLoading}
//                 rows={3}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               />
//             </div>

//             {/* Upload rapport */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Rapport (PDF)</label>
//               <div className="mt-1 flex items-center">
//                 <label className="cursor-pointer flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//                   <Upload className="w-4 h-4 mr-2" />
//                   Choisir un fichier
//                   <input
//                     type="file"
//                     accept=".pdf"
//                     onChange={handleFileChange}
//                     disabled={isLoading}
//                     className="hidden"
//                   />
//                 </label>
//                 {file && (
//                   <div className="ml-3 flex items-center text-sm text-gray-600">
//                     <File className="w-4 h-4 mr-1" />
//                     {file.name}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Boutons */}
//           <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
//             <button
//               onClick={handleClose}
//               disabled={isLoading}
//               className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//             >
//               Annuler
//             </button>
//             <button
//               onClick={handleSubmit}
//               disabled={isLoading}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//             >
//               {isLoading ? (
//                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//               ) : (
//                 <Save className="w-4 h-4 mr-2" />
//               )}
//               {isLoading ? 'Création...' : 'Créer le projet'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProjectModal;