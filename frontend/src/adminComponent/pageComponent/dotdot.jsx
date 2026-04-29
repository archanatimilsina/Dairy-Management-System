// import React from 'react';
// import styled, { createGlobalStyle } from 'styled-components';
// import { Mail, Twitter, Github, ChevronRight } from 'lucide-react';

// // --- Global Styles & Theme ---
// const GlobalStyle = createGlobalStyle`
//   :root {
//     --bg-deep: #010828;
//     --cream: #EFF4FF;
//     --neon: #6FFF00;
//   }
//   body {
//     margin: 0;
//     background-color: var(--bg-deep);
//     color: var(--cream);
//     font-family: monospace;
//     overflow-x: hidden;
//   }
//   .font-anton { font-family: 'Anton', sans-serif; text-transform: uppercase; }
//   .font-condiment { font-family: 'Condiment', cursive; text-transform: none; color: var(--neon); }
// `;

// // --- Liquid Glass Styled Component ---
// const LiquidGlass = styled.div`
//   background: rgba(255, 255, 255, 0.01);
//   backdrop-filter: blur(4px);
//   -webkit-backdrop-filter: blur(4px);
//   border: none;
//   box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
//   position: relative;
//   overflow: hidden;

//   &::before {
//     content: '';
//     position: absolute;
//     inset: 0;
//     border-radius: inherit;
//     padding: 1.4px;
//     background: linear-gradient(180deg,
//       rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%,
//       rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
//       rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
//     -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
//     -webkit-mask-composite: xor;
//     mask-composite: exclude;
//     pointer-events: none;
//   }
// `;

// const TextureOverlay = styled.div`
//   position: fixed;
//   inset: 0;
//   z-index: 50;
//   pointer-events: none;
//   background-image: url('/texture.png'); /* Ensure this file exists in /public */
//   background-size: cover;
//   mix-blend-mode: lighten;
//   opacity: 0.6;
// `;

// // --- Section Components ---

// const Section = styled.section`
//   position: relative;
//   width: 100%;
//   max-width: 1831px;
//   margin: 0 auto;
//   min-height: 100vh;
// `;

// const VideoBg = styled.video`
//   position: absolute;
//   inset: 0;
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   z-index: -1;
// `;

// const OrbisNft = () => {
//   return (
//     <>
//       <GlobalStyle />
//       <TextureOverlay />

//       {/* SECTION 1: HERO */}
//       <Section style={{ borderRadius: '0 0 32px 32px', overflow: 'hidden' }}>
//         <VideoBg autoPlay loop muted playsInline src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4" />
        
//         {/* Header */}
//         <header style={{ padding: '24px 120px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <div className="font-anton" style={{ fontSize: '16px' }}>Orbis.Nft</div>
          
//           <LiquidGlass as="nav" style={{ borderRadius: '28px', padding: '24px 52px', display: 'flex', gap: '32px' }}>
//             {['Homepage', 'Gallery', 'Buy NFT', 'FAQ', 'Contact'].map(link => (
//               <a key={link} href="#" className="font-anton" style={{ fontSize: '13px', color: 'inherit', textDecoration: 'none' }}>{link}</a>
//             ))}
//           </LiquidGlass>

//           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'absolute', right: '40px', top: '40px' }}>
//             <SocialBtn><Mail size={20} /></SocialBtn>
//             <SocialBtn><Twitter size={20} /></SocialBtn>
//             <SocialBtn><Github size={20} /></SocialBtn>
//           </div>
//         </header>

//         <div style={{ marginTop: '15vh', paddingLeft: '128px', position: 'relative' }}>
//           <h1 className="font-anton" style={{ fontSize: '90px', maxWidth: '780px', lineHeight: '1' }}>
//             Beyond earth<br/>and ( its ) familiar boundaries
//           </h1>
//           <span className="font-condiment" style={{ 
//             position: 'absolute', top: '20px', left: '600px', fontSize: '48px', 
//             rotate: '-1deg', mixBlendMode: 'exclusion', opacity: 0.9 
//           }}>Nft collection</span>
//         </div>
//       </Section>

