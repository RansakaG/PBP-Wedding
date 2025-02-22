import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Implement form submission
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['Galle, Sri Lanka']
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+94 77 2075 900']
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['praudabuwaneka@gmail.com']
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Mon - Sat: 9:00 AM - 6:00 PM', 'Sunday: By Appointment']
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-brand-beige/20 to-white">
        {/* Hero Section */}
        <div className="relative h-[40vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Contact us"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/40 to-brand-dark/80" />
          </div>
          <div className="relative h-full flex items-center justify-center text-center">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4"
              >
                Contact Us
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-brand-beige"
              >
                Get in touch with our team
              </motion.p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-beige/5 to-white/50" />
            <div className="relative">
              <h2 className="text-3xl font-serif text-brand-dark mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-brand-dark mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-brand-beige/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige/30 transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-brand-dark mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-brand-beige/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige/30 transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-brand-dark mb-2">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-brand-beige/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige/30 transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-brand-dark mb-2">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-brand-beige/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige/30 transition-all duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="Wedding Photography">Wedding Photography</option>
                    <option value="Portrait Session">Portrait Session</option>
                    <option value="Commercial Shoot">Commercial Shoot</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-brand-dark mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-brand-beige/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige/30 transition-all duration-300"
                  ></textarea>
                </div>
                <div className="mt-8 flex flex-col items-center border-t border-brand-beige/20 pt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-64 px-8 py-4 bg-brand-beige text-white rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg group relative overflow-hidden disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-muted to-brand-beige opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Send className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                    <span className="text-lg font-serif relative z-10">
                      Send Message
                    </span>
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-beige/5 to-white/50 rounded-2xl transform transition-transform group-hover:scale-105" />
                  <div className="relative">
                    <div className="relative w-12 h-12 mb-4">
                      <div className="absolute inset-0 bg-brand-beige/10 rounded-xl transform rotate-6 transition-transform group-hover:rotate-12" />
                      <div className="absolute inset-0 bg-white rounded-xl shadow-lg transform group-hover:-rotate-3 transition-transform" />
                      <info.icon className="w-6 h-6 absolute inset-0 m-auto text-brand-beige transition-colors group-hover:text-brand-muted" />
                    </div>
                    <h3 className="text-xl font-serif text-brand-dark mb-3">{info.title}</h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-brand-dark/80">{detail}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-beige/5 to-white/50" />
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=80.24693,6.05199,80.25093,6.05599&layer=mapnik&marker=6.053997,80.248931"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    className="rounded-xl"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
