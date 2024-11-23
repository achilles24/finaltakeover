import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener('DOMContentLoaded', function() {
    if($('.featureTakeover') && $('.featureTakeover').attr('data-wcmmode') != 'EDIT'){
        const textBoxes = document.querySelectorAll('.feature-takeover-hero-card');
        const takeoverFirstCards = textBoxes[0].getBoundingClientRect().left;
        const images = document.querySelectorAll('.feature-takeover-storytelling-scroller-section:not(:first-child) img');
        const scrollerSections = document.querySelectorAll('.feature-takeover-storytelling-scroller-section');
        if (scrollerSections.length >= 2) {
            scrollerSections[0].classList.add('first-');
            scrollerSections[scrollerSections.length - 2].classList.add('last-');
        }
        const firstImage = document.querySelector('.feature-takeover-storytelling-scroller-section img');
    
        const isMobile = window.innerWidth < 768;
        if (!isMobile) {
            textBoxes.forEach((each, idx) => {
                if (idx != 0) {
                    each.style.left = `${takeoverFirstCards}px`;
                }
            });
        }

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: Array.from({ length: 101 }, (_, i) => i / 100)
        };

        const observer = new IntersectionObserver((entries, observer) => {
            const windowHeight = window.innerHeight;
            entries.forEach(entry => {
                const image = entry.target;
                const index = Array.from(images).indexOf(image);
                const textBox = textBoxes[index];
                const overlay = image.nextElementSibling;
                const rect = entry.boundingClientRect;
                if (entry.isIntersecting) {
                    const scrollPercent = entry.intersectionRatio;
                    const scale = 1.15 - (scrollPercent * 0.15);
                    image.style.transform = `scale(${Math.max(1, Math.min(1.15, scale))})`;

                    if (!isMobile) {
                        const imageHeight = image.getBoundingClientRect().height;
                        const imageMidPoint = imageHeight / 4
                        const textBoxOffset = (rect.top < windowHeight - imageMidPoint) ? -10 - ((scrollPercent - 0.25) * 40) : 0;
                        textBox.style.transform = `translateY(${Math.max(-10, Math.min(0, textBoxOffset))}vh)`;
                    }
                    const overlayOpacity = Math.min(0.64, (1 - scrollPercent) * 0.64);
                    overlay.style.background = `rgba(0, 0, 0, ${overlayOpacity})`;

                    image.style.filter = 'blur(0px)';
                    overlay.style.background = 'rgba(0, 0, 0, 0)';

                } else {
                    if (entry.boundingClientRect.top < 0) {
                        image.style.filter = 'blur(10px)';
                        overlay.style.background = 'rgba(0, 0, 0, 0.64)';
                        if (!isMobile) {
                            textBox.style.transform = 'translateY(-10vh)';
                        }
                    } else {
                        if (!isMobile) {
                            textBox.style.transform = 'translateY(0vh)';
                        }
                        image.style.filter = 'blur(0px)';
                        overlay.style.background = 'rgba(0, 0, 0, 0)';
                    }
                }
            });
        }, options);

        images.forEach(image => {
            observer.observe(image);
        });
        gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

        if (!isMobile) {
            const firstSection = document.querySelector('.feature-takeover-storytelling-scroller-section');
            ScrollTrigger.create({
                trigger: firstImage,
                start: 'top 50vh',
                end: 'bottom top',
                onEnter: () => {
                    firstSection.classList.add('first-image');
                    textBoxes[0].classList.add('visible');
                    textBoxes[0].style.left = `${textBoxes[1].getBoundingClientRect().left}px`;
                },
                onLeaveBack: () => {
                    firstSection.classList.remove('first-image');
                    textBoxes[0].classList.remove('visible');
                    textBoxes[0].style.left = isMobile ? '0' : '-64px';
                },
                scrub: 1
            });
        }

        if (isMobile) {
            const firstSection = document.querySelector('.feature-takeover-storytelling-scroller-section');
            ScrollTrigger.create({
                trigger: firstImage,
                start: 'top 250vh',
                end: 'bottom top',
                onEnter: () => {
                    firstSection.classList.add('first-image');
                },
                onLeaveBack: () => {
                    firstSection.classList.remove('first-image');
                },
                scrub: 1
            });
        }

        const wrapper1 = gsap?.utils?.toArray(`.feature-takeover-storytelling-scroller .feature-takeover-storytelling-scroller-section`);
        if (wrapper1?.length && !isMobile) {
            ScrollTrigger.create({
            end: 'bottom top',
            endTrigger: '.last-',
            scrub: true,
            snap: {
                delay: 0.015,
                duration: 1.25,
                ease: 'power1.inOut',
                snapTo: 1 / wrapper1?.length,
            },
            start: 'top-=1% bottom-=2%',
            trigger: '.first-',
            });
        }
    }
});
