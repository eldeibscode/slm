export interface NavItem {
  label: string;
  href: string;
}

export interface PricingPlan {
  name: string;
  price: { monthly: number; annually: number };
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  avatar: string;
  rating: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const siteConfig = {
  name: 'Salam Förderverein e.V. Bonn',
  tabTitle: "Salam",
  logo: '/assets/images/slm.JPG',
  description: 'Supercharge your thinking with AI-powered insights',
  url: 'https://ultrathink.app',

  nav: [
    { label: 'Nachrichten', href: '#news' },
    { label: 'Features', href: '#features' },
    // { label: 'Pricing', href: '#pricing' },
    // { label: 'Testimonials', href: '#testimonials' },
    { label: 'Mawaqit', href: '#mawaqit' },
    // { label: 'FAQ', href: '#faq' },
  ] as NavItem[],

  hero: {
    id: 'hero',
    // items: [
    //   {
    //     badge: 'New: AI-Powered Analysis',
    //     title: 'Think Smarter, Move Faster',
    //     subtitle:
    //       'UltraThink helps you make better decisions with AI-powered insights. Transform complex data into actionable strategies in seconds.',
    //     // primaryCTA: { label: 'Start Free Trial', href: '#pricing' },
    //     // secondaryCTA: { label: 'Watch Demo', href: '#demo' },
    //     socialProof: 'Trusted by 10,000+ professionals worldwide',
    //   },
    //   {
    //     badge: 'New: AI-Powered Analysis',
    //     title: 'Think Smarter, Move Faster',
    //     subtitle:
    //       'UltraThink helps you make better decisions with AI-powered insights. Transform complex data into actionable strategies in seconds.',
    //     primaryCTA: { label: 'Start Free Trial', href: '#pricing' },
    //     secondaryCTA: { label: 'Watch Demo', href: '#demo' },
    //     socialProof: 'Trusted by 10,000+ professionals worldwide',
    //   },
    // ],
  },

  mawaqit: {
    id: 'mawaqit',
    title: 'Why Choose UltraThink?',
    description:
      'UltraThink combines cutting-edge AI technology with user-friendly design to deliver unparalleled analytics capabilities. Here’s why leading businesses trust us:',
  },

  features: {
    id: 'features',
    items: [
      {
        icon: 'zap',
        title: 'Lightning Fast',
        description:
          'Get insights in milliseconds. Our AI processes complex data faster than you can blink.',
      },
      {
        icon: 'shield',
        title: 'Enterprise Security',
        description:
          'Bank-grade encryption and SOC 2 compliance. Your data stays private and secure.',
      },
      {
        icon: 'bar-chart-3',
        title: 'Advanced Analytics',
        description:
          'Deep dive into your data with customizable dashboards and real-time reporting.',
      },
      {
        icon: 'users',
        title: 'Team Collaboration',
        description:
          'Share insights, assign tasks, and work together seamlessly across your organization.',
      },
      {
        icon: 'globe',
        title: 'Global Scale',
        description: 'Deploy worldwide with edge computing. Low latency access from anywhere.',
      },
      {
        icon: 'sparkles',
        title: 'AI-Powered',
        description:
          'Leverage cutting-edge machine learning models trained on billions of data points.',
      },
    ],
  },

  pricing: {
    id: 'pricing',
    plans: [
      {
        name: 'Starter',
        price: { monthly: 9, annually: 7 },
        description: 'Perfect for individuals',
        features: [
          '5 projects',
          '1,000 AI queries/month',
          'Basic analytics',
          'Email support',
          'API access',
        ],
        cta: 'Start Free Trial',
        highlighted: false,
      },
      {
        name: 'Pro',
        price: { monthly: 29, annually: 24 },
        description: 'Best for growing teams',
        features: [
          'Unlimited projects',
          '10,000 AI queries/month',
          'Advanced analytics',
          'Priority support',
          'API access',
          'Team collaboration',
          'Custom integrations',
        ],
        cta: 'Start Free Trial',
        highlighted: true,
      },
      {
        name: 'Enterprise',
        price: { monthly: 99, annually: 79 },
        description: 'For large organizations',
        features: [
          'Unlimited everything',
          'Unlimited AI queries',
          'White-label option',
          '24/7 phone support',
          'Dedicated account manager',
          'Custom AI training',
          'SLA guarantee',
          'On-premise deployment',
        ],
        cta: 'Contact Sales',
        highlighted: false,
      },
    ] as PricingPlan[],
  },

  testimonials: {
    id: 'testimonials',
    items: [
      {
        quote:
          'UltraThink transformed how we make decisions. We reduced our analysis time by 80% and increased accuracy significantly.',
        author: 'Sarah Chen',
        title: 'CEO at TechFlow',
        avatar: '/avatars/sarah.jpg',
        rating: 5,
      },
      {
        quote:
          'The AI insights are incredibly accurate. It is like having a team of analysts working 24/7 for a fraction of the cost.',
        author: 'Michael Roberts',
        title: 'VP of Strategy at GlobalCorp',
        avatar: '/avatars/michael.jpg',
        rating: 5,
      },
      {
        quote:
          'Best investment we made this year. The ROI was visible within the first month of implementation.',
        author: 'Emily Watson',
        title: 'Director at Innovate Inc',
        avatar: '/avatars/emily.jpg',
        rating: 5,
      },
    ] as Testimonial[],
  },

  faq: {
    id: 'faq',
    items: [
      {
        question: 'What is UltraThink?',
        answer:
          'UltraThink is an AI-powered analytics platform that helps businesses make smarter decisions faster. It processes complex data and delivers actionable insights in seconds.',
      },
      {
        question: 'How does the free trial work?',
        answer:
          'You get 14 days of full access to all Pro features. No credit card required. Cancel anytime with no obligations.',
      },
      {
        question: 'Is my data secure?',
        answer:
          'Absolutely. We use bank-grade AES-256 encryption, are SOC 2 Type II certified, and never share your data with third parties. Your data remains yours.',
      },
      {
        question: 'Can I change plans later?',
        answer:
          'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we will prorate your billing.',
      },
      {
        question: 'Do you offer refunds?',
        answer:
          'Yes, we offer a 30-day money-back guarantee. If you are not satisfied, contact us for a full refund, no questions asked.',
      },
      {
        question: 'What integrations do you support?',
        answer:
          'We integrate with 100+ tools including Slack, Salesforce, HubSpot, Google Analytics, Tableau, and more. Custom integrations available on Enterprise plans.',
      },
    ] as FAQItem[],
  },

  footer: {
    links: {
      product: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Integrations', href: '/integrations' },
        { label: 'Changelog', href: '/changelog' },
      ],
      company: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
      ],
      resources: [
        { label: 'Documentation', href: '/docs' },
        { label: 'Help Center', href: '/help' },
        { label: 'API Reference', href: '/api' },
        { label: 'Status', href: '/status' },
      ],
      legal: [
        { label: 'Kontakt', href: '/kontakt' },
        { label: 'Impressum', href: '/impressum' },
      ],
    },
    social: {
      instagram: 'https://www.instagram.com/salam.fv.sm',
      // twitter: 'https://twitter.com/ultrathink',
      // linkedin: 'https://linkedin.com/company/ultrathink',
      // github: 'https://github.com/ultrathink',
    },
  },
};
