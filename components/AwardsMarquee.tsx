'use client';

import Image from 'next/image';

const AWARDS = [
  { src: '/Awards/itfirms-top-app-developers-badge-2023.png', alt: 'IT Firms Top App Developers 2023' },
  { src: '/Awards/top_1000_companies_2022_global_award.svg.png', alt: 'Top 1000 Companies 2022 Global' },
  { src: '/Awards/top_magento_company_2023.png', alt: 'Top Magento Company 2023' },
];

export default function AwardsMarquee() {
  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        overflow: 'hidden',
        padding: '6px 0',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="marquee-track"
        style={{ animationDuration: '60s', gap: 0 }}
      >
        {[...Array(8)].flatMap(() => AWARDS).concat([...Array(8)].flatMap(() => AWARDS)).map((award, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              background: 'rgba(14,12,8,0.9)',
              borderLeft: '1px solid rgba(255,255,255,0.05)',
              borderRight: '1px solid rgba(255,255,255,0.05)',
              padding: '6px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src={award.src}
              alt={award.alt}
              width={120}
              height={70}
              style={{ objectFit: 'contain', width: 120, height: 70 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
