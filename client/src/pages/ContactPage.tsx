import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import MainLayout from '../components/MainLayout';
import interiorDesign from '../assets/Interior Design.webp';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    console.log('Contact form data:', data);
    // Handle form submission (e.g., send to API)
    reset();
  };

  return (
    <MainLayout>
      <section className="py-16 lg:py-24 bg-tiko-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left side: Content & Image */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <p className="text-xs font-outfit font-bold text-tiko-primary uppercase tracking-widest">Connect with Us</p>
                <h1 className="text-4xl sm:text-5xl font-outfit font-bold text-tiko-on-surface leading-tight">
                  We'd love to hear from you.
                </h1>
                <p className="text-base text-tiko-on-surface-variant leading-relaxed max-w-lg">
                  Whether you have a question about our collections, need styling advice, or just want to say hello, our team is here to help.
                </p>
              </div>

              <div className="rounded-3xl overflow-hidden aspect-video shadow-xl">
                <img 
                  src={interiorDesign} 
                  alt="Tiko Interior Design" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-bold text-tiko-on-surface uppercase tracking-wider mb-2">Our Studio</h4>
                  <p className="text-sm text-tiko-on-surface-variant">123 Design District<br />Amman, Jordan</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-tiko-on-surface uppercase tracking-wider mb-2">Inquiries</h4>
                  <p className="text-sm text-tiko-on-surface-variant">hello@tiko.com<br />+962 79 000 0000</p>
                </div>
              </div>
            </div>

            {/* Right side: Contact Form */}
            <div className="bg-tiko-surface-container-low rounded-3xl p-8 sm:p-10 shadow-sm border border-tiko-outline-variant order-1 lg:order-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-tiko-on-surface mb-2">Full Name</label>
                  <input
                    {...register('name')}
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 bg-white border border-tiko-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all placeholder:text-tiko-outline-variant"
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="mt-1 text-xs text-tiko-error">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-tiko-on-surface mb-2">Email Address</label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-white border border-tiko-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all placeholder:text-tiko-outline-variant"
                    placeholder="name@example.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-tiko-error">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-tiko-on-surface mb-2">Message</label>
                  <textarea
                    {...register('message')}
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-tiko-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all placeholder:text-tiko-outline-variant resize-none"
                    placeholder="How can we help you?"
                  />
                  {errors.message && <p className="mt-1 text-xs text-tiko-error">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-tiko-primary text-white font-bold rounded-xl hover:bg-tiko-primary/90 active:scale-[0.98] transition-all shadow-md shadow-tiko-primary/20 flex items-center justify-center gap-2"
                >
                  <span>SEND MESSAGE</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ContactPage;
