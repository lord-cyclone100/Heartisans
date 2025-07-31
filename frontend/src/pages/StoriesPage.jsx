import React from 'react';
import { StoryCard } from '../components/elements/StoryCard';
import { useTranslation } from 'react-i18next';

export const StoriesPage = () => {
  const { t } = useTranslation();
  const stories = [
    {
      id: 1,
      name: t('stories.sarah.name'),
      role: t('stories.sarah.role'),
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face",
      story: t('stories.sarah.story'),
      rating: 5
    },
    {
      id: 2,
      name: t('stories.michael.name'),
      role: t('stories.michael.role'),
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      story: t('stories.michael.story'),
      rating: 5
    },
    {
      id: 3,
      name: t('stories.emma.name'),
      role: t('stories.emma.role'),
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      story: t('stories.emma.story'),
      rating: 4
    },
    {
      id: 4,
      name: t('stories.david.name'),
      role: t('stories.david.role'),
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      story: t('stories.david.story'),
      rating: 5
    },
    {
      id: 5,
      name: t('stories.lisa.name'),
      role: t('stories.lisa.role'),
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      story: t('stories.lisa.story'),
      rating: 5
    },
    {
      id: 6,
      name: t('stories.james.name'),
      role: t('stories.james.role'),
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      story: t('stories.james.story'),
      rating: 4
    },
    {
      id: 7,
      name: t('stories.maria.name'),
      role: t('stories.maria.role'),
      image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
      story: t('stories.maria.story'),
      rating: 5
    }
  ];

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className='font-mhlk'>
          <div className='h-[10vh] w-full'></div>
          
          {/* Hero Header Section */}
          <div className="relative text-white overflow-hidden" style={{ background: 'linear-gradient(to right, #479626, #3d7a20, #2f5f18)' }}>
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative container mx-auto px-4 py-16 lg:py-24">
              <div className="text-center max-w-5xl mx-auto">
                <div className="text-6xl md:text-7xl lg:text-8xl mb-6"></div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                  {t('stories.hero.title')}
                </h1>
                <p className="text-xl md:text-2xl lg:text-3xl mb-8 leading-relaxed max-w-4xl mx-auto">
                  {t('stories.hero.subtitle')}
                </p>
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 text-lg md:text-xl lg:text-2xl">
                  <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3">
                    <span className="text-2xl md:text-3xl mr-2"></span>
                    <span className="font-semibold">{t('stories.hero.realExperiences')}</span>
                  </div>
                  <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3">
                    <span className="text-2xl md:text-3xl mr-2"></span>
                    <span className="font-semibold">{t('stories.hero.authenticReviews')}</span>
                  </div>
                  <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3">
                    <span className="text-2xl md:text-3xl mr-2"></span>
                    <span className="font-semibold">{t('stories.hero.communityLove')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stories Count Section */}
          <div className="py-8 bg-white shadow-sm">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center rounded-full px-6 md:px-8 py-3 md:py-4 shadow-lg" style={{ backgroundColor: '#e8f5e8', border: '2px solid #479626' }}>
                <span className="text-2xl md:text-3xl lg:text-4xl mr-3">📚</span>
                <span className="text-lg md:text-xl lg:text-2xl font-bold" style={{ color: '#479626' }}>
                  {t('stories.count', { count: stories.length })}
                </span>
              </div>
            </div>
          </div>

          {/* Stories Grid */}
          <div className="container mx-auto px-4 py-12 lg:py-16">
            <div className="flex flex-col gap-6 lg:gap-8 max-w-5xl mx-auto">
              {stories.map((story, index) => (
                <div key={story.id} className={`transform transition-all duration-300 hover:scale-[1.02] ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                  <StoryCard
                    name={story.name}
                    role={story.role}
                    image={story.image}
                    story={story.story}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Community Stats Section */}
          <div className="py-12 lg:py-16" style={{ background: 'linear-gradient(to right, #e8f5e8, #f0f9f0)' }}>
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 lg:mb-12" style={{ color: '#479626' }}>
                ✨ {t('stories.community.title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl p-6 lg:p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300" style={{ border: '2px solid #479626' }}>
                  <div className="text-4xl md:text-5xl lg:text-6xl mb-4">🎯</div>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#479626' }}>1000+</div>
                  <div className="text-lg md:text-xl lg:text-2xl font-semibold" style={{ color: '#479626' }}>{t('stories.community.happyCustomers')}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 lg:p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300" style={{ border: '2px solid #479626' }}>
                  <div className="text-4xl md:text-5xl lg:text-6xl mb-4">🏺</div>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#479626' }}>500+</div>
                  <div className="text-lg md:text-xl lg:text-2xl font-semibold" style={{ color: '#479626' }}>{t('stories.community.skilledArtisans')}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 lg:p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300" style={{ border: '2px solid #479626' }}>
                  <div className="text-4xl md:text-5xl lg:text-6xl mb-4">🛍️</div>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#479626' }}>5000+</div>
                  <div className="text-lg md:text-xl lg:text-2xl font-semibold" style={{ color: '#479626' }}>{t('stories.community.productsSold')}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 lg:p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300" style={{ border: '2px solid #479626' }}>
                  <div className="text-4xl md:text-5xl lg:text-6xl mb-4">⭐</div>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#479626' }}>4.9/5</div>
                  <div className="text-lg md:text-xl lg:text-2xl font-semibold" style={{ color: '#479626' }}>{t('stories.community.averageRating')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="bg-gradient-to-b py-16 lg:py-20">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="text-5xl md:text-6xl lg:text-7xl mb-6">📝</div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
                  {t('stories.cta.title')}
                </h2>
                <p className="text-xl md:text-2xl lg:text-3xl mb-8 lg:mb-12 leading-relaxed max-w-3xl mx-auto">
                  {t('stories.cta.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center">
                  <button className="font-bold text-lg md:text-xl lg:text-2xl px-8 lg:px-12 py-4 lg:py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white" style={{ backgroundColor: '#ffaf27' }}>
                    {t('stories.cta.shareExperience')}
                  </button>
                  <button className="font-bold text-lg md:text-xl lg:text-2xl px-8 lg:px-12 py-4 lg:py-5 rounded-2xl transition-all duration-300 hover:scale-105 text-white" style={{ backgroundColor: '#ffaf27' }}>
                    {t('stories.cta.contactUs')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