//       {/* SECTION 2: ABOUT */}
//       <Section style={{ padding: '96px 120px' }}>
//         <VideoBg autoPlay loop muted playsInline src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4" />
        
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//           <div style={{ position: 'relative' }}>
//             <h2 className="font-anton" style={{ fontSize: '60px' }}>Hello!<br/>I'm orbis</h2>
//             <span className="font-condiment" style={{ 
//               position: 'absolute', bottom: '-10px', right: '-40px', fontSize: '68px', 
//               rotate: '-2deg', mixBlendMode: 'exclusion' 
//             }}>Orbis</span>
//           </div>
//           <p style={{ maxWidth: '266px', fontSize: '16px', lineHeight: '1.6', textTransform: 'uppercase', opacity: 0.8 }}>
//             A digital object fixed beyond time and place. An exploration of distance, form, and silence in space
//           </p>
//         </div>
//       </Section>

//       {/* SECTION 3: COLLECTION */}
//       <Section style={{ backgroundColor: '#010828', padding: '96px 120px', minHeight: 'auto' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '64px' }}>
//           <h2 className="font-anton" style={{ fontSize: '60px' }}>
//             Collection of<br/>
//             <span style={{ marginLeft: '128px' }}>
//               <span className="font-condiment" style={{ fontSize: '60px' }}>Space</span> objects
//             </span>
//           </h2>
//           <div style={{ textAlign: 'right' }}>
//             <div className="font-anton" style={{ fontSize: '60px', display: 'flex', alignItems: 'center', gap: '10px' }}>
//               SEE <div style={{ fontSize: '24px', lineHeight: '1' }}>ALL<br/>CREATORS</div>
//             </div>
//             <div style={{ height: '8px', background: 'var(--neon)', width: '100%' }} />
//           </div>
//         </div>

//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
//           <NftCard score="8.7" vid="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4" />
//           <NftCard score="9.0" vid="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4" />
//           <NftCard score="8.2" vid="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4" />
//         </div>
//       </Section>

//       {/* SECTION 4: CTA */}
//       <Section style={{ minHeight: 'auto' }}>
//         <video autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} 
//           src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4" />
        
//         <div style={{ position: 'absolute', inset: 0, padding: '120px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
//           <div style={{ textAlign: 'right', position: 'relative' }}>
//              <span className="font-condiment" style={{ position: 'absolute', top: '-60px', left: '-100px', fontSize: '68px', mixBlendMode: 'exclusion' }}>Go beyond</span>
//              <h2 className="font-anton" style={{ fontSize: '60px', lineHeight: '1.2' }}>
//                 <div style={{ marginBottom: '40px' }}>JOIN US.</div>
//                 REVEAL WHAT'S HIDDEN.<br/>
//                 DEFINE WHAT'S NEXT.<br/>
//                 FOLLOW THE SIGNAL.
//              </h2>
//           </div>
//         </div>
//       </Section>
//     </>
//   );
// };

// // --- Sub-components ---

// const SocialBtn = styled(LiquidGlass)`
//   width: 56px;
//   height: 56px;
//   border-radius: 1rem;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   transition: background 0.3s;
//   &:hover { background: rgba(255,255,255,0.1); }
// `;

// const NftCard = ({ score, vid }) => (
//   <LiquidGlass style={{ borderRadius: '32px', padding: '18px' }}>
//     <div style={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden', borderRadius: '24px' }}>
//       <VideoBg autoPlay loop muted playsInline src={vid} />
//     </div>
//     <LiquidGlass style={{ marginTop: '16px', borderRadius: '20px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//       <div>
//         <div style={{ fontSize: '11px', opacity: 0.7 }}>RARITY SCORE:</div>
//         <div style={{ fontSize: '16px' }}>{score}/10</div>
//       </div>
//       <div style={{ 
//         width: '48px', height: '48px', borderRadius: '50%', 
//         background: 'linear-gradient(to bottom right, #b724ff, #7c3aed)',
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         boxShadow: '0 0 20px rgba(183, 36, 255, 0.5)'
//       }}>
//         <ChevronRight size={24} color="white" />
//       </div>
//     </LiquidGlass>
//   </LiquidGlass>
// );

// export default OrbisNft;