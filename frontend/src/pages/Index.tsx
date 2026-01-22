import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/landing/HeroSection';
import ProblemSection from '@/components/landing/ProblemSection';
import SolutionSection from '@/components/landing/SolutionSection';
import SadaqaSection from '@/components/landing/SadaqaSection';
import TrustSection from '@/components/landing/TrustSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <SadaqaSection />
      <TrustSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
