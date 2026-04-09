'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Globe, Bell } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="container-custom max-w-4xl">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="text-4xl sm:text-6xl font-black mb-6 uppercase italic tracking-tighter italic">
              Privacy <span className="text-red-600">Policy</span>
            </h1>
            <p className="text-black/70 dark:text-white/70 font-medium">Last Updated: April 5, 2026</p>
          </motion.div>

          {/* Content Grid */}
          <div className="space-y-12">
            {[
              {
                icon: Shield,
                title: "Introduction",
                content: "At DoubleTmedia, we respect your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our #1 Social Media Marketplace service."
              },
              {
                icon: Eye,
                title: "Data Collection",
                content: "We collect information that you provide directly to us, such as your name, email address, and social media handles when you place an order. We also collect automated data like IP addresses and browser types to optimize your experience."
              },
              {
                icon: Lock,
                title: "How We Use Your Data",
                content: "Your data is used strictly for processing orders, providing customer support, and improving our neural growth algorithms. We do not sell your personal information to third parties."
              },
              {
                icon: Globe,
                title: "Cookies & Tracking",
                content: "We use essential cookies to maintain your session and security. Performance cookies help us understand how you interact with our platform to deliver faster service delivery."
              },
              {
                icon: FileText,
                title: "Data Retention",
                content: "We retain your information only as long as necessary to provide you with our services and for legitimate legal purposes."
              },
              {
                icon: Bell,
                title: "Your Rights",
                content: "You have the right to access, correct, or delete your personal data at any time. Simply contact our 24/7 support team through the dashboard for any privacy-related requests."
              }
            ].map((section, i) => (
              <motion.section 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex gap-8 p-8 rounded-3xl bg-slate-100 dark:bg-[#080808] border border-black/5 dark:border-white/5 hover:border-red-600/20 transition-all duration-500"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                  <section.icon size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black mb-4 uppercase italic tracking-tight">{section.title}</h2>
                  <p className="text-black/70 dark:text-white/70 leading-relaxed font-medium">{section.content}</p>
                </div>
              </motion.section>
            ))}
          </div>

          {/* Footer Note */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 p-8 rounded-3xl bg-red-600/5 border border-red-600/10 text-center"
          >
            <p className="text-sm text-black/90 dark:text-white/90 font-medium">
              By using DoubleTmedia, you agree to the collection and use of information in accordance with this policy. For any questions, please contact us at <span className="text-red-600">support@doubletmedia.com</span>
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
