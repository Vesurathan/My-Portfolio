import MLGallery from '@/components/ml/MLGallery';
import MLPageTop from '@/components/ml/MLPageTop';

export const metadata = {
  title: 'ML Models | Portfolio',
};

export default function MLPage() {
  return (
    <div className="min-h-screen bg-void text-fg">
      {/* pt matches fixed navbar (min-h-[4.5rem]); sticky bar sits below nav when scrolling */}
      <div className="pt-[4.5rem]">
        <MLPageTop />
        <MLGallery />
      </div>
    </div>
  );
}

