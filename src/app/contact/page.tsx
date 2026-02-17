"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Mail, 
  MessageSquare, 
  Send, 
  MapPin, 
  Phone, 
  Github, 
  Twitter, 
  Linkedin,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  HelpCircle
} from "lucide-react";
import { Button, Input, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "krishmishra297@gmail.com",
      href: "mailto:krishmishra297@gmail.com",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Dehradun, India",
      href: null,
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 6397124871",
      href: "tel:+916397124871",
    },
  ];

  const socialLinks = [
    { icon: Github, label: "GitHub", href: "https://github.com/kri297" },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com/algobuddy" },
    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/krish-mishra297" },
  ];

  const faqItems = [
    {
      question: "Is AlgoBuddy free to use?",
      answer: "Yes! AlgoBuddy offers a free tier with access to core features. Premium features are available with a subscription.",
    },
    {
      question: "Can I use AlgoBuddy for interview prep?",
      answer: "Absolutely! AlgoBuddy is designed to help you master algorithms and data structures, which are essential for technical interviews.",
    },
    {
      question: "Do you offer team or educational licenses?",
      answer: "Yes, we offer special pricing for teams and educational institutions. Contact us for more details.",
    },
  ];

  return (
    <div className="min-h-screen py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container px-4 max-w-6xl">
        {/* Back link */}
        <Link
          href="/about"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to About
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6">
            <MessageSquare className="w-4 h-4" />
            We're Here to Help
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white">
            Get in{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Have a question, suggestion, or just want to say hello? We&apos;d love to hear from you!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-shadow">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-extrabold mb-3 text-slate-900 dark:text-white">Message Sent!</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                    Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                    variant="outline"
                    className="px-8 py-4 rounded-xl"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-slate-200 dark:border-slate-800">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <MessageSquare className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-xl text-slate-900 dark:text-white">Send us a message</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Fill out the form and we&apos;ll respond ASAP
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <Input
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="John Doe"
                      />
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="john@example.com"
                      />
                    </div>

                    <Input
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      error={errors.subject}
                      placeholder="What's this about?"
                    />

                    <Textarea
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      error={errors.message}
                      placeholder="Tell us more about your question or feedback..."
                      rows={5}
                    />

                    <Button
                      type="submit"
                      className="w-full gap-3 py-6 text-lg rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact Details */}
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <h3 className="font-bold text-xl mb-6 text-slate-900 dark:text-white">Contact Information</h3>
              <div className="space-y-5">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          {item.label}
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">{item.value}</div>
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <a
                      key={index}
                      href={item.href}
                      className="block hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl p-3 -m-3 transition-all duration-300 hover:scale-105"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={index} className="p-3 -m-3">
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <h3 className="font-bold text-xl mb-6 text-slate-900 dark:text-white">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  const colors = [
                    'from-purple-500 to-pink-500',
                    'from-blue-500 to-cyan-500',
                    'from-violet-500 to-purple-500',
                  ];
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[index]} flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}
                      aria-label={social.label}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-3xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Response Time</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    We typically respond within <span className="font-bold">24-48 hours</span> during business days.
                    For urgent matters, please email us directly.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-4">
              <HelpCircle className="w-4 h-4" />
              Quick Answers
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Quick answers to common questions
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-8 hover:shadow-2xl hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {item.question}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
